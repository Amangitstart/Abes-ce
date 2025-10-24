(function () {
  const rootElement = document.documentElement;
  const themeToggleButton = document.getElementById('themeToggle');
  const navToggleButton = document.getElementById('navToggle');
  const navLinksList = document.getElementById('navLinks');

  // Initialize theme from localStorage or prefers-color-scheme
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  setTheme(initialTheme);

  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
      const newTheme = rootElement.classList.contains('dark') ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  function setTheme(theme) {
    const isDark = theme === 'dark';
    rootElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);
    if (themeToggleButton) {
      themeToggleButton.setAttribute('aria-pressed', String(isDark));
      themeToggleButton.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    }
  }

  // Mobile nav toggle
  if (navToggleButton) {
    navToggleButton.addEventListener('click', () => {
      const isOpen = document.body.classList.toggle('nav-open');
      navToggleButton.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Close mobile nav on link click
  navLinksList?.querySelectorAll('a.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (document.body.classList.contains('nav-open')) {
        document.body.classList.remove('nav-open');
        navToggleButton?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Active section highlighting using IntersectionObserver
  const sectionIds = ['home', 'about', 'skills', 'projects', 'contact'];
  const sectionElements = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
  const navLinkMap = new Map();
  sectionIds.forEach((id) => {
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) navLinkMap.set(id, link);
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id;
        const link = navLinkMap.get(sectionId);
        if (!link) return;
        if (entry.isIntersecting) {
          document.querySelectorAll('.nav-link').forEach((l) => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });

    sectionElements.forEach((el) => observer.observe(el));
  }

  // Dynamic year in footer
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear().toString();
})();
