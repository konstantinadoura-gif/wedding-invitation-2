/* ==================================================================
   ✎  ΡΥΘΜΙΣΕΙΣ ΠΡΟΣΚΛΗΤΗΡΙΟΥ  —  άλλαξε ΜΟΝΟ αυτό το κομμάτι
   ================================================================== */
const CONFIG = {
  lang: 'el',                 // 'el' = Ελληνικά, 'en' = English

  bride: 'Christina',
  groom: 'Panagiotis',
  monogram: 'CP',             // γράμματα στη σφραγίδα

  date: '2027-06-12',         // ⚠ προσωρινή ημερομηνία  ΕΕΕΕ-ΜΜ-ΗΗ
  time: '19:00',

  ceremony: {
    name: 'Ιερός Ναός …',     // ⚠ προσωρινό
    address: 'Διεύθυνση ναού',
    mapUrl: '',
  },
  reception: {
    name: 'Χώρος δεξίωσης …', // ⚠ προσωρινό
    address: 'Διεύθυνση δεξίωσης',
    time: '21:00',
    mapUrl: '',
  },

  rsvp: {
    deadline: '2027-05-15',
    contacts: [
      { name: 'Christina',  phone: '+30 690 000 0000' },
      { name: 'Panagiotis', phone: '+30 690 000 0001' },
    ],
  },

  photo: '',                  // ασπρόμαυρη φωτογραφία μέσα στον καθρέφτη, π.χ. 'img/couple.jpg'
  music: 'music.mp3',         // Life in Technicolor (Vitamin String Quartet) — κενό '' = χωρίς μουσική
  musicStart: 17,             // από ποιο δευτερόλεπτο ξεκινά (και ξαναρχίζει από εκεί)

  slideHold: 3.2,             // δευτερόλεπτα που μένει κάθε διαφάνεια αφού γραφτεί όλο το κείμενο
};

const TEXTS = {
  el: {
    kicker: 'Παντρευόμαστε',
    tapHint: 'Πατήστε τη σφραγίδα για να ανοίξει',
    lead: 'Με την ευλογία των γονέων μας',
    body: 'σας προσκαλούν με μεγάλη χαρά να μοιραστείτε μαζί τους την ευτυχία του γάμου τους',
    at: 'στις {time}',
    saveDate: 'Save the date',
    lblCeremony: 'Μυστήριο', lblReception: 'Δεξίωση', lblRsvp: 'Επιβεβαίωση παρουσίας',
    rsvpBy: 'έως {deadline}',
    btnMap: 'Χάρτης', btnCal: 'Στο ημερολόγιο', replay: 'Ξανά από την αρχή',
    countdown: 'σε {n} ημέρες', countdown1: 'αύριο!', today: 'σήμερα!',
    welcome: 'Σας περιμένουμε!',
    close: '✕  Κλείσιμο', calEvent: 'Γάμος {bride} & {groom}', photo: 'η φωτογραφία σας',
  },
  en: {
    kicker: 'We are getting married',
    tapHint: 'Tap the seal to open',
    lead: 'Together with their families',
    body: 'request the pleasure of your company at the celebration of their marriage',
    at: 'at {time}',
    saveDate: 'Save the date',
    lblCeremony: 'Ceremony', lblReception: 'Reception', lblRsvp: 'RSVP',
    rsvpBy: 'by {deadline}',
    btnMap: 'Map', btnCal: 'Add to calendar', replay: 'Watch again',
    countdown: 'in {n} days', countdown1: 'tomorrow!', today: 'today!',
    welcome: 'We hope to see you!',
    close: '✕  Close', calEvent: 'Wedding of {bride} & {groom}', photo: 'your photo',
  },
};
/* ================== τέλος ρυθμίσεων ================== */


(() => {
'use strict';
const T = TEXTS[CONFIG.lang] || TEXTS.el;
const LOCALE = CONFIG.lang === 'en' ? 'en-GB' : 'el-GR';
document.documentElement.lang = CONFIG.lang === 'en' ? 'en' : 'el';
const $ = s => document.querySelector(s);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const parseDate = s => { const [y, m, d] = String(s).split('-').map(Number); return new Date(y, (m || 1) - 1, d || 1); };
const fmt = (d, o) => new Intl.DateTimeFormat(LOCALE, o).format(d);
const wedding = parseDate(CONFIG.date);
const Y = wedding.getFullYear(), M = wedding.getMonth(), D = wedding.getDate();
const V = {
  bride: CONFIG.bride, groom: CONFIG.groom, time: CONFIG.time,
  deadline: CONFIG.rsvp.deadline ? fmt(parseDate(CONFIG.rsvp.deadline), { day: 'numeric', month: 'long', year: 'numeric' }) : '',
};
const fill = (s, x = {}) => String(s).replace(/\{(\w+)\}/g, (_, k) => (x[k] ?? V[k] ?? ''));
document.title = `${CONFIG.bride} & ${CONFIG.groom} · ${CONFIG.lang === 'en' ? 'Wedding invitation' : 'Προσκλητήριο γάμου'}`;
const pad = n => String(n).padStart(2, '0');

/* ---------------------------------------------------------------
   TIMELINE — every word / letter / block gets its own start time,
   so the text writes itself one piece after another.
   --------------------------------------------------------------- */
const TEXT_PACE = 0.55;            // < 1 = words appear faster (1 = original pace)
function TL(start = .4) {
  let t = start * TEXT_PACE;
  const add = x => { t += x * TEXT_PACE; };
  const d = () => `--d:${t.toFixed(2)}s`;
  return {
    words(s, step = .12) {
      const out = String(s).split(/\s+/).filter(Boolean).map(w => { const h = `<span class="w" style="${d()}">${esc(w)}</span>`; add(step); return h; }).join(' ');
      add(.12); return out;
    },
    letters(s, step = .07) {
      let out = '';
      for (const ch of String(s)) { if (ch === ' ') { out += ' '; continue; } out += `<span class="l" style="${d()}">${esc(ch)}</span>`; add(step); }
      add(.12); return out;
    },
    fx(gap = .15) { add(gap); const s = `style="${d()}"`; add(.3); return s; },
    wait(x) { add(x); },
    get now() { return t; },
    get end() { return t + .9; },
  };
}
const namesHTML = tl => `${tl.letters(CONFIG.bride)} <span class="amp">${tl.letters('&')}</span><br>${tl.letters(CONFIG.groom)}`;

/* ---------------------------------------------------------------
   SVG ART — the mirror frame and the monogram pressed into the wax
   (envelope + card artwork are the couple's own images in img/)
   --------------------------------------------------------------- */
const r2 = n => Math.round(n * 10) / 10;
function defs() {
  return `
  <linearGradient id="champ" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#b89b6c"/><stop offset=".3" stop-color="#efe0c2"/><stop offset=".55" stop-color="#c7aa7b"/><stop offset=".8" stop-color="#f4e8d1"/><stop offset="1" stop-color="#b99c6e"/>
  </linearGradient>
  <radialGradient id="pearl" cx=".35" cy=".3" r=".75">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#f6eff3"/><stop offset=".85" stop-color="#dccbd9"/><stop offset="1" stop-color="#c3aec3"/>
  </radialGradient>
  <radialGradient id="petal" cx=".5" cy=".85" r=".9">
    <stop offset="0" stop-color="#a888bb"/><stop offset=".55" stop-color="#cdb6dc"/><stop offset="1" stop-color="#ece1f2"/>
  </radialGradient>
  <radialGradient id="petalW" cx=".5" cy=".85" r=".9">
    <stop offset="0" stop-color="#eadfd8"/><stop offset=".6" stop-color="#fdfaf6"/><stop offset="1" stop-color="#ffffff"/>
  </radialGradient>
  <linearGradient id="leaf" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#a9b98f"/><stop offset="1" stop-color="#76885f"/>
  </linearGradient>
  <radialGradient id="photoPh" cx=".5" cy=".4" r=".7">
    <stop offset="0" stop-color="#f1eeec"/><stop offset="1" stop-color="#c8c1bd"/>
  </radialGradient>
  <pattern id="lace" width="8" height="8" patternUnits="userSpaceOnUse">
    <circle cx="4" cy="4" r="1.3" fill="#fff" opacity=".85"/>
  </pattern>
  <filter id="soft" x="-20%" y="-20%" width="140%" height="160%"><feGaussianBlur stdDeviation="7"/></filter>`;
}
const flower = (x, y, s, rot, fill, core = 'url(#pearl)') =>
  `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)}) scale(${s})">${[0, 72, 144, 216, 288].map(a => `<ellipse rx="6" ry="9.5" fill="${fill}" stroke="#a48fb8" stroke-opacity=".35" stroke-width=".6" transform="rotate(${a}) translate(0 -8.5)"/>`).join('')}<circle r="3.6" fill="${core}"/></g>`;
const leaf = (x, y, s, rot) =>
  `<path d="M0 0 C6 -8 18 -10 28 -4 C18 2 8 4 0 0 Z" fill="url(#leaf)" opacity=".92" transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)}) scale(${s})"/>`;

function mirrorSVG() {
  const cx = 160, cy = 200;
  const E = (rx, ry, a) => [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  let scal = '', pearls = '', inner = '', fl = '';
  for (let i = 0; i < 34; i++) {
    const a = i / 34 * Math.PI * 2;
    const [x, y] = E(138, 176, a);
    scal += `<circle cx="${r2(x)}" cy="${r2(y)}" r="13.5" fill="#d9c6df" stroke="#b39ac0" stroke-width="1"/>`;
    const [px, py] = E(141, 179, a);
    pearls += `<circle cx="${r2(px)}" cy="${r2(py)}" r="4.2" fill="url(#pearl)"/>`;
  }
  for (let i = 0; i < 60; i++) {
    const [x, y] = E(104, 140, i / 60 * Math.PI * 2);
    inner += `<circle cx="${r2(x)}" cy="${r2(y)}" r="2.6" fill="url(#pearl)"/>`;
  }
  [-90, -55, -20, 20, 55, 90, 125, 160, 200, 235].forEach((deg, i) => {
    const a = deg * Math.PI / 180;
    const [x, y] = E(122, 158, a);
    const [l1x, l1y] = E(122, 158, a + .13), [l2x, l2y] = E(122, 158, a - .13);
    fl += leaf(l1x, l1y, .8, deg + 90) + leaf(l2x, l2y, .8, deg - 90);
    fl += flower(x, y, deg === -90 || deg === 90 ? 1.25 : .9, deg, i % 3 === 1 ? 'url(#petal)' : 'url(#petalW)');
  });
  const photo = CONFIG.photo
    ? `<image href="${esc(CONFIG.photo)}" x="${cx - 100}" y="${cy - 136}" width="200" height="272" preserveAspectRatio="xMidYMid slice" clip-path="url(#mirrorClip)"/>`
    : `<text x="${cx}" y="${cy + 5}" text-anchor="middle" font-family="EB Garamond, serif" font-style="italic" font-size="15" fill="#8a8380">${esc(T.photo)}</text>`;
  return `<svg viewBox="0 0 320 400" role="img" aria-label="${esc(CONFIG.bride)} & ${esc(CONFIG.groom)}">
    <defs><clipPath id="mirrorClip"><ellipse cx="${cx}" cy="${cy}" rx="98" ry="134"/></clipPath></defs>
    <ellipse cx="${cx}" cy="${cy + 6}" rx="146" ry="184" fill="#6b4f70" opacity=".16" filter="url(#soft)"/>
    ${scal}
    <ellipse cx="${cx}" cy="${cy}" rx="138" ry="176" fill="#e6d8e8"/>
    <ellipse cx="${cx}" cy="${cy}" rx="134" ry="172" fill="url(#lace)" opacity=".9"/>
    ${pearls}
    <ellipse cx="${cx}" cy="${cy}" rx="112" ry="148" fill="none" stroke="url(#champ)" stroke-width="3"/>
    ${inner}
    <ellipse cx="${cx}" cy="${cy}" rx="99" ry="135" fill="url(#photoPh)" stroke="url(#champ)" stroke-width="2.5"/>
    ${photo}
    <ellipse cx="${cx}" cy="${cy}" rx="98" ry="134" fill="none" stroke="#5a4a66" stroke-opacity=".25" stroke-width="3"/>
    ${fl}
  </svg>`;
}

function monogramSVG() {
  const mono = esc(CONFIG.monogram || (CONFIG.bride[0] + CONFIG.groom[0]));
  const a = mono[0] || '', b = mono.slice(1);
  let laurel = '';
  for (const side of [-1, 1]) {
    laurel += `<path d="M50 106 Q${50 + side * 46} 90 ${50 + side * 36} 20" fill="none" stroke-width="1.3"/>`;
    for (let i = 0; i < 8; i++) {
      const t = i / 8, y = 98 - t * 72, x = 50 + side * (12 + 30 * Math.sin(Math.PI * (0.18 + t * .6)));
      laurel += `<ellipse cx="${r2(x + side * 4)}" cy="${r2(y)}" rx="2.2" ry="5.6" transform="rotate(${r2(side * (45 - t * 30))} ${r2(x + side * 4)} ${r2(y)})"/>`;
      laurel += `<ellipse cx="${r2(x - side * 3.5)}" cy="${r2(y - 3)}" rx="2" ry="5" transform="rotate(${r2(side * (-15 - t * 10))} ${r2(x - side * 3.5)} ${r2(y - 3)})"/>`;
    }
  }
  const txt = `<text x="50" y="70" text-anchor="middle" font-family="Pinyon Script, Parisienne, cursive" font-size="36">${a}<tspan font-size="22" dy="-3">&amp;</tspan><tspan dy="3">${b}</tspan></text>`;
  const art = `${laurel}${txt}`;
  return `<svg viewBox="0 0 100 116" aria-hidden="true">
    <g fill="#7f4a68" stroke="#7f4a68" fill-opacity=".5" stroke-opacity=".45" transform="translate(.8 1.1)">${art}</g>
    <g fill="#fbe9f1" stroke="#fbe9f1" fill-opacity=".92" stroke-opacity=".85">${art}</g>
  </svg>`;
}
const ORN = s => `<svg class="orn fx" ${s} viewBox="0 0 200 20" aria-hidden="true"><path d="M10 10 H82 M118 10 H190" stroke="#a98fa6" stroke-width="1.2"/><path d="M100 3 L106 10 L100 17 L94 10 Z" fill="none" stroke="#b79a72" stroke-width="1.2"/><circle cx="88" cy="10" r="2" fill="#b79a72"/><circle cx="112" cy="10" r="2" fill="#b79a72"/></svg>`;
const mapUrl = p => p.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name}, ${p.address}`)}`;
const tel = p => `tel:${p.replace(/[^\d+]/g, '')}`;
function daysLeft() { const today = new Date(); today.setHours(0, 0, 0, 0); return Math.round((wedding - today) / 864e5); }

/* ---------------------------------------------------------------
   SLIDES
   --------------------------------------------------------------- */
const HOLD = Number(CONFIG.slideHold) || 3.2;
const dateLong = fmt(wedding, { day: 'numeric', month: 'long', year: 'numeric' });
const weekday = fmt(wedding, { weekday: 'long' });
const monthYear = fmt(wedding, { month: 'long', year: 'numeric' });
const MONO = `<div class="monogram">${monogramSVG()}</div>`;

const SLIDES = [
  { cls: 's-invite', bg: 'card-plain.jpg', build() {
    const tl = TL(.6);
    const html = `<div class="box">
      <p class="p lead">${tl.words(T.lead, .14)}</p>
      <p class="p names">${namesHTML(tl)}</p>
      <p class="p body">${tl.words(T.body, .13)}</p>
      ${ORN(tl.fx(.2))}
    </div>`;
    return [html, tl.end];
  } },
  { cls: 's-date', bg: 'card-ribbon.jpg', build() {
    const tl = TL(.6);
    const n = daysLeft();
    const count = n < 0 ? '' : n === 0 ? esc(T.today) : n === 1 ? esc(T.countdown1)
      : esc(T.countdown).replace('{n}', `<b data-n="${n}">0</b>`);
    const html = `${MONO}<div class="box">
      <p class="p label">${tl.words(T.saveDate, .14)}</p>
      <p class="p big-day fx" ${tl.fx(.1)}>${D}</p>
      <p class="p month">${tl.words(monthYear, .16)}</p>
      <p class="p wkday">${tl.words(`${weekday} · ${CONFIG.time}`)}</p>
      ${count ? `<p class="p count fx" ${tl.fx(.25)}>${count}</p>` : ''}
    </div>`;
    this.countAt = tl.now;
    return [html, tl.end + 1.2];
  } },
  { cls: 's-rsvp', bg: 'card-mirror.jpg', build() {
    const c = CONFIG, tl = TL(.6);
    const html = `${MONO}
      <div class="box oval">
        <p class="p label">${tl.words(T.lblRsvp)}</p>
        <ul class="contacts">${c.rsvp.contacts.map(p => `<li class="fx" ${tl.fx(.1)}><span>${esc(p.name)}</span><a href="${esc(tel(p.phone))}">${esc(p.phone)}</a></li>`).join('')}</ul>
        ${V.deadline ? `<p class="p small" style="margin-top:calc(var(--u)*2)">${tl.words(fill(T.rsvpBy))}</p>` : ''}
      </div>
      <div class="box bot">
        <button class="btn fx" ${tl.fx(.2)} type="button" data-act="ics">${esc(T.btnCal)}</button>
      </div>`;
    return [html, tl.end];
  } },
  { cls: 's-places', bg: 'card-details.jpg', build() {
    const c = CONFIG, tl = TL(.6);
    const html = `${MONO}<div class="box">
      <p class="p label">${tl.words(T.lblCeremony)}</p>
      <p class="p place">${tl.words(c.ceremony.name)}</p>
      <p class="p small">${tl.words(`${c.ceremony.address} · ${c.time}`)}</p>
      <a class="map fx" ${tl.fx()} href="${esc(mapUrl(c.ceremony))}" target="_blank" rel="noopener">${esc(T.btnMap)} ›</a>
      ${ORN(tl.fx(.2))}
      <p class="p label">${tl.words(T.lblReception)}</p>
      <p class="p place">${tl.words(c.reception.name)}</p>
      <p class="p small">${tl.words(`${c.reception.address}${c.reception.time ? ` · ${c.reception.time}` : ''}`)}</p>
      <a class="map fx" ${tl.fx()} href="${esc(mapUrl(c.reception))}" target="_blank" rel="noopener">${esc(T.btnMap)} ›</a>
      ${ORN(tl.fx(.2)).replace('class="orn fx"', 'class="orn fx welcome-gap"')}
      <p class="p welcome">${tl.letters(T.welcome, .06)}</p>
      <button class="linkish fx" ${tl.fx(.1)} type="button" data-act="replay">↺ ${esc(T.replay)}</button>
    </div>`;
    return [html, tl.end];
  } },
];

function buildDeck() {
  const card = $('#card');
  card.innerHTML = SLIDES.map((s, i) => {
    const [html, end] = s.build();
    s.dur = end + (i < SLIDES.length - 1 ? HOLD : 0);
    return `<section class="slide ${s.cls}${i === 0 ? ' is-active' : ''}" data-i="${i}" aria-hidden="${i ? 'true' : 'false'}">${html}</section>`;
  }).join('') + '<div class="sheen" aria-hidden="true"></div>';
  card.querySelectorAll('[data-act="ics"]').forEach(b => b.addEventListener('click', downloadIcs));
  card.querySelectorAll('[data-act="replay"]').forEach(b => b.addEventListener('click', () => go(0)));
}

function downloadIcs() {
  const [h, m] = (CONFIG.time || '18:00').split(':').map(Number);
  const start = `${Y}${pad(M + 1)}${pad(D)}T${pad(h)}${pad(m || 0)}00`;
  const endD = new Date(Y, M, D, h + 7, m || 0);
  const end = `${endD.getFullYear()}${pad(endD.getMonth() + 1)}${pad(endD.getDate())}T${pad(endD.getHours())}${pad(endD.getMinutes())}00`;
  const escI = s => String(s).replace(/([,;\\])/g, '\\$1');
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//wedding-invitation//EN', 'BEGIN:VEVENT',
    `UID:${start}-${Math.random().toString(36).slice(2)}@wedding`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${start}`, `DTEND:${end}`, `SUMMARY:${escI(fill(T.calEvent))}`,
    `LOCATION:${escI(`${CONFIG.ceremony.name}, ${CONFIG.ceremony.address}`)}`,
    `DESCRIPTION:${escI(`${T.lblReception}: ${CONFIG.reception.name}, ${CONFIG.reception.address} ${CONFIG.reception.time || ''}`)}`,
    'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  a.download = 'wedding.ics'; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}

/* ---------------------------------------------------------------
   DECK  — auto-advances like a story; tap right / swipe for next,
   tap left for back.
   --------------------------------------------------------------- */
const progress = $('#progress'), backdrop = $('#backdrop'), bds = [...document.querySelectorAll('.bd')];
let cur = 0, timer = 0, bdFlip = 0, countTimer = 0;
const slidesEls = () => [...document.querySelectorAll('#card .slide')];
const restart = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

function setBackdrop(file) {
  bdFlip ^= 1;
  bds[bdFlip].style.backgroundImage = `url(img/bg-${file})`;
  bds[bdFlip].classList.add('on'); bds[bdFlip ^ 1].classList.remove('on');
}

function go(i) {
  if (i < 0 || i >= SLIDES.length) return;
  clearTimeout(timer); clearTimeout(countTimer);
  const els = slidesEls();
  els.forEach((el, j) => {
    const on = j === i;
    el.classList.toggle('is-leaving', j === cur && j !== i);
    el.classList.toggle('is-active', on);
    el.setAttribute('aria-hidden', on ? 'false' : 'true');
    if (!on) setTimeout(() => { if (j !== cur) el.classList.remove('play', 'is-leaving'); }, 1100);
  });
  cur = i;
  restart(els[i], 'play');
  restart($('#card .sheen'), 'run');
  setBackdrop(SLIDES[i].bg);
  // progress bars
  [...progress.children].forEach((seg, j) => {
    seg.className = 'seg' + (j < i ? ' done' : '');
    if (j === i) { seg.style.setProperty('--dur', `${SLIDES[i].dur}s`); restart(seg, i === SLIDES.length - 1 ? 'hold' : 'run'); }
  });
  if (i < SLIDES.length - 1) timer = setTimeout(() => go(i + 1), SLIDES[i].dur * 1000);
  const b = els[i].querySelector('.count b');
  if (b) { b.textContent = '0'; countTimer = setTimeout(() => countUp(b), (SLIDES[i].countAt + .2) * 1000); }
}
function countUp(b) {
  const n = Number(b.dataset.n) || 0, t0 = performance.now();
  (function step(now) {
    const k = Math.min(1, (now - t0) / 1800), e = 1 - Math.pow(1 - k, 3);
    b.textContent = Math.round(n * e);
    if (k < 1 && b.isConnected) requestAnimationFrame(step);
  })(t0);
}

function initDeckInput() {
  progress.innerHTML = SLIDES.map((_, i) => `<span class="seg" data-i="${i}" role="button" aria-label="${i + 1}"></span>`).join('');
  progress.addEventListener('click', e => { const s = e.target.closest('.seg'); if (s && state === 'open') go(Number(s.dataset.i)); });
  const cardEl = $('#card');
  let x0 = 0, y0 = 0, down = false;
  cardEl.addEventListener('pointerdown', e => { down = true; x0 = e.clientX; y0 = e.clientY; });
  cardEl.addEventListener('pointerup', e => {
    if (!down || state !== 'open') return; down = false;
    if (e.target.closest('a, button')) return;
    const dx = e.clientX - x0, dy = e.clientY - y0;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { go(cur + (dx < 0 ? 1 : -1)); return; }
    if (Math.abs(dx) > 12 || Math.abs(dy) > 12) return;
    const r = cardEl.getBoundingClientRect();
    go(cur + ((e.clientX - r.left) < r.width * .33 ? -1 : 1));
  });
  addEventListener('keydown', e => {
    if (state !== 'open') return;
    if (e.key === 'ArrowRight') go(cur + 1);
    if (e.key === 'ArrowLeft') go(cur - 1);
  });
}

/* ---------------------------------------------------------------
   LAYOUT — the card is laid out at its final size and only *scaled*
   while inside the envelope, so it is perfectly sharp once it lands.
   --------------------------------------------------------------- */
const env = $('#env'), envWrap = $('#envWrap'), card = $('#card'), slot = $('#slot'), stage = $('#cardStage');
const flap = $('#flap'), seal = $('#seal'), hint = $('#hint'), closeBtn = $('#closeBtn');
const CARD_RATIO = 941 / 1672;
const ENV_RATIO = 910 / 1222;
const TOPGAP = 60;
let L = {};
function layout() {
  const vw = innerWidth, vh = innerHeight;
  const ew = Math.min(vw * 0.84, vh * 0.66 * ENV_RATIO, 430);
  const eh = ew / ENV_RATIO;
  const cw = Math.min(vw - 24, 460, (vh - 2 * TOPGAP) * CARD_RATIO);
  const ch = cw / CARD_RATIO;
  const k = (ew * 0.68) / cw;
  L = { vw, vh, ew, eh, cw, ch, k, inX: ew * 0.16, inY: eh * 0.05, fx: (vw - cw) / 2, fy: Math.max(TOPGAP, (vh - ch) / 2) };
  const root = document.documentElement.style;
  root.setProperty('--ew', `${ew}px`);
  root.setProperty('--cw', `${cw}px`); root.setProperty('--ch', `${ch}px`); root.setProperty('--u', `${cw / 100}px`);
}
const inEnvTransform = (dy = 0) => `translate(${L.inX}px, ${L.inY + dy}px) scale(${L.k})`;

/* ---------------------------------------------------------------
   ENVELOPE ANIMATION (Web Animations API — transforms + opacity)
   --------------------------------------------------------------- */
const SPEED = (reduced ? 0.35 : 1.75) *   // 1.75 = slow, graceful opening
  (Number(new URLSearchParams(location.search).get('slow')) || 1);
const EASE = 'cubic-bezier(.45,.05,.25,1)';
function run(el, frames, ms, opts = {}) {
  const a = el.animate(frames, { duration: ms * SPEED, easing: opts.easing || EASE, delay: (opts.delay || 0) * SPEED, fill: 'both' });
  return a.finished.then(() => { Object.assign(el.style, frames[frames.length - 1]); a.cancel(); });
}
const wait = ms => new Promise(r => setTimeout(r, ms));
const FLAP0 = 'perspective(1100px) rotateX(0deg)', FLAP1 = 'perspective(1100px) rotateX(180deg)';
const SEAL0 = 'translateY(0%) scale(1) rotate(0deg)', SEAL1 = 'translateY(-9%) scale(1.08) rotate(0deg)', SEAL2 = 'translateY(-70%) scale(.9) rotate(-12deg)';
let state = 'closed';

async function open() {
  if (state !== 'closed' || document.body.classList.contains('intro')) return;
  state = 'opening';
  hint.classList.add('gone');
  startMusic();
  env.setAttribute('aria-expanded', 'true');
  card.classList.remove('dormant');              // other slides start loading now

  await run(seal, [{ transform: SEAL0, opacity: 1 }, { transform: SEAL1, opacity: 1 }], 380, { easing: 'cubic-bezier(.3,.6,.3,1)' });
  run(seal, [{ transform: SEAL1, opacity: 1 }, { transform: SEAL2, opacity: 0 }], 420);

  setTimeout(() => flap.classList.add('open'), 380 * SPEED);
  await run(flap, [{ transform: FLAP0 }, { transform: FLAP1 }], 760, { delay: 60 });

  const r = env.getBoundingClientRect();
  const cardH = L.ch * L.k;
  const peek = -cardH * 0.45;
  await run(card, [{ transform: inEnvTransform(0) }, { transform: inEnvTransform(peek) }], 620);
  const out = -(L.inY + cardH) - 4;
  const envDy = Math.max(0, 14 + cardH - r.top);
  run(envWrap, [{ transform: 'translateY(0px)' }, { transform: `translateY(${envDy}px)` }], 640);
  await run(card, [{ transform: inEnvTransform(peek) }, { transform: inEnvTransform(out) }], 640);

  const cr = card.getBoundingClientRect();
  stage.appendChild(card);
  card.style.left = `${L.fx}px`; card.style.top = `${L.fy}px`;
  const from = `translate(${cr.left - L.fx}px, ${cr.top - L.fy}px) scale(${L.k})`;
  card.style.transform = from;
  backdrop.classList.add('on');
  run(envWrap, [{ transform: `translateY(${envDy}px)`, opacity: 1 }, { transform: `translateY(${envDy + L.vh * 0.25}px)`, opacity: 0 }], 700);
  await run(card, [{ transform: from }, { transform: 'translate(0px, 0px) scale(1)' }], 780, { easing: 'cubic-bezier(.2,.75,.25,1)' });
  card.style.transform = '';

  closeBtn.hidden = false;
  progress.hidden = false;
  state = 'open';
  cur = 0; go(0);
}

async function close() {
  if (state !== 'open') return;
  state = 'closing';
  clearTimeout(timer); clearTimeout(countTimer);
  closeBtn.hidden = true; progress.hidden = true;
  backdrop.classList.remove('on');
  const els = slidesEls();
  if (cur !== 0) {
    els.forEach((el, j) => { el.classList.toggle('is-active', j === 0); el.classList.remove('is-leaving'); });
    await wait(1000);
  }
  els.forEach(el => el.classList.remove('play'));
  cur = 0;
  card.style.left = `${L.fx}px`; card.style.top = `${L.fy}px`; card.style.transform = 'translate(0px, 0px) scale(1)';

  const cardH = L.ch * L.k;
  const out = -(L.inY + cardH) - 4;
  envWrap.style.transform = 'translateY(0px)';
  const er = env.getBoundingClientRect();
  const envDy = Math.max(0, 14 + cardH - er.top);
  const tx = er.left + L.inX - L.fx, ty = er.top + envDy + L.inY + out - L.fy;
  run(envWrap, [{ transform: `translateY(${envDy + L.vh * 0.25}px)`, opacity: 0 }, { transform: `translateY(${envDy}px)`, opacity: 1 }], 700);
  await run(card, [{ transform: 'translate(0px, 0px) scale(1)' }, { transform: `translate(${tx}px, ${ty}px) scale(${L.k})` }], 720);

  slot.appendChild(card);
  card.style.left = ''; card.style.top = '';
  card.style.transform = inEnvTransform(out);
  run(envWrap, [{ transform: `translateY(${envDy}px)` }, { transform: 'translateY(0px)' }], 640);
  await run(card, [{ transform: inEnvTransform(out) }, { transform: inEnvTransform(0) }], 760);

  setTimeout(() => flap.classList.remove('open'), 380 * SPEED);
  await run(flap, [{ transform: FLAP1 }, { transform: FLAP0 }], 720);
  await run(seal, [{ transform: 'translateY(-30%) scale(1.06) rotate(0deg)', opacity: 0 }, { transform: SEAL0, opacity: 1 }], 420, { easing: 'cubic-bezier(.3,.6,.3,1)' });
  card.classList.add('dormant');
  env.setAttribute('aria-expanded', 'false');
  hint.classList.remove('gone');
  state = 'closed';
}

function relayout() {
  if (state === 'opening' || state === 'closing') return;
  layout();
  if (state === 'closed') card.style.transform = inEnvTransform(0);
  else { card.style.left = `${L.fx}px`; card.style.top = `${L.fy}px`; }
}

/* ---------------------------------------------------------------
   OPENING TITLES
   --------------------------------------------------------------- */
let introDone = false, introTimer = 0;
function intro() {
  const tl = TL(.3);
  const el = $('#intro');
  el.innerHTML = `<p class="it-kicker">${tl.words(T.kicker, .16)}</p>
    <h1 class="it-names">${namesHTML(tl)}</h1>
    <p class="it-date">${tl.words(`${pad(D)} · ${pad(M + 1)} · ${Y}`, .2)}</p>`;
  const begin = () => { el.classList.add('play'); introTimer = setTimeout(endIntro, (tl.end + 1.3) * 1000); };
  // wait for the script font so the letters don't flash in a fallback face
  Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), wait(1500)]).then(begin);
  addEventListener('pointerdown', endIntro, { once: true });
  addEventListener('keydown', endIntro, { once: true });
}
function endIntro() {
  if (introDone) return;
  introDone = true; clearTimeout(introTimer);
  document.body.classList.remove('intro');
}

/* ---------------------------------------------------------------
   PETALS — a few soft petals drifting down (one small canvas)
   --------------------------------------------------------------- */
function startPetals() {
  if (reduced) return;
  const c = $('#petals'), x = c.getContext('2d');
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  let W = 0, H = 0;
  const size = () => { W = innerWidth; H = innerHeight; c.width = W * dpr; c.height = H * dpr; };
  size(); addEventListener('resize', size);
  const sprite = (c1, c2) => {
    const s = document.createElement('canvas'); s.width = 44; s.height = 30;
    const g = s.getContext('2d'), gr = g.createRadialGradient(16, 11, 2, 22, 15, 22);
    gr.addColorStop(0, '#fffafd'); gr.addColorStop(.55, c1); gr.addColorStop(1, c2);
    g.fillStyle = gr; g.beginPath();
    g.moveTo(2, 15); g.bezierCurveTo(10, 0, 34, 0, 42, 15); g.bezierCurveTo(34, 30, 10, 30, 2, 15); g.fill();
    return s;
  };
  const SPR = [sprite('#efd6e6', '#d2aecb'), sprite('#e6dbf2', '#bba3d4'), sprite('#fbf3ee', '#e5d3cd')];
  const N = innerWidth < 600 ? 14 : 22;
  const P = Array.from({ length: N }, () => mk(true));
  function mk(first) {
    return {
      x: Math.random() * innerWidth, y: first ? Math.random() * innerHeight : -30,
      vy: .25 + Math.random() * .45, vx: -.15 + Math.random() * .3,
      r: Math.random() * 6.28, vr: (-.5 + Math.random()) * .02,
      s: .35 + Math.random() * .4, ph: Math.random() * 6.28, f: .6 + Math.random() * .8,
      img: SPR[(Math.random() * SPR.length) | 0], a: .55 + Math.random() * .35,
    };
  }
  let last = performance.now();
  (function frame(now) {
    const dt = Math.min(3, (now - last) / 16.7); last = now;
    if (!document.hidden) {
      x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, c.width, c.height);
      const t = now / 1000;
      for (let i = 0; i < P.length; i++) {
        const p = P[i];
        p.y += p.vy * dt; p.x += (p.vx + Math.sin(t * p.f + p.ph) * .35) * dt; p.r += p.vr * dt;
        if (p.y > H + 30 || p.x < -40 || p.x > W + 40) { P[i] = mk(false); continue; }
        x.setTransform(dpr, 0, 0, dpr, 0, 0);
        x.translate(p.x, p.y); x.rotate(p.r); x.scale(p.s, p.s * Math.cos(t * p.f * 1.3 + p.ph));
        x.globalAlpha = p.a;
        x.drawImage(p.img, -22, -15);
      }
    }
    requestAnimationFrame(frame);
  })(last);
}

/* ---------------------------------------------------------------
   MUSIC  (starts on the first touch; loops from CONFIG.musicStart)
   --------------------------------------------------------------- */
const musicBtn = $('#musicBtn');
let audio = null, musicOn = false, userPaused = false;
function initMusic() {
  if (!CONFIG.music) return;
  const start = Math.max(0, Number(CONFIG.musicStart) || 0);
  audio = new Audio(start ? `${CONFIG.music}#t=${start}` : CONFIG.music);
  audio.preload = 'none'; audio.volume = 0;
  const toStart = () => { try { if (audio && audio.currentTime < start - .5) audio.currentTime = start; } catch (e) {} };
  audio.addEventListener('loadedmetadata', toStart);
  audio.addEventListener('play', toStart);
  audio.addEventListener('ended', () => { if (!audio) return; audio.currentTime = start; audio.play().catch(() => {}); });
  audio.addEventListener('error', () => { audio = null; musicBtn.hidden = true; });
  musicBtn.addEventListener('click', () => {
    if (!audio) return;
    if (audio.paused) { userPaused = false; audio.play().catch(() => {}); musicBtn.classList.remove('muted'); }
    else { userPaused = true; audio.pause(); musicBtn.classList.add('muted'); }
  });
  ['pointerdown', 'touchend', 'keydown'].forEach(e => addEventListener(e, startMusic, { capture: true, passive: true }));
}
function startMusic() {
  if (!audio || musicOn || userPaused) return;
  audio.play().then(() => {
    if (musicOn) return;
    musicOn = true;
    musicBtn.hidden = false; musicBtn.classList.remove('muted');
    const t0 = Date.now();
    const fade = setInterval(() => { const k = Math.min(1, (Date.now() - t0) / 4000); if (audio) audio.volume = .55 * k; if (k >= 1 || !audio) clearInterval(fade); }, 50);
  }).catch(() => {});
}

/* ---------------------------------------------------------------
   INIT
   --------------------------------------------------------------- */
$('#defs').innerHTML = `<defs>${defs()}</defs>`;
buildDeck();
initDeckInput();
hint.textContent = T.tapHint;
closeBtn.textContent = T.close;
env.setAttribute('aria-expanded', 'false');
layout();
card.style.transform = inEnvTransform(0);
initMusic();
startPetals();   // petals fall from the very start, before the envelope
intro();

env.addEventListener('click', open);
env.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
closeBtn.addEventListener('click', close);
addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
let rT; addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(relayout, 150); });
})();
