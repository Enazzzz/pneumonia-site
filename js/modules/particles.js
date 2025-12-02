/**
 * PARTICLE SYSTEM MODULE
 * 
 * Creates an interactive particle background that reacts to mouse movement.
 * Features:
 * - Particles float with smooth motion
 * - React to mouse proximity (repulsion/attraction)
 * - Color variation based on position
 * - Opacity and depth effects
 * - Smooth 60fps animation
 * 
 * Performance: Uses requestAnimationFrame, throttled mouse updates
 * Respects prefers-reduced-motion to disable animation.
 */

(function() {
  'use strict';

  const canvas = document.getElementById('particle-bg');
  if (!canvas) return; // Exit if canvas doesn't exist

  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 100; // Increased for more visual interest
  let animationId = null;
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let mouseRadius = 100; // Interaction radius
  let lastTime = 0;
  const throttleDelay = 16; // ~60fps

  /**
   * Initialize canvas size
   */
  function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  /**
   * Create particle objects with varied properties
   */
  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 1.5, // Size variation
        dx: (Math.random() - 0.5) * 0.3, // Slower base movement
        dy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.2, // Opacity variation
        baseOpacity: Math.random() * 0.4 + 0.2, // Store base for pulsing
        colorHue: Math.random() * 60 + 240, // Purple/blue range (240-300)
        speed: Math.random() * 0.5 + 0.3, // Individual speed
        angle: Math.random() * Math.PI * 2, // Random direction
        depth: Math.random() * 0.5 + 0.5 // Depth for layering
      });
    }
  }

  /**
   * Calculate distance between two points
   */
  function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Update particle positions with mouse interaction
   */
  function updateParticles() {
    particles.forEach(p => {
      // Base movement
      p.x += p.dx * p.speed;
      p.y += p.dy * p.speed;

      // Mouse interaction (repulsion effect)
      const dist = distance(p.x, p.y, mouseX, mouseY);
      if (dist < mouseRadius) {
        const force = (mouseRadius - dist) / mouseRadius;
        const angle = Math.atan2(p.y - mouseY, p.x - mouseX);
        const repulsionForce = force * 2;
        p.dx += Math.cos(angle) * repulsionForce * 0.1;
        p.dy += Math.sin(angle) * repulsionForce * 0.1;
        
        // Increase opacity near mouse
        p.opacity = Math.min(0.8, p.baseOpacity + force * 0.3);
      } else {
        // Gradually return to base opacity
        p.opacity += (p.baseOpacity - p.opacity) * 0.05;
      }

      // Boundary handling with bounce
      if (p.x < 0 || p.x > canvas.width) {
        p.dx *= -0.8; // Bounce with damping
        p.x = Math.max(0, Math.min(canvas.width, p.x));
      }
      if (p.y < 0 || p.y > canvas.height) {
        p.dy *= -0.8;
        p.y = Math.max(0, Math.min(canvas.height, p.y));
      }

      // Damping to prevent infinite acceleration
      p.dx *= 0.98;
      p.dy *= 0.98;

      // Keep particles in bounds
      p.x = Math.max(0, Math.min(canvas.width, p.x));
      p.y = Math.max(0, Math.min(canvas.height, p.y));
    });
  }

  /**
   * Draw particles with color variation and depth
   */
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Sort by depth for proper layering
    const sortedParticles = [...particles].sort((a, b) => a.depth - b.depth);
    
    sortedParticles.forEach(p => {
      // Color variation based on position and mouse proximity
      const dist = distance(p.x, p.y, mouseX, mouseY);
      const mouseInfluence = Math.max(0, 1 - dist / (mouseRadius * 2));
      const hue = p.colorHue + mouseInfluence * 20; // Shift hue near mouse
      
      // Create gradient for each particle
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2);
      gradient.addColorStop(0, `hsla(${hue}, 70%, 70%, ${p.opacity})`);
      gradient.addColorStop(1, `hsla(${hue}, 70%, 70%, 0)`);
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Add glow effect for particles near mouse
      if (dist < mouseRadius) {
        const glowSize = p.r * (1 + (mouseRadius - dist) / mouseRadius);
        const glowGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
        glowGradient.addColorStop(0, `hsla(${hue}, 80%, 80%, ${p.opacity * 0.3})`);
        glowGradient.addColorStop(1, `hsla(${hue}, 80%, 80%, 0)`);
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  /**
   * Main animation loop with throttling
   */
  function animate(currentTime) {
    // Check for reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      // Draw static particles
      drawParticles();
      return;
    }

    // Throttle updates for performance
    const deltaTime = currentTime - lastTime;
    if (deltaTime >= throttleDelay) {
      updateParticles();
      lastTime = currentTime;
    }
    
    drawParticles();
    animationId = requestAnimationFrame(animate);
  }

  /**
   * Handle mouse movement (throttled)
   */
  let mouseUpdateTimeout = null;
  function handleMouseMove(e) {
    if (mouseUpdateTimeout) return; // Throttle
    
    mouseUpdateTimeout = setTimeout(() => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseUpdateTimeout = null;
    }, 16);
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
    lastTime = performance.now();
    animate(lastTime);

    // Mouse tracking for interaction
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
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
        lastTime = performance.now();
        animate(lastTime);
      }
    },
    setMouseRadius: (radius) => {
      mouseRadius = radius;
    }
  };
})();
