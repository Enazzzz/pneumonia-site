/**
 * BREATHING DEMO MODULE
 * 
 * Implements the 4-7-8 breathing exercise visualization:
 * - Inhale for 4 seconds
 * - Hold for 7 seconds
 * - Exhale for 8 seconds
 * 
 * Features:
 * - Visual circle animation that scales with breath
 * - Optional audio cues (muted by default, can be toggled)
 * - Accessible controls (keyboard navigation, ARIA labels)
 * - Respects prefers-reduced-motion
 */

(function() {
  'use strict';

  const breathBtn = document.getElementById('play-breath');
  const breathingCircle = document.getElementById('breathing-circle');
  const breathingToggle = document.getElementById('breathing-toggle');
  const breathingMute = document.getElementById('breathing-mute');
  const breathingInstruction = document.getElementById('breathing-instruction');

  if (!breathBtn || !breathingCircle) return; // Exit if elements don't exist

  let breatheTimeline = null;
  let isBreathing = false;
  let isMuted = true;
  let audioContext = null;
  let audioOscillator = null;

  /**
   * Check if user prefers reduced motion
   */
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Create audio context for breathing cues (optional)
   */
  function initAudio() {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Audio context not supported:', e);
    }
  }

  /**
   * Play a soft chime sound at the start of each phase
   */
  function playChime(frequency = 440, duration = 0.1) {
    if (!audioContext || isMuted || prefersReducedMotion()) return;

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
      console.warn('Could not play audio:', e);
    }
  }

  /**
   * Update instruction text
   */
  function updateInstruction(text) {
    if (breathingInstruction) {
      breathingInstruction.textContent = text;
    }
  }

  /**
   * Start the breathing exercise
   */
  function startBreathing() {
    if (isBreathing) {
      stopBreathing();
      return;
    }

    if (prefersReducedMotion()) {
      updateInstruction('Breathing exercise disabled (reduced motion preference detected).');
      return;
    }

    isBreathing = true;
    breathBtn.setAttribute('aria-pressed', 'true');
    if (breathingToggle) {
      breathingToggle.classList.add('breathing-active');
      breathingToggle.setAttribute('aria-pressed', 'true');
    }
    if (breathingMute) {
      breathingMute.classList.add('breathing-active');
    }

    // Initialize audio if not already done
    if (!audioContext && !isMuted) {
      initAudio();
    }

    // Create GSAP timeline for 4-7-8 pattern
    breatheTimeline = gsap.timeline({
      repeat: -1,
      onRepeat: () => {
        // Reset instruction at start of each cycle
        updateInstruction('Starting new cycle...');
      }
    });

    // Phase 1: Inhale (4 seconds)
    breatheTimeline.call(() => {
      updateInstruction('Inhale slowly through your nose... (4 seconds)');
      playChime(440, 0.15);
    });
    breatheTimeline.to(breathingCircle, {
      scale: 1.6,
      opacity: 0.9,
      duration: 4,
      ease: 'power1.inOut'
    });

    // Phase 2: Hold (7 seconds)
    breatheTimeline.call(() => {
      updateInstruction('Hold your breath... (7 seconds)');
      playChime(523, 0.15);
    });
    breatheTimeline.to(breathingCircle, {
      scale: 1.6,
      opacity: 0.9,
      duration: 7,
      ease: 'none'
    });

    // Phase 3: Exhale (8 seconds)
    breatheTimeline.call(() => {
      updateInstruction('Exhale slowly through your mouth... (8 seconds)');
      playChime(349, 0.15);
    });
    breatheTimeline.to(breathingCircle, {
      scale: 1.0,
      opacity: 0.4,
      duration: 8,
      ease: 'power1.inOut'
    });

    breatheTimeline.call(() => {
      updateInstruction('Cycle complete. Continue breathing...');
    });
  }

  /**
   * Stop the breathing exercise
   */
  function stopBreathing() {
    if (breatheTimeline) {
      breatheTimeline.kill();
      breatheTimeline = null;
    }

    isBreathing = false;
    breathBtn.setAttribute('aria-pressed', 'false');
    if (breathingToggle) {
      breathingToggle.setAttribute('aria-pressed', 'false');
      breathingToggle.classList.remove('breathing-active');
    }
    if (breathingMute) {
      breathingMute.classList.remove('breathing-active');
    }

    // Reset circle to default state
    gsap.to(breathingCircle, {
      scale: 1,
      opacity: 0.6,
      duration: 0.5,
      ease: 'power2.out'
    });

    updateInstruction('Breathing exercise stopped. Click "Breathing Demo" to start again.');
  }

  /**
   * Toggle mute state
   */
  function toggleMute() {
    isMuted = !isMuted;
    if (breathingMute) {
      breathingMute.setAttribute('aria-pressed', isMuted ? 'false' : 'true');
      breathingMute.textContent = isMuted ? '🔊 Unmute' : '🔇 Mute';
    }
  }

  /**
   * Initialize breathing demo
   */
  function init() {
    // Set up event listeners
    breathBtn.addEventListener('click', startBreathing);
    breathBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        startBreathing();
      }
    });

    if (breathingToggle) {
      breathingToggle.addEventListener('click', stopBreathing);
      breathingToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          stopBreathing();
        }
      });
    }

    if (breathingMute) {
      breathingMute.classList.add('breathing-active');
      breathingMute.addEventListener('click', toggleMute);
      breathingMute.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleMute();
        }
      });
    }

    // Initialize audio context on first user interaction (browser requirement)
    document.addEventListener('click', () => {
      if (!audioContext && !isMuted) {
        initAudio();
      }
    }, { once: true });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for potential external control
  window.breathingDemo = {
    start: startBreathing,
    stop: stopBreathing,
    toggleMute: toggleMute
  };
})();

