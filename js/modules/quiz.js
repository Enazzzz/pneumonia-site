/**
 * QUIZ MODULE
 * 
 * Handles interactive quiz functionality with:
 * - Immediate feedback on answer selection
 * - ARIA live regions for screen reader announcements
 * - Keyboard navigation support
 * - Visual feedback (correct/incorrect states)
 * 
 * Quiz data structure:
 * Each button should have:
 * - data-answer: "fact" or "myth"
 * - data-correct: "true" or "false"
 */

(function() {
  'use strict';

  const quizButtons = Array.from(document.querySelectorAll('.quiz-btn'));
  const quizFeedback = document.getElementById('quiz-feedback');

  if (quizButtons.length === 0 || !quizFeedback) return; // Exit if quiz doesn't exist

  let answered = false;

  /**
   * Announce feedback to screen readers
   */
  function announceFeedback(message) {
    quizFeedback.textContent = message;
    // Force screen reader to read the update
    quizFeedback.setAttribute('aria-live', 'polite');
  }

  /**
   * Handle quiz button click
   */
  function handleQuizAnswer(e) {
    const button = e.currentTarget;
    const isCorrect = button.getAttribute('data-correct') === 'true';
    const answerType = button.getAttribute('data-answer');

    // Prevent multiple answers
    if (answered) return;

    answered = true;

    // Remove all button states
    quizButtons.forEach(btn => {
      btn.classList.remove('correct', 'incorrect');
      btn.setAttribute('disabled', 'true');
      btn.setAttribute('aria-disabled', 'true');
    });

    // Add appropriate class
    if (isCorrect) {
      button.classList.add('correct');
      announceFeedback('✅ Correct! ' + getCorrectMessage(answerType));
      quizFeedback.style.color = 'var(--success)';
    } else {
      button.classList.add('incorrect');
      announceFeedback('❌ Incorrect. ' + getIncorrectMessage(answerType));
      quizFeedback.style.color = 'var(--error)';
    }

    // Show feedback with animation
    quizFeedback.style.opacity = '0';
    quizFeedback.animate([
      { opacity: 0, transform: 'translateY(-10px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], {
      duration: 300,
      fill: 'forwards',
      easing: 'ease-out'
    });
  }

  /**
   * Get correct answer message
   */
  function getCorrectMessage(answerType) {
    const messages = {
      fact: 'This is a fact. Vaccines (pneumococcal, flu) can help reduce pneumonia risk.',
      myth: 'This is indeed a myth. Good catch!'
    };
    return messages[answerType] || 'That\'s correct!';
  }

  /**
   * Get incorrect answer message
   */
  function getIncorrectMessage(answerType) {
    const messages = {
      fact: 'Actually, this is a fact. Vaccines can help prevent some types of pneumonia.',
      myth: 'Actually, this is a myth. People of any age can get pneumonia, not just the elderly.'
    };
    return messages[answerType] || 'Try again or check the content above.';
  }

  /**
   * Initialize quiz
   */
  function init() {
    quizButtons.forEach(button => {
      // Set up click handler
      button.addEventListener('click', handleQuizAnswer);

      // Set up keyboard handler
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleQuizAnswer(e);
        }
      });

      // Ensure buttons are focusable and have proper ARIA
      if (!button.hasAttribute('tabindex')) {
        button.setAttribute('tabindex', '0');
      }
      button.setAttribute('role', 'button');
      button.setAttribute('aria-pressed', 'false');
    });

    // Initialize feedback element
    quizFeedback.setAttribute('role', 'status');
    quizFeedback.setAttribute('aria-live', 'polite');
    quizFeedback.setAttribute('aria-atomic', 'true');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for potential external control
  window.quizSystem = {
    reset: () => {
      answered = false;
      quizButtons.forEach(btn => {
        btn.classList.remove('correct', 'incorrect');
        btn.removeAttribute('disabled');
        btn.setAttribute('aria-disabled', 'false');
        btn.setAttribute('aria-pressed', 'false');
      });
      quizFeedback.textContent = '';
      quizFeedback.style.opacity = '1';
    }
  };
})();

