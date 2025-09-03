// pages/careers.tsx
import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Seo from '../components/Seo';
import { Briefcase, Users, BrainCircuit, Mail, GraduationCap, School } from 'lucide-react';

const CareersPage: NextPage = () => {
  return (
    <div className="bg-white text-[#003366] font-sans">
      <Seo title="Collaborate With Us | PrajaSeva" description="Join the PrajaSeva project. We welcome students, educators, and industry professionals to collaborate and contribute to our mission." />
      
      {/* Header */}
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
             <nav className="hidden md:flex items-center space-x-8">
                <Link href="/#features" className="text-gray-600 hover:text-[#003366] transition-colors">Features</Link>
                <Link href="/about" className="text-gray-600 hover:text-[#003366] transition-colors">About Us</Link>
                <Link href="/blog" className="text-gray-600 hover:text-[#003366] transition-colors">Blog</Link>
                <Link href="/contact" className="text-gray-600 hover:text-[#003366] transition-colors">Contact</Link>
            </nav>
            <Link href="/auth" className="hidden md:block bg-[#003366] hover:bg-[#002244] text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
              Get Started
            </Link>
        </div>
      </header>

      <main className="pt-24">
        {/* Page Header */}
        <section className="py-20 bg-[#003366] text-white">
          <div className="container mx-auto px-6 text-center">
            <Users className="h-20 w-20 mx-auto mb-6 opacity-80" />
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4">
              Join Our Mission
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
              PrajaSeva is a final year project born from a passion for technology and a desire to create meaningful impact. We believe in the power of collaboration to turn academic projects into real-world solutions.
            </p>
          </div>
        </section>

        {/* The Vision */}
        <section className="py-20">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-[#003366] mb-6">Our Vision & The Road Ahead</h2>
                    <p className="text-gray-600 leading-relaxed text-lg mb-4">
                        Our goal with PrajaSeva was to explore how modern technology, particularly AI, could be applied to solve a significant societal challenge: bridging the information gap between citizens and complex government financial schemes. This project represents our dedication to learning, innovation, and creating tools that can genuinely empower people.
                    </p>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        As we complete our academic journey, we see this not as an end, but as a beginning. We are eager to see how this platform can evolve and are looking for passionate individuals to help us explore its future potential.
                    </p>
                </div>
            </div>
        </section>

        {/* Invitation to Collaborate */}
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center text-[#003366] mb-16">An Invitation to Collaborate</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="text-center p-8 bg-white rounded-xl border border-gray-200/80 shadow-lg">
                        <GraduationCap className="h-12 w-12 text-[#003366] mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-3">For Students & Peers</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Are you a student interested in fintech, AI, or public policy? We'd love to share our learnings, discuss our technology stack (React, Next.js, Python), and explore potential future integrations. Let's learn and build together.
                        </p>
                    </div>
                    <div className="text-center p-8 bg-white rounded-xl border border-gray-200/80 shadow-lg">
                        <School className="h-12 w-12 text-[#003366] mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-3">For Educators & Mentors</h3>
                        <p className="text-gray-600 leading-relaxed">
                            As educators and academic mentors, your feedback is invaluable. We welcome your insights on our project's methodology, technical implementation, and potential for further research or development.
                        </p>
                    </div>
                     <div className="text-center p-8 bg-white rounded-xl border border-gray-200/80 shadow-lg">
                        <Briefcase className="h-12 w-12 text-[#003366] mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-3">For Industry Professionals</h3>
                        <p className="text-gray-600 leading-relaxed">
                            If you are a professional in the fintech, software development, or policy-making space, we would be honored to receive your guidance and mentorship. Your real-world perspective can help shape the future direction of this project.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* Get in Touch */}
        <section className="py-20">
            <div className="container mx-auto px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <Mail className="h-16 w-16 mx-auto mb-4 text-[#003366] opacity-80" />
                    <h2 className="text-4xl font-bold text-[#003366] mb-4">Let's Connect</h2>
                    <p className="text-gray-600 text-lg mb-8">
                        If you are inspired by our mission and wish to discuss ideas, offer feedback, or explore collaboration, please don't hesitate to reach out. We are excited to hear from you and discuss how we can work together.
                    </p>
                    <a href="mailto:prajaseva-ai@gmail.com" className="inline-block bg-[#003366] hover:bg-[#002244] text-white font-bold py-4 px-10 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300 text-lg">
                        Contact Our Team
                    </a>
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

export default CareersPage;
