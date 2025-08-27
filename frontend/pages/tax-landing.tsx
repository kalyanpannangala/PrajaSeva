// pages/tax-landing.tsx
'use client';

import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calculator, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';

const PublicHeader = () => (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3 cursor-pointer" aria-label="Go to home">
          <Image 
            src="/PS-Logo-Bg.png" 
            alt="PrajaSeva Logo" 
            width={192}
            height={48}
            className="h-12 w-auto"
          />
        </Link>
        <Link href="/auth" className="hidden md:block bg-[#003366] hover:bg-[#002244] text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
          Get Started
        </Link>
      </div>
    </header>
);

const TaxLandingPage: NextPage = () => {
  return (
    <div className="bg-[#F8F9FA] font-sans">
      <Seo 
        title="Income Tax Estimator & Advisory"
        description="Calculate your income tax for FY 2024-25 and find out whether the old or new tax regime is better for you. Get personalized tax-saving advice with PrajaSeva AI."
        keywords="income tax calculator, tax estimator India, old vs new tax regime, tax saving, PrajaSeva tax advisory"
      />
      <PublicHeader />

      <main>
        {/* --- Hero Section --- */}
        <section className="pt-32 pb-20 text-center bg-white">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#003366] leading-tight mb-6">
              Simplify Your Taxes. Maximize Your Savings.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              PrajaSeva's Tax Advisory tool helps you easily calculate your tax liability, compares the Old vs. New regimes, and provides AI-powered recommendations to reduce your tax burden.
            </p>
            <Link href="/auth">
              <span className="group inline-flex items-center bg-[#D4AF37] hover:bg-[#b89b31] text-white font-bold py-4 px-10 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300 text-lg">
                Calculate Your Tax Now
                <ArrowRight className="ml-3 h-6 w-6 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </section>

        {/* --- How It Works Section --- */}
        <section className="py-20 bg-[#E9ECEF]/50">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-[#003366] text-center mb-12">Get Tax Clarity in Three Simple Steps</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="flex flex-col items-center">
                        <div className="p-4 bg-blue-100 rounded-full mb-4">
                            <Calculator className="h-10 w-10 text-[#003366]" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#003366] mb-2">1. Enter Your Financials</h3>
                        <p className="text-gray-600">Provide your income and any potential deductions like 80C investments or home loan interest.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="p-4 bg-blue-100 rounded-full mb-4">
                            <BarChart3 className="h-10 w-10 text-[#003366]" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#003366] mb-2">2. Instant Comparison</h3>
                        <p className="text-gray-600">Our platform instantly calculates your tax liability under both the Old and New tax regimes.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="p-4 bg-blue-100 rounded-full mb-4">
                            <ShieldCheck className="h-10 w-10 text-[#003366]" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#003366] mb-2">3. Receive Your Recommendation</h3>
                        <p className="text-gray-600">Get a clear, data-driven recommendation on which regime to choose to maximize your savings.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* --- FAQ Section --- */}
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 max-w-4xl">
                <h2 className="text-3xl font-bold text-[#003366] text-center mb-12">Common Tax Questions</h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-[#003366]">Which tax regime is better for me?</h3>
                        <p className="text-gray-600 mt-1">It depends on your income and the deductions you can claim. The Old Regime is beneficial if you have significant deductions (like HRA, 80C, 80D, home loan interest). The New Regime offers lower tax rates but fewer deductions. Our tool analyzes your specific situation to give you a clear answer.</p>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold text-[#003366]">What is the standard deduction for FY 2024-25?</h3>
                        <p className="text-gray-600 mt-1">For salaried individuals, the standard deduction is ₹50,000 under the Old Regime. The New Regime also offers a standard deduction of ₹50,000 for salaried individuals and pensioners as per the latest updates.</p>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold text-[#003366]">Is this tool a replacement for a Chartered Accountant (CA)?</h3>
                        <p className="text-gray-600 mt-1">PrajaSeva's Tax Advisory tool is a powerful estimator and guide designed for clarity and planning. For complex financial situations, multiple income sources, or business tax filing, we always recommend consulting with a qualified Chartered Accountant.</p>
                        {/* --- FIX: Added authoritative link --- */}
                        <p className="text-sm text-gray-500 mt-2">
                            For official information, please refer to the <a href="https://incometaxindia.gov.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Income Tax Department website</a>.
                        </p>
                    </div>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
};

export default TaxLandingPage;
