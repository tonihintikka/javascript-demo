/**
 * View Transitions API Demo
 * Demonstrates the View Transitions API for smooth state changes
 */

// Card data for expanded view
const cardData = {
  1: {
    icon: '🚀',
    title: 'Performance',
    desc: 'GPU-accelerated transitions with minimal JavaScript overhead',
    details: [
      '60fps animaatiot ilman jank-ongelmia',
      'Automaattinen cross-fade vanhan ja uuden tilan välillä',
      'Shared element transitions - elementit "lentävät" paikasta toiseen',
      'Fallback vanhemmille selaimille'
    ]
  },
  2: {
    icon: '🎨',
    title: 'Smooth',
    desc: 'Automatic cross-fade between states',
    details: [
      'Selaimen natiivi animaatio-engine',
      'Ei tarvetta monimutkaisille JavaScript-kirjastoille',
      'Toimii kaikissa Chromium-selaimissa'
    ]
  },
  3: {
    icon: '🔗',
    title: 'Connected',
    desc: 'Shared element transitions',
    details: [
      'Elementit voivat "lentää" eri näkymien välillä',
      'Säilyttää visuaalisen jatkuvuuden',
      'Parantaa käyttäjäkokemusta'
    ]
  },
  4: {
    icon: '📱',
    title: 'Responsive',
    desc: 'Works across all screen sizes with adaptive layouts',
    details: [
      'Toimii mobiilissa ja desktopissa',
      'Adaptiiviset animaatiot näyttökoon mukaan',
      'Touch-ystävällinen'
    ]
  },
  5: {
    icon: '⚡',
    title: 'Fast',
    desc: 'Lightning fast transitions',
    details: [
      'Minimaalinen JavaScript-overhead',
      'GPU-kiihdytetty renderöinti',
      'Ei layout thrashing -ongelmia'
    ]
  },
  6: {
    icon: '🎯',
    title: 'Precise',
    desc: 'Pixel-perfect animations',
    details: [
      'Tarkka kontrolli animaatioihin',
      'CSS-pohjainen kustomointi',
      'Ennustettava käyttäytyminen'
    ]
  }
};

// Check View Transitions API support
function checkSupport() {
  const statusEl = document.getElementById('api-status');
  const hasSupport = 'startViewTransition' in document;
  
  if (hasSupport) {
    statusEl.classList.add('supported');
    statusEl.innerHTML = `
      <span class="status-icon">✅</span>
      <span class="status-text">View Transitions API tuettu!</span>
    `;
  } else {
    statusEl.classList.add('unsupported');
    statusEl.innerHTML = `
      <span class="status-icon">⚠️</span>
      <span class="status-text">Ei tukea - käytetään fallback-animaatioita</span>
    `;
  }
  
  return hasSupport;
}

// Transition helper function
function transition(callback) {
  if (!document.startViewTransition) {
    callback();
    return;
  }
  
  document.startViewTransition(() => {
    callback();
  });
}

// Initialize Bento Grid interactions
function initBentoGrid() {
  const cards = document.querySelectorAll('.bento-card');
  const overlay = document.getElementById('expanded-overlay');
  const expandedCard = document.getElementById('expanded-card');
  const closeBtn = document.getElementById('close-expanded');
  
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      const data = cardData[id];
      
      if (!data) return;
      
      transition(() => {
        // Populate expanded card
        document.getElementById('expanded-icon').textContent = data.icon;
        document.getElementById('expanded-number').textContent = `0${id}`;
        document.getElementById('expanded-title').textContent = data.title;
        document.getElementById('expanded-desc').textContent = data.desc;
        
        const detailsList = data.details.map(d => `<li>${d}</li>`).join('');
        document.querySelector('.expanded-details ul').innerHTML = detailsList;
        
        // Show overlay
        overlay.hidden = false;
      });
    });
  });
  
  // Close expanded card
  function closeExpanded() {
    transition(() => {
      overlay.hidden = true;
    });
  }
  
  closeBtn.addEventListener('click', closeExpanded);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeExpanded();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hidden) {
      closeExpanded();
    }
  });
}

// Initialize Theme Switcher
function initThemeSwitcher() {
  const preview = document.getElementById('theme-preview');
  const buttons = document.querySelectorAll('.theme-btn');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      
      transition(() => {
        // Update active button
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update preview
        if (theme === 'light') {
          preview.classList.add('light');
        } else {
          preview.classList.remove('light');
        }
      });
    });
  });
}

// Initialize Page Navigation Demo
function initNavigation() {
  const tabs = document.querySelectorAll('.nav-tab');
  const pages = document.querySelectorAll('.page-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPage = tab.dataset.page;
      
      transition(() => {
        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show target page, hide others
        pages.forEach(page => {
          if (page.dataset.page === targetPage) {
            page.hidden = false;
            page.classList.add('active');
          } else {
            page.hidden = true;
            page.classList.remove('active');
          }
        });
      });
    });
  });
}

// Initialize Code Copy functionality
function initCodeCopy() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const codeType = btn.dataset.code;
      const codeEl = document.getElementById(`code-${codeType}`);
      
      if (!codeEl) return;
      
      try {
        await navigator.clipboard.writeText(codeEl.textContent);
        
        const originalText = btn.textContent;
        btn.textContent = '✅ Kopioitu!';
        
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      } catch (err) {
        console.error('Copy failed:', err);
        btn.textContent = '❌ Virhe';
      }
    });
  });
}

// Animation toggle
function initAnimationToggle() {
  const toggleBtn = document.getElementById('toggle-animations');
  let animationsEnabled = true;
  
  toggleBtn?.addEventListener('click', () => {
    animationsEnabled = !animationsEnabled;
    
    if (animationsEnabled) {
      document.body.classList.remove('reduce-motion');
      toggleBtn.querySelector('.btn-icon').textContent = '✨';
    } else {
      document.body.classList.add('reduce-motion');
      toggleBtn.querySelector('.btn-icon').textContent = '⏸️';
    }
  });
}

// Prevent form submission in demo
function initForms() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('.submit-btn');
      if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '✅ Lähetetty (demo)';
        submitBtn.disabled = true;
        
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          form.reset();
        }, 2000);
      }
    });
  });
}

// Initialize everything
function init() {
  checkSupport();
  initBentoGrid();
  initThemeSwitcher();
  initNavigation();
  initCodeCopy();
  initAnimationToggle();
  initForms();
  
  console.log('View Transitions Demo initialized');
}

// Wait for DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for potential module usage
export { transition, checkSupport };
