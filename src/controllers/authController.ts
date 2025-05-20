import { Request, Response, NextFunction } from 'express';
import {
  registerUser,
  verifyUserOTP,
  loginUser,
  resendVerificationOTP,
  handleGoogleAuth,
  logout as logoutUser,
  forgotPassword as forgotPasswordService,
  resetPassword as resetPasswordService,
} from '../services/authService';
import { AppError } from '../middleware/errorHandler';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PassportUser {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  googleId?: string;
}

interface RequestWithUser extends Request {
  user?: PassportUser;
}

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;
    const result = await verifyUserOTP(email, otp);
    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const result = await loginUser(email, password);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error: any) {
    if (error.message === 'Email not found') {
      res.status(401).json({
        success: false,
        message: 'Email not found',
        error: 'Email not found'
      });
    } else if (error.message === 'Incorrect password') {
      res.status(401).json({
        success: false,
        message: 'Incorrect password',
        error: 'Incorrect password'
      });
    } else {
      next(error);
    }
  }
};

export const resendOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const result = await resendVerificationOTP(email);
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.email || !req.user?.firstName || !req.user?.lastName || !req.user?.googleId) {
      throw new Error('Incomplete user data from Google');
    }
    const result = await handleGoogleAuth({
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      googleId: req.user.googleId,
    });
    res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.body.refreshToken || req.headers['x-refresh-token'];

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    const result = await logoutUser(refreshToken);

    // Clear cookies if they exist
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({
      success: true,
      message: 'Logout successful',
      data: {
        message: result.message,
        userId: result.userId
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAuthUser = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      throw new AppError('User not authenticated', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        roles: {
          include: {
            permissions: true,
          },
        },
        permissions: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check if user has any valid refresh tokens
    const hasValidToken = await prisma.refreshToken.findFirst({
      where: { 
        userId: user.id,
        expiresAt: { gt: new Date() }
      }
    });

    if (!hasValidToken) {
      throw new AppError('Session expired, please login again', 401);
    }

    res.status(200).json({
      success: true,
      message: 'Auth user fetched successfully',
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified,
        roles: user.roles.map(role => ({
          id: role.id,
          name: role.name,
          permissions: role.permissions
        })),
        permissions: user.permissions
      }
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const result = await forgotPasswordService(email);
    res.status(200).json({
      success: true,
      message: 'Password reset code sent successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, newPassword } = req.body;
    const result = await resetPasswordService(email, otp, newPassword);
    res.status(200).json({
      success: true,
      message: 'Password reset successful',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

