import { Router } from "express";
import * as authController from "../ controllers/authController";

const authRouter = Router();

// Authentication routes
authRouter.post("/register", authController.register);      // Register
authRouter.post("/verify", authController.verify);          // Verify OTP
authRouter.post("/resend-otp", authController.resendOtp);   // Resend OTP
authRouter.post("/login", authController.login);            // Login
authRouter.post("/refresh", authController.refresh);        // Refresh Token

export default authRouter;
