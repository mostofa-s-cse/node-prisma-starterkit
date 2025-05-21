"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.getAuthUser = exports.logout = exports.googleAuth = exports.resendOTP = exports.login = exports.verifyOTP = exports.register = void 0;
const authService_1 = require("../services/authService");
const errorHandler_1 = require("../middleware/errorHandler");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const register = async (req, res, next) => {
    try {
        const result = await (0, authService_1.registerUser)(req.body);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const result = await (0, authService_1.verifyUserOTP)(email, otp);
        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            data: {
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.verifyOTP = verifyOTP;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new errorHandler_1.AppError('Email and password are required', 400);
        }
        const result = await (0, authService_1.loginUser)(email, password);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result
        });
    }
    catch (error) {
        if (error.message === 'Email not found') {
            res.status(401).json({
                success: false,
                message: 'Email not found',
                error: 'Email not found'
            });
        }
        else if (error.message === 'Incorrect password') {
            res.status(401).json({
                success: false,
                message: 'Incorrect password',
                error: 'Incorrect password'
            });
        }
        else {
            next(error);
        }
    }
};
exports.login = login;
const resendOTP = async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await (0, authService_1.resendVerificationOTP)(email);
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
exports.resendOTP = resendOTP;
const googleAuth = async (req, res, next) => {
    var _a, _b, _c, _d;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.email) || !((_b = req.user) === null || _b === void 0 ? void 0 : _b.firstName) || !((_c = req.user) === null || _c === void 0 ? void 0 : _c.lastName) || !((_d = req.user) === null || _d === void 0 ? void 0 : _d.googleId)) {
            throw new Error('Incomplete user data from Google');
        }
        const result = await (0, authService_1.handleGoogleAuth)({
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
    }
    catch (error) {
        next(error);
    }
};
exports.googleAuth = googleAuth;
const logout = async (req, res, next) => {
    try {
        const refreshToken = req.body.refreshToken || req.headers['x-refresh-token'];
        if (!refreshToken) {
            throw new errorHandler_1.AppError('Refresh token is required', 400);
        }
        const result = await (0, authService_1.logout)(refreshToken);
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
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
const getAuthUser = async (req, res, next) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            throw new errorHandler_1.AppError('User not authenticated', 401);
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
            throw new errorHandler_1.AppError('User not found', 404);
        }
        const hasValidToken = await prisma.refreshToken.findFirst({
            where: {
                userId: user.id,
                expiresAt: { gt: new Date() }
            }
        });
        if (!hasValidToken) {
            throw new errorHandler_1.AppError('Session expired, please login again', 401);
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
    }
    catch (error) {
        next(error);
    }
};
exports.getAuthUser = getAuthUser;
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await (0, authService_1.forgotPassword)(email);
        res.status(200).json({
            success: true,
            message: 'Password reset code sent successfully',
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;
        const result = await (0, authService_1.resetPassword)(email, otp, newPassword);
        res.status(200).json({
            success: true,
            message: 'Password reset successful',
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=authController.js.map