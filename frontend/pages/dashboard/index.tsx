// app/dashboard/page.tsx
'use client';

import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { Landmark, BarChart3, Zap, ArrowRight, BotMessageSquare } from 'lucide-react';
import Header from '../../components/Header'; // <-- IMPORT THE DEDICATED HEADER

const DashboardPage: NextPage = () => {
  const router = useRouter();

  return (
    <div className="bg-[#F8F9FA] min-h-screen font-sans">
      <Header /> {/* <-- USE THE HEADER COMPONENT HERE */}

      {/* --- Main Content --- */}
      <main className="p-6 md:p-8 lg:p-10">
        <h1 className="text-3xl font-bold text-[#003366] mb-6">Your Personal Dashboard</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- Govt. Schemes Card --- */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200/80 flex flex-col transform hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg mr-4"><Landmark className="h-8 w-8 text-[#003366]" /></div>
              <h2 className="text-xl font-bold text-[#003366]">Government Schemes</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed flex-1">
              You appear to be eligible for <strong className="text-2xl font-bold text-[#0055A4]">5</strong> key schemes. The top match is <em className="font-semibold">Pradhan Mantri Jeevan Jyoti Bima Yojana.</em>
            </p>
            <button onClick={() => router.push('/dashboard/schemes')} className="group mt-6 flex items-center justify-center w-full bg-[#003366] hover:bg-[#002244] text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-300">
              View All Schemes <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* --- Tax Advisory Card --- */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200/80 flex flex-col transform hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg mr-4"><BarChart3 className="h-8 w-8 text-green-800" /></div>
              <h2 className="text-xl font-bold text-[#003366]">Tax Advisory</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed flex-1">
              We project you can save <strong className="text-2xl font-bold text-green-700">₹15,200</strong> by switching to the New Tax Regime.
            </p>
            <button onClick={() => router.push('/dashboard/tax')} className="group mt-6 flex items-center justify-center w-full bg-[#003366] hover:bg-[#002244] text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-300">
              Optimize My Tax <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* --- Wealth Advisory Card --- */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200/80 flex flex-col transform hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg mr-4"><Zap className="h-8 w-8 text-yellow-800" /></div>
              <h2 className="text-xl font-bold text-[#003366]">Wealth Advisory</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed flex-1">
              Your current portfolio risk is <strong className="text-2xl font-bold text-yellow-800">'Medium'</strong>. We have suggestions to align it with your 'Growth' goals.
            </p>
            <button onClick={() => router.push('/dashboard/wealth')} className="group mt-6 flex items-center justify-center w-full bg-[#003366] hover:bg-[#002244] text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-300">
              Explore Investment Plans <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </main>

      {/* --- Floating AI Chatbot Button --- */}
      <button onClick={() => router.push('/chatbot')} className="fixed bottom-8 right-8 bg-gradient-to-r from-[#003366] to-[#0055A4] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
        <BotMessageSquare className="h-8 w-8" />
      </button>
    </div>
  );
};

export default DashboardPage;
