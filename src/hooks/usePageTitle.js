import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const titles = {
  '/': 'IAM Threat Mapper — Identity Attack Surface Analysis',
  '/attack-paths': 'Attack Path Visualizer — IAM Threat Mapper',
  '/assessment': 'IAM Maturity Assessment — IAM Threat Mapper',
  '/about': 'About — IAM Threat Mapper',
};

function usePageTitle() {
  const location = useLocation();

  useEffect(() => {
    document.title = titles[location.pathname] || 'IAM Threat Mapper';
  }, [location.pathname]);
}

export default usePageTitle;
