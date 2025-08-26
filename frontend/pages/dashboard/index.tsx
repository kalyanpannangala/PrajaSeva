// pages/dashboard.tsx
'use client';

import { useState, useEffect, FC } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Landmark, BarChart3, Zap, Loader2, AlertTriangle } from 'lucide-react';
import Header from '../../components/Header';
import FloatingChatbot from '../../components/FloatingChatbot';
import { useAuth } from '../../hooks/useAuth';
import { useIdleTimeout } from '../../hooks/useIdleTimeout';

// --- Type Definitions ---
interface SchemesSummary {
    total: number;
    central: number;
    state: number;
}
interface TaxSummary {
    tax_saving: number;
    recommended_regime: string;
}
interface WealthSummary {
    projected_corpus: number;
}
interface DashboardData {
    schemes: SchemesSummary | null;
    tax: TaxSummary | null;
    wealth: WealthSummary | null;
}

// --- Reusable Card Component for dynamic content and empty states ---
const DashboardCard: FC<{
    title: string;
    icon: React.ReactNode;
    data: any;
    link: string;
    linkText: string;
    children: React.ReactNode;
}> = ({ title, icon, data, link, linkText, children }) => {
    const router = useRouter();
    return (
        // --- FIX: Added onClick handler and cursor-pointer to make the whole card clickable ---
        <div 
            onClick={() => router.push(link)}
            className="bg-white p-8 rounded-xl shadow-lg border border-gray-200/80 flex flex-col transform hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative cursor-pointer"
        >
            <div className="flex items-center mb-4">
                {icon}
                <h2 className="text-xl font-bold text-[#003366]">{title}</h2>
            </div>
            <div className="text-gray-700 text-lg leading-relaxed flex-1">
                {children}
            </div>
            {!data && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center text-center p-4">
                    <p className="font-semibold text-gray-700 mb-2">No data yet.</p>
                    <p className="text-sm text-gray-500 mb-4">Use the {title} tool to get personalized recommendations.</p>
                    {/* This button is now primarily for visual cue; the whole card is clickable */}
                    <div className="bg-[#003366] text-white font-semibold py-2 px-4 rounded-lg text-sm">
                        {linkText}
                    </div>
                </div>
            )}
        </div>
    );
};


const DashboardPage: NextPage = () => {
  const isAuthenticated = useAuth(); // Protects the route
  useIdleTimeout(15 * 60 * 1000); // Set a 15-minute inactivity timeout

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (isAuthenticated) {
        const token = localStorage.getItem('authToken');
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('/api/dashboard/summary', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed to load dashboard data.');
                setDashboardData(await res.json());
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }
  }, [isAuthenticated]);

  // Show a loading screen while the auth check is happening
  if (!isAuthenticated) {
    return (
        <div className="bg-[#F8F9FA] min-h-screen flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#003366]" />
        </div>
    );
  }

  const renderContent = () => {
    if (isLoading) {
        return <div className="text-center py-20"><Loader2 className="h-12 w-12 mx-auto animate-spin text-[#003366]" /></div>;
    }
    if (error) {
        return <div className="text-center py-20 text-red-600"><AlertTriangle className="h-12 w-12 mx-auto mb-4" /><p>{error}</p></div>;
    }
    if (!dashboardData) {
        return <div className="text-center py-20 text-gray-600">Could not load dashboard information.</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <DashboardCard 
                title="Government Schemes" 
                icon={<div className="p-3 bg-blue-100 rounded-lg mr-4"><Landmark className="h-8 w-8 text-[#003366]" /></div>}
                data={dashboardData.schemes}
                link="/dashboard/schemes"
                linkText="Find Schemes"
            >
                {dashboardData.schemes ? (
                    <>
                        You are eligible for <strong className="text-2xl font-bold text-[#0055A4]">{dashboardData.schemes.total}</strong> schemes.
                        <div className="text-sm mt-2 space-y-1">
                            <p><strong>{dashboardData.schemes.central}</strong> Central Government Schemes</p>
                            <p><strong>{dashboardData.schemes.state}</strong> Andhra Pradesh Schemes</p>
                        </div>
                    </>
                ) : <p>Use our AI recommender to find schemes you're eligible for.</p>}
            </DashboardCard>

            <DashboardCard 
                title="Tax Advisory" 
                icon={<div className="p-3 bg-green-100 rounded-lg mr-4"><BarChart3 className="h-8 w-8 text-green-800" /></div>}
                data={dashboardData.tax}
                link="/dashboard/tax"
                linkText="Analyze Tax"
            >
                {dashboardData.tax ? (
                    <p>We project you can save <strong className="text-2xl font-bold text-green-700">₹{Number(dashboardData.tax.tax_saving).toLocaleString('en-IN')}</strong> by switching to the {dashboardData.tax.recommended_regime}.</p>
                ) : <p>Analyze your income to find the best tax-saving options.</p>}
            </DashboardCard>

            <DashboardCard 
                title="Wealth Advisory" 
                icon={<div className="p-3 bg-yellow-100 rounded-lg mr-4"><Zap className="h-8 w-8 text-yellow-800" /></div>}
                data={dashboardData.wealth}
                link="/dashboard/wealth"
                linkText="Plan Wealth"
            >
                {dashboardData.wealth ? (
                    <p>Your projected retirement corpus is <strong className="text-2xl font-bold text-yellow-800">₹{Number(dashboardData.wealth.projected_corpus).toLocaleString('en-IN')}</strong>.</p>
                ) : <p>Get a personalized investment plan to grow your savings.</p>}
            </DashboardCard>
        </div>
    );
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen font-sans">
      <Header />
      <main className="p-6 md:p-8 lg:p-10">
        <h1 className="text-3xl font-bold text-[#003366] mb-6">Your Personal Dashboard</h1>
        {renderContent()}
      </main>
      <FloatingChatbot />
    </div>
  );
};

export default DashboardPage;
