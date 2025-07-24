// backend/utils/email.js

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host:     process.env.SMTP_HOST,
  port:     parseInt(process.env.SMTP_PORT, 10),
  secure:   process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Send OTP for password reset
 */
export const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from:    process.env.SMTP_FROM_EMAIL,
    to,
    subject: 'Your HomelyAura DRP Password Reset OTP',
    text:    `Your OTP for resetting your password is ${otp}. It expires in 15 minutes.`
  };
  return transporter.sendMail(mailOptions);
};

/**
 * Send approval notification when admin approves a new signup
 */
export const sendApprovalEmail = async (to) => {
  const mailOptions = {
    from:    process.env.SMTP_FROM_EMAIL,
    to,
    subject: 'Your HomelyAura DRP Account Is Now Approved',
    text:    `Congratulations! Your HomelyAura DRP account has been approved by the administrator. You can now log in: https://your-frontend-url.com/login`
  };
  return transporter.sendMail(mailOptions);
};
