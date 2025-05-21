"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePermission = exports.updatePermission = exports.getPermissionById = exports.getAllPermissions = exports.createPermission = void 0;
const client_1 = require("@prisma/client");
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../utils/logger");
const prisma = new client_1.PrismaClient();
const createPermission = async (data) => {
    try {
        const existingPermission = await prisma.permission.findUnique({
            where: { name: data.name },
        });
        if (existingPermission) {
            (0, logger_1.logToFile)('permissionService', `Permission creation failed: Name already exists (${data.name})`);
            throw new errorHandler_1.AppError('Permission name already exists', 400);
        }
        const permission = await prisma.permission.create({
            data,
        });
        (0, logger_1.logToFile)('permissionService', `Permission created successfully (ID: ${permission.id})`);
        return permission;
    }
    catch (error) {
        (0, logger_1.logToFile)('permissionService', 'Permission creation error', error);
        throw error;
    }
};
exports.createPermission = createPermission;
const getAllPermissions = async () => {
    const permissions = await prisma.permission.findMany();
    return permissions;
};
exports.getAllPermissions = getAllPermissions;
const getPermissionById = async (id) => {
    const permission = await prisma.permission.findUnique({
        where: { id },
    });
    if (!permission) {
        throw new errorHandler_1.AppError('Permission not found', 404);
    }
    return permission;
};
exports.getPermissionById = getPermissionById;
const updatePermission = async (id, data) => {
    try {
        const permission = await prisma.permission.findUnique({
            where: { id },
        });
        if (!permission) {
            (0, logger_1.logToFile)('permissionService', `Permission update failed: Permission not found (ID: ${id})`);
            throw new errorHandler_1.AppError('Permission not found', 404);
        }
        const updatedPermission = await prisma.permission.update({
            where: { id },
            data,
        });
        (0, logger_1.logToFile)('permissionService', `Permission updated successfully (ID: ${id})`);
        return updatedPermission;
    }
    catch (error) {
        (0, logger_1.logToFile)('permissionService', 'Permission update error', error);
        throw error;
    }
};
exports.updatePermission = updatePermission;
const deletePermission = async (id) => {
    try {
        const permission = await prisma.permission.findUnique({
            where: { id },
        });
        if (!permission) {
            (0, logger_1.logToFile)('permissionService', `Permission deletion failed: Permission not found (ID: ${id})`);
            throw new errorHandler_1.AppError('Permission not found', 404);
        }
        await prisma.permission.delete({
            where: { id },
        });
        (0, logger_1.logToFile)('permissionService', `Permission deleted successfully (ID: ${id})`);
        return true;
    }
    catch (error) {
        (0, logger_1.logToFile)('permissionService', 'Permission deletion error', error);
        throw error;
    }
};
exports.deletePermission = deletePermission;
//# sourceMappingURL=permissionService.js.map