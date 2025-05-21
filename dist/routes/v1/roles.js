"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roleController_1 = require("../../controllers/roleController");
const auth_1 = require("../../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.route('/')
    .post(roleController_1.createRoleController)
    .get(roleController_1.getRoles);
router.route('/:id')
    .get(roleController_1.getRole)
    .patch(roleController_1.updateRoleController)
    .delete(roleController_1.deleteRoleController);
router.post('/:roleId/permissions', roleController_1.assignPermissionsController);
exports.default = router;
//# sourceMappingURL=roles.js.map