// components/withAuth.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';
import { Loader2 } from 'lucide-react';
import type { NextPage } from 'next';

/**
 * A Higher-Order Component (HOC) that protects a page from unauthenticated access.
 * It checks for a valid JWT in localStorage and redirects to the /auth page if it's missing or expired.
 * @param {NextPage} WrappedComponent - The page component to protect.
 */
const withAuth = <P extends object>(WrappedComponent: NextPage<P>) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        router.replace('/auth');
        return;
      }

      try {
        const decodedToken: { exp: number } = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          // Token is expired
          localStorage.removeItem('authToken');
          router.replace('/auth');
        } else {
          // Token is valid
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Token is invalid or malformed
        console.error("Invalid token:", error);
        localStorage.removeItem('authToken');
        router.replace('/auth');
      }
    }, [router]);

    // While checking, show a loading spinner to prevent content flashing
    if (!isAuthenticated) {
      return (
        <div className="bg-[#F8F9FA] min-h-screen flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#003366]" />
        </div>
      );
    }

    // If authenticated, render the actual page component
    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
