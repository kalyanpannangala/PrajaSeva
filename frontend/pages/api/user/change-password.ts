// pages/api/user/change-password.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import { getUserIdFromToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // This is a protected route
        const userId = getUserIdFromToken(req);
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'All password fields are required.' });
        }

        const result = await query('SELECT hashed_password FROM profiles WHERE user_id = $1', [userId]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Verify the current password
        const isMatch = await bcrypt.compare(currentPassword, user.hashed_password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect current password.' });
        }

        // Hash and update to the new password
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);

        await query(
            'UPDATE profiles SET hashed_password = $1 WHERE user_id = $2',
            [newHashedPassword, userId]
        );

        return res.status(200).json({ message: 'Password changed successfully.' });

    } catch (error) {
        console.error('Change Password Error:', error);
        return res.status(500).json({ message: 'An error occurred while changing your password.' });
    }
}
