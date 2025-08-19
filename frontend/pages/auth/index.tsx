// app/auth/page.tsx
'use client';

import { useState } from 'react';
import type { NextPage } from 'next';
import { User, AtSign, Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Correct import for App Router
import { motion, AnimatePresence } from 'framer-motion';

const UnifiedAuthPage: NextPage = () => {
  // State for the form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // State to manage the UI flow
  const [authStep, setAuthStep] = useState<'initial' | 'needsName'>('initial');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      // --- Step 1: User enters email and password ---
      if (authStep === 'initial') {
        const response = await fetch('http://localhost:8000/api/auth/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Authentication failed.');
        }

        if (data.status === 'login_success') {
          // --- LOGIN SUCCESS ---
          localStorage.setItem('authToken', data.token);
          router.push(data.redirectTo || '/dashboard');
        } else if (data.status === 'new_user') {
          // --- NEW USER: ASK FOR NAME ---
          setAuthStep('needsName');
        }
      } 
      // --- Step 2: New user provides full name ---
      else if (authStep === 'needsName') {
        if (!fullName) {
          setError('Please enter your full name.');
          setIsLoading(false);
          return;
        }
        // --- SIGNUP LOGIC ---
        const response = await fetch('http://localhost:8000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        
        // Show success message and wait for user to check email
        setSuccessMessage(data.message);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const getDescription = () => {
    if (authStep === 'needsName') return 'Please provide your name to create your account.';
    return 'Enter your details to login or sign up.';
  };

  const getButtonText = () => {
    if (isLoading) return 'Processing...';
    if (authStep === 'needsName') return 'Create Account';
    return 'Continue';
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen flex items-center justify-center font-sans">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-2xl border border-gray-200/80">
        
        {/* Header */}
        <div className="text-center">
            <img 
              src="/PS-Logo-Bg.png"
              alt="PrajaSeva Logo"
              className="h-16 mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-[#003366]">
                {authStep === 'needsName' ? 'Just one more step...' : ''}
            </h1>
            <p className="mt-2 text-gray-500">{getDescription()}</p>
        </div>

        {/* Success Message Display */}
        {successMessage ? (
            <div className="text-center p-4 bg-green-50 text-green-800 rounded-lg">
                <p className="font-semibold">Success!</p>
                <p>{successMessage}</p>
            </div>
        ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="text-red-600 text-center text-sm font-medium p-3 bg-red-50 rounded-lg">{error}</div>
              )}
              <div className="space-y-4">
                
                {/* Full Name Input (Signup only, animated) */}
                <AnimatePresence>
                  {authStep === 'needsName' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="relative overflow-hidden"
                    >
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-400" /></div>
                      <input id="full-name" name="full-name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#003366]" placeholder="Full Name" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><AtSign className="h-5 w-5 text-gray-400" /></div>
                  <input id="email-address" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required readOnly={authStep === 'needsName'} className={`w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#003366] ${authStep === 'needsName' ? 'bg-gray-100 cursor-not-allowed' : ''}`} placeholder="Email address" />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                  <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required readOnly={authStep === 'needsName'} className={`w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#003366] ${authStep === 'needsName' ? 'bg-gray-100 cursor-not-allowed' : ''}`} placeholder="Password" />
                </div>
              </div>
              
              {/* Submit Button */}
              <div>
                <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-[#003366] hover:bg-[#002244] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:bg-gray-400">
                  {getButtonText()}
                  {!isLoading && <ArrowRight className="ml-2 h-6 w-6 transform group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </form>
        )}
      </div>
    </div>
  );
};

export default UnifiedAuthPage;
