import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, url, type = 'website' }) => {
  const siteName = 'Sancart';
  const defaultTitle = 'Sancart - Premium E-commerce Trending Catalog';
  const defaultDescription = 'Explore sancart trending and hot dropshipping items with premium quality, secure payments, and fast shipping.';
  const defaultImage = '/images/sancart-w-full.webp';
  
  // Use production domain as fallback
  const baseUrl = import.meta.env.VITE_FRONTEND_URL || 'https://sancart.in';

  const metaTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const metaDescription = description || defaultDescription;
  const metaImage = image ? (image.startsWith('http') ? image : `${baseUrl}${image}`) : `${baseUrl}${defaultImage}`;
  const canonicalUrl = url ? `${baseUrl}${url}` : baseUrl;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
};

export default SEO;
