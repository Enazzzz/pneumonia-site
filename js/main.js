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
 * - js/modules/theme-toggle.js (dark/light mode toggle)
 * - js/modules/charts.js (interactive charts)
 * - js/modules/timeline.js (animated timeline)
 * - js/modules/custom-cursor.js (custom cursor effects)
 * - js/modules/nav-highlights.js (scroll-based nav highlighting)
 */

(function() {
  'use strict';

  // Helper functions
  const qs = (selector) => document.querySelector(selector);
  const qsa = (selector) => Array.from(document.querySelectorAll(selector));

  // Debug mode - set to false in production
  const DEBUG = true;
  function log(...args) {
    if (DEBUG) console.log('[MAIN]', ...args);
  }
  function warn(...args) {
    if (DEBUG) console.warn('[MAIN]', ...args);
  }
  function error(...args) {
    console.error('[MAIN]', ...args);
  }

  /**
   * Check if user prefers reduced motion
   */
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Wait for element to exist in DOM
   */
  function waitForElement(selector, maxWait = 2000) {
    return new Promise((resolve, reject) => {
      const element = qs(selector);
      if (element) {
        resolve(element);
        return;
      }

      const startTime = Date.now();
      const observer = new MutationObserver(() => {
        const element = qs(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        } else if (Date.now() - startTime > maxWait) {
          observer.disconnect();
          reject(new Error(`Element ${selector} not found after ${maxWait}ms`));
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Check again after a short delay
      setTimeout(() => {
        const element = qs(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      }, 100);
    });
  }

  /**
   * SCROLL PROGRESS BAR
   * Updates the top progress bar in real-time as user scrolls
   */
  function initProgressBar() {
    const progress = qs('#progress');
    if (!progress) {
      warn('Progress bar element not found');
      return;
    }

    log('Initializing progress bar');

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
    log('✅ Progress bar initialized');
  }

  /**
   * GSAP ANIMATIONS & SCROLL TRIGGERS
   * Sets up all GSAP-based animations with ScrollTrigger for smooth reveals
   */
  function initGSAPAnimations() {
    // Wait for GSAP to load (with retry logic)
    let retries = 0;
    const maxRetries = 20;
    
    function checkGSAP() {
      if (typeof gsap === 'undefined') {
        retries++;
        if (retries < maxRetries) {
          warn(`GSAP not loaded. Retrying... (${retries}/${maxRetries})`);
          setTimeout(checkGSAP, 100);
          return;
        } else {
          error('GSAP failed to load after multiple retries. Check network tab.');
          return;
        }
      }

      log('GSAP core loaded, registering plugins...');

      // Register GSAP plugins (all free)
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        log('✅ ScrollTrigger registered');
      } else {
        warn('ScrollTrigger not loaded. Some scroll animations may not work.');
      }
      
      if (typeof ScrollToPlugin !== 'undefined') {
        gsap.registerPlugin(ScrollToPlugin);
        log('✅ ScrollToPlugin registered');
      }
      
      // Continue with animations
      setupAnimations();
    }
    
    function setupAnimations() {
      if (typeof ScrollTrigger === 'undefined') {
        warn('ScrollTrigger not available. Skipping scroll animations.');
        return;
      }

      const reducedMotion = prefersReducedMotion();
      if (reducedMotion) {
        log('⚠️ Reduced motion preference detected - animations will be minimal');
      }

      // ============================================
      // HERO INTRO ANIMATIONS
      // ============================================
      if (!reducedMotion) {
        const heroTitle = qs('#hero .hero-text h1');
        const heroSub = qs('#hero .sub');
        const heroLead = qs('#hero .lead');
        const heroCta = qs('#hero .hero-cta');
        const heroArt = qs('#hero .hero-art');

        if (heroTitle && heroSub && heroLead && heroCta && heroArt) {
          log('Setting up hero intro animations');
          
          // Create master timeline for hero
          const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
          
          heroTimeline
            .from(heroTitle, {
              y: 30,
              opacity: 0,
              duration: 0.8
            })
            .from(heroSub, {
              y: 18,
              opacity: 0,
              duration: 0.9
            }, '-=0.7')
            .from(heroLead, {
              y: 18,
              opacity: 0,
              duration: 0.9
            }, '-=0.8')
            .from(heroCta, {
              y: 20,
              opacity: 0,
              duration: 0.8
            }, '-=0.7')
            .from(heroArt, {
              scale: 0.92,
              opacity: 0,
              duration: 1,
              ease: 'elastic.out(1, 0.5)'
            }, '-=0.9');
          
          log('✅ Hero intro animations set up');
        } else {
          warn('Hero elements not found for animations');
        }
      }

      // ============================================
      // LUNGS SVG BUBBLES ANIMATION
      // ============================================
      const bubbles = qsa('#bubbles .b, #bubbles circle');
      if (bubbles.length > 0) {
        log(`Setting up ${bubbles.length} bubble animations`);
        bubbles.forEach((bubble, i) => {
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
        log('✅ Bubble animations set up');
      } else {
        warn('No bubbles found for animation');
      }

      // ============================================
      // LUNGS BREATHING ANIMATION (Continuous Loop)
      // ============================================
      const leftLung = qs('.lung.left');
      const rightLung = qs('.lung.right');
      if (leftLung && rightLung && !reducedMotion) {
        log('Setting up lungs breathing animation');
        gsap.to([leftLung, rightLung], {
          scaleY: 0.92,
          yoyo: true,
          repeat: -1,
          duration: 3.6,
          ease: 'sine.inOut',
          transformOrigin: 'center center',
          delay: 1.0
        });
        log('✅ Lungs breathing animation set up');
      } else if (!leftLung || !rightLung) {
        warn('Lung elements not found');
      }

      // ============================================
      // SCROLL-TRIGGERED SECTION REVEALS
      // ============================================
      const headings = qsa('.panel .container > h2, .panel .container > h3');
      if (headings.length > 0) {
        log(`Setting up ${headings.length} heading animations`);
        headings.forEach((heading) => {
          if (reducedMotion) {
            heading.style.opacity = '1';
          } else {
            gsap.from(heading, {
              scrollTrigger: {
                trigger: heading,
                start: 'top 85%',
                toggleActions: 'play none none none',
                once: true
              },
              y: 24,
              opacity: 0,
              duration: 0.7,
              ease: 'power3.out'
            });
          }
        });
        log('✅ Heading animations set up');
      }

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
        if (cards.length > 0) {
          log(`Setting up ${cards.length} ${selector} animations`);
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
          log(`✅ ${selector} animations set up`);
        }
      });

      // ============================================
      // TRANSMISSION BARS ANIMATION
      // ============================================
      const tBars = qsa('.t-bar');
      if (tBars.length > 0) {
        log(`Setting up ${tBars.length} transmission bar animations`);
        tBars.forEach((bar) => {
          const target = parseInt(bar.getAttribute('data-target') || 50);
          
          ScrollTrigger.create({
            trigger: bar,
            start: 'top 90%',
            once: true,
            onEnter: () => {
              // Set CSS variable for width animation
              bar.style.setProperty('--target-width', `${target}%`);
              bar.classList.add('animated');
              log(`Transmission bar animated to ${target}%`);
            }
          });
        });
        log('✅ Transmission bar animations set up');
      }

      // ============================================
      // RISK BARS ANIMATION
      // ============================================
      const riskBars = qsa('.risk-bar');
      if (riskBars.length > 0) {
        log(`Setting up ${riskBars.length} risk bar animations`);
        riskBars.forEach((bar) => {
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
              log(`Risk bar animated to ${percent}%`);
            }
          });
        });
        log('✅ Risk bar animations set up');
      }

      // Refresh ScrollTrigger after all animations are set up
      ScrollTrigger.refresh();
      log('✅ GSAP animations initialized and ScrollTrigger refreshed');
    }
    
    // Start checking for GSAP
    checkGSAP();
  }

  /**
   * CARD TILT EFFECT
   * Adds 3D tilt effect to cards on mouse/pointer movement
   */
  function initCardTilt() {
    if (prefersReducedMotion()) {
      log('Skipping card tilt (reduced motion)');
      return;
    }

    const tiltCards = qsa('.tilt');
    if (tiltCards.length === 0) {
      warn('No tilt cards found');
      return;
    }

    log(`Setting up ${tiltCards.length} card tilt effects`);

    tiltCards.forEach((card) => {
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

    log('✅ Card tilt effects initialized');
  }

  /**
   * ACCORDION FUNCTIONALITY
   * Handles expand/collapse of accordion panels with smooth animations
   */
  function initAccordion() {
    const accButtons = qsa('.acc-btn');
    if (accButtons.length === 0) {
      warn('No accordion buttons found');
      return;
    }

    log(`Setting up ${accButtons.length} accordion panels`);

    accButtons.forEach((btn) => {
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

    log('✅ Accordion initialized');
  }

  /**
   * SMOOTH ANCHOR SCROLLING
   * Now handled by js/modules/smooth-scroll.js
   * This function is kept for backwards compatibility but delegates to the module
   */
  function initSmoothScrolling() {
    // Smooth scrolling is now handled by the dedicated module
    // Just verify it's loaded
    if (typeof window.smoothScroll !== 'undefined') {
      log('✅ Smooth scrolling module loaded');
    } else {
      warn('Smooth scrolling module not found - using fallback');
      // Fallback implementation
      const anchorLinks = qsa('a[href^="#"]');
      anchorLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (href === '#' || href === '#!') return;
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - 72;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            history.pushState(null, null, href);
          }
        });
      });
    }
  }

  /**
   * MOBILE MENU TOGGLE
   * Handles mobile navigation menu show/hide with animations
   */
  function initMobileMenu() {
    const toggle = qs('#mobile-menu-toggle');
    const nav = qs('#topnav ul');
    
    if (!toggle || !nav) {
      warn('Mobile menu elements not found');
      return;
    }

    log('Setting up mobile menu');

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

    log('✅ Mobile menu initialized');
  }

  /**
   * INTERACTIVE LUNGS CLICK
   * Adds a pulse effect when clicking on the lungs SVG
   */
  function initLungsInteraction() {
    const lungs = qs('#lungs');
    const leftLung = qs('.lung.left');
    const rightLung = qs('.lung.right');

    if (!lungs || !leftLung || !rightLung) {
      warn('Lungs SVG elements not found');
      return;
    }

    log('Setting up interactive lungs');

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
    log('✅ Interactive lungs initialized');
  }

  /**
   * MAIN INITIALIZATION
   * Initializes all features when DOM is ready
   */
  function init() {
    log('🚀 Initializing pneumonia site...');
    
    // Initialize core features
    initProgressBar();
    
    // Initialize GSAP animations (with built-in retry logic)
    initGSAPAnimations();
    
    // Initialize interactive features
    initCardTilt();
    initAccordion();
    initSmoothScrolling();
    initMobileMenu();
    initLungsInteraction();

    // Verify all modules are loaded
    setTimeout(() => {
      const modules = {
        particles: typeof window.initParticles === 'function' || typeof window.particleSystem !== 'undefined',
        parallax: typeof window.initParallax === 'function' || typeof window.parallaxSystem !== 'undefined',
        breathing: typeof window.initBreathing === 'function' || typeof window.breathingDemo !== 'undefined',
        quiz: typeof window.initQuiz === 'function' || typeof window.quizSystem !== 'undefined',
        theme: typeof window.themeSystem !== 'undefined',
        charts: typeof window.chartSystem !== 'undefined',
        timeline: typeof window.timelineSystem !== 'undefined',
        cursor: document.querySelector('.custom-cursor') !== null,
        navHighlights: true // nav-highlights doesn't expose a global
      };
      
      const allLoaded = Object.values(modules).every(loaded => loaded === true);
      
      if (allLoaded) {
        log('✅ All modules loaded successfully:', modules);
      } else {
        warn('⚠️ Some modules not loaded:', modules);
      }
      
      // Refresh ScrollTrigger after everything is set up
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
        log('✅ ScrollTrigger refreshed');
      }
      
      log('🎉 Site initialization complete!');
    }, 1000);
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
    log('Motion preference changed. Reloading animations...');
    // Refresh ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });

})();
