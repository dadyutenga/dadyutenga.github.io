// ============================================
// BIG LITE CODE — portfolio interactions
// ============================================

document.getElementById('year').textContent = new Date().getFullYear();

// --- Terminal typing effect ---------------------------------------------
const linesEl = document.getElementById('typedOut');
const cursorEl = document.getElementById('cursor');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const script = [
  { cmd: 'whoami', out: 'dadi_nasser_utenga' },
  { cmd: 'cat role.txt', out: 'Full-stack development' },
  { cmd: 'ls skills/', out: 'full-stack/  offensive-security/  hardware-iot/  ai-ml/' },
  { cmd: 'echo $STATUS', out: 'shipping real products alongside coursework ✅' },
];

async function typeLine(text, el, speed = 28){
  for (let i = 0; i < text.length; i++){
    el.textContent += text[i];
    await new Promise(r => setTimeout(r, speed));
  }
}

async function runTerminal(){
  if (!linesEl) return;

  if (prefersReducedMotion){
    linesEl.textContent = script.map(l => `$ ${l.cmd}\n${l.out}`).join('\n\n');
    return;
  }

  for (const line of script){
    const cmdSpan = document.createElement('div');
    linesEl.appendChild(cmdSpan);
    cmdSpan.textContent = '$ ';
    await typeLine(line.cmd, cmdSpan, 32);
    await new Promise(r => setTimeout(r, 200));

    const outSpan = document.createElement('div');
    outSpan.style.color = 'var(--muted)';
    linesEl.appendChild(outSpan);
    await typeLine(line.out, outSpan, 10);
    await new Promise(r => setTimeout(r, 450));
  }
}

runTerminal();

// --- GitHub projects loader -----------------------------------------------
const projectsGrid = document.getElementById('githubProjects');
const orgsGrid = document.getElementById('githubOrgs');

function formatRepoDate(dateString){
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(new Date(dateString));
}

function humanizeRepoName(name){
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, character => character.toUpperCase());
}

function createProjectCard(repo){
  const card = document.createElement('article');
  card.className = 'project-card';

  const top = document.createElement('div');
  top.className = 'project-top';

  const tag = document.createElement('span');
  tag.className = 'project-tag';
  tag.textContent = repo.language || 'Repository';

  const link = document.createElement('a');
  link.className = 'project-link';
  link.href = repo.html_url;
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = 'GitHub';

  top.append(tag, link);

  const title = document.createElement('h3');
  title.textContent = humanizeRepoName(repo.name);

  const description = document.createElement('p');
  description.textContent = repo.description || 'Public repository from the BIG LITE CODE workspace.';

  const stack = document.createElement('div');
  stack.className = 'project-stack';

  const languageChip = document.createElement('span');
  languageChip.textContent = repo.language || 'Code';

  const starsChip = document.createElement('span');
  starsChip.textContent = `${repo.stargazers_count} stars`;

  const updatedChip = document.createElement('span');
  updatedChip.textContent = `Updated ${formatRepoDate(repo.pushed_at || repo.updated_at)}`;

  stack.append(languageChip, starsChip, updatedChip);
  card.append(top, title, description, stack);
  return card;
}

async function loadGithubProjects(){
  if (!projectsGrid) return;

  projectsGrid.innerHTML = '<article class="project-card project-card-loading"><p>Loading public GitHub repositories...</p></article>';

  try {
    const response = await fetch('https://api.github.com/users/dadyutenga/repos?sort=updated&per_page=100');

    if (!response.ok) {
      throw new Error(`GitHub request failed with ${response.status}`);
    }

    const repos = await response.json();
    const featuredRepos = repos
      .filter(repo => !repo.fork && !repo.archived && repo.name !== 'dadyutenga.github.io')
      .sort((left, right) => new Date(right.pushed_at) - new Date(left.pushed_at))
      .slice(0, 6);

    if (!featuredRepos.length) {
      projectsGrid.innerHTML = '<article class="project-card project-card-loading"><p>No public repositories found yet.</p></article>';
      return;
    }

    projectsGrid.innerHTML = '';
    featuredRepos.forEach(repo => projectsGrid.appendChild(createProjectCard(repo)));
  } catch (error) {
    projectsGrid.innerHTML = '<article class="project-card project-card-loading"><p>Could not load GitHub repositories right now.</p></article>';
  }
}

loadGithubProjects();

function createOrgCard(org){
  const card = document.createElement('a');
  card.className = 'org-card';
  card.href = org.html_url;
  card.target = '_blank';
  card.rel = 'noopener';

  const avatar = document.createElement('img');
  avatar.className = 'org-avatar';
  avatar.src = org.avatar_url;
  avatar.alt = `${org.login} avatar`;

  const name = document.createElement('span');
  name.className = 'org-name';
  name.textContent = org.login;

  const meta = document.createElement('span');
  meta.className = 'org-meta';
  meta.textContent = org.description || 'GitHub organization';

  card.append(avatar, name, meta);
  return card;
}

async function loadGithubOrganizations(){
  if (!orgsGrid) return;

  orgsGrid.innerHTML = '<article class="org-card org-card-loading"><p>Loading GitHub organizations...</p></article>';

  try {
    const response = await fetch('https://api.github.com/users/dadyutenga/orgs');

    if (!response.ok) {
      throw new Error(`GitHub request failed with ${response.status}`);
    }

    const orgs = await response.json();

    if (!orgs.length) {
      orgsGrid.innerHTML = '<article class="org-card org-card-loading"><p>No public organizations found.</p></article>';
      return;
    }

    orgsGrid.innerHTML = '';
    orgs.forEach(org => orgsGrid.appendChild(createOrgCard(org)));
  } catch (error) {
    orgsGrid.innerHTML = '<article class="org-card org-card-loading"><p>Could not load GitHub organizations right now.</p></article>';
  }
}

loadGithubOrganizations();

// --- Scroll-spy: highlight active tab -------------------------------------
const tabs = document.querySelectorAll('.tab');
const sections = Array.from(tabs).map(t => document.querySelector(t.getAttribute('href')));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const id = '#' + entry.target.id;
      tabs.forEach(t => t.classList.toggle('active', t.getAttribute('href') === id));
    }
  });
}, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

sections.forEach(s => s && observer.observe(s));

// --- Mobile menu toggle -----------------------------------------------------
const menuToggle = document.getElementById('menuToggle');
const tabsList = document.querySelector('.tabs');

if (menuToggle && tabsList){
  menuToggle.addEventListener('click', () => {
    const isOpen = tabsList.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabsList.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
}
