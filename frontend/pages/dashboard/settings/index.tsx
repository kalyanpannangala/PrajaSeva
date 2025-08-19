// app/settings/page.tsx
'use client';

import type { NextPage } from 'next';
import { BotMessageSquare, KeyRound } from 'lucide-react';
import Header from '../../../components/Header'; // <-- Import the dedicated header

const SettingsPage: NextPage = () => {
  return (
    <div className="bg-[#F8F9FA] min-h-screen font-sans">
      <Header />

      {/* --- Main Content --- */}
      <main className="p-6 md:p-8 lg:p-10">
        <h1 className="text-3xl font-bold text-[#003366] mb-8">Settings</h1>
        
        <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200/80 max-w-4xl mx-auto space-y-10">
            
            {/* --- Notifications Section --- */}
            <div>
                <h2 className="text-xl font-bold text-[#003366] mb-4 border-b pb-3">Notifications</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-700">Email Notifications for New Schemes</p>
                        <button className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium">Enabled</button>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-gray-700">Monthly Financial Summary Report</p>
                        <button className="bg-gray-200 text-gray-600 px-4 py-1 rounded-full text-sm font-medium">Disabled</button>
                    </div>
                </div>
            </div>

            {/* --- Security Section --- */}
            <div>
                <h2 className="text-xl font-bold text-[#003366] mb-4 border-b pb-3">Security</h2>
                <div className="flex items-center justify-between">
                    <p className="text-gray-700">Change Password</p>
                    <button className="flex items-center bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors">
                        <KeyRound className="mr-2 h-5 w-5"/>Update Password
                    </button>
                </div>
            </div>

             {/* --- Data Management Section --- */}
             <div>
                <h2 className="text-xl font-bold text-[#003366] mb-4 border-b pb-3">Data Management</h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-700 font-semibold">Export Your Data</p>
                        <p className="text-sm text-gray-500">Download a copy of your profile and financial data.</p>
                    </div>
                    <button className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors">
                        Export Data
                    </button>
                </div>
                 <div className="flex items-center justify-between mt-6 border-t pt-6 border-red-200">
                    <div>
                        <p className="text-red-700 font-semibold">Delete Account</p>
                        <p className="text-sm text-gray-500">Permanently delete your account and all associated data.</p>
                    </div>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors">
                        Delete
                    </button>
                </div>
            </div>

        </div>
      </main>

      {/* --- Floating AI Chatbot Button --- */}
      <button className="fixed bottom-8 right-8 bg-gradient-to-r from-[#003366] to-[#0055A4] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
        <BotMessageSquare className="h-8 w-8" />
      </button>
    </div>
  );
};

export default SettingsPage;
