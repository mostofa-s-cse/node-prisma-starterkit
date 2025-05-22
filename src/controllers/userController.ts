import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  createUser,
  getUserById,
  searchUsers,
  updateUser,
  deleteUser,
  getAllUsers,
} from '../services/userService';
import { AppError } from '../middleware/errorHandler';
import { simplePaginate } from '../utils/pagination';

const prisma = new PrismaClient();

export const createUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Create user data object
    const userData = {
      ...req.body,
      profileImage: req.file ? `/uploads/profiles/${req.file.filename}` : null
    };

    const user = await createUser(userData);
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getAllUsers(req);
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const searchUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!query) {
      throw new AppError('Search query is required', 400);
    }

    const result = await searchUsers(query as string, page, limit);
    res.status(200).json({
      success: true,
      message: 'Users search completed',
      ...result
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Handle file upload if present
    if (req.file) {
      updateData.profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    const updatedUser = await updateUser(id, updateData);
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await deleteUser(id);
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}; 