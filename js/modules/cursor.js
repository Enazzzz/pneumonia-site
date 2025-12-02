(function() {
  let cursor = null;
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let isHovering = false;

  function createCursor() {
    cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursor);
    document.body.style.cursor = 'none'; // hide native cursor
  }

  function updateCursor() {
    // slight easing: almost locked to mouse
    cursorX += (mouseX - cursorX) * 1.5; // 0.2 = very slight lag
    cursorY += (mouseY - cursorY) * 1.5;

    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;

    requestAnimationFrame(updateCursor);
  }

  function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function handleMouseEnter(e) {
    isHovering = true;
    cursor.classList.add('hover');
  }

  function handleMouseLeave(e) {
    isHovering = false;
    cursor.classList.remove('hover');
  }

  function init() {
    if (window.matchMedia('(pointer: coarse)').matches) return; // ignore touch
    createCursor();
    updateCursor();

    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    const interactiveElements = document.querySelectorAll('a, button, .btn, .tilt, .sym-card, .quiz-btn');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
    document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
