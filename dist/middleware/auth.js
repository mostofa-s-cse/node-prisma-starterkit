"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("./errorHandler");
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const prisma = new client_1.PrismaClient();
const protect = async (req, _, next) => {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(new errorHandler_1.AppError('You are not logged in', 401));
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });
        if (!user) {
            return next(new errorHandler_1.AppError('User no longer exists', 401));
        }
        const hasValidToken = await prisma.refreshToken.findFirst({
            where: {
                userId: user.id,
                expiresAt: { gt: new Date() }
            }
        });
        if (!hasValidToken) {
            return next(new errorHandler_1.AppError('Session expired, please login again', 401));
        }
        req.user = user;
        (0, logger_1.logToFile)('auth', `User authenticated successfully (ID: ${decoded.id})`);
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return next(new errorHandler_1.AppError('Invalid token, please login again', 401));
        }
        next(error);
    }
};
exports.protect = protect;
const restrictTo = (...roles) => {
    return (req, _, next) => {
        if (!req.user) {
            return next(new errorHandler_1.AppError('User not authenticated', 401));
        }
        const userRoles = req.user.roles.map((role) => role.name);
        if (!roles.some(role => userRoles.includes(role))) {
            return next(new errorHandler_1.AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
//# sourceMappingURL=auth.js.map