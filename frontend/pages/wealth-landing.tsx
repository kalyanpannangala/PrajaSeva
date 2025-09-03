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
     {/* Enhanced Footer */}
                 <footer className="bg-gradient-to-b from-white to-gray-100 border-t border-gray-200 pt-12 pb-8">
                   <div className="container mx-auto px-6">
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                       <div>
                         <div className="flex items-center mb-6">
                           <Image 
                           src="/PS-Logo-Bg.png" 
                           alt="PrajaSeva Logo" 
                           width={180}
                           height={45}
                           className="h-10 w-auto mr-3"
                           />
                         </div>
                         <p className="text-gray-600 mb-6">
                           India's premier AI-powered platform for government scheme recommendations and financial optimization.
                         </p>
                         <div className="flex space-x-4">
                           <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors duration-300">
                             <span className="sr-only">Twitter</span>
                             <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                               <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                             </svg>
                           </a>
                           <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors duration-300">
                             <span className="sr-only">LinkedIn</span>
                             <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                               <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                             </svg>
                           </a>
                           <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors duration-300">
                             <span className="sr-only">Facebook</span>
                             <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                               <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                             </svg>
                           </a>
                         </div>
                       </div>
                       
                       <div>
                         <h3 className="text-lg font-semibold text-gray-900 mb-6">Product</h3>
                         <ul className="space-y-3">
                           <li><a href="/schemes-landing" className="text-gray-600 hover:text-blue-700 transition-colors duration-300">Scheme Recommendations</a></li>
                           <li><a href="/tax-landing" className="text-gray-600 hover:text-blue-700 transition-colors duration-300">Tax Optimization</a></li>
                           <li><a href="/wealth-landing" className="text-gray-600 hover:text-blue-700 transition-colors duration-300">Wealth Advisory</a></li>
                           <li><a href="/dashboard/chatbot" className="text-gray-600 hover:text-blue-700 transition-colors duration-300">PrajaSeva AI</a></li>
     
                           </ul>
                       </div>
                       
                       <div>
                         <h3 className="text-lg font-semibold text-gray-900 mb-6">Company</h3>
                         <ul className="space-y-3">
                           <li><a href="/about" className="text-gray-600 hover:text-blue-700 transition-colors duration-300">About Us</a></li>
                           <li><a href="/blog" className="text-gray-600 hover:text-blue-700 transition-colors duration-300">Blog</a></li>
                           <li><a href="/careers" className="text-gray-600 hover:text-blue-700 transition-colors duration-300">Careers</a></li>
                           <li><a href="/contact" className="text-gray-600 hover:text-blue-700 transition-colors duration-300">Contact</a></li>
                         </ul>
                       </div>
                       
                       <div>
                         <h3 className="text-lg font-semibold text-gray-900 mb-6">Legal</h3>
                         <ul className="space-y-3">
                           <li><a href="/privacy-policy" className="text-gray-600 hover:text-blue-700 transition-colors duration-300">Privacy Policy</a></li>
                           <li><a href="/terms" className="text-gray-600 hover:text-blue-700 transition-colors duration-300">Terms of Service</a></li>
                           <li><a href="/security" className="text-gray-600 hover:text-blue-700 transition-colors duration-300">Security</a></li>
                           <li><a href="/compliance" className="text-gray-600 hover:text-blue-700 transition-colors duration-300">Compliance</a></li>
                         </ul>
                       </div>
                     </div>
                     
                     <div className="pt-8 mt-8 border-t border-gray-200 text-center">
                       <p className="text-gray-500">&copy; {new Date().getFullYear()} PrajaSeva. All Rights Reserved.</p>
                     </div>
                   </div>
                 </footer>
    </div>
  );
};

export default WealthLandingPage;
