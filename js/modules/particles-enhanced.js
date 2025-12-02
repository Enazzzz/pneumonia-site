/**
 * ENHANCED GLOBAL PARTICLE SYSTEM
 * 
 * Page-spanning particle system with:
 * - Collision detection between particles
 * - Friction for velocity decay
 * - Subtle attraction to large page elements
 * - Smooth end states (no snapping)
 * - Fixed clipping issues
 * - Performance optimized
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
  let isMouseActive = false;

  // Check for demo override
  const urlParams = new URLSearchParams(window.location.search);
  const demoOverride = urlParams.get('demo') === '1' || localStorage.getItem('demo-full-motion') === 'true';
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches && !demoOverride;

  // Device capability detection
  const isLowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
  const particleCount = prefersReduced ? 30 : (isLowPower ? 60 : 120);

  // Physics constants
  const FRICTION = 0.98; // Velocity decay
  const COLLISION_DAMPING = 0.7; // Energy loss on collision
  const MIN_DISTANCE = 5; // Minimum distance between particles
  const ATTRACTION_STRENGTH = 0.0001; // Very subtle attraction to elements
  const ELEMENT_ATTRACTION_RADIUS = 200; // Distance for element attraction

  /**
   * Initialize canvas with padding to prevent clipping
   */
  function initCanvas() {
    const padding = 20; // Extra space to prevent clipping
    canvas.width = window.innerWidth + padding * 2;
    canvas.height = window.innerHeight + padding * 2;
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
    const padding = 20;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * (canvas.width - padding * 2) + padding,
        y: Math.random() * (canvas.height - padding * 2) + padding,
        r: Math.random() * 3 + 1.5,
        dx: (Math.random() - 0.5) * 0.2,
        dy: (Math.random() - 0.5) * 0.2,
        baseDx: (Math.random() - 0.5) * 0.2,
        baseDy: (Math.random() - 0.5) * 0.2,
        vx: 0, // Velocity X
        vy: 0, // Velocity Y
        opacity: Math.random() * 0.4 + 0.2,
        baseOpacity: Math.random() * 0.4 + 0.2,
        colorHue: Math.random() * 60 + 240,
        speed: Math.random() * 0.3 + 0.2,
        depth: Math.random() * 0.5 + 0.5,
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
   * Check collision between two particles
   */
  function checkCollision(p1, p2) {
    const dist = distance(p1.x, p1.y, p2.x, p2.y);
    const minDist = p1.r + p2.r + MIN_DISTANCE;
    
    if (dist < minDist && dist > 0) {
      // Calculate collision response
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      const sin = Math.sin(angle);
      const cos = Math.cos(angle);
      
      // Rotate velocities
      const vx1 = p1.vx * cos + p1.vy * sin;
      const vy1 = p1.vy * cos - p1.vx * sin;
      const vx2 = p2.vx * cos + p2.vy * sin;
      const vy2 = p2.vy * cos - p2.vx * sin;
      
      // Collision response (elastic with damping)
      const finalVx1 = ((p1.r - p2.r) * vx1 + 2 * p2.r * vx2) / (p1.r + p2.r) * COLLISION_DAMPING;
      const finalVx2 = ((p2.r - p1.r) * vx2 + 2 * p1.r * vx1) / (p1.r + p2.r) * COLLISION_DAMPING;
      
      // Rotate back
      p1.vx = finalVx1 * cos - vy1 * sin;
      p1.vy = finalVx1 * sin + vy1 * cos;
      p2.vx = finalVx2 * cos - vy2 * sin;
      p2.vy = finalVx2 * sin + vy2 * cos;
      
      // Separate particles
      const overlap = minDist - dist;
      const separationX = (overlap / 2) * cos;
      const separationY = (overlap / 2) * sin;
      p1.x -= separationX;
      p1.y -= separationY;
      p2.x += separationX;
      p2.y += separationY;
      
      return true;
    }
    return false;
  }

  /**
   * Get large page elements for attraction
   */
  function getLargeElements() {
    const elements = [];
    const largeElements = document.querySelectorAll('.panel, .container, section');
    
    largeElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 200 && rect.height > 200) {
        elements.push({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2 + window.scrollY,
          width: rect.width,
          height: rect.height
        });
      }
    });
    
    return elements;
  }

  /**
   * Update particles with physics
   */
  function updateParticles(deltaTime) {
    const largeElements = getLargeElements();
    const padding = 20;
    
    particles.forEach((p, i) => {
      // Apply friction
      p.vx *= FRICTION;
      p.vy *= FRICTION;
      
      // Base movement
      p.vx += p.baseDx * 0.01;
      p.vy += p.baseDy * 0.01;
      
      // Scroll reaction
      if (Math.abs(scrollVelocity) > 0.1) {
        const scrollForce = Math.min(Math.abs(scrollVelocity) * 0.5, 3);
        p.vy += scrollDirection * scrollForce * 0.02;
        p.vx += (Math.random() - 0.5) * scrollForce * 0.01;
      }

      // Cursor interaction (repulsion) - smooth transition
      const distToMouse = distance(p.x, p.y, mouseX + padding, mouseY + padding);
      if (distToMouse < mouseRadius && isMouseActive) {
        const force = (mouseRadius - distToMouse) / mouseRadius;
        const angle = Math.atan2(p.y - (mouseY + padding), p.x - (mouseX + padding));
        const repulsionForce = force * 2.5;
        p.vx += Math.cos(angle) * repulsionForce * 0.15;
        p.vy += Math.sin(angle) * repulsionForce * 0.15;
        p.opacity = Math.min(0.9, p.baseOpacity + force * 0.4);
      } else {
        // Smooth opacity return (no snapping)
        p.opacity += (p.baseOpacity - p.opacity) * 0.05;
      }

      // Attraction to large elements (very subtle)
      largeElements.forEach(el => {
        const dist = distance(p.x, p.y, el.x + padding, el.y + padding);
        if (dist < ELEMENT_ATTRACTION_RADIUS) {
          const force = (ELEMENT_ATTRACTION_RADIUS - dist) / ELEMENT_ATTRACTION_RADIUS;
          const angle = Math.atan2((el.y + padding) - p.y, (el.x + padding) - p.x);
          p.vx += Math.cos(angle) * force * ATTRACTION_STRENGTH;
          p.vy += Math.sin(angle) * force * ATTRACTION_STRENGTH;
        }
      });

      // Check near interactive elements
      const interactiveElements = document.querySelectorAll(
        'a, button, .btn, .tilt, .sym-card, .diag-card, .treat-card, .quiz-btn'
      );
      
      let nearInteractive = false;
      for (const el of interactiveElements) {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = distance(p.x, p.y, centerX + padding, centerY + padding);
        if (dist < 80) {
          nearInteractive = true;
          break;
        }
      }
      
      if (nearInteractive && !p.nearInteractive) {
        p.nearInteractive = true;
        p.opacity = Math.min(1, p.opacity + 0.3);
      } else if (!nearInteractive && p.nearInteractive) {
        p.nearInteractive = false;
        // Smooth transition (no snapping)
        p.opacity = Math.max(p.baseOpacity, p.opacity - 0.05);
      }

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Boundary handling with smooth wrap (no clipping)
      if (p.x < padding) {
        p.x = canvas.width - padding;
      } else if (p.x > canvas.width - padding) {
        p.x = padding;
      }
      if (p.y < padding) {
        p.y = canvas.height - padding;
      } else if (p.y > canvas.height - padding) {
        p.y = padding;
      }

      // Apply friction to velocities
      p.vx *= FRICTION;
      p.vy *= FRICTION;
      
      // Return to base movement gradually
      p.vx += (p.baseDx * 0.01 - p.vx) * 0.02;
      p.vy += (p.baseDy * 0.01 - p.vy) * 0.02;
    });

    // Collision detection (only check nearby particles for performance)
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        // Only check if particles are on same depth layer (within 0.2)
        if (Math.abs(particles[i].depth - particles[j].depth) < 0.2) {
          checkCollision(particles[i], particles[j]);
        }
      }
    }
  }

  /**
   * Draw particles
   */
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const sortedParticles = [...particles].sort((a, b) => a.depth - b.depth);
    
    sortedParticles.forEach(p => {
      const distToMouse = distance(p.x, p.y, mouseX + 20, mouseY + 20);
      const mouseInfluence = Math.max(0, 1 - distToMouse / (mouseRadius * 2));
      const hue = p.colorHue + mouseInfluence * 20;
      
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
   * Handle scroll with velocity
   */
  let scrollTimeout = null;
  function handleScroll() {
    const currentScrollY = window.scrollY;
    scrollVelocity = Math.abs(currentScrollY - lastScrollY);
    scrollDirection = currentScrollY > lastScrollY ? 1 : -1;
    lastScrollY = currentScrollY;

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
    isMouseActive = true;
  }

  function handleMouseLeave() {
    isMouseActive = false;
    // Smooth transition - particles gradually return to normal
  }

  /**
   * Main animation loop
   */
  function animate(currentTime) {
    if (prefersReduced) {
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
   * Initialize enhanced particle system
   */
  function init() {
    console.log('[PARTICLES] Initializing enhanced particle system...');
    
    initCanvas();
    createParticles();
    lastTime = performance.now();
    lastScrollY = window.scrollY;
    
    animate(lastTime);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
      initCanvas();
      createParticles();
    }, { passive: true });

    console.log(`[PARTICLES] ✅ Enhanced system initialized with ${particleCount} particles`);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }

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

