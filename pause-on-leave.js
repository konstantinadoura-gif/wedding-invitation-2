/* Σταματά τη μουσική και όλους τους ήχους όταν ο καλεσμένος φεύγει από τη σελίδα
   (άλλη καρτέλα, άλλη εφαρμογή, κλείδωμα οθόνης) και τη συνεχίζει όταν γυρίσει.
   Stops all sound when the guest leaves the page; resumes it when they come back. */
(function () {
  var media = new Set(), ctxs = new Set(), wasPlaying = new Set(), wasRunning = new Set();
  var away = false;

  var origPlay = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    media.add(this);
    if (away) { wasPlaying.add(this); return Promise.resolve(); }  // play later, when they return
    return origPlay.apply(this, arguments);
  };

  ['AudioContext', 'webkitAudioContext'].forEach(function (name) {
    var Orig = window[name];
    if (!Orig) return;
    var Wrapped = function () {
      var c = new (Function.prototype.bind.apply(Orig, [null].concat([].slice.call(arguments))))();
      ctxs.add(c);
      return c;
    };
    Wrapped.prototype = Orig.prototype;
    window[name] = Wrapped;
  });

  function leave() {
    if (away) return;
    away = true;
    media.forEach(function (m) { if (!m.paused) { wasPlaying.add(m); m.pause(); } });
    ctxs.forEach(function (c) { if (c.state === 'running') { wasRunning.add(c); c.suspend().catch(function () {}); } });
  }
  function back() {
    if (!away) return;
    away = false;
    wasPlaying.forEach(function (m) { var p = origPlay.call(m); if (p && p.catch) p.catch(function () {}); });
    wasRunning.forEach(function (c) { c.resume().catch(function () {}); });
    wasPlaying.clear(); wasRunning.clear();
  }

  document.addEventListener('visibilitychange', function () { document.hidden ? leave() : back(); });
  window.addEventListener('pagehide', leave);
  window.addEventListener('pageshow', function () { if (!document.hidden) back(); });
})();
