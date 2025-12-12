/**
 * Main application entry point
 * JavaScript Visualization Demo 2025
 */

import * as echarts from 'echarts';
import {
  showFeedback,
  announceToScreenReader,
  loadJSON,
  dataToTable,
  isFeatureSupported,
  StateManager,
  EventEmitter
} from './utils.js';
import {
  BarChart3D,
  ScatterPlot3D,
  SurfacePlot3D,
  NetworkGraph3D,
  PieChart3D
} from './three/index.js';

// Global application state
const appState = new StateManager({
  currentDemo: 'basic-charts',
  chartType: 'line',
  datasetIndex: 0,
  voiceEnabled: false,
  gestureEnabled: false,
  sensorEnabled: false,
  theme: 'light'
});

// Global event bus for component communication
const eventBus = new EventEmitter();

// Chart instance reference
let chartInstance = null;
let threeInstance = null;
let sampleData = null;

/**
 * Initialize the application
 */
async function init() {
  console.log('Initializing JS Visualization Demo 2025...');

  // Load sample data
  try {
    sampleData = await loadJSON('/data/sample-data.json');
    console.log('Sample data loaded successfully');
  } catch (error) {
    console.error('Failed to load sample data:', error);
    showFeedback('Error loading data. Please refresh the page.');
    return;
  }

  // Set up theme
  initTheme();

  // Set up navigation
  initNavigation();

  // Set up control buttons
  initControls();

  // Set up modal
  initModal();

  // Check feature support and log results
  logFeatureSupport();

  // Load initial demo
  loadDemo(appState.getState().currentDemo);

  console.log('Application initialized');
}

/**
 * Initialize theme handling
 */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Set initial theme
  const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', savedTheme);
  appState.setState({ theme: savedTheme });

  // Theme toggle handler
  themeToggle?.addEventListener('click', () => {
    const currentTheme = appState.getState().theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    appState.setState({ theme: newTheme });

    // Update ECharts theme if chart exists
    if (chartInstance) {
      const container = chartInstance.getDom();
      chartInstance.dispose();
      chartInstance = echarts.init(container, newTheme === 'dark' ? 'dark' : null);
      renderCurrentChart();
    }

    showFeedback(`Theme: ${newTheme}`);
    announceToScreenReader(`Theme changed to ${newTheme} mode`);
  });
}

/**
 * Initialize navigation
 */
function initNavigation() {
  const demoLinks = document.querySelectorAll('.demo-link');

  demoLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const demoId = link.dataset.demo;

      // Update active state
      demoLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Load the demo
      loadDemo(demoId);
      appState.setState({ currentDemo: demoId });

      announceToScreenReader(`Loaded ${link.querySelector('.demo-title')?.textContent} demo`);
    });
  });
}

/**
 * Initialize control buttons
 */
function initControls() {
  // Previous button
  document.getElementById('btn-prev')?.addEventListener('click', () => {
    navigateDataset(-1);
  });

  // Next button
  document.getElementById('btn-next')?.addEventListener('click', () => {
    navigateDataset(1);
  });

  // Reset button
  document.getElementById('btn-reset')?.addEventListener('click', () => {
    resetVisualization();
  });

  // Chart type buttons
  document.querySelectorAll('[data-chart-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      const chartType = btn.dataset.chartType;
      changeChartType(chartType);

      // Update button states
      document.querySelectorAll('[data-chart-type]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

/**
 * Initialize modal
 */
function initModal() {
  const modal = document.getElementById('data-modal');
  const showBtn = document.getElementById('btn-show-data');
  const closeBtn = document.getElementById('btn-close-modal');

  showBtn?.addEventListener('click', () => {
    const container = document.getElementById('data-table-container');
    const state = appState.getState();

    // Generate table based on current demo
    let tableData = null;
    switch (state.currentDemo) {
      case 'basic-charts':
        tableData = state.chartType === 'pie' ? sampleData.marketShare : sampleData.salesData;
        break;
      default:
        tableData = sampleData.salesData;
    }

    container.innerHTML = dataToTable(tableData);
    modal.showModal();
    announceToScreenReader('Data table opened');
  });

  closeBtn?.addEventListener('click', () => {
    modal.close();
  });

  // Close on backdrop click
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.close();
    }
  });
}

/**
 * Log feature support status
 */
function logFeatureSupport() {
  console.group('Feature Support');
  console.log('Speech Recognition:', isFeatureSupported('speechRecognition'));
  console.log('Speech Synthesis:', isFeatureSupported('speechSynthesis'));
  console.log('Media Devices:', isFeatureSupported('mediaDevices'));
  console.log('Accelerometer:', isFeatureSupported('accelerometer'));
  console.log('Gyroscope:', isFeatureSupported('gyroscope'));
  console.log('Device Orientation:', isFeatureSupported('deviceOrientation'));
  console.log('WebGL:', isFeatureSupported('webgl'));
  console.log('WebGL2:', isFeatureSupported('webgl2'));
  console.groupEnd();
}

/**
 * Load a specific demo
 * @param {string} demoId - Demo identifier
 */
async function loadDemo(demoId) {
  const container = document.getElementById('demo-container');
  container.innerHTML = '<div class="loading-placeholder"><p>Loading demo...</p></div>';

  // Dispose existing chart
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }

  // Dispose existing Three.js instance
  if (threeInstance) {
    threeInstance.dispose();
    threeInstance = null;
  }

  switch (demoId) {
    case 'basic-charts':
      await loadBasicChartsDemo(container);
      break;
    case 'voice-demo':
      await loadVoiceDemo(container);
      break;
    case 'gesture-demo':
      await loadGestureDemo(container);
      break;
    case 'sensor-demo':
      await loadSensorDemo(container);
      break;
    case '3d-demo':
      await load3DDemo(container);
      break;
    case 'multimodal':
      await loadMultimodalDemo(container);
      break;
    default:
      container.innerHTML = '<div class="loading-placeholder"><p>Demo not found</p></div>';
  }
}

/**
 * Basic Charts Demo
 */
async function loadBasicChartsDemo(container) {
  container.innerHTML = `
    <div class="demo-content">
      <h2>Basic Visualizations with ECharts</h2>
      <p>Interactive charts with tooltips, zoom, and animated transitions.</p>
      <div id="chart" class="chart-container" role="img" aria-label="Interactive chart visualization"></div>
    </div>
  `;

  const chartContainer = document.getElementById('chart');
  const theme = appState.getState().theme;
  chartInstance = echarts.init(chartContainer, theme === 'dark' ? 'dark' : null);

  // Handle resize
  window.addEventListener('resize', () => {
    chartInstance?.resize();
  });

  renderCurrentChart();
}

/**
 * Render chart based on current state
 */
function renderCurrentChart() {
  if (!chartInstance || !sampleData) return;

  const state = appState.getState();
  let option;

  switch (state.chartType) {
    case 'line':
      option = createLineChartOption();
      break;
    case 'bar':
      option = createBarChartOption();
      break;
    case 'pie':
      option = createPieChartOption();
      break;
    default:
      option = createLineChartOption();
  }

  chartInstance.setOption(option, true);
}

/**
 * Create line chart option
 */
function createLineChartOption() {
  const data = sampleData.salesData;
  const state = appState.getState();

  return {
    title: {
      text: data.title,
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      data: data.datasets.map(d => d.name),
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {},
        dataZoom: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.labels
    },
    yAxis: {
      type: 'value'
    },
    series: data.datasets.map((dataset, index) => ({
      name: dataset.name,
      type: 'line',
      smooth: true,
      emphasis: {
        focus: 'series'
      },
      data: dataset.values,
      animationDuration: 1000,
      animationDelay: index * 200
    }))
  };
}

/**
 * Create bar chart option
 */
function createBarChartOption() {
  const data = sampleData.categoryData;

  return {
    title: {
      text: data.title,
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.labels,
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      type: 'bar',
      data: data.values.map((value, index) => ({
        value,
        itemStyle: {
          color: getChartColor(index)
        }
      })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      animationDuration: 1000,
      animationDelay: (idx) => idx * 100
    }]
  };
}

/**
 * Create pie chart option
 */
function createPieChartOption() {
  const data = sampleData.marketShare;

  return {
    title: {
      text: data.title,
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [{
      name: 'Market Share',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: data.data.map((item, index) => ({
        ...item,
        itemStyle: { color: getChartColor(index) }
      })),
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: (idx) => idx * 100
    }]
  };
}

/**
 * Get chart color by index
 */
function getChartColor(index) {
  const colors = [
    '#5470c6', '#91cc75', '#fac858', '#ee6666',
    '#73c0de', '#3ba272', '#fc8452', '#9a60b4'
  ];
  return colors[index % colors.length];
}

/**
 * Navigate between datasets
 * @param {number} direction - 1 for next, -1 for previous
 */
function navigateDataset(direction) {
  const state = appState.getState();
  const totalDatasets = sampleData.salesData.datasets.length;
  let newIndex = state.datasetIndex + direction;

  if (newIndex < 0) newIndex = totalDatasets - 1;
  if (newIndex >= totalDatasets) newIndex = 0;

  appState.setState({ datasetIndex: newIndex });

  const datasetName = sampleData.salesData.datasets[newIndex].name;
  showFeedback(`Dataset: ${datasetName}`);
  announceToScreenReader(`Showing ${datasetName} data`);

  // Highlight the selected series
  if (chartInstance && state.chartType === 'line') {
    chartInstance.dispatchAction({
      type: 'highlight',
      seriesIndex: newIndex
    });
  }
}

/**
 * Change chart type
 * @param {string} type - Chart type (line, bar, pie)
 */
function changeChartType(type) {
  appState.setState({ chartType: type });
  renderCurrentChart();
  showFeedback(`Chart type: ${type}`);
  announceToScreenReader(`Changed to ${type} chart`);
}

/**
 * Reset visualization to initial state
 */
function resetVisualization() {
  appState.setState({
    chartType: 'line',
    datasetIndex: 0
  });

  // Update UI
  document.querySelectorAll('[data-chart-type]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.chartType === 'line');
  });

  renderCurrentChart();
  showFeedback('Visualization reset');
  announceToScreenReader('Visualization reset to initial state');
}

/**
 * Voice Demo - placeholder for Phase 3
 */
async function loadVoiceDemo(container) {
  const supported = isFeatureSupported('speechRecognition');

  container.innerHTML = `
    <div class="demo-content">
      <h2>Voice-Controlled Visualization</h2>
      <p>Control the chart using voice commands. Say "next", "previous", "bar", "line", "pie", or "reset".</p>

      ${!supported ? `
        <div class="warning-panel" style="padding: 1rem; background: #fff3cd; border-radius: 8px; margin: 1rem 0;">
          <strong>Note:</strong> Web Speech API is not supported in your browser.
          Please use Chrome or Edge for voice control features.
        </div>
      ` : ''}

      <div class="demo-layout-split">
        <div class="chart-section">
          <div id="voice-chart" class="chart-container" role="img" aria-label="Voice-controlled chart"></div>
        </div>
        <div class="control-section">
          <div class="help-panel">
            <h4>Voice Commands</h4>
            <ul>
              <li><span class="command">"next"</span> Next dataset</li>
              <li><span class="command">"previous"</span> Previous dataset</li>
              <li><span class="command">"bar"</span> Bar chart</li>
              <li><span class="command">"line"</span> Line chart</li>
              <li><span class="command">"pie"</span> Pie chart</li>
              <li><span class="command">"reset"</span> Reset view</li>
            </ul>
          </div>
          <button id="btn-voice-toggle" class="btn btn-primary" ${!supported ? 'disabled' : ''}>
            Start Listening
          </button>
          <div id="voice-transcript" style="padding: 1rem; background: var(--color-bg); border-radius: 8px; min-height: 60px;">
            <em>Voice transcript will appear here...</em>
          </div>
        </div>
      </div>
    </div>
  `;

  // Initialize chart
  const chartContainer = document.getElementById('voice-chart');
  const theme = appState.getState().theme;
  chartInstance = echarts.init(chartContainer, theme === 'dark' ? 'dark' : null);
  renderCurrentChart();

  // Voice control will be fully implemented in Phase 3
  if (supported) {
    initVoiceControl();
  }
}

/**
 * Initialize voice control (basic implementation)
 */
function initVoiceControl() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  const toggleBtn = document.getElementById('btn-voice-toggle');
  const transcriptDiv = document.getElementById('voice-transcript');
  let isListening = false;

  toggleBtn?.addEventListener('click', () => {
    if (isListening) {
      recognition.stop();
      toggleBtn.textContent = 'Start Listening';
      toggleBtn.classList.remove('active');
      isListening = false;
      updateVoiceStatus(false);
    } else {
      recognition.start();
      toggleBtn.textContent = 'Stop Listening';
      toggleBtn.classList.add('active');
      isListening = true;
      updateVoiceStatus(true);
    }
  });

  recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1];
    const transcript = result[0].transcript.toLowerCase().trim();

    if (transcriptDiv) {
      transcriptDiv.innerHTML = `<strong>Heard:</strong> ${transcript}`;
    }

    if (result.isFinal) {
      processVoiceCommand(transcript);
    }
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    if (event.error === 'no-speech') {
      // Silent error - no speech detected
    } else {
      showFeedback(`Voice error: ${event.error}`);
    }
  };

  recognition.onend = () => {
    if (isListening) {
      // Restart if should still be listening
      recognition.start();
    }
  };
}

/**
 * Process voice command
 * @param {string} transcript - Recognized speech text
 */
function processVoiceCommand(transcript) {
  const commands = {
    'next': () => navigateDataset(1),
    'previous': () => navigateDataset(-1),
    'bar': () => changeChartType('bar'),
    'line': () => changeChartType('line'),
    'pie': () => changeChartType('pie'),
    'reset': () => resetVisualization()
  };

  for (const [command, action] of Object.entries(commands)) {
    if (transcript.includes(command)) {
      action();
      showFeedback(`Command: ${command}`);
      break;
    }
  }
}

/**
 * Update voice status indicator
 */
function updateVoiceStatus(active) {
  const statusEl = document.getElementById('voice-status');
  const stateEl = document.getElementById('voice-state');

  if (statusEl) statusEl.dataset.active = active;
  if (stateEl) stateEl.textContent = active ? 'On' : 'Off';

  appState.setState({ voiceEnabled: active });
}

/**
 * Gesture Demo - placeholder for Phase 4
 */
async function loadGestureDemo(container) {
  container.innerHTML = `
    <div class="demo-content">
      <h2>Gesture-Controlled Visualization</h2>
      <p>Control the chart using hand gestures detected by your camera.</p>

      <div class="demo-layout-split">
        <div class="chart-section">
          <div id="gesture-chart" class="chart-container" role="img" aria-label="Gesture-controlled chart"></div>
        </div>
        <div class="control-section">
          <div class="video-container">
            <video id="gesture-video" autoplay playsinline muted></video>
            <div class="video-overlay" id="gesture-overlay">Camera not started</div>
          </div>
          <div class="help-panel">
            <h4>Supported Gestures</h4>
            <ul>
              <li><span class="command">Thumbs Up</span> Next</li>
              <li><span class="command">Thumbs Down</span> Previous</li>
              <li><span class="command">Victory</span> Switch chart</li>
              <li><span class="command">Open Palm</span> Reset</li>
            </ul>
          </div>
          <button id="btn-gesture-toggle" class="btn btn-primary">
            Start Camera
          </button>
        </div>
      </div>

      <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--color-text-secondary);">
        <strong>Note:</strong> Gesture recognition requires MediaPipe Vision to be loaded.
        Full implementation coming in Phase 4.
      </p>
    </div>
  `;

  // Initialize chart
  const chartContainer = document.getElementById('gesture-chart');
  const theme = appState.getState().theme;
  chartInstance = echarts.init(chartContainer, theme === 'dark' ? 'dark' : null);
  renderCurrentChart();

  // Basic camera preview (full gesture recognition in Phase 4)
  const toggleBtn = document.getElementById('btn-gesture-toggle');
  const video = document.getElementById('gesture-video');
  const overlay = document.getElementById('gesture-overlay');
  let stream = null;

  toggleBtn?.addEventListener('click', async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
      video.srcObject = null;
      toggleBtn.textContent = 'Start Camera';
      overlay.textContent = 'Camera stopped';
      updateGestureStatus(false);
    } else {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' }
        });
        video.srcObject = stream;
        toggleBtn.textContent = 'Stop Camera';
        overlay.textContent = 'Gesture recognition ready (Phase 4)';
        updateGestureStatus(true);
      } catch (error) {
        console.error('Camera error:', error);
        showFeedback('Failed to access camera');
        overlay.textContent = 'Camera access denied';
      }
    }
  });
}

/**
 * Update gesture status indicator
 */
function updateGestureStatus(active) {
  const statusEl = document.getElementById('gesture-status');
  const stateEl = document.getElementById('gesture-state');

  if (statusEl) statusEl.dataset.active = active;
  if (stateEl) stateEl.textContent = active ? 'On' : 'Off';

  appState.setState({ gestureEnabled: active });
}

/**
 * Sensor Demo - placeholder for Phase 5
 */
async function loadSensorDemo(container) {
  const accelerometerSupported = isFeatureSupported('accelerometer');
  const orientationSupported = isFeatureSupported('deviceOrientation');

  container.innerHTML = `
    <div class="demo-content">
      <h2>Sensor-Controlled Visualization</h2>
      <p>Use your device's sensors to control the visualization. Shake to reset, tilt to navigate.</p>

      ${!accelerometerSupported && !orientationSupported ? `
        <div class="warning-panel" style="padding: 1rem; background: #fff3cd; border-radius: 8px; margin: 1rem 0;">
          <strong>Note:</strong> Device sensors are not available. This demo works best on mobile devices.
        </div>
      ` : ''}

      <div class="sensor-display">
        <div class="sensor-value">
          <span class="label">Acceleration X</span>
          <span class="value" id="accel-x">0.00</span>
        </div>
        <div class="sensor-value">
          <span class="label">Acceleration Y</span>
          <span class="value" id="accel-y">0.00</span>
        </div>
        <div class="sensor-value">
          <span class="label">Acceleration Z</span>
          <span class="value" id="accel-z">0.00</span>
        </div>
        <div class="sensor-value">
          <span class="label">Orientation Alpha</span>
          <span class="value" id="orient-alpha">0</span>
        </div>
      </div>

      <div id="sensor-chart" class="chart-container" style="margin-top: 1rem;" role="img" aria-label="Sensor-controlled chart"></div>

      <button id="btn-sensor-toggle" class="btn btn-primary" style="margin-top: 1rem;">
        Enable Sensors
      </button>

      <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--color-text-secondary);">
        <strong>Tip:</strong> On mobile, shake device to reset chart. Full implementation in Phase 5.
      </p>
    </div>
  `;

  // Initialize chart
  const chartContainer = document.getElementById('sensor-chart');
  const theme = appState.getState().theme;
  chartInstance = echarts.init(chartContainer, theme === 'dark' ? 'dark' : null);
  renderCurrentChart();

  // Basic sensor reading (full implementation in Phase 5)
  const toggleBtn = document.getElementById('btn-sensor-toggle');
  let sensorActive = false;

  toggleBtn?.addEventListener('click', () => {
    if (sensorActive) {
      sensorActive = false;
      toggleBtn.textContent = 'Enable Sensors';
      updateSensorStatus(false);
    } else {
      initBasicSensors();
      sensorActive = true;
      toggleBtn.textContent = 'Disable Sensors';
      updateSensorStatus(true);
    }
  });
}

/**
 * Initialize basic sensor reading
 */
function initBasicSensors() {
  // Try DeviceOrientationEvent (more widely supported)
  if (isFeatureSupported('deviceOrientation')) {
    // iOS requires permission request
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(permission => {
          if (permission === 'granted') {
            startOrientationListener();
          }
        })
        .catch(console.error);
    } else {
      startOrientationListener();
    }
  }

  // Try Accelerometer API
  if (isFeatureSupported('accelerometer')) {
    try {
      const accelerometer = new Accelerometer({ frequency: 60 });
      accelerometer.addEventListener('reading', () => {
        document.getElementById('accel-x').textContent = accelerometer.x.toFixed(2);
        document.getElementById('accel-y').textContent = accelerometer.y.toFixed(2);
        document.getElementById('accel-z').textContent = accelerometer.z.toFixed(2);
      });
      accelerometer.start();
    } catch (error) {
      console.log('Accelerometer not available:', error);
    }
  }
}

/**
 * Start orientation event listener
 */
function startOrientationListener() {
  window.addEventListener('deviceorientation', (event) => {
    const alpha = document.getElementById('orient-alpha');
    if (alpha && event.alpha !== null) {
      alpha.textContent = Math.round(event.alpha);
    }
  });
}

/**
 * Update sensor status indicator
 */
function updateSensorStatus(active) {
  const statusEl = document.getElementById('sensor-status');
  const stateEl = document.getElementById('sensor-state');

  if (statusEl) statusEl.dataset.active = active;
  if (stateEl) stateEl.textContent = active ? 'On' : 'Off';

  appState.setState({ sensorEnabled: active });
}

/**
 * 3D Demo - Full Three.js implementation
 */
async function load3DDemo(container) {
  // Dispose previous Three.js instance
  if (threeInstance) {
    threeInstance.dispose();
    threeInstance = null;
  }

  container.innerHTML = `
    <div class="demo-content">
      <h2>3D Visualization with Three.js</h2>
      <p>Interactive 3D charts. Drag to rotate, scroll to zoom, touch gestures on mobile.</p>

      <div class="chart-type-selector" style="margin-bottom: 1rem;">
        <div class="button-group">
          <button class="btn active" data-3d-type="bar">3D Bar</button>
          <button class="btn" data-3d-type="scatter">3D Scatter</button>
          <button class="btn" data-3d-type="surface">3D Surface</button>
          <button class="btn" data-3d-type="network">3D Network</button>
          <button class="btn" data-3d-type="pie">3D Pie</button>
        </div>
      </div>

      <div id="threejs-container" style="width: 100%; height: 450px; background: #1a1a2e; border-radius: 8px; overflow: hidden;"></div>

      <div class="help-panel" style="margin-top: 1rem;">
        <h4>Controls</h4>
        <ul>
          <li><span class="command">Drag</span> Rotate view</li>
          <li><span class="command">Scroll</span> Zoom in/out</li>
          <li><span class="command">Double-click</span> Reset view</li>
          <li><span class="command">Touch pinch</span> Zoom (mobile)</li>
        </ul>
      </div>
    </div>
  `;

  const threeContainer = document.getElementById('threejs-container');

  // Initialize with 3D Bar Chart
  create3DChart('bar', threeContainer);

  // Chart type selector buttons
  document.querySelectorAll('[data-3d-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      const chartType = btn.dataset['3dType'];

      // Update button states
      document.querySelectorAll('[data-3d-type]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Create new chart
      create3DChart(chartType, threeContainer);
      showFeedback(`3D Chart: ${chartType}`);
      announceToScreenReader(`Changed to 3D ${chartType} chart`);
    });
  });
}

/**
 * Create a 3D chart of the specified type
 */
function create3DChart(type, container) {
  // Dispose previous instance
  if (threeInstance) {
    threeInstance.dispose();
    threeInstance = null;
  }

  // Clear container
  container.innerHTML = '';

  switch (type) {
    case 'bar':
      threeInstance = new BarChart3D(container, {
        title: 'Monthly Sales 2025',
        labels: sampleData.categoryData.labels,
        values: sampleData.categoryData.values
      });
      break;

    case 'scatter':
      threeInstance = new ScatterPlot3D(container, {
        title: 'Performance vs Engagement',
        data: sampleData.scatterData.data.map(d => [...d, Math.random() * 10])
      });
      break;

    case 'surface':
      threeInstance = new SurfacePlot3D(container, {
        title: 'Mathematical Surface'
      });
      break;

    case 'network':
      threeInstance = new NetworkGraph3D(container, null); // Uses generated sample data
      break;

    case 'pie':
      threeInstance = new PieChart3D(container, {
        title: 'Market Share 2025',
        data: sampleData.marketShare.data
      });
      break;

    default:
      threeInstance = new BarChart3D(container, {
        title: 'Sales Data',
        labels: sampleData.categoryData.labels,
        values: sampleData.categoryData.values
      });
  }
}

/**
 * Multimodal Demo - placeholder for Phase 7
 */
async function loadMultimodalDemo(container) {
  container.innerHTML = `
    <div class="demo-content">
      <h2>Multimodal Control Demo</h2>
      <p>Combine voice, gesture, and sensor controls for the ultimate interactive experience.</p>

      <div class="demo-layout-split">
        <div class="chart-section">
          <div id="multimodal-chart" class="chart-container" role="img" aria-label="Multimodal-controlled chart"></div>
        </div>
        <div class="control-section">
          <div class="help-panel">
            <h4>Available Controls</h4>
            <p style="font-size: 0.875rem; margin-bottom: 0.5rem;">
              All control methods work simultaneously:
            </p>
            <ul>
              <li><span class="command">Voice</span> Speak commands</li>
              <li><span class="command">Gestures</span> Hand signals</li>
              <li><span class="command">Sensors</span> Device motion</li>
              <li><span class="command">Touch/Mouse</span> Traditional</li>
            </ul>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <button class="btn" id="btn-enable-all">Enable All Controls</button>
            <button class="btn" id="btn-disable-all">Disable All Controls</button>
          </div>

          <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin-top: 1rem;">
            Full multimodal integration will be implemented in Phase 7.
          </p>
        </div>
      </div>
    </div>
  `;

  // Initialize chart
  const chartContainer = document.getElementById('multimodal-chart');
  const theme = appState.getState().theme;
  chartInstance = echarts.init(chartContainer, theme === 'dark' ? 'dark' : null);
  renderCurrentChart();

  // Placeholder button handlers
  document.getElementById('btn-enable-all')?.addEventListener('click', () => {
    showFeedback('Multimodal controls will be available in Phase 7');
  });

  document.getElementById('btn-disable-all')?.addEventListener('click', () => {
    showFeedback('Multimodal controls will be available in Phase 7');
  });
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Export for potential module usage
export { appState, eventBus, changeChartType, navigateDataset, resetVisualization };
