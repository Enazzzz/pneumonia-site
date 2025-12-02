/**
 * SMOOTH SCROLL MODULE
 * 
 * Implements buttery-smooth scrolling with momentum-like easing.
 * Uses GSAP ScrollToPlugin if available, with fallback to native smooth scroll.
 * 
 * Features:
 * - Smooth momentum scrolling for anchor links
 * - Custom easing curves
 * - Respects prefers-reduced-motion
 * - Accounts for fixed navigation offset
 */

(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Smooth scroll to element
   */
  function smoothScrollTo(target, options = {}) {
    const {
      offset = 72, // Navigation offset
      duration = 1.2,
      ease = 'power2.inOut'
    } = options;

    if (prefersReducedMotion) {
      // Use instant scroll for reduced motion
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: targetPosition, behavior: 'auto' });
      return;
    }

    const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

    // Use GSAP ScrollToPlugin if available
    if (typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
      gsap.to(window, {
        scrollTo: {
          y: targetPosition,
          autoKill: false
        },
        duration: duration,
        ease: ease
      });
    } else {
      // Fallback to native smooth scroll
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Initialize smooth scrolling for all anchor links
   */
  function init() {
    const anchorLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
    
    if (anchorLinks.length === 0) {
      console.warn('[SMOOTH-SCROLL] No anchor links found');
      return;
    }

    console.log(`[SMOOTH-SCROLL] Initializing for ${anchorLinks.length} links`);

    anchorLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#' || href === '#!') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          smoothScrollTo(target, { offset: 72 });
          
          // Update URL without triggering scroll
          history.pushState(null, null, href);
        }
      });
    });

    console.log('[SMOOTH-SCROLL] ✅ Initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }

  // Export for external use
  window.smoothScroll = {
    to: smoothScrollTo,
    init: init
  };

})();

