// ===================================================================
// AURASTAY — Shared behaviour across all four pages
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Header: solid on scroll ---------------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------- Mobile nav toggle ---------------- */
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------------- Scroll reveal (repeating trigger) ---------------- */
  const revealTargets = document.querySelectorAll('.reveal, .contour');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
  revealTargets.forEach(el => revealObserver.observe(el));

  document.querySelectorAll('.reveal-stagger').forEach(group => {
    Array.from(group.children).forEach((child, i) => {
      child.style.setProperty('--i', i);
      child.classList.add('reveal');
      revealObserver.observe(child);
    });
  });

  /* ---------------- Active nav link ---------------- */
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current) link.setAttribute('aria-current', 'page');
  });

  /* ---------------- Hero waitlist form (index.html) ---------------- */
  const heroForm = document.querySelector('.hero-form');
  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const input = heroForm.querySelector('input[type="email"]');
      if (!input || !input.checkValidity()) return;

      const formData = new FormData(heroForm);

      fetch(heroForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then((response) => {
          if (response.ok) {
            input.value = '';
            input.placeholder = "You're on the list — we'll be in touch.";
          } else {
            input.placeholder = "Something went wrong. Please try again.";
          }
        })
        .catch(() => {
          input.placeholder = "Something went wrong. Please try again.";
        });
    });
  }

  /* ---------------- Inquiry form (contact.html) ---------------- */
  const inquiryForm = document.querySelector('.inquiry-form');
  if (inquiryForm) {
    const status = inquiryForm.querySelector('.form-status');
    inquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!inquiryForm.checkValidity()) {
        inquiryForm.reportValidity();
        return;
      }

      status.textContent = 'Sending your request…';
      status.removeAttribute('data-state');

      try {
        const res = await fetch(inquiryForm.action, {
          method: 'POST',
          body: new FormData(inquiryForm),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          status.textContent = 'Thank you — your inquiry has been sent. We reply within two business days.';
          status.dataset.state = 'success';
          inquiryForm.reset();
        } else {
          status.textContent = 'Something went wrong sending your request. Please try again or email us directly.';
          status.dataset.state = 'error';
        }
      } catch (err) {
        status.textContent = 'Network error — please try again or email us directly.';
        status.dataset.state = 'error';
      }
    });
  }

  /* ---------------- Burger menu open/close + blur background ---------------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navOverlay = document.querySelector('.nav-overlay');

  if (navToggle && navLinks && navOverlay) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';

      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navLinks.classList.toggle('is-open');
      navOverlay.classList.toggle('is-open');
      document.body.classList.toggle('nav-open');
    });

    navOverlay.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('is-open');
      navOverlay.classList.remove('is-open');
      document.body.classList.remove('nav-open');
    });
  }

});