# JavaScript Visualization Demo Environment 2025

## Executive Summary

This plan describes building a local demo environment showcasing 2025 JavaScript visualization trends and new interactive control methods (voice, gestures, sensors). The environment will run entirely locally without mandatory cloud dependencies.

---

## 1. Project Structure

```
demos_from new javascript posibilities/
├── index.html              # Main page - demo launcher
├── css/
│   └── styles.css          # Shared styles
├── js/
│   ├── main.js             # Main logic and navigation
│   ├── voice-control.js    # Web Speech API integration
│   ├── gesture-control.js  # MediaPipe gesture recognition
│   ├── sensor-control.js   # Generic Sensor API
│   └── utils.js            # Helper functions
├── demos/
│   ├── 01-basic-charts/    # Basic visualizations (ECharts)
│   ├── 02-voice-demo/      # Voice-controlled chart
│   ├── 03-gesture-demo/    # Gesture-controlled visualization
│   ├── 04-sensor-demo/     # Sensor data visualization
│   ├── 05-3d-visualization/# Three.js 3D demo
│   └── 06-multimodal/      # All control methods combined
├── data/
│   └── sample-data.json    # Sample data
├── assets/
│   ├── models/             # MediaPipe models (local)
│   └── icons/              # UI icons
├── package.json            # NPM dependencies
└── README.md               # Documentation
```

---

## 2. Technology Stack

### 2.1 Core Technologies
| Technology | Purpose | Version |
|------------|---------|---------|
| HTML5/CSS3/ES6+ | Foundation | - |
| ECharts | 2D visualizations | 5.5.x |
| Three.js | 3D visualizations | r160+ |
| MediaPipe Tasks Vision | Gesture recognition | 0.10.x |
| Web Speech API | Speech recognition | Native |
| Generic Sensor API | Device sensors | Native |

### 2.2 Development Tools
| Tool | Purpose |
|------|---------|
| Vite | Dev server (fast HMR, HTTPS support) |
| ESLint | Code quality |
| Prettier | Code formatting |

---

## 3. Demos to Implement

### Demo 1: Basic Visualizations (ECharts)
**Location:** `demos/01-basic-charts/`

**Content:**
- Line chart (time series data)
- Bar chart (categorical data)
- Pie chart (proportions)
- Heatmap (matrix data)

**Features:**
- Interactive tooltips
- Zoom and pan
- Animated transitions
- Responsive sizing

**Code Example:**
```javascript
const chart = echarts.init(document.getElementById('chart'));
const option = {
  title: { text: 'Sales Data 2025' },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', ...] },
  yAxis: { type: 'value' },
  series: [{
    data: [820, 932, 901, ...],
    type: 'line',
    smooth: true,
    animationDuration: 1000
  }]
};
chart.setOption(option);
```

---

### Demo 2: Voice-Controlled Visualization
**Location:** `demos/02-voice-demo/`

**Supported Commands:**
| Command | Action |
|---------|--------|
| "next" | Switch to next dataset |
| "previous" | Switch to previous dataset |
| "bar" / "bar chart" | Change to bar chart |
| "line" / "line chart" | Change to line chart |
| "pie" / "pie chart" | Change to pie chart |
| "zoom in" | Zoom in |
| "zoom out" | Zoom out |
| "reset" | Reset to initial state |

**Code Example:**
```javascript
// voice-control.js
class VoiceControl {
  constructor(options = {}) {
    this.recognition = new (window.SpeechRecognition ||
                            window.webkitSpeechRecognition)();
    this.recognition.lang = options.lang || 'en-US';
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.commands = new Map();
  }

  registerCommand(phrases, callback) {
    phrases.forEach(phrase => this.commands.set(phrase.toLowerCase(), callback));
  }

  start() {
    this.recognition.start();
    this.recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0]
                              .transcript.toLowerCase().trim();
      for (const [phrase, callback] of this.commands) {
        if (transcript.includes(phrase)) {
          callback(transcript);
          this.showFeedback(`Command: ${phrase}`);
          break;
        }
      }
    };
  }

  showFeedback(message) {
    // Visual and ARIA feedback
  }
}
```

**Accessibility:**
- Visual indicator for listening state
- ARIA live region for command confirmation
- Keyboard alternatives for all commands

---

### Demo 3: Gesture-Controlled Visualization
**Location:** `demos/03-gesture-demo/`

**Supported Gestures (MediaPipe):**
| Gesture | Action |
|---------|--------|
| Thumbs Up | Approve / Next |
| Thumbs Down | Reject / Previous |
| Victory (Peace) | Switch view |
| Open Palm | Pause/Play animation |
| Closed Fist | Reset |
| Pointing Up | Zoom in |

**Code Example:**
```javascript
// gesture-control.js
import { GestureRecognizer, FilesetResolver } from '@mediapipe/tasks-vision';

class GestureControl {
  constructor() {
    this.recognizer = null;
    this.video = null;
    this.lastGesture = null;
    this.gestureThreshold = 5; // Consecutive frames
    this.gestureCount = 0;
  }

  async init(videoElement) {
    this.video = videoElement;
    const vision = await FilesetResolver.forVisionTasks(
      './assets/models/wasm'  // Local path
    );
    this.recognizer = await GestureRecognizer.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: './assets/models/gesture_recognizer.task',
        delegate: 'GPU'
      },
      runningMode: 'VIDEO',
      numHands: 1
    });
  }

  async startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 }
    });
    this.video.srcObject = stream;
    await this.video.play();
    this.detectLoop();
  }

  detectLoop() {
    const results = this.recognizer.recognizeForVideo(
      this.video,
      performance.now()
    );

    if (results.gestures.length > 0) {
      const gesture = results.gestures[0][0].categoryName;
      this.handleGesture(gesture);
    }

    requestAnimationFrame(() => this.detectLoop());
  }

  handleGesture(gesture) {
    if (gesture === this.lastGesture) {
      this.gestureCount++;
      if (this.gestureCount >= this.gestureThreshold) {
        this.triggerAction(gesture);
        this.gestureCount = 0;
      }
    } else {
      this.lastGesture = gesture;
      this.gestureCount = 1;
    }
  }
}
```

**Performance Optimizations:**
- Web Worker for separate thread
- GPU delegation enabled
- Camera resolution 640x480 (sufficient for gestures)
- Throttle: analyze max 30 fps

---

### Demo 4: Sensor Data Visualization
**Location:** `demos/04-sensor-demo/`

**Utilized Sensors:**
| Sensor | Data | Use Case |
|--------|------|----------|
| Accelerometer | x, y, z acceleration | Shake detection, tilt control |
| Gyroscope | alpha, beta, gamma | Rotation, orientation |
| AbsoluteOrientationSensor | Quaternion | 3D view control |
| AmbientLightSensor | lux | Automatic theme switching |

**Features:**
1. **Real-time sensor data visualization** - Acceleration x/y/z as time series
2. **Tilt control** - Phone tilt affects chart angle
3. **Shake to reset** - Acceleration change triggers reset
4. **Automatic dark mode** - AmbientLightSensor switches theme

**Code Example:**
```javascript
// sensor-control.js
class SensorControl {
  constructor() {
    this.accelerometer = null;
    this.gyroscope = null;
    this.shakeThreshold = 15;
    this.lastShake = 0;
  }

  async init() {
    // Check support and request permissions
    if (!('Accelerometer' in window)) {
      throw new Error('Accelerometer not supported');
    }

    try {
      const permission = await navigator.permissions.query({
        name: 'accelerometer'
      });
      if (permission.state === 'denied') {
        throw new Error('Accelerometer permission denied');
      }
    } catch (e) {
      // Browser doesn't support permissions query for sensors
    }

    this.accelerometer = new Accelerometer({ frequency: 60 });
    this.accelerometer.addEventListener('error', this.handleError.bind(this));
  }

  startShakeDetection(callback) {
    let lastX = 0, lastY = 0, lastZ = 0;

    this.accelerometer.addEventListener('reading', () => {
      const { x, y, z } = this.accelerometer;
      const delta = Math.abs(x - lastX) + Math.abs(y - lastY) + Math.abs(z - lastZ);

      if (delta > this.shakeThreshold && Date.now() - this.lastShake > 1000) {
        this.lastShake = Date.now();
        callback();
      }

      lastX = x; lastY = y; lastZ = z;
    });

    this.accelerometer.start();
  }

  handleError(event) {
    if (event.error.name === 'NotAllowedError') {
      this.showPermissionDialog();
    } else if (event.error.name === 'NotReadableError') {
      console.log('Sensor not available on this device');
    }
  }
}
```

**Desktop Fallbacks:**
- Mouse movement simulates tilt
- Keyboard commands replace shake

---

### Demo 5: 3D Visualization (Three.js)
**Location:** `demos/05-3d-visualization/`

**Content:**
- 3D bar chart
- Point cloud (3D scatter plot)
- Interactive rotation and zoom

**Code Example:**
```javascript
// three-visualization.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class ThreeVisualization {
  constructor(container) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75,
      container.clientWidth / container.clientHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.z = 5;
  }

  createBarChart3D(data) {
    const group = new THREE.Group();
    data.forEach((value, index) => {
      const geometry = new THREE.BoxGeometry(0.8, value, 0.8);
      const material = new THREE.MeshPhongMaterial({
        color: this.getColor(index)
      });
      const bar = new THREE.Mesh(geometry, material);
      bar.position.x = index * 1.2 - (data.length * 0.6);
      bar.position.y = value / 2;
      group.add(bar);
    });
    this.scene.add(group);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
```

**Sensor Control (Mobile):**
- DeviceOrientationEvent controls camera angle
- User "looks around" by moving the phone

---

### Demo 6: Multimodal Combined Demo
**Location:** `demos/06-multimodal/`

**Combines All Control Methods:**
- Voice: Issue commands
- Gestures: Control navigation
- Sensors: Change perspective
- Touch/mouse: Traditional interaction

**User Interface Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  [Voice: ON]  [Gestures: ON]  [Sensors: ON]            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    VISUALIZATION                        │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Status: "Command recognized: next"                     │
│  [Show as Table] [Help] [Settings]                      │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Accessibility (WCAG 2.1 AA)

### 4.1 Features to Implement

| Requirement | Implementation |
|-------------|----------------|
| Alt text | aria-label and long description for each chart |
| Keyboard navigation | All functions accessible via Tab + Enter |
| Color contrast | Minimum 4.5:1 for text |
| Color blindness | Differentiate by shape, not just color |
| Screen reader support | ARIA live regions for commands |
| Data table | "Show as table" button displays data as text |
| Alternative controls | Each special control + basic button |

### 4.2 ARIA Example
```html
<div id="chart-container"
     role="img"
     aria-label="Line chart: Monthly sales 2025"
     aria-describedby="chart-description">
</div>
<div id="chart-description" class="sr-only">
  Chart displays sales data from January to December.
  Highest value in July (1245), lowest in February (820).
  Use Tab key to navigate data points.
</div>
<div aria-live="polite" id="status-announcer" class="sr-only"></div>
```

---

## 5. Development Environment Setup

### 5.1 Requirements
- Node.js 18+
- npm or pnpm
- Modern browser (Chrome 90+, Edge 90+, Firefox 90+)

### 5.2 Installation
```bash
# Navigate to project directory
cd "demos_from new javascript posibilities"

# Initialize npm project
npm init -y

# Install dependencies
npm install vite echarts three @mediapipe/tasks-vision

# Install dev dependencies
npm install -D eslint prettier

# Start development server
npm run dev
```

### 5.3 package.json
```json
{
  "name": "js-visualization-demo-2025",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint js/**/*.js"
  },
  "dependencies": {
    "echarts": "^5.5.0",
    "three": "^0.160.0",
    "@mediapipe/tasks-vision": "^0.10.8"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "eslint": "^8.56.0",
    "prettier": "^3.2.0"
  }
}
```

### 5.4 vite.config.js
```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    https: false, // localhost is sufficient for most APIs
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
```

---

## 6. MediaPipe Models Local Setup

For fully offline operation:

```bash
# Download MediaPipe WASM files
mkdir -p assets/models/wasm
cd assets/models

# Download gesture recognizer model
curl -O https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/latest/gesture_recognizer.task

# Download WASM files (vision tasks)
cd wasm
curl -O https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm/vision_wasm_internal.js
curl -O https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm/vision_wasm_internal.wasm
```

---

## 7. Testing

### 7.1 Browser Testing
| Browser | Desktop | Mobile | Notes |
|---------|---------|--------|-------|
| Chrome | Full | Full (Android) | Best support for all APIs |
| Edge | Full | Full | Chromium-based |
| Firefox | Full | Limited | Web Speech API limited |
| Safari | Limited | Limited (iOS) | Sensors require settings |

### 7.2 Test Cases
1. **Voice commands:** Test all commands in quiet and noisy environments
2. **Gestures:** Test with different lighting and distances
3. **Sensors:** Test phone in portrait and landscape modes
4. **Accessibility:** Test with screen readers (VoiceOver/NVDA)
5. **Responsiveness:** Test from 320px to 4K resolutions

---

## 8. Implementation Order

### Phase 1: Foundation (est. 2-3 hours)
1. Project structure and package.json
2. Basic HTML template
3. CSS styles (dark/light theme)
4. Vite dev server configuration

### Phase 2: ECharts Basic Demos (est. 2-3 hours)
1. ECharts integration
2. Sample data
3. Basic charts (line, bar, pie)
4. Interactivity (tooltip, zoom)

### Phase 3: Voice Control (est. 2-3 hours)
1. Web Speech API integration
2. Command registration
3. Visual feedback
4. Fallback buttons

### Phase 4: Gesture Control (est. 3-4 hours)
1. MediaPipe integration
2. Camera handling
3. Gesture recognition
4. Action binding

### Phase 5: Sensor Control (est. 2-3 hours)
1. Generic Sensor API integration
2. Shake detection
3. Tilt control
4. Desktop fallbacks

### Phase 6: 3D Demo (est. 2-3 hours)
1. Three.js integration
2. 3D bar chart
3. Sensor-based camera control
4. OrbitControls as fallback

### Phase 7: Multimodal Combination (est. 2-3 hours)
1. Combining all control methods
2. State management
3. UI indicators
4. Settings panel

### Phase 8: Polish (est. 2-3 hours)
1. Accessibility audit
2. Documentation
3. Cross-device testing
4. Optimization

---

## 9. Known Limitations and Workarounds

| Limitation | Workaround |
|------------|------------|
| Web Speech API not in Firefox | Show warning, provide buttons |
| iOS Safari requires HTTPS for sensors | Use localhost or generate certificate |
| MediaPipe requires GPU | Check WebGL support, provide lighter version |
| Sensors missing on desktop | Simulate with mouse/keyboard |
| Voice control affected by noise | Adjust confidence threshold, visual confirmation |

---

## 10. Future Enhancement Ideas

1. **AI Integration:** ChatGPT/Claude API for data analysis and explanation
2. **WebXR:** VR/AR view for visualizations
3. **PWA:** Offline capability, installability
4. **Collaboration:** WebSocket-based shared views
5. **Data Import:** CSV/Excel file upload support

---

## Summary

This plan covers building a comprehensive demo environment showcasing:

1. **Modern visualization techniques** (ECharts, Three.js)
2. **New control methods** (voice, gestures, sensors)
3. **Accessibility** (WCAG 2.1 AA compliance)
4. **Local operation** (no mandatory cloud services)

Estimated total implementation time: 17-25 hours, depending on detail level.

**Next Step:** Approve this plan and begin implementation phase by phase.
