"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserController = exports.updateUserController = exports.searchUsersController = exports.getUser = exports.getUsers = exports.createUserController = void 0;
const userService_1 = require("../services/userService");
const errorHandler_1 = require("../middleware/errorHandler");
const createUserController = async (req, res, next) => {
    try {
        const userData = {
            ...req.body,
            profileImage: req.file ? `/uploads/profiles/${req.file.filename}` : null
        };
        const user = await (0, userService_1.createUser)(userData);
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: user
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createUserController = createUserController;
const getUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await (0, userService_1.getAllUsers)(page, limit);
        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            ...result
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getUsers = getUsers;
const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await (0, userService_1.getUserById)(id);
        res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            data: user
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getUser = getUser;
const searchUsersController = async (req, res, next) => {
    try {
        const { query } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        if (!query) {
            throw new errorHandler_1.AppError('Search query is required', 400);
        }
        const result = await (0, userService_1.searchUsers)(query, page, limit);
        res.status(200).json({
            success: true,
            message: 'Users search completed',
            ...result
        });
    }
    catch (error) {
        next(error);
    }
};
exports.searchUsersController = searchUsersController;
const updateUserController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        if (req.file) {
            updateData.profileImage = `/uploads/profiles/${req.file.filename}`;
        }
        const updatedUser = await (0, userService_1.updateUser)(id, updateData);
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateUserController = updateUserController;
const deleteUserController = async (req, res, next) => {
    try {
        const { id } = req.params;
        await (0, userService_1.deleteUser)(id);
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUserController = deleteUserController;
//# sourceMappingURL=userController.js.map