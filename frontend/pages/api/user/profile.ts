// pages/api/user/profile.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import { getUserIdFromToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const userId = getUserIdFromToken(req);
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // --- HANDLE FETCHING PROFILE DATA ---
    if (req.method === 'GET') {
        try {
            const queryString = `
                SELECT 
                    p.full_name, p.email, s.age, s.gender, s.state, s.caste, 
                    s.education_level, s.employment_type, s.income, s.disability_status
                FROM profiles p
                LEFT JOIN schemes_input s ON p.user_id = s.user_id
                WHERE p.user_id = $1;
            `;
            const result = await query(queryString, [userId]);
            const userProfile = result.rows[0];

            if (!userProfile) {
                return res.status(404).json({ message: 'User profile not found.' });
            }
            return res.status(200).json(userProfile);

        } catch (error) {
            console.error('Get Profile Error:', error);
            return res.status(500).json({ message: 'Server error while fetching profile.' });
        }
    } 
    // --- HANDLE UPDATING PROFILE DATA ---
    else if (req.method === 'PUT') {
        try {
            const { age, gender, state, caste, education_level, employment_type, income, disability_status } = req.body;
            
            // Note: We only update the 'schemes_input' data, not the user's name or email from this form.
            const updateQuery = `
                UPDATE schemes_input
                SET age = $1, gender = $2, state = $3, caste = $4, education_level = $5, 
                    employment_type = $6, income = $7, disability_status = $8
                WHERE user_id = $9
            `;
            // The disability_status from the form will be a string 'true' or 'false', so we compare it.
            await query(updateQuery, [age, gender, state, caste, education_level, employment_type, income, disability_status === 'true' || disability_status === true, userId]);

            return res.status(200).json({ message: 'Profile updated successfully!' });

        } catch (error) {
            console.error('Update Profile Error:', error);
            return res.status(500).json({ message: 'Server error while updating profile.' });
        }
    } 
    // --- If any other method is used, send the error ---
    else {
        res.setHeader('Allow', ['GET', 'PUT']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}
