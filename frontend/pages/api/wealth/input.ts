// pages/api/wealth/input.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import { getUserIdFromToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const userId = getUserIdFromToken(req);
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method === 'GET') {
        // --- HANDLE FETCHING EXISTING WEALTH INPUT ---
        try {
            const result = await query('SELECT * FROM wealth_input WHERE user_id = $1', [userId]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'No wealth input data found for this user.' });
            }
            return res.status(200).json(result.rows[0]);
        } catch (error) {
            console.error('Get Wealth Input Error:', error);
            return res.status(500).json({ message: 'Server error while fetching wealth input.' });
        }
    }

    if (req.method === 'POST') {
        // --- HANDLE SAVING NEW/UPDATED WEALTH INPUT ---
        try {
            const { user_age, retirement_age, current_savings, monthly_investment, expected_return, risk_tolerance, liquidity, annual_step_up } = req.body;
            
            // --- FIX: Provide default values for dropdowns if they are missing ---
            const finalRiskTolerance = risk_tolerance || 'Medium';
            const finalLiquidity = liquidity || 'Medium';

            const existingRecord = await query('SELECT wealth_input_id FROM wealth_input WHERE user_id = $1', [userId]);

            if (existingRecord.rows.length > 0) {
                // User already has input data, so UPDATE it
                const updateQuery = `
                    UPDATE wealth_input SET
                        user_age = $1, retirement_age = $2, current_savings = $3, monthly_investment = $4, 
                        expected_return = $5, risk_tolerance = $6, liquidity = $7, annual_step_up = $8, 
                        created_at = NOW()
                    WHERE user_id = $9;
                `;
                await query(updateQuery, [user_age, retirement_age, current_savings, monthly_investment, expected_return, finalRiskTolerance, finalLiquidity, annual_step_up, userId]);
            } else {
                // No existing data, so INSERT a new record
                const insertQuery = `
                    INSERT INTO wealth_input (user_id, user_age, retirement_age, current_savings, monthly_investment, expected_return, risk_tolerance, liquidity, annual_step_up, created_at)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW());
                `;
                await query(insertQuery, [userId, user_age, retirement_age, current_savings, monthly_investment, expected_return, finalRiskTolerance, finalLiquidity, annual_step_up]);
            }

            return res.status(200).json({ message: 'Wealth input saved successfully.' });
        } catch (error) {
            console.error('Save Wealth Input Error:', error);
            return res.status(500).json({ message: 'Server error while saving wealth input.' });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
