# JavaScript Visualization Demo 2025

Interactive data visualization demos showcasing modern JavaScript trends including voice control, gesture recognition, and sensor integration.

## Features

- **Basic Charts** - ECharts visualizations with tooltips, zoom, and animations
- **Voice Control** - Web Speech API for hands-free chart navigation
- **Gesture Control** - Camera-based hand gesture recognition (MediaPipe)
- **Sensor Control** - Device accelerometer and gyroscope integration
- **3D Visualization** - Three.js powered 3D charts
- **Multimodal** - Combined control methods for ultimate interaction

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Browser Support

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome | Full | Full (Android) |
| Edge | Full | Full |
| Firefox | Partial* | Limited |
| Safari | Limited | Limited (iOS) |

*Web Speech API not fully supported in Firefox

## Requirements

- Node.js 18+
- Modern browser with WebGL support
- Camera access (for gesture demo)
- Microphone access (for voice demo)
- Device with sensors (for sensor demo - mobile recommended)

## Project Structure

```
├── index.html          # Main HTML page
├── css/
│   └── styles.css      # Styles with dark/light theme
├── js/
│   ├── main.js         # Application entry point
│   ├── utils.js        # Utility functions
│   └── three/          # Modular 3D visualizations
│       ├── index.js              # Re-exports all charts
│       ├── ThreeVisualization.js # Base class
│       ├── BarChart3D.js
│       ├── ScatterPlot3D.js
│       ├── SurfacePlot3D.js
│       ├── NetworkGraph3D.js
│       └── PieChart3D.js
├── data/
│   └── sample-data.json # Demo data
├── package.json
└── vite.config.js
```

## Voice Commands

| Command | Action |
|---------|--------|
| "next" | Next dataset |
| "previous" | Previous dataset |
| "bar" | Bar chart |
| "line" | Line chart |
| "pie" | Pie chart |
| "reset" | Reset view |

## Keyboard Shortcuts

- `Tab` - Navigate between elements
- `Enter/Space` - Activate buttons
- Arrow keys - Navigate chart data points

## Accessibility

- WCAG 2.1 AA compliant
- Screen reader support with ARIA labels
- High contrast mode support
- Reduced motion support
- Keyboard navigation for all features
- Data table alternative for charts

## License

MIT
