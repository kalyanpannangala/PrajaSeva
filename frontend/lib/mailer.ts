// lib/mailer.ts
import nodemailer from 'nodemailer';

// --- UPDATED: Configure Nodemailer for Gmail SMTP ---
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.GMAIL_USER,      // your Gmail address
    pass: process.env.GMAIL_APP_PASS,  // your App Password (not your Gmail login password)
  },
});

// --- sendVerificationEmail function ---
export const sendVerificationEmail = async (to: string, token: string) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;
  
  const mailOptions = {
    from: `"PrajaSeva" <${process.env.GMAIL_USER}>`, 
    to: to,
    subject: 'Verify Your PrajaSeva Account',
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2>Welcome to PrajaSeva!</h2>
        <p>Thank you for registering. Please click the button below to verify your email address:</p>
        <a href="${verificationUrl}" style="background-color: #003366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
        <p style="margin-top: 20px;">If you did not create an account, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent via Gmail SMTP to:', to);
  } catch (error) {
    console.error('Error sending Gmail SMTP email:', error);
    throw new Error('Could not send verification email.');
  }
};

// --- sendPasswordResetEmail function ---
export const sendPasswordResetEmail = async (to: string, token: string) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"PrajaSeva" <${process.env.GMAIL_USER}>`,
    to: to,
    subject: 'Reset Your PrajaSeva Password',
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        <a href="${resetUrl}" style="background-color: #cc0000; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        <p style="margin-top: 20px;">If you did not request a password reset, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent via Gmail SMTP to:', to);
  } catch (error) {
    console.error('Error sending Gmail SMTP email:', error);
    throw new Error('Could not send password reset email.');
  }
};
