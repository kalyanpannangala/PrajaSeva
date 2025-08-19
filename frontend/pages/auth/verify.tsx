// app/auth/verify/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

const VerifyComponent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('Verifying your account...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No verification token found. Please check your email link.');
            return;
        }

        const verifyToken = async () => {
            try {
                // IMPORTANT: Replace with your actual backend URL
                const response = await fetch('http://localhost:8000/api/auth/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Verification failed.');
                }

                // Store the token to keep the user logged in
                localStorage.setItem('authToken', data.token);

                setStatus('success');
                setMessage('Verification successful! Redirecting...');

                // Redirect to the privacy consent page after a short delay
                setTimeout(() => {
                    router.push('/privacy');
                }, 2000);

            } catch (error: any) {
                setStatus('error');
                setMessage(error.message || 'An error occurred. Please try again.');
            }
        };

        verifyToken();
    }, [token, router]);

    return (
        <div className="bg-[#F8F9FA] min-h-screen flex items-center justify-center font-sans">
            <div className="w-full max-w-md p-8 text-center bg-white rounded-xl shadow-2xl border border-gray-200/80">
                {status === 'verifying' && <Loader2 className="h-16 w-16 mx-auto text-[#003366] animate-spin" />}
                {status === 'success' && <CheckCircle className="h-16 w-16 mx-auto text-green-600" />}
                {status === 'error' && <AlertTriangle className="h-16 w-16 mx-auto text-red-600" />}
                <p className="mt-6 text-xl font-semibold text-gray-700">{message}</p>
            </div>
        </div>
    );
};

// Wrap the component in Suspense as required by Next.js for useSearchParams
const Verify = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <VerifyComponent />
    </Suspense>
);

export default Verify;

