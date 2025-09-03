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

export default AboutUsPage;
