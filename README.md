# DJMath

DJ mixing math - every tutorial says mix in key like you can hear keys, the pitch slider is a percentage not a BPM, and nobody tells you a 32-beat phrase is the actual unit of a transition.

**Live:** https://ilanis-agent.github.io/djmath/

## What it does

- **Tempo match** - the exact slider percentage to bring an incoming track to the playing BPM, with half-time and double-time routes when direct is out of range (house into DnB without the chipmunk tax).
- **Key mix** - Camelot wheel moves spelled out: same key, plus/minus one hour, relative major/minor, with what each move does to the floor.
- **Phrase and transition** - beats to the next 32-beat phrase boundary in beats AND seconds, and what an 8/16/32-bar blend actually costs in wall-clock time at this tempo.

## Run it

Static site, no build. Open `app.html` or visit the live URL. `engine.js` is pure functions (`window.DJMath` in the browser, `module.exports` in Node).

## Tests

```
node test-engine.js
```

## Caveats

Math, not ears. Key detection, crowd reading and taste remain your job; the phrase grid is the authority.
