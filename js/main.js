/**
 * MAIN INITIALIZATION SCRIPT
 * 
 * Orchestrates all interactive features:
 * - Scroll progress bar
 * - GSAP animations and ScrollTrigger
 * - Lungs SVG breathing animation
 * - Scroll-triggered section reveals
 * - Transmission bar animations
 * - Risk bar animations
 * - Card tilt effects
 * - Accordion functionality
 * - Smooth anchor scrolling
 * - Mobile menu toggle
 * - Accessibility: respects prefers-reduced-motion
 * 
 * Modular features are loaded separately:
 * - js/modules/particles.js (particle background)
 * - js/modules/parallax.js (mouse parallax)
 * - js/modules/breathing.js (breathing demo)
 * - js/modules/quiz.js (interactive quiz)
 */

(function() {
  'use strict';

  // Helper functions
  const qs = (selector) => document.querySelector(selector);
  const qsa = (selector) => Array.from(document.querySelectorAll(selector));

  /**
   * Check if user prefers reduced motion
   */
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * SCROLL PROGRESS BAR
   * Updates the top progress bar based on scroll position
   */
  function initProgressBar() {
    const progress = qs('#progress');
    if (!progress) return;

    function updateProgress() {
      const h = document.documentElement;
      const scrollTop = h.scrollTop || document.body.scrollTop;
      const scrollHeight = h.scrollHeight - h.clientHeight;
      const percentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      progress.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress(); // Initial update
  }

  /**
   * GSAP ANIMATIONS & SCROLL TRIGGERS
   * Sets up all GSAP-based animations with ScrollTrigger
   */
  function initGSAPAnimations() {
    // Register ScrollTrigger plugin
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    } else {
      console.warn('GSAP or ScrollTrigger not loaded. Some animations may not work.');
      return;
    }

    const reducedMotion = prefersReducedMotion();

    // Hero intro animations (only if motion is not reduced)
    if (!reducedMotion) {
      gsap.from('#hero .hero-text h1', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });

      gsap.from('#hero .sub', {
        y: 18,
        opacity: 0,
        duration: 0.9,
        delay: 0.15,
        ease: 'power3.out'
      });

      gsap.from('#hero .lead', {
        y: 18,
        opacity: 0,
        duration: 0.9,
        delay: 0.25,
        ease: 'power3.out'
      });

      gsap.from('#hero .hero-art', {
        scale: 0.92,
        opacity: 0,
        duration: 1,
        delay: 0.15,
        ease: 'elastic.out(1, 0.5)'
      });
    }

    // Animate floating bubbles in lungs SVG
    qsa('#bubbles .b').forEach((bubble, i) => {
      if (reducedMotion) {
        // Static position for reduced motion
        bubble.style.opacity = '0.75';
      } else {
        gsap.to(bubble, {
          y: -30 - Math.random() * 40,
          x: (Math.random() - 0.5) * 40,
          duration: 4 + Math.random() * 4,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          delay: i * 0.2
        });
      }
    });

    // Lungs subtle breathing animation (continuous loop)
    const leftLung = qs('.lung.left');
    const rightLung = qs('.lung.right');
    if (leftLung && rightLung && !reducedMotion) {
      gsap.to([leftLung, rightLung], {
        scaleY: 0.92,
        yoyo: true,
        repeat: -1,
        duration: 3.6,
        ease: 'sine.inOut',
        transformOrigin: 'center center',
        delay: 1.0
      });
    }

    // Scroll-triggered section reveals
    qsa('.panel .container > h2, .panel .container > h3').forEach((heading) => {
      if (reducedMotion) {
        heading.style.opacity = '1';
      } else {
        gsap.from(heading, {
          scrollTrigger: {
            trigger: heading,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out'
        });
      }
    });

    // Staggered card reveals
    qsa('.sym-card, .diag-card, .treat-card, .risk-item').forEach((card, i) => {
      if (reducedMotion) {
        card.style.opacity = '1';
      } else {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          y: 20,
          opacity: 0,
          duration: 0.7,
          delay: i * 0.05,
          ease: 'power3.out'
        });
      }
    });

    // Animate transmission bars on scroll
    qsa('.t-bar').forEach((bar) => {
      const target = parseInt(bar.getAttribute('data-target') || 50);
      
      ScrollTrigger.create({
        trigger: bar,
        start: 'top 90%',
        onEnter: () => {
          // Animate the ::before pseudo-element width
          bar.style.setProperty('--target-width', `${target}%`);
          bar.classList.add('animated');
          
          // Fallback: animate actual element if CSS doesn't work
          const beforeElement = window.getComputedStyle(bar, '::before');
          if (!beforeElement) {
            bar.animate([
              { width: '0%' },
              { width: `${target}%` }
            ], {
              duration: 1200,
              fill: 'forwards',
              easing: 'ease-out'
            });
          }
        }
      });
    });

    // Animate risk bars on scroll
    qsa('.risk-bar').forEach((bar) => {
      const percent = bar.getAttribute('data-percent') || 50;
      
      ScrollTrigger.create({
        trigger: bar,
        start: 'top 90%',
        onEnter: () => {
          bar.style.width = `${percent}%`;
        }
      });
    });
  }

  /**
   * CARD TILT EFFECT
   * Adds 3D tilt effect to cards on mouse/pointer movement
   */
  function initCardTilt() {
    if (prefersReducedMotion()) return;

    qsa('.tilt').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        const rotateX = -y * 8;
        const rotateY = x * 10;
        
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  /**
   * ACCORDION FUNCTIONALITY
   * Handles expand/collapse of accordion panels
   */
  function initAccordion() {
    qsa('.acc-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const panel = btn.nextElementSibling;
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';

        // Close all panels (optional: can allow multiple open)
        qsa('.acc-btn').forEach((b) => {
          b.setAttribute('aria-expanded', 'false');
        });
        qsa('.acc-panel').forEach((p) => {
          p.style.maxHeight = '0';
          p.setAttribute('aria-expanded', 'false');
        });

        // Toggle current panel
        if (!isExpanded) {
          btn.setAttribute('aria-expanded', 'true');
          panel.style.maxHeight = panel.scrollHeight + 'px';
          panel.setAttribute('aria-expanded', 'true');
        }
      });

      // Keyboard support
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }

  /**
   * SMOOTH ANCHOR SCROLLING
   * Handles smooth scrolling to anchor links with nav offset
   */
  function initSmoothScrolling() {
    qsa('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#' || href === '#!') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navOffset = 72; // Account for fixed nav
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - navOffset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Update URL without triggering scroll
          history.pushState(null, null, href);
        }
      });
    });
  }

  /**
   * MOBILE MENU TOGGLE
   * Handles mobile navigation menu show/hide
   */
  function initMobileMenu() {
    const toggle = qs('#mobile-menu-toggle');
    const nav = qs('#topnav ul');
    
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isExpanded);
      nav.setAttribute('aria-expanded', !isExpanded);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /**
   * INTERACTIVE LUNGS CLICK
   * Adds a pulse effect when clicking on the lungs SVG
   */
  function initLungsInteraction() {
    const lungs = qs('#lungs');
    const leftLung = qs('.lung.left');
    const rightLung = qs('.lung.right');

    if (!lungs || !leftLung || !rightLung) return;

    lungs.addEventListener('click', () => {
      if (prefersReducedMotion()) return;

      gsap.fromTo([leftLung, rightLung], 
        { scale: 1.0 },
        {
          scale: 1.12,
          duration: 0.5,
          yoyo: true,
          repeat: 1,
          ease: 'power1.inOut'
        }
      );
    });

    // Add cursor pointer to indicate interactivity
    lungs.style.cursor = 'pointer';
  }

  /**
   * MAIN INITIALIZATION
   * Initializes all features when DOM is ready
   */
  function init() {
    initProgressBar();
    initGSAPAnimations();
    initCardTilt();
    initAccordion();
    initSmoothScrolling();
    initMobileMenu();
    initLungsInteraction();

    // Load modular scripts (they handle their own initialization)
    // These are loaded via script tags in HTML or can be dynamically loaded here
    console.log('Main initialization complete. Modular features should load separately.');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Handle reduced motion preference changes
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
    // Reload page to reinitialize with new preference (or handle dynamically)
    console.log('Motion preference changed. Some features may need page reload.');
  });

})();
