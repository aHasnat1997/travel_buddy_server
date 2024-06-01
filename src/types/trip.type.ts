export type TTrip = {
  userId: string,
  tripTitle: string,
  tripImage: string[]
  tripDetails: string,
  startingPoint: string,
  destination: string,
  startDate: Date,
  endDate: Date,
  budget: number,
  activities: string[],
  totalBooked: number,
  totalSlots: number,
};
