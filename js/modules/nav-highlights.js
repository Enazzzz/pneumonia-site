/**
 * NAVIGATION HIGHLIGHTS MODULE
 * 
 * Highlights active navigation item based on scroll position.
 * Features:
 * - Updates nav link as user scrolls through sections
 * - Smooth transitions
 * - Works with smooth scrolling
 * - Accessible (updates ARIA current)
 */

(function() {
  'use strict';

  const navLinks = Array.from(document.querySelectorAll('#topnav a[href^="#"]'));
  const sections = [];

  /**
   * Get all sections
   */
  function getSections() {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href !== '#') {
        const section = document.querySelector(href);
        if (section) {
          sections.push({
            id: href,
            element: section,
            link: link
          });
        }
      }
    });
  }

  /**
   * Update active nav link
   */
  function updateActiveNav() {
    const scrollPos = window.scrollY + 150; // Offset for better UX

    let currentSection = null;
    
    sections.forEach(section => {
      const rect = section.element.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const bottom = top + rect.height;

      if (scrollPos >= top && scrollPos < bottom) {
        currentSection = section;
      }
    });

    // Update nav links
    navLinks.forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    });

    if (currentSection) {
      currentSection.link.classList.add('active');
      currentSection.link.setAttribute('aria-current', 'page');
    }
  }

  /**
   * Initialize navigation highlights
   */
  function init() {
    if (navLinks.length === 0) {
      console.warn('[NAV-HIGHLIGHTS] No navigation links found');
      return;
    }

    getSections();

    if (sections.length === 0) {
      console.warn('[NAV-HIGHLIGHTS] No sections found');
      return;
    }

    // Throttled scroll handler
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveNav();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateActiveNav(); // Initial update

    console.log(`[NAV-HIGHLIGHTS] ✅ Tracking ${sections.length} sections`);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 500);
  }

})();

