// pages/api/auth/reset-password.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required.' });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const result = await query(
            'SELECT * FROM profiles WHERE password_reset_token = $1 AND password_reset_expires > NOW()',
            [hashedToken]
        );
        const user = result.rows[0];

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired password reset token.' });
        }

        // Token is valid, hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password and clear the reset token fields
        await query(
            'UPDATE profiles SET hashed_password = $1, password_reset_token = NULL, password_reset_expires = NULL WHERE user_id = $2',
            [hashedPassword, user.user_id]
        );

        return res.status(200).json({ message: 'Password has been reset successfully.' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        return res.status(500).json({ message: 'An error occurred while resetting your password.' });
    }
}
