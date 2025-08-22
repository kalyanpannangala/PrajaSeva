// pages/auth/reset-password.tsx
'use client';

import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const ResetPasswordPage: NextPage = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Ensure the token is read from the router query only when the router is ready
    if (router.isReady) {
      const queryToken = router.query.token;
      if (typeof queryToken === 'string') {
        setToken(queryToken);
      } else {
        setError('Invalid or missing password reset token.');
      }
    }
  }, [router.isReady, router.query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!token) {
      setError('No reset token found.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccessMessage(data.message);
      setTimeout(() => {
        router.push('/auth'); // Redirect to login after success
      }, 3000);

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
          <h1 className="text-3xl font-bold text-[#003366]">Set a New Password</h1>
          <p className="mt-2 text-gray-500">Please enter and confirm your new password below.</p>
        </div>

        {successMessage ? (
          <div className="text-center p-4 bg-green-50 text-green-800 rounded-lg">
            <p className="font-semibold">Success!</p>
            <p>{successMessage} Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-600 text-center text-sm font-medium p-3 bg-red-50 rounded-lg">{error}</div>}
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
              <input 
                id="new-password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#003366]" 
                placeholder="New Password" 
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
              <input 
                id="confirm-password" 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#003366]" 
                placeholder="Confirm New Password" 
              />
            </div>

            <button type="submit" disabled={isLoading || !token} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-[#003366] hover:bg-[#002244] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:bg-gray-400">
              {isLoading ? 'Resetting...' : 'Reset Password'}
              {!isLoading && <ArrowRight className="ml-2 h-6 w-6 transform group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
