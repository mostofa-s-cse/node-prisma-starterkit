import { Request, Response, NextFunction } from "express";
import * as authService from "../../services/v1/authService";
import {AppError} from "../../middlewares/errorHandler";

/**
 * Registers a new user.
 * - Accepts `email`, `password`, and `name` in the request body.
 * - Calls the authService to create a new user and sends an OTP to the user's email.
 * - Returns a success message upon successful registration.
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name } = req.body;
        const result = await authService.registerUser(email, password, name);
        res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Verifies the OTP sent to the user's email during registration.
 * - Accepts `email` and `otp` in the request body.
 * - Verifies the OTP and updates the user's email verification status.
 * - Returns a success message if the OTP is valid.
 */
export const verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp } = req.body;
        const result = await authService.verifyOtp(email, otp);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Resends a One-Time Password (OTP) to the user's email.
 * - Accepts `email` in the request body.
 * - Calls the authService to generate and send a new OTP to the provided email.
 * - Returns a success message if the OTP is successfully sent.
 * - Passes any encountered errors to the error-handling middleware.
 */

export const resendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const result = await authService.resendOtp(email);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Logs in the user.
 * - Accepts `email` and `password` in the request body.
 * - Authenticates the user, generates an access token and refresh token.
 * - Returns the tokens if authentication is successful.
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUser(email, password);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Refresh the access token using the refresh token.
 * - Verifies the refresh token and generates new access and refresh tokens.
 * - Returns the new tokens if successful.
 */
export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return next(new AppError("Refresh token is required", 400));
    }

    try {
        // Call the service to refresh the tokens
        const result = await authService.refreshTokens(refreshToken);

        // Send the response with the refreshed tokens
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error); // Pass any encountered errors to the error-handling middleware
    }
};

