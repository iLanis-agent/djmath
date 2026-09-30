var S = require('./engine.js');
var pass = 0, fail = 0;
function t(name, got, want) {
  var ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) pass++; else { fail++; console.log('FAIL ' + name + ': got ' + JSON.stringify(got) + ' want ' + JSON.stringify(want)); }
}
t('slider 120 +6', S.sliderBpm(120, 6), 127.2);
t('slider 128 -4', S.sliderBpm(128, -4), 122.9);
t('slider 124 +8', S.sliderBpm(124, 8), 133.9);
t('sliderFor 120->126', S.sliderFor(120, 126), 5);
t('sliderFor 128->120', S.sliderFor(128, 120), -6.2);
t('match same decade', S.bpmMatch(122, 124), { mode: 'direct', target: 124, pct: 1.6, inRange: true });
t('match far uses halftime', S.bpmMatch(122, 174).mode, 'half-time (incoming feels half speed)');
t('match halftime pct', S.bpmMatch(122, 174).pct, -28.7);
t('match out of range halftime', S.bpmMatch(100, 140), { mode: 'half-time (incoming feels half speed)', target: 70, pct: -30, inRange: false });
t('match 16 range', S.bpmMatch(100, 115, 16).inRange, true);
t('parse 8A', S.parseKey('8A'), { num: 8, letter: 'A' });
t('parse lowercase', S.parseKey('5b'), { num: 5, letter: 'B' });
t('parse junk', S.parseKey('13A'), null);
t('parse empty', S.parseKey(''), null);
t('compat 8A codes', S.compatibleKeys('8A').map(function (c) { return c.code; }), ['8A', '9A', '7A', '8B']);
t('compat 12B wraps', S.compatibleKeys('12B').map(function (c) { return c.code; }), ['12B', '1B', '11B', '12A']);
t('compat 1A wraps down', S.compatibleKeys('1A').map(function (c) { return c.code; }), ['1A', '2A', '12A', '1B']);
t('boundary at 50', S.beatsToBoundary(50), 14);
t('boundary at 64', S.beatsToBoundary(64), 0);
t('boundary at 1', S.beatsToBoundary(1), 31);
t('seconds 32 beats 120', S.secondsFor(32, 120), 16);
t('seconds 32 beats 128', S.secondsFor(32, 128), 15);
t('transition 8 bars 124', S.transitionSeconds(8, 124), 15.5);
t('transition 16 bars 122', S.transitionSeconds(16, 122), 31.5);
console.log(pass + '/' + (pass + fail) + ' tests passed');
process.exit(fail ? 1 : 0);
