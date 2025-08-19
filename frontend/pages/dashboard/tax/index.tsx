// app/tax-advisory/page.tsx
'use client';

import type { NextPage } from 'next';
import { BotMessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Header from '../../../components/Header'; // <-- Import the dedicated header

// --- MOCK TAX DATA (from your API) ---
const MOCK_TAX_DATA = {
  oldRegime: { tax: 78000 },
  newRegime: { tax: 62800 },
  savings: 15200,
};
const taxChartData = [
  { name: 'Old Regime', tax: MOCK_TAX_DATA.oldRegime.tax },
  { name: 'New Regime', tax: MOCK_TAX_DATA.newRegime.tax },
];

const TaxAdvisoryPage: NextPage = () => {
  return (
    <div className="bg-[#F8F9FA] min-h-screen font-sans">
      <Header />

      {/* --- Main Content --- */}
      <main className="p-6 md:p-8 lg:p-10">
        <h1 className="text-3xl font-bold text-[#003366] mb-2">Tax Optimization Analysis</h1>
        <p className="text-lg text-gray-600 mb-8">Based on your income, here is a comparison of the Old vs. New tax regimes.</p>
        
        <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200/80">
            <h2 className="text-2xl font-bold text-green-700 text-center mb-2">Projected Savings: ₹{MOCK_TAX_DATA.savings.toLocaleString('en-IN')}</h2>
            <p className="text-center text-gray-600 mb-8">by choosing the New Tax Regime.</p>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <BarChart data={taxChartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <XAxis dataKey="name" stroke="#6b7280" />
                        <YAxis 
                            stroke="#6b7280" 
                            tickFormatter={(value) => `₹${Number(value)/1000}k`} 
                            label={{ value: 'Tax Liability', angle: -90, position: 'insideLeft', offset: 0, style: { textAnchor: 'middle', fill: '#6b7280' } }}
                        />
                        <Tooltip 
                            cursor={{fill: 'rgba(233, 236, 239, 0.5)'}} 
                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '0.5rem' }} 
                            formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Tax']}
                        />
                        <Bar dataKey="tax" fill="#003366" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </main>

      {/* --- Floating AI Chatbot Button --- */}
      <button className="fixed bottom-8 right-8 bg-gradient-to-r from-[#003366] to-[#0055A4] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
        <BotMessageSquare className="h-8 w-8" />
      </button>
    </div>
  );
};

export default TaxAdvisoryPage;
