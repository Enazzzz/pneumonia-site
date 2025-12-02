/**
 * MICRO-INTERACTIONS MODULE
 * 
 * Adds subtle, polished micro-animations throughout the site:
 * - Button hover effects
 * - Link hover animations
 * - Card entrance animations
 * - Icon animations
 * - Text reveal effects
 * - Cursor effects (optional)
 * 
 * All animations respect prefers-reduced-motion
 */

(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    console.log('[MICRO-INTERACTIONS] Disabled (reduced motion preference)');
    return;
  }

  /**
   * Add ripple effect to buttons
   */
  function initButtonRipples() {
    const buttons = Array.from(document.querySelectorAll('.btn, button'));
    
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          left: ${x}px;
          top: ${y}px;
          pointer-events: none;
          transform: scale(0);
          animation: ripple 0.6s ease-out;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  /**
   * Add hover glow effect to links
   */
  function initLinkGlow() {
    const links = Array.from(document.querySelectorAll('a:not(.btn)'));
    
    links.forEach(link => {
      link.addEventListener('mouseenter', function() {
        this.style.transition = 'text-shadow 0.3s ease';
        this.style.textShadow = '0 0 8px rgba(123, 231, 255, 0.5)';
      });
      
      link.addEventListener('mouseleave', function() {
        this.style.textShadow = '';
      });
    });
  }

  /**
   * Add stagger animation to lists
   */
  function initListAnimations() {
    const lists = Array.from(document.querySelectorAll('ul:not(.citation-list), ol'));
    
    lists.forEach(list => {
      const items = Array.from(list.children);
      items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
          item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          item.style.opacity = '1';
          item.style.transform = 'translateX(0)';
        }, index * 100);
      });
    });
  }

  /**
   * Add floating animation to icons
   */
  function initIconAnimations() {
    const icons = Array.from(document.querySelectorAll('.icon, [class*="icon"]'));
    
    icons.forEach(icon => {
      icon.addEventListener('mouseenter', function() {
        if (typeof gsap !== 'undefined') {
          gsap.to(this, {
            y: -5,
            scale: 1.1,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });
      
      icon.addEventListener('mouseleave', function() {
        if (typeof gsap !== 'undefined') {
          gsap.to(this, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });
    });
  }

  /**
   * Add text reveal animation on scroll
   */
  function initTextReveal() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const textElements = Array.from(document.querySelectorAll('p, li'));
    
    textElements.forEach((el, index) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
          once: true
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: index * 0.05,
        ease: 'power2.out'
      });
    });
  }

  /**
   * Add magnetic effect to cards
   */
  function initMagneticCards() {
    const cards = Array.from(document.querySelectorAll('.sym-card, .diag-card, .treat-card'));
    
    cards.forEach(card => {
      card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const moveX = x * 0.1;
        const moveY = y * 0.1;
        
        if (typeof gsap !== 'undefined') {
          gsap.to(this, {
            x: moveX,
            y: moveY,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });
      
      card.addEventListener('mouseleave', function() {
        if (typeof gsap !== 'undefined') {
          gsap.to(this, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
          });
        }
      });
    });
  }

  /**
   * Add cursor trail effect (optional, subtle)
   */
  function initCursorTrail() {
    if (prefersReducedMotion) return;
    
    let trail = [];
    const trailLength = 5;
    
    document.addEventListener('mousemove', (e) => {
      trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
      
      if (trail.length > trailLength) {
        trail.shift();
      }
      
      // Remove old trail elements
      document.querySelectorAll('.cursor-trail').forEach(el => {
        if (Date.now() - parseInt(el.dataset.time) > 500) {
          el.remove();
        }
      });
      
      // Create new trail dot
      const dot = document.createElement('div');
      dot.className = 'cursor-trail';
      dot.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: rgba(123, 231, 255, 0.3);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        transform: translate(-50%, -50%);
        animation: fadeOut 0.5s ease-out forwards;
      `;
      dot.dataset.time = Date.now();
      document.body.appendChild(dot);
    });
  }
  function initAccordion() {
    const accBtns = document.querySelectorAll('.acc-btn');
    accBtns.forEach(btn => {
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.addEventListener('click', () => {
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !isExpanded);
        if (!isExpanded) {
          panel.style.display = 'block';
          panel.style.maxHeight = panel.scrollHeight + 'px';
        } else {
          panel.style.maxHeight = '0';
          setTimeout(() => panel.style.display = 'none', 300);
        }
      });
    });
  }


  /**
   * Initialize all micro-interactions
   */
  function init() {
    console.log('[MICRO-INTERACTIONS] Initializing...');
    
    initButtonRipples();
    initLinkGlow();
    initListAnimations();
    initIconAnimations();
    initMagneticCards();
    initAccordion(); // ← Add this line here
    // initCursorTrail(); // Uncomment if you want cursor trail
    initAccordionFix(); // call after DOM is ready

    console.log('[MICRO-INTERACTIONS] ✅ Initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 500); // Wait for other animations to set up first
  }

})();

