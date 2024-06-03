import dotenv from "dotenv";

dotenv.config();

export default {
  PORT: process.env.PORT,
  CLINT_URL: process.env.CLINT_URL,
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS as string,
  SUPER_ADMIN: {
    EMAIL: process.env.SUPER_ADMIN_EMAIL,
    PASS: process.env.SUPER_ADMIN_PASS,
  },
  TOKEN: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
    ACCESS_TOKEN_EXPIRES_TIME: process.env.ACCESS_TOKEN_EXPIRES_TIME as string,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
    REFRESH_TOKEN_EXPIRES_TIME: process.env.REFRESH_TOKEN_EXPIRES_TIME as string,
    FORGOT_TOKEN_SECRET: process.env.FORGOT_TOKEN_SECRET as string,
    FORGOT_TOKEN_EXPIRES_TIME: process.env.FORGOT_TOKEN_EXPIRES_TIME as string
  },
  SSLCOMMERZ: {
    STORE_ID: process.env.STORE_ID,
    STORE_PASSWD: process.env.STORE_PASSWD,
    SUCCESS_URL: process.env.SUCCESS_URL,
    FAIL_URL: process.env.FAIL_URL,
    CANCEL_URL: process.env.CANCEL_URL,
    PAYMENT_INIT_URL: process.env.PAYMENT_INIT_URL,
    VALIDATE_URL: process.env.VALIDATE_URL,
  }
}
