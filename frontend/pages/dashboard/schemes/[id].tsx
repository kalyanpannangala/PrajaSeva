// pages/schemes/[id].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { 
  ArrowLeft, CheckCircle, ExternalLink, FileText, 
  Landmark, ShieldCheck, MapPin, Building2, ListChecks, FileInput, AlertCircle, Mail 
} from 'lucide-react';
import Header from '../../../components/Header';
import FloatingChatbot from '../../../components/FloatingChatbot';
import fs from 'fs';
import path from 'path';

// --- Type Definition based on your JSON structure ---
interface SchemeDetail {
  scheme_id: string;
  scheme_name: string;
  state: string;
  issuing_authority: string;
  objective: string;
  benefits_summary: string;
  benefits_list: string[];
  eligibility_criteria: string[];
  how_to_apply: string;
  required_documents: string[];
  official_link: string;
}

interface SchemeDetailsPageProps {
  scheme: SchemeDetail | null;
  error?: string; // Added to help debug data issues
}

export default function SchemeDetailsPage({ scheme, error }: SchemeDetailsPageProps) {
  // If there is a specific file reading error or no scheme found
  if (!scheme) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] font-sans">
        <Header />
        <div className="flex flex-col items-center justify-center p-8 mt-10">
          <div className="text-center bg-white p-10 rounded-xl shadow-lg border border-gray-200 max-w-lg">
            <div className="bg-red-100 p-4 rounded-full inline-flex items-center justify-center mb-6">
              <FileText className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-[#003366] mb-4">Scheme Not Found</h1>
            <p className="text-gray-600 mb-6 text-lg">
              {error ? `System Error: ${error}` : "We couldn't find details for this specific scheme ID."}
            </p>
            <p className="text-sm text-gray-500 mb-8">
              This usually means the ID in the URL doesn't match any ID in our database.
            </p>
            <Link href="/dashboard/schemes" className="inline-flex items-center justify-center px-6 py-3 bg-[#003366] hover:bg-[#002244] text-white font-semibold rounded-lg transition-colors duration-300">
              <ArrowLeft className="w-5 h-5 mr-2" /> Back to All Schemes
            </Link>
          </div>
        </div>
        <FloatingChatbot />
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FA] min-h-screen font-sans">
      <Head>
        <title>{scheme.scheme_name} | PrajaSeva</title>
      </Head>
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Breadcrumb / Back Button */}
        <div className="mb-6">
          <Link href="/dashboard/schemes" className="inline-flex items-center text-gray-600 hover:text-[#003366] transition-colors font-medium">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Recommendations
          </Link>
        </div>

        {/* Hero / Header Section */}
        <div className="bg-white rounded-t-xl shadow-lg border border-gray-200 border-b-0 overflow-hidden">
          <div className="bg-[#003366] p-6 md:p-10 text-white">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2 mb-1">
                <span className="inline-flex items-center bg-blue-500/20 text-blue-50 text-xs font-bold px-3 py-1 rounded-full border border-blue-400/30">
                  ID: {scheme.scheme_id}
                </span>
                <span className="inline-flex items-center bg-green-500/20 text-green-50 text-xs font-bold px-3 py-1 rounded-full border border-green-400/30">
                  <MapPin className="w-3 h-3 mr-1" /> {scheme.state}
                </span>
              </div>
              
              <h1 className="text-2xl md:text-4xl font-bold leading-tight tracking-tight">
                {scheme.scheme_name}
              </h1>
              
              <div className="flex items-center text-blue-100 text-sm md:text-base mt-2">
                <Building2 className="w-5 h-5 mr-2 flex-shrink-0" />
                <span className="font-medium">{scheme.issuing_authority}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-b-xl shadow-lg border border-gray-200 border-t-0 p-6 md:p-10 space-y-10">
          
          {/* Objective & Benefits Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#003366] mb-3 flex items-center">
                  <Landmark className="w-5 h-5 mr-2" /> Objective
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {scheme.objective}
                </p>
              </div>
              
              <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                <h3 className="text-lg font-bold text-[#003366] mb-2 flex items-center">
                  Overview of Benefits
                </h3>
                <p className="text-gray-700">
                  {scheme.benefits_summary}
                </p>
              </div>
            </div>

            {/* Quick Links / Sidebar Area (if needed later, currently empty or used for structure) */}
            <div className="hidden lg:block lg:col-span-1">
               {/* This space can be used for related schemes or ads in future */}
            </div>
          </div>

          <div className="border-t border-gray-100 my-8"></div>

          {/* Two Column Layout for Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Detailed Benefits List */}
            <div>
              <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 mr-2" /> Detailed Benefits
              </h3>
              <ul className="space-y-3">
                {scheme.benefits_list?.map((item, index) => (
                  <li key={index} className="flex items-start text-gray-700 bg-green-50/50 p-3 rounded-md">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                )) || <p className="text-gray-500">No specific benefits listed.</p>}
              </ul>
            </div>

            {/* Eligibility Criteria */}
            <div>
              <h3 className="text-xl font-bold text-[#D4AF37] mb-4 flex items-center">
                <ShieldCheck className="w-6 h-6 mr-2" /> Eligibility Criteria
              </h3>
              <ul className="space-y-3">
                {scheme.eligibility_criteria?.map((item, index) => (
                  <li key={index} className="flex items-start text-gray-700 bg-yellow-50/50 p-3 rounded-md">
                    <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                )) || <p className="text-gray-500">Eligibility details not available.</p>}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 my-8"></div>

          {/* Application & Documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* How to Apply */}
             <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-xl font-bold text-[#003366] mb-4 flex items-center">
                  <FileInput className="w-6 h-6 mr-2" /> How to Apply
                </h3>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {scheme.how_to_apply || 'Process details not available.'}
                </p>
             </div>

             {/* Documents Required */}
             <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-xl font-bold text-[#003366] mb-4 flex items-center">
                  <ListChecks className="w-6 h-6 mr-2" /> Required Documents
                </h3>
                <ul className="space-y-2">
                  {scheme.required_documents?.map((doc, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <FileText className="w-4 h-4 text-gray-400 mr-2" />
                      {doc}
                    </li>
                  )) || <li className="text-gray-500">No documents listed.</li>}
                </ul>
             </div>
          </div>

          {/* Official Link Action */}
          <div className="flex justify-center pt-6">
            {scheme.official_link && (
              <a 
                href={scheme.official_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#003366] hover:bg-[#002244] text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 text-lg w-full md:w-auto"
              >
                Visit Official Website <ExternalLink className="w-5 h-5 ml-2" />
              </a>
            )}
          </div>

          {/* Note / Disclaimer - Gap Reduced */}
          <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded-lg text-center">
             <p className="text-red-700 font-medium text-sm md:text-base flex items-center justify-center">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                Note : Please visit your local Sachivalayam / Government Administration Office for the most accurate and up-to-date scheme details.
             </p>
          </div>

          {/* Support Info */}
          <div className="mt-12 text-center text-gray-600">
             <p className="mb-2">For queries use our <span className="font-semibold text-[#003366]"><Link href="/dashboard/chatbot" className="font-semibold text-[#003366] hover:underline">
                PrajaSeva AI ChatBot
            </Link></span></p>
             <p className="flex items-center justify-center">
                or for exclusive support reach us at 
                <a href="mailto:prajaseva-ai@gmail.com" className="ml-1 text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center">
                   prajaseva.ai@gmail.com <Mail className="w-4 h-4 ml-1" />
                </a>
             </p>
          </div>

        </div>
      </main>
      <FloatingChatbot />
    </div>
  );
}

// --- Pre-render all scheme pages at build time ---
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const filePath = path.join(process.cwd(), 'components', 'schemes_details.json');
    console.log("🔍 [getStaticPaths] Checking for data file at:", filePath);
    
    if (!fs.existsSync(filePath)) {
      console.warn("❌ [getStaticPaths] WARNING: schemes_details.json not found!");
      return { paths: [], fallback: 'blocking' };
    }

    const jsonData = fs.readFileSync(filePath, 'utf8');
    const schemes = JSON.parse(jsonData);

    if (!Array.isArray(schemes)) {
        console.error("❌ [getStaticPaths] JSON data is not an array. Please check file structure.");
        return { paths: [], fallback: 'blocking' };
    }

    // Generate paths for every scheme ID
    const paths = schemes.map((scheme: SchemeDetail) => ({
      params: { id: scheme.scheme_id },
    }));

    console.log(`✅ [getStaticPaths] Generated ${paths.length} paths.`);
    return { paths, fallback: 'blocking' };
  } catch (error) {
    console.error("❌ [getStaticPaths] Error:", error);
    return { paths: [], fallback: 'blocking' };
  }
};

// --- Fetch data for a specific scheme ---
export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const id = params?.id as string;
    const filePath = path.join(process.cwd(), 'components', 'schemes_details.json');
    
    console.log(`🔍 [getStaticProps] Fetching details for ID: ${id}`);

    if (!fs.existsSync(filePath)) {
        console.error("❌ [getStaticProps] Data file missing.");
        return { 
            props: { scheme: null, error: "Data file (schemes_details.json) is missing on server." } 
        };
    }

    const jsonData = fs.readFileSync(filePath, 'utf8');
    const schemes = JSON.parse(jsonData);

    if (!Array.isArray(schemes)) {
        console.error("❌ [getStaticProps] JSON data is not an array.");
        return { 
            props: { scheme: null, error: "Data file structure is invalid (not an array)." } 
        };
    }

    // Find the specific scheme
    const scheme = schemes.find((s: SchemeDetail) => s.scheme_id === id) || null;

    if (!scheme) {
        console.warn(`⚠️ [getStaticProps] Scheme ID '${id}' not found in JSON data.`);
    } else {
        console.log(`✅ [getStaticProps] Found scheme: ${scheme.scheme_name}`);
    }

    return {
      props: { 
        scheme,
        error: scheme ? null : `Scheme ID '${id}' not found in database.` 
      },
      revalidate: 60, 
    };
  } catch (error: any) {
    console.error("❌ [getStaticProps] Error:", error);
    return { 
        props: { scheme: null, error: error.message || "Internal Server Error" } 
    };
  }
};
