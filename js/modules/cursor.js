/**
 * CURSOR MODULE
 * 
 * Subtle, still cursor by default that clearly communicates interactivity.
 * Features:
 * - Subtle, visually still default state
 * - Brightens and shows clear affordance on interactive elements
 * - Preserves native pointer behavior
 * - Desktop-only (graceful degradation on touch)
 * - Respects prefers-reduced-motion and demo override
 */

(function() {
  'use strict';

  // Check for demo override (URL param ?demo=1 or localStorage flag)
  const urlParams = new URLSearchParams(window.location.search);
  const demoOverride = urlParams.get('demo') === '1' || localStorage.getItem('demo-full-motion') === 'true';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches && !demoOverride;
  
  if (prefersReducedMotion) {
    console.log('[CURSOR] Disabled (reduced motion preference)');
    return;
  }

  // Only enable on desktop (not touch devices)
  if (window.matchMedia('(pointer: coarse)').matches) {
    console.log('[CURSOR] Disabled (touch device)');
    return;
  }

  let cursor = null;
  let mouseX = 0;
  let mouseY = 0;
  let isHovering = false;
  let currentElement = null;

  /**
   * Create subtle cursor element
   */
  function createCursor() {
    cursor = document.createElement('div');
    cursor.className = 'subtle-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursor);
  }

  /**
   * Update cursor position (subtle, minimal movement)
   */
  function updateCursor() {
    if (!cursor) return;

    // Very subtle movement - almost still
    const targetX = mouseX;
    const targetY = mouseY;
    
    // Only update if hovering interactive element
    if (isHovering) {
      cursor.style.left = targetX + 'px';
      cursor.style.top = targetY + 'px';
      cursor.style.opacity = '1';
    } else {
      // Fade out when not hovering
      cursor.style.opacity = '0.3';
    }

    requestAnimationFrame(updateCursor);
  }

  /**
   * Handle mouse movement
   */
  function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  /**
   * Handle hover on interactive elements
   */
  function handleMouseEnter(e) {
    isHovering = true;
    currentElement = e.target;
    
    // Brighten the element
    if (currentElement) {
      currentElement.style.transition = 'filter 0.2s ease, transform 0.2s ease';
      currentElement.style.filter = 'brightness(1.15)';
    }
    
    // Show cursor affordance
    if (cursor) {
      cursor.classList.add('interactive');
      cursor.style.opacity = '1';
    }
  }

  function handleMouseLeave(e) {
    isHovering = false;
    
    // Restore element brightness smoothly
    if (currentElement) {
      currentElement.style.filter = 'brightness(1)';
      currentElement = null;
    }
    
    // Hide cursor affordance
    if (cursor) {
      cursor.classList.remove('interactive');
      cursor.style.opacity = '0.3';
    }
  }

  /**
   * Handle click feedback
   */
  function handleClick(e) {
    if (isHovering && cursor) {
      cursor.classList.add('clicked');
      setTimeout(() => {
        if (cursor) cursor.classList.remove('clicked');
      }, 200);
    }
  }

  /**
   * Initialize cursor
   */
  function init() {
    createCursor();
    updateCursor();

    // Mouse tracking
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('click', handleClick, { passive: true });

    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, .btn, .tilt, .sym-card, .diag-card, .treat-card, .quiz-btn, .acc-btn, #lungs, .risk-item, .t-bar'
    );
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      if (cursor) cursor.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      if (cursor) cursor.style.opacity = isHovering ? '1' : '0.3';
    });

    console.log('[CURSOR] ✅ Subtle cursor initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }

})();

