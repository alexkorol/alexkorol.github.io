const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const themeToggle = document.querySelector('.theme-toggle');
const yearNode = document.getElementById('year');
const NAV_OPEN_CLASS = 'is-open';
const THEME_KEY = 'alexkorol-theme';

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const applyTheme = (theme) => {
  body.dataset.theme = theme;
  if (themeToggle) {
    const label = theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme';
    themeToggle.setAttribute('aria-label', label);
  }
};

const storedTheme = localStorage.getItem(THEME_KEY);
const lightPreferenceQuery = window.matchMedia('(prefers-color-scheme: light)');
applyTheme(storedTheme ?? (lightPreferenceQuery.matches ? 'light' : 'dark'));

const handleThemePreference = (event) => {
  const hasStoredPreference = Boolean(localStorage.getItem(THEME_KEY));
  if (!hasStoredPreference) {
    applyTheme(event.matches ? 'light' : 'dark');
  }
};

if (typeof lightPreferenceQuery.addEventListener === 'function') {
  lightPreferenceQuery.addEventListener('change', handleThemePreference);
} else if (typeof lightPreferenceQuery.addListener === 'function') {
  lightPreferenceQuery.addListener(handleThemePreference);
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const newTheme = body.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
  });
}

const closeNav = () => {
  if (!siteNav) return;
  siteNav.classList.remove(NAV_OPEN_CLASS);
  if (navToggle) {
    navToggle.classList.remove(NAV_OPEN_CLASS);
    navToggle.setAttribute('aria-expanded', 'false');
  }
};

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle(NAV_OPEN_CLASS);
    navToggle.classList.toggle(NAV_OPEN_CLASS, isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('click', (event) => {
    if (!siteNav.classList.contains(NAV_OPEN_CLASS)) return;
    const target = event.target;
    const clickedToggle = target === navToggle || navToggle.contains(target);
    const clickedNav = target === siteNav || siteNav.contains(target);
    if (!clickedToggle && !clickedNav) {
      closeNav();
    }
  });

  window.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') {
      closeNav();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) {
      closeNav();
    }
  });
}

const revealNodes = document.querySelectorAll('[data-reveal]');
if (revealNodes.length) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  });
};

const hydrateProjectStats = (card, data) => {
  const starsNode = card.querySelector('.project-card__stat--stars span');
  const updatedNode = card.querySelector('.project-card__stat--updated');

  if (starsNode) {
    const stars = data.stargazers_count ?? 0;
    starsNode.textContent = `${stars} star${stars === 1 ? '' : 's'}`;
  }

  if (updatedNode) {
    updatedNode.textContent = `Updated ${formatDate(data.pushed_at)}`;
  }
};

const projectCards = document.querySelectorAll('.project-card[data-repo]');
if (projectCards.length) {
  projectCards.forEach((card) => {
    const repo = card.getAttribute('data-repo');
    if (!repo) return;

    fetch(`https://api.github.com/repos/${repo}`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load repository data');
        return response.json();
      })
      .then((data) => {
        hydrateProjectStats(card, data);
      })
      .catch(() => {
        hydrateProjectStats(card, { stargazers_count: 0, pushed_at: null });
      });
  });
}
