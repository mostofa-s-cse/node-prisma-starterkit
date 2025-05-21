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

const router = express.Router();

// Local authentication routes
router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', protect, logout);
router.get('/auth-user', protect, getAuthUser);
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