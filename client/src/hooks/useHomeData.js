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
    clients: [],
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
          settingsRes,
          galleryRes,
        ] = await Promise.allSettled([
          axios.get(`${API_BASE}/services`),
          axios.get(`${API_BASE}/products`),
          axios.get(`${API_BASE}/client-projects`),
          axios.get(`${API_BASE}/testimonials`),
          axios.get(`${API_BASE}/settings`),
          axios.get(`${API_BASE}/gallery`),
        ]);

        if (!isMounted) return;

        const liveServices     = servicesRes.status     === 'fulfilled' ? servicesRes.value.data.data     : [];
        const liveProducts     = productsRes.status     === 'fulfilled' ? productsRes.value.data.data     : [];
        const liveProjects     = projectsRes.status     === 'fulfilled' ? projectsRes.value.data.data     : [];
        const liveTestimonials = testimonialsRes.status === 'fulfilled' ? testimonialsRes.value.data.data : [];
        const liveSettings     = settingsRes.status     === 'fulfilled' ? settingsRes.value.data.data     : {};
        const liveGallery      = galleryRes.status      === 'fulfilled' ? galleryRes.value.data.data      : [];

        // ── Bridge: map flat DB settings keys → nested structure components read ──
        // The admin panel saves flat keys like "hero.heading", "stats.happyClients".
        // Section components read data.hero.heading, data.about.description, data.stats etc.
        // Without this mapping, admin changes are saved to DB but never reach the UI.

        const mergedHero = {
          ...homeSeed.hero,
          eyebrow:        liveSettings['hero.eyebrow']        || homeSeed.hero.eyebrow,
          heading:        liveSettings['hero.heading']        || homeSeed.hero.heading,
          supportingText: liveSettings['hero.supportingText'] || homeSeed.hero.supportingText,
          primaryCta:     liveSettings['hero.primaryCta']     || homeSeed.hero.primaryCta,
          secondaryCta:   liveSettings['hero.secondaryCta']   || homeSeed.hero.secondaryCta,
        };

        const mergedAbout = {
          ...homeSeed.about,
          heading:     liveSettings['about.heading']     || homeSeed.about.heading,
          description: liveSettings['about.description'] || homeSeed.about.description,
        };

        // Stats: each stat maps to a settings key by its label
        const statKeyMap = {
          'Years of Experience': 'stats.yearsExperience',
          'Happy Clients':       'stats.happyClients',
          'Satisfaction':        'stats.satisfaction',
        };
        const mergedStats = homeSeed.stats.map(stat => {
          const key = statKeyMap[stat.label];
          const liveValue = key && liveSettings[key];
          return (liveValue !== undefined && liveValue !== '')
            ? { ...stat, value: Number(liveValue) || liveValue }
            : stat;
        });

        setData(prev => ({
          ...prev,
          loading:      false,
          hero:         mergedHero,
          about:        mergedAbout,
          stats:        mergedStats,
          services:     liveServices.length ? liveServices : homeSeed.services,
          products:     liveProducts.length ? liveProducts : homeSeed.solutions,
          clients:      liveProjects,
          testimonials: liveTestimonials.length ? liveTestimonials : homeSeed.testimonials,
          partnerships: homeSeed.partnerships,
          // DELIBERATE: no seed fallback for gallery.
          // If DB is empty, pass [] so the section hides itself cleanly.
          gallery:      liveGallery,
          settings:     liveSettings,
        }));

      } catch (err) {
        console.error('Error fetching home data:', err);
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
