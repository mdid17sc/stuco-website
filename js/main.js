// Announcement banner: shown unless the visitor dismissed this banner id.
const banner = document.querySelector('.banner');
if (banner) {
  const key = 'banner-dismissed-' + banner.dataset.bannerId;
  let dismissed = false;
  try { dismissed = localStorage.getItem(key) === '1'; } catch (e) {}
  banner.hidden = dismissed;
  banner.querySelector('.banner-close').addEventListener('click', () => {
    banner.hidden = true;
    try { localStorage.setItem(key, '1'); } catch (e) {}
  });
}

// Halloween Week countdown (only runs on pages with #cd)
(function () {
  var box = document.getElementById('cd');
  if (!box) return;
  var start = new Date(box.dataset.start).getTime();
  var end = new Date(box.dataset.end).getTime();
  var label = document.getElementById('cd-label');
  function set(id, v) { document.getElementById(id).textContent = String(v).padStart(2, '0'); }
  function tick() {
    var now = Date.now();
    var target = now < start ? start : end;
    if (now >= end) { label.textContent = 'Halloween Week has ended. See you next year!'; box.hidden = true; box.parentElement.hidden = true; return; }
    label.textContent = now < start ? 'Starts in' : 'Happening now! Ends in';
    var diff = Math.max(0, target - now);
    set('cd-d', Math.floor(diff / 864e5));
    set('cd-h', Math.floor(diff % 864e5 / 36e5));
    set('cd-m', Math.floor(diff % 36e5 / 6e4));
    set('cd-s', Math.floor(diff % 6e4 / 1e3));
  }
  tick();
  setInterval(tick, 1000);
})();

// Feedback pillar: hand-drawn scribble arrow pointing at the "Give Feedback" nav link
(function () {
  var wrap = document.querySelector('.doodle');
  if (!wrap) return;
  var link = document.querySelector('.links a[href="feedback.html"]');
  var svg = wrap.querySelector('svg'), line = wrap.querySelector('.d-line'), head = wrap.querySelector('.d-head');
  var note = wrap.querySelector('.doodle-note');
  function draw() {
    if (!link) return;
    var W = document.documentElement.clientWidth, y0 = 0, x0 = 0; // fixed overlay: viewport coordinates
    var lr = link.getBoundingClientRect();
    var nw = note.offsetWidth, nh = note.offsetHeight;
    var ex = lr.left + lr.width / 2 + x0, ey = lr.bottom + y0 + 8;
    var narrow = W < 700;
    var nl = Math.min(W - nw - 12, Math.max(12, ex - nw - (narrow ? 0 : 60)));
    var nt = ey + (narrow ? 130 : 105);
    note.style.left = nl + 'px'; note.style.top = nt + 'px';
    var sx = nl + nw * 0.7, sy = nt - 8, dx = ex - sx, dy = ey - sy;
    var m = sx + dx * 0.5;
    var d = 'M' + sx + ',' + sy +
      ' C' + (sx + dx * 0.05) + ',' + (sy + dy * 0.45) + ' ' + (m - 45) + ',' + (sy + dy * 0.95) + ' ' + m + ',' + (sy + dy * 0.6) +
      ' C' + (m + 50) + ',' + (sy + dy * 0.25) + ' ' + (m - 15) + ',' + (sy + dy * 0.02) + ' ' + (m - 8) + ',' + (sy + dy * 0.4) +
      ' C' + (m - 2) + ',' + (sy + dy * 0.7) + ' ' + (ex - 22) + ',' + (ey + 30) + ' ' + ex + ',' + ey;
    line.setAttribute('d', d);
    var a = Math.atan2(-30, 22), L = 17;
    var h = 'M' + (ex + L * Math.cos(a + 2.5)) + ',' + (ey + L * Math.sin(a + 2.5)) + ' L' + ex + ',' + ey + ' L' + (ex + L * Math.cos(a - 2.5)) + ',' + (ey + L * Math.sin(a - 2.5));
    head.setAttribute('d', h);
    svg.setAttribute('width', W); svg.setAttribute('height', Math.max(ey, nt + nh) + 40);
    var len = line.getTotalLength();
    line.style.strokeDasharray = len; line.style.setProperty('--len', len);
  }
  draw();
  window.addEventListener('resize', draw);
  window.addEventListener('load', draw);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
})();

// Photos: enlarge in place (hover with a mouse, tap on touch screens). No pop-up window.
(function () {
  var photos = document.querySelectorAll('img.photo');
  if (!photos.length) return;
  var canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
  var current = null;

  // Keep the enlarged picture fully on screen (below the sticky nav)
  function fit(wrap) {
    var grow = wrap.querySelector('.photo-grow');
    grow.style.maxHeight = ''; grow.style.top = '0px'; grow.style.marginLeft = '0px';
    var vh = window.innerHeight, vw = document.documentElement.clientWidth, minTop = 72;
    grow.style.maxHeight = (vh - minTop - 16) + 'px';
    var w = wrap.getBoundingClientRect(), g = grow.getBoundingClientRect();
    var top = Math.min(Math.max(w.top, minTop), Math.max(vh - g.height - 14, minTop));
    grow.style.top = (top - w.top) + 'px';
    if (g.left < 8) grow.style.marginLeft = (8 - g.left) + 'px';
    else if (g.right > vw - 8) grow.style.marginLeft = -(g.right - (vw - 8)) + 'px';
  }
  function show(wrap) {
    if (current && current !== wrap) hide(current);
    current = wrap;
    wrap.classList.add('is-grown');
    fit(wrap);
  }
  function hide(wrap) {
    wrap.classList.remove('is-grown');
    if (current === wrap) current = null;
  }
  function onMove() { if (current) fit(current); }
  window.addEventListener('scroll', onMove, { passive: true });
  window.addEventListener('resize', onMove);

  // Wide pictures enlarge in place
  function makeZoomable(img) {
    var wrap = document.createElement('span');
    wrap.className = 'zoomable';
    wrap.tabIndex = 0;
    wrap.setAttribute('role', 'button');
    wrap.setAttribute('aria-label', 'Enlarge picture: ' + (img.alt || ''));
    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);
    var grow = document.createElement('img');
    grow.className = 'photo-grow';
    grow.src = img.currentSrc || img.src;
    grow.alt = '';
    grow.setAttribute('aria-hidden', 'true');
    wrap.appendChild(grow);

    if (canHover) {
      wrap.addEventListener('mouseenter', function () { show(wrap); });
      wrap.addEventListener('mouseleave', function () { hide(wrap); });
    } else {
      wrap.addEventListener('click', function (e) {
        e.stopPropagation();
        if (wrap.classList.contains('is-grown')) hide(wrap); else show(wrap);
      });
    }
    wrap.addEventListener('focus', function () { show(wrap); });
    wrap.addEventListener('blur', function () { hide(wrap); });
    wrap.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(wrap); });
  }

  photos.forEach(function (img) {
    function setup() {
      if (img.parentNode.classList.contains('zoomable')) return;
      if (img.naturalHeight / img.naturalWidth > 1.2) img.classList.add('tall'); else makeZoomable(img);
    }
    if (img.complete && img.naturalWidth) setup(); else img.addEventListener('load', setup);
  });
  document.addEventListener('click', function () { if (current) hide(current); });
})();
