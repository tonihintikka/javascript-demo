/**
 * Mikrointeraktiot 2025 Demo - Interactive Micro-interactions
 */

// ============================================
// HERO TITLE ANIMATION
// ============================================

function initHeroAnimation() {
  const titleChars = document.querySelectorAll('.title-char');
  titleChars.forEach((char, index) => {
    char.style.setProperty('--char-index', index);
  });
}

// ============================================
// MAGNETIC BUTTONS
// ============================================

function initMagneticButtons() {
  const magneticBtns = document.querySelectorAll('.magnetic-btn');

  magneticBtns.forEach(btn => {
    const strength = parseFloat(btn.dataset.strength) || 0.3;

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

// ============================================
// HAPTIC FEEDBACK
// ============================================

function initHapticFeedback() {
  const hapticBtns = document.querySelectorAll('.haptic-btn');
  const hapticIndicator = document.querySelector('.haptic-indicator');

  hapticBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const hapticType = this.dataset.haptic;

      // Remove active state from all buttons
      hapticBtns.forEach(b => b.classList.remove('active'));

      // Add active state to clicked button
      this.classList.add('active');

      // Trigger visual feedback
      triggerHapticVisual(hapticType, hapticIndicator);

      // Try to trigger actual haptic feedback on supported devices
      if ('vibrate' in navigator) {
        switch(hapticType) {
          case 'light':
            navigator.vibrate(50);
            break;
          case 'medium':
            navigator.vibrate(100);
            break;
          case 'heavy':
            navigator.vibrate([100, 50, 100]);
            break;
        }
      }

      // Reset button after animation
      setTimeout(() => {
        this.classList.remove('active');
      }, 300);
    });
  });
}

function triggerHapticVisual(type, indicator) {
  // Remove active class
  indicator.classList.remove('active');

  // Force reflow to restart animation
  void indicator.offsetWidth;

  // Add active class
  indicator.classList.add('active');

  // Remove after animation completes
  setTimeout(() => {
    indicator.classList.remove('active');
  }, 1000);
}

// ============================================
// PREDICTIVE UI
// ============================================

let predictionTimeout = null;
let hoveredCard = null;
let hoverStartTime = 0;
const PREDICTION_THRESHOLD = 500; // ms

function initPredictiveUI() {
  const actionCards = document.querySelectorAll('.action-card');

  actionCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      hoveredCard = this;
      hoverStartTime = Date.now();

      // Clear any existing prediction
      clearPrediction();

      // Start prediction timer
      predictionTimeout = setTimeout(() => {
        if (hoveredCard === this) {
          predictAction(this);
        }
      }, PREDICTION_THRESHOLD);
    });

    card.addEventListener('mouseleave', function() {
      clearPrediction();
      hoveredCard = null;
    });

    card.addEventListener('click', function() {
      // Flash effect on click
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });
}

function predictAction(card) {
  card.classList.add('predicted');

  // Log prediction for demo purposes
  const action = card.dataset.action;
  console.log(`🎯 Predicted action: ${action}`);
}

function clearPrediction() {
  if (predictionTimeout) {
    clearTimeout(predictionTimeout);
    predictionTimeout = null;
  }

  document.querySelectorAll('.action-card.predicted').forEach(card => {
    card.classList.remove('predicted');
  });
}

// ============================================
// STATE BUTTONS
// ============================================

function initStateButtons() {
  // Loading button
  const loadingBtn = document.getElementById('loading-btn');
  if (loadingBtn) {
    loadingBtn.addEventListener('click', function() {
      if (this.classList.contains('loading') || this.classList.contains('success')) {
        return;
      }

      // Start loading
      this.classList.add('loading');

      // Simulate async operation
      setTimeout(() => {
        this.classList.remove('loading');
        this.classList.add('success');

        // Reset after showing success
        setTimeout(() => {
          this.classList.remove('success');
        }, 2000);
      }, 2000);
    });
  }

  // Favorite button
  const favoriteBtn = document.getElementById('favorite-btn');
  if (favoriteBtn) {
    favoriteBtn.addEventListener('click', function() {
      this.classList.toggle('active');

      if (this.classList.contains('active')) {
        this.querySelector('.favorite-icon').textContent = '♥';
        this.querySelector('.btn-label').textContent = 'Added to Favorites';
      } else {
        this.querySelector('.favorite-icon').textContent = '♡';
        this.querySelector('.btn-label').textContent = 'Add to Favorites';
      }
    });
  }

  // Toggle button
  const toggleBtn = document.getElementById('toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      this.classList.toggle('active');

      const label = this.querySelector('.btn-label');
      if (this.classList.contains('active')) {
        label.textContent = 'Light Mode';
      } else {
        label.textContent = 'Dark Mode';
      }
    });
  }
}

// ============================================
// RIPPLE EFFECT
// ============================================

function initRippleEffect() {
  const rippleBtns = document.querySelectorAll('.ripple-btn');

  rippleBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');

      // Get click coordinates relative to button
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Position ripple at click point
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      // Add to button
      this.appendChild(ripple);

      // Remove after animation
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// ============================================
// TOOLTIP POSITIONING
// ============================================

function initTooltips() {
  const tooltipTriggers = document.querySelectorAll('.tooltip-trigger');

  tooltipTriggers.forEach(trigger => {
    trigger.addEventListener('mouseenter', function() {
      // Check if tooltip would overflow viewport
      const rect = this.getBoundingClientRect();
      const tooltipWidth = 200; // Approximate width

      // Adjust position if needed
      if (rect.left < tooltipWidth / 2) {
        this.style.setProperty('--tooltip-offset', `${tooltipWidth / 2 - rect.left}px`);
      } else if (rect.right > window.innerWidth - tooltipWidth / 2) {
        this.style.setProperty('--tooltip-offset', `-${rect.right - (window.innerWidth - tooltipWidth / 2)}px`);
      }
    });
  });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all demo sections
  document.querySelectorAll('.demo-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
  });
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

function monitorPerformance() {
  if (import.meta.env.DEV) {
    let frameCount = 0;
    let lastTime = performance.now();

    function countFrame() {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        console.log(`FPS: ${fps}`);
        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(countFrame);
    }

    requestAnimationFrame(countFrame);
  }
}

// ============================================
// REDUCED MOTION SUPPORT
// ============================================

function checkReducedMotion() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    console.log('⚠️ Reduced motion preference detected - disabling some animations');
    document.body.classList.add('reduced-motion');
  }
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================

function initKeyboardNavigation() {
  // Add visual focus indicators
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  checkReducedMotion();

  initHeroAnimation();
  initMagneticButtons();
  initHapticFeedback();
  initPredictiveUI();
  initStateButtons();
  initRippleEffect();
  initTooltips();
  initScrollAnimations();
  initKeyboardNavigation();

  if (import.meta.env.DEV) {
    monitorPerformance();
  }

  console.log('✨ Mikrointeraktiot demo initialized');
});

// ============================================
// CLEANUP
// ============================================

window.addEventListener('beforeunload', () => {
  // Clear any pending timeouts
  if (predictionTimeout) {
    clearTimeout(predictionTimeout);
  }
});
