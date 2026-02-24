import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const navRoutes = {
  '1': '/',
  '2': '/attack-paths',
  '3': '/assessment',
  '4': '/about',
};

function useGlobalKeyboard({ onToggleHelp }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleKeyDown = useCallback(
    (e) => {
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable
      ) {
        return;
      }

      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // ? — toggle help overlay
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        if (onToggleHelp) onToggleHelp();
        return;
      }

      // Check if a page-level handler has already claimed number keys
      // We look for a data attribute on the body that pages can set
      const pageClaimsNumbers = document.body.dataset.claimNumberKeys === 'true';

      if (!pageClaimsNumbers && !e.shiftKey) {
        const route = navRoutes[e.key];
        if (route && route !== location.pathname) {
          e.preventDefault();
          navigate(route);
          return;
        }
      }
    },
    [navigate, location.pathname, onToggleHelp]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export default useGlobalKeyboard;
