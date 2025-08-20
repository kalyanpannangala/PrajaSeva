// pages/api/auth/check-email.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db'; // Assuming lib/db.ts is set up

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const result = await query('SELECT user_id FROM profiles WHERE email = $1', [email.toLowerCase()]);
    
    const userExists = result.rows.length > 0;

    return res.status(200).json({ exists: userExists });

  } catch (error) {
    console.error('Check Email Error:', error);
    return res.status(500).json({ message: 'Server error during email check.' });
  }
}