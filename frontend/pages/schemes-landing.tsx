// pages/schemes-landing.tsx
'use client';

import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Search, UserCheck, ArrowRight } from 'lucide-react';
import Seo from '../components/Seo'; // Assuming you have this component in components/Seo.tsx

// A simple, public-facing header for this page
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
            priority
          />
        </Link>
        <Link href="/auth" className="hidden md:block bg-[#003366] hover:bg-[#002244] text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
          Get Started
        </Link>
      </div>
    </header>
);

const SchemesLandingPage: NextPage = () => {
  return (
    <div className="bg-[#F8F9FA] font-sans">
      <Seo 
        title="Government Scheme Recommender"
        description="Find out which government schemes you are eligible for. PrajaSeva uses AI to match your profile with central and state government benefits."
        keywords="government scheme eligibility, find government schemes, PrajaSeva schemes, central government schemes, state government schemes"
      />
      <PublicHeader />

      <main>
        {/* --- Hero Section --- */}
        <section className="pt-32 pb-20 text-center bg-white">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#003366] leading-tight mb-6">
              Never Miss a Benefit Again.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              PrajaSeva's AI-powered Scheme Recommender analyzes your unique profile against hundreds of central and state government schemes to find the ones you're actually eligible for.
            </p>
            <Link href="/auth">
              <span className="group inline-flex items-center bg-[#D4AF37] hover:bg-[#b89b31] text-white font-bold py-4 px-10 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300 text-lg">
                Check Your Eligibility Now
                <ArrowRight className="ml-3 h-6 w-6 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </section>

        {/* --- How It Works Section --- */}
        <section className="py-20 bg-[#E9ECEF]/50">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-[#003366] text-center mb-12">A Simple Path to Your Entitlements</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="flex flex-col items-center">
                        <div className="p-4 bg-blue-100 rounded-full mb-4">
                            <UserCheck className="h-10 w-10 text-[#003366]" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#003366] mb-2">1. Create Your Profile</h3>
                        <p className="text-gray-600">Securely provide your basic details like age, state, and income. It only takes a few minutes.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="p-4 bg-blue-100 rounded-full mb-4">
                            <Search className="h-10 w-10 text-[#003366]" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#003366] mb-2">2. AI-Powered Analysis</h3>
                        <p className="text-gray-600">Our intelligent engine instantly cross-references your profile with a vast database of government schemes.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="p-4 bg-blue-100 rounded-full mb-4">
                            <CheckCircle className="h-10 w-10 text-[#003366]" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#003366] mb-2">3. Get Your Personalized List</h3>
                        <p className="text-gray-600">View a clear, simple list of schemes you are likely eligible for, with details on how to apply.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* --- FAQ Section --- */}
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 max-w-4xl">
                <h2 className="text-3xl font-bold text-[#003366] text-center mb-12">Frequently Asked Questions</h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-[#003366]">What kind of schemes can I find?</h3>
                        <p className="text-gray-600 mt-1">Our platform covers a wide range of central and state government schemes, including scholarships for students, pension plans, housing assistance, healthcare benefits like Ayushman Bharat, agricultural support, and more.</p>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold text-[#003366]">Is my data safe?</h3>
                        <p className="text-gray-600 mt-1">Absolutely. We use bank-grade encryption and follow strict data privacy protocols. Your personal information is only used to provide you with recommendations and is never shared. Please see our Privacy Policy for full details.</p>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold text-[#003366]">How accurate are the recommendations?</h3>
                        <p className="text-gray-600 mt-1">Our AI model provides recommendations with a high degree of accuracy based on the information you provide and the latest eligibility criteria. However, the final decision always rests with the respective government department. We provide the information to guide and empower you.</p>
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

export default SchemesLandingPage;
