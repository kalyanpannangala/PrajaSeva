// app/wealth-advisory/page.tsx
'use client';

import type { NextPage } from 'next';
import { BotMessageSquare } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '../../../components/Header'; // <-- Import the dedicated header

// --- MOCK WEALTH DATA (from your API) ---
const MOCK_WEALTH_DATA = {
  risk: 'Medium',
  suggestedAllocation: [
    { name: 'Equity Mutual Funds', value: 60, color: '#003366' },
    { name: 'Government Bonds', value: 30, color: '#0055A4' },
    { name: 'Gold', value: 10, color: '#D4AF37' },
  ],
};

const WealthAdvisoryPage: NextPage = () => {
  return (
    <div className="bg-[#F8F9FA] min-h-screen font-sans">
      <Header />

      {/* --- Main Content --- */}
      <main className="p-6 md:p-8 lg:p-10">
        <h1 className="text-3xl font-bold text-[#003366] mb-2">Wealth Growth Plan</h1>
        <p className="text-lg text-gray-600 mb-8">A suggested portfolio allocation to match your 'Growth' objectives.</p>
        
        <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200/80">
            <h2 className="text-2xl font-bold text-center text-[#003366] mb-8">Suggested Asset Allocation</h2>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie 
                            data={MOCK_WEALTH_DATA.suggestedAllocation} 
                            dataKey="value" 
                            nameKey="name" 
                            cx="50%" 
                            cy="50%" 
                            innerRadius={80} // This creates the donut hole
                            outerRadius={150} 
                            paddingAngle={5}
                            labelLine={false}
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                // --- FIX: Check for undefined properties ---
                                if (midAngle === undefined || percent === undefined || !cx || !cy || !innerRadius || !outerRadius) {
                                    return null;
                                }
                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                return (
                                    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                                        {`${(percent * 100).toFixed(0)}%`}
                                    </text>
                                );
                            }}
                        >
                            {MOCK_WEALTH_DATA.suggestedAllocation.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '0.5rem' }} 
                            formatter={(value) => [`${value}%`, 'Allocation']}
                        />
                        <Legend iconType="circle" />
                    </PieChart>
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

export default WealthAdvisoryPage;
