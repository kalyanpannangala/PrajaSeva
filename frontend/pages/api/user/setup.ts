// pages/api/user/setup.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import { getUserIdFromToken } from '@/lib/auth'; // Assuming you have this helper

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const userId = getUserIdFromToken(req); // Verify the user's JWT
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const {
            age,
            gender,
            state,
            caste,
            education_level,
            employment_type,
            income,
            disability_status
        } = req.body;

        if (!age || !state || !income) {
            return res.status(400).json({ message: 'Missing required profile data.' });
        }

        // --- Use a transaction for data integrity ---
        await query('BEGIN');

        try {
            // 1. Save the detailed profile data to the 'schemes_input' table
            const profileQuery = `
                INSERT INTO schemes_input (user_id, age, gender, state, caste, education_level, employment_type, income, disability_status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `;
            await query(profileQuery, [userId, age, gender, state, caste, education_level, employment_type, income, disability_status === 'Yes']);

            // 2. Update the 'onboarding_complete' flag in the 'profiles' table
            const updateProfileQuery = `
                UPDATE profiles SET onboarding_complete = TRUE WHERE user_id = $1
            `;
            await query(updateProfileQuery, [userId]);

            // If both succeed, commit the transaction
            await query('COMMIT');

            return res.status(200).json({ message: 'Profile setup completed successfully!' });

        } catch (transactionError) {
            // If any step inside the transaction fails, roll back all changes
            await query('ROLLBACK');
            console.error('Setup Transaction Error:', transactionError);
            return res.status(500).json({ message: 'Server error during profile setup.' });
        }

    } catch (error) {
        console.error('Setup Error:', error);
        return res.status(500).json({ message: 'A critical server error occurred.' });
    }
}
