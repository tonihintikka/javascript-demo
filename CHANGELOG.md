# Changelog

All notable changes to the JavaScript Visualization Demo 2025 project.

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
