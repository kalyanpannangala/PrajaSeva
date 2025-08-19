// app/profile/page.tsx
'use client';

import { useState } from 'react';
import type { NextPage } from 'next';
import { Edit3, Save, BotMessageSquare } from 'lucide-react';
import Header from '../../../components/Header'; // <-- Import the dedicated header

// Mock user data - In a real app, you'd fetch this
const MOCK_USER = {
  profile: {
    age: 32,
    gender: 'Male',
    state: 'Andhra Pradesh',
    caste: 'OBC',
    education_level: 'Postgraduate',
    employment_type: 'Private-employed',
    income: 950000,
    dependents: 2,
    disability_status: 'No',
  }
};

const ProfilePage: NextPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(MOCK_USER.profile);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen font-sans">
      <Header />

      {/* --- Main Content --- */}
      <main className="p-6 md:p-8 lg:p-10">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#003366]">My Profile</h1>
            <button 
                onClick={() => setIsEditing(!isEditing)} 
                className="flex items-center bg-white border border-gray-300 hover:bg-gray-100 text-[#003366] font-semibold py-2 px-5 rounded-lg transition-colors shadow-sm"
            >
                {isEditing ? <><Save className="mr-2 h-5 w-5"/>Save Changes</> : <><Edit3 className="mr-2 h-5 w-5"/>Edit Profile</>}
            </button>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200/80">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {Object.entries(profileData).map(([key, value]) => (
                    <div key={key}>
                        <label className="text-sm font-semibold text-gray-500 capitalize">{key.replace(/_/g, ' ')}</label>
                        <input 
                            name={key}
                            type={key === 'income' || key === 'age' || key === 'dependents' ? 'number' : 'text'} 
                            value={String(value)} 
                            readOnly={!isEditing} 
                            onChange={handleInputChange}
                            className={`w-full mt-1 p-3 text-lg rounded-lg border transition-all duration-300 ${isEditing ? 'border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#003366]' : 'border-transparent bg-gray-100 cursor-default'}`} 
                        />
                    </div>
                ))}
            </div>
            {isEditing && (
                <button className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg">
                    Re-run Analysis with New Data
                </button>
            )}
        </div>
      </main>

      {/* --- Floating AI Chatbot Button --- */}
      <button className="fixed bottom-8 right-8 bg-gradient-to-r from-[#003366] to-[#0055A4] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
        <BotMessageSquare className="h-8 w-8" />
      </button>
    </div>
  );
};

export default ProfilePage;
