/**
 * COPY PROTECTION MODULE
 * 
 * Optional flag to disable text selection and copy operations.
 * Can be toggled via localStorage or URL parameter.
 * 
 * Usage:
 * - Set localStorage.setItem('preventCopy', 'true') to enable
 * - Add ?nocopy=1 to URL to enable
 * - Documented in README with accessibility implications
 */

(function() {
  'use strict';

  // Check for flag
  const urlParams = new URLSearchParams(window.location.search);
  const urlFlag = urlParams.get('nocopy') === '1';
  const storageFlag = localStorage.getItem('preventCopy') === 'true';
  const preventCopy = urlFlag || storageFlag;

  if (!preventCopy) {
    console.log('[COPY-PROTECTION] Text selection enabled');
    return;
  }

  console.log('[COPY-PROTECTION] ⚠️ Text selection disabled');

  /**
   * Prevent text selection
   */
  function preventSelection(e) {
    if (e.target.closest('input, textarea, [contenteditable]')) {
      return; // Allow selection in form fields
    }
    e.preventDefault();
    return false;
  }

  /**
   * Prevent context menu (right-click copy)
   */
  function preventContextMenu(e) {
    if (e.target.closest('input, textarea, [contenteditable]')) {
      return; // Allow context menu in form fields
    }
    e.preventDefault();
    return false;
  }

  /**
   * Prevent copy shortcuts (Ctrl+C, Cmd+C)
   */
  function preventCopyShortcut(e) {
    if (e.target.closest('input, textarea, [contenteditable]')) {
      return; // Allow copy in form fields
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
      e.preventDefault();
      return false;
    }
  }

  /**
   * Apply CSS to disable selection
   */
  function applyStyles() {
    const style = document.createElement('style');
    style.id = 'copy-protection-styles';
    style.textContent = `
      body {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      input, textarea, [contenteditable] {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Initialize copy protection
   */
  function init() {
    applyStyles();
    
    // Prevent selection
    document.addEventListener('selectstart', preventSelection, { passive: false });
    document.addEventListener('dragstart', preventSelection, { passive: false });
    
    // Prevent context menu
    document.addEventListener('contextmenu', preventContextMenu, { passive: false });
    
    // Prevent copy shortcuts
    document.addEventListener('keydown', preventCopyShortcut, { passive: false });

    console.log('[COPY-PROTECTION] ✅ Protection enabled (see README to disable)');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export function to disable protection
  window.disableCopyProtection = function() {
    localStorage.removeItem('preventCopy');
    const style = document.getElementById('copy-protection-styles');
    if (style) style.remove();
    document.removeEventListener('selectstart', preventSelection);
    document.removeEventListener('dragstart', preventSelection);
    document.removeEventListener('contextmenu', preventContextMenu);
    document.removeEventListener('keydown', preventCopyShortcut);
    document.body.style.userSelect = '';
    console.log('[COPY-PROTECTION] ✅ Protection disabled');
  };

})();

