// pages/tax-advisory.tsx
'use client';

import { useState, useEffect, FC } from 'react';
import type { NextPage } from 'next';
import Header from '../../../components/Header';
import { BotMessageSquare, Loader2, AlertTriangle, Info, Edit, RefreshCw, ChevronDown, CheckSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingChatbot from '../../../components/FloatingChatbot';
import withAuth from '../../../components/withAuth';   

// --- Type Definitions ---
interface TaxInput {
    age: number;
    annual_income: number;
    is_salaried: boolean;
    investment_80c: number;
    investment_80d: number;
    home_loan_interest: number;
    education_loan_interest: number;
    donations_80g: number;
    other_deductions: number;
}
interface TaxResult {
    calculation_summary: {
        taxable_income_old: number;
        tax_old: number;
        taxable_income_new: number;
        tax_new: number;
    };
    recommendation: {
        deterministic: string;
        ml_recommendation: string;
        tax_saving: number;
    };
    notes: string[];
}

// --- Configuration for the input form fields ---
const formFields = [
    { name: 'age', label: 'Age', type: 'number', required: true },
    { name: 'annual_income', label: 'Annual Income (₹)', type: 'number', required: true },
    { name: 'investment_80c', label: 'Investment under 80C (₹)', type: 'number' },
    { name: 'investment_80d', label: 'Investment under 80D (₹)', type: 'number' },
    { name: 'home_loan_interest', label: 'Home Loan Interest (₹)', type: 'number' },
    { name: 'education_loan_interest', label: 'Education Loan Interest (₹)', type: 'number' },
    { name: 'donations_80g', label: 'Donations under 80G (₹)', type: 'number' },
    { name: 'other_deductions', label: 'Other Deductions (₹)', type: 'number' },
    { name: 'is_salaried', label: 'Are you a salaried employee?', type: 'checkbox' },
];

// --- New Input Snapshot Component ---
const TaxInputSnapshot: FC<{ inputData: Partial<TaxInput>; onReanalyze: () => void; isAnalyzing: boolean; showEditor: boolean; setShowEditor: (show: boolean) => void; handleInputChange: (e: any) => void; }> = ({ inputData, onReanalyze, isAnalyzing, showEditor, setShowEditor, handleInputChange }) => {
    return (
        <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200/80">
            <button onClick={() => setShowEditor(!showEditor)} className="w-full flex justify-between items-center text-left">
                <div className="flex items-center">
                    <Edit className="h-6 w-6 text-[#003366] mr-4" />
                    <div>
                        <h2 className="text-xl font-bold text-[#003366]">Your Tax Input Data</h2>
                        <p className="text-gray-500">Click to view or edit your data for a new analysis.</p>
                    </div>
                </div>
                <ChevronDown className={`h-6 w-6 transition-transform ${showEditor ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
            {showEditor && (
                <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="overflow-hidden">
                    <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {formFields.map(field => (
                             <div key={field.name} className={field.type === 'checkbox' ? 'flex items-center mt-2 md:col-span-2' : ''}>
                                {field.type === 'checkbox' ? (
                                    <>
                                        <input type="checkbox" name={field.name} checked={!!inputData[field.name as keyof TaxInput]} onChange={handleInputChange} className="h-5 w-5 mr-2"/>
                                        <label className="text-sm font-medium text-gray-700">{field.label}</label>
                                    </>
                                ) : (
                                    <>
                                        <label className="text-sm font-medium text-gray-700">{field.label}{field.required && <span className="text-red-500 ml-1">*</span>}</label>
                                        <input type="number" name={field.name} value={String(inputData[field.name as keyof TaxInput] ?? '')} onChange={handleInputChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
                                    </>
                                )}
                            </div>
                        ))}
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


const TaxAdvisoryPage: NextPage = () => {
    const [taxInput, setTaxInput] = useState<Partial<TaxInput>>({
        age: undefined,
        annual_income: undefined,
        is_salaried: true,
        investment_80c: undefined,
        investment_80d: undefined,
        home_loan_interest: undefined,
        education_loan_interest: undefined,
        donations_80g: undefined,
        other_deductions: undefined,
    });
    const [taxResult, setTaxResult] = useState<TaxResult | null>(null);
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
            const decodedToken: { exp: number } = jwtDecode(token);
            if (decodedToken.exp * 1000 < Date.now()) {
                localStorage.removeItem('authToken');
                router.push('/auth');
                return;
            }
            setIsAuthenticated(true);
        } catch (error) {
            localStorage.removeItem('authToken');
            router.push('/auth');
        }
    }, [router]);

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchTaxData = async () => {
            setPageState('loading');
            const token = localStorage.getItem('authToken');
            try {
                const inputRes = await fetch('/api/tax/input', { headers: { 'Authorization': `Bearer ${token}` } });
                if (inputRes.status === 404) {
                    setPageState('input_form');
                    return;
                }
                if (!inputRes.ok) throw new Error('Could not fetch tax input data.');
                const inputData = await inputRes.json();
                setTaxInput(inputData);

                const resultRes = await fetch('/api/tax/results', { headers: { 'Authorization': `Bearer ${token}` } });
                if (resultRes.ok) {
                    setTaxResult(await resultRes.json());
                }
                setPageState('displaying');
            } catch (err: any) {
                setError(err.message || "Could not load your data.");
                setPageState('error');
            }
        };
        fetchTaxData();
    }, [isAuthenticated]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setTaxInput(prev => ({ ...prev, [name]: checked }));
        } else {
            const numValue = value === '' ? undefined : Number(value);
            setTaxInput(prev => ({ ...prev, [name]: numValue }));
        }
    };

    const handleSaveAndAnalyze = async () => {
        if (taxInput.age === undefined || taxInput.annual_income === undefined) {
            setError('Please fill in all required fields (*).');
            return;
        }

        const token = localStorage.getItem('authToken');
        setIsAnalyzing(true);
        setError(null);

        const payload = {
            age: taxInput.age,
            annual_income: taxInput.annual_income,
            is_salaried: taxInput.is_salaried ?? true,
            investment_80c: taxInput.investment_80c ?? 0,
            investment_80d: taxInput.investment_80d ?? 0,
            home_loan_interest: taxInput.home_loan_interest ?? 0,
            education_loan_interest: taxInput.education_loan_interest ?? 0,
            donations_80g: taxInput.donations_80g ?? 0,
            other_deductions: taxInput.other_deductions ?? 0,
        };

        try {
            await fetch('/api/tax/input', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            const analysisRes = await fetch('https://kalyanpannangala-prajaseva.hf.space/tax/predict_tax', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!analysisRes.ok) {
                const errorData = await analysisRes.json();
                throw new Error(errorData.detail || 'Analysis failed.');
            }
            
            setTaxResult(await analysisRes.json());
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
                    <h2 className="text-2xl font-bold text-[#003366] mb-2">Enter Your Financial Details</h2>
                    <p className="text-gray-600 mb-6">Provide this information to get a personalized tax analysis.</p>
                    {error && <div className="mb-4 text-red-600 text-sm font-medium p-3 bg-red-50 rounded-lg">{error}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {formFields.map(field => (
                            <div key={field.name} className={field.type === 'checkbox' ? 'flex items-center mt-2 md:col-span-2' : ''}>
                                {field.type === 'checkbox' ? (
                                    <>
                                        <input type="checkbox" name={field.name} checked={!!taxInput[field.name as keyof TaxInput]} onChange={handleInputChange} className="h-5 w-5 mr-2"/>
                                        <label className="text-sm font-medium text-gray-700">{field.label}</label>
                                    </>
                                ) : (
                                    <>
                                        <label className="text-sm font-medium text-gray-700">
                                            {field.label}
                                            {field.required && <span className="text-red-500 ml-1">*</span>}
                                        </label>
                                        <input type="number" name={field.name} value={String(taxInput[field.name as keyof TaxInput] ?? '')} onChange={handleInputChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                    <button onClick={handleSaveAndAnalyze} disabled={isAnalyzing} className="mt-6 flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg">
                        {isAnalyzing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <RefreshCw className="mr-2 h-5 w-5" />}
                        {isAnalyzing ? 'Analyzing...' : 'Save & Analyze'}
                    </button>
                </div>
            );
        }
        if (pageState === 'displaying' && taxResult) {
            const chartData = [
                { name: 'Old Regime', tax: taxResult.calculation_summary?.tax_old || 0 },
                { name: 'New Regime', tax: taxResult.calculation_summary?.tax_new || 0 },
            ];
            return (
                <div className="space-y-8">
                    <TaxInputSnapshot 
                        inputData={taxInput}
                        onReanalyze={handleSaveAndAnalyze}
                        isAnalyzing={isAnalyzing}
                        showEditor={showEditor}
                        setShowEditor={setShowEditor}
                        handleInputChange={handleInputChange}
                    />
                    <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200/80">
                        <h2 className="text-2xl font-bold text-green-700 text-center mb-2">Projected Savings: ₹{taxResult.recommendation?.tax_saving?.toLocaleString('en-IN') || 0}</h2>
                        <p className="text-center text-gray-600 mb-1"><span className="font-semibold">Our Recommendation:</span> {taxResult.recommendation?.deterministic || 'N/A'}</p>
                        <p className="text-center text-gray-500 text-sm mb-8">(PrajaSeva AI Recommendation: {taxResult.recommendation?.ml_recommendation || 'N/A'})</p>
                        
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                    <XAxis dataKey="name" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" tickFormatter={(value) => `₹${Number(value)/1000}k`} />
                                    <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Tax']} />
                                    <Bar dataKey="tax" fill="#003366" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    {/* --- Detailed Breakdown and Notes --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-lg border">
                            <h3 className="text-xl font-bold text-[#003366] mb-4">Calculation Details</h3>
                            <div className="space-y-3">
                                {/* --- FIX: Added specific text color classes --- */}
                                <div className="flex justify-between"><span className="text-gray-600">Taxable Income (Old):</span><span className="font-semibold text-[#003366]">₹{taxResult.calculation_summary?.taxable_income_old?.toLocaleString('en-IN') || 'N/A'}</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">Taxable Income (New):</span><span className="font-semibold text-[#003366]">₹{taxResult.calculation_summary?.taxable_income_new?.toLocaleString('en-IN') || 'N/A'}</span></div>
                                <div className="flex justify-between border-t pt-3 mt-3"><span className="text-gray-600">Final Tax (Old):</span><span className="font-bold text-red-600">₹{taxResult.calculation_summary?.tax_old?.toLocaleString('en-IN') || 'N/A'}</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">Final Tax (New):</span><span className="font-bold text-green-700">₹{taxResult.calculation_summary?.tax_new?.toLocaleString('en-IN') || 'N/A'}</span></div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-lg border">
                            <h3 className="text-xl font-bold text-[#003366] mb-4">Notes & Considerations</h3>
                            <ul className="space-y-2">
                                {taxResult.notes?.map((note, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckSquare className="w-5 h-5 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                                        <span className="text-gray-600">{note}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                </div>
                
            );
        }
        return null; // Fallback
    };

    

    return (
        <div className="bg-[#F8F9FA] min-h-screen font-sans">
            <Header />
            <main className="p-6 md:p-8 lg:p-10">
                <h1 className="text-4xl font-extrabold text-[#003366] mb-8">Tax Optimization Analysis</h1>
                {renderContent()}
            </main>
            <FloatingChatbot />
        </div>
    );
};

export default withAuth(TaxAdvisoryPage);

