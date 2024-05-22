import { UserRole } from "@prisma/client";

export type TUserRegistration = {
  name: string,
  email: string,
  password: string,
  role: UserRole,
  profile: {
    bio: string,
    age: number,
    profileImage?: string,
    address: string
  }
};

export type TUserLogin = {
  email: string,
  password: string
};

export type TUpdateProfile = {
  name: string,
  email: string,
  password: string,
  bio: string,
  age: number,
  address: string
}
