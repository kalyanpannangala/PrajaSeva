// pages/api/schemes/results.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import { getUserIdFromToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const userId = getUserIdFromToken(req);
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // --- FIX: The query now correctly selects from the 'schemes' table ---
        // It filters by the logged-in user's ID to get only their results.
        const result = await query(
            'SELECT scheme_id, scheme_name FROM schemes WHERE user_id = $1',
            [userId]
        );

        if (result.rows.length > 0) {
            // --- CASE 1: Results FOUND ---
            // Send back the existing data (e.g., the 50 schemes).
            return res.status(200).json({ 
                status: 'found', 
                data: result.rows 
            });
        } else {
            // --- CASE 2: Results NOT FOUND ---
            // Tell the frontend it needs to run a new prediction.
            return res.status(200).json({ 
                status: 'not_found' 
            });
        }

    } catch (error) {
        console.error('Get Schemes Results Error:', error);
        return res.status(500).json({ message: 'Server error while checking for schemes.' });
    }
}
