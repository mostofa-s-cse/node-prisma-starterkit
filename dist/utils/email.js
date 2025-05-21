"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const emailQueueService_1 = require("../services/emailQueueService");
const sendEmail = async (options) => {
    try {
        await (0, emailQueueService_1.addToEmailQueue)(options);
    }
    catch (error) {
        console.error('Failed to queue email:', error);
        throw error;
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=email.js.map