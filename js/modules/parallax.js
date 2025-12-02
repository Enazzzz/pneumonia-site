/**
 * PARALLAX MODULE
 * 
 * Handles mouse-based parallax effects on hero section layers.
 * Uses requestAnimationFrame for smooth 60fps updates.
 * Respects prefers-reduced-motion to disable parallax.
 * 
 * Architecture:
 * - Tracks mouse position relative to hero section
 * - Applies transform to parallax layers with different depth multipliers
 * - Uses translate3d for GPU acceleration
 */

(function() {
  'use strict';

  const hero = document.getElementById('hero');
  if (!hero) return; // Exit if hero doesn't exist

  const layers = Array.from(document.querySelectorAll('#parallax-layers .layer'));
  if (layers.length === 0) return;

  let mouse = { x: 0, y: 0 };
  let rafId = null;
  let isActive = true;

  /**
   * Check if user prefers reduced motion
   */
  function checkReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Update layer positions based on mouse position
   */
  function updateParallax() {
    if (!isActive || checkReducedMotion()) {
      // Reset transforms if motion is reduced
      layers.forEach(layer => {
        layer.style.transform = 'translate3d(0, 0, 0)';
      });
      return;
    }

    layers.forEach((layer, index) => {
      // Different depth multipliers for each layer (creates depth effect)
      const depth = (index + 1) * 6;
      const x = mouse.x * depth;
      const y = mouse.y * depth;

      // Use translate3d for GPU acceleration
      layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });

    rafId = requestAnimationFrame(updateParallax);
  }

  /**
   * Handle mouse/pointer movement
   */
  function handlePointerMove(e) {
    if (checkReducedMotion()) return;

    const rect = hero.getBoundingClientRect();
    // Calculate normalized position (-0.5 to 0.5)
    mouse.x = ((e.clientX - rect.left) / rect.width - 0.5);
    mouse.y = ((e.clientY - rect.top) / rect.height - 0.5);
  }

  /**
   * Handle pointer leave (reset to center)
   */
  function handlePointerLeave() {
    mouse.x = 0;
    mouse.y = 0;
  }

  /**
   * Initialize parallax system
   */
  function init() {
    if (!hero) {
      console.warn('[PARALLAX] Hero element not found');
      return;
    }

    if (layers.length === 0) {
      console.warn('[PARALLAX] No parallax layers found');
      return;
    }

    if (checkReducedMotion()) {
      isActive = false;
      console.log('[PARALLAX] Disabled (reduced motion preference)');
      return;
    }

    console.log(`[PARALLAX] Initializing with ${layers.length} layers`);

    // Use pointer events for better touch support
    hero.addEventListener('pointermove', handlePointerMove, { passive: true });
    hero.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    // Start animation loop
    updateParallax();
    console.log('[PARALLAX] ✅ Initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Wait a bit to ensure elements are in DOM
    setTimeout(init, 100);
  }

  // Handle reduced motion preference changes
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
    isActive = !checkReducedMotion();
    if (isActive) {
      updateParallax();
    } else {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      layers.forEach(layer => {
        layer.style.transform = 'translate3d(0, 0, 0)';
      });
    }
  });

  // Export for potential external control
  window.parallaxSystem = {
    enable: () => {
      isActive = true;
      updateParallax();
    },
    disable: () => {
      isActive = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
  };
})();

