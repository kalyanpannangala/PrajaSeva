'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

interface ExportButtonProps {
    services: ('schemes' | 'tax' | 'wealth')[];
}

const ExportButton: React.FC<ExportButtonProps> = ({ services }) => {
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleExport = async () => {
        setIsExporting(true);
        setError(null);
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error("Authentication token not found. Please log in again.");
            }

            const response = await fetch('/api/export/pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ services })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Failed to generate the PDF report.');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'PrajaSeva_Report.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

        } catch (err: any) {
            console.error("Export failed:", err);
            setError(err.message);
            // Hide error message after 5 seconds
            setTimeout(() => setError(null), 5000);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                title="Export a summary of your results to a PDF file."
            >
                {isExporting ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating...
                    </>
                ) : (
                    <>
                        <Download className="mr-2 h-5 w-5" />
                        Export
                    </>
                )}
            </button>
            {error && (
                 <div className="absolute top-full mt-2 right-0 text-xs bg-red-100 text-red-700 p-2 rounded-md shadow-lg w-48">
                    <strong>Error:</strong> {error}
                </div>
            )}
        </div>
    );
};

export default ExportButton;
