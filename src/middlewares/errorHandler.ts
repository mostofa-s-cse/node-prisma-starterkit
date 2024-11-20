import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log the error using logger
    logger.error({
        message: err.message,
        stack: err.stack,
        status: statusCode,
        url: req.originalUrl,
    });

    res.status(statusCode).json({
        error: true,
        message,
    });
};

export { AppError, errorHandler };
