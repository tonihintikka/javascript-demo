# TODO - Modernit JavaScript-efektit 2025

Projektin tehtävälista järjestyksessä.

## 🎯 PRIORITEETTI 1: Uudet Demodemo-sivut

### 1. Glassmorphism 2.0 Demo
**Tiedosto:** `demos/glassmorphism.html`

- [ ] **HTML-rakenne**
  - Hero-osio glassmorphic card -esimerkillä
  - Interaktiivinen playground (säätöpaneelit)
  - Esimerkkejä: kortit, modaalit, navigaatio

- [ ] **CSS/Efektit**
  - `backdrop-filter: blur()` + `saturate()`
  - Multi-layer depth effects
  - Light refraction simulaatio
  - Hover-transformaatiot
  - Responsive glassmorphism

- [ ] **JavaScript**
  - Interaktiivinen säätö (blur amount, opacity, saturation)
  - Real-time preview
  - Koodi-generaattori (copy CSS)
  - Mouse parallax effect

- [ ] **Saavutettavuus**
  - Riittävä kontrasti tekstille
  - Fallback ei-tuetuille selaimille
  - `prefers-reduced-motion`

---

### 2. Nestemäiset muodot (Fluid Motion) Demo
**Tiedosto:** `demos/fluid-motion.html`

- [ ] **HTML-rakenne**
  - Canvas-pohjainen liquid distortion
  - Image distortion demo
  - Blob animations showcase

- [ ] **WebGL/Shader-efektit**
  - Liquid distortion shader (GLSL)
  - Mouse velocity tracking
  - Image warp on hover
  - Animated blobs (metaballs)

- [ ] **JavaScript**
  - WebGL context setup
  - Vertex/fragment shaders
  - Mouse interaction (velocity + position)
  - Performance optimization
  - Fallback 2D canvas animaatio

- [ ] **Esimerkit**
  - Product image hover effect
  - Hero background animation
  - Button hover distortion
  - Morphing shapes

---

### 3. Scrollytelling 2.0 Demo
**Tiedosto:** `demos/scrollytelling.html`

**Riippuvuus:** Vaatii GSAP:n asennuksen

- [ ] **Asennus**
  - `npm install gsap`
  - GSAP ScrollTrigger plugin

- [ ] **HTML-rakenne**
  - Multi-step story sections
  - Data visualization integration (ECharts)
  - Sticky sections

- [ ] **GSAP ScrollTrigger**
  - Pin sections while scrolling
  - Scrub animations (tied to scroll)
  - Timeline-based storytelling
  - Parallax layers

- [ ] **Data-driven animations**
  - Chart reveal on scroll
  - Progressive data disclosure
  - Morphing between visualizations
  - Exploded view (tuotteen purkaminen)

- [ ] **Esimerkit**
  - Product showcase (Apple-tyyli)
  - Data journalism story
  - Company timeline
  - Feature walkthrough

---

### 4. View Transitions API Demo
**Tiedosto:** `demos/view-transitions.html`

- [ ] **HTML-rakenne**
  - Bento Grid layout (interaktiivinen)
  - Expandable cards
  - Multi-page simulation (SPA)

- [ ] **View Transitions API**
  - `document.startViewTransition()`
  - Shared element transitions
  - Custom transition animations
  - Fallback for unsupported browsers

- [ ] **Bento Grid**
  - Asymmetric layout
  - Card expansion animation
  - Smooth layout shifts
  - "Object permanence" demo

- [ ] **Esimerkit**
  - Image gallery expansion
  - Product card to detail page
  - Modal transitions
  - Navigation state changes

---

### 5. Mikrointeraktiot & Ennakoiva UI Demo
**Tiedosto:** `demos/micro-interactions.html`

- [ ] **HTML-rakenne**
  - Button showcase
  - Form interactions
  - Loading states
  - Success/error feedback

- [ ] **Magnetic Buttons**
  - Cursor attraction effect
  - Smooth easing
  - Click ripple
  - Haptic feedback (mobile)

- [ ] **Predictive UI** (Advanced)
  - Mouse trajectory tracking
  - Intent detection algorithm
  - Pre-loading on hover prediction
  - Smart hover states

- [ ] **Mikrointeraktiot**
  - Button hover effects (scale, rotate, morph)
  - Toggle switch animations
  - Checkbox animations
  - Input focus states
  - Loading spinners
  - Toast notifications

- [ ] **Esimerkit**
  - E-commerce "Add to cart" button
  - Form validation feedback
  - Like button animation
  - Menu transitions

---

### 6. Tekstianimaatiot Demo
**Tiedosto:** `demos/text-animations.html`

**Riippuvuus:** Vaatii GSAP + SplitText plugin

- [ ] **Asennus**
  - GSAP SplitText (requires Club GreenSock tai vaihtoehto)
  - Vaihtoehto: [Splitting.js](https://splitting.js.org/) (ilmainen)

- [ ] **HTML-rakenne**
  - Text reveal showcase
  - Morphing text demo
  - Gradient animations
  - Typing effects

- [ ] **Animaatiotyypit**
  - Character-by-character reveal
  - Word-by-word fade in
  - Line-by-line slide up
  - Text scramble effect
  - Gradient text animation
  - Text morphing/substitution

- [ ] **GSAP Integraatio**
  - SplitText for character splitting
  - Stagger animations
  - Timeline-based sequences
  - Scroll-triggered text reveals

- [ ] **Esimerkit**
  - Hero title animation
  - Subtitle typewriter effect
  - Quote reveal
  - Heading morphing

---

### 7. WebGPU & 3D Demo (Laajennus)
**Tiedosto:** `demos/webgpu-3d.html` (tai laajennus olemassa olevaan)

- [ ] **WebGPU-tuki**
  - Detect WebGPU support
  - Fallback WebGL renderer
  - WebGPURenderer setup (Three.js)

- [ ] **TSL (Three.js Shading Language)**
  - Custom materials with TSL
  - Node-based shader creation
  - Examples: glass, metal, fabric

- [ ] **Advanced 3D**
  - Post-processing effects (Bloom, DOF)
  - Physically-based materials
  - Environment mapping
  - Shadow improvements

- [ ] **GPU Compute Shaders**
  - Particle simulation (GPU-driven)
  - Cloth simulation
  - Fluid dynamics demo

- [ ] **Performance**
  - Adaptive quality based on device
  - FPS counter
  - Stats.js integration

---

## 🔧 PRIORITEETTI 2: Infrastruktuuri & Työkalut

### GSAP-integraatio
- [ ] Install GSAP: `npm install gsap`
- [ ] Setup GSAP plugins (ScrollTrigger, MorphSVG?)
- [ ] Create utilities (`js/gsap-utils.js`)
- [ ] License check (Club GreenSock vs free features)

### Demo Navigation System
- [ ] Create unified navigation for all demos
- [ ] Breadcrumbs (Landing → Demo → Section)
- [ ] Previous/Next demo buttons
- [ ] Demo switcher menu
- [ ] Update `demos.html` with new demos

### Shared Components
- [ ] `js/components/DemoLayout.js` - Wrapper for all demos
- [ ] `js/components/CodeBlock.js` - Syntax-highlighted code examples
- [ ] `js/components/ControlPanel.js` - Reusable settings panel
- [ ] `css/demo-shared.css` - Shared demo styles

### Performance Tools
- [ ] FPS meter component
- [ ] Performance monitor overlay (optional)
- [ ] Adaptive quality manager
- [ ] Bundle size analysis

---

## 🎨 PRIORITEETTI 3: Landing Page Parannukset

**Tehdään vasta kun demot valmiit!**

### Efektien tuonti landing pagelle
- [ ] Import best Glassmorphism effects
- [ ] Add Fluid distortion to hero
- [ ] Implement GSAP scrollytelling
- [ ] Add text animations to titles
- [ ] Enhance card transitions (View Transitions API)

### Landing Page Hienosäätö
- [ ] Smooth scroll improvements
- [ ] Card preview animations (from real demos)
- [ ] Add video/GIF previews to cards
- [ ] Optimize particle count for mobile
- [ ] Loading states for heavy assets

### Visual Polish
- [ ] Custom cursor styles
- [ ] Page transition effects
- [ ] Sound effects (optional, tasteful)
- [ ] Dark/light theme toggle
- [ ] Theme persistence (localStorage)

---

## 📱 PRIORITEETTI 4: Mobiili & Responsiivisuus

### Mobiilioptimointiz
- [ ] Test all demos on mobile devices
- [ ] Touch gesture support (where applicable)
- [ ] Reduce particle counts on mobile
- [ ] Optimize shader complexity
- [ ] Mobile-specific layouts

### Responsiivisuus
- [ ] Tablet breakpoints
- [ ] Small mobile (320px) testing
- [ ] Landscape orientation handling
- [ ] Fold/flip device support

---

## ♿ PRIORITEETTI 5: Saavutettavuus & Testaus

### Accessibility Audit
- [ ] Screen reader testing (NVDA/VoiceOver)
- [ ] Keyboard navigation for all demos
- [ ] ARIA labels verification
- [ ] Color contrast checks (WCAG AA)
- [ ] Focus indicators
- [ ] `prefers-reduced-motion` in all demos

### Cross-browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS & iOS)
- [ ] Mobile browsers (Chrome, Safari)
- [ ] Fallbacks for unsupported features

### Performance Testing
- [ ] Lighthouse scores (target: 90+)
- [ ] Core Web Vitals
- [ ] Bundle size optimization
- [ ] Lazy loading verification

---

## 📚 PRIORITEETTI 6: Dokumentaatio

### Demo Documentation
- [ ] Individual README for each demo
- [ ] Code comments in demos
- [ ] API documentation
- [ ] Usage examples

### Tutorials
- [ ] "How to add Glassmorphism to your site"
- [ ] "GSAP ScrollTrigger basics"
- [ ] "WebGPU setup guide"
- [ ] "Performance optimization tips"

### Blog Posts / Articles (Optional)
- [ ] "7 Modern JS Effects for 2025"
- [ ] "From WebGL to WebGPU"
- [ ] "Accessible animations"

---

## 🚀 PRIORITEETTI 7: Deployment & Production

### Build Optimization
- [ ] Production build testing
- [ ] Asset optimization (images, videos)
- [ ] Code splitting
- [ ] Tree shaking verification
- [ ] Minification

### Deployment
- [ ] Deploy to GitHub Pages
- [ ] Setup custom domain (optional)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Staging environment

### SEO & Metadata
- [ ] Meta tags (OG, Twitter)
- [ ] Sitemap.xml
- [ ] robots.txt
- [ ] Structured data (Schema.org)

---

## 🎁 BONUS: Extra Features

### Advanced Features (If Time Permits)
- [ ] Dark/light theme system
- [ ] User preferences (localStorage)
- [ ] Share buttons (Twitter, LinkedIn)
- [ ] Download code snippets
- [ ] Demo customizer (theme colors)
- [ ] FPS/performance mode toggle

### Community Features
- [ ] Comments section (optional)
- [ ] Rating system for demos
- [ ] "Suggest a demo" form
- [ ] GitHub discussions integration

---

## 📊 Progress Tracking

### Completed (✅)
- [x] Landing page HTML/CSS/JS
- [x] Project structure
- [x] README documentation
- [x] CHANGELOG setup
- [x] Git repository initialized
- [x] 3D visualizations (legacy demos)
- [x] Voice/Gesture/Sensor demos (legacy)

### In Progress (🚧)
- [ ] (None currently)

### Next Up (📌)
1. **Glassmorphism Demo** - Easiest to implement first
2. **GSAP Installation** - Required for multiple demos
3. **Fluid Motion Demo** - Visual wow-factor
4. **Scrollytelling Demo** - Requires GSAP

---

## 🎯 Sprint Planning

### Sprint 1: Core Demos (Estimated: 8-12h)
- Glassmorphism Demo (2-3h)
- Fluid Motion Demo (3-4h)
- Mikrointeraktiot Demo (2-3h)
- Demo navigation system (1-2h)

### Sprint 2: GSAP Demos (Estimated: 6-8h)
- GSAP installation & setup (1h)
- Scrollytelling Demo (3-4h)
- Text Animations Demo (2-3h)

### Sprint 3: Advanced Demos (Estimated: 6-8h)
- View Transitions API Demo (3-4h)
- WebGPU enhancements (2-3h)
- Shared components (1h)

### Sprint 4: Polish & Deploy (Estimated: 4-6h)
- Landing page enhancements (2h)
- Mobile optimization (1-2h)
- Accessibility audit (1h)
- Deployment (1h)

**Total Estimate: 24-34 hours**

---

## 📝 Notes

- **Prioritize demos over landing page polish**
- **Test each demo in browser before moving to next**
- **Commit working demos incrementally**
- **Update CHANGELOG.md after each demo**
- **Keep accessibility in mind from the start**

---

**Last Updated**: 2025-12-12
**Version**: 0.3.0
