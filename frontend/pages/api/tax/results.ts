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
        // --- UPDATE: Add the 'notes' column to the SELECT statement ---
        const result = await query('SELECT taxable_income_old, tax_old, taxable_income_new, tax_new, recommended_regime, tax_saving, notes FROM tax WHERE user_id = $1', [userId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No tax results found for this user.' });
        }

        const dbResult = result.rows[0];
        
        // Format the final response object to match the frontend's expectation
        const formattedResult = {
            calculation_summary: {
                taxable_income_old: dbResult.taxable_income_old,
                tax_old: dbResult.tax_old,
                taxable_income_new: dbResult.taxable_income_new,
                tax_new: dbResult.tax_new,
            },
            recommendation: {
                deterministic: dbResult.recommended_regime,
                ml_recommendation: "N/A", // Not stored in DB, set a default
                tax_saving: dbResult.tax_saving,
            },
            // The 'notes' from the DB will be a JSON string, which is fine for the frontend
            notes: dbResult.notes || [],
        };
        
        return res.status(200).json(formattedResult);

    } catch (error) {
        console.error('Get Tax Results Error:', error);
        return res.status(500).json({ message: 'Server error while fetching tax results.' });
    }
}
