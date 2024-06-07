import config from "../../config";
import prisma from "../../db";
import bcrypt from 'bcrypt';
import { TTokenPayload, Token } from "../../utils/token";
import { TUpdateProfile, TUserLogin, TUserRegistration } from "../../types/user.type";
import { Prisma, UserRole } from "@prisma/client";

/**
 * User registration service
 * @param payload user request data
 * @returns cerated data
 */
const registration = async (payload: TUserRegistration) => {
  const hashedPassword = await bcrypt.hash(payload.password, Number(config.BCRYPT_SALT_ROUNDS));

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.users.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        role: payload.role
      }
    });
    let profileData;

    if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) {
      profileData = await tx.adminProfiles.create({
        data: {
          userId: user.id,
          age: payload.profile.age,
          bio: payload.profile.bio,
          address: payload.profile.address,
          profileImage: payload.profile.profileImage
        }
      });
    };
    if (user.role === UserRole.USER) {
      profileData = await tx.userProfiles.create({
        data: {
          userId: user.id,
          age: payload.profile.age,
          bio: payload.profile.bio,
          address: payload.profile.address,
          profileImage: payload.profile.profileImage
        }
      });
    };

    return { user, profileData }
  });
  return {
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
    role: result.user.role
  };
};

/**
 * Finding all users data from DB
 * @param filters object contents with any fields for filtering 'name' or 'email' or 'role' fields  
 * @param options object contents page, limit, sortBy and sortOrder values
 * @returns all users data
 */
const getAllUser = async (
  filters: Record<string, unknown>,
  options: {
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: 'desc' | 'asc' | string
  }
) => {
  const conditions: Prisma.UsersWhereInput[] = [];
  const { name, email, role } = filters;

  const pageLimit = Number(options.limit) || 10;
  const pageNumber = Number(options.page) ? (Number(options.page) - 1) * pageLimit : 0;

  if (name) {
    conditions.push({
      name: {
        contains: String(name),
        mode: 'insensitive'
      }
    })
  }
  if (email) {
    conditions.push({
      email: {
        contains: String(email),
        mode: 'insensitive'
      }
    })
  }
  if (role) {
    const userRole = (role as string).toUpperCase();
    conditions.push({
      role: {
        equals: userRole as UserRole
      }
    })
  }

  const result = await prisma.users.findMany({
    take: pageLimit,
    skip: pageNumber,
    orderBy: options.sortBy && options.sortOrder ? {
      [options.sortBy]: options.sortOrder
    } : {
      createdAt: 'desc'
    },
    where: { AND: conditions },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      adminProfiles: true,
      userProfile: true
    }
  });
  const totalData = await prisma.users.count({ where: { AND: conditions } })

  return {
    meta: {
      page: options.page ? (pageNumber / pageLimit) + 1 : 1,
      limit: pageLimit,
      total: totalData
    },
    data: result
  };
}

/**
 * User login service
 * @param payload user login data
 * @returns refresh token and user data with accessToken
 */
const login = async (payload: TUserLogin) => {
  const isUserExisted = await prisma.users.findUnique({
    where: {
      email: payload.email
    },
    include: {
      userProfile: true,
      adminProfiles: true
    }
  });
  if (!isUserExisted) throw new Error('User not existed');

  const isPasswordMatch = await bcrypt.compare(payload.password, isUserExisted.password);
  if (!isPasswordMatch) throw new Error('Password not match');

  const userId = isUserExisted.adminProfiles ? isUserExisted.adminProfiles.id : isUserExisted.userProfile ? isUserExisted.userProfile.id : '';

  const tokenPayload: TTokenPayload = {
    id: userId,
    name: isUserExisted.name,
    role: isUserExisted.role
  };
  const accessToken = Token.sign(tokenPayload, config.TOKEN.ACCESS_TOKEN_SECRET, config.TOKEN.ACCESS_TOKEN_EXPIRES_TIME);
  const refreshToken = Token.sign(tokenPayload, config.TOKEN.REFRESH_TOKEN_SECRET, config.TOKEN.REFRESH_TOKEN_EXPIRES_TIME);

  return {
    refreshToken,
    data: {
      token: accessToken,
      user: {
        id: isUserExisted?.id,
        name: isUserExisted?.name,
        email: isUserExisted?.email,
        role: isUserExisted?.role
      }
    }
  };
};

/**
 * Get user profile
 * @param token user token
 * @returns user data
 */
const getUserProfile = async (token: string) => {
  if (!token) throw new Error('token not found');
  const isTokenMatch = Token.verify(token, config.TOKEN.ACCESS_TOKEN_SECRET) as TTokenPayload;
  if (!isTokenMatch) throw new Error('id not found');
  const id = isTokenMatch.id;
  const result = await prisma.users.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      userProfile: true,
      adminProfiles: true
    }
  });
  let userData = {};
  if (!result.adminProfiles) {
    userData = {
      id: result.id,
      name: result.name,
      email: result.email,
      userProfile: result.userProfile
    }
  }
  if (!result.userProfile) {
    userData = {
      id: result.id,
      name: result.name,
      email: result.email,
      adminProfiles: result.adminProfiles
    }
  }
  return userData;
}

/**
 * Update user profile date
 * @param payload contents user token and data need to update
 * @returns updated data
 */
const updateProfile = async (payload: { token: string, data: Partial<TUpdateProfile> }) => {
  const { token, data } = payload;
  const { email, name, age, bio, address } = data;
  if (!token) throw new Error('token not found');

  const isTokenMatch = Token.verify(token, config.TOKEN.ACCESS_TOKEN_SECRET) as TTokenPayload;
  if (!isTokenMatch) throw new Error('id not found');

  const id = isTokenMatch.id;
  const result = await prisma.$transaction(async (tx) => {
    let userData;
    if (email || name) {
      userData = await tx.users.update({
        where: { id },
        data: { email, name },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        }
      })
      await tx.userProfiles.update({
        where: { userId: id },
        data: { age, bio }
      })
    };
    if (age || bio) {
      userData = await tx.userProfiles.update({
        where: { userId: id },
        data
      })
    };
    return userData;
  });

  return result;
}

export const UserService = {
  registration,
  getAllUser,
  login,
  getUserProfile,
  updateProfile
};
