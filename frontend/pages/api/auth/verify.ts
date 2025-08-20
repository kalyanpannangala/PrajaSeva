// pages/api/auth/verify.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: 'Verification token is required.' });
        }

        const result = await query('SELECT * FROM profiles WHERE verification_token = $1', [token]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'Invalid or expired verification token.' });
        }

        // Mark user as verified and clear the token
        await query(
            'UPDATE profiles SET is_verified = TRUE, verification_token = NULL WHERE user_id = $1',
            [user.user_id]
        );
        
        // Create a JWT for the new user to log them in automatically
        const jwtToken = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

        // Send back a successful JSON response
        return res.status(200).json({ 
            message: 'Email verified successfully!',
            token: jwtToken 
        });

    } catch (error) {
        console.error('Verification Error:', error);
        return res.status(500).json({ message: 'Server error during email verification.' });
    }
}
