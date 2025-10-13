import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // We only want to handle POST requests, reject anything else
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { fullName, email, subject, message } = req.body;

        // Basic validation to ensure required fields are present
        if (!fullName || !email || !subject || !message) {
            return res.status(400).json({ error: 'Please fill out all fields.' });
        }

        // --- Nodemailer Setup ---
        // Create a transporter object using Gmail's SMTP server and your App Password
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASS, // Use the App Password from .env.local
            },
        });

        // Define the email options
        const mailOptions = {
            from: `"${fullName}" <${email}>`, // Show the sender's name and email
            to: 'prajaseva.ai@gmail.com', // Your destination email
            subject: 'Contact Form Enquiry', // The subject line you requested
            html: `
                <h1>New Enquiry from PrajaSeva Contact Form</h1>
                <p><strong>Subject:</strong> ${subject}</p>
                <hr>
                <p><strong>From:</strong> ${fullName}</p>
                <p><strong>Sender's Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        // Send a success response back to the frontend
        res.status(200).json({ success: true, message: 'Your message has been sent successfully!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
}

