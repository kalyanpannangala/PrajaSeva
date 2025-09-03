// app/terms-and-conditions/page.tsx
'use client';

import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';

const TermsAndConditionsPage: NextPage = () => {
  return (
    <div className="bg-[#F8F9FA] min-h-screen font-sans pt-20"> {/* Added padding-top for fixed header */}
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3 cursor-pointer" aria-label="Go to home">
            {/* Placeholder Logo */}
            <img src="/PS-Logo-Bg.png" alt="PrajaSeva Logo" className="h-12 w-auto" />
            </Link>

            <Link href="/auth" className="hidden md:block bg-[#003366] hover:bg-[#002244] text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
              Get Started
            </Link>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="p-6 md:p-8 lg:p-10">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-2xl border border-gray-200/80">
          <div className="prose lg:prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-[#003366] mb-4">Terms and Conditions</h1>
            <p className="text-sm text-gray-500"><strong>Last Updated:</strong> August 16, 2025</p>

            <h2 className="text-2xl font-bold text-[#003366] mt-8">1. Agreement to Terms</h2>
            <p>By creating an account and using the PrajaSeva platform ("Services"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, you may not use our Services.</p>

            <h2 className="text-2xl font-bold text-[#003366] mt-8">2. Description of Service</h2>
            <p>PrajaSeva is a digital platform that uses proprietary Machine Learning (ML) models to provide users with personalized recommendations and advisory services related to Indian government schemes, tax planning, and wealth management. The information provided is for informational and advisory purposes only and should not be considered as legal or financial advice.</p>

            <h2 className="text-2xl font-bold text-[#003366] mt-8">3. User Accounts</h2>
            <p>To access our Services, you must register for an account. You agree to provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.</p>

            <h2 className="text-2xl font-bold text-[#003366] mt-8">4. User Responsibilities</h2>
            <ul>
              <li>You are solely responsible for the accuracy of the data you provide (e.g., income, age, dependents). The quality and accuracy of our recommendations depend on the quality of your input.</li>
              <li>You agree not to use the Service for any unlawful purpose or in any way that interrupts, damages, or impairs the service.</li>
              <li>You are responsible for making your own financial decisions. PrajaSeva acts as an informational tool, and you should consult with a qualified financial advisor before making any significant financial decisions.</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#003366] mt-8">5. Disclaimer of Warranties</h2>
            <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. While we strive to provide accurate information, we make no warranty that the recommendations provided will be complete, accurate, reliable, or suitable for your specific needs. Government schemes and tax laws are subject to change, and we do not guarantee that our information will always be up-to-date.</p>

            <h2 className="text-2xl font-bold text-[#003366] mt-8">6. Limitation of Liability</h2>
            <p>In no event shall PrajaSeva, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

            <h2 className="text-2xl font-bold text-[#003366] mt-8">7. Intellectual Property</h2>
            <p>The Service and its original content (excluding data provided by users), features, and functionality are and will remain the exclusive property of PrajaSeva and its licensors.</p>

            <h2 className="text-2xl font-bold text-[#003366] mt-8">8. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>

            <h2 className="text-2xl font-bold text-[#003366] mt-8">9. Changes to Terms</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms and Conditions on this page and updating the "Last Updated" date.</p>

            <h2 className="text-2xl font-bold text-[#003366] mt-8">10. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
            <p><strong>PrajaSeva Support</strong><br/>Email: prajaseva.ai@gmail.com</p>
          </div>
        </div>
      </main>
      
      {/* --- Styling for the prose content --- */}
      <style jsx global>{`
        .prose h1, .prose h2, .prose h3 {
            color: #003366;
        }
        .prose p, .prose li {
            color: #374151; /* text-gray-700 */
        }
        .prose strong {
            color: #111827; /* text-gray-900 */
        }
      `}</style>
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

export default TermsAndConditionsPage;
