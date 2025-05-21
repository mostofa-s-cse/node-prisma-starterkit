"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignPermissionsToRole = exports.deleteRole = exports.updateRole = exports.getRoleById = exports.getAllRoles = exports.createRole = void 0;
const client_1 = require("@prisma/client");
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../utils/logger");
const prisma = new client_1.PrismaClient();
const createRole = async (data) => {
    try {
        const { name, description, permissions = [] } = data;
        const existingRole = await prisma.role.findUnique({
            where: { name },
        });
        if (existingRole) {
            (0, logger_1.logToFile)('roleService', `Role creation failed: Name already exists (${name})`);
            throw new errorHandler_1.AppError('Role already exists', 400);
        }
        const role = await prisma.role.create({
            data: {
                name,
                description,
                permissions: permissions.length > 0 ? {
                    connect: permissions.map((id) => ({ id })),
                } : undefined,
            },
            include: {
                permissions: true,
            },
        });
        (0, logger_1.logToFile)('roleService', `Role created successfully (ID: ${role.id})`);
        return role;
    }
    catch (error) {
        (0, logger_1.logToFile)('roleService', 'Role creation error', error);
        throw error;
    }
};
exports.createRole = createRole;
const getAllRoles = async () => {
    try {
        const roles = await prisma.role.findMany({
            include: {
                permissions: true,
            },
        });
        (0, logger_1.logToFile)('roleService', `Retrieved ${roles.length} roles`);
        return roles;
    }
    catch (error) {
        (0, logger_1.logToFile)('roleService', 'Error retrieving roles', error);
        throw error;
    }
};
exports.getAllRoles = getAllRoles;
const getRoleById = async (id) => {
    const role = await prisma.role.findUnique({
        where: { id },
        include: {
            permissions: true,
        },
    });
    if (!role) {
        throw new errorHandler_1.AppError('Role not found', 404);
    }
    return role;
};
exports.getRoleById = getRoleById;
const updateRole = async (id, data) => {
    try {
        const { name, description, permissions } = data;
        const role = await prisma.role.findUnique({
            where: { id },
        });
        if (!role) {
            (0, logger_1.logToFile)('roleService', `Role update failed: Role not found (ID: ${id})`);
            throw new errorHandler_1.AppError('Role not found', 404);
        }
        if (name && name !== role.name) {
            const existingRole = await prisma.role.findUnique({
                where: { name },
            });
            if (existingRole) {
                throw new errorHandler_1.AppError('Role name already exists', 400);
            }
        }
        const updateData = {};
        if (name)
            updateData.name = name;
        if (description)
            updateData.description = description;
        if (permissions) {
            updateData.permissions = {
                set: permissions.map((id) => ({ id })),
            };
        }
        const updatedRole = await prisma.role.update({
            where: { id },
            data: updateData,
            include: {
                permissions: true,
            },
        });
        (0, logger_1.logToFile)('roleService', `Role updated successfully (ID: ${id})`);
        return updatedRole;
    }
    catch (error) {
        (0, logger_1.logToFile)('roleService', `Role update error for ID: ${id}`, error);
        throw error;
    }
};
exports.updateRole = updateRole;
const deleteRole = async (id) => {
    try {
        const role = await prisma.role.findUnique({
            where: { id },
        });
        if (!role) {
            (0, logger_1.logToFile)('roleService', `Role deletion failed: Role not found (ID: ${id})`);
            throw new errorHandler_1.AppError('Role not found', 404);
        }
        await prisma.role.delete({
            where: { id },
        });
        (0, logger_1.logToFile)('roleService', `Role deleted successfully (ID: ${id})`);
        return true;
    }
    catch (error) {
        (0, logger_1.logToFile)('roleService', 'Role deletion error', error);
        throw error;
    }
};
exports.deleteRole = deleteRole;
const assignPermissionsToRole = async (roleId, permissionIds) => {
    try {
        const role = await prisma.role.findUnique({
            where: { id: roleId },
            include: { permissions: true }
        });
        if (!role) {
            throw new errorHandler_1.AppError('Role not found', 404);
        }
        const updatedRole = await prisma.role.update({
            where: { id: roleId },
            data: {
                permissions: {
                    connect: permissionIds.map(id => ({ id }))
                }
            },
            include: {
                permissions: true
            }
        });
        (0, logger_1.logToFile)('roleService', `Permissions assigned to role ${roleId} successfully`);
        return updatedRole;
    }
    catch (error) {
        (0, logger_1.logToFile)('roleService', `Error assigning permissions to role ${roleId}`, error);
        throw error;
    }
};
exports.assignPermissionsToRole = assignPermissionsToRole;
//# sourceMappingURL=roleService.js.map