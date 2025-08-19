// app/api/user/setup/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import jwt from 'jsonwebtoken';

// Helper function to verify JWT from request headers
const getUserIdFromToken = (request: Request): string | null => {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        return decoded.userId;
    } catch (error) {
        return null;
    }
};

export async function POST(request: Request) {
    try {
        const userId = getUserIdFromToken(request);
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const {
            age, gender, state, caste, education_level,
            employment_type, income, disability_status
        } = await request.json();

        if (!age || !state || !income) {
            return NextResponse.json({ message: 'Missing required profile data.' }, { status: 400 });
        }

        // Using a transaction to ensure both writes succeed or fail together
        await query('BEGIN');
        
        // 1. Save detailed profile data to your 'schemes' table
        const profileQuery = `
            INSERT INTO schemes (user_id, age, gender, state, caste, education_level, employment_type, income, disability_status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;
        await query(profileQuery, [userId, age, gender, state, caste, education_level, employment_type, income, disability_status === 'Yes']);

        // 2. Update the 'onboarding_complete' flag in the 'profiles' table
        const updateProfileQuery = `
            UPDATE profiles SET onboarding_complete = TRUE WHERE user_id = $1
        `;
        await query(updateProfileQuery, [userId]);

        await query('COMMIT');

        return NextResponse.json({ message: 'Profile setup completed successfully!' });

    } catch (error) {
        await query('ROLLBACK');
        console.error('Setup Error:', error);
        return NextResponse.json({ message: 'Server error during profile setup.' }, { status: 500 });
    }
}
