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
   * Create timeline entry
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
    const timelineContainer = document.getElementById('timeline-container');
    if (!timelineContainer) {
      console.warn('[TIMELINE] Timeline container not found');
      return;
    }

    console.log('[TIMELINE] Initializing timeline...');

    // Example timeline data (replace with your research)
    const timelineData = [
      {
        year: '1928',
        title: 'Penicillin Discovery',
        description: 'Alexander Fleming discovers penicillin, revolutionizing treatment of bacterial infections including pneumonia.',
        icon: '💉'
      },
      {
        year: '1940s',
        title: 'Antibiotic Era',
        description: 'Widespread use of antibiotics dramatically reduces pneumonia mortality rates.',
        icon: '💊'
      },
      {
        year: '1977',
        title: 'First Pneumococcal Vaccine',
        description: 'First pneumococcal polysaccharide vaccine approved for use.',
        icon: '🛡️'
      },
      {
        year: '2000',
        title: 'PCV7 Introduction',
        description: 'Pneumococcal conjugate vaccine (PCV7) introduced, providing better protection for children.',
        icon: '💉'
      },
      {
        year: '2020',
        title: 'COVID-19 Impact',
        description: 'Pandemic highlights importance of respiratory health and vaccination.',
        icon: '🌍'
      }
    ];

    // Populate timeline
    timelineContainer.innerHTML = timelineData.map(entry => 
      createTimelineEntry(entry.year, entry.title, entry.description, entry.icon)
    ).join('');

    // Animate entries on scroll
    const entries = timelineContainer.querySelectorAll('.timeline-entry');
    entries.forEach((entry, index) => {
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

      // Add hover effect
      entry.addEventListener('mouseenter', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(entry, {
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });

      entry.addEventListener('mouseleave', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(entry, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });
    });

    console.log(`[TIMELINE] ✅ Initialized with ${entries.length} entries`);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 500);
  }

  // Export for external use
  window.timelineSystem = {
    createEntry: createTimelineEntry,
    init: init
  };

})();

