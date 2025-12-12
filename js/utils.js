/**
 * Utility functions for the visualization demo
 */

/**
 * Debounce function to limit execution rate
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit execution rate
 * @param {Function} func - Function to throttle
 * @param {number} limit - Minimum time between executions in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Check if a feature is supported
 * @param {string} feature - Feature name to check
 * @returns {boolean} Whether the feature is supported
 */
export function isFeatureSupported(feature) {
  const features = {
    speechRecognition: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
    speechSynthesis: 'speechSynthesis' in window,
    mediaDevices: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
    accelerometer: 'Accelerometer' in window,
    gyroscope: 'Gyroscope' in window,
    absoluteOrientationSensor: 'AbsoluteOrientationSensor' in window,
    ambientLightSensor: 'AmbientLightSensor' in window,
    deviceOrientation: 'DeviceOrientationEvent' in window,
    webgl: (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
      } catch (e) {
        return false;
      }
    })(),
    webgl2: (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
      } catch (e) {
        return false;
      }
    })(),
  };

  return features[feature] ?? false;
}

/**
 * Show a feedback message to the user
 * @param {string} message - Message to display
 * @param {number} duration - Duration in milliseconds
 */
export function showFeedback(message, duration = 2000) {
  // Remove any existing feedback
  const existing = document.querySelector('.feedback-message');
  if (existing) {
    existing.remove();
  }

  // Create new feedback element
  const feedback = document.createElement('div');
  feedback.className = 'feedback-message';
  feedback.textContent = message;
  feedback.setAttribute('role', 'status');
  feedback.setAttribute('aria-live', 'polite');
  document.body.appendChild(feedback);

  // Trigger animation
  requestAnimationFrame(() => {
    feedback.classList.add('visible');
  });

  // Remove after duration
  setTimeout(() => {
    feedback.classList.remove('visible');
    setTimeout(() => feedback.remove(), 300);
  }, duration);
}

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 */
export function announceToScreenReader(message) {
  const announcer = document.getElementById('sr-announcer');
  if (announcer) {
    announcer.textContent = '';
    // Force reflow to ensure announcement
    void announcer.offsetWidth;
    announcer.textContent = message;
  }
}

/**
 * Load JSON data
 * @param {string} url - URL to fetch
 * @returns {Promise<Object>} Parsed JSON data
 */
export async function loadJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Format number with locale
 * @param {number} num - Number to format
 * @param {Object} options - Intl.NumberFormat options
 * @returns {string} Formatted number
 */
export function formatNumber(num, options = {}) {
  return new Intl.NumberFormat('en-US', options).format(num);
}

/**
 * Generate a color palette for charts
 * @param {number} count - Number of colors needed
 * @returns {string[]} Array of color hex values
 */
export function generateColorPalette(count) {
  const baseColors = [
    '#5470c6', '#91cc75', '#fac858', '#ee6666',
    '#73c0de', '#3ba272', '#fc8452', '#9a60b4'
  ];

  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }

  // Generate additional colors if needed
  const colors = [...baseColors];
  for (let i = baseColors.length; i < count; i++) {
    const hue = (i * 137.508) % 360; // Golden angle approximation
    colors.push(`hsl(${hue}, 65%, 55%)`);
  }
  return colors;
}

/**
 * Convert data array to HTML table
 * @param {Object} data - Data object with labels and values
 * @returns {string} HTML table string
 */
export function dataToTable(data) {
  if (!data) return '<p>No data available</p>';

  let html = '<table>';

  if (data.labels && data.values) {
    // Simple label-value data
    html += '<thead><tr><th>Category</th><th>Value</th></tr></thead>';
    html += '<tbody>';
    data.labels.forEach((label, i) => {
      html += `<tr><td>${label}</td><td>${formatNumber(data.values[i])}</td></tr>`;
    });
    html += '</tbody>';
  } else if (data.labels && data.datasets) {
    // Multi-series data
    html += '<thead><tr><th>Period</th>';
    data.datasets.forEach(ds => {
      html += `<th>${ds.name}</th>`;
    });
    html += '</tr></thead>';
    html += '<tbody>';
    data.labels.forEach((label, i) => {
      html += `<tr><td>${label}</td>`;
      data.datasets.forEach(ds => {
        html += `<td>${formatNumber(ds.values[i])}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody>';
  } else if (data.data && Array.isArray(data.data)) {
    // Pie chart style data
    html += '<thead><tr><th>Name</th><th>Value</th></tr></thead>';
    html += '<tbody>';
    data.data.forEach(item => {
      html += `<tr><td>${item.name}</td><td>${formatNumber(item.value)}</td></tr>`;
    });
    html += '</tbody>';
  }

  html += '</table>';
  return html;
}

/**
 * Simple event emitter for component communication
 */
export class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  emit(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(...args));
  }
}

/**
 * Application state manager
 */
export class StateManager {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = [];
  }

  getState() {
    return { ...this.state };
  }

  setState(newState) {
    const oldState = this.state;
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener(this.state, oldState));
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}
