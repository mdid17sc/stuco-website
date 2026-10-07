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
