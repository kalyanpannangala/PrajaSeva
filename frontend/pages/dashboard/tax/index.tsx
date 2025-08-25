// pages/tax-advisory.tsx
'use client';

import { useState, useEffect, FC } from 'react';
import type { NextPage } from 'next';
import Header from '../../../components/Header';
import { BotMessageSquare, Loader2, AlertTriangle, Info, Edit, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';

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
    calculation_summary: { tax_old: number; tax_new: number; };
    recommendation: { deterministic: string; tax_saving: number; };
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


const TaxAdvisoryPage: NextPage = () => {
    // --- FIX: Initialize all number fields as undefined to appear blank ---
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
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // --- Effect for Authentication Check ---
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            router.push('/auth');
            return;
        }
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

    // --- Effect for Data Fetching (runs only after authentication) ---
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
                { name: 'Old Regime', tax: taxResult.calculation_summary.tax_old },
                { name: 'New Regime', tax: taxResult.calculation_summary.tax_new },
            ];
            return (
                 <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200/80">
                    <h2 className="text-2xl font-bold text-green-700 text-center mb-2">Projected Savings: ₹{taxResult.recommendation.tax_saving.toLocaleString('en-IN')}</h2>
                    <p className="text-center text-gray-600 mb-8">by choosing the {taxResult.recommendation.deterministic}.</p>
                    <div style={{ width: '100%', height: 400 }}>
                        <ResponsiveContainer>
                            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                <XAxis dataKey="name" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" tickFormatter={(value) => `₹${Number(value)/1000}k`} />
                                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Tax']} />
                                <Bar dataKey="tax" fill="#003366" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
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
            <BotMessageSquare className="fixed bottom-8 right-8 h-16 w-16" />
        </div>
    );
};

export default TaxAdvisoryPage;
