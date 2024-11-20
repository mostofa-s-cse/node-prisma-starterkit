import { AppError } from "../../middlewares/errorHandler";
import prisma from "../../config/database";
import {validateEmail} from "../../utils/emailValidation"; // Custom error handling

// Get all users
export const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return users;
};

// Update user
export const updateUser = async (id: string, data: { name?: string; email?: string }) => {
    // Validate email format if email is provided
    if (data.email) {
        validateEmail(data.email);  // Assuming validateEmail throws an error if invalid
    }
    const existingUser = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!existingUser) {
        throw new AppError("User not found", 404);
    }
    const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data,
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return updatedUser;
};

// Delete user
export const deleteUser = async (id: string) => {
    const existingUser = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!existingUser) {
        throw new AppError("User not found", 404);
    }

    await prisma.user.delete({ where: { id: parseInt(id) } });
};
