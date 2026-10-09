// Sound engine for Realms of the Ring.
// Everything is synthesized with the Web Audio API, so there are no audio files to download or license.
//
// Browsers block audio until the user interacts with the page, so the intro music starts on the
// FIRST click / tap / key press (the AudioContext cannot be started earlier by any website).
export function createSound() {
  let ctx = null, master = null, reverb = null;
  let muted = false, introActive = true, disposed = false;
  let ambient = null, bellTimer = 0;
  try { muted = localStorage.getItem('ror-muted') === '1'; } catch (e) {}

  // ---------- core ----------
  function ensure() {
    if (disposed) return null;
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.9;
      master.connect(ctx.destination);
      // simple generated reverb (decaying noise) for a "castle hall" feel
      const len = Math.floor(ctx.sampleRate * 2.6);
      const buf = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let c = 0; c < 2; c++) {
        const d = buf.getChannelData(c);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
      }
      reverb = ctx.createConvolver();
      reverb.buffer = buf;
      const rg = ctx.createGain();
      rg.gain.value = 0.5;
      reverb.connect(rg);
      rg.connect(master);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // one oscillator note with an envelope
  function tone(f, o = {}) {
    const { type = 'sine', t = 0, dur = 0.3, vol = 0.2, attack = 0.005, to = null, wet = 0.3 } = o;
    const c = ctx, t0 = c.currentTime + t;
    const osc = c.createOscillator(), g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f, t0);
    if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(master);
    if (wet) { const w = c.createGain(); w.gain.value = wet; g.connect(w); w.connect(reverb); }
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  // filtered noise burst (clicks, taps, metal "shing")
  function noise(dur, o = {}) {
    const { t = 0, vol = 0.2, type = 'bandpass', freq = 1000, q = 1, to = null } = o;
    const c = ctx, t0 = c.currentTime + t;
    const len = Math.max(1, Math.floor(c.sampleRate * dur));
    const b = c.createBuffer(1, len, c.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const s = c.createBufferSource();
    s.buffer = b;
    const f = c.createBiquadFilter();
    f.type = type;
    f.Q.value = q;
    f.frequency.setValueAtTime(freq, t0);
    if (to) f.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(t0);
  }

  // ---------- intro ambience ----------
  const BELLS = [220, 261.63, 329.63, 392, 440, 523.25, 659.25]; // A minor pentatonic

  function scheduleBell() {
    bellTimer = setTimeout(() => {
      if (!ambient || !ctx) return;
      const f = BELLS[Math.floor(Math.random() * BELLS.length)];
      tone(f, { dur: 3.4, vol: 0.05, attack: 0.02, wet: 0.9 });
      scheduleBell();
    }, 2600 + Math.random() * 3200);
  }

  function startAmbient() {
    if (ambient || !introActive || !ensure()) return;
    const c = ctx, t0 = c.currentTime;
    const bus = c.createGain();
    bus.gain.setValueAtTime(0.0001, t0);
    bus.gain.exponentialRampToValueAtTime(0.5, t0 + 4); // slow fade-in
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 520; lp.Q.value = 0.7;
    lp.connect(bus);
    bus.connect(master);
    bus.connect(reverb);
    // dark drone chord: A1, A1 (detuned), E2, A2, C3, E3
    const voices = [
      [55, 'sawtooth', 0.10], [55.4, 'sawtooth', 0.10], [82.41, 'sine', 0.18],
      [110, 'triangle', 0.12], [130.81, 'sine', 0.07], [164.81, 'sine', 0.05],
    ];
    const oscs = voices.map(([f, type, v]) => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.value = f; g.gain.value = v;
      o.connect(g); g.connect(lp); o.start(t0);
      return o;
    });
    // slow "breathing" movement in the filter
    const lfo = c.createOscillator(), lg = c.createGain();
    lfo.frequency.value = 0.08; lg.gain.value = 180;
    lfo.connect(lg); lg.connect(lp.frequency); lfo.start(t0);
    oscs.push(lfo);
    ambient = { oscs, bus };
    scheduleBell();
    disarm();
  }

  function stopAmbient(fade) {
    clearTimeout(bellTimer);
    if (!ambient || !ctx) { ambient = null; return; }
    const { oscs, bus } = ambient;
    const now = ctx.currentTime;
    bus.gain.cancelScheduledValues(now);
    bus.gain.setValueAtTime(Math.max(bus.gain.value, 0.0001), now);
    bus.gain.exponentialRampToValueAtTime(0.0001, now + fade);
    oscs.forEach((o) => { try { o.stop(now + fade + 0.1); } catch (e) {} });
    ambient = null;
  }

  // first user gesture starts the intro music (ignoring the Enter button, which has its own sound)
  function onGesture(e) {
    if (e.target && e.target.closest && e.target.closest('#startBtn')) return;
    startAmbient();
  }
  function arm() {
    window.addEventListener('pointerup', onGesture);
    window.addEventListener('keydown', onGesture);
  }
  function disarm() {
    window.removeEventListener('pointerup', onGesture);
    window.removeEventListener('keydown', onGesture);
  }

  // ---------- public sounds ----------
  return {
    armIntro: arm,

    // "Enter the Battle" button: gong + sword shing, intro music fades out
    enter() {
      introActive = false;
      disarm();
      if (!ensure()) return;
      stopAmbient(2.4);
      noise(0.45, { vol: 0.16, type: 'highpass', freq: 2500, to: 9000, q: 0.7 });          // shing
      tone(98, { dur: 2.8, vol: 0.38, to: 55, wet: 0.6 });                                 // gong body
      tone(196, { dur: 2.2, vol: 0.14, wet: 0.7 });
      [311, 466, 702, 1043].forEach((f, i) => tone(f, { t: 0.02 * i, dur: 1.9, vol: 0.05, wet: 0.85 })); // metal shimmer
    },

    // click a piece you can move
    select() {
      if (!ensure()) return;
      noise(0.05, { vol: 0.12, freq: 1800, q: 2 });
      tone(660, { type: 'triangle', dur: 0.17, vol: 0.13, to: 880, wet: 0.35 });
    },

    // click a highlighted tile to move (heavier clash if it captures)
    move(capture) {
      if (!ensure()) return;
      if (capture) {
        noise(0.28, { vol: 0.3, freq: 3200, q: 0.8, to: 1200 });
        tone(1250, { type: 'square', dur: 0.35, vol: 0.05, wet: 0.5 });
        tone(1870, { type: 'square', dur: 0.3, vol: 0.03, wet: 0.5 });
        tone(140, { dur: 0.32, vol: 0.4, to: 50, wet: 0.2 });
      } else {
        noise(0.04, { vol: 0.2, type: 'lowpass', freq: 1800 });
        tone(190, { dur: 0.14, vol: 0.35, to: 70, wet: 0.1 });
      }
    },

    // click an enemy piece / a piece that can't be used
    deny() {
      if (!ensure()) return;
      tone(140, { type: 'triangle', dur: 0.13, vol: 0.18, to: 100, wet: 0.1 });
    },

    // click an empty tile (deselect)
    tick() {
      if (!ensure()) return;
      noise(0.025, { vol: 0.08, freq: 2500, q: 1 });
    },

    // the computer's reply move: darker, heavier than the player's move
    computer(capture) {
      if (!ensure()) return;
      noise(0.12, { vol: 0.1, type: 'lowpass', freq: 600 });
      tone(95, { type: 'sawtooth', dur: 0.35, vol: 0.12, to: 60, wet: 0.4 });
      if (capture) {
        noise(0.25, { vol: 0.22, freq: 2600, q: 0.8, to: 900 });
        tone(1100, { type: 'square', dur: 0.3, vol: 0.04, wet: 0.5 });
      } else {
        tone(190, { dur: 0.16, vol: 0.28, to: 70, wet: 0.1 });
      }
    },

    // firework bang (used repeatedly on victory)
    boom() {
      if (!ensure()) return;
      noise(0.6, { vol: 0.32, type: 'lowpass', freq: 900, to: 70 });
      tone(80, { dur: 0.55, vol: 0.35, to: 35, wet: 0.3 });
      for (let i = 0; i < 6; i++) noise(0.12, { t: 0.12 + Math.random() * 0.5, vol: 0.07, type: 'highpass', freq: 4000, q: 0.7 });
    },

    // fanfare when the player wins
    victory() {
      if (!ensure()) return;
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, { type: 'triangle', t: i * 0.16, dur: 0.5, vol: 0.18, wet: 0.6 }));
      [523.25, 659.25, 783.99, 1046.5].forEach((f) => tone(f, { type: 'triangle', t: 0.7, dur: 2.0, vol: 0.12, wet: 0.8 }));
      tone(130.81, { t: 0.7, dur: 2.2, vol: 0.25, wet: 0.5 });
    },

    // slow, sad descending notes when the computer wins
    defeat() {
      if (!ensure()) return;
      [220, 196, 164.81, 110].forEach((f, i) => tone(f, { type: 'sawtooth', t: i * 0.45, dur: 0.9, vol: 0.1, wet: 0.8 }));
      tone(55, { t: 0.2, dur: 2.4, vol: 0.3, wet: 0.6 });
    },

    // two soft chimes for a draw
    draw() {
      if (!ensure()) return;
      tone(440, { type: 'triangle', dur: 1.2, vol: 0.15, wet: 0.8 });
      tone(330, { type: 'triangle', t: 0.3, dur: 1.4, vol: 0.15, wet: 0.8 });
    },

    toggleMute() {
      muted = !muted;
      try { localStorage.setItem('ror-muted', muted ? '1' : '0'); } catch (e) {}
      if (ensure() && master) master.gain.setTargetAtTime(muted ? 0 : 0.9, ctx.currentTime, 0.05);
      return muted;
    },
    isMuted: () => muted,

    dispose() {
      disposed = true;
      disarm();
      clearTimeout(bellTimer);
      if (ctx) { try { ctx.close(); } catch (e) {} }
    },
  };
}
