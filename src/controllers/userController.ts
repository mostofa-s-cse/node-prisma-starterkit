import { Request, Response, NextFunction } from 'express';
import { updateProfile, getProfile } from '../services/userService';
import { User } from '@prisma/client';
import { logToFile } from '../utils/logger';

export const updateProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as User;
    if (!user?.id) {
      logToFile('userController', 'Update profile failed: User not authenticated');
      throw new Error('User not authenticated');
    }

    const profileData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      profileImage: req.file ? `/uploads/profiles/${req.file.filename}` : undefined,
    };

    logToFile('userController', `Attempting to update profile for user ${user.id}`);
    const updatedUser = await updateProfile(user.id, profileData);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error: any) {
    logToFile('userController', 'Error in updateProfileController', error);
    next(error);
  }
};

export const getProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as User;
    if (!user?.id) {
      logToFile('userController', 'Get profile failed: User not authenticated');
      throw new Error('User not authenticated');
    }

    logToFile('userController', `Attempting to get profile for user ${user.id}`);
    const profile = await getProfile(user.id);

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: profile
    });
  } catch (error: any) {
    logToFile('userController', 'Error in getProfileController', error);
    next(error);
  }
}; 