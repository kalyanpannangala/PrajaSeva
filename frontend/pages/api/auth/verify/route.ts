// app/api/auth/verify/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ message: 'Verification token is required.' }, { status: 400 });
    }

    const result = await query('SELECT * FROM profiles WHERE verification_token = $1', [token]);
    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({ message: 'Invalid or expired verification token.' }, { status: 404 });
    }

    await query(
      'UPDATE profiles SET is_verified = TRUE, verification_token = NULL WHERE user_id = $1',
      [user.user_id]
    );
    
    const jwtToken = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

    return NextResponse.json({ 
      message: 'Email verified successfully!',
      token: jwtToken 
    });

  } catch (error) {
    console.error('Verification Error:', error);
    return NextResponse.json({ message: 'Server error during email verification.' }, { status: 500 });
  }
}
