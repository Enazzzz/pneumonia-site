/**
 * GLOBAL PARTICLE SYSTEM MODULE
 * 
 * Page-spanning particle system that reacts to scroll and cursor.
 * Features:
 * - Particles visible across entire site (not just hero)
 * - Scroll-reactive with velocity-based motion
 * - Cursor interaction (repulsion, brightening)
 * - Brightens near interactive controls
 * - Realistic inertia and damping
 * - Performance optimized with device detection
 */

(function() {
  'use strict';

  const canvas = document.getElementById('particle-bg');
  if (!canvas) {
    console.warn('[PARTICLES] Canvas element not found');
    return;
  }

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId = null;
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let mouseRadius = 120;
  let lastTime = 0;
  let lastScrollY = window.scrollY;
  let scrollVelocity = 0;
  let scrollDirection = 0;

  // Check for demo override
  const urlParams = new URLSearchParams(window.location.search);
  const demoOverride = urlParams.get('demo') === '1' || localStorage.getItem('demo-full-motion') === 'true';
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches && !demoOverride;

  // Device capability detection
  const isLowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
  const particleCount = prefersReduced ? 30 : (isLowPower ? 60 : 120);

  /**
   * Initialize canvas to cover entire viewport
   */
  function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
  }

  /**
   * Create particles with varied properties
   */
  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 1.5,
        dx: (Math.random() - 0.5) * 0.2,
        dy: (Math.random() - 0.5) * 0.2,
        baseDx: (Math.random() - 0.5) * 0.2,
        baseDy: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.4 + 0.2,
        baseOpacity: Math.random() * 0.4 + 0.2,
        colorHue: Math.random() * 60 + 240, // Purple/blue range
        speed: Math.random() * 0.3 + 0.2,
        depth: Math.random() * 0.5 + 0.5,
        scrollOffset: Math.random() * 100 - 50, // Individual scroll response
        nearInteractive: false
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
   * Check if particle is near interactive element
   */
  function checkNearInteractive(x, y) {
    const interactiveElements = document.querySelectorAll(
      'a, button, .btn, .tilt, .sym-card, .diag-card, .treat-card, .quiz-btn'
    );
    
    for (const el of interactiveElements) {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerX2 = rect.left + rect.width;
      const centerY = rect.top + rect.height / 2;
      const centerY2 = rect.top + rect.height;
      const dist = Math.min(
        distance(x, y, rect.left, rect.top),
        distance(x, y, centerX2, rect.top),
        distance(x, y, rect.left, centerY2),
        distance(x, y, centerX2, centerY2),
        distance(x, y, centerX, centerY)
      );
      
      if (dist < 80) {
        return true;
      }
    }
    return false;
  }

  /**
   * Update particles with scroll and cursor interaction
   */
  function updateParticles(deltaTime) {
    particles.forEach(p => {
      // Base movement
      p.x += p.dx * p.speed;
      p.y += p.dy * p.speed;

      // Scroll reaction (velocity-based)
      if (Math.abs(scrollVelocity) > 0.1) {
        const scrollForce = Math.min(Math.abs(scrollVelocity) * 0.5, 3);
        p.dy += scrollDirection * scrollForce * 0.02;
        p.dx += (Math.random() - 0.5) * scrollForce * 0.01; // Slight horizontal drift
      }

      // Cursor interaction (repulsion)
      const distToMouse = distance(p.x, p.y, mouseX, mouseY);
      if (distToMouse < mouseRadius) {
        const force = (mouseRadius - distToMouse) / mouseRadius;
        const angle = Math.atan2(p.y - mouseY, p.x - mouseX);
        const repulsionForce = force * 2.5;
        p.dx += Math.cos(angle) * repulsionForce * 0.15;
        p.dy += Math.sin(angle) * repulsionForce * 0.15;
        
        // Brighten near cursor
        p.opacity = Math.min(0.9, p.baseOpacity + force * 0.4);
      } else {
        // Gradually return to base opacity
        p.opacity += (p.baseOpacity - p.opacity) * 0.05;
      }

      // Check if near interactive elements
      const nearInteractive = checkNearInteractive(p.x, p.y);
      if (nearInteractive && !p.nearInteractive) {
        p.nearInteractive = true;
        p.opacity = Math.min(1, p.opacity + 0.3);
      } else if (!nearInteractive && p.nearInteractive) {
        p.nearInteractive = false;
        p.opacity = Math.max(p.baseOpacity, p.opacity - 0.1);
      }

      // Boundary handling with wrap-around
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Realistic damping
      p.dx *= 0.98;
      p.dy *= 0.98;
      
      // Return to base movement gradually
      p.dx += (p.baseDx - p.dx) * 0.02;
      p.dy += (p.baseDy - p.dy) * 0.02;
    });
  }

  /**
   * Draw particles with depth and glow
   */
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Sort by depth for proper layering
    const sortedParticles = [...particles].sort((a, b) => a.depth - b.depth);
    
    sortedParticles.forEach(p => {
      const distToMouse = distance(p.x, p.y, mouseX, mouseY);
      const mouseInfluence = Math.max(0, 1 - distToMouse / (mouseRadius * 2));
      const hue = p.colorHue + mouseInfluence * 20;
      
      // Enhanced glow for particles near interactive elements
      const glowMultiplier = p.nearInteractive ? 1.5 : 1;
      
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2 * glowMultiplier);
      gradient.addColorStop(0, `hsla(${hue}, 75%, 75%, ${p.opacity})`);
      gradient.addColorStop(1, `hsla(${hue}, 75%, 75%, 0)`);
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * glowMultiplier, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    });
  }

  /**
   * Handle scroll with velocity calculation
   */
  let scrollTimeout = null;
  function handleScroll() {
    const currentScrollY = window.scrollY;
    scrollVelocity = Math.abs(currentScrollY - lastScrollY);
    scrollDirection = currentScrollY > lastScrollY ? 1 : -1;
    lastScrollY = currentScrollY;

    // Decay velocity over time
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      scrollVelocity *= 0.9;
      if (scrollVelocity < 0.1) scrollVelocity = 0;
    }, 50);
  }

  /**
   * Handle mouse movement
   */
  function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  /**
   * Main animation loop
   */
  function animate(currentTime) {
    if (prefersReduced) {
      // Static particles for reduced motion
      drawParticles();
      return;
    }

    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    updateParticles(deltaTime);
    drawParticles();
    
    animationId = requestAnimationFrame(animate);
  }

  /**
   * Initialize global particle system
   */
  function init() {
    console.log('[PARTICLES] Initializing global particle system...');
    
    initCanvas();
    createParticles();
    lastTime = performance.now();
    lastScrollY = window.scrollY;
    
    animate(lastTime);

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
      initCanvas();
      createParticles();
    }, { passive: true });

    console.log(`[PARTICLES] ✅ Global system initialized with ${particleCount} particles`);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }

  // Export for external control
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
    }
  };

})();

