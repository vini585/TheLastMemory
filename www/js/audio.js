'use strict';
// Todo o som do jogo é gerado por código (WebAudio). Nenhum arquivo de áudio.
const Som = (() => {
  let ac = null, mestre = null, chuvaG = null, chuvaF = null, droneG = null;
  let ruidoBuf = null, eco = null, estG = null, estF = null, torG = null;
  let mudado = false;
  const VOL = 0.9;

  function garantir() {
    if (ac) { if (ac.state === 'suspended') ac.resume(); return true; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ac = new AC();
    mestre = ac.createGain(); mestre.gain.value = mudado ? 0 : VOL; mestre.connect(ac.destination);
    const len = ac.sampleRate * 2;
    ruidoBuf = ac.createBuffer(1, len, ac.sampleRate);
    const d = ruidoBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    // eco longo (para notas da caixa de música)
    const atraso = ac.createDelay(1.0); atraso.delayTime.value = 0.42;
    const fb = ac.createGain(); fb.gain.value = 0.38;
    const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2200;
    atraso.connect(lp); lp.connect(fb); fb.connect(atraso);
    const wet = ac.createGain(); wet.gain.value = 0.5; lp.connect(wet); wet.connect(mestre);
    eco = ac.createGain(); eco.connect(atraso);
    // chuva
    let src = ac.createBufferSource(); src.buffer = ruidoBuf; src.loop = true;
    const hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 500;
    chuvaF = ac.createBiquadFilter(); chuvaF.type = 'lowpass'; chuvaF.frequency.value = 1400;
    chuvaG = ac.createGain(); chuvaG.gain.value = 0;
    src.connect(hp); hp.connect(chuvaF); chuvaF.connect(chuvaG); chuvaG.connect(mestre); src.start();
    // drone grave
    droneG = ac.createGain(); droneG.gain.value = 0;
    [[48, 'triangle', 0.5], [48.7, 'triangle', 0.5], [72.3, 'sine', 0.3]].forEach(([f, t, v]) => {
      const o = ac.createOscillator(); o.type = t; o.frequency.value = f;
      const g = ac.createGain(); g.gain.value = v; o.connect(g); g.connect(droneG); o.start();
    });
    droneG.connect(mestre);
    // estática (TV / rádio)
    src = ac.createBufferSource(); src.buffer = ruidoBuf; src.loop = true;
    estF = ac.createBiquadFilter(); estF.type = 'bandpass'; estF.frequency.value = 2500; estF.Q.value = 0.4;
    estG = ac.createGain(); estG.gain.value = 0;
    src.connect(estF); estF.connect(estG); estG.connect(mestre); src.start();
    // torneira
    src = ac.createBufferSource(); src.buffer = ruidoBuf; src.loop = true;
    const tf = ac.createBiquadFilter(); tf.type = 'bandpass'; tf.frequency.value = 3000; tf.Q.value = 0.7;
    torG = ac.createGain(); torG.gain.value = 0;
    src.connect(tf); tf.connect(torG); torG.connect(mestre); src.start();
    return true;
  }

  const agora = () => ac.currentTime;

  function ruido(dur, o = {}) {
    if (!ac) return;
    const { freq = 1000, q = 1, tipo = 'bandpass', vol = 0.2, ataque = 0.005, fim = null, atraso = 0 } = o;
    const t = agora() + atraso;
    const src = ac.createBufferSource(); src.buffer = ruidoBuf; src.loop = true;
    const f = ac.createBiquadFilter(); f.type = tipo; f.frequency.setValueAtTime(freq, t); f.Q.value = q;
    if (fim) f.frequency.exponentialRampToValueAtTime(fim, t + dur);
    const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + ataque); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(mestre);
    src.start(t, Math.random() * 1.5); src.stop(t + dur + 0.05);
  }

  function tom(freq, dur, o = {}) {
    if (!ac) return;
    const { tipo = 'sine', vol = 0.15, ataque = 0.01, fim = null, atraso = 0, ecoOn = false } = o;
    const t = agora() + atraso;
    const osc = ac.createOscillator(); osc.type = tipo; osc.frequency.setValueAtTime(freq, t);
    if (fim) osc.frequency.exponentialRampToValueAtTime(fim, t + dur);
    const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + ataque); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(mestre); if (ecoOn) g.connect(eco);
    osc.start(t); osc.stop(t + dur + 0.05);
  }

  const api = {
    garantir,
    chuva(vol, abafado) {
      if (!ac) return;
      chuvaG.gain.setTargetAtTime(vol, agora(), 0.6);
      chuvaF.frequency.setTargetAtTime(abafado ? 650 : 1800, agora(), 0.6);
    },
    drone(v) { if (ac) droneG.gain.setTargetAtTime(v, agora(), 1.5); },
    estatica(vol, freq = 2500) {
      if (!ac) return;
      estG.gain.setTargetAtTime(vol, agora(), 0.05);
      estF.frequency.setTargetAtTime(freq, agora(), 0.05);
    },
    torneira(b) { if (ac) torG.gain.setTargetAtTime(b ? 0.07 : 0, agora(), 0.08); },
    silencio(b, tc = 0.15) {
      if (!ac) return;
      mestre.gain.setTargetAtTime(b || mudado ? 0 : VOL, agora(), tc);
    },
    mudo(b) { mudado = b; if (ac) mestre.gain.setTargetAtTime(b ? 0 : VOL, agora(), 0.05); },
    estaMudo() { return mudado; },
    passo(tipo) {
      ruido(0.07, { freq: 160 + Math.random() * 70, q: 0.7, tipo: 'lowpass', vol: 0.2 });
      tom(65 + Math.random() * 10, 0.07, { vol: 0.12 });
    },
    clique() { ruido(0.03, { freq: 2600, q: 2, vol: 0.12 }); },
    interruptor() { ruido(0.025, { freq: 3200, q: 3, vol: 0.14 }); ruido(0.05, { freq: 300, q: 1, vol: 0.12, atraso: 0.03 }); },
    tecla() { tom(740 + Math.random() * 60, 0.05, { tipo: 'square', vol: 0.04 }); },
    pagina() { ruido(0.18, { freq: 3500, q: 0.6, vol: 0.09, fim: 1500 }); },
    vibrar() { for (let i = 0; i < 3; i++) { tom(95, 0.13, { tipo: 'square', vol: 0.05, atraso: i * 0.22 }); ruido(0.13, { freq: 700, q: 2, vol: 0.06, atraso: i * 0.22 }); } },
    tic() { ruido(0.02, { freq: 3200, q: 5, vol: 0.1 }); },
    batida(n = 1) { for (let i = 0; i < n; i++) { tom(62, 0.3, { vol: 0.55, fim: 34, atraso: i * 0.45 }); ruido(0.12, { freq: 220, tipo: 'lowpass', vol: 0.3, atraso: i * 0.45 }); } },
    rangido(d = 1.5) {
      if (!ac) return;
      const t = agora();
      const o = ac.createOscillator(); o.type = 'sawtooth';
      o.frequency.setValueAtTime(150, t); o.frequency.linearRampToValueAtTime(110, t + d * 0.5); o.frequency.linearRampToValueAtTime(210, t + d);
      const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 700; f.Q.value = 6;
      const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.05, t + 0.2); g.gain.linearRampToValueAtTime(0.0001, t + d);
      o.connect(f); f.connect(g); g.connect(mestre); o.start(t); o.stop(t + d + 0.1);
    },
    coracao(n = 3) { for (let i = 0; i < n; i++) { const b = i * 0.9; tom(55, 0.18, { vol: 0.5, fim: 38, atraso: b }); tom(50, 0.2, { vol: 0.4, fim: 36, atraso: b + 0.22 }); } },
    pingo() { tom(1500, 0.09, { fim: 700, vol: 0.06, ecoOn: true }); },
    eletrico() { tom(100, 0.35, { tipo: 'sawtooth', vol: 0.035 }); ruido(0.3, { freq: 4000, q: 1, vol: 0.07 }); },
    fone() { tom(350, 1.4, { vol: 0.06 }); tom(440, 1.4, { vol: 0.06 }); },
    erro() { tom(170, 0.35, { tipo: 'square', vol: 0.07 }); },
    ok() { tom(660, 0.12, { tipo: 'triangle', vol: 0.1 }); tom(990, 0.3, { tipo: 'triangle', vol: 0.1, atraso: 0.12 }); },
    sussurro() { ruido(1.8, { freq: 1700, q: 7, fim: 900, vol: 0.07, ataque: 0.6 }); },
    estouro() { ruido(0.5, { freq: 300, q: 0.5, tipo: 'lowpass', vol: 0.5 }); tom(45, 0.7, { vol: 0.5, fim: 30 }); },
    // pequena melodia de caixa de música (desacelerando)
    caixaMusica() {
      if (!ac) return;
      const notas = [523.25, 622.25, 783.99, 698.46, 622.25, 523.25, 587.33, 466.16];
      let t = 0;
      notas.forEach((f, i) => {
        tom(f, 1.8, { vol: 0.07, atraso: t, ecoOn: true });
        tom(f * 2, 0.9, { vol: 0.025, atraso: t, ecoOn: true });
        t += 0.42 + i * 0.05;
      });
    },
    memoria() { // som discreto ao achar uma memória
      tom(392, 2.2, { vol: 0.06, ecoOn: true }); tom(587.33, 2.6, { vol: 0.05, atraso: 0.3, ecoOn: true });
    },
  };
  return api;
})();
