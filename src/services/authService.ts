import prisma from "../config/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../middlewares/errorHandler";
import {sendEmail} from "../utils/email";

/**
 * Register a new user.
 * - Hashes the password.
 * - Saves the user to the database.
 * - Sends an OTP for email verification.
 */
export const registerUser = async (email: string, password: string, name: string) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new AppError("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { email, password: hashedPassword, name },
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate OTP
    // Pass the name to the sendEmail function to personalize the email
    await sendEmail(email, "Verify Your Email", name, otp); // Provide name here
    await prisma.user.update({ where: { id: user.id }, data: { otp } });

    return { message: "User registered successfully. Please verify your email." };
};


/**
 * Verify the user's email using OTP.
 * - Checks if the OTP matches.
 * - Marks the email as verified.
 */
export const verifyOtp = async (email: string, otp: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new AppError("User not found", 404);
    }
    if (user.otp !== otp) {
        throw new AppError("Invalid OTP", 400);
    }

    await prisma.user.update({
        where: { email },
        data: { emailVerified: true, otp: null },
    });

    return { message: "Email verified successfully." };
};

/**
 * Resend OTP for email verification.
 * - Generates a new OTP and sends it via email.
 */
export const resendOtp = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new AppError("User not found", 404);
    }
    if (user.emailVerified) {
        throw new AppError("Email is already verified", 400);
    }

    if (!user.name) {
        throw new AppError("User name is missing", 400);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate new OTP

    // Pass the user's name along with the OTP to the sendEmail function
    await sendEmail(email, "Verify Your Email", user.name, otp);

    await prisma.user.update({ where: { email }, data: { otp } });

    return { message: "OTP sent successfully. Please check your email." };
};



/**
 * Login a user.
 * - Verifies credentials.
 * - Generates access and refresh tokens.
 */
export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }
    if (!user.emailVerified) {
        throw new AppError("Email not verified", 403);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError("Invalid email or password", 401);
    }

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

    await prisma.user.update({ where: { id: user.id }, data: { refreshToken, } });

    return { user, accessToken, refreshToken };
};

/**
 * Refresh the access token.
 * - Verifies the refresh token.
 * - Generates a new access token and refresh token if valid.
 * - Returns the new tokens.
 */
export const refreshTokens = async (refreshToken: string) => {
    const decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
    const userId = decoded.id;

    // Retrieve the user from the database
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.refreshToken !== refreshToken) {
        throw new AppError("Invalid refresh token", 401);
    }

    // Generate new access and refresh tokens
    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "15m" });
    const newRefreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

    // Update the refresh token in the database
    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
    });

    return { accessToken, refreshToken: newRefreshToken };
};