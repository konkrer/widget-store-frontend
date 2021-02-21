import { useEffect } from 'react';
/**
 * Scroll to top of page with page load.
 * Needed for mobile behavior.
 */
const PageScrollTopHook = () => {
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0 });
    }, 400);
  }, []);
};

export default PageScrollTopHook;
