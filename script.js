const toggleButton = document.getElementById('themeToggle');
const languageToggle = document.getElementById('languageToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const savedTheme = localStorage.getItem('theme');
const savedLanguage = localStorage.getItem('language');

let translations = {};

const metaRows = document.getElementById('metaRows');
const experienceList = document.getElementById('experienceList');
const internshipsList = document.getElementById('internshipsList');
const projectsList = document.getElementById('projectsList');
const skillsTable = document.getElementById('skillsTable');
const educationList = document.getElementById('educationList');

async function loadTranslations() {
  try {
    const response = await fetch('cvContent.json');
    if (!response.ok) {
      throw new Error(`Failed to load translations (${response.status})`);
    }
    translations = await response.json();
    initializeLanguage();
  } catch (error) {
    console.error('Unable to load cvContent.json:', error);
  }
}

function renderJobs(lang) {
  const items = translations[lang].jobs;
  experienceList.innerHTML = items.map((job) => `
    <article class="job">
      <div class="job__rail"><span class="job__dot"></span></div>
      <div class="job__body">
        <div class="job__head">
          <h3>${job.title} <span class="job__dept">— ${job.dept}</span></h3>
          <p class="job__meta">${job.meta}</p>
        </div>
        <ul>
          ${job.bullets.map((bullet) => `<li>${bullet}</li>`).join('')}
        </ul>
      </div>
    </article>
  `).join('');
}

function renderInternships(lang) {
  const items = translations[lang].internships;
  internshipsList.innerHTML = items.map((intern) => `
    <div class="intern">
      <p class="intern__title">${intern.title} <span class="intern__org">— ${intern.org}</span></p>
      <p class="intern__meta">${intern.meta}</p>
      <p class="intern__desc">${intern.desc}</p>
      <p class="intern__transfer">${intern.transfer}</p>
    </div>
  `).join('');
}

function renderProjects(lang) {
  const items = translations[lang].projects;
  projectsList.innerHTML = items.map((project) => `
    <li><strong>${project.title}</strong> — ${project.text}</li>
  `).join('');
}

function renderSkills(lang) {
  const items = translations[lang].skills;
  const headers = translations[lang].skillHeaders;
  skillsTable.innerHTML = `
    <thead>
      <tr><th>${headers.category}</th><th>${headers.item}</th></tr>
    </thead>
    <tbody>
      ${items.map((skill) => `
        <tr>
          <td>${skill.category}</td>
          <td>${skill.items}</td>
        </tr>
      `).join('')}
    </tbody>
  `;
}

function renderEducation(lang) {
  const items = translations[lang].education;
  educationList.innerHTML = items.map((edu) => `
    <div class="edu">
      <p class="edu__title">${edu.title} <span class="edu__org">— ${edu.org}</span></p>
      <p class="edu__meta">${edu.meta}</p>
    </div>
  `).join('');
}

function renderMeta(lang) {
  const items = translations[lang].meta;
  metaRows.innerHTML = items.map((item) => {
    const valueHtml = item.href ? `<a href="${item.href}">${item.value}</a>` : item.value;
    return `
      <tr>
        <th>${item.label}</th>
        <td>${valueHtml}</td>
      </tr>
    `;
  }).join('');
}

function updateText(lang) {
  if (!translations[lang]) {
    return;
  }

  const current = translations[lang];

  document.documentElement.lang = lang === 'fr' ? 'fr-CA' : 'en-CA';

  document.querySelector('[data-i18n="role"]').textContent = current.role;
  document.querySelector('[data-i18n="degree"]').textContent = current.degree;
  document.querySelector('[data-i18n="summaryLabel"]').textContent = current.summaryLabel;
  document.querySelector('[data-i18n="summaryText"]').textContent = current.summaryText;
  document.querySelector('[data-i18n="experienceLabel"]').textContent = current.experienceLabel;
  document.querySelector('[data-i18n="internshipsLabel"]').textContent = current.internshipsLabel;
  document.querySelector('[data-i18n="projectsLabel"]').textContent = current.projectsLabel;
  document.querySelector('[data-i18n="skillsLabel"]').textContent = current.skillsLabel;
  document.querySelector('[data-i18n="educationLabel"]').textContent = current.educationLabel;
  document.querySelector('[data-i18n="footerText"]').textContent = current.footerText;

  renderMeta(lang);
  renderJobs(lang);
  renderInternships(lang);
  renderProjects(lang);
  renderSkills(lang);
  renderEducation(lang);
}

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark-mode', isDark);
  toggleButton.setAttribute('aria-pressed', String(isDark));
  toggleButton.textContent = isDark ? 'Light mode' : 'Dark mode';
  toggleButton.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
}

function applyLanguage(language) {
  if (!translations[language]) {
    return;
  }

  const isFrench = language === 'fr';
  languageToggle.setAttribute('aria-pressed', String(isFrench));
  languageToggle.textContent = isFrench ? 'Fr' : 'En';
  languageToggle.setAttribute('aria-label', isFrench ? 'Switch to English' : 'Switch to French');
  updateText(language);
}

function initializeTheme() {
  const theme = savedTheme || (prefersDarkScheme.matches ? 'dark' : 'light');
  applyTheme(theme);
}

function initializeLanguage() {
  const language = savedLanguage || 'en';
  applyLanguage(language);
}

toggleButton.addEventListener('click', () => {
  const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
  localStorage.setItem('theme', nextTheme);
  applyTheme(nextTheme);
});

languageToggle.addEventListener('click', () => {
  const nextLanguage = document.documentElement.lang === 'fr-CA' ? 'en' : 'fr';
  localStorage.setItem('language', nextLanguage);
  applyLanguage(nextLanguage);
});

initializeTheme();
loadTranslations();
