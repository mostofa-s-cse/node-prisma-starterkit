"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.getAuthUser = exports.logout = exports.handleGoogleAuth = exports.resendVerificationOTP = exports.loginUser = exports.verifyUserOTP = exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("../middleware/errorHandler");
const email_1 = require("../utils/email");
const otp_1 = require("../utils/otp");
const logger_1 = require("../utils/logger");
const prisma = new client_1.PrismaClient();
const signTokens = (userId) => {
    const accessToken = jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};
const registerUser = async (userData) => {
    try {
        const { email, password, firstName, lastName } = userData;
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            (0, logger_1.logToFile)('authService', `Registration failed: Email already exists (${email})`);
            throw new errorHandler_1.AppError('Email already exists', 400);
        }
        const otp = (0, otp_1.generateOTP)();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        const hashedPassword = await bcrypt_1.default.hash(password, 4);
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
        (0, logger_1.logToFile)('authService', `User registered successfully (ID: ${user.id})`);
        await (0, email_1.sendEmail)({
            email: user.email,
            subject: 'Email Verification',
            message: `Your verification code is: ${otp}`,
        });
        return {
            message: 'Registration successful. Please verify your email.',
        };
    }
    catch (error) {
        (0, logger_1.logToFile)('authService', 'Registration error', error);
        throw error;
    }
};
exports.registerUser = registerUser;
const verifyUserOTP = async (email, otp) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new errorHandler_1.AppError('User not found', 404);
    }
    if (user.isVerified) {
        throw new errorHandler_1.AppError('Email already verified', 400);
    }
    if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
        throw new errorHandler_1.AppError('Invalid or expired OTP', 400);
    }
    const { accessToken, refreshToken } = signTokens(user.id);
    await prisma.user.update({
        where: { id: user.id },
        data: {
            isVerified: true,
            otp: null,
            otpExpiry: null,
            refreshToken
        },
    });
    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });
    return {
        message: 'Email verified successfully',
        accessToken,
        refreshToken,
    };
};
exports.verifyUserOTP = verifyUserOTP;
const loginUser = async (email, password) => {
    try {
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
            (0, logger_1.logToFile)('authService', `Login failed: Email not found (${email})`);
            throw new errorHandler_1.AppError('Email not found', 401);
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            (0, logger_1.logToFile)('authService', `Login failed: Invalid password for email ${email}`);
            throw new errorHandler_1.AppError('Incorrect password', 401);
        }
        if (!user.isVerified) {
            throw new errorHandler_1.AppError('Please verify your email first', 401);
        }
        const { accessToken, refreshToken } = signTokens(user.id);
        await prisma.refreshToken.deleteMany({
            where: { userId: user.id }
        });
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        });
        (0, logger_1.logToFile)('authService', `User logged in successfully (ID: ${user.id})`);
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
    }
    catch (error) {
        (0, logger_1.logToFile)('authService', 'Login error', error);
        throw error;
    }
};
exports.loginUser = loginUser;
const resendVerificationOTP = async (email) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new errorHandler_1.AppError('User not found', 404);
    }
    if (user.isVerified) {
        throw new errorHandler_1.AppError('Email already verified', 400);
    }
    const otp = (0, otp_1.generateOTP)();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await prisma.user.update({
        where: { id: user.id },
        data: {
            otp,
            otpExpiry,
        },
    });
    await (0, email_1.sendEmail)({
        email: user.email,
        subject: 'Email Verification',
        message: `Your new verification code is: ${otp}`,
    });
    return {
        message: 'New OTP sent successfully',
    };
};
exports.resendVerificationOTP = resendVerificationOTP;
const handleGoogleAuth = async (userData) => {
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
    }
    else if (!user.googleId) {
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
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
exports.handleGoogleAuth = handleGoogleAuth;
const logout = async (refreshToken) => {
    if (!refreshToken) {
        throw new errorHandler_1.AppError('Refresh token is required', 400);
    }
    const token = await prisma.refreshToken.findFirst({
        where: { token: refreshToken },
        include: { user: true }
    });
    if (!token) {
        throw new errorHandler_1.AppError('Invalid refresh token', 401);
    }
    await prisma.refreshToken.deleteMany({
        where: { userId: token.userId }
    });
    await prisma.user.update({
        where: { id: token.userId },
        data: { refreshToken: null }
    });
    return {
        message: 'Logged out successfully',
        userId: token.userId
    };
};
exports.logout = logout;
const getAuthUser = async (userId) => {
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
        throw new errorHandler_1.AppError('User not found', 404);
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
exports.getAuthUser = getAuthUser;
const forgotPassword = async (email) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new errorHandler_1.AppError('User not found', 404);
    }
    const otp = (0, otp_1.generateOTP)();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await prisma.user.update({
        where: { id: user.id },
        data: {
            otp,
            otpExpiry,
        },
    });
    await (0, email_1.sendEmail)({
        email: user.email,
        subject: 'Password Reset',
        message: `Your password reset code is: ${otp}. This code will expire in 10 minutes.`,
    });
    return {
        message: 'Password reset code sent to your email',
    };
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (email, otp, newPassword) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new errorHandler_1.AppError('User not found', 404);
    }
    if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
        throw new errorHandler_1.AppError('Invalid or expired OTP', 400);
    }
    const hashedPassword = await bcrypt_1.default.hash(newPassword, 4);
    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            otp: null,
            otpExpiry: null,
        },
    });
    await prisma.refreshToken.deleteMany({
        where: { userId: user.id }
    });
    return {
        message: 'Password reset successful',
    };
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=authService.js.map