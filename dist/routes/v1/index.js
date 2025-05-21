"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./auth"));
const roles_1 = __importDefault(require("./roles"));
const permissions_1 = __importDefault(require("./permissions"));
const email_1 = __importDefault(require("./email"));
const users_1 = __importDefault(require("./users"));
const router = express_1.default.Router();
router.use('/auth', auth_1.default);
router.use('/users', users_1.default);
router.use('/roles', roles_1.default);
router.use('/permissions', permissions_1.default);
router.use('/queue-jobs', email_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map