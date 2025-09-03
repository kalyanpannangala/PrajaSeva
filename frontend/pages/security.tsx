// pages/security.tsx
import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Seo from '../components/Seo';
import { ShieldCheck, Lock, Database, Server, Fingerprint } from 'lucide-react';

const SecurityPage: NextPage = () => {
  return (
    <div className="bg-white text-[#003366] font-sans">
      <Seo title="Security" description="Learn about the robust, bank-grade security measures we employ to protect your data and privacy at PrajaSeva." />

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
            <ShieldCheck className="h-20 w-20 mx-auto mb-6 opacity-80" />
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4">
              Your Trust, Our Commitment
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
              At PrajaSeva, the security of your data is not just a feature; it's the foundation of our platform. We are relentlessly committed to protecting your sensitive information with institutional-grade security infrastructure and practices.
            </p>
          </div>
        </section>

        {/* Core Security Pillars */}
        <section className="py-20">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center text-[#003366] mb-16">Our Core Security Pillars</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {/* Pillar 1: Encryption */}
                    <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200/80">
                        <Lock className="h-12 w-12 text-[#003366] mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-3">End-to-End Encryption</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Your data is encrypted both in transit (using TLS 1.3) and at rest (using AES-256), the same standards used by major banks and financial institutions. This ensures that your information is unreadable to unauthorized parties at all times.
                        </p>
                    </div>
                    {/* Pillar 2: Data Privacy */}
                     <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200/80">
                        <Fingerprint className="h-12 w-12 text-[#003366] mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-3">Strict Privacy Controls</h3>
                        <p className="text-gray-600 leading-relaxed">
                           We believe your data is yours alone. We have implemented stringent access control policies, meaning only a limited number of authorized personnel can access user data, and only for specific, necessary purposes like support and maintenance. We will never sell your data to third parties.
                        </p>
                    </div>
                    {/* Pillar 3: Secure Infrastructure */}
                     <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200/80">
                        <Server className="h-12 w-12 text-[#003366] mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-3">Secure Infrastructure</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Our platform is hosted on industry-leading cloud infrastructure that provides robust physical and network security. This includes protection against DDoS attacks, intrusion detection, and regular security audits to ensure the integrity of our systems.
                        </p>
                    </div>
                </div>
            </div>
        </section>
        
        {/* Technical Deep Dive */}
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-[#003366] mb-4">A Deeper Look at Our Practices</h2>
                    <p className="text-gray-600 text-lg mb-12 max-w-3xl mx-auto">We go beyond the basics to ensure your data is handled with the utmost care.</p>
                </div>
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex items-start gap-6">
                        <div className="p-3 bg-blue-100 rounded-lg mt-1"><Database className="h-6 w-6 text-[#003366]" /></div>
                        <div>
                            <h4 className="text-xl font-semibold mb-1">Data Segregation</h4>
                            <p className="text-gray-600">We utilize logically isolated data storage for each user, preventing any possibility of data leakage between accounts. Your financial profile is contained within its own secure silo.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-6">
                        <div className="p-3 bg-blue-100 rounded-lg mt-1"><ShieldCheck className="h-6 w-6 text-[#003366]" /></div>
                        <div>
                            <h4 className="text-xl font-semibold mb-1">Regular Security Audits</h4>
                            <p className="text-gray-600">We engage independent, third-party security experts to conduct regular penetration testing and vulnerability assessments of our applications and infrastructure. This proactive approach helps us identify and remediate potential threats before they can be exploited.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-6">
                        <div className="p-3 bg-blue-100 rounded-lg mt-1"><Lock className="h-6 w-6 text-[#003366]" /></div>
                        <div>
                            <h4 className="text-xl font-semibold mb-1">Secure Software Development</h4>
                            <p className="text-gray-600">Our development lifecycle incorporates security at every stage. We conduct static and dynamic code analysis, dependency scanning, and follow OWASP best practices to build a secure-by-design platform.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* User Responsibility */}
        <section className="py-20">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-[#003366] mb-4">Your Role in Security</h2>
                <p className="text-gray-600 text-lg mb-8 max-w-3xl mx-auto">
                    While we work tirelessly to protect you, account security is a shared responsibility.
                </p>
                <div className="max-w-2xl mx-auto text-left p-8 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                    <h4 className="font-bold text-yellow-800 mb-2">Best Practices for You:</h4>
                    <ul className="list-disc list-inside text-yellow-700 space-y-2">
                        <li>Use a strong, unique password for your PrajaSeva account.</li>
                        <li>Do not share your login credentials with anyone.</li>
                        <li>Be cautious of phishing emails or messages asking for your personal information.</li>
                        <li>Always log out of your account when using a shared or public computer.</li>
                    </ul>
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

export default SecurityPage;
