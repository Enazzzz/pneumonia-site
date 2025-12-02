/**
 * MAIN INITIALIZATION SCRIPT
 * 
 * Orchestrates all interactive features and ensures everything initializes on page load.
 * 
 * Features:
 * - Scroll progress bar (real-time updates)
 * - GSAP animations and ScrollTrigger (smooth fade-ins, slides, staggered entrances)
 * - Lungs SVG breathing animation (continuous loop)
 * - Scroll-triggered section reveals
 * - Transmission bar animations (width fill on scroll)
 * - Risk bar animations (width fill on scroll)
 * - Card tilt effects (3D mouse interaction)
 * - Accordion functionality (expand/collapse)
 * - Smooth anchor scrolling (momentum-like easing)
 * - Mobile menu toggle
 * - Accessibility: respects prefers-reduced-motion
 * 
 * Modular features (loaded separately):
 * - js/modules/particles.js (interactive particle background)
 * - js/modules/parallax.js (mouse parallax effects)
 * - js/modules/breathing.js (4-7-8 breathing exercise demo)
 * - js/modules/quiz.js (interactive quiz with feedback)
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
   * Updates the top progress bar in real-time as user scrolls
   */
  function initProgressBar() {
    const progress = qs('#progress');
    if (!progress) return;

    function updateProgress() {
      const h = document.documentElement;
      const scrollTop = h.scrollTop || document.body.scrollTop;
      const scrollHeight = h.scrollHeight - h.clientHeight;
      const percentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      
      // Smooth transition for progress bar
      progress.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
    }

    // Use requestAnimationFrame for smooth updates
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateProgress(); // Initial update
  }

  /**
   * GSAP ANIMATIONS & SCROLL TRIGGERS
   * Sets up all GSAP-based animations with ScrollTrigger for smooth reveals
   */
  function initGSAPAnimations() {
    // Wait for GSAP to load
    if (typeof gsap === 'undefined') {
      console.warn('GSAP not loaded. Retrying in 100ms...');
      setTimeout(initGSAPAnimations, 100);
      return;
    }

    // Register GSAP plugins (all free)
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    if (typeof ScrollToPlugin !== 'undefined') {
      gsap.registerPlugin(ScrollToPlugin);
    }
    
    if (typeof ScrollTrigger === 'undefined') {
      console.warn('ScrollTrigger not loaded. Some scroll animations may not work.');
      return;
    }

    const reducedMotion = prefersReducedMotion();

    // ============================================
    // HERO INTRO ANIMATIONS
    // ============================================
    if (!reducedMotion) {
      // Create master timeline for hero
      const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      heroTimeline
        .from('#hero .hero-text h1', {
          y: 30,
          opacity: 0,
          duration: 0.8
        })
        .from('#hero .sub', {
          y: 18,
          opacity: 0,
          duration: 0.9
        }, '-=0.7')
        .from('#hero .lead', {
          y: 18,
          opacity: 0,
          duration: 0.9
        }, '-=0.8')
        .from('#hero .hero-cta', {
          y: 20,
          opacity: 0,
          duration: 0.8
        }, '-=0.7')
        .from('#hero .hero-art', {
          scale: 0.92,
          opacity: 0,
          duration: 1,
          ease: 'elastic.out(1, 0.5)'
        }, '-=0.9');
    }

    // ============================================
    // LUNGS SVG BUBBLES ANIMATION
    // ============================================
    qsa('#bubbles .b, #bubbles circle').forEach((bubble, i) => {
      if (reducedMotion) {
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

    // ============================================
    // LUNGS BREATHING ANIMATION (Continuous Loop)
    // ============================================
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

    // ============================================
    // SCROLL-TRIGGERED SECTION REVEALS
    // ============================================
    qsa('.panel .container > h2, .panel .container > h3').forEach((heading) => {
      if (reducedMotion) {
        heading.style.opacity = '1';
      } else {
        gsap.from(heading, {
          scrollTrigger: {
            trigger: heading,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true // Only animate once
          },
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out'
        });
      }
    });

    // ============================================
    // STAGGERED CARD REVEALS
    // ============================================
    const cardGroups = [
      { selector: '.sym-card', stagger: 0.1 },
      { selector: '.diag-card', stagger: 0.08 },
      { selector: '.treat-card', stagger: 0.08 },
      { selector: '.risk-item', stagger: 0.1 }
    ];

    cardGroups.forEach(({ selector, stagger }) => {
      const cards = qsa(selector);
      if (cards.length === 0) return;

      if (reducedMotion) {
        cards.forEach(card => card.style.opacity = '1');
      } else {
        gsap.from(cards, {
          scrollTrigger: {
            trigger: cards[0]?.closest('.panel') || cards[0],
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true
          },
          y: 20,
          opacity: 0,
          duration: 0.7,
          stagger: stagger,
          ease: 'power3.out'
        });
      }
    });

    // ============================================
    // TRANSMISSION BARS ANIMATION
    // ============================================
    qsa('.t-bar').forEach((bar) => {
      const target = parseInt(bar.getAttribute('data-target') || 50);
      
      ScrollTrigger.create({
        trigger: bar,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          // Set CSS variable for width animation
          bar.style.setProperty('--target-width', `${target}%`);
          bar.classList.add('animated');
        }
      });
    });

    // ============================================
    // RISK BARS ANIMATION
    // ============================================
    qsa('.risk-bar').forEach((bar) => {
      const percent = parseInt(bar.getAttribute('data-percent') || 50);
      
      ScrollTrigger.create({
        trigger: bar,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          // Animate width with GSAP for smoothness
          gsap.to(bar, {
            width: `${percent}%`,
            duration: 1.2,
            ease: 'power2.out'
          });
        }
      });
    });

    // Refresh ScrollTrigger after all animations are set up
    ScrollTrigger.refresh();
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
        
        // Smooth transform with will-change
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`;
        card.style.transition = 'transform 0.1s ease-out';
      });

      card.addEventListener('pointerleave', () => {
        card.style.transition = 'transform 0.3s ease-out';
        card.style.transform = '';
      });
    });
  }

  /**
   * ACCORDION FUNCTIONALITY
   * Handles expand/collapse of accordion panels with smooth animations
   */
  function initAccordion() {
    qsa('.acc-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const panel = btn.nextElementSibling;
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';

        // Close all panels (accordion behavior)
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
          panel.setAttribute('aria-expanded', 'true');
          // Smooth height animation
          panel.style.maxHeight = panel.scrollHeight + 'px';
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
   * Implements smooth, momentum-like scrolling with easing
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
          
          // Use GSAP ScrollToPlugin for smooth momentum scrolling
          if (typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
            gsap.to(window, {
              scrollTo: {
                y: targetPosition,
                autoKill: false
              },
              duration: 1.2,
              ease: 'power2.inOut'
            });
          } else {
            // Fallback to native smooth scroll
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }

          // Update URL without triggering scroll
          history.pushState(null, null, href);
        }
      });
    });
  }

  /**
   * MOBILE MENU TOGGLE
   * Handles mobile navigation menu show/hide with animations
   */
  function initMobileMenu() {
    const toggle = qs('#mobile-menu-toggle');
    const nav = qs('#topnav ul');
    
    if (!toggle || !nav) return;

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      const newState = !isExpanded;
      
      toggle.setAttribute('aria-expanded', newState);
      nav.setAttribute('aria-expanded', newState);
      
      // Animate menu appearance
      if (newState) {
        nav.style.display = 'flex';
        if (typeof gsap !== 'undefined') {
          gsap.from(nav, {
            opacity: 0,
            y: -10,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      } else {
        if (typeof gsap !== 'undefined') {
          gsap.to(nav, {
            opacity: 0,
            y: -10,
            duration: 0.2,
            ease: 'power2.in',
            onComplete: () => {
              nav.style.display = 'none';
            }
          });
        } else {
          nav.style.display = 'none';
        }
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        if (nav.getAttribute('aria-expanded') === 'true') {
          toggle.setAttribute('aria-expanded', 'false');
          nav.setAttribute('aria-expanded', 'false');
          nav.style.display = 'none';
        }
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

      if (typeof gsap !== 'undefined') {
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
      }
    });

    // Add cursor pointer to indicate interactivity
    lungs.style.cursor = 'pointer';
  }

  /**
   * ENHANCE SECTION VISUAL SEPARATION
   * Adds subtle animations and visual effects to sections
   */
  function initSectionEnhancements() {
    if (prefersReducedMotion()) return;

    // Add hover effects to panels
    qsa('.panel').forEach((panel, index) => {
      // Alternate background gradients for visual separation
      if (index % 2 === 0) {
        panel.style.background = 'radial-gradient(1200px 600px at 10% 10%, rgba(123,97,255,0.08), transparent 8%), radial-gradient(1000px 500px at 90% 90%, rgba(123,231,255,0.04), transparent 8%), var(--bg-900)';
      }
    });
  }

  /**
   * MAIN INITIALIZATION
   * Initializes all features when DOM is ready
   */
  function init() {
    // Initialize core features
    initProgressBar();
    
    // Wait a bit for GSAP to fully load, then initialize animations
    if (typeof gsap !== 'undefined') {
      initGSAPAnimations();
    } else {
      // Retry after a short delay
      setTimeout(() => {
        if (typeof gsap !== 'undefined') {
          initGSAPAnimations();
        }
      }, 100);
    }
    
    initCardTilt();
    initAccordion();
    initSmoothScrolling();
    initMobileMenu();
    initLungsInteraction();
    initSectionEnhancements();

    // Verify all modules are loaded
    setTimeout(() => {
      const modules = {
        particles: typeof window.particleSystem !== 'undefined',
        parallax: typeof window.parallaxSystem !== 'undefined',
        breathing: typeof window.breathingDemo !== 'undefined',
        quiz: typeof window.quizSystem !== 'undefined'
      };
      
      console.log('✅ Initialization complete. Modules loaded:', modules);
      
      // Refresh ScrollTrigger after everything is set up
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 500);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already ready, initialize immediately
    init();
  }

  // Handle reduced motion preference changes
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
    console.log('Motion preference changed. Reloading animations...');
    // Refresh ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });

})();
