// pages/auth.tsx
'use client';

import { useState } from 'react';
import type { NextPage } from 'next';
import { User, AtSign, Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/router'; // Correct import for Pages Router
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link'; // Import the Link component

const UnifiedAuthPage: NextPage = () => {
  // State for the form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // State to manage the UI flow
  const [authStep, setAuthStep] = useState<'initial' | 'login' | 'signup' | 'pendingVerification'>('initial');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (data.exists) {
        setAuthStep('login');
      } else {
        setAuthStep('signup');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (authStep === 'login') {
      // --- LOGIN LOGIC ---
      try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        
        localStorage.setItem('authToken', data.token);
        router.push(data.redirectTo || '/dashboard');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    } else if (authStep === 'signup') {
      // --- SIGNUP LOGIC ---
      try {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        
        setAuthStep('pendingVerification');
        setSuccessMessage(data.message);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getTitle = () => {
    if (authStep === 'login') return 'Welcome Back';
    if (authStep === 'signup') return 'Create Your Account';
    if (authStep === 'pendingVerification') return 'Check Your Email';
    return 'Welcome to PrajaSeva';
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen flex items-center justify-center font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl border border-gray-200/80">
        
        <div className="text-center">
          <img src="/PS-Logo-Bg.png" alt="PrajaSeva Logo" className="h-12 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-[#003366]">{getTitle()}</h1>
        </div>

        {authStep === 'pendingVerification' ? (
          <div className="text-center p-4 bg-green-50 text-green-800 rounded-lg">
            <p className="font-semibold">Success!</p>
            <p>{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={authStep === 'initial' ? handleInitialSubmit : handleFinalSubmit} className="space-y-6">
            {error && <div className="text-red-600 text-center text-sm font-medium p-3 bg-red-50 rounded-lg">{error}</div>}
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><AtSign className="h-5 w-5 text-gray-400" /></div>
              <input id="email-address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required readOnly={authStep !== 'initial'} className={`w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#003366] ${authStep !== 'initial' ? 'bg-gray-100 cursor-not-allowed' : ''}`} placeholder="Email address" />
            </div>

            <AnimatePresence>
              {(authStep === 'login' || authStep === 'signup') && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 overflow-hidden">
                  {authStep === 'signup' && (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-400" /></div>
                      <input id="full-name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Full Name" className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                    </div>
                  )}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                  </div>
                  
                  {/* --- FORGOT PASSWORD LINK --- */}
                  {authStep === 'login' && (
                    <div className="text-right">
                        <Link href="/auth/forgot-password">
                            <span className="text-sm font-medium text-[#0055A4] hover:text-[#003366] cursor-pointer">
                                Forgot Password?
                            </span>
                        </Link>
                    </div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-[#003366] hover:bg-[#002244] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:bg-gray-400">
              {isLoading ? 'Processing...' : 'Continue'}
              {!isLoading && <ArrowRight className="ml-2 h-6 w-6 transform group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UnifiedAuthPage;
