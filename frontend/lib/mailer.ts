// lib/mailer.ts
import nodemailer from 'nodemailer';

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Function to send the verification email
export const sendVerificationEmail = async (to: string, token: string) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;
  
  const mailOptions = {
    from: `"PrajaSeva" <${process.env.EMAIL_USER}>`,
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
    console.log('Verification email sent to:', to);
  } catch (error) {
    console.error('Error sending verification email:', error);
    // In a real app, you might want to handle this error more gracefully
    throw new Error('Could not send verification email.');
  }
};
