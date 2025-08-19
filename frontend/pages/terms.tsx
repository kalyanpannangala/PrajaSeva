// app/terms-and-conditions/page.tsx
'use client';

import type { NextPage } from 'next';
import Link from 'next/link';

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
            <p><strong>PrajaSeva Support</strong><br/>Email: support@prajaseva.gov.in (example email)</p>
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

export default TermsAndConditionsPage;
