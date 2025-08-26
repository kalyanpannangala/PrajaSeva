// pages/api/dashboard/summary.ts
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
        // Fetch data for all three cards in parallel
        const [schemesResult, taxResult, wealthResult] = await Promise.all([
            query('SELECT scheme_id FROM schemes WHERE user_id = $1', [userId]),
            query('SELECT tax_saving, recommended_regime FROM tax WHERE user_id = $1', [userId]),
            query('SELECT projected_corpus FROM wealth WHERE user_id = $1', [userId])
        ]);

        // Process schemes data
        let schemesData = null;
        if (schemesResult.rows.length > 0) {
            const schemes = schemesResult.rows;
            schemesData = {
                total: schemes.length,
                central: schemes.filter(s => s.scheme_id.startsWith('C')).length,
                state: schemes.filter(s => s.scheme_id.startsWith('AP')).length,
            };
        }

        // Process tax data
        const taxData = taxResult.rows.length > 0 ? taxResult.rows[0] : null;

        // Process wealth data
        const wealthData = wealthResult.rows.length > 0 ? wealthResult.rows[0] : null;

        return res.status(200).json({
            schemes: schemesData,
            tax: taxData,
            wealth: wealthData,
        });

    } catch (error) {
        console.error('Dashboard Summary Error:', error);
        return res.status(500).json({ message: 'Server error while fetching dashboard summary.' });
    }
}
