// invite.studio — Global UX Polish Script
// Injected into all pages for progressive enhancements
// ============================================================
(function () {
  'use strict';

  // ── WhatsApp floating button ─────────────────────────────────
  function injectWhatsApp() {
    if (document.getElementById('wa-chat-btn')) return;
    const phone = '919999999999'; // placeholder
    const msg   = encodeURIComponent('Hi! I have a question about invite.studio');
    const link  = document.createElement('a');
    link.id     = 'wa-chat-btn';
    link.href   = `https://wa.me/${phone}?text=${msg}`;
    link.target = '_blank';
    link.rel    = 'noopener noreferrer';
    link.innerHTML = '💬';
    link.setAttribute('aria-label', 'Chat on WhatsApp');
    document.body.appendChild(link);

    const tip = document.createElement('span');
    tip.id = 'wa-chat-tooltip';
    tip.textContent = 'Chat with us';
    document.body.appendChild(tip);
  }

  // ── Smooth scroll for all anchor links ──────────────────────
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ── Lazy-load images (native + fallback) ─────────────────────
  function initLazyImages() {
    // Add loading="lazy" to all images without it
    document.querySelectorAll('img:not([loading])').forEach((img, i) => {
      if (i > 1) img.setAttribute('loading', 'lazy'); // skip first 2 (above fold)
    });

    // Fade in images on load
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.4s ease';
      if (img.complete) {
        img.style.opacity = '1';
      } else {
        img.addEventListener('load', () => { img.style.opacity = '1'; });
        img.addEventListener('error', () => {
          // On error, replace with gradient placeholder
          img.style.opacity = '0.4';
          img.style.filter = 'brightness(0.5)';
        });
      }
    });
  }

  // ── Animated counter for stat numbers ───────────────────────
  function animateCounter(el, target, duration) {
    const start = 0;
    const startTime = performance.now();
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(start + (target - start) * eased);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function initCounters() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const val = parseInt(el.dataset.count, 10);
          if (!isNaN(val)) animateCounter(el, val, 1800);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
  }

  // ── Scroll reveal with stagger ───────────────────────────────
  function initScrollReveal() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('v');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.r').forEach(el => obs.observe(el));
  }

  // ── Navbar hide/show on scroll ──────────────────────────────
  function initNavScroll() {
    const nav = document.querySelector('nav, .navbar, #navbar');
    if (!nav) return;
    let lastY = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > lastY && y > 120) {
        nav.style.transform = 'translateY(-100%)';
      } else {
        nav.style.transform = 'translateY(0)';
      }
      lastY = y;
    }, { passive: true });
  }

  // ── Hero parallax (CSS background-position) ─────────────────
  function initHeroParallax() {
    const heroImgLayers = document.querySelectorAll('.hero-img-layer');
    if (!heroImgLayers.length) return;
    // Only on desktop
    if (window.innerWidth < 768) return;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroImgLayers.forEach(layer => {
        layer.style.transform = `translateY(${y * 0.3}px)`;
      });
    }, { passive: true });
  }

  // ── Image error fallback ─────────────────────────────────────
  function initImgFallbacks() {
    document.querySelectorAll('img[data-fallback]').forEach(img => {
      img.addEventListener('error', function () {
        const fb = this.dataset.fallback;
        if (fb && this.src !== fb) this.src = fb;
      });
    });
  }

  // ── Init all ────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    injectWhatsApp();
    initSmoothScroll();
    initLazyImages();
    initCounters();
    initScrollReveal();
    initHeroParallax();
    initImgFallbacks();
  });

})();
