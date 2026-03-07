// components/Header.tsx
'use client';

import { useState, useEffect, useRef, FC } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User, Settings, LogOut, Bell, ChevronDown, Menu, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Google Translate type declarations
declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

interface UserProfile {
  name: string;
}

const Header: FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const mobileNavRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [translateLoaded, setTranslateLoaded] = useState(false);

    // --- NEW: Logout Function ---
    const handleLogout = () => {
        // Remove the token from local storage to end the session
        localStorage.removeItem('authToken');
        // Redirect to the authentication page
        router.push('/');
    };

    // Initialize Google Translate
    useEffect(() => {
        const checkGoogleTranslate = () => {
            if (window.google && window.google.translate && !translateLoaded) {
                const desktopElement = document.getElementById('google_translate_element');
                const mobileElement = document.getElementById('google_translate_element_mobile');
                
                if (desktopElement && !desktopElement.hasChildNodes()) {
                    new window.google.translate.TranslateElement(
                        {
                            pageLanguage: 'en',
                            includedLanguages: 'hi,bn,te,ta,mr,gu,kn,ml,pa,ur,or,as,ne,sa,ks,sd',
                            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                            autoDisplay: false
                        },
                        'google_translate_element'
                    );
                }
                
                if (mobileElement && !mobileElement.hasChildNodes()) {
                    new window.google.translate.TranslateElement(
                        {
                            pageLanguage: 'en',
                            includedLanguages: 'hi,bn,te,ta,mr,gu,kn,ml,pa,ur,or,as,ne,sa,ks,sd',
                            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                            autoDisplay: false
                        },
                        'google_translate_element_mobile'
                    );
                }
                setTranslateLoaded(true);
            }
        };

        // Check immediately
        checkGoogleTranslate();

        // Also check periodically in case script loads late
        const interval = setInterval(checkGoogleTranslate, 100);
        const timeout = setTimeout(() => clearInterval(interval), 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [translateLoaded]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            try {
                const response = await fetch('/api/user/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser({ name: data.full_name });
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserProfile();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (dropdownRef.current && !dropdownRef.current.contains(target)) {
                setIsDropdownOpen(false);
            }
            if (mobileNavRef.current && !mobileNavRef.current.contains(target)) {
                setIsMobileNavOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getAvatarUrl = () => {
        if (!user?.name) return 'https://placehold.co/100x100/E9ECEF/003366?text=...';
        const initial = user.name.charAt(0).toUpperCase();
        return `https://placehold.co/100x100/E9ECEF/003366?text=${initial}`;
    };
    
    const navLinks = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/dashboard/schemes', label: 'Schemes' },
        { href: '/dashboard/tax', label: 'Tax Advisory' },
        { href: '/dashboard/wealth', label: 'Wealth Advisory' },
    ];

    return (
    <header className="relative h-20 bg-white border-b border-gray-200/80 flex items-center px-6 sticky top-0 z-40">
            {/* Left: Logo */}
            <div className="flex items-center flex-shrink-0 cursor-pointer" onClick={() => router.push('/dashboard')}>
                <img src="/PS-Logo-Bg.png" alt="PrajaSeva Logo" className="h-12" />
            </div>

            {/* Center: Navigation */}
            <nav className="flex-1 flex justify-center">
                <div className="hidden md:flex items-center space-x-4 bg-white/60 backdrop-blur px-4 py-2 rounded-full shadow-sm">
                    {navLinks.map(link => (
                        <a
                            key={link.href}
                            href={link.href}
                            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${pathname === link.href ? 'bg-[#003366] text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center space-x-4">
                {/* Google Translate Widget */}
                <div className="hidden md:block">
                    <div id="google_translate_element" className="translate-widget"></div>
                </div>

                {/* Mobile menu button (visible on small screens) */}
                <div className="md:hidden" ref={mobileNavRef}>
                    <button onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} aria-label="Open navigation" className="p-2 rounded-md hover:bg-gray-50">
                        <Menu className="h-6 w-6 text-gray-600" />
                    </button>
                </div>
                

                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 px-2 py-1 rounded-full hover:bg-gray-50">
                        <img
                            src={getAvatarUrl()}
                            alt="User Avatar"
                            className="h-10 w-10 rounded-full border-2 border-gray-200"
                        />
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.18 }}
                                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl border border-gray-200/80 overflow-hidden"
                            >
                                <div className="p-4 border-b">
                                    <p className="font-semibold text-[#003366]">{user?.name || 'Loading...'}</p>
                                    <p className="text-sm text-gray-500">Welcome back!</p>
                                </div>
                                <div className="py-2">
                                    <a href="/dashboard/profile" className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"><User className="mr-3 h-5 w-5"/> My Profile</a>
                                    <a href="/dashboard/settings" className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"><Settings className="mr-3 h-5 w-5"/> Settings</a>
                                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-50 mt-1 border-t"><LogOut className="mr-3 h-5 w-5"/> Logout</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Mobile navigation dropdown (small screens) */}
            <AnimatePresence>
                {isMobileNavOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.16 }}
                        className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50"
                    >
                        <div className="flex flex-col divide-y">
                            {navLinks.map(link => (
                                <a key={link.href} href={link.href} onClick={() => setIsMobileNavOpen(false)} className={`px-6 py-4 text-base font-medium ${pathname === link.href ? 'bg-gray-100 text-[#003366]' : 'text-gray-700 hover:bg-gray-50'}`}>
                                    {link.label}
                                </a>
                            ))}
                            {/* Translate Widget for Mobile */}
                            <div className="px-6 py-4 bg-gray-50">
                                <div className="flex items-center gap-2">
                                    <Languages className="h-5 w-5 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">Language:</span>
                                </div>
                                <div id="google_translate_element_mobile" className="mt-2"></div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
