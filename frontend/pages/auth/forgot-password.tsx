// pages/auth/forgot-password.tsx
'use client';

import { useState } from 'react';
import type { NextPage } from 'next';
import { AtSign, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const ForgotPasswordPage: NextPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // We always show a success message to prevent email enumeration
      setSuccessMessage(data.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen flex items-center justify-center font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl border border-gray-200/80">
        
        <div className="text-center">
          <img src="/PS-Logo.png" alt="PrajaSeva Logo" className="h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-[#003366]">Reset Your Password</h1>
          <p className="mt-2 text-gray-500">Enter your email address and we will send you a link to reset your password.</p>
        </div>

        {successMessage ? (
          <div className="text-center p-4 bg-green-50 text-green-800 rounded-lg">
            <p className="font-semibold">Request Sent</p>
            <p>{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-600 text-center text-sm font-medium p-3 bg-red-50 rounded-lg">{error}</div>}
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><AtSign className="h-5 w-5 text-gray-400" /></div>
              <input 
                id="email-address" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#003366]" 
                placeholder="Email address" 
              />
            </div>

            <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-[#003366] hover:bg-[#002244] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:bg-gray-400">
              {isLoading ? 'Sending...' : 'Send Reset Link'}
              {!isLoading && <ArrowRight className="ml-2 h-6 w-6 transform group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        )}

        <div className="text-center">
            <Link href="/auth">
                <span className="text-sm font-medium text-[#0055A4] hover:text-[#003366] cursor-pointer">
                    Back to Login
                </span>
            </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;
