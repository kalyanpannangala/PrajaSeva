// pages/index.tsx (or your main landing page file)
import { ArrowRight, ShieldCheck, Landmark, BarChart3, Zap, MessageCircleQuestion, Users, ChevronRight, CheckCircle, Star } from 'lucide-react';
import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Seo from '../components/Seo';

const PrajaSevaClassicLandingPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900 font-sans">
      <Seo />
      
      {/* Enhanced Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3 cursor-pointer group" aria-label="Go to home">
            <div className="relative">
              <Image 
                src="/PS-Logo-Bg.png" 
                alt="PrajaSeva Logo" 
                width={192}
                height={48}
                className="h-12 w-auto transition-all duration-300 group-hover:scale-105"
                priority
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
              PrajaSeva
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">
              Features
            </Link>
            <Link href="#process" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">
              How It Works
            </Link>
            <Link href="#security" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">
              Security
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">
              About
            </Link>
          </nav>

          <Link href="/auth" className="bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </header>

      <main className="pt-24">
        {/* Enhanced Hero Section */}
        <section className="py-20 md:py-32 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 z-0"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-4 py-2 text-sm font-medium mb-6">
                <Star className="h-4 w-4 mr-2 fill-current" /> Trusted by thousands of Indian citizens
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                  Empowering Citizens
                </span>
                <br />
                Through Intelligent Financial Guidance
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed">
                PrajaSeva is India's premier AI-powered platform for personalized government scheme recommendations, tax optimization, and wealth management—all in one place.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/auth" className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-4 px-10 rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300 text-lg">
                  Discover Your Entitlements
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
                <Link href="#features" className="flex items-center justify-center bg-white text-blue-700 border-2 border-blue-200 hover:border-blue-300 font-bold py-4 px-10 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-lg">
                  Explore Features
                </Link>
              </div>
            </div>
            
            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-20">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-blue-700">50K+</div>
                <div className="text-gray-600 mt-2">Active Users</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-blue-700">1.2K+</div>
                <div className="text-gray-600 mt-2">Govt Schemes</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-blue-700">₹4.5Cr+</div>
                <div className="text-gray-600 mt-2">Tax Savings</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-blue-700">98%</div>
                <div className="text-gray-600 mt-2">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section id="features" className="py-20 bg-gradient-to-b from-white to-blue-50/30">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-2xl mx-auto mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">A Unified Platform for Your Financial Well-being</h2>
              <p className="text-gray-700 text-lg">Leverage cutting-edge AI technology for smarter financial decisions and optimal benefit discovery</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link href="/schemes-landing" className="group block text-left">
                <div className="bg-white p-8 h-full rounded-2xl shadow-lg border border-gray-100 transform group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300">
                  <div className="p-3 bg-blue-100 inline-block rounded-xl mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                    <Landmark className="h-8 w-8 text-blue-700" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Govt. Scheme Recommender</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">Our AI-driven engine matches your profile to eligible central and state government schemes, ensuring you never miss a benefit.</p>
                  <div className="flex items-center text-blue-600 font-medium mt-4">
                    Explore schemes <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>

              <Link href="/tax-landing" className="group block text-left">
                <div className="bg-white p-8 h-full rounded-2xl shadow-lg border border-gray-100 transform group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300">
                  <div className="p-3 bg-green-100 inline-block rounded-xl mb-4 group-hover:bg-green-200 transition-colors duration-300">
                    <BarChart3 className="h-8 w-8 text-green-700" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Intelligent Tax Advisory</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">Receive clear, personalized advice on choosing the optimal tax regime and identify investment options to legally reduce your tax burden.</p>
                  <div className="flex items-center text-green-600 font-medium mt-4">
                    Optimize taxes <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>

              <Link href="/wealth-landing" className="group block text-left">
                <div className="bg-white p-8 h-full rounded-2xl shadow-lg border border-gray-100 transform group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300">
                  <div className="p-3 bg-amber-100 inline-block rounded-xl mb-4 group-hover:bg-amber-200 transition-colors duration-300">
                    <Zap className="h-8 w-8 text-amber-700" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Strategic Wealth Advisory</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">Get data-backed insights and personalized investment strategies to help you build and manage your wealth effectively.</p>
                  <div className="flex items-center text-amber-600 font-medium mt-4">
                    Grow wealth <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        
        {/* Enhanced Process Section */}
        <section id="process" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Path to Financial Clarity in 3 Simple Steps</h2>
              <p className="text-gray-700 text-lg">Getting started with PrajaSeva is quick, easy, and completely secure</p>
            </div>
            
            <div className="relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-100 to-blue-200 transform -translate-y-1/2 z-0"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 text-center relative z-10">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform hover:-translate-y-2 transition-all duration-300">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-500 text-white w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg mb-6">
                    1
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure Registration</h3>
                  <p className="text-gray-600">Create your account in minutes with our secure and straightforward sign-up process.</p>
                </div>
                
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform hover:-translate-y-2 transition-all duration-300">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-500 text-white w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg mb-6">
                    2
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Build Your Profile</h3>
                  <p className="text-gray-600">Provide key information through our guided wizard for a complete financial snapshot.</p>
                </div>
                
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform hover:-translate-y-2 transition-all duration-300">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-500 text-white w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg mb-6">
                    3
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Access Your Dashboard</h3>
                  <p className="text-gray-600">Instantly view personalized insights and actionable recommendations on your dashboard.</p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-16">
              <Link href="/auth" className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>


        {/* Enhanced Security Section */}
        <section id="security" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                  <div className="inline-flex items-center justify-center p-4 bg-blue-100 rounded-2xl mb-6">
                    <ShieldCheck className="h-12 w-12 text-blue-700" />
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Security is Our Foundation</h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    We are committed to the highest standards of data security and privacy. Your trust is our most important asset.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-blue-50 rounded-xl">
                      <CheckCircle className="h-6 w-6 text-green-600 mr-4 flex-shrink-0" />
                      <span className="text-gray-800">End-to-End Data Encryption</span>
                    </div>
                    <div className="flex items-center p-4 bg-blue-50 rounded-xl">
                      <CheckCircle className="h-6 w-6 text-green-600 mr-4 flex-shrink-0" />
                      <span className="text-gray-800">Strict Data Privacy Controls</span>
                    </div>
                    <div className="flex items-center p-4 bg-blue-50 rounded-xl">
                      <CheckCircle className="h-6 w-6 text-green-600 mr-4 flex-shrink-0" />
                      <span className="text-gray-800">Compliant with Data Protection Laws</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-2xl shadow-lg text-white">
                  <h3 className="text-2xl font-bold mb-4">Why Users Trust PrajaSeva</h3>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-blue-500 p-2 rounded-lg mr-4">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">1 Million+ Users</h4>
                        <p className="text-blue-100 text-sm">Joined our platform in the last year</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-blue-500 p-2 rounded-lg mr-4">
                        <Star className="h-6 w-6 fill-current" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">4.8/5 Rating</h4>
                        <p className="text-blue-100 text-sm">Based on 15,000+ reviews</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-blue-500 p-2 rounded-lg mr-4">
                        <ShieldCheck className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Zero Breaches</h4>
                        <p className="text-blue-100 text-sm">Since our launch in 2020</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced AI Chatbot Teaser */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-2xl p-12 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
              <div className="relative z-10">
                <MessageCircleQuestion className="h-16 w-16 mx-auto mb-6 opacity-90" />
                <h3 className="text-3xl font-bold mb-4">Questions? PrajaSeva AI is here to help.</h3>
                <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
                  Our integrated AI assistant is ready to provide instant answers and guide you through the platform's features.
                </p>
                <Link href="/dashboard/chatbot" className="inline-flex items-center bg-white text-blue-700 font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                  Ask a Question <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
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
                  width={140}
                  height={35}
                  className="h-8 w-auto mr-3"
                />
                <span className="text-xl font-bold text-blue-800">PrajaSeva</span>
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
                <li><a href="/dashboard/chatbot" className="text-gray-600 hover:text-blue-700 transition-colors duration-300">AI Assistant</a></li>
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

export default PrajaSevaClassicLandingPage;