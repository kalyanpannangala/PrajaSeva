// app/api/auth/initiate/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    const result = await query('SELECT * FROM profiles WHERE email = $1', [email]);
    const user = result.rows[0];

    // CASE 1: USER DOES NOT EXIST
    if (!user) {
      return NextResponse.json({ status: 'new_user' });
    }

    // CASE 2: USER EXISTS, PROCEED WITH LOGIN
    if (!user.is_verified) {
      return NextResponse.json({ message: 'Please verify your email address before logging in.' }, { status: 403 });
    }

    const isMatch = await bcrypt.compare(password, user.hashed_password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    const redirectTo = user.onboarding_complete ? '/dashboard' : '/privacy';

    return NextResponse.json({
      status: 'login_success',
      message: 'Login successful!',
      token,
      redirectTo,
    });

  } catch (error) {
    console.error('Auth Initiate Error:', error);
    return NextResponse.json({ message: 'Server error during authentication.' }, { status: 500 });
  }
}
