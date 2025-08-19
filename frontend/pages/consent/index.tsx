// app/privacy/page.tsx
'use client';

import Link from 'next/link';
import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Database, BrainCircuit, Share2, ArrowRight, UserCheck, FileText, X } from 'lucide-react';

const PrivacyStatementPage: NextPage = () => {
  const router = useRouter();

  const handleAgree = () => {
    // In a real app, you might set a flag in localStorage or a cookie
    // to confirm the user has agreed to the terms.
    router.push('/setup');
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen flex flex-col items-center justify-center font-sans p-6">
        {/* --- New In-Page Header --- */}
    <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-lg border-b border-gray-200/80 flex items-center justify-between px-6 z-50">
      <div className="flex items-center">
        <img src="/PS-Logo-Bg.png" alt="PrajaSeva Logo" className="h-12" />
      </div>
      <Link href="/"  className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
        <X className="h-6 w-6" />
        <span className="font-semibold">Exit</span>
      </Link>
    </header>
    <div className="mt-20"></div>

      
      <div className="w-full max-w-4xl mx-auto">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#003366]">Data Privacy & Consent</h1>
          <p className="mt-3 text-lg text-gray-600">
            Your trust is our foundation. Please review our commitment to your privacy before proceeding.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl border border-gray-200/80">
          <div className="space-y-10">

            {/* Introduction */}
            <div>
                <p className="text-gray-700 leading-relaxed">
                    Welcome to PrajaSeva. To provide you with personalized financial and social welfare recommendations, we need to collect and process some of your personal information. This document outlines exactly what data we collect, how we use it, and the robust measures we take to protect it.
                </p>
            </div>

            {/* Data We Collect Section */}
            <div className="flex items-start space-x-5">
              <div className="flex-shrink-0 p-3 bg-gray-100 rounded-full">
                <Database className="h-8 w-8 text-gray-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#003366]">1. Information We Collect</h2>
                <p className="mt-1 text-gray-700 leading-relaxed">
                  During the next step (Profile Setup), we will ask you to provide the following information. This data forms the basis of all our personalized analyses.
                </p>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-1 list-inside mt-3 text-gray-600">
                  <li>- Age & Gender</li>
                  <li>- State of Residence</li>
                  <li>- Social Category (Caste)</li>
                  <li>- Education Level</li>
                  <li>- Employment Type</li>
                  <li>- Annual Income</li>
                  <li>- Number of Dependents</li>
                  <li>- Disability Status</li>
                </ul>
              </div>
            </div>
            
            {/* How We Use Your Data Section */}
            <div className="flex items-start space-x-5">
              <div className="flex-shrink-0 p-3 bg-blue-100 rounded-full">
                <BrainCircuit className="h-8 w-8 text-[#003366]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#003366]">2. How We Use Your Information</h2>
                <p className="mt-1 text-gray-700 leading-relaxed">
                  Your data is used exclusively by our secure, automated Machine Learning models for the sole purpose of providing the core services of the PrajaSeva platform:
                </p>
                 <ul className="list-disc list-inside mt-2 text-gray-700 space-y-1">
                  <li><b>To Recommend Government Schemes:</b> Your demographic and financial data is analyzed to identify central and state government schemes for which you are likely eligible.</li>
                  <li><b>To Provide Tax Advisory:</b> Your income and dependent data is used to calculate your potential tax liability under different regimes and suggest optimization strategies.</li>
                  <li><b>To Offer Wealth Advisory:</b> Your financial snapshot helps us suggest suitable government-backed investment and savings plans.</li>
                </ul>
              </div>
            </div>

            {/* Security Section */}
            <div className="flex items-start space-x-5">
              <div className="flex-shrink-0 p-3 bg-green-100 rounded-full">
                <ShieldCheck className="h-8 w-8 text-green-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#003366]">3. Data Security & Encryption</h2>
                <p className="mt-1 text-gray-700 leading-relaxed">
                  We employ industry-standard security protocols to protect your information. All data is encrypted both in transit (using TLS) and at rest. Access to your personal data is strictly limited to authorized systems and personnel.
                </p>
              </div>
            </div>

            {/* Data Sharing Section */}
            <div className="flex items-start space-x-5">
              <div className="flex-shrink-0 p-3 bg-red-100 rounded-full">
                <Share2 className="h-8 w-8 text-red-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#003366]">4. Third-Party Data Sharing</h2>
                <p className="mt-1 text-gray-700 leading-relaxed">
                  We state this unequivocally: Your personal, identifiable information will **never** be shared with, sold, rented, or otherwise disclosed to any third-party companies or external organizations for marketing or any other purpose.
                </p>
              </div>
            </div>

             {/* Your Rights Section */}
            <div className="flex items-start space-x-5">
              <div className="flex-shrink-0 p-3 bg-yellow-100 rounded-full">
                <UserCheck className="h-8 w-8 text-yellow-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#003366]">5. Your Rights and Control</h2>
                <p className="mt-1 text-gray-700 leading-relaxed">
                  You are in full control of your data. Through the "My Profile" and "Settings" pages, you have the right to access, review, and edit your information at any time. You also have the right to request the permanent deletion of your account and all associated data.
                </p>
              </div>
            </div>
          </div>

          {/* Agreement Button */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <h3 className="text-2xl font-bold text-[#003366]">Acceptance of Terms</h3>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">By clicking the button below, you confirm that you have read, understood, and agree to the terms outlined above for the collection and processing of your personal data.</p>
            <button
              onClick={handleAgree}
              className="group flex items-center mx-auto mt-6 bg-[#003366] hover:bg-[#002244] text-white font-bold py-4 px-10 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
            >
              I Understand and Agree
              <ArrowRight className="ml-3 h-6 w-6 transform group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-xs text-gray-500 mt-4">
              You can review our full <a href="#" className="underline hover:text-[#003366]">Terms of Service</a> and <a href="#" className="underline hover:text-[#003366]">Privacy Policy</a> for more details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyStatementPage;
