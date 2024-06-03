import axios from "axios";
import { TPaymentInfo } from "../types/payment.type";
import config from "../config";

const store_id = config.SSLCOMMERZ.STORE_ID
const store_passwd = config.SSLCOMMERZ.STORE_PASSWD
const is_live = false //true for live, false for sandbox


const init = async (paymentInfo: TPaymentInfo) => {
  try {
    const data = {
      store_id,
      store_passwd,
      is_live,
      total_amount: paymentInfo.totalAmount,
      num_of_item: '',
      length_of_stay: '',
      currency: paymentInfo.currency || 'BDT',
      tran_id: paymentInfo.tranId,
      success_url: config.SSLCOMMERZ.SUCCESS_URL,
      fail_url: config.SSLCOMMERZ.FAIL_URL,
      cancel_url: config.SSLCOMMERZ.CANCEL_URL,
      product_name: paymentInfo.tripTitle,
      product_profile: 'travel-vertical',
      cus_name: paymentInfo.customerName,
      cus_email: paymentInfo.customerEmail,
      cus_add1: paymentInfo.customerAddress
    };

    const response = await axios({
      method: 'POST',
      url: config.SSLCOMMERZ.PAYMENT_INIT_URL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data,
    });

    return response.data;
  } catch (error) {
    throw new Error('Payment error')
  }
};

const validate = async (params: any) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${config.SSLCOMMERZ.VALIDATE_URL}?val_id=${params.val_id}&store_id=${store_id}&store_passwd=${store_passwd}&format=json`
    })
    return response.data
  } catch (error) {
    throw new Error('Validate error');
  }
}

export const Payment = { init, validate }; 