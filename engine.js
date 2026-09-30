/* DJMath engine - DJ mixing math. Pure functions, no DOM. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DJMath = api;
}(typeof self !== 'undefined' ? self : this, function () {

  function r1(x) { return Math.round(x * 10) / 10; }

  // Resulting BPM from a base tempo and a pitch slider percentage.
  function sliderBpm(baseBpm, sliderPct) {
    return r1(baseBpm * (1 + sliderPct / 100));
  }

  // Slider percentage needed to go from one BPM to another. Rounded to 0.1.
  function sliderFor(fromBpm, toBpm) {
    return r1((toBpm / fromBpm - 1) * 100);
  }

  // Best way to match toBpm from fromBpm: direct, half-time or double-time,
  // judged against a slider range (default +/-8%).
  function bpmMatch(fromBpm, toBpm, rangePct) {
    var range = rangePct || 8;
    var cands = [
      { mode: 'direct', target: toBpm },
      { mode: 'half-time (incoming feels half speed)', target: toBpm / 2 },
      { mode: 'double-time (incoming feels double speed)', target: toBpm * 2 }
    ];
    var best = null;
    cands.forEach(function (c) {
      var pct = sliderFor(fromBpm, c.target);
      var ok = Math.abs(pct) <= range;
      if (!best || Math.abs(pct) < Math.abs(best.pct)) {
        best = { mode: c.mode, target: r1(c.target), pct: pct, inRange: ok };
      }
    });
    return best;
  }

  // Camelot wheel: 1-12 around the clock, A = minor, B = major.
  function parseKey(code) {
    var m = /^\s*(\d{1,2})\s*([ABab])\s*$/.exec(code || '');
    if (!m) return null;
    var n = parseInt(m[1], 10);
    if (n < 1 || n > 12) return null;
    return { num: n, letter: m[2].toUpperCase() };
  }

  function fmtKey(k) { return k.num + k.letter; }

  // Harmonic-compatible moves: same key, one hour either way, relative major/minor.
  function compatibleKeys(code) {
    var k = parseKey(code);
    if (!k) return null;
    var up = { num: k.num % 12 + 1, letter: k.letter };
    var down = { num: (k.num + 10) % 12 + 1, letter: k.letter };
    var rel = { num: k.num, letter: k.letter === 'A' ? 'B' : 'A' };
    return [
      { code: fmtKey(k), label: 'same key - always safe' },
      { code: fmtKey(up), label: '+1 hour - energy lift' },
      { code: fmtKey(down), label: '-1 hour - energy dip' },
      { code: fmtKey(rel), label: 'relative major/minor - mood flip' }
    ];
  }

  // Phrase math: house/techno phrases run in 32 beats (8 bars of 4/4).
  function beatsToBoundary(beatsElapsed, phraseBeats) {
    var p = phraseBeats || 32;
    var rem = beatsElapsed % p;
    return rem === 0 ? 0 : p - rem;
  }

  function secondsFor(beats, bpm) {
    return r1(beats * 60 / bpm);
  }

  // Transition plan: how long N bars actually take at this tempo.
  function transitionSeconds(bars, bpm) {
    return secondsFor(bars * 4, bpm);
  }

  return {
    sliderBpm: sliderBpm,
    sliderFor: sliderFor,
    bpmMatch: bpmMatch,
    parseKey: parseKey,
    compatibleKeys: compatibleKeys,
    beatsToBoundary: beatsToBoundary,
    secondsFor: secondsFor,
    transitionSeconds: transitionSeconds
  };
}));
