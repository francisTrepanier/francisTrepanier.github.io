const toggleButton = document.getElementById('themeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const savedTheme = localStorage.getItem('theme');

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark-mode', isDark);
  toggleButton.setAttribute('aria-pressed', String(isDark));
  toggleButton.textContent = isDark ? 'Light mode' : 'Dark mode';
  toggleButton.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
}

function initializeTheme() {
  const theme = savedTheme || (prefersDarkScheme.matches ? 'dark' : 'light');
  applyTheme(theme);
}

toggleButton.addEventListener('click', () => {
  const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
  localStorage.setItem('theme', nextTheme);
  applyTheme(nextTheme);
});

initializeTheme();
