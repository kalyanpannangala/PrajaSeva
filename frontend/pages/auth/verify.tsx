// pages/auth/verify.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

const VerifyPage = () => {
    const router = useRouter();
    
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('Verifying your account...');

    useEffect(() => {
        // This effect will run whenever router.isReady or router.query changes.
        // We wait until the router is ready and has parsed the query parameters.
        if (!router.isReady) {
            return; // Do nothing until the router is fully initialized.
        }

        // Now that the router is ready, we can safely access the token.
        const { token } = router.query;

        if (!token || typeof token !== 'string') {
            setStatus('error');
            setMessage('No verification token found or the link is invalid.');
            return;
        }

        const verifyToken = async () => {
            try {
                // The API endpoint is relative to your project root
                const response = await fetch('/api/auth/verify', {
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
                    router.push('/consent');
                }, 2000);

            } catch (error: any) {
                setStatus('error');
                setMessage(error.message || 'An error occurred. Please try again.');
            }
        };

        // Call the verification function only when we are sure we have a token.
        verifyToken();
        
    }, [router.isReady, router.query, router]); // Depend on router.isReady and router.query

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

export default VerifyPage;
