// app/contact/page.tsx
'use client';

import type { NextPage } from 'next';
import Link from 'next/link'; // Import the Link component
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactUsPage: NextPage = () => {
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
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#003366]">Get in Touch</h1>
            <p className="mt-3 text-lg text-gray-600">We're here to help. Contact us with any questions or feedback.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* --- Contact Information --- */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[#003366] mb-4">Contact Information</h2>
                <p className="text-gray-600 mb-6">
                  For any inquiries, please reach out to us through the following channels. Our team will get back to you as soon as possible.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Mail className="h-6 w-6 text-[#003366]" />
                    <span className="text-lg text-gray-700">support@prajaseva.gov.in</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Phone className="h-6 w-6 text-[#003366]" />
                    <span className="text-lg text-gray-700">+91-1800-123-4567 (Toll-Free)</span>
                  </div>
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-[#003366] mt-1" />
                    <span className="text-lg text-gray-700">
                      PrajaSeva Headquarters<br/>
                      SV University Road, Tirupati<br/>
                      Andhra Pradesh, 517502, India
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Contact Form --- */}
            <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200/80">
              <h2 className="text-2xl font-bold text-[#003366] mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" id="fullName" name="fullName" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" id="email" name="email" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input type="text" id="subject" name="subject" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea id="message" name="message" rows={5} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"></textarea>
                </div>
                <div>
                  <button type="submit" className="w-full flex items-center justify-center bg-[#003366] hover:bg-[#002244] text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors">
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
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

export default ContactUsPage;
