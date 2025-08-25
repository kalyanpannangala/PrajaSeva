// pages/api/tax/results.ts
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
        const result = await query('SELECT * FROM tax WHERE user_id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No tax results found for this user.' });
        }
        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Get Tax Results Error:', error);
        return res.status(500).json({ message: 'Server error while fetching tax results.' });
    }
}
