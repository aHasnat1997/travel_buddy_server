import { PaymentStatus, TripBookingstatus } from "@prisma/client";
import prisma from "../../db";
import { TTokenPayload, Token } from "../../utils/token";
import { TTripBooking } from "../../types/trip.type";
import config from "../../config";
import { Payment } from "../../utils/paymentGateway";
import { v4 as uuid } from "uuid";

/**
 * book a trip
 * @param payload token, tripId and booking info 
 * @returns trip request data
 */
const bookTrip = async (token: string, tripId: string, bookingInfo: TTripBooking) => {
  const isTokenMatch = Token.verify(token, config.TOKEN.ACCESS_TOKEN_SECRET) as TTokenPayload;
  if (!isTokenMatch) throw new Error('not valid token');

  const isTripIdExcited = await prisma.trips.findUnique({ where: { id: tripId } });
  if (!isTripIdExcited) throw new Error('no trip found');
  if (isTripIdExcited.totalSlots === isTripIdExcited.totalBooked) throw new Error('All slots are booked');
  if ((isTripIdExcited.totalSlots - isTripIdExcited.totalBooked) < bookingInfo.slotsForBook) {
    throw new Error(`Only ${isTripIdExcited.totalSlots - isTripIdExcited.totalBooked > 0 ? isTripIdExcited.totalSlots - isTripIdExcited.totalBooked : 0} slots left`);
  }

  const isUserIdExcited = await prisma.userProfiles.findUnique({
    where: { id: isTokenMatch.id },
    include: { users: true }
  });
  if (!isUserIdExcited) throw new Error('no user found');

  const tranId = `TB-${uuid()}`
  const paymentInit = await Payment.init({
    tranId,
    tripTitle: isTripIdExcited.tripTitle,
    totalAmount: bookingInfo.totalAmount,
    customerName: isUserIdExcited.users.name,
    customerEmail: isUserIdExcited.users.email,
    customerAddress: isUserIdExcited.address
  });
  if (paymentInit.status !== 'SUCCESS') throw new Error(paymentInit.failedreason);

  await prisma.$transaction(async (tx) => {
    const booking = await tx.tripBookings.create({
      data: {
        tripId,
        userId: isTokenMatch.id,
        slotsForBook: bookingInfo.slotsForBook,
        totalAmount: bookingInfo.totalAmount
      }
    });
    await tx.payment.create({
      data: {
        transactionId: tranId,
        bookingId: booking.id,
        amount: bookingInfo.totalAmount
      }
    })
  })

  return {
    redirectingURL: paymentInit.GatewayPageURL
  };
};

/**
 * Verify payment
 * @param payload sslcommerz ipn queries
 * @returns confirm message
 */
const verifyPayment = async (payload: any) => {
  /**
   * update after deploy
   */

  // if (!payload || !payload?.status || payload?.status !== 'VALID') {
  //   throw new Error('Invalid params!')
  // };

  // const verifiedPayment = await Payment.validate(payload);
  // if (verifiedPayment?.status !== 'VALID') {
  //   throw new Error('Invalid Payment!')
  // }

  // const { tran_id } = verifiedPayment;
  const { tran_id } = payload;

  await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.update({
      where: { transactionId: tran_id, status: PaymentStatus.UNPAID },
      data: {
        status: PaymentStatus.PAID,
        // paymentGatewayData: verifiedPayment
        paymentGatewayData: payload
      }
    });

    const booking = await tx.tripBookings.update({
      where: { id: payment.bookingId, status: TripBookingstatus.PENDING },
      data: {
        status: TripBookingstatus.APPROVED
      }
    });

    const tripTotalBooked = await tx.trips.findUniqueOrThrow({
      where: { id: booking.tripId }
    })

    await tx.trips.update({
      where: { id: booking.tripId },
      data: {
        totalBooked: tripTotalBooked?.totalBooked + booking.slotsForBook
      }
    });
  });

  return {
    message: 'Payment done. Your booking is confirm.'
  }
}

/**
 * get single trip all request
 * @param token user access token
 * @param tripId trip id
 * @returns trip all request
 */
const getSingleTripBooking = async (tripId: string) => {
  const result = await prisma.tripBookings.findMany({
    where: {
      tripId
    },
    include: {
      trip: true,
      user: {
        include: {
          users: {
            select: {
              name: true,
              email: true,
            }
          }
        }
      }
    }
  });
  return result;
};

/**
 * update request trip status
 * @param requestId RequestModels id
 * @param status "PENDING" | "APPROVED" | "REJECTED"
 * @returns update data
 */
const updateBookingStatus = async (requestId: string, status: TripBookingstatus) => {
  const result = await prisma.tripBookings.update({
    where: { id: requestId },
    data: { status }
  });
  return result;
};

export const BookingService = {
  bookTrip,
  verifyPayment,
  getSingleTripBooking,
  updateBookingStatus
};