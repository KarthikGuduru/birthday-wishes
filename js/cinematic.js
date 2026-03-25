// invite.studio — Cinematic Transitions
// Framer-quality scroll-driven reveals: clip-path wipes, line-by-line text, parallax
// ============================================================
(function () {
  'use strict';

  const EASING = 'cubic-bezier(0.23, 1, 0.32, 1)';

  // ── 1. SPLIT TEXT INTO LINES for line-by-line reveal ────────
  function splitLines(el) {
    if (el.dataset.split === 'done') return;
    el.dataset.split = 'done';
    // Wrap each word in a span, then group by rendered line
    const text = el.innerText;
    el.innerHTML = '';
    text.split(' ').forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'word-wrap';
      span.style.cssText = 'display:inline-block; overflow:hidden; vertical-align:bottom;';
      const inner = document.createElement('span');
      inner.className = 'word-inner';
      inner.textContent = word + (i < text.split(' ').length - 1 ? '\u00a0' : '');
      inner.style.cssText = 'display:inline-block; transform:translateY(110%); opacity:0; will-change:transform,opacity;';
      span.appendChild(inner);
      el.appendChild(span);
    });
  }

  function revealLines(el, delay) {
    const words = el.querySelectorAll('.word-inner');
    words.forEach((w, i) => {
      const d = delay + i * 38;
      w.style.transition = `transform 0.72s ${EASING} ${d}ms, opacity 0.72s ease-out ${d}ms`;
      w.style.transform = 'translateY(0)';
      w.style.opacity = '1';
    });
  }

  // ── 2. CLIP-PATH SECTION REVEAL ──────────────────────────────
  // Section enters from bottom: clip-path: inset(100% 0 0 0) → inset(0 0 0 0)
  function initSectionClipReveal() {
    const sections = document.querySelectorAll('section[id]:not(#hero)');
    sections.forEach(sec => {
      sec.style.clipPath = 'inset(6% 0 0 0)';
      sec.style.opacity = '0';
      sec.style.transition = `clip-path 0.9s ${EASING}, opacity 0.7s ease-out`;
      sec.style.willChange = 'clip-path, opacity';
    });

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.clipPath = 'inset(0 0 0 0)';
          e.target.style.opacity = '1';
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });

    sections.forEach(sec => obs.observe(sec));
  }

  // ── 3. PARALLAX on hero background ──────────────────────────
  function initParallax() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const layer = hero.querySelector('.hero-img-layer');
    if (!layer) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const speed = 0.35;
        layer.style.transform = `translateY(${y * speed}px)`;
        ticking = false;
      });
    }, { passive: true });
  }

  // ── 4. HEADLINE LETTER-SPACING BREATHE on scroll enter ──────
  // Hero names: compress letter-spacing → expand on reveal
  function initNameReveal() {
    const names = document.querySelector('.hero-names, .hero-title');
    if (!names) return;
    names.style.letterSpacing = '0.35em';
    names.style.opacity = '0';
    names.style.transform = 'translateY(32px)';
    names.style.transition = `opacity 1.1s ${EASING} 0.3s, transform 1.1s ${EASING} 0.3s, letter-spacing 1.4s ${EASING} 0.2s`;

    setTimeout(() => {
      names.style.opacity = '1';
      names.style.transform = 'translateY(0)';
      names.style.letterSpacing = '0.06em';
    }, 400);
  }

  // ── 5. CARD SCALE-IN stagger (image cards, event cards) ──────
  function initCardReveal() {
    const cards = document.querySelectorAll(
      '.event-card, .venue-card, .gallery-item, .inv-card, .ceremony-card, .step-card'
    );
    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.94) translateY(28px)';
      card.style.transition = `opacity 0.65s ${EASING}, transform 0.65s ${EASING}`;
      card.style.willChange = 'opacity, transform';
    });

    const obs = new IntersectionObserver((entries) => {
      // Batch stagger
      const visible = entries.filter(e => e.isIntersecting);
      visible.forEach((e, i) => {
        const delay = i * 80;
        e.target.style.transitionDelay = `${delay}ms`;
        e.target.style.opacity = '1';
        e.target.style.transform = 'scale(1) translateY(0)';
        setTimeout(() => { e.target.style.transitionDelay = ''; }, 800 + delay);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

    cards.forEach(c => obs.observe(c));
  }

  // ── 6. SECTION TITLE slide-up line reveal ───────────────────
  function initTitleReveal() {
    const titles = document.querySelectorAll(
      '.section-title, .section-heading, h2.title, .sec-title, .inv-names-script'
    );
    titles.forEach(title => {
      title.style.overflow = 'hidden';
      title.style.display = 'block';
    });

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const delay = parseInt(el.dataset.delay || 0);
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = `opacity 0.8s ${EASING} ${delay}ms, transform 0.8s ${EASING} ${delay}ms`;
        // Trigger
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          });
        });
        obs.unobserve(el);
      });
    }, { threshold: 0.2 });

    titles.forEach(t => obs.observe(t));
  }

  // ── 7. IMAGE ZOOM-IN on enter ────────────────────────────────
  function initImageReveal() {
    const imgs = document.querySelectorAll(
      '.gallery-item img, .venue-img, .hero-photo, .couple-photo'
    );
    imgs.forEach(img => {
      img.style.transform = 'scale(1.08)';
      img.style.opacity = '0';
      img.style.transition = `transform 1.1s ${EASING}, opacity 0.8s ease-out`;
    });

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.style.transform = 'scale(1)';
        e.target.style.opacity = '1';
        obs.unobserve(e.target);
      });
    }, { threshold: 0.15 });

    imgs.forEach(i => obs.observe(i));
  }

  // ── 8. SECTION EYEBROW fade + slide from left ───────────────
  function initEyebrowReveal() {
    const eyebrows = document.querySelectorAll('.section-eyebrow, .section-label, .sec-tag');
    eyebrows.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(-24px)';
      el.style.transition = `opacity 0.6s ease-out, transform 0.6s ${EASING}`;
    });

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateX(0)';
        obs.unobserve(e.target);
      });
    }, { threshold: 0.3 });

    eyebrows.forEach(e => obs.observe(e));
  }

  // ── 9. HORIZONTAL DIVIDER draw animation ────────────────────
  function initDividerDraw() {
    const dividers = document.querySelectorAll('.divider-line, .section-divider-line');
    dividers.forEach(el => {
      el.style.transformOrigin = 'left center';
      el.style.transform = 'scaleX(0)';
      el.style.transition = `transform 0.9s ${EASING}`;
    });

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.style.transform = 'scaleX(1)';
        obs.unobserve(e.target);
      });
    }, { threshold: 0.5 });

    dividers.forEach(d => obs.observe(d));
  }

  // ── 10. HERO SUBTITLE / DATE stagger ────────────────────────
  function initHeroStagger() {
    const items = document.querySelectorAll('.hero-content > *');
    items.forEach((el, i) => {
      if (el.classList.contains('hero-garland') || el.classList.contains('hero-diya')) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = `opacity 0.8s ease-out ${300 + i * 120}ms, transform 0.8s ${EASING} ${300 + i * 120}ms`;
    });

    // Trigger after loading screen
    function triggerHero() {
      items.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }

    const loader = document.getElementById('loading-screen') || document.getElementById('loader');
    if (loader) {
      const mo = new MutationObserver(() => {
        if (loader.style.display === 'none' || loader.style.opacity === '0') {
          setTimeout(triggerHero, 200);
          mo.disconnect();
        }
      });
      mo.observe(loader, { attributes: true, attributeFilter: ['style', 'class'] });
    } else {
      setTimeout(triggerHero, 300);
    }
  }

  // ── Init ────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    // Skip clip reveals if reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    initParallax();
    initSectionClipReveal();
    initNameReveal();
    initCardReveal();
    initTitleReveal();
    initImageReveal();
    initEyebrowReveal();
    initDividerDraw();
    initHeroStagger();
  });

})();
