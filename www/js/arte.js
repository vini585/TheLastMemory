'use strict';
// Toda a arte é desenhada por código, pixel a pixel, num buffer de 480x270.
const L = 480, A = 270, WB = 168; // largura, altura, linha onde a parede encontra o chão

const Arte = (() => {
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  function rng(seed) { let s = seed >>> 0; return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296); }
  function criar(w, h) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'); g.imageSmoothingEnabled = false; return c;
  }
  function elipse(g, cx, cy, rx, ry, c) {
    g.fillStyle = c;
    for (let y = -ry; y <= ry; y++) {
      const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry))));
      g.fillRect(Math.round(cx - w), Math.round(cy + y), w * 2, 1);
    }
  }
  function dither(g, x, y, w, h, c, fase = 0) {
    g.fillStyle = c;
    for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) if (((xx + yy + fase) & 1) === 0) g.fillRect(x + xx, y + yy, 1, 1);
  }
  function linha(g, x0, y0, x1, y1, c) {
    g.fillStyle = c; x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let e = dx + dy;
    for (let i = 0; i < 400; i++) {
      g.fillRect(x0, y0, 1, 1);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * e;
      if (e2 >= dy) { e += dy; x0 += sx; }
      if (e2 <= dx) { e += dx; y0 += sy; }
    }
  }
  // bloco com contorno, luz no topo/esquerda e sombra embaixo/direita
  function caixa(g, x, y, w, h, c, o = {}) {
    const { luz, sombra, borda = '#080a10' } = o;
    R(g, x, y, w, h, borda); R(g, x + 1, y + 1, w - 2, h - 2, c);
    if (luz) { R(g, x + 1, y + 1, w - 2, 1, luz); R(g, x + 1, y + 1, 1, h - 2, luz); }
    if (sombra) { R(g, x + 1, y + h - 2, w - 2, 1, sombra); R(g, x + w - 2, y + 1, 1, h - 2, sombra); }
  }

  // ------------------------------------------------------------ cenário base
  function parede(g, W, o = {}) {
    const { cor = '#212a3a', cor2 = '#1b2332', chao = '#151922', chao2 = '#10131a', rodape = '#2a3242', seed = 1, azulejo = false } = o;
    const r = rng(seed);
    R(g, 0, 0, W, WB, cor);
    for (let x = 0; x < W; x += 12) R(g, x, 0, 1, WB, cor2);
    for (let i = 0; i < W * WB / 50; i++) R(g, (r() * W) | 0, (r() * WB) | 0, 1 + ((r() * 2) | 0), 1, cor2);
    if (azulejo) {
      const t0 = 86;
      R(g, 0, t0, W, WB - t0, '#2a3a46');
      for (let x = 0; x < W; x += 14) R(g, x, t0, 1, WB - t0, '#1a2630');
      for (let y = t0; y < WB; y += 14) R(g, 0, y, W, 1, '#1a2630');
      for (let i = 0; i < 160; i++) R(g, (r() * W) | 0, t0 + ((r() * (WB - t0)) | 0), 1, 1, '#36495a');
      R(g, 0, t0 - 2, W, 2, '#4a5e6e'); R(g, 0, t0 - 3, W, 1, '#0c1218');
    }
    R(g, 0, 0, W, 6, '#0e121a'); R(g, 0, 6, W, 2, '#151a25');
    R(g, 0, WB - 6, W, 6, rodape); R(g, 0, WB - 7, W, 1, '#3d4760'); R(g, 0, WB - 1, W, 1, '#0a0c12');
    R(g, 0, WB, W, A - WB, chao);
    const ys = [WB, WB + 12, WB + 28, WB + 48, WB + 74];
    ys.forEach((y, i) => {
      R(g, 0, y, W, 1, chao2);
      const h = (i < ys.length - 1 ? ys[i + 1] : A) - y, step = 40 + i * 14;
      for (let x = ((i * 23) % step); x < W; x += step) R(g, x, y, 1, h, chao2);
    });
    for (let i = 0; i < W * 4; i++) R(g, (r() * W) | 0, WB + ((r() * (A - WB)) | 0), 1, 1, '#1d222e');
    dither(g, 0, WB, W, 6, '#0a0c12'); dither(g, 0, WB + 6, W, 3, '#0a0c12', 1);
  }

  function janela(g, x, y, w, h, o = {}) {
    const { cena = 'rua', cortina = false } = o;
    R(g, x - 3, y - 3, w + 6, h + 6, '#080a10'); R(g, x - 2, y - 2, w + 4, h + 4, '#3a4256'); R(g, x - 1, y - 1, w + 2, h + 2, '#242b3a');
    for (let i = 0; i < h; i += 4) R(g, x, y + i, w, 4, i < h * 0.45 ? '#0d1522' : i < h * 0.75 ? '#121c2d' : '#1a283b');
    const r = rng(x * 7 + 3);
    if (cena === 'rua') {
      for (let bx = 0; bx < w; bx += 13) {
        const bh = 10 + ((r() * 26) | 0); R(g, x + bx, y + h - bh, 12, bh, '#090e18');
        for (let k = 0; k < 3; k++) if (r() < 0.3) R(g, x + bx + 2 + ((r() * 7) | 0), y + h - bh + 3 + ((r() * Math.max(1, bh - 6)) | 0), 2, 2, '#b49a58');
      }
      R(g, x + w - 14, y + h - 34, 2, 34, '#04060a'); R(g, x + w - 18, y + h - 36, 8, 2, '#04060a'); R(g, x + w - 17, y + h - 35, 5, 2, '#dcc98e');
    } else if (cena === 'predio') {
      R(g, x, y + 12, w, h - 12, '#070b13');
      for (let wy = y + 18; wy < y + h - 6; wy += 16) for (let wx = x + 6; wx < x + w - 8; wx += 18) R(g, wx, wy, 8, 9, r() < 0.12 ? '#8e7a46' : '#0b111c');
    }
    R(g, x + ((w / 2) | 0) - 1, y, 2, h, '#242b3a'); R(g, x, y + ((h / 2) | 0) - 1, w, 2, '#242b3a');
    R(g, x - 6, y + h + 3, w + 12, 4, '#3a4256'); R(g, x - 6, y + h + 3, w + 12, 1, '#586279'); R(g, x - 6, y + h + 7, w + 12, 1, '#0a0c12');
    if (cortina) {
      for (let i = 0; i < 14; i++) { R(g, x - 8 + i, y - 6, 1, h + 14, i % 3 === 0 ? '#2a2638' : '#34304a'); R(g, x + w - 6 + i, y - 6, 1, h + 14, i % 3 === 0 ? '#2a2638' : '#34304a'); }
      R(g, x - 10, y - 8, w + 20, 3, '#1c1a28');
    }
  }
  function chuvaJanela(g, x, y, w, h, t, seed = 1) {
    const r = rng(seed);
    for (let i = 0; i < Math.floor(w / 3); i++) {
      const px = x + 1 + ((r() * (w - 2)) | 0), v = 70 + r() * 80, off = r() * 300;
      const py = y + ((t * v + off) % (h + 8)) - 4;
      if (py < y || py > y + h - 3) continue;
      R(g, px, py, 1, 3, 'rgba(150,180,220,0.55)');
    }
    for (let i = 0; i < 5; i++) { // gotas lentas escorrendo
      const px = x + 4 + ((r() * (w - 8)) | 0), v = 9 + r() * 8, off = r() * 200;
      const py = y + ((t * v + off) % (h + 20)) - 10;
      if (py < y + 2 || py > y + h - 4) continue;
      R(g, px, py, 1, 2, 'rgba(210,225,245,0.75)'); R(g, px, py - 4, 1, 4, 'rgba(180,205,235,0.18)');
    }
  }
  function porta(g, x, y, w, h, o = {}) {
    const { cor = '#3a3040', luz = '#4d4258', maca = '#d0c090', sombra = '#241d2a', trinca = false } = o;
    R(g, x - 3, y - 3, w + 6, h + 3, '#080a10'); R(g, x - 2, y - 2, w + 4, h + 2, '#2d2a38');
    R(g, x, y, w, h, cor); R(g, x, y, 2, h, luz); R(g, x + w - 2, y, 2, h, sombra);
    const pw = ((w - 12) / 2) | 0;
    [y + 8, y + ((h / 2) | 0) + 4].forEach((py, i) => {
      const ph = i === 0 ? ((h / 2) | 0) - 14 : ((h / 2) | 0) - 14;
      [x + 4, x + 8 + pw].forEach(px => { R(g, px, py, pw, ph, sombra); R(g, px + 1, py + 1, pw - 2, ph - 2, cor); R(g, px + 1, py + 1, pw - 2, 1, luz); });
    });
    R(g, x + w - 8, y + ((h / 2) | 0), 4, 4, maca); R(g, x + w - 8, y + ((h / 2) | 0), 4, 1, '#fff2c0');
    if (trinca) { const r = rng(9); for (let i = 0; i < 26; i++) { const sx = x + 6 + ((r() * (w - 14)) | 0), sy = y + 10 + ((r() * (h - 30)) | 0); linha(g, sx, sy, sx + 2 + ((r() * 4) | 0), sy + 4 + ((r() * 9) | 0), '#18141c'); } }
  }
  function relogio(g, cx, cy, r, o = {}) {
    elipse(g, cx, cy, r + 2, r + 2, '#08090e'); elipse(g, cx, cy, r + 1, r + 1, '#34343c'); elipse(g, cx, cy, r, r, o.face || '#bdb8a8');
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; R(g, cx + Math.sin(a) * (r - 2), cy - Math.cos(a) * (r - 2), 1, 1, '#1b1b20'); }
    R(g, cx - 1, cy - r + 1, 2, 2, '#1b1b20');
  }
  function ponteiros(g, cx, cy, r, h, m, s) {
    const ah = (h % 12 + m / 60) / 12 * Math.PI * 2, am = m / 60 * Math.PI * 2;
    linha(g, cx, cy, cx + Math.sin(ah) * (r * 0.5), cy - Math.cos(ah) * (r * 0.5), '#16161c');
    linha(g, cx, cy, cx + Math.sin(am) * (r * 0.8), cy - Math.cos(am) * (r * 0.8), '#16161c');
    if (s !== null && s !== undefined) { const as = s / 60 * Math.PI * 2; linha(g, cx, cy, cx + Math.sin(as) * (r * 0.85), cy - Math.cos(as) * (r * 0.85), '#8a2a2a'); }
    R(g, cx, cy, 1, 1, '#8a2a2a');
  }
  function moldura(g, x, y, w, h, cor = '#3a2a22') {
    R(g, x, y, w, h, '#06070b'); R(g, x + 1, y + 1, w - 2, h - 2, cor); R(g, x + 1, y + 1, w - 2, 1, '#5a4538');
    R(g, x + 3, y + 3, w - 6, h - 6, '#0a0c12'); R(g, x + 4, y + 4, w - 8, h - 8, '#bcb39c');
  }
  // conteúdo de foto: v = 0 duas pessoas (rosto da segunda borrado), 1 só uma, 2 vazio com marca
  function fotoPessoas(g, x, y, w, h, v) {
    R(g, x, y, w, h, '#a9a08a'); dither(g, x, y, w, h, '#98907c');
    const base = y + h;
    const busto = (cx, c, rosto) => {
      elipse(g, cx, base - 7, 8, 7, c); R(g, cx - 8, base - 6, 16, 6, c);
      elipse(g, cx, base - 17, 5, 6, rosto ? '#9a6a50' : '#7a6a62');
      if (rosto) { R(g, cx - 3, base - 18, 1, 1, '#1a1214'); R(g, cx + 2, base - 18, 1, 1, '#1a1214'); }
      elipse(g, cx, base - 21, 6, 4, '#17141a'); R(g, cx - 6, base - 22, 12, 2, '#17141a');
    };
    if (v === 0) { busto(x + ((w * 0.32) | 0), '#3a4a66', true); busto(x + ((w * 0.68) | 0), '#7a5a4a', false); R(g, x + ((w * 0.68) | 0) - 5, base - 23, 10, 10, '#7a6a62'); dither(g, x + ((w * 0.68) | 0) - 5, base - 23, 10, 10, '#a9a08a'); }
    else if (v === 1) { busto(x + ((w * 0.32) | 0), '#3a4a66', true); dither(g, x + ((w * 0.52) | 0), y + 4, ((w * 0.45) | 0), h - 5, '#b5ab94'); }
    else { R(g, x + ((w * 0.5) | 0) - 7, base - 28, 14, 24, '#b5ab94'); dither(g, x + 2, y + 2, w - 4, h - 4, '#b1a790'); }
  }
  function quadroPaisagem(g, x, y, w, h, tipo) {
    moldura(g, x, y, w, h);
    const ix = x + 4, iy = y + 4, iw = w - 8, ih = h - 8;
    if (tipo === 'praia') {
      R(g, ix, iy, iw, ih * 0.5, '#8a9ab0'); R(g, ix, iy + ih * 0.5, iw, ih * 0.25, '#5a7488'); R(g, ix, iy + ih * 0.75, iw, ih * 0.25, '#b8a47e');
      R(g, ix + 3, iy + ih * 0.5 - 2, iw - 6, 1, '#d8dde8');
    } else if (tipo === 'grupo') {
      R(g, ix, iy, iw, ih, '#9a907a');
      for (let i = 0; i < 4; i++) { const cx = ix + 4 + i * ((iw - 6) / 4 | 0); elipse(g, cx + 2, iy + ih - 6, 4, 5, ['#3a4a66', '#6a4a4a', '#4a5a4a', '#5a4a66'][i]); elipse(g, cx + 2, iy + ih - 13, 3, 3, '#7a6a62'); if (i % 2) dither(g, cx - 1, iy + ih - 17, 6, 6, '#9a907a'); }
    } else { R(g, ix, iy, iw, ih, '#a8a08c'); dither(g, ix + 1, iy + 1, iw - 2, ih - 2, '#b4ac98'); R(g, ix + 3, iy + 3, iw - 6, 1, '#8e8672'); }
  }

  // ------------------------------------------------------------ sprites
  const SP = { skin: '#a8714f', skinS: '#8a5a40', hair: '#14131c', cap: '#3c4a63', capS: '#2b364b', capL: '#566684', calca: '#2a2d3a', calcaS: '#1e2029', sapato: '#14141a', sola: '#3a3a44', olho: '#0a0a0e' };
  function desenharJogador(g, f) {
    const swing = [0, 2, 0, -2][f] || 0, bob = (f === 1 || f === 3) ? 1 : 0;
    const by = bob ? 1 : 0;
    // perna de trás
    R(g, 9 - swing, 31, 4, 13 - 0, SP.calcaS); R(g, 9 - swing, 44, 6, 3, SP.sapato); R(g, 9 - swing, 46, 6, 1, SP.sola);
    // braço de trás
    R(g, 8 + swing, 16 + by, 3, 13, SP.capS); R(g, 8 + swing, 29 + by, 3, 3, SP.skinS);
    // tronco
    R(g, 6, 14 + by, 12, 17, SP.cap); R(g, 6, 14 + by, 2, 17, SP.capL); R(g, 16, 14 + by, 2, 17, SP.capS);
    R(g, 8, 25 + by, 8, 1, SP.capS); R(g, 6, 30 + by, 12, 1, SP.capS);
    // perna da frente
    R(g, 12 + swing, 31, 4, 13, SP.calca); R(g, 12 + swing, 44, 6, 3, SP.sapato); R(g, 12 + swing, 46, 6, 1, SP.sola);
    // braço da frente
    R(g, 11 - swing, 16 + by, 4, 13, SP.cap); R(g, 11 - swing, 16 + by, 1, 13, SP.capL); R(g, 11 - swing, 29 + by, 4, 3, SP.skin);
    // pescoço e cabeça
    R(g, 10, 12 + by, 4, 3, SP.skinS);
    R(g, 8, 3 + by, 9, 10, SP.skin); R(g, 8, 3 + by, 1, 10, SP.skinS);
    R(g, 7, 1 + by, 11, 5, SP.hair); R(g, 6, 3 + by, 3, 8, SP.hair); R(g, 9, 6 + by, 8, 1, SP.hair); R(g, 16, 5 + by, 2, 2, SP.hair);
    R(g, 14, 8 + by, 1, 2, SP.olho); R(g, 17, 10 + by, 1, 1, SP.skinS);
    R(g, 13, 12 + by, 4, 1, SP.skinS);
  }
  function desenharGarota(g, sombra) {
    const c = sombra ? { pele: '#07080c', cab: '#05060a', blusa: '#08090d', saia: '#06070a', perna: '#07080c', sap: '#04050a', luz: '#1c2230' } :
      { pele: '#cdb9a8', cab: '#15111a', blusa: '#a06c4c', saia: '#2e2634', perna: '#b8a090', sap: '#17141c', luz: '#c88a60' };
    // cabelo comprido atrás
    R(g, 5, 2, 13, 24, c.cab);
    // pernas / saia
    R(g, 9, 34, 3, 10, c.perna); R(g, 13, 34, 3, 10, c.perna); R(g, 8, 43, 5, 3, c.sap); R(g, 13, 43, 5, 3, c.sap);
    R(g, 6, 27, 13, 9, c.saia); R(g, 5, 33, 15, 3, c.saia);
    // blusa
    R(g, 7, 14, 11, 14, c.blusa); R(g, 7, 14, 2, 14, c.luz); R(g, 4, 16, 3, 12, c.blusa); R(g, 18, 16, 3, 12, c.blusa);
    R(g, 4, 28, 3, 3, c.pele); R(g, 18, 28, 3, 3, c.pele);
    // pescoço e cabeça SEM ROSTO
    R(g, 10, 12, 5, 3, c.pele);
    R(g, 8, 3, 9, 10, c.pele);
    R(g, 7, 1, 11, 4, c.cab); R(g, 6, 3, 3, 10, c.cab); R(g, 16, 3, 3, 11, c.cab);
    if (!sombra) { dither(g, 9, 6, 7, 6, '#bfa998'); }
  }
  const sprites = { jog: [], gar: null, garS: null };
  function criarSprites() {
    for (let f = 0; f < 4; f++) { const c = criar(24, 48); desenharJogador(c.getContext('2d'), f); sprites.jog.push(c); }
    sprites.jog.unshift((() => { const c = criar(24, 48); desenharJogador(c.getContext('2d'), 0); return c; })());
    // sprites.jog: [idle, w0, w1, w2, w3]
    sprites.gar = criar(24, 48); desenharGarota(sprites.gar.getContext('2d'), false);
    sprites.garS = criar(24, 48); desenharGarota(sprites.garS.getContext('2d'), true);
  }
  function jogador(g, x, y, dir, quadro) {
    const s = sprites.jog[quadro] || sprites.jog[0];
    g.save(); g.translate(Math.round(x), Math.round(y)); g.scale(dir < 0 ? -1 : 1, 1); g.drawImage(s, -12, -47); g.restore();
  }
  function garota(g, x, y, sombra, dir = 1) {
    const s = sombra ? sprites.garS : sprites.gar;
    g.save(); g.translate(Math.round(x), Math.round(y)); g.scale(dir < 0 ? -1 : 1, 1); g.drawImage(s, -12, -47); g.restore();
  }
  function sombraChao(g, x, y, w = 16) { elipse(g, x, y, w / 2, 2, 'rgba(0,0,0,0.45)'); }

  // ------------------------------------------------------------ luz (sprites com bandas, estilo retrô)
  const cacheLuz = {};
  function spriteLuz(r, achat, cor) {
    const k = r + '|' + achat + '|' + cor;
    if (cacheLuz[k]) return cacheLuz[k];
    const ry = Math.max(2, Math.round(r * achat));
    const c = criar(r * 2 + 2, ry * 2 + 2), g = c.getContext('2d');
    const passos = 6;
    for (let i = 0; i < passos; i++) {
      const f = 1 - i / passos;
      g.globalAlpha = 0.34;
      elipse(g, r + 1, ry + 1, Math.round(r * f), Math.max(1, Math.round(ry * f)), cor);
    }
    return (cacheLuz[k] = c);
  }

  // ------------------------------------------------------------ rosto (close-up)
  const PAL = {
    frio: { fundo: '#10121c', pele: '#7a4f40', pele2: '#9d684c', luz: '#d48a4c', sombra: '#3d3560', sombra2: '#272346', olheira: '#4b407a', branco: '#cfc8dc', iris: '#2a1a1c', cabelo: '#0b0b13', labio: '#5b3838', roupa: '#1d1f3c', mao: '#a35f3c' },
    quente: { fundo: '#090203', pele: '#7a281b', pele2: '#a83f1e', luz: '#e46f28', sombra: '#2b0b18', sombra2: '#1a0610', olheira: '#3a0f30', branco: '#dcd4ea', iris: '#3a0d14', cabelo: '#0e0407', labio: '#541818', roupa: '#1a0f2c', mao: '#b24a22' },
  };
  const cacheRosto = {};
  function rostoSprite(tipo) {
    if (cacheRosto[tipo]) return cacheRosto[tipo];
    const cv = criar(96, 112), g = cv.getContext('2d');
    const P = (tipo === 'medo' || tipo === 'dor') ? PAL.quente : PAL.frio;
    const r = rng(tipo.length * 977 + 13);
    R(g, 0, 0, 96, 112, P.fundo);
    // ombros
    elipse(g, 48, 118, 46, 28, P.roupa); R(g, 0, 96, 96, 16, P.roupa);
    dither(g, 0, 98, 96, 14, P.sombra2);
    // pescoço
    R(g, 34, 78, 28, 22, P.pele); dither(g, 34, 78, 28, 22, P.sombra);
    // cabeça
    elipse(g, 48, 50, 28, 36, P.pele);
    elipse(g, 44, 46, 22, 30, P.pele2);
    // pontos de pele
    for (let i = 0; i < 90; i++) { const x = 24 + ((r() * 48) | 0), y = 22 + ((r() * 60) | 0); R(g, x, y, 1 + ((r() * 2) | 0), 1, r() < 0.5 ? P.pele : P.luz); }
    // sombras laterais com dither
    for (let y = 20; y < 86; y++) {
      const w = Math.round(28 * Math.sqrt(Math.max(0, 1 - ((y - 50) * (y - 50)) / (36 * 36))));
      const dir = Math.min(w, 6 + ((r() * 3) | 0));
      R(g, 48 + w - dir, y, dir, 1, P.sombra);
      if (y & 1) R(g, 48 + w - dir - 3, y, 3, 1, P.sombra2);
      R(g, 48 - w, y, 3, 1, P.sombra2);
    }
    // luz no nariz/testa
    R(g, 47, 24, 3, 18, P.pele2); R(g, 46, 42, 4, 20, P.luz); R(g, 44, 58, 8, 3, P.luz);
    R(g, 40, 60, 4, 3, P.sombra); R(g, 52, 60, 4, 3, P.sombra); R(g, 43, 63, 10, 2, P.sombra2);
    // maçãs do rosto
    R(g, 28, 62, 6, 4, P.luz); R(g, 62, 62, 6, 4, P.luz);
    // cabelo (espetado)
    elipse(g, 48, 22, 30, 14, P.cabelo); R(g, 18, 22, 60, 6, P.cabelo);
    for (let i = 0; i < 26; i++) {
      const bx = 20 + ((i * 56 / 26) | 0) + ((r() * 3) | 0), h = 8 + ((r() * 14) | 0), dx = ((r() * 9) | 0) - 4;
      linha(g, bx, 22, bx + dx, 22 - h, P.cabelo); linha(g, bx + 1, 22, bx + dx + 1, 22 - h, P.cabelo);
    }
    for (let i = 0; i < 6; i++) { const x = 19 + ((r() * 8) | 0); R(g, x, 24 + ((r() * 20) | 0), 2, 4, P.cabelo); const x2 = 69 + ((r() * 8) | 0); R(g, x2, 24 + ((r() * 20) | 0), 2, 4, P.cabelo); }
    // sobrancelhas
    const sob = (x, inv) => {
      const ys = tipo === 'cansado' ? [3, 2, 2, 1, 1, 0, 0] : tipo === 'medo' ? [0, 0, 1, 1, 2, 2, 3] : [2, 1, 1, 0, 0, 1, 2];
      const alto = tipo === 'medo' ? -6 : 0;
      for (let i = 0; i < 7; i++) { const yy = 37 + alto + ys[inv ? 6 - i : i]; R(g, x + i * 2, yy, 2, 3, P.cabelo); }
    };
    // olhos
    const olho = (cx, cy, lado) => {
      if (tipo === 'cansado') {
        elipse(g, cx, cy, 9, 6, P.sombra); elipse(g, cx, cy, 8, 5, P.branco);
        elipse(g, cx + lado, cy + 2, 3, 3, P.iris); R(g, cx + lado, cy + 2, 1, 1, '#c9a0a0');
        R(g, cx - 9, cy - 6, 19, 4, P.pele); R(g, cx - 9, cy - 3, 19, 2, P.cabelo); // pálpebra caída
        R(g, cx - 9, cy + 6, 19, 3, P.olheira); dither(g, cx - 9, cy + 9, 19, 3, P.olheira); R(g, cx - 8, cy + 5, 17, 1, P.sombra2);
      } else if (tipo === 'medo') {
        elipse(g, cx, cy, 11, 9, P.sombra2); elipse(g, cx, cy, 10, 8, P.branco); elipse(g, cx, cy, 3, 3, P.iris); R(g, cx - 1, cy - 1, 2, 2, '#e02020');
        R(g, cx - 11, cy - 9, 23, 2, P.cabelo);
        R(g, cx - 10, cy + 9, 21, 3, P.olheira);
      } else { // dor: olho espremido
        R(g, cx - 8, cy - 1, 17, 3, P.cabelo); R(g, cx - 6, cy + 2, 13, 1, P.branco); R(g, cx - 9, cy + 4, 19, 3, P.olheira);
        R(g, cx - 7, cy - 4, 15, 2, P.sombra2);
      }
    };
    olho(34, 47, -1); olho(62, 47, 1);
    sob(24, false); sob(58, true);
    // boca
    if (tipo === 'cansado') { R(g, 39, 76, 18, 2, P.labio); R(g, 37, 77, 3, 1, P.labio); R(g, 57, 77, 3, 1, P.labio); R(g, 41, 79, 14, 2, P.sombra); R(g, 40, 74, 16, 1, P.sombra2); }
    else if (tipo === 'medo') { elipse(g, 48, 78, 7, 5, '#12040a'); R(g, 43, 74, 10, 2, P.branco); R(g, 44, 82, 8, 1, P.labio); }
    else { elipse(g, 48, 77, 9, 5, '#12040a'); R(g, 41, 73, 14, 3, P.branco); R(g, 42, 80, 12, 1, P.branco); R(g, 38, 71, 20, 2, P.labio); }
    // barba por fazer
    for (let i = 0; i < 70; i++) R(g, 30 + ((r() * 36) | 0), 70 + ((r() * 18) | 0), 1, 1, P.sombra2);
    // mãos / objetos
    const mao = (x, esq) => {
      R(g, x, 38, 18, 24, P.mao); dither(g, x, 38, 18, 24, P.sombra);
      for (let i = 0; i < 4; i++) { const fx = x + i * 5 - (esq ? 0 : 0); R(g, fx, 18 + (i === 1 || i === 2 ? -4 : 0) + (esq ? i : 3 - i), 4, 22, P.mao); R(g, fx, 18 + (i === 1 || i === 2 ? -4 : 0) + (esq ? i : 3 - i), 1, 22, P.luz); R(g, fx + 3, 22, 1, 18, P.sombra); }
    };
    if (tipo === 'dor') { mao(2, true); mao(76, false); }
    if (tipo === 'escova') { /* tratado abaixo */ }
    cacheRosto[tipo] = cv;
    return cv;
  }
  // variante do rosto escovando os dentes (referência da imagem 2)
  function rostoEscova() {
    if (cacheRosto.escova) return cacheRosto.escova;
    const base = rostoSprite('cansado'), cv = criar(96, 112), g = cv.getContext('2d');
    g.drawImage(base, 0, 0);
    const P = PAL.frio;
    // mãos na pia
    R(g, 0, 92, 22, 20, P.mao); dither(g, 0, 92, 22, 20, P.sombra); R(g, 74, 98, 22, 14, P.mao); dither(g, 74, 98, 22, 14, P.sombra);
    for (let i = 0; i < 4; i++) { R(g, 2 + i * 5, 86 - (i % 2) * 2, 4, 10, P.mao); R(g, 2 + i * 5, 86 - (i % 2) * 2, 1, 10, P.luz); }
    // escova + pasta
    R(g, 20, 98, 26, 4, '#8f96a8'); R(g, 20, 98, 26, 1, '#c8ccd8');
    R(g, 44, 95, 26, 9, '#e8ecf4'); R(g, 44, 95, 26, 2, '#ffffff');
    for (let i = 0; i < 8; i++) R(g, 46 + i * 3, 104, 2, 4, '#c8cedd');
    elipse(g, 56, 93, 9, 4, '#3d7fe0'); R(g, 48, 92, 14, 1, '#7fb4ff');
    cacheRosto.escova = cv; return cv;
  }

  // ------------------------------------------------------------ canais de TV (160x96)
  const tvC = criar(160, 96), tvG = tvC.getContext('2d');
  let ruidoImg = null;
  function canalTV(canal, t, fotoImg) {
    const g = tvG, r = rng((t * 7 | 0) + canal * 31);
    if (canal === 0) { // rua molhada
      R(g, 0, 0, 160, 96, '#07141a'); for (let i = 0; i < 96; i += 4) R(g, 0, i, 160, 4, i < 60 ? '#0a1a22' : '#102830');
      R(g, 0, 70, 160, 26, '#0b1c24'); for (let i = 0; i < 30; i++) R(g, 8 + ((r() * 40) | 0), 72 + ((r() * 20) | 0), 1 + ((r() * 4) | 0), 1, '#e7d9a0');
      R(g, 39, 22, 3, 60, '#030609'); R(g, 33, 20, 12, 3, '#030609'); elipse(g, 39, 25, 14, 10, 'rgba(230,215,150,0.18)'); elipse(g, 39, 25, 8, 6, 'rgba(240,225,170,0.4)'); R(g, 36, 24, 6, 2, '#fff4cf');
      R(g, 96, 64, 46, 3, '#05090c'); R(g, 98, 67, 2, 10, '#05090c'); R(g, 138, 67, 2, 10, '#05090c'); R(g, 96, 52, 46, 2, '#05090c'); R(g, 98, 54, 2, 10, '#05090c'); R(g, 138, 54, 2, 10, '#05090c');
    } else if (canal === 1) { // parque à noite
      R(g, 0, 0, 160, 96, '#090d1b'); for (let i = 0; i < 60; i += 4) R(g, 0, i, 160, 4, i < 30 ? '#0a1022' : '#0e1730');
      elipse(g, 118, 22, 9, 9, '#d8dceb'); elipse(g, 115, 20, 3, 3, '#b8bfd4');
      R(g, 0, 70, 160, 26, '#05070c');
      R(g, 36, 28, 3, 44, '#020306'); R(g, 98, 28, 3, 44, '#020306'); R(g, 34, 26, 68, 3, '#020306');
      const sw = Math.sin(t * 1.4) * 7;
      [52, 80].forEach((cx, i) => { const s = i ? -sw * 0.8 : sw; linha(g, cx, 29, cx + s, 62, '#030408'); linha(g, cx + 8, 29, cx + 8 + s, 62, '#030408'); R(g, cx + s - 1, 62, 11, 3, '#030408'); });
    } else if (canal === 2) { // quarto de criança vazio
      R(g, 0, 0, 160, 96, '#2a2236'); for (let i = 0; i < 96; i += 8) R(g, 0, i, 160, 1, '#241d2e');
      R(g, 0, 70, 160, 26, '#1a1520');
      R(g, 96, 18, 36, 34, '#0c1226'); R(g, 94, 16, 40, 38, '#4a4258'); R(g, 98, 20, 32, 30, '#0c1226'); R(g, 112, 20, 2, 30, '#4a4258'); R(g, 98, 34, 32, 2, '#4a4258'); elipse(g, 104, 28, 3, 3, '#cfd2e0');
      R(g, 14, 52, 62, 20, '#4a3a58'); R(g, 14, 48, 8, 24, '#3a2c46'); R(g, 22, 50, 54, 8, '#6a5a78'); elipse(g, 60, 49, 8, 4, '#d9d2e6');
      elipse(g, 112, 70, 14, 4, 'rgba(255,200,120,0.16)'); R(g, 108, 58, 8, 12, '#e6c88a'); R(g, 110, 70, 4, 3, '#2a2030');
      elipse(g, 30, 80, 7, 6, '#7a4f3a'); elipse(g, 30, 72, 5, 5, '#7a4f3a'); R(g, 26, 68, 2, 2, '#7a4f3a'); R(g, 33, 68, 2, 2, '#7a4f3a');
    } else if (canal === 3) { // a casa (foto real, se existir)
      if (fotoImg && fotoImg.complete && fotoImg.naturalWidth) {
        g.imageSmoothingEnabled = true; g.drawImage(fotoImg, 0, fotoImg.naturalHeight * 0.30, fotoImg.naturalWidth, fotoImg.naturalWidth * 0.6, 0, 0, 160, 96); g.imageSmoothingEnabled = false;
        R(g, 0, 0, 160, 96, 'rgba(10,40,30,0.25)');
      } else { R(g, 0, 0, 160, 96, '#06070b'); R(g, 70, 40, 70, 34, '#c7c08a'); R(g, 66, 34, 78, 8, '#8a8460'); elipse(g, 22, 40, 12, 12, 'rgba(255,230,150,0.45)'); R(g, 0, 76, 160, 20, '#040508'); }
    } else { // chuvisco
      if (!ruidoImg) ruidoImg = g.createImageData(160, 96);
      const d = ruidoImg.data;
      for (let i = 0; i < d.length; i += 4) { const v = (Math.random() * 255) | 0; d[i] = v; d[i + 1] = v; d[i + 2] = Math.min(255, v + 12); d[i + 3] = 255; }
      g.putImageData(ruidoImg, 0, 0);
    }
    if (canal !== 4) {
      for (let y = 0; y < 96; y += 2) R(g, 0, y, 160, 1, 'rgba(0,0,0,0.22)');
      const by = (t * 36) % 120 - 12; R(g, 0, by, 160, 8, 'rgba(255,255,255,0.05)');
      if (r() < 0.06) { const gy = (r() * 90) | 0; const im = g.getImageData(0, gy, 160, 5); g.putImageData(im, ((r() * 14) | 0) - 7, gy); }
    }
    return tvC;
  }

  function icones(c, tipo, x, y, s, cor) { // ícones desenhados em espaço de UI
    c.fillStyle = cor;
    if (tipo === 'celular') { c.fillRect(x + s * 0.25, y, s * 0.5, s); c.clearRect(x + s * 0.32, y + s * 0.1, s * 0.36, s * 0.72); c.fillRect(x + s * 0.44, y + s * 0.88, s * 0.12, s * 0.05); }
    else if (tipo === 'diario') { c.fillRect(x + s * 0.12, y + s * 0.08, s * 0.76, s * 0.84); c.clearRect(x + s * 0.2, y + s * 0.16, s * 0.6, s * 0.68); c.fillRect(x + s * 0.28, y + s * 0.3, s * 0.44, s * 0.06); c.fillRect(x + s * 0.28, y + s * 0.46, s * 0.44, s * 0.06); c.fillRect(x + s * 0.28, y + s * 0.62, s * 0.3, s * 0.06); }
    else if (tipo === 'menu') { c.fillRect(x + s * 0.15, y + s * 0.22, s * 0.7, s * 0.1); c.fillRect(x + s * 0.15, y + s * 0.46, s * 0.7, s * 0.1); c.fillRect(x + s * 0.15, y + s * 0.7, s * 0.7, s * 0.1); }
  }

  return { R, rng, criar, elipse, dither, linha, caixa, parede, janela, chuvaJanela, porta, relogio, ponteiros, moldura, fotoPessoas, quadroPaisagem,
    criarSprites, jogador, garota, sombraChao, spriteLuz, rostoSprite, rostoEscova, canalTV, icones, PAL };
})();
