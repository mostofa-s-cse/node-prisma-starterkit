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
/**
 * Update the user profile.
 * @param id User ID to update.
 * @param data Object containing fields to update (name, email, image).
 * @returns Updated user data.
 */
export const updateUser = async (id: string, data: { name?: string; email?: string; profileImage?: string }) => {
    // Validate email format if email is provided
    if (data.email) {
        validateEmail(data.email);
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
            profileImage: true,
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
