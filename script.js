/**
 * COCONUTS BEACH BAR — script.js
 * Minimal vanilla JS for navbar, mobile menu & scroll animations
 */

(function () {
  'use strict';

  /* ===========================
     NAVBAR — scroll behaviour
     =========================== */
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  function handleScroll() {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on load

  /* ===========================
     HAMBURGER MENU
     =========================== */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = navMenu.querySelectorAll('.nav-link, .nav-cta');

  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : !navMenu.classList.contains('open');
    navMenu.classList.toggle('open', isOpen);
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => toggleMenu());

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleMenu(false);
      hamburger.focus();
    }
  });

  /* ===========================
     INTERSECTION OBSERVER — reveal animations
     =========================== */
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target); // animate once
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all immediately
    reveals.forEach(el => el.classList.add('in-view'));
  }

  /* ===========================
     SMOOTH SCROLL — for anchor links
     =========================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = navbar.offsetHeight;
      const targetY = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });

  /* ===========================
     STAGGERED card reveals
     =========================== */
  // Apply stagger delay to grid children
  document.querySelectorAll('.services-grid, .kythnos-grid, .beach-features, .reach-options, .about-pillars').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  /* ===========================
     COCKTAIL GALLERY LIGHTBOX
     =========================== */
  const gallery = document.querySelectorAll('.cocktail-item');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbCaption = document.getElementById('lightboxCaption');
  const lbClose = document.getElementById('lightboxClose');
  const lbPrev = document.getElementById('lightboxPrev');
  const lbNext = document.getElementById('lightboxNext');

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const item = gallery[index];
    const img = item.querySelector('img');
    const name = item.querySelector('.cocktail-name');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = name ? name.textContent : '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    gallery[currentIndex].focus();
  }

  function showNext() {
    openLightbox((currentIndex + 1) % gallery.length);
  }

  function showPrev() {
    openLightbox((currentIndex - 1 + gallery.length) % gallery.length);
  }

  // Make gallery items keyboard-accessible and clickable
  gallery.forEach((item, i) => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `View cocktail: ${item.querySelector('.cocktail-name')?.textContent || 'photo'}`);
    item.addEventListener('click', () => openLightbox(i));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbNext.addEventListener('click', showNext);
  lbPrev.addEventListener('click', showPrev);

  // Keyboard navigation inside lightbox
  lightbox.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // Click backdrop to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });


})();
