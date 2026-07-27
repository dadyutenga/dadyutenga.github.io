// ============================================
// BIG LITE CODE — portfolio interactions
// ============================================

document.getElementById('year').textContent = new Date().getFullYear();

// --- Terminal typing effect ---------------------------------------------
const linesEl = document.getElementById('typedOut');
const cursorEl = document.getElementById('cursor');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const script = [
  { cmd: 'whoami', out: 'dady_nasser_utenga' },
  { cmd: 'cat role.txt', out: 'BEng Computing (Software Engineering) — DIT\nBrand: BIG LITE CODE' },
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
