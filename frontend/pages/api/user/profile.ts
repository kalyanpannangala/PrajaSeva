// pages/api/user/profile.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import { getUserIdFromToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // Securely get the user ID from their session token
        const userId = getUserIdFromToken(req);
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // --- UPDATED QUERY ---
        // This query now joins the profiles and schemes_input tables
        // to fetch all the necessary data for the profile page.
        const queryString = `
            SELECT 
                p.full_name,
                p.email,
                s.age,
                s.gender,
                s.state,
                s.caste,
                s.education_level,
                s.employment_type,
                s.income,
                s.disability_status
            FROM 
                profiles p
            LEFT JOIN 
                schemes_input s ON p.user_id = s.user_id
            WHERE 
                p.user_id = $1;
        `;
        
        const result = await query(queryString, [userId]);
        const userProfile = result.rows[0];

        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found.' });
        }

        // Send back the complete user profile object
        return res.status(200).json(userProfile);

    } catch (error) {
        console.error('Get Profile Error:', error);
        return res.status(500).json({ message: 'Server error while fetching profile.' });
    }
}
