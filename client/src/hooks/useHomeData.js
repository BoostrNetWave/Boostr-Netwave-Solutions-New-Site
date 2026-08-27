import { useState, useEffect } from 'react';
import axios from 'axios';
import { homeSeed } from '../data/home.seed';
import API_BASE from '../config/api';

export function useHomeData() {
  const [data, setData] = useState({
    ...homeSeed,
    loading: true,
    services: [],
    products: [],
    testimonials: [],
    clients: [], // client projects for marquee
  });

  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      try {
        const [
          servicesRes, 
          productsRes, 
          projectsRes,
          testimonialsRes,
          settingsRes
        ] = await Promise.allSettled([
          axios.get(`${API_BASE}/services`),
          axios.get(`${API_BASE}/products`),
          axios.get(`${API_BASE}/client-projects`),
          axios.get(`${API_BASE}/testimonials`),
          axios.get(`${API_BASE}/settings`)
        ]);
        
        if (!isMounted) return;

        const liveServices = servicesRes.status === 'fulfilled' ? servicesRes.value.data.data : [];
        const liveProducts = productsRes.status === 'fulfilled' ? productsRes.value.data.data : [];
        const liveProjects = projectsRes.status === 'fulfilled' ? projectsRes.value.data.data : [];
        const liveTestimonials = testimonialsRes.status === 'fulfilled' ? testimonialsRes.value.data.data : [];
        const liveSettings = settingsRes.status === 'fulfilled' ? settingsRes.value.data.data : {};

        // For TrustMarquee: partnerships (from settings/seed for now) + top 3 live products as a fallback or client projects
        // We'll use homeSeed.partnerships for now, and live projects for clients
        
        setData(prev => ({
          ...prev,
          loading: false,
          services: liveServices.length ? liveServices : homeSeed.services,
          products: liveProducts.length ? liveProducts : homeSeed.solutions,
          clients: liveProjects,
          testimonials: liveTestimonials.length ? liveTestimonials : homeSeed.testimonials,
          partnerships: homeSeed.partnerships,
          settings: liveSettings
        }));

      } catch (err) {
        console.error("Error fetching home data:", err);
        if (isMounted) {
          setData(prev => ({ ...prev, loading: false }));
        }
      }
    }

    fetchData();

    return () => { isMounted = false; };
  }, []);

  return data;
}
