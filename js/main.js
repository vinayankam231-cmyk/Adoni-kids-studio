/**
 * ADONI KIDS STUDIO — Core Website Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlideshow();
  initMobileNavigation();
  initSmoothScrolling();
  initScrollToTop();
  initScrollAnimations();
  initActiveNavSpy();
  initStatCounters();
  initEstimator();
  initClientFeedback();
  initFaqAccordion();
});

// In-Page Smooth Scrolling
function initSmoothScrolling() {
  const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || !window.location.pathname.includes('.html');
  
  document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href) return;
      
      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;
      
      const pathPart = href.substring(0, hashIndex);
      const targetId = href.substring(hashIndex + 1);
      
      // If link points to an anchor on current page
      if (!pathPart || pathPart === 'index.html' || (isHomePage && (pathPart === '' || pathPart === './'))) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          e.preventDefault();
          const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = Math.max(0, elementPosition - 24);

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Update URL hash without jump
          if (history.pushState) {
            history.pushState(null, null, '#' + targetId);
          }
        }
      }
    });
  });
}

// Floating Scroll to Top / Home Controller (Reference: media_1791099794593.png & media_1791100635383.png)
function initScrollToTop() {
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const footerTopBtn = document.getElementById('footerTopBtn');

  const scrollToHero = (e) => {
    if (e) e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    if (history.pushState) {
      history.pushState(null, null, '#hero');
    }
  };

  if (scrollTopBtn) {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    scrollTopBtn.addEventListener('click', scrollToHero);
  }

  if (footerTopBtn) {
    footerTopBtn.addEventListener('click', scrollToHero);
  }
}

// Mobile Drawer Navigation (Reference: media_1791101536424.png)
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const heroMenuToggle = document.getElementById('heroMenuToggle');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const backdrop = document.querySelector('.mobile-backdrop');
  const drawerLinks = document.querySelectorAll('.mobile-nav-drawer a');

  if (!drawer || !backdrop) return;

  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : !drawer.classList.contains('open');
    drawer.classList.toggle('open', isOpen);
    backdrop.classList.toggle('open', isOpen);
    if (toggleBtn) toggleBtn.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => toggleMenu());
  }

  if (heroMenuToggle) {
    heroMenuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMenu(true);
    });
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMenu(false);
    });
  }

  backdrop.addEventListener('click', () => toggleMenu(false));

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

// Intersection Observer Reveal Animations
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

// Highlight current section in navigation
function initActiveNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-desktop .nav-link, .mobile-nav-links a');

  if (!sections.length || !navLinks.length) return;

  const updateSpy = () => {
    let current = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    if (window.scrollY < 120 && sections.length > 0) {
      current = sections[0].getAttribute('id');
    }

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.includes('#')) {
        const linkId = href.split('#')[1];
        if (linkId === current) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  };

  window.addEventListener('scroll', updateSpy, { passive: true });
  updateSpy();
}

// Interactive Session & Keepsake Investment Estimator
function initEstimator() {
  const estimatorSection = document.getElementById('estimator');
  if (!estimatorSection) return;

  const sessionCards = document.querySelectorAll('#sessionOptions .estimator-option-card, #sessionOptions .estimator-choice-card');
  const castingCards = document.querySelectorAll('#castingOptions .estimator-option-card, #castingOptions .estimator-choice-card');
  const addonCards = document.querySelectorAll('#addonOptions .estimator-option-card, #addonOptions .estimator-choice-card');
  const summaryItems = document.getElementById('summaryItems');
  const summaryTotal = document.getElementById('summaryTotal');
  const whatsappBtn = document.getElementById('estimatorWhatsAppBtn');

  function calculate() {
    let total = 0;
    let selectedSession = null;
    let selectedCasting = null;
    let selectedAddons = [];

    // Session (Single choice)
    sessionCards.forEach(card => {
      if (card.classList.contains('selected')) {
        const name = card.getAttribute('data-name');
        const price = parseInt(card.getAttribute('data-price'), 10) || 0;
        selectedSession = { name, price };
        total += price;
      }
    });

    // Casting (Single choice)
    castingCards.forEach(card => {
      if (card.classList.contains('selected')) {
        const name = card.getAttribute('data-name');
        const price = parseInt(card.getAttribute('data-price'), 10) || 0;
        selectedCasting = { name, price };
        total += price;
      }
    });

    // Addons (Multiple choice)
    addonCards.forEach(card => {
      if (card.classList.contains('selected')) {
        const name = card.getAttribute('data-name');
        const price = parseInt(card.getAttribute('data-price'), 10) || 0;
        selectedAddons.push({ name, price });
        total += price;
      }
    });

    // Update Summary HTML
    let html = '';
    if (selectedSession) {
      html += `
        <div class="summary-line-item">
          <span>${selectedSession.name}</span>
          <span>₹${selectedSession.price.toLocaleString('en-IN')}</span>
        </div>
      `;
    }

    if (selectedCasting && selectedCasting.price > 0) {
      html += `
        <div class="summary-line-item">
          <span>${selectedCasting.name}</span>
          <span>₹${selectedCasting.price.toLocaleString('en-IN')}</span>
        </div>
      `;
    }

    selectedAddons.forEach(addon => {
      html += `
        <div class="summary-line-item">
          <span>${addon.name}</span>
          <span>+₹${addon.price.toLocaleString('en-IN')}</span>
        </div>
      `;
    });

    if (summaryItems) summaryItems.innerHTML = html;
    if (summaryTotal) summaryTotal.textContent = `₹${total.toLocaleString('en-IN')}`;

    // Update WhatsApp link
    if (whatsappBtn) {
      let msg = `*Adoni Kids Studio — Custom Investment Estimate*\n\n`;
      if (selectedSession) msg += `*Primary Session:* ${selectedSession.name} (₹${selectedSession.price.toLocaleString('en-IN')})\n`;
      if (selectedCasting && selectedCasting.price > 0) msg += `*3D Keepsake Casting:* ${selectedCasting.name} (₹${selectedCasting.price.toLocaleString('en-IN')})\n`;
      if (selectedAddons.length > 0) {
        msg += `*Heirloom Add-Ons:*\n`;
        selectedAddons.forEach(a => {
          msg += `  • ${a.name} (+₹${a.price.toLocaleString('en-IN')})\n`;
        });
      }
      msg += `\n*Estimated Investment:* ₹${total.toLocaleString('en-IN')}\n`;
      msg += `*Advance Required to Hold Date:* ₹1,000\n\n`;
      msg += `_Hello! I configured this custom package on your website and would love to check date availability._`;

      const encoded = encodeURIComponent(msg);
      whatsappBtn.href = `https://wa.me/919441005963?text=${encoded}`;
    }
  }

  // Radio behavior for Sessions
  sessionCards.forEach(card => {
    card.addEventListener('click', () => {
      sessionCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      calculate();
    });
  });

  // Radio behavior for Castings
  castingCards.forEach(card => {
    card.addEventListener('click', () => {
      castingCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      calculate();
    });
  });

  // Checkbox toggle behavior for Addons
  addonCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('selected');
      calculate();
    });
  });

  calculate();
}

// Full-Screen Category Photography Hero Background Slideshow Controller
function initHeroSlideshow() {
  const hero = document.getElementById('hero');
  const track = document.getElementById('heroSliderTrack');
  if (!hero || !track) return;

  const originalSlides = Array.from(track.querySelectorAll('.hero-bg-slide:not(.clone)'));
  const dots = Array.from(document.querySelectorAll('.hero-indicator-dot'));
  const tabs = Array.from(document.querySelectorAll('.hero-cat-tab'));
  const totalOriginal = originalSlides.length;
  if (totalOriginal === 0) return;

  // Clone slide 0 to the end for seamless continuous infinite right-to-left loop
  const firstClone = originalSlides[0].cloneNode(true);
  firstClone.classList.add('clone');
  firstClone.setAttribute('data-index', 'clone-0');
  track.appendChild(firstClone);

  let currentIndex = 0;
  let isTransitioning = false;
  let autoPlayTimer = null;
  const DURATION = 1000;
  const INTERVAL = 4500;

  function goToSlide(index, animated = true) {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex = index;

    if (animated) {
      track.style.transition = `transform ${DURATION}ms cubic-bezier(0.25, 1, 0.5, 1)`;
    } else {
      track.style.transition = 'none';
    }

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Sync active indicators, tabs, and slides for Ken Burns animation
    const activeIndex = currentIndex % totalOriginal;
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeIndex);
    });
    tabs.forEach((tab, idx) => {
      tab.classList.toggle('active', idx === activeIndex);
    });

    const allSlides = track.querySelectorAll('.hero-bg-slide');
    allSlides.forEach((slide, idx) => {
      const isCurrent = (idx === currentIndex) || (currentIndex === totalOriginal && idx === 0);
      slide.classList.toggle('active', isCurrent);
    });

    if (animated) {
      setTimeout(() => {
        isTransitioning = false;
        // When landing on the cloned first slide, seamlessly snap to index 0
        if (currentIndex === totalOriginal) {
          track.style.transition = 'none';
          currentIndex = 0;
          track.style.transform = 'translateX(0)';
          void track.offsetHeight; // trigger reflow
        }
      }, DURATION + 20);
    } else {
      isTransitioning = false;
    }
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    if (currentIndex === 0) {
      // Snap to clone, then slide to last slide
      track.style.transition = 'none';
      currentIndex = totalOriginal;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      void track.offsetHeight;
      goToSlide(totalOriginal - 1);
    } else {
      goToSlide(currentIndex - 1);
    }
  }

  function startAutoplay() {
    stopAutoplay();
    autoPlayTimer = setInterval(nextSlide, INTERVAL);
  }

  function stopAutoplay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  // Interactive controls: clicking a dot or category tab navigates the background image
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const targetIndex = parseInt(dot.getAttribute('data-slide-to'), 10);
      if (!isNaN(targetIndex)) {
        stopAutoplay();
        goToSlide(targetIndex);
        startAutoplay();
      }
    });
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetIndex = parseInt(tab.getAttribute('data-slide-to'), 10);
      if (!isNaN(targetIndex)) {
        stopAutoplay();
        goToSlide(targetIndex);
        startAutoplay();
      }
    });
  });

  // Pause autoplay on mouse hover over hero
  hero.addEventListener('mouseenter', stopAutoplay);
  hero.addEventListener('mouseleave', startAutoplay);

  // Touch Swipe navigation for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  hero.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  hero.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    startAutoplay();
  }, { passive: true });

  // Initialize slide 0, dot 0, and tab 0
  goToSlide(0, false);

  // Start continuous loop
  startAutoplay();
}

// Client Feedback & Testimonial Carousel Controller
function initClientFeedback() {
  const container = document.getElementById('clientFeedback');
  if (!container) return;

  const slides = Array.from(container.querySelectorAll('.feedback-slide'));
  const dots = Array.from(container.querySelectorAll('.feedback-dot'));
  const total = slides.length;
  if (total === 0) return;

  let current = 1; // Default to Slide 2 (Ramya) as shown in user reference
  let timer = null;

  function showSlide(index) {
    current = (index + total) % total;
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === current);
    });
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === current);
    });
  }

  function next() {
    showSlide(current + 1);
  }

  function prev() {
    showSlide(current - 1);
  }

  // Bind all Prev and Next buttons inside slides
  container.querySelectorAll('.feedback-btn-prev').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      stopAuto();
      prev();
      startAuto();
    });
  });

  container.querySelectorAll('.feedback-btn-next').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      stopAuto();
      next();
      startAuto();
    });
  });

  // Bind pagination dots
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const target = parseInt(dot.getAttribute('data-slide'), 10);
      if (!isNaN(target)) {
        stopAuto();
        showSlide(target);
        startAuto();
      }
    });
  });

  function startAuto() {
    stopAuto();
    timer = setInterval(next, 7500);
  }

  function stopAuto() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  container.addEventListener('mouseenter', stopAuto);
  container.addEventListener('mouseleave', startAuto);

  // Touch Swipe navigation for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAuto();
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        next();
      } else {
        prev();
      }
    }
    startAuto();
  }, { passive: true });

  startAuto();
}

// Atelier Interactive Milestone Count-Up Statistics
function initStatCounters() {
  const statCounters = document.querySelectorAll('.stat-counter');
  if (!statCounters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;
    const duration = 1800; // ms
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo for luxury deceleration
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(easeProgress * target);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    };
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.25
  });

  statCounters.forEach(counter => observer.observe(counter));
}

// Atelier FAQ Interactive Accordion
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const panel = item.querySelector('.faq-answer-panel');
    if (!btn || !panel) return;

    // Set initial open state
    if (item.classList.contains('is-open')) {
      panel.style.maxHeight = panel.scrollHeight + 'px';
      btn.setAttribute('aria-expanded', 'true');
    } else {
      panel.style.maxHeight = null;
      btn.setAttribute('aria-expanded', 'false');
    }

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all other open items
      faqItems.forEach(other => {
        if (other !== item && other.classList.contains('is-open')) {
          other.classList.remove('is-open');
          const otherBtn = other.querySelector('.faq-question-btn');
          const otherPanel = other.querySelector('.faq-answer-panel');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherPanel) otherPanel.style.maxHeight = null;
        }
      });

      // Toggle this item
      if (isOpen) {
        item.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
      } else {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  // Re-calculate heights if window resizes while an item is open
  window.addEventListener('resize', () => {
    const openItem = document.querySelector('.faq-item.is-open');
    if (openItem) {
      const openPanel = openItem.querySelector('.faq-answer-panel');
      if (openPanel) {
        openPanel.style.maxHeight = openPanel.scrollHeight + 'px';
      }
    }
  });
}
