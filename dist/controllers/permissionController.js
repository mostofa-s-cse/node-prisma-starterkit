"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePermissionController = exports.updatePermissionController = exports.getPermission = exports.getPermissions = exports.createPermissionController = void 0;
const permissionService_1 = require("../services/permissionService");
const createPermissionController = async (req, res, next) => {
    try {
        const permission = await (0, permissionService_1.createPermission)(req.body);
        res.status(201).json({
            success: true,
            message: 'Permission created successfully',
            data: permission
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createPermissionController = createPermissionController;
const getPermissions = async (_, res, next) => {
    try {
        const permissions = await (0, permissionService_1.getAllPermissions)();
        res.status(200).json({
            success: true,
            message: 'Permissions retrieved successfully',
            data: permissions
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getPermissions = getPermissions;
const getPermission = async (req, res, next) => {
    try {
        const { id } = req.params;
        const permission = await (0, permissionService_1.getPermissionById)(id);
        res.status(200).json({
            success: true,
            message: 'Permission retrieved successfully',
            data: permission
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getPermission = getPermission;
const updatePermissionController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedPermission = await (0, permissionService_1.updatePermission)(id, req.body);
        res.status(200).json({
            success: true,
            message: 'Permission updated successfully',
            data: updatedPermission
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updatePermissionController = updatePermissionController;
const deletePermissionController = async (req, res, next) => {
    try {
        const { id } = req.params;
        await (0, permissionService_1.deletePermission)(id);
        res.status(200).json({
            success: true,
            message: 'Permission deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deletePermissionController = deletePermissionController;
//# sourceMappingURL=permissionController.js.map