/**
 * PARTICLE SYSTEM MODULE
 * 
 * Creates a subtle particle background effect using Canvas API.
 * Particles float gently and can react to mouse proximity (optional).
 * 
 * Performance: Uses requestAnimationFrame for smooth 60fps animation.
 * Respects prefers-reduced-motion to disable animation.
 */

(function() {
  'use strict';

  const canvas = document.getElementById('particle-bg');
  if (!canvas) return; // Exit if canvas doesn't exist

  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 80;
  let animationId = null;
  let mouseX = 0;
  let mouseY = 0;

  /**
   * Initialize canvas size
   */
  function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  /**
   * Create particle objects
   */
  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.3 + 0.1
      });
    }
  }

  /**
   * Update particle positions and handle boundaries
   */
  function updateParticles() {
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;

      // Bounce off edges
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

      // Keep particles in bounds
      p.x = Math.max(0, Math.min(canvas.width, p.x));
      p.y = Math.max(0, Math.min(canvas.height, p.y));
    });
  }

  /**
   * Draw particles on canvas
   */
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(123, 97, 255, ${p.opacity})`;
      ctx.fill();
    });
  }

  /**
   * Main animation loop
   */
  function animate() {
    // Check for reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      // Draw static particles
      drawParticles();
      return;
    }

    updateParticles();
    drawParticles();
    animationId = requestAnimationFrame(animate);
  }

  /**
   * Handle window resize
   */
  function handleResize() {
    initCanvas();
    createParticles();
  }

  /**
   * Initialize particle system
   */
  function init() {
    initCanvas();
    createParticles();
    animate();

    window.addEventListener('resize', handleResize, { passive: true });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for potential external control
  window.particleSystem = {
    pause: () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    },
    resume: () => {
      if (!animationId) {
        animate();
      }
    }
  };
})();

