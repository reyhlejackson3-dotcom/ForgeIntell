/* ── GEAR CANVAS ─────────────────────────────────── */
(function() {
  const canvas = document.getElementById('gearCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const ORANGE = '#e8520a';
  const METAL = '#2c2c2c';
  const METAL2 = '#1e1e1e';

  function drawGear(cx, cy, outerR, innerR, teeth, holeR, angle, color, lineColor) {
    const toothAngle = (Math.PI * 2) / teeth;
    ctx.beginPath();
    for (let i = 0; i < teeth; i++) {
      const a0 = angle + i * toothAngle;
      const a1 = a0 + toothAngle * 0.35;
      const a2 = a0 + toothAngle * 0.5;
      const a3 = a0 + toothAngle * 0.85;
      ctx.lineTo(Math.cos(a0) * innerR + cx, Math.sin(a0) * innerR + cy);
      ctx.lineTo(Math.cos(a1) * outerR + cx, Math.sin(a1) * outerR + cy);
      ctx.lineTo(Math.cos(a2) * outerR + cx, Math.sin(a2) * outerR + cy);
      ctx.lineTo(Math.cos(a3) * innerR + cx, Math.sin(a3) * innerR + cy);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Hub
    ctx.beginPath();
    ctx.arc(cx, cy, holeR, 0, Math.PI * 2);
    ctx.fillStyle = '#070707';
    ctx.fill();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Spokes
    for (let i = 0; i < 6; i++) {
      const a = angle + (Math.PI * 2 / 6) * i;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * holeR + cx, Math.sin(a) * holeR + cy);
      ctx.lineTo(Math.cos(a) * (innerR * 0.8) + cx, Math.sin(a) * (innerR * 0.8) + cy);
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  const gears = [
    { cx: 0.7, cy: 0.18, outerR: 140, innerR: 110, teeth: 20, holeR: 32, speed: 0.003, dir: 1, color: METAL, line: '#3a3a3a' },
    { cx: 0.52, cy: 0.38, outerR: 90, innerR: 72, teeth: 14, holeR: 22, speed: 0.0048, dir: -1, color: METAL2, line: '#333' },
    { cx: 0.78, cy: 0.52, outerR: 110, innerR: 88, teeth: 16, holeR: 26, speed: 0.0035, dir: -1, color: METAL, line: '#3a3a3a' },
    { cx: 0.6, cy: 0.68, outerR: 70, innerR: 56, teeth: 12, holeR: 18, speed: 0.006, dir: 1, color: METAL2, line: '#333' },
    { cx: 0.88, cy: 0.78, outerR: 130, innerR: 104, teeth: 18, holeR: 30, speed: 0.0025, dir: 1, color: METAL, line: '#3a3a3a' },
    { cx: 0.65, cy: 0.9, outerR: 55, innerR: 44, teeth: 10, holeR: 14, speed: 0.008, dir: -1, color: METAL2, line: '#333' },
  ];

  const angles = gears.map(() => Math.random() * Math.PI * 2);

  let lastTime = 0;
  function animate(time) {
    const dt = Math.min(time - lastTime, 50);
    lastTime = time;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Orange ambient glow behind gears
    const grad = ctx.createRadialGradient(canvas.width * 0.75, canvas.height * 0.35, 0, canvas.width * 0.75, canvas.height * 0.35, 200);
    grad.addColorStop(0, 'rgba(232,82,10,0.08)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    gears.forEach((g, i) => {
      angles[i] += g.speed * g.dir * (dt / 16);
      const x = g.cx * canvas.width;
      const y = g.cy * canvas.height;
      drawGear(x, y, g.outerR, g.innerR, g.teeth, g.holeR, angles[i], g.color, g.line);
    });

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();

/* ── NAVBAR ──────────────────────────────────────── */
(function() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  document.querySelectorAll('.mobile-link, .mobile-cta').forEach(el => {
    el.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
})();

/* ── SCROLL REVEAL ───────────────────────────────── */
(function() {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('[data-reveal]'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => observer.observe(el));
})();

/* ── FORM ────────────────────────────────────────── */
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit');
  btn.textContent = 'Transmitting…';
  btn.disabled = true;
  setTimeout(() => {
    btn.style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
  }, 1200);
}
