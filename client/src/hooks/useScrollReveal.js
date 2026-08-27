import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollReveal() {
  const location = useLocation();
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Optional: stop observing once revealed
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
    
    // Function to observe all current reveal elements
    const observeElements = () => {
      const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
      revealEls.forEach(el => {
        if (!el.classList.contains('visible')) {
          observer.observe(el);
        }
      });
    };

    // Initial observation
    observeElements();

    // Watch for dynamically added elements (like after data loading)
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);
}
