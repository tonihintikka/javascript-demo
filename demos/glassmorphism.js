/**
 * Glassmorphism 2.0 Demo - Interactive Controls
 */

// ============================================
// STATE MANAGEMENT
// ============================================

const state = {
  blur: 10,
  opacity: 0.1,
  saturation: 180,
  borderOpacity: 0.2
};

const defaults = { ...state };

// ============================================
// DOM ELEMENTS
// ============================================

const elements = {
  previewCard: document.getElementById('preview-card'),
  blurControl: document.getElementById('blur-control'),
  opacityControl: document.getElementById('opacity-control'),
  saturationControl: document.getElementById('saturation-control'),
  borderOpacityControl: document.getElementById('border-opacity-control'),
  blurValue: document.getElementById('blur-value'),
  opacityValue: document.getElementById('opacity-value'),
  saturationValue: document.getElementById('saturation-value'),
  borderOpacityValue: document.getElementById('border-opacity-value'),
  resetBtn: document.getElementById('reset-btn'),
  copyCssBtn: document.getElementById('copy-css-btn'),
  themeToggle: document.getElementById('theme-toggle'),
  openModalBtn: document.getElementById('open-modal-btn'),
  closeModalBtn: document.getElementById('close-modal-btn'),
  modalOverlay: document.getElementById('modal-overlay')
};

// ============================================
// GLASS EFFECT UPDATE
// ============================================

function updateGlassEffect() {
  const { blur, opacity, saturation, borderOpacity } = state;

  const styles = `
    backdrop-filter: blur(${blur}px) saturate(${saturation}%);
    -webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
    background: rgba(255, 255, 255, ${opacity});
    border: 1px solid rgba(255, 255, 255, ${borderOpacity});
  `.trim();

  elements.previewCard.style.cssText = styles;
}

// ============================================
// CONTROL LISTENERS
// ============================================

function setupControls() {
  // Blur control
  elements.blurControl.addEventListener('input', (e) => {
    state.blur = parseInt(e.target.value);
    elements.blurValue.textContent = `${state.blur}px`;
    updateGlassEffect();
  });

  // Opacity control
  elements.opacityControl.addEventListener('input', (e) => {
    state.opacity = parseFloat(e.target.value);
    elements.opacityValue.textContent = state.opacity.toFixed(2);
    updateGlassEffect();
  });

  // Saturation control
  elements.saturationControl.addEventListener('input', (e) => {
    state.saturation = parseInt(e.target.value);
    elements.saturationValue.textContent = `${state.saturation}%`;
    updateGlassEffect();
  });

  // Border opacity control
  elements.borderOpacityControl.addEventListener('input', (e) => {
    state.borderOpacity = parseFloat(e.target.value);
    elements.borderOpacityValue.textContent = state.borderOpacity.toFixed(2);
    updateGlassEffect();
  });

  // Reset button
  elements.resetBtn.addEventListener('click', () => {
    resetToDefaults();
  });

  // Copy CSS button
  elements.copyCssBtn.addEventListener('click', () => {
    copyCSS();
  });
}

function resetToDefaults() {
  Object.assign(state, defaults);

  elements.blurControl.value = state.blur;
  elements.opacityControl.value = state.opacity;
  elements.saturationControl.value = state.saturation;
  elements.borderOpacityControl.value = state.borderOpacity;

  elements.blurValue.textContent = `${state.blur}px`;
  elements.opacityValue.textContent = state.opacity.toFixed(2);
  elements.saturationValue.textContent = `${state.saturation}%`;
  elements.borderOpacityValue.textContent = state.borderOpacity.toFixed(2);

  updateGlassEffect();

  showNotification('Reset to default values');
}

function copyCSS() {
  const css = generateCSS();

  navigator.clipboard.writeText(css).then(() => {
    showNotification('CSS copied to clipboard!');
  }).catch(() => {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = css;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showNotification('CSS copied to clipboard!');
  });
}

function generateCSS() {
  const { blur, opacity, saturation, borderOpacity } = state;

  return `.glass-element {
  backdrop-filter: blur(${blur}px) saturate(${saturation}%);
  -webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
  background: rgba(255, 255, 255, ${opacity});
  border: 1px solid rgba(255, 255, 255, ${borderOpacity});
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}`;
}

// ============================================
// MODAL
// ============================================

function setupModal() {
  elements.openModalBtn.addEventListener('click', () => {
    elements.modalOverlay.classList.add('active');
  });

  elements.closeModalBtn.addEventListener('click', () => {
    elements.modalOverlay.classList.remove('active');
  });

  elements.modalOverlay.addEventListener('click', (e) => {
    if (e.target === elements.modalOverlay) {
      elements.modalOverlay.classList.remove('active');
    }
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.modalOverlay.classList.contains('active')) {
      elements.modalOverlay.classList.remove('active');
    }
  });
}

// ============================================
// THEME TOGGLE
// ============================================

function setupTheme() {
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  elements.themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme');
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);

    showNotification(`Switched to ${newTheme} theme`);
  });
}

function updateThemeIcon(theme) {
  const icon = elements.themeToggle.querySelector('.theme-icon');
  icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(message) {
  // Remove existing notification
  const existing = document.querySelector('.toast-notification');
  if (existing) {
    existing.remove();
  }

  // Create notification
  const notification = document.createElement('div');
  notification.className = 'toast-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    backdrop-filter: blur(10px) saturate(180%);
    -webkit-backdrop-filter: blur(10px) saturate(180%);
    background: rgba(99, 102, 241, 0.9);
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
  `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(-50%) translateY(0)';
  }, 10);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(-50%) translateY(100px)';
    setTimeout(() => {
      notification.remove();
    }, 400);
  }, 3000);
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  setupControls();
  setupModal();
  setupTheme();
  updateGlassEffect();

  console.log('🎨 Glassmorphism 2.0 demo initialized');

  // Performance monitoring (dev only)
  if (import.meta.env.DEV) {
    console.log('State:', state);
  }
});

// ============================================
// ACCESSIBILITY
// ============================================

// Announce changes to screen readers
function announceChange(message) {
  const announcer = document.createElement('div');
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', 'polite');
  announcer.className = 'sr-only';
  announcer.textContent = message;
  document.body.appendChild(announcer);

  setTimeout(() => {
    announcer.remove();
  }, 1000);
}

// Export for potential use
export { state, updateGlassEffect, generateCSS };
