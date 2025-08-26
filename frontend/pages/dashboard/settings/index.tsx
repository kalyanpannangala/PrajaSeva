// pages/settings.tsx
'use client';

import { useState } from 'react';
import type { NextPage } from 'next';
import { KeyRound, BotMessageSquare } from 'lucide-react';
import Header from '../../../components/Header'; // Adjust path as needed
import { motion, AnimatePresence } from 'framer-motion';

const SettingsPage: NextPage = () => {
  // State for the change password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI State
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem('authToken');

    try {
      const res = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccessMessage(data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowChangePassword(false); // Hide form on success

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleChangePassword = () => {
    // Clear messages when toggling the form
    setError('');
    setSuccessMessage('');
    setShowChangePassword(!showChangePassword);
  }

  return (
    <div className="bg-[#F8F9FA] min-h-screen font-sans">
      <Header />

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
                    <button onClick={toggleChangePassword} className="flex items-center bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors">
                        <KeyRound className="mr-2 h-5 w-5"/>
                        {showChangePassword ? 'Cancel' : 'Update Password'}
                    </button>
                </div>
                
                {/* --- FIX: Success message is now outside the form --- */}
                {successMessage && !showChangePassword && (
                    <div className="mt-4 text-green-800 text-sm font-medium p-3 bg-green-50 rounded-lg">{successMessage}</div>
                )}

                <AnimatePresence>
                    {showChangePassword && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <form onSubmit={handleChangePassword} className="space-y-4 mt-6 border-t pt-6">
                                {error && <div className="text-red-600 text-sm font-medium p-3 bg-red-50 rounded-lg">{error}</div>}
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Current Password</label>
                                        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                                </div>
                                <div className="text-right">
                                    <button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors disabled:opacity-50">
                                        {isLoading ? 'Updating...' : 'Save New Password'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
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
    </div>
  );
};

export default SettingsPage;
