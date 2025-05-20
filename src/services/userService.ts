import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import fs from 'fs';
import path from 'path';
import { logToFile } from '../utils/logger';

const prisma = new PrismaClient();

export const updateProfile = async (
  userId: string,
  data: {
    firstName?: string;
    lastName?: string;
    profileImage?: string;
  }
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      logToFile('userService', `Update failed: User not found (ID: ${userId})`);
      throw new AppError('User not found', 404);
    }

    if (data.profileImage && user.profileImage) {
      const oldImagePath = path.join(process.cwd(), user.profileImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        logToFile('userService', `Deleted old profile image for user ${userId}`);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        profileImage: data.profileImage,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    logToFile('userService', `Profile updated successfully for user ID: ${userId}`);
    return updatedUser;
  } catch (error: any) {
    logToFile('userService', `Update error for user ID: ${userId}`, error);
    throw error;
  }
};

export const getProfile = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      logToFile('userService', `Get profile failed: User not found (ID: ${userId})`);
      throw new AppError('User not found', 404);
    }

    logToFile('userService', `Profile retrieved for user ID: ${userId}`);
    return user;
  } catch (error: any) {
    logToFile('userService', `Get profile error for user ID: ${userId}`, error);
    throw error;
  }
}; 