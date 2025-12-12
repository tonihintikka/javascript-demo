# Changelog

All notable changes to the JavaScript Visualization Demo 2025 project.

## [0.3.0] - 2025-12-12

### Added
- **New Landing Page** (`index.html`)
  - Hero section with glassmorphic design and 3D particle background
  - Scrollytelling introduction with animated statistics
  - Bento Grid layout for demo showcase
  - 7 effect categories based on "JavaScript-efektit ja trendit 2025" PDF
  - Animated blob backgrounds
  - Summary section with best practices

- **Landing Page Styles** (`css/landing.css`)
  - Modern dark theme with glassmorphism effects
  - CSS custom properties for theming
  - Responsive Bento Grid layout (12-column system)
  - Card hover effects with mouse tracking
  - Smooth animations and transitions
  - Accessibility: `prefers-reduced-motion`, high contrast mode
  - Mobile-first responsive design

- **Landing Page JavaScript** (`js/landing.js`)
  - **ParticleBackground**: Three.js 3D particle system with mouse interaction
  - **ScrollReveal**: Intersection Observer for scroll-triggered animations
  - **CounterAnimation**: Animated number counting for statistics
  - **MagneticButton**: Cursor-following magnetic button effect
  - **DemoCards**: Mouse tracking for card hover effects
  - **CardPreviews**:
    - Live 3D preview (rotating torus)
    - Fluid wave animation (Canvas 2D)
    - Scrollytelling bar chart preview
  - **CursorFollower**: Custom cursor with smooth easing
  - Smooth scroll for anchor links
  - Performance monitoring in development mode

- **Project Restructure**
  - Renamed old `index.html` → `demos.html` (preserves existing demos)
  - New `index.html` serves as modern landing page
  - Clear separation: Landing page → Individual demo pages

### Technical Details
- **7 Effect Categories** (from PDF analysis):
  1. WebGPU & 3D-renderöinti (Three.js, WebGPU, TSL)
  2. Scrollytelling 2.0 (GSAP, ECharts)
  3. Glassmorphism 2.0 (CSS Backdrop, Shaders)
  4. Nestemäiset muodot (WebGL, Shaders)
  5. View Transitions (View Transitions API)
  6. Mikrointeraktiot (Intent Detection)
  7. Tekstianimaatiot (GSAP SplitText)
  8. +3 Legacy demos (Voice, Gesture, Sensors)

- All effects respect `prefers-reduced-motion`
- Optimized performance: reduced particle count, on-demand rendering
- Modular JavaScript architecture with ES6 classes

### Changed
- Old demo interface moved from `index.html` to `demos.html`
- Landing page now serves as primary entry point

## [0.2.0] - 2025-12-11

### Added
- **Three.js 3D Visualizations Module** (`js/three-visualizations.js`)
  - `BarChart3D` - 3D bar chart with animated growth, shadows, labels
  - `ScatterPlot3D` - 3D scatter plot with color-coded points, axes
  - `SurfacePlot3D` - Mathematical surface visualization with color gradient
  - `NetworkGraph3D` - 3D network/graph visualization with nodes and edges
  - `PieChart3D` - 3D pie chart with cylinder segments
  - Base `ThreeVisualization` class with:
    - OrbitControls for mouse/touch interaction
    - Professional lighting setup (ambient, directional, fill, rim)
    - Shadow mapping
    - Responsive resize handling
    - Animation loop

- **3D Demo Integration** in main.js
  - Chart type selector buttons (Bar, Scatter, Surface, Network, Pie)
  - Proper instance lifecycle management (create/dispose)
  - Data integration with sample-data.json

### Technical Details
- All 3D charts support:
  - Drag to rotate
  - Scroll to zoom
  - Touch gestures on mobile
  - Auto-resize on window change
  - Proper cleanup/disposal

## [0.1.0] - 2025-12-11

### Added
- **Project Foundation**
  - Vite development server configuration
  - package.json with ECharts 5.5.1 and Three.js 0.170.0
  - Responsive HTML layout with demo navigation
  - CSS with dark/light theme support
  - Accessibility features (ARIA, keyboard navigation, screen reader support)

- **ECharts 2D Visualizations**
  - Line chart with multiple series
  - Bar chart with categories
  - Pie chart (donut style)
  - Interactive tooltips and zoom
  - Theme switching support

- **Voice Control (Web Speech API)**
  - Commands: "next", "previous", "bar", "line", "pie", "reset"
  - Visual transcript display
  - Browser compatibility detection

- **Demo Structure**
  - 6 demo sections: Basic Charts, Voice, Gesture, Sensor, 3D, Multimodal
  - Navigation with active state
  - Status bar for control indicators
  - Data table modal for accessibility

- **Utility Functions** (`js/utils.js`)
  - Feature detection
  - Debounce/throttle
  - State management
  - Event emitter
  - Feedback/announcements

### Files Created
```
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── PLAN.md
├── CHANGELOG.md
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   ├── utils.js
│   └── three-visualizations.js
└── data/
    └── sample-data.json
```

---

## Project Status

### Completed
- [x] Phase 1: Project foundation (Vite, HTML, CSS)
- [x] Phase 2: ECharts basic visualizations
- [x] Phase 3: Voice control (basic)
- [x] Phase 6: Three.js 3D visualizations (fully integrated)

### Pending
- [ ] Phase 4: MediaPipe gesture recognition
- [ ] Phase 5: Device sensor control
- [ ] Phase 7: Multimodal combined demo
- [ ] Phase 8: Polish and documentation

---

## Next Steps for AI/Developer

1. **Implement gesture control** - Add MediaPipe hand tracking to gesture demo
2. **Implement sensor control** - Add accelerometer/gyroscope for 3D view rotation
3. **Create multimodal demo** - Combine all control methods
4. **Polish** - Accessibility audit, cross-browser testing

## How to Run

```bash
cd "demos_from new javascript posibilities"
npm install
npm run dev
# Opens http://localhost:3000
```

## Technologies Used

- **Vite** - Build tool and dev server
- **ECharts** - 2D chart library
- **Three.js** - 3D graphics library
- **Web Speech API** - Voice recognition
- **MediaPipe** - Gesture recognition (planned)
- **Generic Sensor API** - Device sensors (planned)
