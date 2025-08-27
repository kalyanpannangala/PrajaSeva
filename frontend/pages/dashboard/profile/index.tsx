// app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { Edit3, Save, BotMessageSquare, Loader2, AlertTriangle } from 'lucide-react';
import Header from '../../../components/Header'; 
import withAuth from '../../../components/withAuth';

// --- Define a type for the user's full profile from the API ---
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

// --- Define a separate type for the data displayed in the form ---
// This allows disability_status to be a string ('Yes'/'No') for the dropdown.
interface ProfileDisplayData extends Omit<UserProfile, 'disability_status'> {
    disability_status: 'Yes' | 'No' | null;
}


// --- Configuration for dropdown fields ---
const dropdownOptions = {
    gender: ['Male', 'Female', 'Other'],
    state: [
        'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
        'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa',
        'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka',
        'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
        'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
        'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
    ],
    caste: ['General', 'OBC', 'SC', 'ST'],
    education_level: ['Postgraduate', 'Graduate', 'Secondary', 'Un-educated', 'Other'],
    employment_type: ['Government-employed', 'Private-employed', 'Self-employed', 'Farmer', 'Student', 'Retired', 'Un-employed'],
    disability_status: ['No', 'Yes'],
};


const ProfilePage: NextPage = () => {
  const [isEditing, setIsEditing] = useState(false); // <-- FIX: Added the missing state
  const [profileData, setProfileData] = useState<Partial<ProfileDisplayData>>({});
  const [initialProfileData, setInitialProfileData] = useState<Partial<ProfileDisplayData>>({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
        
        // Convert boolean disability_status to "Yes"/"No" for the dropdown
        const displayData: ProfileDisplayData = {
            ...data,
            disability_status: data.disability_status ? 'Yes' : 'No'
        };

        setProfileData(displayData);
        setInitialProfileData(displayData);
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

      // Convert disability_status back to boolean before sending to API
      const dataToSend = {
          ...profileData,
          disability_status: profileData.disability_status === 'Yes'
      };

      try {
          const response = await fetch('/api/user/profile', {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(dataToSend)
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

    const fieldOrder: (keyof UserProfile)[] = [
      'email', 'full_name', 'age', 'gender', 'state', 'caste', 
      'education_level', 'employment_type', 'income', 'disability_status'
    ];

    return (
      <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200/80">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {fieldOrder.map((key) => {
            const value = profileData[key as keyof ProfileDisplayData];
            if (value === undefined) return null;

            const isPermanentlyReadOnly = key === 'email' || key === 'full_name';
            const isEditable = isEditing && !isPermanentlyReadOnly;
            const isDropdown = Object.keys(dropdownOptions).includes(key);

            return (
              <div key={key}>
                <label className="text-sm font-semibold text-gray-500 capitalize">{key.replace(/_/g, ' ')}</label>
                {isDropdown ? (
                    <select
                        name={key}
                        value={String(value) ?? ''}
                        disabled={!isEditable}
                        onChange={handleInputChange}
                        className={`w-full mt-1 p-3 text-lg rounded-lg border transition-all duration-300 ${isEditable ? 'border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#003366]' : 'border-transparent bg-gray-100 cursor-default appearance-none'}`}
                    >
                        {dropdownOptions[key as keyof typeof dropdownOptions].map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                ) : (
                    <input 
                        name={key}
                        type={key === 'income' || key === 'age' ? 'number' : 'text'} 
                        value={String(value) ?? ''} 
                        readOnly={!isEditable} 
                        onChange={handleInputChange}
                        className={`w-full mt-1 p-3 text-lg rounded-lg border transition-all duration-300 ${isEditable ? 'border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#003366]' : 'border-transparent bg-gray-100 cursor-default'}`} 
                    />
                )}
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
      
    </div>
  );
};


export default withAuth(ProfilePage);
