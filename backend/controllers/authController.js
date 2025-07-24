import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendOTPEmail } from '../utils/email.js';

dotenv.config();

/**
 * @desc    Admin login (no DB entry)
 * @route   POST /api/auth/admin/login
 * @access  Public
 */
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminHash  = process.env.ADMIN_PASSWORD_HASH;

    if (email !== adminEmail) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, adminHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = { _id: 'admin', name: 'Administrator', role: 'admin' };
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.json({ token, user });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Open signup: create sub-admins & employees
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!['subadmin', 'employee'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // New users default to isApproved=false
    const user = await User.create({ name, email, password, role });
    return res.status(201).json({
      message: 'User created successfully; awaiting admin approval',
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Sub-Admin & Employee login
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Must exist
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Only explicitly-false blocks; undefined or true passes
    if (user.isApproved === false) {
      return res.status(403).json({ message: 'Account pending approval' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Issue JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.json({
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        role:  user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Request a password-reset OTP via email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account with that email' });
    }

    // Generate OTP & expiry
    const otp = crypto.randomInt(100000, 999999).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Send OTP
    await sendOTPEmail(email, otp);

    return res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Reset password using OTP
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (
      !user ||
      user.resetPasswordOTP !== otp ||
      Date.now() > user.resetPasswordOTPExpires
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Update password & clear OTP fields
    user.password = newPassword;
    user.resetPasswordOTP = null;
    user.resetPasswordOTPExpires = null;
    await user.save();

    return res.json({ message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
};
