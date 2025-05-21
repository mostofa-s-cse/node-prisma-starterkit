"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const errorHandler_1 = require("./middleware/errorHandler");
const security_1 = require("./middleware/security");
const compression_1 = require("./middleware/compression");
const v1_1 = __importDefault(require("./routes/v1"));
const logger_1 = require("./utils/logger");
const app = (0, express_1.default)();
(0, security_1.configureSecurity)(app);
(0, compression_1.configureCompression)(app);
app.use(express_1.default.json({ limit: '10kb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' }));
app.use(passport_1.default.initialize());
app.use('/api/v1', v1_1.default);
app.use('/api/v1/auth/login', security_1.loginLimiter);
app.use('/api/v1/auth/register', security_1.loginLimiter);
app.use(errorHandler_1.errorHandler);
process.on('unhandledRejection', (err) => {
    (0, logger_1.logToFile)('app', 'Unhandled Rejection', err);
    process.exit(1);
});
process.on('uncaughtException', (err) => {
    (0, logger_1.logToFile)('app', 'Uncaught Exception', err);
    process.exit(1);
});
exports.default = app;
//# sourceMappingURL=app.js.map