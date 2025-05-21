"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignPermissionsController = exports.deleteRoleController = exports.updateRoleController = exports.getRole = exports.getRoles = exports.createRoleController = void 0;
const roleService_1 = require("../services/roleService");
const errorHandler_1 = require("../middleware/errorHandler");
const createRoleController = async (req, res, next) => {
    try {
        const role = await (0, roleService_1.createRole)(req.body);
        res.status(201).json({
            success: true,
            message: 'Role created successfully',
            data: role
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createRoleController = createRoleController;
const getRoles = async (_, res, next) => {
    try {
        const roles = await (0, roleService_1.getAllRoles)();
        res.status(200).json({
            success: true,
            message: 'Roles retrieved successfully',
            data: roles
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getRoles = getRoles;
const getRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const role = await (0, roleService_1.getRoleById)(id);
        res.status(200).json({
            success: true,
            message: 'Role retrieved successfully',
            data: role
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getRole = getRole;
const updateRoleController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedRole = await (0, roleService_1.updateRole)(id, req.body);
        res.status(200).json({
            success: true,
            message: 'Role updated successfully',
            data: updatedRole
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateRoleController = updateRoleController;
const deleteRoleController = async (req, res, next) => {
    try {
        const { id } = req.params;
        await (0, roleService_1.deleteRole)(id);
        res.status(200).json({
            success: true,
            message: 'Role deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteRoleController = deleteRoleController;
const assignPermissionsController = async (req, res, next) => {
    try {
        const { roleId } = req.params;
        const { permissionIds } = req.body;
        if (!Array.isArray(permissionIds)) {
            throw new errorHandler_1.AppError('permissionIds must be an array', 400);
        }
        const updatedRole = await (0, roleService_1.assignPermissionsToRole)(roleId, permissionIds);
        res.status(200).json({
            success: true,
            message: 'Permissions assigned successfully',
            data: updatedRole
        });
    }
    catch (error) {
        next(error);
    }
};
exports.assignPermissionsController = assignPermissionsController;
//# sourceMappingURL=roleController.js.map