"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllQueueJobs = exports.getJobInfo = exports.getEmailQueueStatus = void 0;
const emailQueueService_1 = require("../services/emailQueueService");
const getEmailQueueStatus = async (_, res, next) => {
    try {
        const status = await (0, emailQueueService_1.getQueueStatus)();
        res.status(200).json({
            success: true,
            data: status
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getEmailQueueStatus = getEmailQueueStatus;
const getJobInfo = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const jobInfo = await (0, emailQueueService_1.getJobDetails)(jobId);
        res.status(200).json({
            success: true,
            data: jobInfo
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getJobInfo = getJobInfo;
const getAllQueueJobs = async (_, res, next) => {
    try {
        const jobs = await (0, emailQueueService_1.getAllJobs)();
        res.status(200).json({
            success: true,
            data: jobs
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllQueueJobs = getAllQueueJobs;
//# sourceMappingURL=emailController.js.map