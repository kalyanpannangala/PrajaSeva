// pages/api/tax/input.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import { getUserIdFromToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const userId = getUserIdFromToken(req);
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method === 'GET') {
        // --- HANDLE FETCHING EXISTING TAX INPUT ---
        try {
            const result = await query('SELECT * FROM tax_input WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [userId]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'No tax input data found for this user.' });
            }
            return res.status(200).json(result.rows[0]);
        } catch (error) {
            console.error('Get Tax Input Error:', error);
            return res.status(500).json({ message: 'Server error while fetching tax input.' });
        }
    }

    if (req.method === 'POST') {
        // --- HANDLE SAVING NEW/UPDATED TAX INPUT ---
        try {
            const { age, annual_income, is_salaried, investment_80c, investment_80d, home_loan_interest, education_loan_interest, donations_80g, other_deductions } = req.body;
            
            // --- FIX: Replace UPSERT with a SELECT then INSERT/UPDATE pattern ---
            const existingRecord = await query('SELECT tax_input_id FROM tax_input WHERE user_id = $1', [userId]);

            if (existingRecord.rows.length > 0) {
                // User already has input data, so UPDATE it
                const updateQuery = `
                    UPDATE tax_input SET
                        age = $1, annual_income = $2, is_salaried = $3, investment_80c = $4, 
                        investment_80d = $5, home_loan_interest = $6, education_loan_interest = $7, 
                        donations_80g = $8, other_deductions = $9, created_at = NOW()
                    WHERE user_id = $10;
                `;
                await query(updateQuery, [age, annual_income, is_salaried, investment_80c, investment_80d, home_loan_interest, education_loan_interest, donations_80g, other_deductions, userId]);
            } else {
                // No existing data, so INSERT a new record
                const insertQuery = `
                    INSERT INTO tax_input (user_id, age, annual_income, is_salaried, investment_80c, investment_80d, home_loan_interest, education_loan_interest, donations_80g, other_deductions, created_at)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW());
                `;
                await query(insertQuery, [userId, age, annual_income, is_salaried, investment_80c, investment_80d, home_loan_interest, education_loan_interest, donations_80g, other_deductions]);
            }

            return res.status(200).json({ message: 'Tax input saved successfully.' });
        } catch (error) {
            console.error('Save Tax Input Error:', error);
            return res.status(500).json({ message: 'Server error while saving tax input.' });
        }
    }

    // If method is not GET or POST
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
