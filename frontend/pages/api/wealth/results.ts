// pages/api/wealth/results.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import { getUserIdFromToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const userId = getUserIdFromToken(req);
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Fetch the latest wealth calculation result for the user from the 'wealth' table
        const result = await query('SELECT * FROM wealth WHERE user_id = $1', [userId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No wealth results found for this user.' });
        }

        // The data in the DB is already in the correct format (thanks to JSONB)
        // We just need to ensure numbers are formatted correctly if needed, but the frontend handles this.
        const dbResult = result.rows[0];
        
        return res.status(200).json(dbResult);

    } catch (error) {
        console.error('Get Wealth Results Error:', error);
        return res.status(500).json({ message: 'Server error while fetching wealth results.' });
    }
}
