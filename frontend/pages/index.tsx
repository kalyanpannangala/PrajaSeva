// pages/index.tsx (or your main landing page file)
import { useState } from 'react';
import { ArrowRight, ShieldCheck, Landmark, BarChart3, Zap, MessageCircleQuestion,Star } from 'lucide-react';
import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Seo from '../components/Seo';
import FloatingChatbot from '../components/FloatingChatbot'; // <-- Import the chatbot

// --- FIX: Add type assertion to resolve prop type inference issue ---
const TypedFloatingChatbot = FloatingChatbot as React.FC<{
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}>;
const PrajaSevaClassicLandingPage: NextPage = () => {
  const router = useRouter();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false); // <-- State to control the chatbot

  return (
    <div className="bg-[#F8F9FA] text-[#003366] font-sans">
      <Seo /> {/* Use the default SEO props for the homepage */}
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

            <Link href="/auth" className="hidden md:block bg-[#003366] hover:bg-[#002244] text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
              Get Started
            </Link>
        </div>
      </header>

      <main className="pt-24">
        <section className="py-20 md:py-32 text-center relative overflow-hidden bg-gray-50">
  <div className="container mx-auto px-6 relative z-10">
    <div className="max-w-4xl mx-auto">
      <div className="inline-flex items-center bg-blue-100 text-[#003366] rounded-full px-4 py-2 text-sm font-medium mb-6">
        <Star className="h-4 w-4 mr-2 fill-current" /> Trusted by thousands of Indian citizens
      </div>
      <h1 className="text-5xl md:text-6xl font-extrabold text-[#003366] leading-tight mb-6">
        Empowering Citizens
        <br />
        <span className="bg-gradient-to-r from-[#003366] to-[#0055A4] bg-clip-text text-transparent">
          Through Intelligent Financial Guidance
        </span>
      </h1>
      <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed">
        PrajaSeva is India's premier AI-powered platform for personalized government scheme recommendations, tax optimization, and wealth management—all in one place.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link href="/auth" className="flex items-center justify-center bg-gradient-to-r from-[#003366] to-[#0055A4] hover:from-[#002244] hover:to-[#003366] text-white font-bold py-4 px-10 rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300 text-lg">
          Discover Your Entitlements
          <ArrowRight className="ml-3 h-6 w-6" />
        </Link>
        <Link href="#features" className="flex items-center justify-center bg-white text-[#003366] border-2 border-blue-200 hover:bg-blue-50 font-bold py-4 px-10 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-lg">
          Explore Features
        </Link>
      </div>
    </div>
    
    {/* Stats Section */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-20">
      <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-3xl font-bold text-[#003366]">50K+</div>
        <div className="text-gray-600 mt-2">Active Users</div>
      </div>
      <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-3xl font-bold text-[#003366]">550+</div>
        <div className="text-gray-600 mt-2">Govt Schemes</div>
      </div>
      <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-3xl font-bold text-[#003366]">₹4.5Cr+</div>
        <div className="text-gray-600 mt-2">Tax Savings</div>
      </div>
      <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-3xl font-bold text-[#003366]">98%</div>
        <div className="text-gray-600 mt-2">Satisfaction Rate</div>
      </div>
    </div>
  </div>
</section>


        {/* Features Section */}
        <section id="features" className="py-20 bg-[#E9ECEF]/50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-[#003366] mb-4">A Unified Platform for Your Financial Well-being</h2>
            <p className="text-gray-600 text-lg mb-16">Leverage cutting-edge technology for smarter financial decisions.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <Link href="/schemes-landing" className="block text-left">
                <div className="bg-white p-8 h-full rounded-xl shadow-lg border border-gray-200/80 transform hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <div className="p-3 bg-blue-100 inline-block rounded-lg mb-4">
                    <Landmark className="h-8 w-8 text-[#003366]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#003366] mb-3">Govt. Scheme Recommender</h3>
                  <p className="text-gray-600 leading-relaxed">Our AI-driven engine matches your profile to eligible central and state government schemes, ensuring you never miss a benefit.</p>
                </div>
              </Link>

              <Link href="/tax-landing" className="block text-left">
                <div className="bg-white p-8 h-full rounded-xl shadow-lg border border-gray-200/80 transform hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <div className="p-3 bg-green-100 inline-block rounded-lg mb-4">
                    <BarChart3 className="h-8 w-8 text-green-800" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#003366] mb-3">Intelligent Tax Advisory</h3>
                  <p className="text-gray-600 leading-relaxed">Receive clear, personalized advice on choosing the optimal tax regime and identify investment options to legally reduce your tax burden.</p>
                </div>
              </Link>

              <Link href="/wealth-landing" className="block text-left">
                <div className="bg-white p-8 h-full rounded-xl shadow-lg border border-gray-200/80 transform hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <div className="p-3 bg-yellow-100 inline-block rounded-lg mb-4">
                    <Zap className="h-8 w-8 text-yellow-800" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#003366] mb-3">Strategic Wealth Advisory</h3>
                  <p className="text-gray-600 leading-relaxed">Get data-backed insights and personalized investment strategies to help you build and manage your wealth effectively.</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        
        {/* Process Section */}
        <section id="process" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-[#003366] text-center mb-12">Your Path to Financial Clarity in 3 Steps</h2>
            <div className="relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 transform -translate-y-1/2"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
                <div className="relative z-10">
                  <div className="bg-[#003366] text-white w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white shadow-md">1</div>
                  <h3 className="text-xl font-semibold text-[#003366] mt-6 mb-2">Secure Registration</h3>
                  <p className="text-gray-600">Create your account in minutes with our secure and straightforward sign-up process.</p>
                </div>
                <div className="relative z-10">
                  <div className="bg-[#003366] text-white w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white shadow-md">2</div>
                  <h3 className="text-xl font-semibold text-[#003366] mt-6 mb-2">Build Your Profile</h3>
                  <p className="text-gray-600">Provide key information through our guided wizard for a complete financial snapshot.</p>
                </div>
                <div className="relative z-10">
                  <div className="bg-[#003366] text-white w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white shadow-md">3</div>
                  <h3 className="text-xl font-semibold text-[#003366] mt-6 mb-2">Access Your Dashboard</h3>
                  <p className="text-gray-600">Instantly view personalized insights and actionable recommendations on your dashboard.</p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Security Section */}
        <section id="security" className="py-20 bg-[#E9ECEF]/50">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2 text-center md:text-left">
                <ShieldCheck className="h-16 w-16 text-[#003366] mb-4 mx-auto md:mx-0" />
                <h2 className="text-4xl font-bold text-[#003366] mb-4">Security is Our Foundation</h2>
                <p className="text-gray-600 text-lg leading-relaxed">We are committed to the highest standards of data security and privacy. Your trust is our most important asset. We utilize bank-grade encryption and robust security protocols to safeguard your sensitive information at every step.</p>
              </div>
              <div className="md:w-1/2 space-y-4">
                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                  <span className="text-green-500 font-bold text-2xl mr-4">✓</span>
                  <span className="text-gray-700 text-lg">End-to-End Data Encryption</span>
                </div>
                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                  <span className="text-green-500 font-bold text-2xl mr-4">✓</span>
                  <span className="text-gray-700 text-lg">Strict Data Privacy Controls</span>
                </div>
                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                  <span className="text-green-500 font-bold text-2xl mr-4">✓</span>
                  <span className="text-gray-700 text-lg">Compliant with Data Protection Laws</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Chatbot Teaser */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="bg-gradient-to-r from-[#003366] to-[#004488] rounded-xl p-10 text-center text-white">
              <MessageCircleQuestion className="h-16 w-16 mx-auto mb-4 opacity-80" />
              <h3 className="text-3xl font-bold mb-2">Questions? PrajaSeva AI is here to help.</h3>
              <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-6">Our integrated AI assistant is ready to provide instant answers and guide you through the platform's features.</p>
              {/* --- MODIFIED: Changed Link to button --- */}
              <button onClick={() => router.push('/dashboard/chatbot')} className="bg-white text-[#003366] font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                Ask a Question
              </button>
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

        {/* --- MODIFIED: Use the typed component --- */}
        <TypedFloatingChatbot 
            isOpen={isChatbotOpen}
            onOpen={() => setIsChatbotOpen(true)}
            onClose={() => setIsChatbotOpen(false)}
        />
    </div>
  );
};

export default PrajaSevaClassicLandingPage;
