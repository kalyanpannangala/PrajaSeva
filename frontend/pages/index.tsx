import { ArrowRight, ShieldCheck, Landmark, BarChart3, Zap, MessageCircleQuestion } from 'lucide-react';
import type { NextPage } from 'next';
import Link from 'next/link';

const PrajaSevaClassicLandingPage: NextPage = () => {
  return (
    <div className="bg-[#F8F9FA] text-[#003366] font-sans">
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

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 md:py-32 text-center bg-white">
          <div className="container mx-auto px-6">
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#003366] leading-tight mb-6">
              Empowering Citizens Through <br /> Intelligent Financial Guidance
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              PrajaSeva is the nation's premier digital platform for personalized government scheme recommendations, tax advisory, and wealth management.
            </p>
            <div className="flex justify-center">
                <Link href="/auth" className="flex items-center bg-[#D4AF37] hover:bg-[#b89b31] text-white font-bold py-4 px-10 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300 text-lg">
                Discover Your Entitlements
                <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-[#E9ECEF]/50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-[#003366] mb-4">A Unified Platform for Your Financial Well-being</h2>
            <p className="text-gray-600 text-lg mb-16">Leverage cutting-edge technology for smarter financial decisions.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature Card 1 */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200/80 text-left transform hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="p-3 bg-blue-100 inline-block rounded-lg mb-4">
                  <Landmark className="h-8 w-8 text-[#003366]" />
                </div>
                <h3 className="text-2xl font-bold text-[#003366] mb-3">Govt. Scheme Recommender</h3>
                <p className="text-gray-600 leading-relaxed">Our AI-driven engine matches your profile to eligible central and state government schemes, ensuring you never miss a benefit.</p>
              </div>

              {/* Feature Card 2 */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200/80 text-left transform hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="p-3 bg-green-100 inline-block rounded-lg mb-4">
                  <BarChart3 className="h-8 w-8 text-green-800" />
                </div>
                <h3 className="text-2xl font-bold text-[#003366] mb-3">Intelligent Tax Advisory</h3>
                <p className="text-gray-600 leading-relaxed">Receive clear, personalized advice on choosing the optimal tax regime and identify investment options to legally reduce your tax burden.</p>
              </div>

              {/* Feature Card 3 */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200/80 text-left transform hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="p-3 bg-yellow-100 inline-block rounded-lg mb-4">
                  <Zap className="h-8 w-8 text-yellow-800" />
                </div>
                <h3 className="text-2xl font-bold text-[#003366] mb-3">Strategic Wealth Advisory</h3>
                <p className="text-gray-600 leading-relaxed">Get data-backed insights and personalized investment strategies to help you build and manage your wealth effectively.</p>
              </div>
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
              <button className="bg-white text-[#003366] font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                Ask a Question
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#E9ECEF]/70 border-t border-gray-200">
        <div className="container mx-auto px-6 py-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} PrajaSeva. All Rights Reserved.</p>
          <div className="mt-4 space-x-6">
            <a href="/privacy-policy" className="hover:text-[#003366]">Privacy Policy</a>
            <a href="/terms" className="hover:text-[#003366]">Terms of Service</a>
            <a href="/contact" className="hover:text-[#003366]">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrajaSevaClassicLandingPage;
