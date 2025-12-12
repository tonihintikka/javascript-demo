/**
 * Text Animations Demo
 * Various text animation techniques
 */

// Split text into characters
function splitIntoChars(element) {
  const text = element.textContent;
  element.innerHTML = '';
  
  text.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.className = 'char';
    span.style.setProperty('--char-index', i);
    span.style.animationDelay = `${i * 0.05}s`;
    element.appendChild(span);
  });
}

// Split text into words
function splitIntoWords(element) {
  const text = element.textContent;
  element.innerHTML = '';
  
  text.split(' ').forEach((word, i) => {
    const span = document.createElement('span');
    span.textContent = word;
    span.className = 'word';
    span.style.setProperty('--word-index', i);
    span.style.animationDelay = `${i * 0.1}s`;
    element.appendChild(span);
  });
}

// Split into lines (wrap in spans)
function splitIntoLines(element) {
  const lines = element.querySelectorAll('.quote-line');
  
  lines.forEach((line, i) => {
    const text = line.textContent;
    line.innerHTML = '';
    const span = document.createElement('span');
    span.textContent = text;
    span.style.animationDelay = `${i * 0.2}s`;
    line.appendChild(span);
  });
}

// Animate element
function animate(element) {
  element.classList.remove('animate');
  void element.offsetWidth; // Force reflow
  element.classList.add('animate');
}

// Reset animation
function resetAnimation(className) {
  const element = document.querySelector(`.${className}`);
  if (element) {
    animate(element);
  }
}

// Text Scramble Effect
class TextScramble {
  constructor(element) {
    this.element = element;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.queue = [];
    this.frame = 0;
    this.frameRequest = null;
    this.resolve = null;
  }
  
  setText(newText) {
    const oldText = this.element.textContent;
    const length = Math.max(oldText.length, newText.length);
    
    this.queue = [];
    
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    
    return new Promise(resolve => this.resolve = resolve);
  }
  
  update() {
    let output = '';
    let complete = 0;
    
    for (let i = 0; i < this.queue.length; i++) {
      const { from, to, start, end, char } = this.queue[i];
      
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          this.queue[i].char = this.randomChar();
        }
        output += `<span class="scramble-char">${this.queue[i].char}</span>`;
      } else {
        output += from;
      }
    }
    
    this.element.innerHTML = output;
    
    if (complete === this.queue.length) {
      this.resolve?.();
    } else {
      this.frameRequest = requestAnimationFrame(() => this.update());
      this.frame++;
    }
  }
  
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Typewriter Effect
class Typewriter {
  constructor(element, options = {}) {
    this.element = element;
    this.text = element.textContent;
    this.speed = options.speed || 50;
    this.delay = options.delay || 0;
  }
  
  async type() {
    this.element.textContent = '';
    this.element.style.width = 'auto';
    
    await this.wait(this.delay);
    
    for (let i = 0; i <= this.text.length; i++) {
      this.element.textContent = this.text.substring(0, i);
      await this.wait(this.speed);
    }
  }
  
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Counter Animation
function animateCounter(element) {
  const target = parseFloat(element.dataset.target);
  const suffix = element.dataset.suffix || '';
  const decimals = parseInt(element.dataset.decimals) || 0;
  const duration = 2000;
  const start = performance.now();
  
  function update(timestamp) {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;
    
    element.textContent = current.toFixed(decimals) + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// Initialize character animations
function initCharAnimations() {
  const charElements = document.querySelectorAll('.animated-text');
  
  charElements.forEach(el => {
    splitIntoChars(el);
    
    // Auto-animate on load with delay
    setTimeout(() => {
      animate(el);
    }, 500);
  });
  
  // Replay buttons
  document.querySelectorAll('.replay-btn[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      const element = document.querySelector(`.${target}`);
      if (element) {
        // Re-split and animate
        const text = element.dataset.text || element.textContent.replace(/\s+/g, '');
        element.textContent = text;
        splitIntoChars(element);
        animate(element);
      }
    });
  });
}

// Initialize word animations
function initWordAnimations() {
  const wordElements = document.querySelectorAll('.word-animate');
  
  wordElements.forEach(el => {
    const originalText = el.textContent;
    el.dataset.originalText = originalText;
    splitIntoWords(el);
    
    // Animate on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => animate(entry.target), 200);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(el);
  });
  
  // Replay for word animations
  document.querySelectorAll('.replay-btn[data-target^="word-"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      const element = document.querySelector(`.${target}`);
      if (element) {
        const text = element.dataset.originalText || 'Example text';
        element.textContent = text;
        splitIntoWords(element);
        animate(element);
      }
    });
  });
}

// Initialize typewriter
function initTypewriter() {
  const replayBtn = document.getElementById('replay-typewriter');
  
  async function runTypewriter() {
    // Reset
    const lines = [
      { el: document.getElementById('terminal-line-2'), hidden: true },
      { el: document.getElementById('terminal-line-3'), hidden: true }
    ];
    
    lines.forEach(l => l.el.classList.add('hidden'));
    
    const tw1 = new Typewriter(document.getElementById('typewriter-1'), { speed: 60 });
    const tw2 = new Typewriter(document.getElementById('typewriter-2'), { speed: 40 });
    const tw3 = new Typewriter(document.getElementById('typewriter-3'), { speed: 40 });
    
    await tw1.type();
    await new Promise(r => setTimeout(r, 500));
    
    document.getElementById('terminal-line-2').classList.remove('hidden');
    await tw2.type();
    await new Promise(r => setTimeout(r, 300));
    
    document.getElementById('terminal-line-3').classList.remove('hidden');
    await tw3.type();
  }
  
  // Auto-run after delay
  setTimeout(runTypewriter, 1000);
  
  replayBtn?.addEventListener('click', runTypewriter);
}

// Initialize text scramble
function initScramble() {
  const scrambleEl = document.getElementById('scramble-text');
  if (!scrambleEl) return;
  
  const scrambler = new TextScramble(scrambleEl);
  
  document.querySelectorAll('.word-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      scrambler.setText(btn.dataset.word);
    });
  });
}

// Initialize line reveal
function initLineReveal() {
  const quote = document.querySelector('.line-reveal');
  if (!quote) return;
  
  splitIntoLines(quote);
  
  // Animate on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  observer.observe(quote);
  
  // Replay
  document.getElementById('replay-quote')?.addEventListener('click', () => {
    quote.classList.remove('animate');
    splitIntoLines(quote);
    void quote.offsetWidth;
    animate(quote);
  });
}

// Initialize counters
function initCounters() {
  const counters = document.querySelectorAll('.counter-value');
  
  // Animate on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => observer.observe(counter));
  
  // Replay
  document.getElementById('replay-counters')?.addEventListener('click', () => {
    counters.forEach(counter => {
      counter.textContent = '0';
      animateCounter(counter);
    });
  });
}

// Initialize hero animations
function initHeroAnimations() {
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  
  if (heroTitle) {
    splitIntoChars(heroTitle);
    setTimeout(() => animate(heroTitle), 300);
  }
  
  if (heroSubtitle) {
    splitIntoWords(heroSubtitle);
    setTimeout(() => animate(heroSubtitle), 800);
  }
}

// Replay all
function initReplayAll() {
  document.getElementById('replay-all')?.addEventListener('click', () => {
    // Re-init all animations
    location.reload();
  });
}

// Copy code
function initCopyCode() {
  document.getElementById('copy-code')?.addEventListener('click', async () => {
    const code = document.querySelector('.code-block code');
    if (!code) return;
    
    try {
      await navigator.clipboard.writeText(code.textContent);
      const btn = document.getElementById('copy-code');
      btn.textContent = '✅ Kopioitu!';
      setTimeout(() => btn.textContent = '📋 Kopioi', 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  });
}

// Main init
function init() {
  initHeroAnimations();
  initCharAnimations();
  initWordAnimations();
  initTypewriter();
  initScramble();
  initLineReveal();
  initCounters();
  initReplayAll();
  initCopyCode();
  
  console.log('Text Animations Demo initialized');
}

// Wait for DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export { splitIntoChars, splitIntoWords, TextScramble, Typewriter };
