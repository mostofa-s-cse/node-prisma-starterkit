import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

const errorLogger = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error({
        message: err.message,
        stack: err.stack,
        status: err.statusCode || 500,
        url: req.originalUrl,
        method: req.method,
        body: req.body,
    });

    next(err); // Pass the error to the next middleware (e.g., errorHandler)
};

export default errorLogger;
