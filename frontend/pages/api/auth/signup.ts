// pages/api/auth/signup.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/mailer';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const userExists = await query('SELECT * FROM profiles WHERE email = $1', [email.toLowerCase()]);
        if (userExists.rows.length > 0) {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // --- Start Database Transaction ---
        await query('BEGIN');

        try {
            // Step 1: Insert the new user into the database
            await query(
                'INSERT INTO profiles (full_name, email, hashed_password, verification_token) VALUES ($1, $2, $3, $4)',
                [fullName, email.toLowerCase(), hashedPassword, verificationToken]
            );

            // Step 2: Attempt to send the verification email
            await sendVerificationEmail(email, verificationToken);

            // If both succeed, commit the transaction
            await query('COMMIT');

            return res.status(201).json({ message: 'Registration successful! Please check your email to verify your account.' });

        } catch (error) {
            // If any step fails, roll back all database changes
            await query('ROLLBACK');
            
            console.error('Signup Transaction Error:', error);
            // Check if the error was from sending the email
            if (error instanceof Error && error.message.includes('Could not send verification email')) {
                 return res.status(500).json({ message: 'Could not send verification email. Please check the email address and try again.' });
            }
            // Otherwise, it's a general server error
            return res.status(500).json({ message: 'Server error during registration.' });
        }

    } catch (error) {
        console.error('Signup Error:', error);
        return res.status(500).json({ message: 'A critical server error occurred.' });
    }
}
