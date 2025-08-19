// app/schemes/page.tsx
'use client';

import { useState, useEffect, FC } from 'react';
import type { NextPage } from 'next';
import { 
  ShieldCheck, HeartHandshake, Briefcase, Home, GraduationCap, LucideProps, 
  AlertTriangle, Loader2, BotMessageSquare 
} from 'lucide-react';
import Header from '../../../components/Header'; // <-- Import the dedicated header

// --- TYPE DEFINITIONS & MOCK API DATA ---
interface Scheme {
    name: string;
    category: string;
    description: string;
    icon: string; 
}

const iconComponents: { [key: string]: FC<LucideProps> } = {
    ShieldCheck, HeartHandshake, Briefcase, Home, GraduationCap,
};

const MOCK_API_RESPONSE = [
    { name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana', category: 'Insurance', description: 'Life insurance scheme offering coverage of ₹2 lakh.', icon: 'ShieldCheck' },
    { name: 'Sukanya Samriddhi Yojana', category: 'Savings', description: 'A small deposit scheme for the girl child as part of the Beti Bachao Beti Padhao campaign.', icon: 'HeartHandshake' },
    { name: 'Atal Pension Yojana', category: 'Pension', description: 'A pension scheme focused on the unorganized sector.', icon: 'Briefcase' },
    { name: 'PM Awas Yojana', category: 'Housing', description: 'An initiative to provide affordable housing to the urban poor.', icon: 'Home' },
    { name: 'National Scholarship Portal', category: 'Education', description: 'A unified portal for students to apply for various educational scholarships.', icon: 'GraduationCap' },
];

const SchemesPage: NextPage = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchemes = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
            const data = MOCK_API_RESPONSE;
            setSchemes(data);
        } catch (err) {
            setError('Could not load eligible schemes. Please try again later.');
        } finally {
            setLoading(false);
        }
    };
    fetchSchemes();
  }, []);

  return (
    // THIS IS THE FIX: The root div does NOT have the 'flex' class
    <div className="bg-[#F8F9FA] min-h-screen font-sans">
      <Header />

      <main className="p-6 md:p-8 lg:p-10">
        <h1 className="text-3xl font-bold text-[#003366] mb-6">Eligible Government Schemes</h1>
        {loading && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Loader2 className="h-12 w-12 animate-spin mb-4 text-[#003366]" />
                <p className="text-lg font-semibold">Finding eligible schemes for you...</p>
            </div>
        )}
        {error && (
            <div className="flex flex-col items-center justify-center h-64 text-red-600 bg-red-50 p-8 rounded-xl">
                <AlertTriangle className="h-12 w-12 mb-4" />
                <p className="text-lg font-bold">An Error Occurred</p>
                <p>{error}</p>
            </div>
        )}
        {!loading && !error && (
            schemes.length > 0 ? (
                <div className="space-y-6">
                    {schemes.map(scheme => {
                        const IconComponent = iconComponents[scheme.icon] || ShieldCheck;
                        return (
                            <div key={scheme.name} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200/80 flex items-start space-x-6 transform hover:shadow-xl hover:-translate-y-1 transition-all">
                                <div className="p-3 bg-blue-100 rounded-lg"><IconComponent className="h-8 w-8 text-[#003366]" /></div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-[#003366]">{scheme.name}</h3>
                                    <p className="text-gray-600 mt-1">{scheme.description}</p>
                                </div>
                                <button className="bg-[#D4AF37] hover:bg-[#b89b31] text-white font-semibold py-2 px-5 rounded-lg transition-colors">Apply Now</button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200/80">
                    <h2 className="text-2xl font-bold text-[#003366]">No Schemes Found</h2>
                    <p className="text-gray-600 mt-2">Based on your profile, we couldn't find any matching government schemes at the moment.</p>
                </div>
            )
        )}
      </main>

      {/* --- Floating AI Chatbot Button --- */}
      <button className="fixed bottom-8 right-8 bg-gradient-to-r from-[#003366] to-[#0055A4] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
        <BotMessageSquare className="h-8 w-8" />
      </button>
    </div>
  );
};

export default SchemesPage;
