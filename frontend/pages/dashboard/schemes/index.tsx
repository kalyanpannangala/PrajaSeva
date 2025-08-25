// pages/schemes.tsx
'use client';

import { useState, useEffect, FC } from 'react';
import type { NextPage } from 'next';
import Header from '../../../components/Header';
import { 
  Landmark, AlertTriangle, BotMessageSquare, 
  RefreshCw, User, Info, Edit, Loader2, CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode'; // <-- Import the JWT decode library

// --- Type Definitions ---
interface Scheme {
    scheme_id: string;
    scheme_name: string;
}
interface UserProfile {
    age: number;
    gender: string;
    state: string;
    caste: string;
    education_level: string;
    employment_type: string;
    income: number;
    disability_status: boolean;
}

// --- Profile Snapshot Component ---
const ProfileSnapshot: FC<{ profile: Partial<UserProfile>; onAnalyze: () => void; hasResults: boolean; isLoading: boolean }> = ({ profile, onAnalyze, hasResults, isLoading }) => {
    const profileItems = [
        { label: 'Age', value: profile.age }, { label: 'Gender', value: profile.gender },
        { label: 'State', value: profile.state }, { label: 'Caste', value: profile.caste },
        { label: 'Income', value: profile.income ? `₹${Number(profile.income).toLocaleString('en-IN')}` : 'N/A' },
        { label: 'Employment', value: profile.employment_type }, { label: 'Education', value: profile.education_level },
        { label: 'Disability', value: profile.disability_status ? 'Yes' : 'No' },
    ];
    return (
        <div className="mb-8 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-[#003366]">Your Profile Snapshot</h2>
                <Link href="/profile" className="flex items-center text-sm font-medium text-[#0055A4] hover:text-[#003366]">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit Full Profile
                </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3">
                {profileItems.map(item => (
                    <div key={item.label}>
                        <p className="text-sm text-gray-500">{item.label}</p>
                        <p className="text-base font-semibold text-[#003366] truncate">{item.value}</p>
                    </div>
                ))}
            </div>
            {hasResults && (
                <button onClick={onAnalyze} disabled={isLoading} className="mt-6 w-full md:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400">
                    <RefreshCw className={`mr-2 h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Analyzing...' : 'Re-analyze'}
                </button>
            )}
        </div>
    );
};


const SchemesPage: NextPage = () => {
    const [schemes, setSchemes] = useState<Scheme[]>([]);
    const [profileData, setProfileData] = useState<Partial<UserProfile>>({});
    const [pageState, setPageState] = useState<'loading' | 'displaying' | 'error'>('loading');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisStatus, setAnalysisStatus] = useState('');
    const router = useRouter();
    const [isVerifyingAuth, setIsVerifyingAuth] = useState(true); // <-- New state for auth check

    const startAnalysis = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError("Authentication token not found. Please log in.");
            setPageState('error');
            return;
        }

        setIsAnalyzing(true);
        setError(null);
        setSchemes([]); // Clear old schemes before starting

        try {
            const response = await fetch("https://kalyanpannangala-prajaseva.hf.space/schemes/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(profileData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `Server error: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                setError(data.error);
                setPageState("error");
            } else if (data.eligible_schemes) {
                const mappedSchemes = data.eligible_schemes.map((s: any) => ({
                    scheme_id: s.id,
                    scheme_name: s.name,
                }));
                setSchemes(mappedSchemes || []);
                setPageState("displaying");
            }
        } catch (err: any) {
            setError(err.message || "Failed to analyze profile.");
            setPageState("error");
        } finally {
            setIsAnalyzing(false);
        }
    };

    useEffect(() => {
        let statusInterval: NodeJS.Timeout;
        if (isAnalyzing) {
            const statuses = [
                "Connecting to analysis server...",
                "Fetching your profile...",
                "Running PrajaSeva AI model...",
                "Validating results...",
                "Finalizing recommendations..."
            ];
            let currentStatusIndex = 0;
            setAnalysisStatus(statuses[currentStatusIndex]);

            statusInterval = setInterval(() => {
                currentStatusIndex++;
                if (currentStatusIndex < statuses.length) {
                    setAnalysisStatus(statuses[currentStatusIndex]);
                }
            }, 1500);
        }
        return () => clearInterval(statusInterval);
    }, [isAnalyzing]);

    useEffect(() => {
        // --- NEW: Authentication Check ---
        const token = localStorage.getItem('authToken');
        if (!token) {
            router.push('/auth');
            return;
        }
        
        try {
            const decodedToken: { exp: number } = jwtDecode(token);
            if (decodedToken.exp * 1000 < Date.now()) {
                // Token is expired
                localStorage.removeItem('authToken');
                router.push('/auth');
                return;
            }
        } catch (error) {
            // Invalid token
            localStorage.removeItem('authToken');
            router.push('/auth');
            return;
        }
        
        setIsVerifyingAuth(false); // Auth check passed

        // --- Fetch initial data ---
        const fetchInitialData = async () => {
            setPageState('loading');
            try {
                const [profileRes, schemesRes] = await Promise.all([
                    fetch('/api/user/profile', { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch('/api/schemes/results', { headers: { 'Authorization': `Bearer ${token}` } })
                ]);
                if (profileRes.ok) { setProfileData(await profileRes.json()); } else { throw new Error('Could not fetch user profile.'); }
                
                if (schemesRes.ok) {
                    const result = await schemesRes.json();
                    if (result.status === 'found') {
                        setSchemes(result.data);
                    } else {
                        setSchemes([]);
                    }
                } else {
                    console.error("Failed to fetch schemes results.");
                    setSchemes([]);
                }
                setPageState('displaying');
            } catch (err: any) {
                setError(err.message || "Could not load your data.");
                setPageState('error');
            }
        };
        
        fetchInitialData();
    }, [router]);
    
    // --- Show a loading screen while verifying auth ---
    if (isVerifyingAuth) {
        return (
            <div className="bg-[#F8F9FA] min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-[#003366]" />
            </div>
        );
    }
    
    const renderContent = () => {
        // ... (rest of the render logic)
        switch (pageState) {
            case 'loading':
                return <div className="text-center py-20 text-lg font-semibold text-gray-600">Loading your information...</div>;
            case 'error':
                return <div className="flex flex-col items-center justify-center h-64 text-red-600 bg-red-50 p-8 rounded-xl"><AlertTriangle className="h-12 w-12 mb-4" /><p className="text-lg font-bold">An Error Occurred</p><p>{error}</p></div>;
            case 'displaying':
                if (isAnalyzing) {
                    return (
                        <div className="bg-white p-8 rounded-xl shadow-lg border">
                            <div className="flex items-center justify-center mb-6">
                                <Loader2 className="h-8 w-8 animate-spin text-[#003366]" />
                                <h2 className="text-2xl font-bold text-[#003366] ml-4">Analyzing Your Profile...</h2>
                            </div>
                            <div className="text-center text-lg text-gray-600 h-8">
                                <p>{analysisStatus}</p>
                            </div>
                        </div>
                    );
                }

                const sortedSchemes = [...schemes].sort((a, b) => {
                    const aIsAP = a.scheme_id.startsWith('AP');
                    const bIsAP = b.scheme_id.startsWith('AP');
                    if (aIsAP && !bIsAP) return -1;
                    if (!aIsAP && bIsAP) return 1;
                    return a.scheme_name.localeCompare(b.scheme_name);
                });

                return sortedSchemes.length > 0 ? (
                    <div className="space-y-6">
                        {sortedSchemes.map((scheme) => {
                            let logoSrc = '';
                            if (scheme.scheme_id.startsWith('C')) {
                                logoSrc = '/GOI-logo.jpg';
                            } else if (scheme.scheme_id.startsWith('AP')) {
                                logoSrc = '/ap-logo.png';
                            }

                            return (
                                <div key={scheme.scheme_id} className="bg-white p-6 rounded-xl shadow-lg border flex items-center space-x-6">
                                    <div className="p-2 bg-white rounded-lg border border-gray-200 flex-shrink-0">
                                        {logoSrc ? (
                                            <img src={logoSrc} alt="Scheme Logo" className="h-10 w-10 object-contain" />
                                        ) : (
                                            <Landmark className="h-10 w-10 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-[#003366]">{scheme.scheme_name}</h3>
                                    </div>
                                    <button className="bg-[#D4AF37] hover:bg-[#b89b31] text-white font-semibold py-2 px-5 rounded-lg">View Details</button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl shadow-lg border">
                        <Info className="h-12 w-12 mx-auto text-blue-500 mb-4" />
                        <h2 className="text-2xl font-bold text-[#003366]">Find Your Eligible Schemes</h2>
                        <p className="text-gray-600 mt-2 max-w-xl mx-auto">Your profile snapshot is shown above. Click the button below to run the PrajaSeva AI analysis.</p>
                        <button onClick={startAnalysis} className="mt-6 flex items-center mx-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg">
                            <RefreshCw className="mr-2 h-5 w-5" /> Analyze Now
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="bg-[#F8F9FA] min-h-screen font-sans">
            <Header />
            <main className="p-6 md:p-8 lg:p-10">
                <h1 className="text-4xl font-extrabold text-[#003366] mb-8">Eligible Government Schemes</h1>
                
                {pageState !== 'loading' && pageState !== 'error' && (
                    <ProfileSnapshot 
                        profile={profileData} 
                        onAnalyze={startAnalysis}
                        hasResults={schemes.length > 0}
                        isLoading={isAnalyzing}
                    />
                )}

                {renderContent()}
            </main>
            <BotMessageSquare className="fixed bottom-8 right-8 h-16 w-16" />
        </div>
    );
};

export default SchemesPage;
