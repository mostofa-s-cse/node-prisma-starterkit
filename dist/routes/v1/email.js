"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const emailController_1 = require("../../controllers/emailController");
const auth_1 = require("../../middleware/auth");
const router = express_1.default.Router();
router.get('/queue-status', emailController_1.getEmailQueueStatus);
router.get('/', auth_1.protect, emailController_1.getAllQueueJobs);
router.get('/:jobId', auth_1.protect, emailController_1.getJobInfo);
exports.default = router;
//# sourceMappingURL=email.js.map