"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logToFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logDir = path_1.default.join(process.cwd(), 'logs');
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir, { recursive: true });
}
const logToFile = (service, message, error) => {
    const timestamp = new Date().toISOString();
    const logFilePath = path_1.default.join(logDir, `${service}.log`);
    const logMessage = `[${timestamp}] ${message}${error ? ` - Error: ${error.message}` : ''}\n`;
    fs_1.default.appendFileSync(logFilePath, logMessage);
};
exports.logToFile = logToFile;
//# sourceMappingURL=logger.js.map