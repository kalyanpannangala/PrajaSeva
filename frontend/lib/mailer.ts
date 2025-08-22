// lib/mailer.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// --- Existing function ---
export const sendVerificationEmail = async (to: string, token: string) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;
  const mailOptions = {
    from: `"PrajaSeva" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: 'Verify Your PrajaSeva Account',
    html: `...`, // Your existing HTML
  };
  // ... (rest of the function)
};


// --- NEW FUNCTION TO ADD ---
export const sendPasswordResetEmail = async (to: string, token: string) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"PrajaSeva" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: 'Reset Your PrajaSeva Password',
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>You are receiving this email because a password reset request was initiated for your account. Please click the button below to reset your password. This link is valid for 1 hour.</p>
        <a href="${resetUrl}" style="background-color: #003366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        <p style="margin-top: 20px;">If you did not request a password reset, please ignore this email or contact support.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', to);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Could not send password reset email.');
  }
};
