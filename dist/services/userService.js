"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.searchUsers = exports.getUserById = exports.getAllUsers = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const errorHandler_1 = require("../middleware/errorHandler");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../utils/logger");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
const createUser = async (data) => {
    try {
        const { email, password, firstName, lastName, roleId, profileImage } = data;
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new errorHandler_1.AppError('Email already exists', 400);
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                profileImage: profileImage || null,
                roles: roleId ? {
                    connect: { id: roleId }
                } : undefined
            },
            include: {
                roles: {
                    include: {
                        permissions: true
                    }
                }
            }
        });
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    catch (error) {
        (0, logger_1.logToFile)('userService', 'Error creating user', error);
        throw error;
    }
};
exports.createUser = createUser;
const getAllUsers = async (page = 1, limit = 10) => {
    try {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                skip,
                take: limit,
                include: {
                    roles: {
                        include: {
                            permissions: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.user.count()
        ]);
        const usersWithoutPasswords = users.map(({ password, ...user }) => user);
        return {
            users: usersWithoutPasswords,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
    catch (error) {
        (0, logger_1.logToFile)('userService', 'Error getting users', error);
        throw error;
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (id) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                roles: {
                    include: {
                        permissions: true
                    }
                }
            }
        });
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404);
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    catch (error) {
        (0, logger_1.logToFile)('userService', `Error getting user ${id}`, error);
        throw error;
    }
};
exports.getUserById = getUserById;
const searchUsers = async (query, page = 1, limit = 10) => {
    try {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where: {
                    OR: [
                        { email: { contains: query } },
                        { firstName: { contains: query } },
                        { lastName: { contains: query } }
                    ]
                },
                skip,
                take: limit,
                include: {
                    roles: {
                        include: {
                            permissions: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.user.count({
                where: {
                    OR: [
                        { email: { contains: query } },
                        { firstName: { contains: query } },
                        { lastName: { contains: query } }
                    ]
                }
            })
        ]);
        const usersWithoutPasswords = users.map(({ password, ...user }) => user);
        return {
            users: usersWithoutPasswords,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
    catch (error) {
        (0, logger_1.logToFile)('userService', 'Error searching users', error);
        throw error;
    }
};
exports.searchUsers = searchUsers;
const updateUser = async (id, data) => {
    try {
        const { email, password, firstName, lastName, roleId, profileImage } = data;
        const user = await prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404);
        }
        if (email && email !== user.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });
            if (existingUser) {
                throw new errorHandler_1.AppError('Email already exists', 400);
            }
        }
        if (profileImage && user.profileImage) {
            const oldImagePath = path_1.default.join(process.cwd(), user.profileImage);
            if (fs_1.default.existsSync(oldImagePath)) {
                fs_1.default.unlinkSync(oldImagePath);
            }
        }
        const updateData = {};
        if (email)
            updateData.email = email;
        if (firstName)
            updateData.firstName = firstName;
        if (lastName)
            updateData.lastName = lastName;
        if (password) {
            updateData.password = await bcryptjs_1.default.hash(password, 12);
        }
        if (roleId) {
            updateData.roles = {
                connect: { id: roleId }
            };
        }
        if (profileImage) {
            updateData.profileImage = profileImage;
        }
        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            include: {
                roles: {
                    include: {
                        permissions: true
                    }
                }
            }
        });
        const { password: _, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }
    catch (error) {
        (0, logger_1.logToFile)('userService', `Error updating user ${id}`, error);
        throw error;
    }
};
exports.updateUser = updateUser;
const deleteUser = async (id) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404);
        }
        await prisma.user.delete({
            where: { id }
        });
        return true;
    }
    catch (error) {
        (0, logger_1.logToFile)('userService', `Error deleting user ${id}`, error);
        throw error;
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=userService.js.map