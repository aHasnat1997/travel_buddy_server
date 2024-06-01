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
  }
}
