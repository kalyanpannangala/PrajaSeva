// pages/about.tsx
'use client';

import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Target, Cpu, Heart } from 'lucide-react';
import Seo from '../components/Seo'; // Assuming you have this component

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

const AboutUsPage: NextPage = () => {
  return (
    <div className="bg-[#F8F9FA] font-sans">
      <Seo 
        title="About PrajaSeva"
        description="Learn about the mission and vision behind PrajaSeva, a student-developed AI platform designed to empower every Indian citizen with financial and social welfare tools."
        keywords="about PrajaSeva, student project, financial literacy India, citizen empowerment, AI for social good"
      />
      <PublicHeader />

      <main>
        {/* --- Hero Section --- */}
        <section className="pt-32 pb-20 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#003366] leading-tight mb-6">
              For the People, By the Next Generation.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              PrajaSeva was born from a simple idea: to use the power of technology to bridge the information gap between citizens and the services designed to support them.
            </p>
          </div>
        </section>

        {/* --- Our Mission Section --- */}
        <section className="py-20 bg-[#E9ECEF]/50">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl font-bold text-[#003366] mb-4">Our Mission</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Our mission is to empower every Indian citizen with the knowledge and tools to navigate the complex landscape of government schemes, taxation, and personal finance. We believe that financial well-being and access to social welfare are fundamental rights, not privileges.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        As students, we saw an opportunity to apply our skills in Artificial Intelligence and software development to a problem that affects millions. PrajaSeva is the result—a non-commercial, user-centric platform dedicated to public service.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <Target className="h-10 w-10 text-[#0055A4] mx-auto mb-2" />
                        <h3 className="font-semibold text-[#003366]">Clarity</h3>
                        <p className="text-sm text-gray-500">Simplifying complex information.</p>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <Cpu className="h-10 w-10 text-[#0055A4] mx-auto mb-2" />
                        <h3 className="font-semibold text-[#003366]">Technology</h3>
                        <p className="text-sm text-gray-500">Leveraging AI for personalization.</p>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <Users className="h-10 w-10 text-[#0055A4] mx-auto mb-2" />
                        <h3 className="font-semibold text-[#003366]">Accessibility</h3>
                        <p className="text-sm text-gray-500">A tool for every citizen.</p>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <Heart className="h-10 w-10 text-[#0055A4] mx-auto mb-2" />
                        <h3 className="font-semibold text-[#003366]">Service</h3>
                        <p className="text-sm text-gray-500">Built with a passion for social good.</p>
                    </div>
                </div>
            </div>
        </section>
        
        {/* --- Who We Serve Section --- */}
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 max-w-4xl text-center">
                <h2 className="text-3xl font-bold text-[#003366] mb-4">A Platform for Everyone</h2>
                <p className="text-lg text-gray-600 mb-10">
                    PrajaSeva is designed to be a universal tool, providing value to citizens from all walks of life.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    <div className="bg-gray-50 p-6 rounded-lg border">
                        <h3 className="font-bold text-xl text-[#003366] mb-2">For Middle-Class Families & Individuals</h3>
                        <p className="text-gray-700">Discover crucial government schemes you might be missing out on—from housing and education subsidies to healthcare benefits. Plan your long-term wealth with our easy-to-use advisory tools.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg border">
                        <h3 className="font-bold text-xl text-[#003366] mb-2">For Professionals & Taxpayers</h3>
                        <p className="text-gray-700">Navigate the complexities of the Indian tax system with ease. Our AI-powered tax advisory helps you compare regimes and identify deductions to legally minimize your tax liability and maximize your savings.</p>
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

export default AboutUsPage;
