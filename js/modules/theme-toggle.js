/**
 * THEME TOGGLE MODULE
 * 
 * Implements dark/light mode toggle with smooth transitions.
 * Features:
 * - Toggle button in navigation
 * - Smooth color transitions
 * - Persists preference in localStorage
 * - Respects system preference on first load
 * - Accessible keyboard navigation
 */

(function() {
  'use strict';

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const themeKey = 'pneumonia-site-theme';
  let currentTheme = localStorage.getItem(themeKey) || (prefersDark ? 'dark' : 'light');

  /**
   * Apply theme to document
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('light-theme', theme === 'light');
    localStorage.setItem(themeKey, theme);
    currentTheme = theme;
    
    // Update toggle button if it exists
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
    
    console.log(`[THEME] Applied ${theme} theme`);
  }

  /**
   * Toggle between themes
   */
  function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  /**
   * Create theme toggle button
   */
  function createToggleButton() {
    const nav = document.getElementById('topnav');
    if (!nav) return;

    const toggle = document.createElement('button');
    toggle.id = 'theme-toggle';
    toggle.className = 'theme-toggle';
    toggle.setAttribute('aria-label', `Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`);
    toggle.setAttribute('aria-pressed', currentTheme === 'dark' ? 'true' : 'false');
    toggle.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
    toggle.title = `Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`;

    toggle.addEventListener('click', toggleTheme);
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTheme();
      }
    });

    // Insert before mobile menu toggle or at end
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    if (mobileToggle) {
      nav.insertBefore(toggle, mobileToggle);
    } else {
      nav.appendChild(toggle);
    }
  }

  /**
   * Initialize theme system
   */
  function init() {
    // Apply initial theme
    applyTheme(currentTheme);
    
    // Create toggle button
    createToggleButton();
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(themeKey)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
    
    console.log('[THEME] ✅ Theme system initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }

  // Export for external use
  window.themeSystem = {
    toggle: toggleTheme,
    set: applyTheme,
    get: () => currentTheme
  };

})();

