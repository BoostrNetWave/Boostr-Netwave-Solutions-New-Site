import React from 'react';

export default function StructuredData({ schemaType, data }) {
  if (!schemaType || !data) return null;

  const baseSchema = {
    "@context": "https://schema.org",
    "@type": schemaType,
    ...data
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(baseSchema) }}
    />
  );
}
