/* ═══════════════════════════════════════════════════════════════
   GameTower Official Website — Shared JavaScript Module v2
   Features: Carousel, Theme Toggle, News Tabs, Scroll Reveal,
             Featured Panel Sync, Mobile Menu, Back-to-Top,
             Stats Counter Animation
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Theme Toggle ── */
  const html = document.documentElement;
  const stored = localStorage.getItem('gt-theme');
  if (stored) html.setAttribute('data-theme', stored);
  else html.setAttribute('data-theme', 'dark');

  const toggleBtn = document.querySelector('.theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('gt-theme', next);
    });
  }

  /* ── Hero Carousel ── */
  const track = document.getElementById('carouselTrack');
  const dotsBox = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  if (track) {
    const slides = track.children;
    const total = slides.length;
    let current = 0;
    let autoTimer;

    // Build dots
    if (dotsBox) {
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Slide ' + (i + 1));
        dot.addEventListener('click', () => goTo(i));
        dotsBox.appendChild(dot);
      }
    }

    function goTo(n) {
      current = ((n % total) + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';

      // Update dots
      if (dotsBox) {
        dotsBox.querySelectorAll('.dot').forEach((d, i) =>
          d.classList.toggle('active', i === current)
        );
      }

      // Sync featured panels (Layout B)
      const panels = document.querySelectorAll('.feat-panel');
      if (panels.length) {
        panels.forEach((p, i) =>
          p.classList.toggle('active', i === current)
        );
      }

      resetAuto();
    }

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), 5000);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

    // Touch/swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        goTo(diff > 0 ? current + 1 : current - 1);
      }
    }, { passive: true });

    resetAuto();
  }

  /* ── News Tabs ── */
  const newsTabs = document.querySelectorAll('.news-tab');
  const newsItems = document.querySelectorAll('.news-item');

  newsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.dataset.cat;
      newsTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      newsItems.forEach(item => {
        if (cat === 'all' || item.dataset.cat === cat) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* ── Scroll Reveal ── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ── Stats Counter Animation ── */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statNumbers.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1600;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ── Mobile Menu ── */
  const hamburger = document.querySelector('.hamburger');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');

  if (hamburger && mobileOverlay) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileOverlay.classList.toggle('show');
      document.body.style.overflow = mobileOverlay.classList.contains('show') ? 'hidden' : '';
    });

    mobileOverlay.querySelectorAll('.mob-item').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileOverlay.classList.remove('show');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Back to Top ── */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
