// pages/download.tsx
'use client';

import { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  Mail, 
  UserCheck, 
  Settings, 
  LogIn, 
  Shield, 
  CheckCircle2,
  FileText,
  Lock,
  Users,
  TrendingUp,
  Heart
} from 'lucide-react';
import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Seo from '../components/Seo';
import FloatingChatbot from '../components/FloatingChatbot';
import { motion, type Variants } from 'framer-motion';

// Type assertion for FloatingChatbot
const TypedFloatingChatbot = FloatingChatbot as React.FC<{
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}>;

// Motion variants
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const floatSlow: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 6, repeat: Infinity, ease: [0.42, 0, 0.58, 1] },
  },
};

const floatMedium: Variants = {
  animate: {
    y: [0, -12, 0],
    transition: { duration: 8, repeat: Infinity, ease: [0.42, 0, 0.58, 1] },
  },
};

const DownloadPage: NextPage = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const handleDownload = () => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = '/PrajaSeva.apk';
    link.download = 'PrajaSeva.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#003366] font-sans antialiased">
      <Seo 
        title="Download PrajaSeva App | Android Mobile Application"
        description="Download the PrajaSeva mobile app for Android. Access government schemes, tax calculations, and wealth management tools on the go."
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="backdrop-blur-lg bg-white/70 border-b border-gray-200">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" aria-label="PrajaSeva Home" className="flex items-center gap-3">
              <Image src="/PS-Logo-Bg.png" alt="PrajaSeva" width={168} height={44} className="h-10 w-auto" priority />
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/about" className="hidden md:inline text-sm text-gray-700 hover:text-[#003366]">About</Link>
              <Link href="/blog" className="hidden md:inline text-sm text-gray-700 hover:text-[#003366]">Blog</Link>
              <Link href="/contact" className="hidden md:inline text-sm text-gray-700 hover:text-[#003366]">Contact</Link>
              <Link href="/auth" className="ml-2 inline-block bg-gradient-to-r from-[#003366] to-[#0055A4] text-white px-4 py-2 rounded-lg shadow-md hover:scale-[1.01] transform transition">Get Started</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-0">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#003366] via-[#0055A4] to-[#0077CC] text-white">
          {/* Decorative blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute -left-24 -top-40 w-80 h-80 rounded-full bg-blue-400/30 mix-blend-overlay filter blur-3xl"
              variants={floatSlow}
              initial="animate"
              animate="animate"
              aria-hidden
            />
            <motion.div
              className="absolute -right-24 top-20 w-96 h-96 rounded-full bg-cyan-400/20 mix-blend-overlay filter blur-3xl"
              variants={floatMedium}
              initial="animate"
              animate="animate"
              aria-hidden
            />
          </div>

          <div className="container mx-auto px-6 py-32 md:py-40 relative z-10">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial="hidden"
              animate="show"
              variants={fadeUp}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Smartphone className="w-4 h-4" />
                <span className="text-sm font-medium">Native Android Experience</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                PrajaSeva Mobile App
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                Bridging the gap between citizens and government services. Access schemes, tax tools, and wealth management right from your mobile device.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    onClick={handleDownload}
                    className="group flex items-center gap-3 bg-white text-[#003366] px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
                  >
                    <Download className="w-6 h-6 group-hover:animate-bounce" />
                    Download for Android
                    <span className="text-sm opacity-70">(APK)</span>
                  </button>
                </motion.div>
              </div>

              <p className="mt-6 text-sm text-blue-200">
                <Shield className="w-4 h-4 inline mr-2" />
                100% Free • Secure • No Ads
              </p>
            </motion.div>
          </div>

          {/* Wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="#F8F9FA"/>
            </svg>
          </div>
        </section>

        {/* DOWNLOAD SECTION */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Get Started in Minutes
              </h2>
              <p className="text-lg text-gray-600 mb-12">
                Download the app and follow these simple steps to start accessing government services
              </p>
            </motion.div>

            {/* Installation Instructions */}
            <div className="max-w-4xl mx-auto mb-16">
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-lg border border-blue-100"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Download className="w-6 h-6 text-[#003366]" />
                  Installation Instructions
                </h3>
                <ol className="space-y-4 text-gray-700">
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-[#003366] text-white rounded-full flex items-center justify-center font-bold">1</span>
                    <div>
                      <strong className="block mb-1">Download the APK file</strong>
                      <p className="text-sm">Click the download button above to get the PrajaSeva app APK file</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-[#003366] text-white rounded-full flex items-center justify-center font-bold">2</span>
                    <div>
                      <strong className="block mb-1">Enable installation from unknown sources</strong>
                      <p className="text-sm">Go to Settings → Security → Enable "Unknown Sources" or "Install Unknown Apps"</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-[#003366] text-white rounded-full flex items-center justify-center font-bold">3</span>
                    <div>
                      <strong className="block mb-1">Install the app</strong>
                      <p className="text-sm">Open the downloaded APK file and follow the on-screen instructions</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-[#003366] text-white rounded-full flex items-center justify-center font-bold">4</span>
                    <div>
                      <strong className="block mb-1">Launch PrajaSeva</strong>
                      <p className="text-sm">Open the app and start your journey with government services</p>
                    </div>
                  </li>
                </ol>
              </motion.div>
            </div>

            {/* Registration & Login Steps */}
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Registration Card */}
              <motion.div
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#003366] to-[#0055A4] rounded-xl flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">New User Registration</h3>
                </div>

                <div className="space-y-5">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-[#003366] rounded-full flex items-center justify-center font-semibold text-sm">1</div>
                    <div>
                      <h4 className="font-semibold mb-1 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Fill Your Details
                      </h4>
                      <p className="text-sm text-gray-600">
                        Enter your full name, email address, and create a secure password
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-[#003366] rounded-full flex items-center justify-center font-semibold text-sm">2</div>
                    <div>
                      <h4 className="font-semibold mb-1 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Verification
                      </h4>
                      <p className="text-sm text-gray-600">
                        Check your inbox for a verification email and click the link to verify your account
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-[#003366] rounded-full flex items-center justify-center font-semibold text-sm">3</div>
                    <div>
                      <h4 className="font-semibold mb-1 flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Profile Setup
                      </h4>
                      <p className="text-sm text-gray-600">
                        Complete your profile with additional information to personalize your experience
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-600">You're All Set!</h4>
                      <p className="text-sm text-gray-600">
                        Start exploring government schemes and services
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Login Card */}
              <motion.div
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0055A4] to-[#0077CC] rounded-xl flex items-center justify-center">
                    <LogIn className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Existing User Login</h3>
                </div>

                <div className="space-y-5">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-[#003366] rounded-full flex items-center justify-center font-semibold text-sm">1</div>
                    <div>
                      <h4 className="font-semibold mb-1 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Enter Your Email
                      </h4>
                      <p className="text-sm text-gray-600">
                        Use the email address you registered with
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-[#003366] rounded-full flex items-center justify-center font-semibold text-sm">2</div>
                    <div>
                      <h4 className="font-semibold mb-1 flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Enter Your Password
                      </h4>
                      <p className="text-sm text-gray-600">
                        Type your secure password to access your account
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-600">Welcome Back!</h4>
                      <p className="text-sm text-gray-600">
                        Access your dashboard and continue where you left off
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-gray-700">
                      <strong>Forgot your password?</strong> Use the "Forgot Password" link in the app to reset it via email.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ABOUT PRAJASEVA PROJECT */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl mx-auto"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
                About PrajaSeva
              </h2>
              <p className="text-lg text-gray-600 mb-12 text-center">
                Empowering citizens through technology and accessible government services
              </p>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#003366] to-[#0055A4] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">For the People</h3>
                  <p className="text-gray-600 text-sm">
                    Designed to make government services accessible to every citizen, regardless of technical expertise
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#0055A4] to-[#0077CC] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
                  <p className="text-gray-600 text-sm">
                    Your data is encrypted and protected with industry-standard security measures
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#0077CC] to-[#00A4E0] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Always Free</h3>
                  <p className="text-gray-600 text-sm">
                    No hidden costs, no subscriptions. PrajaSeva is and will always be free for all citizens
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold mb-6">What We Offer</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Government Scheme Finder</h4>
                      <p className="text-sm text-gray-600">
                        Discover schemes you're eligible for based on your profile and needs
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Tax Calculator</h4>
                      <p className="text-sm text-gray-600">
                        Calculate your income tax and explore tax-saving opportunities
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Wealth Management Tools</h4>
                      <p className="text-sm text-gray-600">
                        Get personalized financial advice and investment recommendations
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">AI-Powered Chatbot</h4>
                      <p className="text-sm text-gray-600">
                        Get instant answers to your questions about schemes and services
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Document Export</h4>
                      <p className="text-sm text-gray-600">
                        Save and export your results as PDF for easy sharing and record-keeping
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Multilingual Support</h4>
                      <p className="text-sm text-gray-600">
                        Access services in your preferred language for better understanding
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#003366]" />
                    Our Mission
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    PrajaSeva aims to bridge the digital divide and make government services accessible to every Indian citizen. 
                    We believe that technology should empower people, not complicate their lives. Through our platform, we're 
                    simplifying access to essential services, helping citizens discover their rights and benefits, and providing 
                    tools for better financial planning and decision-making.
                  </p>
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="text-gray-600 mb-6">
                  Have questions or need support? We're here to help!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/contact" 
                    className="inline-flex items-center justify-center gap-2 bg-white text-[#003366] border-2 border-[#003366] px-6 py-3 rounded-lg font-semibold hover:bg-[#003366] hover:text-white transition-all"
                  >
                    Contact Support
                  </Link>
                  <Link 
                    href="/about" 
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#003366] to-[#0055A4] text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
                  >
                    Learn More About Us
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SYSTEM REQUIREMENTS */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-3xl mx-auto"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h2 className="text-3xl font-bold mb-8 text-center">System Requirements</h2>
              <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold mb-3 text-lg">Minimum Requirements</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        Android 6.0 (Marshmallow) or higher
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        2GB RAM or more
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        50MB free storage space
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        Active internet connection
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold mb-3 text-lg">Permissions Required</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        Internet access (for data sync)
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        Storage (for saving documents)
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        Network state (for connectivity check)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-gradient-to-br from-[#003366] to-[#0055A4] text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">PrajaSeva</h3>
              <p className="text-sm text-blue-200">
                Empowering citizens through accessible government services and financial tools.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-blue-200 hover:text-white">About Us</Link></li>
                <li><Link href="/blog" className="text-blue-200 hover:text-white">Blog</Link></li>
                <li><Link href="/contact" className="text-blue-200 hover:text-white">Contact</Link></li>
                <li><Link href="/careers" className="text-blue-200 hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy-policy" className="text-blue-200 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-blue-200 hover:text-white">Terms of Service</Link></li>
                <li><Link href="/security" className="text-blue-200 hover:text-white">Security</Link></li>
                <li><Link href="/compliance" className="text-blue-200 hover:text-white">Compliance</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:support@prajaseva.com" className="text-blue-200 hover:text-white">support@prajaseva.com</a></li>
                <li className="text-blue-200">Available 24/7</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-400/30 pt-8 text-center text-sm text-blue-200">
            <p>&copy; 2026 PrajaSeva. All rights reserved. Made with ❤️ for Indian Citizens.</p>
          </div>
        </div>
      </footer>

      {/* Floating Chatbot */}
      <TypedFloatingChatbot
        isOpen={isChatbotOpen}
        onOpen={() => setIsChatbotOpen(true)}
        onClose={() => setIsChatbotOpen(false)}
      />
    </div>
  );
};

export default DownloadPage;
