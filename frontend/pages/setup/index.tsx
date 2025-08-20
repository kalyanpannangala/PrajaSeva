// app/setup/page.tsx
'use client'; 

import { useState } from 'react';
import type { NextPage } from 'next';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- Define the shape of our form data for TypeScript ---
type FormData = {
  [key: string]: string | number;
};

// --- Define the questions for the wizard ---
const questions = [
  { id: 'age', label: 'To begin, how old are you?', type: 'number', placeholder: 'e.g., 30' },
  { id: 'gender', label: 'What is your gender?', type: 'select', options: ['Male', 'Female', 'Other'] },
  { id: 'state', label: 'Which state do you reside in?', type: 'select', options: ['Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'] },
  { id: 'caste', label: 'Which category do you belong to?', type: 'select', options: ['General', 'OBC', 'SC', 'ST'] },
  { id: 'education_level', label: 'What is your highest level of education?', type: 'select', options: ['Postgraduate', 'Graduate', 'Secondary', 'Un-educated', 'Other'] },
  { id: 'employment_type', label: 'What is your current employment status?', type: 'select', options: ['Government-employed', 'Private-employed', 'Self-employed', 'Farmer', 'Student', 'Retired', 'Un-employed'] },
  { id: 'income', label: 'What is your approximate annual income (in ₹)?', type: 'number', placeholder: 'e.g., 800000' },
  { id: 'disability_status', label: 'Do you have any disability status?', type: 'select', options: ['No', 'Yes'] },
];

const DynamicProfileSetup: NextPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const currentQuestion = questions[currentStep];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setError('');
    setFormData({ ...formData, [currentQuestion.id]: e.target.value });
  };

  const handleNext = () => {
    if (!formData[currentQuestion.id] || formData[currentQuestion.id] === '') {
      setError('This field is required.');
      return;
    }
    setError('');
    setCurrentStep(currentStep + 1);
  };

  const handleFinishSetup = async () => {
    setIsLoading(true);
    setError('');
    
    const token = localStorage.getItem('authToken');
    if (!token) {
        setError('Authentication error. Please log in again.');
        setIsLoading(false);
        // Optional: redirect to login after a delay
        setTimeout(() => router.push('/auth'), 2000);
        return;
    }

    try {
        const response = await fetch('https://prajaseva-ai.vercel.app/api/user/setup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to save profile.');
        }

        // --- SUCCESS ---
        router.push('/dashboard');

    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  const progressPercentage = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="bg-[#F8FAFA] min-h-screen font-sans">
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-lg border-b border-gray-200/80 flex items-center justify-between px-6 z-50">
        <img src="/PS-Logo-Bg.png" alt="PrajaSeva Logo" className="h-12" />
        <button onClick={() => router.push('/dashboard')} className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
            <X className="h-6 w-6" />
            <span className="font-semibold">Exit</span>
        </button>
      </header>

      <div className="min-h-screen flex flex-col items-center justify-center pt-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full opacity-50 -translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-100 rounded-full opacity-50 translate-x-1/4 translate-y-1/4"></div>

        <div className="w-full max-w-2xl p-8 z-10">
          <div className="mb-12">
            {currentStep < questions.length && (
              <>
                <p className="text-lg font-semibold text-[#003366] mb-2">Step {currentStep + 1} of {questions.length}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <motion.div className="bg-gradient-to-r from-[#003366] to-[#0055A4] h-2.5 rounded-full" initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 0.5, ease: 'easeInOut' }} />
                </div>
              </>
            )}
          </div>

          <AnimatePresence mode="wait">
            {currentStep < questions.length ? (
              <motion.div key={currentStep} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.5, ease: 'easeInOut' }} className="space-y-6">
                <label htmlFor={currentQuestion.id} className="text-3xl md:text-4xl font-bold text-[#003366] block">{currentQuestion.label}</label>
                {currentQuestion.type === 'select' ? (
                  <select id={currentQuestion.id} value={String(formData[currentQuestion.id] || '')} onChange={handleInputChange} className="w-full max-w-md mt-4 p-4 text-xl border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-[#003366] transition">
                    <option value="" disabled>Select an option...</option>
                    {currentQuestion.options?.map(option => (<option key={option} value={option}>{option}</option>))}
                  </select>
                ) : (
                  <input id={currentQuestion.id} type={currentQuestion.type} placeholder={currentQuestion.placeholder} value={String(formData[currentQuestion.id] || '')} onChange={handleInputChange} onKeyDown={(e) => e.key === 'Enter' && handleNext()} className="w-full max-w-md mt-4 p-4 text-xl border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-[#003366] transition placeholder-gray-400" autoFocus />
                )}
                {error && <motion.p initial={{opacity: 0}} animate={{opacity: 1}} className="text-red-500 mt-2">{error}</motion.p>}
                <motion.button onClick={handleNext} className="group flex items-center justify-center w-16 h-16 mt-6 bg-[#003366] text-white rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 focus:outline-none" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <ArrowRight className="h-8 w-8 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div key="completion" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: 'easeInOut' }} className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-4xl font-bold text-[#003366]">Setup Complete!</h2>
                <p className="text-lg text-gray-600">Thank you for providing your details. We are now personalizing your PrajaSeva experience.</p>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                <button onClick={handleFinishSetup} disabled={isLoading} className="group flex items-center mx-auto bg-[#D4AF37] hover:bg-[#b89b31] text-white font-bold py-3 px-8 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300 text-lg disabled:bg-gray-400">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Proceed to Dashboard'}
                  {!isLoading && <ArrowRight className="ml-3 h-6 w-6 transform group-hover:translate-x-1 transition-transform" />}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DynamicProfileSetup;
