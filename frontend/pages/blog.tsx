// pages/blog.tsx
import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Seo from '../components/Seo';
import { ArrowRight, Calendar, User } from 'lucide-react';

// --- Mock Data for Blog Posts ---
const blogPosts = [
  {
    slug: 'unlocking-your-future-a-deep-dive-into-government-schemes',
    title: 'Unlocking Your Future: A Deep Dive into Government Schemes',
    excerpt: 'Discover the vast landscape of government schemes in India and learn how PrajaSeva’s AI can pinpoint the exact benefits you are entitled to, from educational grants to entrepreneurial support.',
    author: 'Priya Sharma',
    date: '2024-08-15',
    imageUrl: 'https://placehold.co/800x400/003366/FFFFFF?text=Govt.+Schemes',
    category: 'Government Schemes',
  },
  {
    slug: 'new-tax-regime-vs-old-making-the-right-choice-for-your-finances',
    title: 'New Tax Regime vs. Old: Making the Right Choice for Your Finances',
    excerpt: 'The annual tax dilemma is here. We break down the pros and cons of the new and old tax regimes with clear examples to help you make an informed decision and maximize your savings.',
    author: 'Ravi Kumar',
    date: '2024-07-28',
    imageUrl: 'https://placehold.co/800x400/28a745/FFFFFF?text=Tax+Advisory',
    category: 'Tax Advisory',
  },
  {
    slug: 'building-generational-wealth-smart-investment-strategies-for-every-indian',
    title: 'Building Generational Wealth: Smart Investment Strategies for Every Indian',
    excerpt: 'Wealth creation is a marathon, not a sprint. Explore data-driven investment strategies tailored for the Indian market, from mutual funds to government bonds, and start your journey towards financial freedom.',
    author: 'Anjali Mehta',
    date: '2024-07-10',
    imageUrl: 'https://placehold.co/800x400/ffc107/000000?text=Wealth+Management',
    category: 'Wealth Management',
  },
    {
    slug: 'the-role-of-ai-in-democratizing-financial-services-for-a-billion-people',
    title: 'The Role of AI in Democratizing Financial Services for a Billion People',
    excerpt: 'Artificial intelligence is not just a buzzword; it’s a transformative force. Learn how PrajaSeva is leveraging AI to make expert financial advice accessible, affordable, and understandable for every citizen.',
    author: 'Vikram Singh',
    date: '2024-06-25',
    imageUrl: 'https://placehold.co/800x400/17a2b8/FFFFFF?text=Technology',
    category: 'Technology',
  },
];


const BlogPage: NextPage = () => {
  const featuredPost = blogPosts[0];
  const regularPosts = blogPosts.slice(1);

  return (
    <div className="bg-white text-[#003366] font-sans">
      <Seo title="Blog | PrajaSeva" description="Stay updated with the latest insights on government schemes, tax planning, and wealth management from the experts at PrajaSeva." />
      
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
                <Link href="/blog" className="text-[#003366] font-semibold">Blog</Link>
                <Link href="/contact" className="text-gray-600 hover:text-[#003366] transition-colors">Contact</Link>
            </nav>
            <Link href="/auth" className="hidden md:block bg-[#003366] hover:bg-[#002244] text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
              Get Started
            </Link>
        </div>
      </header>

      <main className="pt-24">
        {/* Page Header */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#003366] leading-tight mb-4">
              PrajaSeva Insights
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Your trusted source for expert analysis on financial planning, government schemes, and wealth creation in India.
            </p>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-20">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <p className="text-[#D4AF37] font-semibold mb-2">Featured Article</p>
                        <h2 className="text-4xl font-bold text-[#003366] mb-4">{featuredPost.title}</h2>
                        <div className="flex items-center text-gray-500 text-sm space-x-6 mb-4">
                            <div className="flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                <span>{featuredPost.author}</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>{new Date(featuredPost.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-6">{featuredPost.excerpt}</p>
                        <Link href={`/blog/${featuredPost.slug}`} className="inline-flex items-center font-semibold text-[#003366] hover:text-[#0055A4]">
                            Read Full Story
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </div>
                    <div className="order-1 md:order-2">
                         {/* --- FIX: Replaced next/image with standard img tag --- */}
                         <img
                            src={featuredPost.imageUrl}
                            alt={featuredPost.title}
                            className="rounded-xl shadow-2xl object-cover w-full h-full"
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* All Posts */}
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center text-[#003366] mb-16">Latest Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regularPosts.map((post) => (
                        <div key={post.slug} className="bg-white rounded-xl shadow-lg border border-gray-200/80 overflow-hidden flex flex-col transform hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                            {/* --- FIX: Replaced next/image with standard img tag --- */}
                            <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6 flex flex-col flex-grow">
                                <p className="text-sm text-blue-600 font-semibold mb-2">{post.category}</p>
                                <h3 className="text-xl font-bold text-[#003366] mb-3 flex-grow">{post.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    <Link href={`/blog/${post.slug}`} className="font-semibold text-sm text-[#003366] hover:text-[#0055A4] flex items-center">
                                        Read More <ArrowRight className="ml-1.5 h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
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

export default BlogPage;
