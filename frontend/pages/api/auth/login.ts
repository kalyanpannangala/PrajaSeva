// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const result = await query('SELECT * FROM profiles WHERE email = $1', [email.toLowerCase()]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        if (!user.is_verified) {
            return res.status(403).json({ message: 'Please verify your email address before logging in.' });
        }
    // Inside pages/api/auth/login.ts

console.log("Password from form:", password);
console.log("Hashed password from DB:", user.hashed_password);

const isMatch = await bcrypt.compare(password, user.hashed_password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
        const redirectTo = user.onboarding_complete ? '/dashboard' : '/consent';

        return res.status(200).json({
            message: 'Login successful!',
            token,
            redirectTo,
        });

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ message: 'Server error during login.' });
    }
}
