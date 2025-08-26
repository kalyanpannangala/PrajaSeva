// lib/mailer.ts
import nodemailer from 'nodemailer';

// --- UPDATED: Configure Nodemailer for SendGrid ---
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey", // This is always "apikey" for SendGrid
    pass: process.env.SENDGRID_API_KEY, // Your API key from the .env file
  },
});

// --- UPDATED: sendVerificationEmail function ---
export const sendVerificationEmail = async (to: string, token: string) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;
  
  const mailOptions = {
    // IMPORTANT: Use the email address you verified as a "Sender" in SendGrid
    from: `"PrajaSeva" <prajaseva.ai@gmail.com>`, 
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
    console.log('Verification email sent via SendGrid to:', to);
  } catch (error) {
    console.error('Error sending SendGrid email:', error);
    throw new Error('Could not send verification email.');
  }
};

// --- UPDATED: sendPasswordResetEmail function ---
export const sendPasswordResetEmail = async (to: string, token: string) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;
  
  const mailOptions = {
    // IMPORTANT: Use the same verified sender email here
    from: `"PrajaSeva" <prajaseva.ai@gmail.com>`,
    to: to,
    subject: 'Reset Your PrajaSeva Password',
    html: `...`, // Your existing password reset HTML
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent via SendGrid to:', to);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Could not send password reset email.');
  }
};
