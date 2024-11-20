import { Router } from "express";
import * as userController from "../../ controllers/v1/userController";
import { isAuthenticated } from "../../middlewares/authMiddleware";

const userRouter = Router();

// User management routes
userRouter.get("/", isAuthenticated, userController.getAllUsers);         // Get all users
userRouter.put("/:id", isAuthenticated, userController.updateUser);       // Update user
userRouter.delete("/:id", isAuthenticated, userController.deleteUser);    // Delete user

export default userRouter;
