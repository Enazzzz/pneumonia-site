/**
 * CUSTOM CURSOR MODULE
 * 
 * Creates a modern, interactive custom cursor effect.
 * Features:
 * - Smooth cursor trail
 * - Hover effects on interactive elements
 * - Magnetic attraction to buttons/links
 * - Respects prefers-reduced-motion
 * - Performance optimized
 */

(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    console.log('[CURSOR] Disabled (reduced motion preference)');
    return;
  }

  let cursor = null;
  let cursorFollower = null;
  let mouseX = 0;
  let mouseY = 0;
  let followerX = 0;
  let followerY = 0;
  let isHovering = false;

  /**
   * Create cursor elements
   */
  function createCursor() {
    cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    
    cursorFollower = document.createElement('div');
    cursorFollower.className = 'custom-cursor-follower';
    cursorFollower.setAttribute('aria-hidden', 'true');
    
    document.body.appendChild(cursor);
    document.body.appendChild(cursorFollower);
    
    // Hide default cursor
    document.body.style.cursor = 'none';
  }

  /**
   * Update cursor position
   */
  function updateCursor() {
    if (!cursor || !cursorFollower) return;

    // Smooth follower with easing
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;

    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;

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
    if (cursor) cursor.classList.add('hover');
    if (cursorFollower) cursorFollower.classList.add('hover');
  }

  function handleMouseLeave(e) {
    isHovering = false;
    if (cursor) cursor.classList.remove('hover');
    if (cursorFollower) cursorFollower.classList.remove('hover');
  }

  /**
   * Initialize custom cursor
   */
  function init() {
    // Only enable on desktop (not touch devices)
    if (window.matchMedia('(pointer: coarse)').matches) {
      console.log('[CURSOR] Disabled (touch device)');
      return;
    }

    createCursor();
    updateCursor();

    // Mouse tracking
    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .tilt, .sym-card, .quiz-btn');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      if (cursor) cursor.style.opacity = '0';
      if (cursorFollower) cursorFollower.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      if (cursor) cursor.style.opacity = '1';
      if (cursorFollower) cursorFollower.style.opacity = '1';
    });

    console.log('[CURSOR] ✅ Custom cursor initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }

})();

