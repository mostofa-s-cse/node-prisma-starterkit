import { Request, Response, NextFunction } from "express";
import * as userService from "../../services/v1/userService"; // Import the service layer

// Get all users
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    console.log("req",req);
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

// Update user
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        const updatedUser = await userService.updateUser(id, { name, email });

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

// Delete user
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        await userService.deleteUser(id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
