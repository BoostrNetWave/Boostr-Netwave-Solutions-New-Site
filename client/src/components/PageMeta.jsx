import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function PageMeta({ title, description, url, image, ogType }) {
  const siteName = "Boostr Netwave Solutions";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDesc = "We specialize in software engineering, AI/ML, cloud services, and proprietary SaaS platforms that empower businesses globally.";
  
  // Use a generic placeholder for social sharing if none is provided
  const finalImage = image || "https://boostrnetwave.com/images/og-default.jpg";
  const finalType = ogType || "website";
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      {url && <link rel="canonical" href={url} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:type" content={finalType} />
      <meta property="og:site_name" content={siteName} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={finalImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta name="twitter:image" content={finalImage} />
    </Helmet>
  );
}
