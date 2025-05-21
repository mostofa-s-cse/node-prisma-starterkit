"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const logger_1 = require("../utils/logger");
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (err, _, res, __) => {
    if (err instanceof AppError) {
        (0, logger_1.logToFile)('errorHandler', `Operational Error: ${err.message}`, err);
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            status: err.status
        });
    }
    (0, logger_1.logToFile)('errorHandler', 'Unexpected Error', err);
    return res.status(500).json({
        success: false,
        message: 'Something went wrong',
        status: 'error'
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map