import express from 'express';
import passport from 'passport';
import {
  register,
  verifyOTP,
  login,
  resendOTP,
  googleAuth,
  logout,
  getAuthUser,
  forgotPassword,
  resetPassword,
} from '../../controllers/authController';
import { protect } from '../../middleware/auth';
import { validate } from '../../middleware/validation';
import {
  registerSchema,
  loginSchema,
  verifyOTPSchema,
} from '../../validation/schemas';

const router = express.Router();

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/verify-otp', validate(verifyOTPSchema), verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.use(protect);
router.get('/me', getAuthUser);
router.post('/logout', logout);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  googleAuth
);

export default router; 