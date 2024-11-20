import { Router } from "express";
import authRoutes from "./v1/authRoutes";
import userRoutes from "./v1/userRoutes";

const router = Router();

// Version 1 routes
// Combine all routes
router.use("/auth", authRoutes); // Routes for authentication
router.use("/users", userRoutes); // Routes for user management

// Version 2 routes

export default router;
