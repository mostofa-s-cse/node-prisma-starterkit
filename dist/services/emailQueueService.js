"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllJobs = exports.getJobDetails = exports.getQueueStatus = exports.addToEmailQueue = exports.emailQueue = void 0;
const bull_1 = __importDefault(require("bull"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = require("../utils/logger");
exports.emailQueue = new bull_1.default('email-queue', {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
    },
});
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
exports.emailQueue.process(async (job) => {
    const { email, subject, message } = job.data;
    try {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject,
            text: message,
        };
        await transporter.sendMail(mailOptions);
        (0, logger_1.logToFile)('emailQueue', `Email sent successfully to ${email}`);
        return { success: true };
    }
    catch (error) {
        (0, logger_1.logToFile)('emailQueue', `Failed to send email to ${email}`, error);
        throw error;
    }
});
exports.emailQueue.on('completed', (job) => {
    (0, logger_1.logToFile)('emailQueue', `Job ${job.id} completed for ${job.data.email}`);
});
exports.emailQueue.on('failed', (job, error) => {
    (0, logger_1.logToFile)('emailQueue', `Job ${job === null || job === void 0 ? void 0 : job.id} failed for ${job === null || job === void 0 ? void 0 : job.data.email}`, error);
});
const addToEmailQueue = async (emailData) => {
    try {
        const job = await exports.emailQueue.add(emailData, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
        });
        (0, logger_1.logToFile)('emailQueue', `Email job ${job.id} added to queue for ${emailData.email}`);
        return job;
    }
    catch (error) {
        (0, logger_1.logToFile)('emailQueue', `Failed to add email job to queue for ${emailData.email}`, error);
        throw error;
    }
};
exports.addToEmailQueue = addToEmailQueue;
const getQueueStatus = async () => {
    try {
        const [waiting, active, completed, failed] = await Promise.all([
            exports.emailQueue.getWaitingCount(),
            exports.emailQueue.getActiveCount(),
            exports.emailQueue.getCompletedCount(),
            exports.emailQueue.getFailedCount(),
        ]);
        return { waiting, active, completed, failed };
    }
    catch (error) {
        (0, logger_1.logToFile)('emailQueue', 'Error getting queue status', error);
        throw error;
    }
};
exports.getQueueStatus = getQueueStatus;
const getJobDetails = async (jobId) => {
    try {
        const job = await exports.emailQueue.getJob(jobId);
        if (!job)
            throw new Error('Job not found');
        return {
            id: job.id,
            data: job.data,
            status: await job.getState(),
            attemptsMade: job.attemptsMade,
            timestamp: job.timestamp,
            processedOn: job.processedOn,
            finishedOn: job.finishedOn,
            failedReason: job.failedReason
        };
    }
    catch (error) {
        (0, logger_1.logToFile)('emailQueue', `Error getting job details for ${jobId}`, error);
        throw error;
    }
};
exports.getJobDetails = getJobDetails;
const getAllJobs = async () => {
    try {
        const [waiting, active, completed, failed] = await Promise.all([
            exports.emailQueue.getWaiting(),
            exports.emailQueue.getActive(),
            exports.emailQueue.getCompleted(),
            exports.emailQueue.getFailed()
        ]);
        return { waiting, active, completed, failed };
    }
    catch (error) {
        (0, logger_1.logToFile)('emailQueue', 'Error getting all jobs', error);
        throw error;
    }
};
exports.getAllJobs = getAllJobs;
//# sourceMappingURL=emailQueueService.js.map