// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/mailer';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { fullName, email, password } = await request.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    const userExists = await query('SELECT * FROM profiles WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return NextResponse.json({ message: 'An account with this email already exists.' }, { status: 409 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    await query(
      'INSERT INTO profiles (full_name, email, hashed_password, verification_token) VALUES ($1, $2, $3, $4)',
      [fullName, email, hashedPassword, verificationToken]
    );

    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json({ message: 'Registration successful! Please check your email to verify your account.' }, { status: 201 });

  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json({ message: 'Server error during registration.' }, { status: 500 });
  }
}
