import React from 'react';
import HeroSection from '../../components/sections/HeroSection';
import TrustMarquee from '../../components/sections/TrustMarquee';
import AboutSection from '../../components/sections/AboutSection';
import ServicesSection from '../../components/sections/ServicesSection';
import ProcessSection from '../../components/sections/ProcessSection';
import ProductsSection from '../../components/sections/ProductsSection';
import PartnershipSection from '../../components/sections/PartnershipSection';
import GallerySection from '../../components/sections/GallerySection';
import TestimonialsSection from '../../components/sections/TestimonialsSection';
import ContactCTA from '../../components/sections/ContactCTA';
import LeadershipVideoSection from '../../components/sections/LeadershipVideoSection';
import { useHomeData } from '../../hooks/useHomeData';
import PageMeta from '../../components/PageMeta';
import StructuredData from '../../components/StructuredData';

export default function Home() {
  const data = useHomeData();

  if (data.loading) {
    return <div className="min-h-screen bg-ink flex justify-center items-center"><div className="w-8 h-8 border-2 border-blue/30 border-t-blue rounded-full animate-spin"/></div>;
  }

  return (
    <>
      <PageMeta 
        title="Boostr Netwave Solutions" 
        description="Engineering the Digital Future. Build and change your future with Boostr Netwave Solutions." 
        url={"https://boostrnetwave.com" + window.location.pathname}
      />
      <StructuredData 
        schemaType="Organization"
        data={{
          name: "Boostr Netwave Solutions Pvt Ltd",
          url: "https://boostrnetwave.com",
          logo: "https://boostrnetwave.com/logo.png",
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+91-9556679622",
            contactType: "customer service",
            email: "contact@boostrnetwave.com",
            areaServed: ["IN", "US", "GB", "AE"],
            availableLanguage: "en"
          },
          sameAs: [
            "https://linkedin.com/company/boostr-netwave",
            "https://twitter.com/boostrnetwave",
            "https://instagram.com/boostrnetwave"
          ]
        }}
      />
      <StructuredData 
        schemaType="LocalBusiness"
        data={{
          name: "Boostr Netwave Solutions Pvt Ltd",
          image: "https://boostrnetwave.com/logo.png",
          "@id": "https://boostrnetwave.com",
          url: "https://boostrnetwave.com",
          telephone: "+91-9556679622",
          address: {
            "@type": "PostalAddress",
            streetAddress: "AIC Nalanda",
            addressLocality: "Bhubaneswar",
            addressRegion: "OD",
            postalCode: "751024",
            addressCountry: "IN"
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 20.296059,
            longitude: 85.824539
          },
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "18:00"
          }
        }}
      />
      <HeroSection data={data} />
      <TrustMarquee data={data} />
      <AboutSection data={data} />
      <ServicesSection data={data} />
      <LeadershipVideoSection data={data} />
      <ProcessSection data={data} />
      <ProductsSection data={data} />
      <PartnershipSection data={data} />
      <GallerySection data={data} />
      <TestimonialsSection data={data} />
      <ContactCTA data={data} />
    </>
  );
}
