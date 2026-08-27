import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useMagneticButton() {
  const location = useLocation();
  
  useEffect(() => {
    const attachEvents = () => {
      const magneticEls = document.querySelectorAll('.magnetic-btn');
      magneticEls.forEach(el => {
        if (!el.hasAttribute('data-magnetic-attached')) {
          el.setAttribute('data-magnetic-attached', 'true');
          el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) - rect.width / 2;
            const y = (e.clientY - rect.top) - rect.height / 2;
            el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
          });
          el.addEventListener('mouseleave', () => {
            el.style.transform = `translate(0px, 0px)`;
          });
        }
      });
    };
    
    attachEvents();
    
    const mutationObserver = new MutationObserver(() => {
      attachEvents();
    });
    
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      mutationObserver.disconnect();
    };
  }, []);
}
