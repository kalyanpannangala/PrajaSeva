// pages/api/auth/forgot-password.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/mailer';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        const result = await query('SELECT * FROM profiles WHERE email = $1', [email.toLowerCase()]);
        const user = result.rows[0];

        if (user) {
            // User exists, proceed with token generation and email
            const resetToken = crypto.randomBytes(32).toString('hex');
            const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

            // Set token expiration to 1 hour from now
            const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour

            await query(
                'UPDATE profiles SET password_reset_token = $1, password_reset_expires = $2 WHERE user_id = $3',
                [hashedToken, tokenExpiry, user.user_id]
            );

            await sendPasswordResetEmail(user.email, resetToken);
        }
        
        // IMPORTANT: Always send a success message, even if the user doesn't exist.
        // This prevents attackers from using this endpoint to check for valid emails.
        return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        return res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
}
