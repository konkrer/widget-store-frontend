import { useEffect } from 'react';
/**
 * Scroll to top of page with page load.
 * Needed for mobile behavior.
 */
const PageScrollTopHook = () => {
  useEffect(() => {
    let timerID = setTimeout(() => {
      window.scrollTo({ top: 0 });
    }, 300);

    return () => clearTimeout(timerID);
  }, []);
};

export default PageScrollTopHook;
