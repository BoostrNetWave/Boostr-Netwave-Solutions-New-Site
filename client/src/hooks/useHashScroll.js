import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Handles scrolling to hash anchors after React Router navigation.
 * When a user navigates to /#services from /contact, React Router
 * changes the route to / but doesn't scroll to #services.
 * This hook listens for hash in the URL and scrolls after the page mounts.
 */
export function useHashScroll() {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash; // e.g. "#services"
    if (!hash) return;

    const id = hash.replace('#', '');

    // Try immediately, then with a delay to allow page to fully render
    const tryScroll = (attemptsLeft = 10) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (attemptsLeft > 0) {
        setTimeout(() => tryScroll(attemptsLeft - 1), 150);
      }
    };

    // Small initial delay to let page render
    setTimeout(tryScroll, 100);
  }, [location.pathname, location.hash]);
}
