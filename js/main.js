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
    var W = document.documentElement.clientWidth, y0 = window.scrollY, x0 = window.scrollX;
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
