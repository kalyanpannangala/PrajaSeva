// pages/index.tsx
'use client';

import { useState } from 'react';
import { ArrowRight, ShieldCheck, Landmark, BarChart3, Zap, MessageCircleQuestion, Star } from 'lucide-react';
import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Seo from '../components/Seo';
import FloatingChatbot from '../components/FloatingChatbot';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
// --- Type assertion for FloatingChatbot props ---
const TypedFloatingChatbot = FloatingChatbot as React.FC<{
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}>;

// ---------- Motion Variants ----------
const container = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, duration: 0.5 },
  },
};
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

// ---------- Page Component ----------
const PrajaSevaModernLanding: NextPage = () => {
  const router = useRouter();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#003366] font-sans antialiased">
      <Seo />

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
              <Link href="/auth" className="ml-2 inline-block bg-gradient-to-r from-[#003366] to-[#0055A4] text-white px-4 py-2 rounded-lg shadow-md hover:scale-[1.01] transform transition">Get Started</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-0">
        {/* HERO */}
        <section className="relative overflow-hidden">
          {/* Parallax decorative blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute -left-24 -top-40 w-80 h-80 rounded-full bg-blue-200/80 mix-blend-multiply filter blur-3xl opacity-70"
              variants={floatSlow}
              initial="animate"
              animate="animate"
              aria-hidden
            />
            <motion.div
              className="absolute -right-24 -top-36 w-80 h-80 rounded-full bg-cyan-200/80 mix-blend-multiply filter blur-3xl opacity-70"
              variants={floatMedium}
              initial="animate"
              animate="animate"
              aria-hidden
            />
            <motion.div
              className="absolute left-1/2 -bottom-48 transform -translate-x-1/2 w-[60rem] h-[40rem] rounded-full bg-gradient-to-r from-[#e8f2ff] to-[#f1f9ff] opacity-60 filter blur-2xl"
              style={{ mixBlendMode: 'soft-light' }}
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 12, repeat: Infinity }}
              aria-hidden
            />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <motion.div initial="hidden" animate="show" variants={container} className="max-w-5xl mx-auto text-center py-24 md:py-32">
              <motion.div variants={fadeUp} className="inline-flex items-center bg-blue-100/80 backdrop-blur-sm text-[#003366] rounded-full px-4 py-2 text-sm font-medium mb-6">
                <Star className="h-4 w-4 mr-2" /> Trusted by thousands
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl md:text-5.5xl lg:text-6xl font-extrabold leading-tight mb-6">
                Empowering Citizens with
                <br />
                <span className="bg-gradient-to-r from-[#003366] to-[#0055A4] bg-clip-text text-transparent"> Intelligent Financial Guidance</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8">
                PrajaSeva gives you personalized government scheme recommendations, tax optimisation and wealth planning — all in one secure, AI-powered platform.
              </motion.p>

              <motion.div variants={fadeUp} className="flex justify-center gap-4 flex-col sm:flex-row">
                <Link href="/auth" className="inline-flex items-center gap-3 justify-center bg-gradient-to-r from-[#003366] to-[#0055A4] text-white font-semibold py-4 px-8 rounded-xl shadow-xl hover:scale-[1.03] transform transition text-lg">
                  Discover Your Entitlements
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <a href="#features" className="inline-flex items-center gap-3 justify-center bg-white/90 text-[#003366] border border-blue-100 py-4 px-8 rounded-xl shadow-sm hover:shadow-md transition text-lg">
                  Explore Features
                </a>
              </motion.div>

              {/* Stats */}
              <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
                <div className="bg-white/90 p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold">50K+</div>
                  <div className="text-gray-600 mt-2">Active Users</div>
                </div>
                <div className="bg-white/90 p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold">550+</div>
                  <div className="text-gray-600 mt-2">Govt Schemes</div>
                </div>
                <div className="bg-white/90 p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold">₹4.5Cr+</div>
                  <div className="text-gray-600 mt-2">Tax Savings</div>
                </div>
                <div className="bg-white/90 p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold">98%</div>
                  <div className="text-gray-600 mt-2">Satisfaction Rate</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-20 bg-[#F8FAFB]">
          <div className="container mx-auto px-6">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={container} className="text-center max-w-4xl mx-auto mb-12">
              <motion.h2 variants={fadeUp} className="text-4xl font-bold mb-4">A Unified Platform for Your Financial Well-being</motion.h2>
              <motion.p variants={fadeUp} className="text-gray-600 text-lg">Leverage cutting-edge technology for smarter financial decisions.</motion.p>
            </motion.div>

            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" initial="hidden" whileInView="show" viewport={{ once: true }}>
              <motion.div variants={fadeUp} className="group bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transform hover:-translate-y-3 transition">
                <div className="p-3 bg-blue-50 inline-block rounded-lg mb-4">
                  <Landmark className="h-8 w-8 text-[#003366]" />
                </div>
                <h3 className="text-2xl font-bold text-[#003366] mb-3">Govt. Scheme Recommender</h3>
                <p className="text-gray-600 leading-relaxed">AI-driven matching of your profile to eligible central and state schemes, ensuring you receive the benefits you qualify for.</p>
                <div className="mt-6">
                  <Link href="/schemes-landing" className="text-[#0055A4] font-semibold inline-flex items-center gap-2">Explore <ArrowRight className="h-4 w-4" /></Link>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="group bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transform hover:-translate-y-3 transition">
                <div className="p-3 bg-green-50 inline-block rounded-lg mb-4">
                  <BarChart3 className="h-8 w-8 text-green-800" />
                </div>
                <h3 className="text-2xl font-bold text-[#003366] mb-3">Intelligent Tax Advisory</h3>
                <p className="text-gray-600 leading-relaxed">Clear, personalized advice on tax regimes, deductions and investment avenues to legally minimize tax liability.</p>
                <div className="mt-6">
                  <Link href="/tax-landing" className="text-[#0055A4] font-semibold inline-flex items-center gap-2">Learn More <ArrowRight className="h-4 w-4" /></Link>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="group bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transform hover:-translate-y-3 transition">
                <div className="p-3 bg-yellow-50 inline-block rounded-lg mb-4">
                  <Zap className="h-8 w-8 text-yellow-800" />
                </div>
                <h3 className="text-2xl font-bold text-[#003366] mb-3">Strategic Wealth Advisory</h3>
                <p className="text-gray-600 leading-relaxed">Data-backed investment strategies and personalized projections to help you meet your financial goals.</p>
                <div className="mt-6">
                  <Link href="/wealth-landing" className="text-[#0055A4] font-semibold inline-flex items-center gap-2">Start Planning <ArrowRight className="h-4 w-4" /></Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* PROCESS */}
        <section id="process" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={container}>
              <motion.h2 variants={fadeUp} className="text-4xl font-bold text-center text-[#003366] mb-12">Your Path to Financial Clarity in 3 Steps</motion.h2>
              <div className="relative">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gray-200 transform -translate-y-1/2"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {[
                    { title: 'Secure Registration', text: 'Create your account in minutes with our secure sign-up.', num: '1' },
                    { title: 'Build Your Profile', text: 'Provide key information through our guided wizard for a complete financial snapshot.', num: '2' },
                    { title: 'Access Your Dashboard', text: 'Instantly view personalized insights and actionable recommendations.', num: '3' }
                  ].map((s, i) => (
                    <motion.div key={s.title} variants={fadeUp} className="text-center relative z-10">
                      <div className="mx-auto bg-[#003366] text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white shadow-md">{s.num}</div>
                      <h3 className="text-xl font-semibold text-[#003366] mt-6 mb-2">{s.title}</h3>
                      <p className="text-gray-600">{s.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECURITY */}
        <section id="security" className="py-20 bg-[#F8FAFB]">
          <div className="container mx-auto px-6">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={container} className="flex flex-col md:flex-row items-center gap-12">
              <motion.div variants={fadeUp} className="md:w-1/2">
                <ShieldCheck className="h-16 w-16 text-[#003366] mb-4" />
                <h2 className="text-4xl font-bold text-[#003366] mb-4">Security is Our Foundation</h2>
                <p className="text-gray-600 text-lg leading-relaxed">We use bank-grade encryption and industry best practices to protect your data. Privacy and security are integral to our design choices.</p>
              </motion.div>
              <motion.div variants={fadeUp} className="md:w-1/2 space-y-4">
                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border">
                  <span className="text-green-500 font-bold text-2xl mr-4">✓</span>
                  <span className="text-gray-700 text-lg">End-to-End Data Encryption</span>
                </div>
                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border">
                  <span className="text-green-500 font-bold text-2xl mr-4">✓</span>
                  <span className="text-gray-700 text-lg">Strict Data Privacy Controls</span>
                </div>
                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border">
                  <span className="text-green-500 font-bold text-2xl mr-4">✓</span>
                  <span className="text-gray-700 text-lg">Compliant with Data Protection Laws</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CHATBOT TEASER */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={container} className="bg-gradient-to-r from-[#003366] to-[#004488] rounded-xl p-10 text-center text-white">
              <MessageCircleQuestion className="h-16 w-16 mx-auto mb-4 opacity-90" />
              <motion.h3 variants={fadeUp} className="text-3xl font-bold mb-2">Questions? PrajaSeva AI is here to help.</motion.h3>
              <motion.p variants={fadeUp} className="text-lg text-gray-200 max-w-2xl mx-auto mb-6">Our integrated AI assistant is ready to provide instant answers and guide you through the platform's features.</motion.p>
              <motion.div variants={fadeUp}>
                <button onClick={() => router.push('/dashboard/chatbot')} className="bg-white text-[#003366] font-bold py-3 px-8 rounded-lg shadow-lg hover:scale-105 transition-transform">
                  Ask a Question
                </button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-gradient-to-b from-white to-gray-100 border-t border-gray-200 pt-12 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center mb-6">
                <Image src="/PS-Logo-Bg.png" alt="PrajaSeva Logo" width={180} height={45} className="h-10 w-auto mr-3" />
              </div>
              <p className="text-gray-600 mb-6">India's premier AI-powered platform for government scheme recommendations and financial optimisation.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
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
                <li><Link href="/schemes-landing" className="text-gray-600 hover:text-blue-700">Scheme Recommendations</Link></li>
                <li><Link href="/tax-landing" className="text-gray-600 hover:text-blue-700">Tax Optimization</Link></li>
                <li><Link href="/wealth-landing" className="text-gray-600 hover:text-blue-700">Wealth Advisory</Link></li>
                <li><Link href="/dashboard/chatbot" className="text-gray-600 hover:text-blue-700">PrajaSeva AI</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Company</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-gray-600 hover:text-blue-700">About Us</Link></li>
                <li><Link href="/blog" className="text-gray-600 hover:text-blue-700">Blog</Link></li>
                <li><Link href="/careers" className="text-gray-600 hover:text-blue-700">Careers</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-blue-700">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Legal</h3>
              <ul className="space-y-3">
                <li><Link href="/privacy-policy" className="text-gray-600 hover:text-blue-700">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-600 hover:text-blue-700">Terms of Service</Link></li>
                <li><Link href="/security" className="text-gray-600 hover:text-blue-700">Security</Link></li>
                <li><Link href="/compliance" className="text-gray-600 hover:text-blue-700">Compliance</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-gray-200 text-center">
            <p className="text-gray-500">&copy; {new Date().getFullYear()} PrajaSeva. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating Chatbot (typed) */}
      <TypedFloatingChatbot
        isOpen={isChatbotOpen}
        onOpen={() => setIsChatbotOpen(true)}
        onClose={() => setIsChatbotOpen(false)}
      />
    </div>
  );
};

export default PrajaSevaModernLanding;
