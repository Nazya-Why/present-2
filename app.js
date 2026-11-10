(() => {
  const R = window.REPORT, M = R.meta;
  const $ = (s, e = document) => e.querySelector(s);
  const $$ = (s, e = document) => [...e.querySelectorAll(s)];
  const pad = n => String(n).padStart(2, '0');
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const fig = n => `assets/fig-${pad(n)}.png`;
  const cap = n => R.captions[n] || `Рисунок ${n}`;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const W = 1920, H = 1080;
  const arrow = '<svg viewBox="0 0 16 16"><path d="M4 12L12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ───────── palettes (purely aesthetic, one per slide) ───────── */
  // black–grey only: base, two greys for the folds, a soft highlight
  const PAL = {
    hero:   ['#030303', '#1d1d20', '#4a4a4f', '#2c2c30'],
    goal:   ['#060606', '#222225', '#3d3d42', '#151517'],
    over:   ['#050505', '#1a1a1c', '#444449', '#28282b'],
    div1:   ['#020202', '#2a2a2d', '#5c5c62', '#141415'],
    div2:   ['#020202', '#18181a', '#55555b', '#303034'],
    end:    ['#060606', '#202023', '#45454a', '#19191b'],
    thx:    ['#020202', '#2b2b2e', '#626268', '#1a1a1c']
  };
  const LABPAL = [
    ['#050505', '#1c1c1f', '#3a3a3f', '#141416'],
    ['#060606', '#1f1f22', '#36363a', '#18181a'],
    ['#050505', '#19191b', '#3e3e43', '#222225'],
    ['#070707', '#1e1e21', '#38383c', '#121213'],
    ['#050505', '#1b1b1d', '#3c3c41', '#202023'],
    ['#060606', '#202022', '#353539', '#161618'],
    ['#050505', '#1a1a1d', '#404045', '#1d1d20'],
    ['#070707', '#1d1d20', '#37373b', '#131315'],
    ['#050505', '#1c1c1e', '#3b3b40', '#1f1f22']
  ];

  /* ───────── sections ───────── */
  const S = [];
  const totalSteps = R.labs.reduce((s, l) => s + l.steps.length, 0);
  const T = M.title;

  S.push({
    type: 'hero', label: 'Вступ', theme: 'dark', pal: PAL.hero,
    html: `
      <div class="top">
        <span class="eyebrow" data-a style="--d:.05">${M.course}</span>
        <span class="eyebrow bare" data-a style="--d:.12">${M.lab}</span>
      </div>
      <div class="px" data-depth="14">
        <h1>
          <span class="split l1" style="--d:.15">${T[0]}</span>
          <span class="split l2" style="--d:.4">${T[1]}</span>
          <span class="split l3" style="--d:.62">${T[2]}</span>
        </h1>
      </div>
      <div class="badge px" data-depth="-24"><div data-a="scale" style="--d:.9;width:100%;height:100%;position:relative">
        <svg viewBox="0 0 230 230"><defs><path id="circ" d="M115,115 m-96,0 a96,96 0 1,1 192,0 a96,96 0 1,1 -192,0"/></defs>
          <text><textPath href="#circ">${M.badge}</textPath></text></svg>
        <div class="core"><div>${M.num}<small>ЛАБ</small></div></div>
      </div></div>
      <p class="topic" data-a style="--d:1"><b>${M.topicLead}</b> ${M.topicRest}</p>
      <div class="meta">
        <div class="meta-col" data-a style="--d:1.1"><span class="k">Виконали</span><b>Студенти групи ${M.group}</b></div>
        <div class="meta-col" data-a style="--d:1.18"><span class="k">Прийняв</span><b>${M.teacher}</b><span>${M.teacherTitle}</span></div>
        <div class="meta-col" data-a style="--d:1.26"><span class="k">Заклад</span><b>${M.org}</b><span>${M.dept}</span></div>
        <div class="meta-col" data-a style="--d:1.34"><span class="k">${M.city}</span><b>${M.year}</b></div>
      </div>`
  });

  S.push({
    type: 'goal', label: 'Мета роботи', theme: 'dark', pal: PAL.goal,
    html: `
      <div class="left">
        <span class="eyebrow" data-a style="--d:0">01 — Мета роботи</span>
        <h2 class="split" data-by="word" style="--d:.1">${M.goal.replace(M.goalEm, `<em>${M.goalEm}</em>`)}</h2>
        <div class="chips">${M.tools.map((t, i) => `<span class="chip" data-a style="--d:${1.1 + i * .07}">${t}</span>`).join('')}</div>
      </div>
      <div class="stats">
        <div class="stat" data-a style="--d:1.2"><b data-count="${R.labs.length}">0</b><span>практичні завдання PortSwigger</span></div>
        <div class="stat" data-a style="--d:1.3"><b data-count="${totalSteps}">0</b><span>задокументованих кроків</span></div>
        <div class="stat" data-a style="--d:1.4"><b data-count="${R.conclusions.cards.length}">0</b><span>заходи захисту у висновках</span></div>
      </div>
      <div class="right">
        <div class="esc" data-a="left" style="--d:.45">
          <div class="row"><h3>Завантаження <em>файлів</em></h3><span class="labs">МЕХАНІЗМ</span></div>
          <svg viewBox="0 0 614 150">
            <path class="flow" d="M170 75 L 444 75"/>
            <path class="path" id="vp" d="M170 75 L 444 75"/>
            <circle class="dot" r="6"><animateMotion dur="2.2s" repeatCount="indefinite" path="M170 75 L 444 75" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".6 0 .3 1"/></circle>
            <g class="node"><rect x="10" y="51" width="160" height="48" rx="24"/><text x="90" y="75">user file</text></g>
            <g class="node hot"><rect x="444" y="51" width="160" height="48" rx="24"/><text x="524" y="75">server</text></g>
          </svg>
          <p>Застосунок приймає файл від користувача, зберігає його й віддає за прямим посиланням.</p>
        </div>
        <div class="esc" data-a="left" style="--d:.6">
          <div class="row"><h3>Рівні <em>перевірок</em></h3><span class="labs">ЗАВДАННЯ 01–${pad(R.labs.length)}</span></div>
          <div class="layers">${R.labs.map((l, i) => `<span><i>${pad(i + 1)}</i>${l.weak}</span>`).join('')}</div>
          <p>Кожне завдання — окремий механізм захисту, якого виявилося недостатньо.</p>
        </div>
      </div>`
  });

  S.push({
    type: 'over', label: 'Завдання', theme: 'dark', pal: PAL.over,
    html: `
      <div class="head">
        <div>
          <span class="eyebrow" data-a style="--d:0">02 — Завдання</span>
          <h2><span class="split" style="--d:.08">Чотири </span><em class="split" style="--d:.3">завдання</em></h2>
        </div>
        <div class="legend" data-a style="--d:.5">
          <span>PortSwigger Web Security Academy</span>
          <span>File upload vulnerabilities <i>${pad(1)}–${pad(R.labs.length)}</i></span>
        </div>
      </div>
      <div class="grid9 grid4">
        ${R.labs.map((l, i) => `
          <div class="cell" data-a style="--d:${.55 + i * .08}">
            <button class="card" data-lab="${i}">
              <span class="n">${pad(i + 1)}</span>
              <h3>${l.uk}</h3>
              <span class="en">${l.en}</span>
              <span class="go">${arrow}</span>
              <span class="tag">${l.tag}</span>
            </button>
          </div>`).join('')}
      </div>`
  });

  R.labs.forEach((l, i) => {
    const host = (() => { try { return new URL(l.url).hostname + new URL(l.url).pathname; } catch { return l.url; } })();
    S.push({
      type: 'lab', label: `Завдання ${pad(i + 1)}`, theme: 'dark', pal: LABPAL[i % LABPAL.length], lab: l, li: i,
      html: `
        <div class="left">
          <span class="eyebrow" data-a style="--d:0">${l.tag}</span>
          <div class="num split" style="--d:.05">${pad(i + 1)}</div>
          <h2 class="split" style="--d:.2">${l.uk}</h2>
          <a class="en" data-a style="--d:.45" href="${l.url}" target="_blank" rel="noopener">${l.en} <span>↗</span></a>
          <div class="keyline" data-a style="--d:.55"><span class="k">Слабке місце</span><code>${esc(l.weak)}</code></div>
          <div class="stepbox" data-a style="--d:.65">
            <div class="step-meta"><span class="k">Крок <b class="sn">01</b> / ${pad(l.steps.length)}</span><span class="fig"></span></div>
            <div class="step-text"></div>
            <div class="segs">${l.steps.map((_, k) => `<button data-step="${k}" aria-label="Крок ${k + 1}"></button>`).join('')}</div>
          </div>
        </div>
        <div class="right">
          <div class="px" data-depth="0"><div class="tilt"><div data-a="rise" style="--d:.25">
            <figure class="window">
              <div class="bar"><span class="lights"><i></i><i></i><i></i></span>
                <span class="url"><svg viewBox="0 0 12 12"><rect x="2" y="5" width="8" height="6" rx="1.5" fill="currentColor"/><path d="M4 5V3.6a2 2 0 014 0V5" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>${esc(host)}</span>
                <span class="figno"></span></div>
              <div class="shot" role="button" tabindex="0" aria-label="Відкрити скріншот на весь екран">
                <img alt=""><img alt="">
                <span class="zoom">⤢ Збільшити</span>
                <div class="solved">Solved<small>завдання виконано</small></div>
              </div>
            </figure>
          </div></div></div>
        </div>`
    });
  });

  const C = R.conclusions;
  S.push({
    type: 'end', label: 'Висновки', theme: 'dark', pal: PAL.end,
    html: `
      <span class="eyebrow kick" data-a style="--d:0">Висновки</span>
      <h2><span class="split" style="--d:.08">${C.intro[0]}</span> <em class="split" style="--d:.7">${C.intro[1]}</em></h2>
      <div class="cards4">
        ${C.cards.map((c, i) => `<div class="c4" data-a style="--d:${1 + i * .1}"><span class="k">${pad(i + 1)}</span><i class="ln" style="--d:${1 + i * .1}"></i><h3>${c.h}</h3><p>${c.p}</p></div>`).join('')}
      </div>
      <div class="marquee" data-a="fade" style="--d:1.4"><div class="track">${[...C.principles, ...C.principles, ...C.principles, ...C.principles].map(p => `<span>${p}</span>`).join('')}</div></div>`
  });

  S.push({
    type: 'thx', label: 'Кінець', theme: 'dark', pal: PAL.thx,
    html: `
      <div class="px" data-depth="16"><h1>
        <span class="a split" style="--d:.1">Дякую</span>
        <span class="b split" style="--d:.5">за увагу.</span>
      </h1></div>
      <div class="links">
        <a class="big-btn solid" data-a style="--d:1" href="${M.reference}" target="_blank" rel="noopener">PortSwigger · File upload <span class="arr">↗</span></a>
        <button class="big-btn" data-a style="--d:1.08" data-go="0">На початок <span class="arr">↺</span></button>
        <div class="sign" data-a style="--d:1.16"><b>Студенти групи ${M.group}</b><br>${M.org} · ${M.city} ${M.year}</div>
      </div>`
  });

  /* ───────── build DOM ───────── */
  $('.brand-t').textContent = M.brand;
  const deck = $('#deck');
  deck.innerHTML = S.map((s, i) => `<section class="slide s-${s.type} ${s.theme}" id="s${i}" aria-label="${s.label}">${s.html}</section>`).join('');
  const slides = $$('.slide', deck);

  // split text into words → chars (keeps inline tags like <em>, <code>)
  $$('.split').forEach(el => {
    let i = 0;
    // long paragraphs (data-by="word") reveal word by word, so they finish in ~1s
    const byWord = el.dataset.by === 'word';
    let wi = 0;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(tn => {
      const frag = document.createDocumentFragment();
      tn.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
        const w = document.createElement('span'); w.className = 'w';
        [...part].forEach(ch => {
          const c = document.createElement('span'); c.className = 'c'; c.textContent = ch;
          c.style.setProperty('--i', byWord ? wi : i++); w.appendChild(c);
        });
        wi++;
        frag.appendChild(w);
      });
      tn.replaceWith(frag);
    });
  });

  $('#tot').textContent = pad(S.length);
  $('#ticks').innerHTML = S.map((s, i) => `<button data-go="${i}" aria-label="${s.label}" title="${s.label}"></button>`).join('');
  const ticks = $$('#ticks button');
  $('#menuList').innerHTML = S.map((s, i) => `<li><button data-go="${i}" style="--i:${i}"><span class="n">${pad(i + 1)}</span><span class="t">${s.type === 'lab' ? s.lab.uk : s.label}</span><span class="s">${s.type === 'lab' ? s.label : s.type === 'div' ? 'Розділ' : ''}</span></button></li>`).join('');

  /* ───────── scale stage ───────── */
  const stage = $('#stage');
  let sc = 1;
  function fit() {
    sc = Math.min(innerWidth / W, innerHeight / H);
    stage.style.setProperty('--sc', sc);
  }
  fit();
  addEventListener('resize', fit);

  /* ───────── navigation ───────── */
  let cur = -1;
  const stepOf = new Map();      // slide → current step
  const seen = new Set();

  function go(i, st = 0, dirOverride) {
    i = Math.max(0, Math.min(S.length - 1, i));
    if (i === cur) { if (S[i].lab) setStep(i, st); return; }
    const dir = dirOverride ?? (i > cur ? 1 : -1);
    const out = slides[cur], inn = slides[i];
    if (out) {
      out.style.setProperty('--dir', dir);
      out.classList.remove('is-active'); out.classList.add('is-leaving');
      clearTimeout(out._t);
      out._t = setTimeout(() => {
        out.classList.add('reset'); out.classList.remove('is-leaving');
        void out.offsetWidth; out.classList.remove('reset');
      }, 900);
    }
    clearTimeout(inn._t);
    inn.classList.add('reset'); inn.classList.remove('is-leaving', 'is-active');
    inn.style.setProperty('--dir', dir);
    void inn.offsetWidth; inn.classList.remove('reset');
    void inn.offsetWidth; inn.classList.add('is-active');

    const prev = cur; cur = i; seen.add(i);
    document.body.dataset.theme = S[i].theme;
    document.querySelector('meta[name=theme-color]').content = S[i].pal[0];
    setPalette(S[i].pal);
    chrome(i, prev);
    if (S[i].lab) { stepOf.delete(i); setStep(i, st, true); }
    runCounters(inn);
    syncHash();
  }

  function next() {
    if (S[cur].lab) { const k = stepOf.get(cur) ?? 0; if (k < S[cur].lab.steps.length - 1) return setStep(cur, k + 1); }
    if (cur < S.length - 1) go(cur + 1);
  }
  function prev() {
    if (S[cur].lab) { const k = stepOf.get(cur) ?? 0; if (k > 0) return setStep(cur, k - 1); }
    if (cur > 0) { const p = cur - 1; go(p, S[p].lab ? S[p].lab.steps.length - 1 : 0); }
  }

  function syncHash() {
    const k = stepOf.get(cur);
    const h = `#${cur + 1}${S[cur].lab && k ? '.' + (k + 1) : ''}`;
    if (location.hash !== h) history.replaceState(null, '', h);
  }

  function chrome(i) {
    const c = $('#cnt');
    c.textContent = pad(i + 1); c.classList.remove('tick'); void c.offsetWidth; c.classList.add('tick');
    ticks.forEach((t, k) => { t.classList.toggle('on', k === i); t.classList.toggle('seen', seen.has(k) && k !== i); });
    $$('#menuList button').forEach((b, k) => b.classList.toggle('on', k === i));
    const now = $('#nowLabel');
    now.classList.add('swap');
    setTimeout(() => {
      now.textContent = S[i].type === 'lab' ? `${S[i].label} · ${S[i].lab.tag}` : S[i].label;
      now.classList.remove('swap'); now.classList.add('swap-in'); void now.offsetWidth; now.classList.remove('swap-in');
    }, 260);
  }

  function runCounters(el) {
    $$('[data-count]', el).forEach(b => {
      const to = +b.dataset.count, t0 = performance.now() + 900, dur = 1400;
      b.textContent = '0';
      const tick = now => {
        const p = Math.max(0, Math.min(1, (now - t0) / dur));
        b.textContent = Math.round(to * (1 - Math.pow(1 - p, 4)));
        if (p < 1 && el.classList.contains('is-active')) requestAnimationFrame(tick); else b.textContent = to;
      };
      requestAnimationFrame(tick);
    });
  }

  /* ───────── lab steps ───────── */
  const dims = new Map();       // fig → [w, h]
  function loadFig(n) {
    return new Promise(res => {
      if (dims.has(n)) return res(dims.get(n));
      const im = new Image();
      im.onload = () => { const d = [im.naturalWidth, im.naturalHeight]; dims.set(n, d); res(d); };
      im.onerror = () => res([1600, 900]);
      im.src = fig(n);
    });
  }

  function setStep(i, k, entering = false) {
    const s = S[i], el = slides[i], l = s.lab;
    k = Math.max(0, Math.min(l.steps.length - 1, k));
    const prevK = stepOf.get(i);
    if (prevK === k && !entering) return;
    const fwd = prevK == null ? true : k > prevK;
    stepOf.set(i, k);
    const st = l.steps[k];

    $('.sn', el).textContent = pad(k + 1);
    $('.fig', el).textContent = `Рис. ${st.f}`;
    $('.figno', el).textContent = `Рис. ${pad(st.f)}`;
    $$('.segs button', el).forEach((b, j) => { b.classList.toggle('on', j === k); b.classList.toggle('done', j < k); });

    // text: old out, new words in
    const box = $('.step-text', el);
    $$('.st', box).forEach(o => { o.style.setProperty('--sdir', fwd ? 1 : -1); o.classList.remove('in'); o.classList.add('out'); setTimeout(() => o.remove(), 450); });
    const d = document.createElement('div'); d.className = 'st';
    // the figure number is already shown above, so drop a leading «Рисунок N –»
    const txt = (st.t || '').replace(/^\s*Рисунок\s*\d+\s*[–—-]\s*/, '').trim();
    d.innerHTML = txt || `<span class="ph">Вставте текст кроку зі звіту — рис. ${st.f}</span>`;
    if (txt.replace(/<[^>]+>/g, '').length > 120) d.classList.add('long');
    let wi = 0;
    // wrap words (top-level text) and inline elements
    [...d.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(p => {
          if (!p) return;
          if (/^\s+$/.test(p)) return frag.appendChild(document.createTextNode(' '));
          const w = document.createElement('span'); w.className = 'sw'; w.style.setProperty('--i', wi++); w.textContent = p; frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else {
        const w = document.createElement('span'); w.className = 'sw'; w.style.setProperty('--i', wi++);
        n.replaceWith(w); w.appendChild(n);
      }
    });
    box.appendChild(d);
    const delay = entering ? 750 : 120;
    setTimeout(() => d.classList.add('in'), delay);

    // screenshot
    const shot = $('.shot', el), [a, b] = $$('.shot img', el);
    const shown = a.classList.contains('show') ? a : b.classList.contains('show') ? b : null;
    const src = fig(st.f);
    $('.solved', el).classList.toggle('on', /Solved/.test(st.t));
    loadFig(st.f).then(([w, h]) => {
      if (stepOf.get(i) !== k) return;
      fitShot(el, w, h);
      if (shown && shown.getAttribute('src') === src) return;
      const nx = shown === a ? b : a;
      nx.src = src; nx.alt = cap(st.f);
      nx.className = fwd ? 'enter-f' : 'enter-b';
      void nx.offsetWidth;
      const go2 = () => {
        nx.className = 'show';
        if (shown) { shown.className = 'leave'; }
      };
      if (entering) setTimeout(go2, 500); else setTimeout(go2, 16);
    });
    // warm cache
    l.steps.slice(k + 1, k + 3).forEach(x => loadFig(x.f));
    if (cur === i) syncHash();
  }

  function fitShot(el, w, h) {
    const right = $('.right', el);
    const AW = right.clientWidth - 20, AH = right.clientHeight - 52 - 20;
    const s = Math.min(AW / w, AH / h, 1.7);
    const shot = $('.shot', el);
    shot.style.width = Math.round(w * s) + 'px';
    shot.style.height = Math.round(h * s) + 'px';
  }

  /* ───────── input ───────── */
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-go],[data-step],[data-lab],.shot,#nextBtn,#prevBtn,#menuBtn,#menuClose,#fsBtn');
    if (!t) return;
    if (t.matches('a[href^="http"]')) return;
    e.preventDefault();
    if (t.id === 'nextBtn') return next();
    if (t.id === 'prevBtn') return prev();
    if (t.id === 'menuBtn') return toggleMenu(true);
    if (t.id === 'menuClose') return toggleMenu(false);
    if (t.id === 'fsBtn') return toggleFs();
    if (t.dataset.go != null) { toggleMenu(false); return go(+t.dataset.go); }
    if (t.dataset.lab != null) return go(S.findIndex(s => s.li === +t.dataset.lab));
    if (t.dataset.step != null) return setStep(cur, +t.dataset.step);
    if (t.classList.contains('shot')) return openLb(t);
  });

  document.addEventListener('keydown', e => {
    if (!lb.hidden) { if (['Escape', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); closeLb(); } return; }
    const k = e.key;
    if (menuOpen && (k === 'Escape' || /^[mMьЬ]$/.test(k))) { toggleMenu(false); return; }
    if (k === 'Enter' && e.target.classList?.contains('shot')) return openLb(e.target);
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(k)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); prev(); }
    else if (k === 'Home') { e.preventDefault(); go(0); }
    else if (k === 'End') { e.preventDefault(); go(S.length - 1); }
    else if (/^[fFаА]$/.test(k)) toggleFs();
    else if (/^[mMьЬ]$/.test(k) || k === 'Escape') toggleMenu(!menuOpen);
  });

  // wheel: one gesture = one step (inertia keeps the lock alive)
  let acc = 0, lockUntil = 0;
  addEventListener('wheel', e => {
    e.preventDefault();
    if (menuOpen || !lb.hidden) return;
    const now = performance.now();
    if (now < lockUntil) { lockUntil = Math.max(lockUntil, now + 140); return; }
    acc += Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(acc) > 50) { acc > 0 ? next() : prev(); acc = 0; lockUntil = now + 650; }
  }, { passive: false });

  let tx = 0, ty = 0;
  addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 50 || menuOpen || !lb.hidden) return;
    (Math.abs(dx) > Math.abs(dy) ? dx < 0 : dy < 0) ? next() : prev();
  }, { passive: true });

  function toggleFs() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.();
  }

  // menu
  let menuOpen = false;
  const menu = $('#menu');
  function toggleMenu(open) {
    if (open === menuOpen) return;
    menuOpen = open;
    if (open) { menu.hidden = false; requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('open'))); }
    else { menu.classList.remove('open'); setTimeout(() => { if (!menuOpen) menu.hidden = true; }, 900); }
  }

  /* ───────── lightbox (FLIP from the window) ───────── */
  const lb = $('#lb'), lbImg = $('#lbImg');
  let lbFrom = null;
  function openLb(shot) {
    const img = $('img.show', shot); if (!img) return;
    const r = img.getBoundingClientRect();
    const [w, h] = [img.naturalWidth, img.naturalHeight];
    const s = Math.min(innerWidth * .92 / w, innerHeight * .84 / h, 2.2);
    const tw = w * s, th = h * s, tl = (innerWidth - tw) / 2, tt = (innerHeight - th) / 2 - innerHeight * .01;
    lbImg.src = img.src; lbImg.alt = img.alt;
    $('#lbCap').textContent = img.alt;
    lbImg.style.width = tw + 'px'; lbImg.style.height = th + 'px';
    lbFrom = r;
    lbImg.classList.remove('anim');
    lbImg.style.transform = `translate(${r.left}px, ${r.top}px) scale(${r.width / tw}, ${r.height / th})`;
    lb.hidden = false; void lb.offsetWidth;
    lbImg.classList.add('anim'); lb.classList.add('open');
    lbImg.style.transform = `translate(${tl}px, ${tt}px) scale(1)`;
    shot.style.visibility = 'hidden'; lb._shot = shot;
  }
  function closeLb() {
    const r = lb._shot ? $('img.show', lb._shot)?.getBoundingClientRect() || lbFrom : lbFrom;
    const tw = parseFloat(lbImg.style.width), th = parseFloat(lbImg.style.height);
    lb.classList.remove('open');
    lbImg.style.transform = `translate(${r.left}px, ${r.top}px) scale(${r.width / tw}, ${r.height / th})`;
    setTimeout(() => { lb.hidden = true; if (lb._shot) lb._shot.style.visibility = ''; }, 720);
  }
  lb.addEventListener('click', closeLb);

  /* ───────── pointer: cursor, parallax, tilt, magnets ───────── */
  const fine = matchMedia('(pointer: fine)').matches && !reduced;
  let px = innerWidth / 2, py = innerHeight / 2;
  let nx = 0, ny = 0, snx = 0, sny = 0;
  addEventListener('pointermove', e => {
    px = e.clientX; py = e.clientY;
    nx = px / innerWidth - .5; ny = py / innerHeight - .5;
    if (!fine) return;
    // magnetic buttons
    const m = e.target.closest('.mag');
    $$('.mag').forEach(b => { if (b !== m) b.style.transform = ''; });
    if (m) {
      const r = m.getBoundingClientRect();
      m.style.transform = `translate(${(px - r.left - r.width / 2) * .3 / sc}px, ${(py - r.top - r.height / 2) * .3 / sc}px)`;
    }
  }, { passive: true });
  document.addEventListener('pointerleave', () => $$('.mag').forEach(b => b.style.transform = ''));

  function pointerLoop() {
    snx += (nx - snx) * .06; sny += (ny - sny) * .06;
    const el = slides[cur];
    if (el && !reduced) {
      $$('.px', el).forEach(p => {
        const d = +p.dataset.depth || 0;
        p.style.transform = d ? `translate3d(${snx * d * 2}px, ${sny * d * 2}px, 0)` : '';
      });
      const t = $('.tilt', el);
      if (t) t.style.transform = `rotateY(${snx * 7}deg) rotateX(${-sny * 6}deg)`;
    }
    requestAnimationFrame(pointerLoop);
  }
  requestAnimationFrame(pointerLoop);

  /* ───────── WebGL mesh-gradient background ───────── */
  const hex = h => [1, 3, 5].map(k => parseInt(h.slice(k, k + 2), 16) / 255);
  let colCur = PAL.hero.map(hex), colTo = colCur.map(c => c.slice());
  function setPalette(p) { colTo = p.map(hex); }

  const cv = $('#bg');
  const gl = cv.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: false });
  if (gl) {
    const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const fs = `precision highp float;
      uniform vec2 R; uniform float T; uniform vec2 Mo;
      uniform vec3 A; uniform vec3 B; uniform vec3 C; uniform vec3 D;
      float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
      float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return s;}
      void main(){
        vec2 uv=gl_FragCoord.xy/R;
        vec2 p=(gl_FragCoord.xy-.5*R)/R.y;
        float t=T*.045;
        vec2 m=(Mo)*vec2(R.x/R.y,1.);
        vec2 dm=p-m; p-=dm*.18*exp(-dot(dm,dm)*2.5);
        vec2 q=vec2(fbm(p*1.05+vec2(0.,t)),fbm(p*1.05+vec2(5.2,1.3)-t*.8));
        vec2 r=vec2(fbm(p*1.25+1.9*q+vec2(1.7,9.2)+.7*t),fbm(p*1.25+1.9*q+vec2(8.3,2.8)-.6*t));
        float f=fbm(p*1.1+2.1*r);
        vec3 col=A;
        col=mix(col,B,smoothstep(.25,.85,f));
        col=mix(col,C,smoothstep(.45,1.05,length(q))*.9);
        col=mix(col,D,smoothstep(.35,.95,r.y)*.75);
        col=mix(col,A,smoothstep(.35,.95,length(uv-.5)*1.25)*.6);
        col+=(h(gl_FragCoord.xy*.73+fract(T)*61.)-.5)*.03;
        gl_FragColor=vec4(col,1.);
      }`;
    const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; };
    const pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(pr); gl.useProgram(pr);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = n => gl.getUniformLocation(pr, n);
    const uR = U('R'), uT = U('T'), uM = U('Mo'), uC = ['A', 'B', 'C', 'D'].map(U);
    const Q = .5; // render at half resolution — it is a soft gradient anyway
    const size = () => { cv.width = Math.round(innerWidth * Q); cv.height = Math.round(innerHeight * Q); gl.viewport(0, 0, cv.width, cv.height); };
    size(); addEventListener('resize', size);
    let last = performance.now(), T = 0, mx = 0, my = 0;
    const frame = now => {
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      T += reduced ? 0 : dt;
      const k = 1 - Math.exp(-dt * 2.2);
      colCur = colCur.map((c, i) => c.map((v, j) => v + (colTo[i][j] - v) * k));
      mx += (nx - mx) * .03; my += (-ny - my) * .03;
      gl.uniform2f(uR, cv.width, cv.height); gl.uniform1f(uT, T + 40); gl.uniform2f(uM, mx, my);
      uC.forEach((u, i) => gl.uniform3fv(u, colCur[i]));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  } else {
    const paint = () => { const p = colTo.map(c => `rgb(${c.map(v => v * 255 | 0)})`); document.body.style.background = `radial-gradient(at 20% 20%, ${p[1]}, transparent 60%), radial-gradient(at 80% 30%, ${p[2]}, transparent 55%), radial-gradient(at 60% 90%, ${p[3]}, transparent 60%), ${p[0]}`; };
    const sp = setPalette; setPalette = p => { sp(p); paint(); };
  }

  /* ───────── boot: preloader → first slide ───────── */
  const parseHash = () => {
    const m = location.hash.match(/^#(\d+)(?:\.(\d+))?/);
    return m ? [Math.max(0, Math.min(S.length - 1, +m[1] - 1)), m[2] ? +m[2] - 1 : 0] : [0, 0];
  };
  addEventListener('hashchange', () => { const [i, k] = parseHash(); if (i !== cur || (S[i].lab && k !== stepOf.get(i))) go(i, k); });

  const pre = $('#pre'), preN = $('#preN'), preBar = $('#preBar');
  const [i0, k0] = parseHash();
  const firstFigs = R.labs.map(l => l.steps[0].f);
  const tasks = [document.fonts ? document.fonts.ready : Promise.resolve(), ...firstFigs.map(loadFig)];
  let done = 0, shownPct = 0, target = 0;
  tasks.forEach(p => p.then(() => { done++; target = done / tasks.length; }));
  const t0 = performance.now();
  (function preLoop(now) {
    shownPct += (Math.min(target, (now - t0) / 1200) - shownPct) * .12;
    preN.textContent = Math.round(shownPct * 100);
    preBar.style.transform = `scaleX(${shownPct})`;
    if (shownPct > .995 || now - t0 > 6000) {
      preN.textContent = '100'; preBar.style.transform = 'scaleX(1)';
      setTimeout(() => {
        pre.classList.add('done');
        setTimeout(() => go(i0, k0, 1), reduced ? 0 : 350);
        setTimeout(() => pre.remove(), 1400);
      }, 200);
      return;
    }
    setTimeout(() => preLoop(performance.now()), 16);
  })(t0);

  // lazily warm every screenshot after boot
  setTimeout(() => R.labs.forEach(l => l.steps.forEach(s => loadFig(s.f))), 4000);
})();
