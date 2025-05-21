"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../../controllers/userController");
const auth_1 = require("../../middleware/auth");
const multer_1 = __importDefault(require("../../utils/multer"));
const router = express_1.default.Router();
router.use(auth_1.protect);
router.get('/search', userController_1.searchUsersController);
router.get('/', userController_1.getUsers);
router.post('/', multer_1.default.single('profileImage'), userController_1.createUserController);
router.route('/:id')
    .get(userController_1.getUser)
    .patch(multer_1.default.single('profileImage'), userController_1.updateUserController)
    .delete(userController_1.deleteUserController);
exports.default = router;
//# sourceMappingURL=users.js.map