import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../middleware/errorHandler';
import { sendEmail } from '../utils/email';
import { generateOTP } from '../utils/otp';
import { logToFile } from '../utils/logger';

const prisma = new PrismaClient();

const signTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export const registerUser = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  try {
    const { email, password, firstName, lastName } = userData;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      logToFile('authService', `Registration failed: Email already exists (${email})`);
      throw new AppError('Email already exists', 400);
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const hashedPassword = await bcrypt.hash(password, 4);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        otp,
        otpExpiry,
      },
    });

    logToFile('authService', `User registered successfully (ID: ${user.id})`);

    await sendEmail({
      email: user.email,
      subject: 'Email Verification',
      message: `Your verification code is: ${otp}`,
    });

    return {
      message: 'Registration successful. Please verify your email.',
    };
  } catch (error: any) {
    logToFile('authService', 'Registration error', error);
    throw error;
  }
};

export const verifyUserOTP = async (email: string, otp: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.isVerified) {
    throw new AppError('Email already verified', 400);
  }

  if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
    throw new AppError('Invalid or expired OTP', 400);
  }

  const { accessToken, refreshToken } = signTokens(user.id);

  // Update user verification status and refresh token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      otp: null,
      otpExpiry: null,
      refreshToken
    },
  });

  // Create refresh token record
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  return {
    message: 'Email verified successfully',
    accessToken,
    refreshToken,
  };
};

export const loginUser = async (email: string, password: string) => {
  try {
    // First check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
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
      logToFile('authService', `Login failed: Email not found (${email})`);
      throw new AppError('Email not found', 401);
    }

    // Then check password
    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      logToFile('authService', `Login failed: Invalid password for email ${email}`);
      throw new AppError('Incorrect password', 401);
    }

    if (!user.isVerified) {
      throw new AppError('Please verify your email first', 401);
    }

    const { accessToken, refreshToken } = signTokens(user.id);

    // Delete any existing refresh tokens for this user
    await prisma.refreshToken.deleteMany({
      where: { userId: user.id }
    });

    // Create new refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Update user's refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    logToFile('authService', `User logged in successfully (ID: ${user.id})`);
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
        permissions: user.permissions,
      },
      accessToken,
      refreshToken
    };
  } catch (error: any) {
    logToFile('authService', 'Login error', error);
    throw error;
  }
};

export const resendVerificationOTP = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.isVerified) {
    throw new AppError('Email already verified', 400);
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.user.update({
    where: { id: user.id },
    data: {
      otp,
      otpExpiry,
    },
  });

  await sendEmail({
    email: user.email,
    subject: 'Email Verification',
    message: `Your new verification code is: ${otp}`,
  });

  return {
    message: 'New OTP sent successfully',
  };
};

export const handleGoogleAuth = async (userData: {
  email: string;
  firstName: string;
  lastName: string;
  googleId: string;
}) => {
  const { email, firstName, lastName, googleId } = userData;

  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { googleId },
      ],
    },
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
    user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        googleId,
        isVerified: true,
      },
      include: {
        roles: {
          include: {
            permissions: true,
          },
        },
        permissions: true,
      },
    });
  } else if (!user.googleId) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { googleId },
      include: {
        roles: {
          include: {
            permissions: true,
          },
        },
        permissions: true,
      },
    });
  }

  const { accessToken, refreshToken } = signTokens(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      permissions: user.permissions,
    },
    accessToken,
    refreshToken,
  };
};

export const logout = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new AppError('Refresh token is required', 400);
  }

  const token = await prisma.refreshToken.findFirst({
    where: { token: refreshToken },
    include: { user: true }
  });

  if (!token) {
    throw new AppError('Invalid refresh token', 401);
  }

  // Delete all refresh tokens for this user
  await prisma.refreshToken.deleteMany({
    where: { userId: token.userId }
  });

  // Clear user's refresh token
  await prisma.user.update({
    where: { id: token.userId },
    data: { refreshToken: null }
  });

  return { 
    message: 'Logged out successfully',
    userId: token.userId 
  };
};

export const getAuthUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roles: user.roles,
    permissions: user.permissions,
  };
};

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.user.update({
    where: { id: user.id },
    data: {
      otp,
      otpExpiry,
    },
  });

  await sendEmail({
    email: user.email,
    subject: 'Password Reset',
    message: `Your password reset code is: ${otp}. This code will expire in 10 minutes.`,
  });

  return {
    message: 'Password reset code sent to your email',
  };
};

export const resetPassword = async (email: string, otp: string, newPassword: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
    throw new AppError('Invalid or expired OTP', 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 4);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      otp: null,
      otpExpiry: null,
    },
  });

  // Delete all refresh tokens for this user
  await prisma.refreshToken.deleteMany({
    where: { userId: user.id }
  });

  return {
    message: 'Password reset successful',
  };
};

