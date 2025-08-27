// components/Seo.tsx
import Head from 'next/head';
import { FC } from 'react';

interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  url?: string;
}

const Seo: FC<SeoProps> = ({
  title = "PrajaSeva - Citizen Support Platform",
  description = "Get personalized government scheme recommendations, tax estimation, and wealth planning.",
  keywords = "government schemes, citizen support, income tax estimator, PrajaSeva, PrajaSeva AI",
  ogImage = "https://prajaseva-ai.vercel.app/PS-Favicon.png", // Replace with your actual OG image URL
  url = "https://prajaseva-ai.vercel.app" // Replace with your actual site URL
}) => {
  const fullTitle = title === "PrajaSeva - Citizen Support Platform" ? title : `${title} | PrajaSeva`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="PrajaSeva" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      {/* <meta name="twitter:site" content="@PrajaSeva" />  <-- Add your Twitter handle here */}

      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Head>
  );
};

export default Seo;
