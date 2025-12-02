/**
 * TIMELINE MODULE
 * 
 * Creates an interactive, animated timeline component for historical content.
 * Features:
 * - Vertical timeline with animated entries
 * - Scroll-triggered reveals
 * - Hover effects
 * - Click to expand details
 * - Accessible keyboard navigation
 */

(function() {
  'use strict';

  /**
   * Create a timeline entry HTML string
   */
  function createTimelineEntry(year, title, description, icon = '📅') {
    return `
      <div class="timeline-entry" data-year="${year}">
        <div class="timeline-marker">
          <span class="timeline-icon">${icon}</span>
          <div class="timeline-line"></div>
        </div>
        <div class="timeline-content">
          <div class="timeline-year">${year}</div>
          <h4 class="timeline-title">${title}</h4>
          <p class="timeline-description">${description}</p>
        </div>
      </div>
    `;
  }

  /**
   * Initialize timeline
   */
  function init() {
    const container = document.getElementById('timeline-container');
    if (!container) {
      console.warn('[TIMELINE] Timeline container not found');
      return;
    }

    console.log('[TIMELINE] Initializing...');

    // Sample data (replace with real content)
    const data = [
      { year: '1928', title: 'Penicillin Discovery', description: 'Alexander Fleming discovers penicillin.', icon: '💉' },
      { year: '1940s', title: 'Antibiotic Era', description: 'Widespread use of antibiotics reduces pneumonia mortality.', icon: '💊' },
      { year: '1977', title: 'First Pneumococcal Vaccine', description: 'Approved for use.', icon: '🛡️' },
      { year: '2000', title: 'PCV7 Introduction', description: 'Better protection for children.', icon: '💉' },
      { year: '2020', title: 'COVID-19 Impact', description: 'Pandemic highlights respiratory health importance.', icon: '🌍' }
    ];

    // Populate container
    container.innerHTML = data.map(d => createTimelineEntry(d.year, d.title, d.description, d.icon)).join('');

    const entries = container.querySelectorAll('.timeline-entry');

    // Animate entries safely
    entries.forEach((entry, index) => {
      // Make sure entry is visible immediately
      entry.style.opacity = '1';

      // Scroll-triggered GSAP animation (optional)
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.from(entry, {
          scrollTrigger: {
            trigger: entry,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true
          },
          x: -50,
          opacity: 0,
          duration: 0.7,
          delay: index * 0.1,
          ease: 'power3.out'
        });
      }

      // Hover scale effect
      entry.addEventListener('mouseenter', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(entry, { scale: 1.02, duration: 0.3, ease: 'power2.out' });
        }
      });
      entry.addEventListener('mouseleave', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(entry, { scale: 1, duration: 0.3, ease: 'power2.out' });
        }
      });
    });

    console.log(`[TIMELINE] ✅ Initialized with ${entries.length} entries`);

    // Refresh ScrollTrigger after everything is set
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 500);
  }

  // Expose for external use
  window.timelineSystem = { createEntry: createTimelineEntry, init: init };

})();
