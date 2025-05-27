import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import fs from 'fs';
import path from 'path';
import { logToFile } from '../utils/logger';
import bcrypt from 'bcryptjs';
import { Request } from 'express';
import { simplePaginate } from '../utils/pagination';
import { User } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId?: string;
  profileImage?: string | null;
}) => {
  try {
    const { email, password, firstName, lastName, roleId, profileImage } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('Email already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        profileImage: profileImage || null,
        roles: roleId ? {
          connect: { id: roleId }
        } : undefined
      },
      include: {
        roles: {
          include: {
            permissions: true
          }
        }
      }
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    logToFile('userService', 'Error creating user', error);
    throw error;
  }
};

export const getAllUsers = async (req: Request) => {
  try {
    const result = await simplePaginate<User>(prisma.user, req, {
      perPage: 10,
      include: {
        roles: {
          include: {
            permissions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return {
      ...result,
      data: result.data
    };
  } catch (error) {
    logToFile('userService', 'Error getting users', error);
    throw error;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            permissions: true
          }
        }
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    logToFile('userService', `Error getting user ${id}`, error);
    throw error;
  }
};

export const searchUsers = async (query: string, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: {email: { contains: query },
          OR: [
            { firstName: { contains: query } },
            { lastName: { contains: query } }
          ]
        },
        skip,
        take: limit,
        include: {
          roles: {
            include: {
              permissions: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.user.count({
        where: {
          OR: [
            { email: { contains: query } },
            { firstName: { contains: query } },
            { lastName: { contains: query } }
          ]
        }
      })
    ]);

    const usersWithoutPasswords = users.map(({ password, ...user }) => user);

    return {
      users: usersWithoutPasswords,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    logToFile('userService', 'Error searching users', error);
    throw error;
  }
};

export const updateUser = async (
  id: string,
  data: {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    roleId?: string;
    profileImage?: string;
  }
) => {
  try {
    const { email, password, firstName, lastName, roleId, profileImage } = data;

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      if (existingUser) {
        throw new AppError('Email already exists', 400);
      }
    }

    // Delete old profile image if exists and new image is being uploaded
    if (profileImage && user.profileImage) {
      const oldImagePath = path.join(process.cwd(), user.profileImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const updateData: any = {};
    if (email) updateData.email = email;
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }
    if (roleId) {
      updateData.roles = {
        connect: { id: roleId }
      };
    }
    if (profileImage) {
      updateData.profileImage = profileImage;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        roles: {
          include: {
            permissions: true
          }
        }
      }
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  } catch (error) {
    logToFile('userService', `Error updating user ${id}`, error);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await prisma.user.delete({
      where: { id }
    });

    return true;
  } catch (error) {
    logToFile('userService', `Error deleting user ${id}`, error);
    throw error;
  }
}; 