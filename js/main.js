// polished interactions: parallax, scroll progress, GSAP entry animations, accordion, quiz, breathing demo
(() => {
  // helpers
  const qs = s => document.querySelector(s);
  const qsa = s => Array.from(document.querySelectorAll(s));

  // PROGRESS BAR
  const progress = qs('#progress');
  function updateProgress() {
    const h = document.documentElement;
    const pct = (h.scrollTop || document.body.scrollTop) / (h.scrollHeight - h.clientHeight);
    progress.style.width = `${Math.min(100, Math.max(0, pct * 100))}%`;
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // GSAP animations & ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // hero intro timeline
  gsap.from('#hero .hero-text h1', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' });
  gsap.from('#hero .sub', { y: 18, opacity: 0, duration: 0.9, delay: 0.15 });
  gsap.from('#hero .lead', { y: 18, opacity: 0, duration: 0.9, delay: 0.25 });
  gsap.from('#hero .hero-art', { scale: 0.92, opacity: 0, duration: 1, delay: 0.15, ease: 'elastic.out(1, 0.5)' });

  // bubble float
  qsa('#bubbles .b').forEach((b, i) => {
    gsap.to(b, { y: -30 - Math.random()*40, x: (Math.random()-0.5)*40, duration: 4 + Math.random()*4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i*0.2 });
  });

  // lungs subtle inhale/exhale loop
  const left = qs('.lung.left'), right = qs('.lung.right');
  gsap.to([left, right], {
    scaleY: 0.92,
    yoyo: true,
    repeat: -1,
    duration: 3.6,
    ease: 'sine.inOut',
    transformOrigin: 'center center',
    delay: 1.0
  });

  // parallax mouse move
  const hero = qs('#hero');
  const layers = qsa('#parallax-layers .layer');
  let mouse = { x:0, y:0 };
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    mouse.x = px; mouse.y = py;
  });
  function rafLoop() {
    layers.forEach((el, i) => {
      const depth = (i+1) * 6;
      el.style.transform = `translate3d(${mouse.x*depth}px, ${mouse.y*depth}px, 0)`;
    });
    requestAnimationFrame(rafLoop);
  }
  rafLoop();

  // Scroll-triggered reveals
  qsa('.panel .container > h3').forEach(h => {
    gsap.from(h, {
      scrollTrigger: { trigger: h, start: 'top 85%' },
      y: 24, opacity: 0, duration: 0.7, ease: 'power3.out'
    });
  });
  qsa('.sym-card, .diag-card, .treat-card, .risk-item').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      y: 20, opacity:0, duration: 0.7, delay: i * 0.05, ease: 'power3.out'
    });
  });

  // animate transmission bars
  qsa('.t-bar').forEach(b => {
    const target = parseInt(b.dataset.target || 50);
    gsap.to(b.querySelector(':before') || b, {
      scrollTrigger: { trigger: b, start: 'top 90%' },
      onStart: () => {
        b.style.setProperty('--w', target + '%');
        b.style.setProperty('position', 'relative');
        const bar = document.createElement('span');
        bar.style.position = 'absolute';
      },
      duration: 1.2,
      // simple manual animation
      onUpdate: null
    });
    // animate the inner width using JS (fallback)
    ScrollTrigger.create({
      trigger: b, start: 'top 90%',
      onEnter: () => { b.style.setProperty('--w', `${target}%`); b.style.setProperty('--anim','1'); b.style.setProperty('overflow','hidden'); b.style.setProperty('--target', target); b.firstElementChild && (b.firstElementChild.style.opacity = 1);
        b.style.setProperty('--width','0%');
        b.querySelector('::before');
        b.style.background = 'linear-gradient(90deg,var(--accent2),var(--accent1))';
        b.animate([{width:'0%'},{width:target+'%'}], {duration:1200,fill:'forwards',easing:'ease-out'});
      }
    });
  });

  // animate risk bars
  qsa('.risk-bar').forEach(el => {
    const p = el.dataset.percent || 50;
    ScrollTrigger.create({
      trigger: el, start: 'top 90%',
      onEnter: () => el.style.width = p + '%'
    });
  });

  // TILT (mouse-based) on .tilt elements
  qsa('.tilt').forEach(card => {
    card.addEventListener('pointermove', (ev) => {
      const r = card.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - 0.5;
      const y = (ev.clientY - r.top) / r.height - 0.5;
      const rx = -y * 8;
      const ry = x * 10;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
    });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  });

  // ACCORDION
  qsa('.acc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pnl = btn.nextElementSibling;
      const expanded = pnl.style.maxHeight && pnl.style.maxHeight !== '0px';
      document.querySelectorAll('.acc-panel').forEach(x => x.style.maxHeight = '0px');
      if (!expanded) pnl.style.maxHeight = pnl.scrollHeight + 'px';
    });
  });

  // QUIZ simple logic
  qsa('.quiz-btn').forEach(b => b.addEventListener('click', () => {
    const feed = qs('.quiz-feedback');
    if (b.textContent.includes('Only elderly')) {
      feed.textContent = "❌ Myth — people of any age can get pneumonia. Vaccines help reduce risk.";
      feed.style.color = '#ffb4b4';
    } else {
      feed.textContent = "✅ Fact — vaccines (pneumococcal, flu) reduce some pneumonia risk.";
      feed.style.color = '#b9ffdd';
    }
    feed.animate([{opacity:0},{opacity:1}],{duration:220,fill:'forwards'});
  }));

  // BREATHING demo
  const breathBtn = qs('#play-breath');
  const breatheCircle = qs('#breathing-circle');
  let breatheTimeline = null;
  function startBreathing() {
    if (breatheTimeline) { breatheTimeline.kill(); breatheTimeline = null; breatheCircle.style.transform = ''; return; }
    breatheTimeline = gsap.timeline({repeat:-1});
    breatheTimeline.to(breatheCircle, {scale:1.6, duration:4, ease:'power1.inOut'}); // inhale
    breatheTimeline.to(breatheCircle, {scale:1.0, duration:6, ease:'power1.inOut'}); // exhale slowly
  }
  breathBtn.addEventListener('click', startBreathing);

  // hero button also toggles breathing
  qs('.hero-cta .btn.ghost').addEventListener('click', startBreathing);

  // breathing circle when entering treatment section
  ScrollTrigger.create({
    trigger: '#treatment',
    start: 'top 70%',
    onEnter: () => { gsap.fromTo(breatheCircle, {scale:0.96},{scale:1.18,duration:1.4,repeat:1,yoyo:true, ease:'sine.inOut'}) }
  });

  // interactive lungs inflate on click (pulse)
  qs('#lungs').addEventListener('click', () => {
    gsap.fromTo([left,right], {scale:1.0},{scale:1.12,duration:0.5,yoyo:true,repeat:1,ease:'power1.inOut'});
  });

  // smooth anchor scrolling offset fix for fixed nav
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navOffset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }));

  // Respect reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    gsap.globalTimeline.timeScale(0); // effectively pause GSAP animations
  }

  // small initial update
  updateProgress();
})();
