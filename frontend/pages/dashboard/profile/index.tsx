// app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { Edit3, Save, BotMessageSquare, Loader2, AlertTriangle } from 'lucide-react';
import Header from '../../../components/Header'; 

// --- Define a type for the user's full profile ---
interface UserProfile {
  full_name: string;
  email: string;
  age: number | null;
  gender: string | null;
  state: string | null;
  caste: string | null;
  education_level: string | null;
  employment_type: string | null;
  income: number | null;
  disability_status: boolean | null;
}

const ProfilePage: NextPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<Partial<UserProfile>>({});
  const [initialProfileData, setInitialProfileData] = useState<Partial<UserProfile>>({});
  
  // --- UI State ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // --- Fetch user profile data on page load ---
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError("You are not logged in.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch profile data.');
        }
        const data: UserProfile = await response.json();
        setProfileData(data);
        setInitialProfileData(data); // Store initial state for cancel
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      const token = localStorage.getItem('authToken');

      try {
          const response = await fetch('/api/user/profile', {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(profileData)
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message);

          setSuccessMessage('Profile updated successfully!');
          setInitialProfileData(profileData);
          setIsEditing(false);
      } catch (err: any) {
          setError(err.message);
      } finally {
          setIsLoading(false);
      }
  };

  const handleCancel = () => {
      setProfileData(initialProfileData);
      setIsEditing(false);
  }

  const renderContent = () => {
    if (isLoading && !profileData.email) {
      return <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-[#003366]" /></div>;
    }
    if (error) {
      return <div className="flex flex-col items-center justify-center h-64 text-red-600 bg-red-50 p-8 rounded-xl"><AlertTriangle className="h-12 w-12 mb-4" /><p className="text-lg font-bold">An Error Occurred</p><p>{error}</p></div>;
    }

    // --- Define the display order for fields ---
    const fieldOrder: (keyof UserProfile)[] = [
      'email',
      'full_name',
      'age',
      'gender',
      'state',
      'caste',
      'education_level',
      'employment_type',
      'income',
      'disability_status'
    ];

    return (
      <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200/80">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {fieldOrder.map((key) => {
            const value = profileData[key];
            if (value === undefined) return null;

            // --- FIX: Determine if the field should be permanently read-only ---
            const isPermanentlyReadOnly = key === 'email' || key === 'full_name';
            const isEditable = isEditing && !isPermanentlyReadOnly;

            return (
              <div key={key}>
                <label className="text-sm font-semibold text-gray-500 capitalize">{key.replace(/_/g, ' ')}</label>
                <input 
                  name={key}
                  type={key === 'income' || key === 'age' ? 'number' : (key === 'email' ? 'email' : 'text')} 
                  value={value !== null ? String(value) : ''} 
                  readOnly={!isEditable} 
                  onChange={handleInputChange}
                  className={`w-full mt-1 p-3 text-lg rounded-lg border transition-all duration-300 ${
                    isEditable
                      ? 'border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#003366]' 
                      : 'border-transparent bg-gray-100 cursor-default'
                  }`} 
                />
              </div>
            );
          })}
        </div>
        {isEditing && (
            <div className="mt-8 flex items-center space-x-4">
                <button onClick={handleSaveChanges} disabled={isLoading} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg disabled:bg-gray-400">
                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Save Changes'}
                </button>
                 <button onClick={handleCancel} className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors">
                    Cancel
                </button>
            </div>
        )}
         {!isEditing && (
            <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg">
                Re-run Analysis
            </button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen font-sans">
      <Header />
      <main className="p-6 md:p-8 lg:p-10">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#003366]">My Profile</h1>
            {!isLoading && !error && (
                <button onClick={() => setIsEditing(!isEditing)} disabled={isEditing} className="flex items-center bg-white border border-gray-300 hover:bg-gray-100 text-[#003366] font-semibold py-2 px-5 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                    <Edit3 className="mr-2 h-5 w-5"/>Edit Profile
                </button>
            )}
        </div>
        {successMessage && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-center">{successMessage}</div>}
        {renderContent()}
      </main>
      <button className="fixed bottom-8 right-8 bg-gradient-to-r from-[#003366] to-[#0055A4] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
        <BotMessageSquare className="h-8 w-8" />
      </button>
    </div>
  );
};

export default ProfilePage;
