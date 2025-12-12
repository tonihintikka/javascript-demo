# Modern JavaScript Effects 2025

Interactive demo environment showcasing modern JavaScript-based UI effects and trends for 2025. Based on the analysis "JavaScript Effects and Trends 2025".

🌐 **Live Demo**: [https://javascript-demo-henna.vercel.app](https://javascript-demo-henna.vercel.app)

![Demo Preview](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-0.7.0-blue)
![Node](https://img.shields.io/badge/Node-18+-green)
![Deploy](https://img.shields.io/badge/Deployed-Vercel-black)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open browser at: **http://localhost:3000**

Or try the live demo: **[javascript-demo-henna.vercel.app](https://javascript-demo-henna.vercel.app)**

## 📋 Contents

### Landing Page (index.html)

Modern landing page showcasing all demos interactively:

- **Hero Section**: 3D particle system (Three.js) + glassmorphism
- **Scrollytelling Intro**: Animated statistics and scroll-reveal effects
- **Bento Grid**: 7 effect categories as interactive cards
- **Live Previews**: Each card shows the effect live

### 7 Effect Categories

#### 1. WebGPU & 3D Rendering
- Three.js WebGPU renderer
- 3D visualizations (bar, scatter, surface, network, pie charts)
- TSL (Three.js Shading Language)
- GPU-accelerated rendering

#### 2. Scrollytelling 2.0
- GSAP ScrollTrigger
- Data-driven storytelling
- ECharts integration
- Progressive disclosure

#### 3. Glassmorphism 2.0
- CSS backdrop-filter
- Physically plausible materials
- Depth layering
- Light refraction effects

#### 4. Fluid Shapes (Fluid Motion)
- Liquid distortion shader
- Mouse-reactive effects
- Animated blobs
- Velocity-based warping

#### 5. View Transitions API
- Seamless state transitions
- Bento Grid layout
- Object permanence
- Native browser transitions

#### 6. Micro-interactions & Predictive UI
- Magnetic buttons
- Intent detection
- Smart prefetching
- Cursor following

#### 7. Text Animations
- GSAP SplitText
- Character-by-character reveals
- Text morphing
- Gradient animations

### Legacy Demos (demos.html)

Preserved original demos:
- **Voice Control**: Web Speech API
- **Gesture Control**: MediaPipe hand tracking
- **Sensor Control**: Generic Sensor API
- **3D Visualization**: Three.js visualizations
- **Multimodal**: All combined

## 🛠 Technologies

### Core
- **Vite** 6.0.3 - Build tool & dev server
- **Three.js** 0.170.0 - 3D graphics
- **ECharts** 5.5.1 - 2D charts

### APIs & Features
- **WebGPU** - GPU-accelerated graphics
- **View Transitions API** - Smooth page transitions
- **Intersection Observer** - Scroll animations
- **Web Speech API** - Voice control
- **MediaPipe** - Gesture recognition
- **Generic Sensor API** - Device sensors

### Planned Libraries
- **GSAP** - Advanced animations & scrollytelling
- **React Three Fiber** (optional) - Declarative 3D

## 🌐 Internationalization (i18n)

The application supports Finnish and English with a modular translation architecture:

- **Language Switch**: FI/EN button in the top right corner
- **Auto-save**: Language preference persists in localStorage
- **Lazy loading**: Only required translations are loaded

### Translation Structure
```
locales/
├── fi/
│   ├── common.json           # Nav, footer, common UI
│   ├── landing.json          # Homepage
│   ├── glassmorphism.json
│   ├── fluid-motion.json
│   ├── scrollytelling.json
│   ├── micro-interactions.json
│   ├── view-transitions.json
│   ├── text-animations.json
│   └── webgpu-3d.json
└── en/
    └── (same structure)
```

## 📁 Project Structure

```
demos_from new javascript posibilities/
├── index.html                 # Landing page
├── demos.html                 # Legacy demo interface
├── package.json
├── vite.config.js
├── README.md
├── CHANGELOG.md
├── PLAN.md
│
├── css/
│   ├── landing.css           # Landing page styles (glassmorphism, Bento Grid)
│   ├── demo-shared.css       # Shared demo styles
│   └── styles.css            # Demo page styles
│
├── js/
│   ├── landing.js            # Landing page interactivity
│   ├── main.js               # Demo page logic
│   ├── utils.js              # Utilities
│   ├── i18n.js               # Internationalization module
│   └── three/                # Three.js visualizations
│       ├── index.js
│       ├── ThreeVisualization.js
│       ├── BarChart3D.js
│       ├── ScatterPlot3D.js
│       ├── SurfacePlot3D.js
│       ├── NetworkGraph3D.js
│       └── PieChart3D.js
│
├── demos/                    # Individual demo pages
│   ├── glassmorphism.html
│   ├── fluid-motion.html
│   ├── scrollytelling.html
│   ├── micro-interactions.html
│   ├── view-transitions.html
│   ├── text-animations.html
│   └── webgpu-3d.html
│
├── locales/                  # Translations
│   ├── fi/                   # Finnish (modular)
│   ├── en/                   # English (modular)
│   ├── fi.json               # Finnish (legacy)
│   └── en.json               # English (legacy)
│
├── data/
│   └── sample-data.json      # Demo data
│
└── tests/                    # Test suite
    ├── setup.js
    ├── unit/                 # Unit tests
    └── e2e/                  # E2E tests
```

## 🎨 Landing Page Features

### Glassmorphism
- Backdrop blur + saturation
- Multi-layer depth effects
- Hover transformations
- Light refraction simulation

### 3D Particle Background
- 1000 particles with color gradients
- Mouse-reactive rotation
- Additive blending
- Optimized performance

### Bento Grid Layout
- Responsive 12-column grid
- Asymmetric card sizes
- Smooth hover effects
- Mouse tracking spotlight

### Scroll Animations
- Intersection Observer API
- Fade-in & slide-up reveals
- Counter animations
- Threshold-based triggers

### Accessibility
- ✅ `prefers-reduced-motion` support
- ✅ High contrast mode
- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Focus-visible states
- ✅ Mobile-first responsive

## 🌐 Browser Support

| Browser | Desktop | Mobile | Notes |
|---------|---------|--------|-------|
| Chrome | ✅ Full | ✅ Full | Best support for all features |
| Edge | ✅ Full | ✅ Full | Chromium-based |
| Firefox | ✅ Full | ⚠️ Limited | Web Speech API limited |
| Safari | ⚠️ Partial | ⚠️ Partial | WebGPU support added in 2024 |

### Required Features
- WebGL 2.0 or WebGPU
- ES6+ JavaScript
- CSS Custom Properties
- Intersection Observer API

## ⚡ Performance

### Optimizations
- **On-demand rendering**: Render loop stops when no changes
- **Reduced particle count**: 1000 particles (optimized for mobile)
- **Lazy loading**: Demos loaded only when needed
- **Debounced events**: Resize & scroll handlers optimized
- **Automatic quality scaling**: Adapts to device capabilities

### Performance Metrics (targets)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- 60 FPS animations (desktop)
- 30+ FPS animations (mobile)

## 🧪 Development

### Dev Server
```bash
npm run dev
# → http://localhost:3000
```

### Build
```bash
npm run build
# → dist/
```

### Run Tests
```bash
npm run test        # Watch mode
npm run test:run    # Single run
```

### Preview Production Build
```bash
npm run preview
```

## 📚 Documentation

Additional documentation available:
- `PLAN.md` - Original plan
- `CHANGELOG.md` - Change log
- `TODO.md` - Task list
- `PLAN-i18n.md` - Internationalization plan

## 🎯 Roadmap

### Version 0.7.0 ✅ (Current)
- [x] Modular i18n architecture (FI/EN)
- [x] Language toggle button
- [x] Lazy loading for translations
- [x] Translations for all 7 demos

### Version 0.6.0 ✅
- [x] WebGPU & 3D Demo
- [x] Shared demo CSS
- [x] Post-processing effects

### Version 0.5.0 ✅
- [x] View Transitions API demo
- [x] Text animations demo

### Version 0.4.0 ✅
- [x] Glassmorphism playground
- [x] Fluid distortion shader demo
- [x] Scrollytelling demo
- [x] Micro-interactions demo

### Version 0.8.0 (Planned)
- [ ] Demo pages i18n data-attributes
- [ ] AI-assisted generative UI
- [ ] WebXR/VR support
- [ ] Performance optimizations

## 🤝 Contributing

This project is for demo purposes. Forks & PRs are welcome!

### Development Guidelines
1. Use ES6+ modules
2. Follow accessibility best practices
3. Test in all major browsers
4. Optimize for performance (60 FPS target)
5. Update CHANGELOG.md

## 📄 License

MIT License - Free to use and modify

## 🙏 Acknowledgments

- **Three.js** - Excellent 3D library
- **ECharts** - Powerful charting library
- **Vite** - Fast build tool
- **PDF "JavaScript Effects and Trends 2025"** - Inspiration and design

---

**Developer**: Toni Hintikka  
**GitHub**: [tonihintikka/javascript-demo](https://github.com/tonihintikka/javascript-demo)  
**Live Demo**: [javascript-demo-henna.vercel.app](https://javascript-demo-henna.vercel.app)  
**Version**: 0.7.0  
**Updated**: December 2025
