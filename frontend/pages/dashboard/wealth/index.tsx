// pages/wealth-advisory.tsx
'use client';

import { useState, useEffect, FC } from 'react';
import type { NextPage } from 'next';
import Header from '../../../components/Header';
import { BotMessageSquare, Loader2, AlertTriangle, Info, Edit, RefreshCw, TrendingUp, ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import FloatingChatbot from '../../../components/FloatingChatbot';
import withAuth from '../../../components/withAuth';

// --- Type Definitions ---
interface WealthInput {
    user_age: number;
    retirement_age: number;
    current_savings: number;
    monthly_investment: number;
    expected_return: number;
    risk_tolerance: string;
    liquidity: string;
    annual_step_up: number;
}
interface WealthResult {
    projected_corpus: string;
    inflation_adjusted_corpus: string;
    projection_data: { year: number; closing_capital: string }[];
    recommended_schemes: { scheme_name: string; confidence: number }[];
}

// --- Input Snapshot Component ---
const WealthInputSnapshot: FC<{ inputData: Partial<WealthInput>; onReanalyze: () => void; isAnalyzing: boolean; showEditor: boolean; setShowEditor: (show: boolean) => void; handleInputChange: (e: any) => void; }> = ({ inputData, onReanalyze, isAnalyzing, showEditor, setShowEditor, handleInputChange }) => {
    return (
        <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200/80">
            <button onClick={() => setShowEditor(!showEditor)} className="w-full flex justify-between items-center text-left">
                <div className="flex items-center">
                    <Edit className="h-6 w-6 text-[#003366] mr-4" />
                    <div>
                        <h2 className="text-xl font-bold text-[#003366]">Your Wealth Input</h2>
                        <p className="text-gray-500">Click to view or edit your financial data for a new analysis.</p>
                    </div>
                </div>
                <ChevronDown className={`h-6 w-6 transition-transform ${showEditor ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
            {showEditor && (
                <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="overflow-hidden">
                    <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div><label className="text-sm font-medium text-gray-700">Your Current Age</label><input type="number" name="user_age" value={inputData.user_age ?? ''} onChange={handleInputChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/></div>
                        <div><label className="text-sm font-medium text-gray-700">Target Retirement Age</label><input type="number" name="retirement_age" value={inputData.retirement_age ?? ''} onChange={handleInputChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/></div>
                        <div><label className="text-sm font-medium text-gray-700">Current Savings (₹)</label><input type="number" name="current_savings" value={inputData.current_savings ?? ''} onChange={handleInputChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/></div>
                        <div><label className="text-sm font-medium text-gray-700">Monthly Investment (₹)</label><input type="number" name="monthly_investment" value={inputData.monthly_investment ?? ''} onChange={handleInputChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/></div>
                        <div><label className="text-sm font-medium text-gray-700">Expected Annual Return (%)</label><input type="number" name="expected_return" value={inputData.expected_return ?? ''} onChange={handleInputChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/></div>
                        <div><label className="text-sm font-medium text-gray-700">Annual Investment Step-up (%)</label><input type="number" name="annual_step_up" value={inputData.annual_step_up ?? ''} onChange={handleInputChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/></div>
                        <div><label className="text-sm font-medium text-gray-700">Risk Tolerance</label><select name="risk_tolerance" value={inputData.risk_tolerance ?? 'Medium'} onChange={handleInputChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"><option>Low</option><option>Medium</option><option>High</option></select></div>
                        <div><label className="text-sm font-medium text-gray-700">Liquidity Preference</label><select name="liquidity" value={inputData.liquidity ?? 'Medium'} onChange={handleInputChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"><option>Low</option><option>Medium</option><option>High</option></select></div>
                    </div>
                    <button onClick={onReanalyze} disabled={isAnalyzing} className="mt-4 flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">
                        <RefreshCw className={`mr-2 h-5 w-5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                        {isAnalyzing ? 'Analyzing...' : 'Save & Re-analyze'}
                    </button>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};


const WealthAdvisoryPage: NextPage = () => {
    const [wealthInput, setWealthInput] = useState<Partial<WealthInput>>({});
    const [wealthResult, setWealthResult] = useState<WealthResult | null>(null);
    const [pageState, setPageState] = useState<'loading' | 'input_form' | 'displaying' | 'error'>('loading');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showEditor, setShowEditor] = useState(false);
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) { router.push('/auth'); return; }
        try {
            const decoded: { exp: number } = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem('authToken');
                router.push('/auth');
                return;
            }
            setIsAuthenticated(true);
        } catch (e) {
            localStorage.removeItem('authToken');
            router.push('/auth');
        }
    }, [router]);

    useEffect(() => {
        if (!isAuthenticated) return;
        const fetchWealthData = async () => {
            setPageState('loading');
            const token = localStorage.getItem('authToken');
            try {
                const inputRes = await fetch('/api/wealth/input', { headers: { 'Authorization': `Bearer ${token}` } });
                if (inputRes.status === 404) {
                    setPageState('input_form');
                    return;
                }
                if (!inputRes.ok) throw new Error('Could not fetch wealth input data.');
                const inputData = await inputRes.json();
                setWealthInput(inputData);

                const resultRes = await fetch('/api/wealth/results', { headers: { 'Authorization': `Bearer ${token}` } });
                if (resultRes.ok) {
                    setWealthResult(await resultRes.json());
                }
                setPageState('displaying');
            } catch (err: any) {
                setError(err.message);
                setPageState('error');
            }
        };
        fetchWealthData();
    }, [isAuthenticated]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setWealthInput(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveAndAnalyze = async () => {
        const token = localStorage.getItem('authToken');
        setIsAnalyzing(true);
        setError(null);
        try {
            await fetch('/api/wealth/input', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(wealthInput)
            });
            const analysisRes = await fetch('https://kalyanpannangala-prajaseva.hf.space/wealth/predict', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!analysisRes.ok) {
                const errorData = await analysisRes.json();
                throw new Error(errorData.detail || 'Analysis failed.');
            }
            setWealthResult(await analysisRes.json());
            setPageState('displaying');
            setShowEditor(false);
        } catch (err: any) {
            setError(err.message);
            setPageState('error');
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    const renderContent = () => {
        if (!isAuthenticated || pageState === 'loading') {
            return <div className="text-center py-20"><Loader2 className="h-12 w-12 mx-auto animate-spin text-[#003366]" /></div>;
        }
        if (pageState === 'error') {
            return <div className="flex flex-col items-center justify-center h-64 text-red-600 bg-red-50 p-8 rounded-xl"><AlertTriangle className="h-12 w-12 mb-4" /><p className="text-lg font-bold">An Error Occurred</p><p>{error}</p></div>;
        }
        if (pageState === 'input_form') {
            return (
                <div className="bg-white p-8 rounded-xl shadow-2xl border">
                    <h2 className="text-2xl font-bold text-[#003366] mb-2">Enter Your Wealth Goals</h2>
                    <p className="text-gray-600 mb-6">Provide this information for a personalized investment plan.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {/* --- FIX: Added dark text color to labels --- */}
                        <div><label className="text-sm font-medium text-gray-700">Your Current Age</label><input type="number" name="user_age" onChange={handleInputChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/></div>
                        <div><label className="text-sm font-medium text-gray-700">Target Retirement Age</label><input type="number" name="retirement_age" onChange={handleInputChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/></div>
                        <div><label className="text-sm font-medium text-gray-700">Current Savings (₹)</label><input type="number" name="current_savings" onChange={handleInputChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/></div>
                        <div><label className="text-sm font-medium text-gray-700">Monthly Investment (₹)</label><input type="number" name="monthly_investment" onChange={handleInputChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/></div>
                        <div><label className="text-sm font-medium text-gray-700">Expected Annual Return (%)</label><input type="number" name="expected_return" onChange={handleInputChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/></div>
                        <div><label className="text-sm font-medium text-gray-700">Annual Investment Step-up (%)</label><input type="number" name="annual_step_up" onChange={handleInputChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/></div>
                        <div><label className="text-sm font-medium text-gray-700">Risk Tolerance</label><select name="risk_tolerance" defaultValue="Medium" onChange={handleInputChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"><option>Low</option><option>Medium</option><option>High</option></select></div>
                        <div><label className="text-sm font-medium text-gray-700">Liquidity Preference</label><select name="liquidity" defaultValue="Medium" onChange={handleInputChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"><option>Low</option><option>Medium</option><option>High</option></select></div>
                    </div>
                    <button onClick={handleSaveAndAnalyze} disabled={isAnalyzing} className="mt-6 flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg">
                        {isAnalyzing ? <Loader2 className="mr-2 h-5 w-5 animate-spin"/> : <RefreshCw className="mr-2 h-5 w-5" />}
                        {isAnalyzing ? 'Analyzing...' : 'Save & Analyze'}
                    </button>
                </div>
            );
        }
        if (pageState === 'displaying' && wealthResult) {
            const chartData = wealthResult.projection_data.map(d => ({...d, closing_capital: parseFloat(d.closing_capital.replace(/,/g, ''))}));
            return (
                <div className="space-y-8">
                    <WealthInputSnapshot inputData={wealthInput} onReanalyze={handleSaveAndAnalyze} isAnalyzing={isAnalyzing} showEditor={showEditor} setShowEditor={setShowEditor} handleInputChange={handleInputChange} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="bg-white p-6 rounded-xl shadow-lg border">
                            <p className="text-gray-500">Projected Retirement Corpus</p>
                            <p className="text-4xl font-bold text-[#003366]">₹{wealthResult.projected_corpus}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-lg border">
                            <p className="text-gray-500">Value in Today's Money (Inflation Adjusted)</p>
                            <p className="text-4xl font-bold text-green-700">₹{wealthResult.inflation_adjusted_corpus}</p>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-2xl border">
                        <h3 className="text-2xl font-bold text-[#003366] mb-4">Growth Projection</h3>
                        <div style={{width: '100%', height: 300}}>
                            <ResponsiveContainer><LineChart data={chartData}><XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }}/><YAxis tickFormatter={(val) => `₹${val/100000}L`}/><Tooltip formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Corpus']}/><Legend /><Line type="monotone" dataKey="closing_capital" stroke="#003366" strokeWidth={2}/></LineChart></ResponsiveContainer>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-2xl border">
                        <h3 className="text-2xl font-bold text-[#003366] mb-4">Top 5 Recommended Schemes</h3>
                        <div className="space-y-4">
                            {wealthResult.recommended_schemes.map(s => (
                                <div key={s.scheme_name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <p className="font-semibold text-gray-800">{s.scheme_name}</p>
                                    <p className="text-sm text-green-700 font-bold">{ (s.confidence * 100).toFixed(2) }% Match</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-[#F8F9FA] min-h-screen font-sans">
            <Header />
            <main className="p-6 md:p-8 lg:p-10">
                <h1 className="text-4xl font-extrabold text-[#003366] mb-8">Wealth & Investment Advisory</h1>
                {renderContent()}
            </main>
            <FloatingChatbot />
        </div>
    );
};

export default withAuth(WealthAdvisoryPage);
