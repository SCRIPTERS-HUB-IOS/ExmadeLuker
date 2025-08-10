// Canvas Setup
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let width, height;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}
resize();
window.addEventListener('resize', resize);

// Particle Class
class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.radius = Math.random() * 1.8 + 0.8;
    this.speedX = (Math.random() * 0.15) + 0.01;
    this.speedY = (Math.random() * 0.1) + 0.005;
    this.dirX = Math.random() < 0.5 ? -1 : 1;
    this.dirY = Math.random() < 0.5 ? -1 : 1;
    this.color = getComputedStyle(document.body).getPropertyValue('--neon-color').trim();
    this.alpha = 0.7 + Math.random() * 0.3;
  }
  update() {
    this.x += this.speedX * this.dirX;
    this.y += this.speedY * this.dirY;

    if (this.x < -10) this.x = width + 10;
    else if (this.x > width + 10) this.x = -10;

    if (this.y < -10) this.y = height + 10;
    else if (this.y > height + 10) this.y = -10;
  }
  draw() {
    const neonRgb = this.color.match(/\d+/g) || [0, 255, 255];
    const [r, g, b] = neonRgb.map(n => parseInt(n));
    const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 6);
    grd.addColorStop(0, `rgba(${r},${g},${b},${this.alpha})`);
    grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.beginPath();
    ctx.fillStyle = grd;
    ctx.shadowColor = `rgba(${r},${g},${b},${this.alpha})`;
    ctx.shadowBlur = this.radius * 6;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Init particles
const particles = [];
const PARTICLE_COUNT = 90;
for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

// Animate loop
function animate() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}
animate();

// Ripple effect on buttons
function addRippleEffect(elem) {
  elem.addEventListener('click', e => {
    const existingRipple = elem.querySelector('.ripple');
    if (existingRipple) existingRipple.remove();

    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    elem.appendChild(ripple);

    const rect = elem.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    ripple.addEventListener('animationend', () => ripple.remove());
  });
}

// Brightness slider
const brightnessSlider = document.getElementById('brightness-slider');
brightnessSlider.addEventListener('input', e => {
  const val = e.target.value;
  document.documentElement.style.setProperty('--brightness', val);
  document.body.style.filter = `brightness(${val})`;
});

// Themes
const themes = ['theme-black-white', 'theme-white-black'];
let currentThemeIndex = 0;

function applyTheme(idx) {
  themes.forEach(t => document.body.classList.remove(t));
  document.body.classList.add(themes[idx]);
  currentThemeIndex = idx;
  updateParticleColors();
}

// Update particle colors on theme switch
function updateParticleColors() {
  const neonColor = getComputedStyle(document.body).getPropertyValue('--neon-color').trim();
  particles.forEach(p => {
    p.color = neonColor;
  });
}

// DOM container
const pageContainer = document.getElementById('page-container');

// Fade helpers
function fadeOut(element, callback) {
  element.classList.add('fade-out');
  element.classList.remove('fade-in');
  element.addEventListener('animationend', () => {
    callback();
    element.classList.remove('fade-out');
    element.classList.add('fade-in');
  }, { once: true });
}

// Render Main Menu
function renderMainMenu() {
  fadeOut(pageContainer, () => {
    pageContainer.innerHTML = '';

    const btnMethods = document.createElement('button');
    btnMethods.textContent = 'Methods';
    btnMethods.className = 'btn';
    addRippleEffect(btnMethods);
    btnMethods.addEventListener('click', () => renderMethodsPage());
    pageContainer.appendChild(btnMethods);

    const btnDiscord = document.createElement('a');
    btnDiscord.href = 'https://discord.gg/skDSzwCScu';
    btnDiscord.target = '_blank';
    btnDiscord.rel = 'noopener noreferrer';
    btnDiscord.className = 'btn discord';
    btnDiscord.innerHTML = `
      <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="${getComputedStyle(document.body).getPropertyValue('--neon-color')}">
        <path d="M297.216 243.2c-13.248 0-24 11.552-24 25.856 0 14.08 10.688 25.6 24 25.6 13.184 0 24-11.52 24-25.6 0-14.304-10.688-25.856-24-25.856zm146.624-52.8c-6.208-6.464-16-7.296-23.04-2.816-34.432 20.736-70.016 32.448-107.84 32.448-37.824 0-73.408-11.712-107.84-32.448-7.04-4.48-16.896-3.648-23.04 2.816-22.08 22.528-33.984 50.112-38.4 75.584-2.88 15.04-3.136 29.696-.96 43.84 28.288 21.12 69.44 34.048 111.04 34.048 42.048 0 83.008-13.024 111.04-34.048 2.176-14.144 1.92-28.8-.96-43.84-4.416-25.472-16.32-53.056-38.4-75.584zM210.048 298.496c-15.872 0-28.672-14.72-28.672-32.832s12.8-32.832 28.672-32.832c15.104 0 27.456 14.72 27.456 32.832s-12.352 32.832-27.456 32.832zm160 0c-15.872 0-28.672-14.72-28.672-32.832s12.8-32.832 28.672-32.832c15.104 0 27.456 14.72 27.456 32.832s-12.352 32.832-27.456 32.832z"/>
      </svg>
      Our Discord
    `;
    addRippleEffect(btnDiscord);
    pageContainer.appendChild(btnDiscord);

    // Theme switch button
    const themeBtn = document.createElement('button');
    themeBtn.textContent = 'Change Theme';
    themeBtn.className = 'btn';
    addRippleEffect(themeBtn);
    themeBtn.addEventListener('click', () => {
      applyTheme((currentThemeIndex + 1) % themes.length);
    });
    pageContainer.appendChild(themeBtn);
  });
}

// Render Methods page
function renderMethodsPage() {
  fadeOut(pageContainer, () => {
    pageContainer.innerHTML = '';

    const backBtn = document.createElement('button');
    backBtn.textContent = '← Back';
    backBtn.className = 'btn back-btn';
    addRippleEffect(backBtn);
    backBtn.addEventListener('click', () => renderMainMenu());
    pageContainer.appendChild(backBtn);

    const methods = [
      { name: 'Splunk', url: 'https://app.splunk.gg/u/exmadeGG' },
      { name: 'Injuries', url: 'https://www.logged.tg/auth/exmade' },
      { name: 'Cookie Bypasser', url: 'https://app.splunk.gg/u/exmadeGG' },
      { name: 'Hyperlink Gen', url: 'https://dsprs.vercel.app/hyperlink' }
    ];

    methods.forEach(({ name, url }) => {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'btn';
      a.textContent = name;
      addRippleEffect(a);
      pageContainer.appendChild(a);
    });
  });
}

// Init on load
window.addEventListener('DOMContentLoaded', () => {
  applyTheme(0);
  renderMainMenu();
});
