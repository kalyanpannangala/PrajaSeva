// pages/wealth-landing.tsx
'use client';

import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image'; // <-- Import the optimized Image component
import { Target, LineChart, ShieldCheck, ArrowRight } from 'lucide-react';
import Seo from '../components/Seo'; // Assuming you have this component

// This is a simple, public-facing header component for this page
const PublicHeader = () => (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3 cursor-pointer" aria-label="Go to home">
          {/* --- FIX: Replaced <img> with the optimized next/image component --- */}
          <Image 
            src="/PS-Logo-Bg.png" 
            alt="PrajaSeva Logo" 
            width={192}  // Specify the original width of your logo image
            height={48}   // Specify the original height of your logo image
            className="h-12 w-auto" // Tailwind classes still control the displayed size
          />
        </Link>
        <Link href="/auth" className="hidden md:block bg-[#003366] hover:bg-[#002244] text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
          Get Started
        </Link>
      </div>
    </header>
);

const WealthLandingPage: NextPage = () => {
  return (
    <div className="bg-[#F8F9FA] font-sans">
      <Seo 
        title="Wealth & Investment Advisory"
        description="Plan for your financial future with PrajaSeva's AI-powered wealth advisory. Get retirement corpus projections and personalized investment recommendations."
        keywords="wealth planning, investment advisory, retirement calculator, financial planning India, PrajaSeva wealth"
      />
      <PublicHeader />

      <main>
        {/* --- Hero Section --- */}
        <section className="pt-32 pb-20 text-center bg-white">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#003366] leading-tight mb-6">
              Plan Today. Prosper Tomorrow.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              PrajaSeva's Wealth Advisory tool helps you project your future corpus, understand the impact of inflation, and receive AI-driven recommendations for government-backed investment schemes.
            </p>
            <Link href="/auth">
              <span className="group inline-flex items-center bg-[#D4AF37] hover:bg-[#b89b31] text-white font-bold py-4 px-10 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300 text-lg">
                Start Your Financial Plan
                <ArrowRight className="ml-3 h-6 w-6 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </section>

        {/* --- How It Works Section --- */}
        <section className="py-20 bg-[#E9ECEF]/50">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-[#003366] text-center mb-12">Achieve Your Financial Goals in 3 Steps</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="flex flex-col items-center">
                        <div className="p-4 bg-blue-100 rounded-full mb-4">
                            <Target className="h-10 w-10 text-[#003366]" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#003366] mb-2">1. Define Your Goals</h3>
                        <p className="text-gray-600">Enter your current age, savings, monthly investment amount, and your target retirement age.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="p-4 bg-blue-100 rounded-full mb-4">
                            <LineChart className="h-10 w-10 text-[#003366]" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#003366] mb-2">2. Get AI Projections</h3>
                        <p className="text-gray-600">Our platform projects your future wealth, showing a year-by-year breakdown of your corpus growth.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="p-4 bg-blue-100 rounded-full mb-4">
                            <ShieldCheck className="h-10 w-10 text-[#003366]" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#003366] mb-2">3. Receive Recommendations</h3>
                        <p className="text-gray-600">Based on your risk tolerance, our AI suggests a mix of suitable investment schemes to help you reach your goals.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* --- FAQ Section --- */}
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 max-w-4xl">
                <h2 className="text-3xl font-bold text-[#003366] text-center mb-12">Investment & Planning FAQs</h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-[#003366]">What is a good monthly investment amount?</h3>
                        <p className="text-gray-600 mt-1">This depends entirely on your income, expenses, and financial goals. A common rule of thumb is the 50/30/20 rule, where you allocate 20% of your post-tax income towards savings and investments. Our tool helps you see the long-term impact of different monthly amounts.</p>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold text-[#003366]">What does "risk tolerance" mean?</h3>
                        <p className="text-gray-600 mt-1">Risk tolerance is your ability and willingness to withstand potential losses in your investment portfolio. "High" tolerance might mean you're comfortable with more volatile investments like equity for potentially higher returns, while "Low" tolerance means you prefer safer, government-backed options like PPF or bonds.</p>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold text-[#003366]">Why is inflation-adjusted corpus important?</h3>
                        <p className="text-gray-600 mt-1">The value of money decreases over time due to inflation. A projected corpus of ₹1 crore in 20 years will not have the same purchasing power as ₹1 crore today. The inflation-adjusted corpus shows you the "real" value of your future savings in today's terms, giving you a much more realistic financial picture.</p>
                    </div>
                </div>
            </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="bg-[#E9ECEF]/70 border-t border-gray-200">
        <div className="container mx-auto px-6 py-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} PrajaSeva. All Rights Reserved.</p>
          <div className="mt-4 space-x-6">
            <a href="/about" className="hover:text-[#003366]">About Us</a>
            <a href="/privacy-policy" className="hover:text-[#003366]">Privacy Policy</a>
            <a href="/terms" className="hover:text-[#003366]">Terms of Service</a>
            <a href="/contact" className="hover:text-[#003366]">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WealthLandingPage;
