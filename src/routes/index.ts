import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";

const router = Router();

// Combine all routes
router.use("/auth", authRoutes); // Routes for authentication
router.use("/users", userRoutes); // Routes for user management

export default router;
