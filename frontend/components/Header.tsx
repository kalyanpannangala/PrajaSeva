// app/components/Header.tsx
'use client';

import { useState, useEffect, useRef, FC } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User, Settings, LogOut, Bell, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Define a type for our user state ---
interface UserProfile {
  name: string;
}

const Header: FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // --- State to hold the dynamic user data ---
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                // Handle case where user is not logged in
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }
                const data = await response.json();
                // Assuming the API returns { full_name: '...' }
                setUser({ name: data.full_name }); 
            } catch (error) {
                console.error(error);
                // Handle error, maybe redirect to login
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const navLinks = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/schemes', label: 'Schemes' },
        { href: '/tax-advisory', label: 'Tax Advisory' },
        { href: '/wealth-advisory', label: 'Wealth Advisory' },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getAvatarUrl = () => {
        if (isLoading || !user?.name) {
            return 'https://placehold.co/100x100/E9ECEF/003366?text=...';
        }
        const initial = user.name.charAt(0).toUpperCase();
        return `https://placehold.co/100x100/E9ECEF/003366?text=${initial}`;
    };

    return (
        <header className="h-20 bg-white border-b border-gray-200/80 flex items-center justify-between px-6 sticky top-0 z-40">
            {/* Left Side: Logo and Main Nav */}
            <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => router.push('/dashboard')}>
                    <img src="/PS-Logo.png" alt="PrajaSeva Logo" className="h-12" />
                </div>
                <nav className="hidden md:flex items-center space-x-6">
                    {navLinks.map(link => (
                        <a 
                            key={link.href} 
                            href={link.href}
                            className={`text-lg font-medium transition-colors ${pathname === link.href ? 'text-[#003366]' : 'text-gray-500 hover:text-[#003366]'}`}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>
            </div>

            {/* Right Side: Actions and Profile Dropdown */}
            <div className="flex items-center space-x-6">
                <button className="text-gray-500 hover:text-[#003366] relative">
                    <Bell className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2">
                        <img 
                            src={getAvatarUrl()} 
                            alt="User Avatar" 
                            className="h-10 w-10 rounded-full border-2 border-gray-300"
                        />
                        <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl border border-gray-200/80 overflow-hidden"
                            >
                                <div className="p-4 border-b">
                                    <p className="font-bold text-[#003366]">{user?.name || 'Loading...'}</p>
                                    <p className="text-sm text-gray-500">Welcome back!</p>
                                </div>
                                <div className="py-2">
                                    <a href="/profile" className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"><User className="mr-3 h-5 w-5"/> My Profile</a>
                                    <a href="/settings" className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"><Settings className="mr-3 h-5 w-5"/> Settings</a>
                                    <a href="#" className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-50 mt-1 border-t"><LogOut className="mr-3 h-5 w-5"/> Logout</a>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default Header;
