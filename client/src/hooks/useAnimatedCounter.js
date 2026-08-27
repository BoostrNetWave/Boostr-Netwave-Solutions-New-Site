import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useAnimatedCounter() {
  const location = useLocation();

  useEffect(() => {
    function animateCounter(el, target, duration) {
      let start = 0;
      const step = Math.ceil(target / (duration / 16));
      const interval = setInterval(() => {
        start += step;
        if (start >= target) { 
          el.textContent = target; 
          clearInterval(interval); 
        } else {
          el.textContent = start;
        }
      }, 16);
    }
    
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-target'));
          if (!isNaN(target)) {
            animateCounter(entry.target, target, 1200);
          }
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const observeElements = () => {
      const counterEls = document.querySelectorAll('.counter-val');
      counterEls.forEach(el => {
        if (!el.hasAttribute('data-observed')) {
          el.setAttribute('data-observed', 'true');
          counterObserver.observe(el);
        }
      });
    };
    
    observeElements();

    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      counterObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);
}
