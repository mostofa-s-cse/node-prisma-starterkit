"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const permissionController_1 = require("../../controllers/permissionController");
const auth_1 = require("../../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.route('/')
    .post(permissionController_1.createPermissionController)
    .get(permissionController_1.getPermissions);
router.route('/:id')
    .get(permissionController_1.getPermission)
    .patch(permissionController_1.updatePermissionController)
    .delete(permissionController_1.deletePermissionController);
exports.default = router;
//# sourceMappingURL=permissions.js.map