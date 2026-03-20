// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ─── CURSOR ───────────────────────────────────────────────────────────────────
function initCursor() {
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.to(cursor, { x: mouseX - 6, y: mouseY - 6, duration: 0.1 });
  });

  function animateFollower() {
    followerX += (mouseX - followerX - 18) * 0.12;
    followerY += (mouseY - followerY - 18) * 0.12;
    gsap.set(follower, { x: followerX, y: followerY });
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, .card, .roi-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursor, { scale: 2, duration: 0.3 });
      gsap.to(follower, { scale: 1.5, borderColor: 'var(--lavender)', duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(cursor, { scale: 1, duration: 0.3 });
      gsap.to(follower, { scale: 1, borderColor: 'var(--accent)', duration: 0.3 });
    });
  });
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Hamburger
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      if (mobileNav.classList.contains('open')) {
        gsap.to(spans[0], { rotation: 45, y: 7, duration: 0.3 });
        gsap.to(spans[1], { opacity: 0, duration: 0.3 });
        gsap.to(spans[2], { rotation: -45, y: -7, duration: 0.3 });
      } else {
        gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
        gsap.to(spans[1], { opacity: 1, duration: 0.3 });
        gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.3 });
      }
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
      });
    });
  }

  // Set active link
  const currentPage = window.location.pathname;
  document.querySelectorAll('.navbar-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage ||
        (currentPage === '/' && link.getAttribute('href') === 'index.html') ||
        currentPage.includes(link.getAttribute('href').replace('.html', ''))) {
      link.classList.add('active');
    }
  });
}

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
}

// ─── HERO ANIMATIONS ──────────────────────────────────────────────────────────
function initHeroAnimations() {
  const heroElements = document.querySelectorAll('.hero-animate');
  if (heroElements.length === 0) return;

  gsap.fromTo(heroElements, 
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out', delay: 0.3 }
  );
}

// ─── PARTICLES ────────────────────────────────────────────────────────────────
function initParticles() {
  const container = document.querySelector('.particles');
  if (!container) return;

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
    particle.style.animationDelay = (Math.random() * 10) + 's';
    particle.style.width = particle.style.height = (Math.random() * 3 + 1) + 'px';
    container.appendChild(particle);
  }
}

// ─── CHAT MOCKUP ANIMATION ────────────────────────────────────────────────────
function initChatAnimation() {
  const screens = document.querySelectorAll('.phone-screen .chat-messages');
  if (screens.length === 0) return;

  screens.forEach(screen => {
    const messages = screen.querySelectorAll('.message, .typing-indicator');
    let index = 0;

    function showNextMessage() {
      if (index >= messages.length) {
        setTimeout(() => {
          messages.forEach(m => {
            gsap.to(m, { opacity: 0, y: 10, duration: 0.4 });
          });
          setTimeout(() => {
            messages.forEach(m => {
              gsap.set(m, { opacity: 0, y: 10 });
            });
            index = 0;
            setTimeout(showNextMessage, 1000);
          }, 600);
        }, 3000);
        return;
      }

      const msg = messages[index];

      if (msg.classList.contains('typing-indicator')) {
        gsap.to(msg, { opacity: 1, y: 0, duration: 0.3 });
        setTimeout(() => {
          gsap.to(msg, { opacity: 0, y: -5, duration: 0.2 });
          setTimeout(() => {
            index++;
            showNextMessage();
          }, 300);
        }, 1200);
      } else {
        gsap.to(msg, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.2)' });
        index++;
        setTimeout(showNextMessage, 800);
      }
    }

    setTimeout(showNextMessage, 1500);
  });
}

// ─── NUMBER COUNTER ───────────────────────────────────────────────────────────
function initCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';

    ScrollTrigger.create({
      trigger: el,
      onEnter: () => {
        gsap.fromTo({ val: 0 },
          { val: target },
          {
            val: target,
            duration: 1.2,
            ease: 'power2.out',
            onUpdate: function() {
              el.textContent = prefix + Math.ceil(this.targets()[0].val) + suffix;
            }
          }
        );
      },
      once: true
    });
  });
}

// ─── FAQ ACCORDION ────────────────────────────────────────────────────────────
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
      });

      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

// ─── SVG PATH DRAW ON SCROLL ──────────────────────────────────────────────────
function initSVGDraw() {
  document.querySelectorAll('.svg-path-animated').forEach(path => {
    ScrollTrigger.create({
      trigger: path,
      onEnter: () => path.classList.add('drawn'),
      once: true
    });
  });
}

// ─── GSAP SCROLL ANIMATIONS ───────────────────────────────────────────────────
function initGSAPScrollAnimations() {
  // Stagger card groups
  document.querySelectorAll('.gsap-stagger').forEach(group => {
    const children = group.querySelectorAll('.card, .industry-card, .pricing-card, .roi-card, .timeline-step');
    gsap.fromTo(children,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: group,
          start: 'top 80%',
        }
      }
    );
  });

  // Section headings
  document.querySelectorAll('.gsap-heading').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        }
      }
    );
  });

  // How it works scroll-pinned panels (if on that page)
  if (document.querySelector('.hiw-panel')) {
    initHIWPanels();
  }
}

// ─── HOW IT WORKS PANELS ──────────────────────────────────────────────────────
function initHIWPanels() {
  const panels = document.querySelectorAll('.hiw-panel');

  panels.forEach((panel, i) => {
    const content = panel.querySelector('.hiw-content');
    const illustration = panel.querySelector('.hiw-illustration');

    gsap.fromTo(content,
      { opacity: 0, x: i % 2 === 0 ? -60 : 60 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: panel,
          start: 'top 70%',
        }
      }
    );

    if (illustration) {
      gsap.fromTo(illustration,
        { opacity: 0, x: i % 2 === 0 ? 60 : -60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: panel,
            start: 'top 70%',
          }
        }
      );
    }
  });
}

// ─── HORIZONTAL DASHED LINE DRAW ─────────────────────────────────────────────
function initDashedLine() {
  const line = document.querySelector('.step-connector-line');
  if (!line) return;

  gsap.fromTo(line,
    { strokeDashoffset: 1000 },
    {
      strokeDashoffset: 0,
      duration: 2,
      ease: 'none',
      scrollTrigger: {
        trigger: line,
        start: 'top 80%',
      }
    }
  );
}

// ─── PRICING CARD GLOW PULSE ─────────────────────────────────────────────────
function initPricingGlow() {
  const featured = document.querySelector('.pricing-card-featured');
  if (!featured) return;

  gsap.to(featured, {
    boxShadow: '0 0 60px rgba(209,70,42,0.5)',
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
}

// ─── SHIELD SVG ANIMATION ─────────────────────────────────────────────────────
function initShieldAnimation() {
  const shield = document.querySelector('.shield-svg');
  if (!shield) return;

  const outline = shield.querySelector('.shield-outline');
  const fill = shield.querySelector('.shield-fill');
  const check = shield.querySelector('.shield-check');

  ScrollTrigger.create({
    trigger: shield,
    start: 'top 80%',
    onEnter: () => {
      if (outline) {
        gsap.to(outline, { strokeDashoffset: 0, duration: 1, ease: 'power2.out' });
      }
      if (fill) {
        gsap.to(fill, { opacity: 1, duration: 0.5, delay: 0.8 });
      }
      if (check) {
        gsap.to(check, { strokeDashoffset: 0, duration: 0.6, delay: 1.4, ease: 'power2.out' });
      }
    },
    once: true
  });
}

// ─── SPOT BADGES ANIMATION ───────────────────────────────────────────────────
function initSpotBadge() {
  const badge = document.querySelector('.scarcity-badge');
  if (!badge) return;

  gsap.to(badge, {
    scale: 1.04,
    duration: 1.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
}

// ─── PRICE STRIKETHROUGH ANIMATION ─────────────────────────────────────────────
function initPriceStrike() {
  const strikethrough = document.querySelector('.price-strike-line');
  if (!strikethrough) return;

  gsap.fromTo(strikethrough,
    { width: 0 },
    { width: '100%', duration: 0.5, delay: 0.6, ease: 'power2.out' }
  );
}

// ─── INIT ALL ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNavbar();
  initScrollReveal();
  initHeroAnimations();
  initParticles();
  initChatAnimation();
  initCounters();
  initFAQ();
  initSVGDraw();
  initGSAPScrollAnimations();
  initDashedLine();
  initPricingGlow();
  initShieldAnimation();
  initSpotBadge();
  initPriceStrike();
});
