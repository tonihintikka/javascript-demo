# Modernit JavaScript-efektit 2025

Interaktiivinen demoympäristö, joka esittelee moderneja JavaScript-pohjaisia käyttöliittymäefektejä ja trendejä 2025. Perustuu analyysiin "Javascript-efektit ja trendit 2025".

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

Avaa selain osoitteessa: **http://localhost:3000**

Tai kokeile live-demoa: **[javascript-demo-henna.vercel.app](https://javascript-demo-henna.vercel.app)**

## 📋 Sisältö

### Landing Page (index.html)

Moderni landing page, joka esittelee kaikki demot interaktiivisesti:

- **Hero Section**: 3D-partikkelijärjestelmä (Three.js) + glassmorphism
- **Scrollytelling Intro**: Animoidut tilastot ja scroll-reveal efektit
- **Bento Grid**: 7 efektikategoriaa interaktiivisina kortteina
- **Live Previews**: Jokainen kortti näyttää efektin livenä

### 7 Efektikategoriaa

#### 1. WebGPU & 3D-renderöinti
- Three.js WebGPU renderer
- 3D-visualisoinnit (bar, scatter, surface, network, pie charts)
- TSL (Three.js Shading Language)
- GPU-kiihdytetty renderöinti

#### 2. Scrollytelling 2.0
- GSAP ScrollTrigger
- Datavetoinen kerronta
- ECharts-integraatio
- Progressive disclosure

#### 3. Glassmorphism 2.0
- CSS backdrop-filter
- Fysikaalisesti uskottavat materiaalit
- Depth layering
- Light refraction effects

#### 4. Nestemäiset muodot (Fluid Motion)
- Liquid distortion shader
- Mouse-reactive effects
- Animated blobs
- Velocity-based warping

#### 5. View Transitions API
- Saumattomat tilasiirtymät
- Bento Grid layout
- Object permanence
- Native browser transitions

#### 6. Mikrointeraktiot & Ennakoiva UI
- Magnetic buttons
- Intent detection
- Smart prefetching
- Cursor following

#### 7. Tekstianimaatiot
- GSAP SplitText
- Character-by-character reveals
- Text morphing
- Gradient animations

### Legacy Demos (demos.html)

Säilytetyt alkuperäiset demot:
- **Voice Control**: Web Speech API
- **Gesture Control**: MediaPipe hand tracking
- **Sensor Control**: Generic Sensor API
- **3D Visualization**: Three.js visualizations
- **Multimodal**: Kaikki yhdistettynä

## 🛠 Teknologiat

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

### Tulevat kirjastot (suunnitteilla)
- **GSAP** - Advanced animations & scrollytelling
- **React Three Fiber** (valinnainen) - Declarative 3D

## 🌐 Kieliversiot (i18n)

Sovellus tukee suomea ja englantia modulaarisella käännösarkkitehtuurilla:

- **Kielenvaihto**: Oikean yläkulman FI/EN-napista
- **Automaattinen tallennus**: Kielivalinta säilyy localStorage:ssa
- **Lazy loading**: Vain tarvittavat käännökset ladataan

### Käännösrakenne
```
locales/
├── fi/
│   ├── common.json           # Nav, footer, yleiset
│   ├── landing.json          # Etusivu
│   ├── glassmorphism.json
│   ├── fluid-motion.json
│   ├── scrollytelling.json
│   ├── micro-interactions.json
│   ├── view-transitions.json
│   ├── text-animations.json
│   └── webgpu-3d.json
└── en/
    └── (sama rakenne)
```

## 📁 Projektin rakenne

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

## 🎨 Landing Page Ominaisuudet

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

## 🌐 Selaintuki

| Selain | Desktop | Mobile | Huomiot |
|--------|---------|--------|---------|
| Chrome | ✅ Full | ✅ Full | Paras tuki kaikille ominaisuuksille |
| Edge | ✅ Full | ✅ Full | Chromium-pohjainen |
| Firefox | ✅ Full | ⚠️ Limited | Web Speech API rajoitettu |
| Safari | ⚠️ Partial | ⚠️ Partial | WebGPU tuki lisätty 2024 |

### Vaaditut ominaisuudet
- WebGL 2.0 tai WebGPU
- ES6+ JavaScript
- CSS Custom Properties
- Intersection Observer API

## ⚡ Suorituskyky

### Optimoinnit
- **On-demand rendering**: Renderöintiluuppi pysähtyy kun ei muutoksia
- **Reduced particle count**: 1000 partikkelia (optimoitu mobiilille)
- **Lazy loading**: Demot ladataan vain tarvittaessa
- **Debounced events**: Resize & scroll handlers optimoitu
- **Automatic quality scaling**: Adaptoituu laitteen tehoon

### Performance Metrics (tavoite)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- 60 FPS animations (desktop)
- 30+ FPS animations (mobile)

## 🧪 Kehitys

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

### Preview Production Build
```bash
npm run preview
```

## 📚 Dokumentaatio

Lisää dokumentaatiota löytyy:
- `PLAN.md` - Alkuperäinen suunnitelma
- `CHANGELOG.md` - Muutosloki
- `Javascript-efektit ja trendit 2025.pdf` - Lähdemateriaali

## 🎯 Roadmap

### Versio 0.7.0 ✅ (Nykyinen)
- [x] Modulaarinen i18n-arkkitehtuuri (FI/EN)
- [x] Kielenvaihtonappi
- [x] Lazy loading käännöksille
- [x] Käännökset kaikille 7 demoille

### Versio 0.6.0 ✅
- [x] WebGPU & 3D Demo
- [x] Shared demo CSS
- [x] Post-processing effects

### Versio 0.5.0 ✅
- [x] View Transitions API demo
- [x] Text animations demo

### Versio 0.4.0 ✅
- [x] Glassmorphism playground
- [x] Fluid distortion shader demo
- [x] Scrollytelling demo
- [x] Micro-interactions demo

### Versio 0.8.0 (Suunnitteilla)
- [ ] Demo-sivujen i18n data-attribuutit
- [ ] AI-avusteinen generatiivinen UI
- [ ] WebXR/VR-tuki
- [ ] Performance-optimoinnit

## 🤝 Kontribuutiot

Projekti on demo-tarkoitukseen. Fork & PR:t tervetulleita!

### Development Guidelines
1. Käytä ES6+ moduleja
2. Noudata accessibility best practices
3. Testaa kaikissa suurimmissa selaimissa
4. Optimoi suorituskyky (60 FPS tavoite)
5. Päivitä CHANGELOG.md

## 📄 Lisenssi

MIT License - Vapaa käyttöön ja muokkaukseen

## 🙏 Kiitokset

- **Three.js** - Loistava 3D-kirjasto
- **ECharts** - Tehokas chart-kirjasto
- **Vite** - Nopea build tool
- **PDF "Javascript-efektit ja trendit 2025"** - Inspiraatio ja suunnittelu

---

**Kehittäjä**: Toni Hintikka  
**GitHub**: [tonihintikka/javascript-demo](https://github.com/tonihintikka/javascript-demo)  
**Live Demo**: [javascript-demo-henna.vercel.app](https://javascript-demo-henna.vercel.app)  
**Versio**: 0.7.0  
**Päivitetty**: Joulukuu 2025
