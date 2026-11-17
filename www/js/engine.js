'use strict';
// Motor: estado, loop, toque, iluminação, diálogo e painéis (celular, diário, menu, teclado).
const $ = id => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const dormir = ms => new Promise(r => setTimeout(r, ms));
const CHAVE_SAVE = 'tlm_save_v1';

function novoEstado() {
  return { sala: 'quarto', px: 200, py: 226, dir: 1, flags: {}, itens: [], mem: {}, vistos: {}, passos: 0, fim: false };
}
let E = novoEstado();
E.fotoCasa = null;

const G = {};
(function () {
  const tela = $('tela'), cv = $('c'), ctx = cv.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const off = document.createElement('canvas'), offG = off.getContext('2d');
  const lum = Arte.criar(480, 270), lumG = lum.getContext('2d');
  const vig = Arte.criar(480, 270);
  const cacheEst = {};
  let T = 0, cam = 0, alvo = null, busy = false, painel = null, entrada = null, down = false, hover = null;
  let estado = 'carregando'; // carregando | titulo | jogo
  let shake = 0, flashC = null, flashA = 0, fade = 1, fadeAlvo = 1, fadeVel = 3, glitch = 0, dicaAte = 0, anim = 0, passoT = 0, mov = false;
  let proxAmb = 12, aparicoes = [], susto = null, lumBase = 0.68, ultimoCel = 0, escuroExtra = 0;

  G.estado = () => estado;
  G.E = () => E;
  G.ocupado = () => busy || !!painel;

  // ------------------------------------------------------------------ vinheta pré-renderizada
  (function () {
    const g = vig.getContext('2d'), img = g.createImageData(480, 270), d = img.data;
    for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) {
      const dx = (x - 240) / 240, dy = (y - 135) / 135, v = Math.min(1, Math.sqrt(dx * dx * 0.75 + dy * dy * 0.9));
      const a = Math.pow(Math.max(0, v - 0.45) / 0.55, 1.6) * 0.78, i = (y * 480 + x) * 4;
      d[i] = 2; d[i + 1] = 3; d[i + 2] = 8; d[i + 3] = Math.round(a * 255 / 16) * 16; // faixas, estilo retrô
    }
    g.putImageData(img, 0, 0);
  })();

  // ------------------------------------------------------------------ tamanho
  function ajustar() {
    const w = window.innerWidth, h = window.innerHeight;
    let tw = w, th = w * 9 / 16; if (th > h) { th = h; tw = h * 16 / 9; }
    tela.style.width = Math.floor(tw) + 'px'; tela.style.height = Math.floor(th) + 'px';
    document.documentElement.style.setProperty('--u', (th / 270).toFixed(3));
  }
  window.addEventListener('resize', ajustar); ajustar();

  // ------------------------------------------------------------------ save
  G.salvar = () => { try { localStorage.setItem(CHAVE_SAVE, JSON.stringify({ sala: E.sala, px: E.px, py: E.py, flags: E.flags, itens: E.itens, mem: E.mem, vistos: E.vistos, fim: E.fim })); } catch (e) { } };
  G.temSave = () => { try { return !!localStorage.getItem(CHAVE_SAVE); } catch (e) { return false; } };
  G.carregar = () => { try { const s = JSON.parse(localStorage.getItem(CHAVE_SAVE)); if (s) { const foto = E.fotoCasa; E = Object.assign(novoEstado(), s); E.fotoCasa = foto; return true; } } catch (e) { } return false; };
  G.apagarSave = () => { try { localStorage.removeItem(CHAVE_SAVE); } catch (e) { } };
  G.flag = (k, v) => { if (v === undefined) return E.flags[k]; E.flags[k] = v; return v; };
  G.vez = id => { const n = E.vistos[id] || 0; E.vistos[id] = n + 1; return n; };
  G.tem = id => E.itens.includes(id);
  G.dar = (id, nome) => { if (!E.itens.includes(id)) { E.itens.push(id); G.toast('Item: ' + nome); Som.ok(); G.salvar(); } };
  G.itensNomes = {};

  // ------------------------------------------------------------------ efeitos
  G.tremer = (m = 4) => { shake = Math.max(shake, m); };
  G.flash = (cor = '#fff', a = 0.8) => { flashC = cor; flashA = a; };
  G.glitch = (s = 0.4) => { glitch = Math.max(glitch, s); };
  G.escurecer = async (ms = 400) => { fadeVel = 1000 / ms; fadeAlvo = 0; await dormir(ms + 30); };
  G.clarear = async (ms = 500) => { fadeVel = 1000 / ms; fadeAlvo = 1; await dormir(ms + 30); };
  G.esperar = dormir;
  G.ambiente = v => { lumBase = v; };
  G.fotoSusto = async (ms = 1300) => {
    if (!E.fotoCasa || !E.fotoCasa.naturalWidth) return;
    susto = { ate: performance.now() + ms, ini: performance.now() };
    Som.estouro(); G.tremer(8); await dormir(ms); susto = null;
  };
  G.toast = txt => { const t = $('toast'); t.textContent = txt; t.classList.remove('on'); void t.offsetWidth; t.classList.add('on'); };
  G.aparecer = (sala, x, y, o = {}) => { aparicoes.push(Object.assign({ sala, x, y, sombra: true, dir: -1, nasc: T, dur: 8, some: 60 }, o)); };
  G.limparAparicoes = () => { aparicoes = []; };

  // ------------------------------------------------------------------ salas
  function estatica(S, nome) {
    if (cacheEst[nome]) return cacheEst[nome];
    const c = Arte.criar(S.W, 270); S.estatico(c.getContext('2d')); return (cacheEst[nome] = c);
  }
  G.invalidar = () => { for (const k in cacheEst) delete cacheEst[k]; };
  function setSala(nome, x, y) {
    E.sala = nome; if (x !== undefined) { E.px = x; E.py = y; }
    const S = Salas[nome]; cam = clamp(E.px - 240, 0, S.W - 480); alvo = null; aparicoes = aparicoes.filter(a => a.sala === nome);
    Som.chuva(S.chuva, nome !== 'quarto' && nome !== 'sala');
  }
  G.setSala = setSala;
  G.ir = async (nome, x, y) => {
    Som.clique(); await G.escurecer(260); setSala(nome, x, y); await dormir(120);
    const primeira = !E.vistos['sala_' + nome]; E.vistos['sala_' + nome] = 1; G.salvar();
    await G.clarear(320);
    if (G.aoEntrar) await G.aoEntrar(nome, primeira);
  };

  // ------------------------------------------------------------------ hotspots
  function ativos() { return (G.hot[E.sala] || []).filter(h => !h.ver || h.ver(E)); }
  function achar(wx, y) {
    const l = ativos();
    for (let i = l.length - 1; i >= 0; i--) { const h = l[i]; if (wx >= h.x && wx <= h.x + h.w && y >= h.y && y <= h.y + h.h) return h; }
    return null;
  }
  async function executar(h) {
    busy = true; alvo = null; mov = false;
    const cx = h.x + h.w / 2; if (Math.abs(cx - E.px) > 3) E.dir = cx > E.px ? 1 : -1;
    try { await h.acao(h); } catch (e) { console.error(e); }
    busy = false; G.salvar();
  }
  function tocar(px, py, inicio) {
    const wx = px + cam, h = inicio ? achar(wx, py) : null;
    if (h) { alvo = { x: clamp(h.ax !== undefined ? h.ax : h.x + h.w / 2, 14, Salas[E.sala].W - 14), y: h.ay !== undefined ? h.ay : 214, h }; return; }
    if (py < 150 && inicio) { /* toque na parede vazia */ }
    alvo = { x: clamp(wx, 14, Salas[E.sala].W - 14), y: clamp(py, 206, 256), h: null };
  }
  G.andarAte = async (x, y) => { alvo = { x, y, h: null, livre: true }; while (alvo) await dormir(30); };

  function coord(e) { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 480, (e.clientY - r.top) / r.height * 270]; }
  tela.addEventListener('pointerdown', e => {
    Som.garantir();
    if (e.target.closest('[data-ui]')) return;
    if (entrada) { const f = entrada; f(); return; }
    if (estado !== 'jogo' || busy || painel) return;
    down = true; const [x, y] = coord(e); tocar(x, y, true);
    if (alvo && alvo.h) down = false;
  });
  tela.addEventListener('pointermove', e => {
    const [x, y] = coord(e);
    if (down && estado === 'jogo' && !busy) tocar(x, y, false);
    hover = (estado === 'jogo' && !busy && !painel) ? achar(x + cam, y) : null;
  });
  window.addEventListener('pointerup', () => { down = false; });
  window.addEventListener('keydown', e => {
    if (e.key === ' ' || e.key === 'Enter') { if (entrada) { e.preventDefault(); entrada(); } }
    if (e.key >= '1' && e.key <= '4') { const b = document.querySelectorAll('#escolhas button')[+e.key - 1]; if (b) b.click(); }
    if (e.key === 'Escape' && painel) painel.fechar();
  });

  // ------------------------------------------------------------------ diálogo
  const caixa = $('fala'), elQuem = $('quem'), elTxt = $('texto'), elSeta = $('seta'), elEsc = $('escolhas');
  G.dizer = (txt, o = {}) => new Promise(res => {
    caixa.className = 'on' + (o.estilo ? ' ' + o.estilo : ''); elQuem.textContent = o.quem || ''; elTxt.textContent = ''; elSeta.style.visibility = 'hidden';
    let i = 0, pronto = false, iv = null;
    const fim = () => { pronto = true; elTxt.textContent = txt; elSeta.style.visibility = 'visible'; };
    iv = setInterval(() => { i++; elTxt.textContent = txt.slice(0, i); if (i % 3 === 0 && txt[i - 1] !== ' ') Som.tecla(); if (i >= txt.length) { clearInterval(iv); fim(); } }, o.vel || 26);
    entrada = () => { if (!pronto) { clearInterval(iv); fim(); return; } entrada = null; caixa.className = ''; Som.clique(); res(); };
  });
  G.fala = async (...ls) => { for (const l of ls) await G.dizer(l); };
  G.pensa = async (...ls) => { for (const l of ls) await G.dizer(l, { estilo: 'pensa' }); };
  G.escolher = (ops, pergunta) => new Promise(res => {
    elEsc.innerHTML = ''; elEsc.className = 'on';
    ops.forEach((t, i) => {
      const b = document.createElement('button'); b.setAttribute('data-ui', ''); b.textContent = t;
      b.addEventListener('click', () => { elEsc.className = ''; elEsc.innerHTML = ''; caixa.className = ''; Som.clique(); res(i); });
      elEsc.appendChild(b);
    });
  });

  // ------------------------------------------------------------------ rosto em close
  const vRosto = $('rostoView'), cRosto = $('rc'), gRosto = cRosto.getContext('2d');
  cRosto.width = 96; cRosto.height = 112; gRosto.imageSmoothingEnabled = false;
  G.rosto = async (tipo, linhas, o = {}) => {
    const spr = tipo === 'escova' ? Arte.rostoEscova() : Arte.rostoSprite(tipo);
    gRosto.clearRect(0, 0, 96, 112); gRosto.drawImage(spr, 0, 0);
    vRosto.className = 'on ' + tipo; Som.chuva(0.2, true);
    if (tipo === 'medo' || tipo === 'dor') { Som.coracao(3); G.tremer(5); }
    await dormir(350);
    for (const l of linhas) await G.dizer(l, { estilo: 'pensa' });
    vRosto.className = ''; Som.chuva(Salas[E.sala].chuva, E.sala !== 'quarto' && E.sala !== 'sala'); await dormir(120);
  };

  // ------------------------------------------------------------------ memória (flash)
  const vMem = $('memView'), cMem = $('mc'), gMem = cMem.getContext('2d');
  cMem.width = 480; cMem.height = 270; gMem.imageSmoothingEnabled = false;
  const OBJ = {
    xicara: [[4, 6, 12, 10, '#d8d0c0'], [4, 6, 12, 2, '#4a2e1c'], [16, 8, 3, 6, '#d8d0c0'], [17, 9, 1, 4, '#1a1008'], [2, 16, 16, 2, '#b8b09c'], [13, 6, 3, 1, '#1a1008'], [5, 8, 1, 7, '#fff4e0']],
    caixa: [[2, 9, 18, 10, '#7a5a3a'], [2, 9, 18, 2, '#9a7448'], [1, 5, 20, 4, '#a07a4c'], [1, 5, 20, 1, '#c8a06a'], [10, 8, 3, 4, '#e0c070'], [3, 17, 16, 1, '#4a3420'], [9, 1, 1, 3, '#e0c070'], [10, 0, 3, 1, '#e0c070']],
    blusa: [[6, 5, 12, 14, '#a06c4c'], [2, 6, 4, 9, '#a06c4c'], [18, 6, 4, 9, '#a06c4c'], [10, 5, 4, 2, '#1a1008'], [6, 5, 2, 14, '#c88a60'], [16, 7, 2, 12, '#7a4c34']],
    cachecol: [[4, 3, 5, 17, '#a02a2a'], [4, 3, 5, 2, '#c84040'], [9, 3, 11, 5, '#a02a2a'], [9, 3, 11, 1, '#c84040'], [19, 8, 4, 12, '#a02a2a'], [4, 20, 1, 3, '#a02a2a'], [6, 20, 1, 3, '#a02a2a'], [8, 20, 1, 2, '#a02a2a'], [19, 20, 1, 3, '#a02a2a'], [21, 20, 1, 3, '#a02a2a']],
    fita: [[1, 4, 22, 14, '#2a2a30'], [1, 4, 22, 1, '#4a4a54'], [3, 6, 18, 6, '#d8d0b0'], [5, 8, 14, 1, '#6a5a3a'], [6, 13, 4, 4, '#0a0a0e'], [14, 13, 4, 4, '#0a0a0e'], [7, 14, 2, 2, '#c8c8d0'], [15, 14, 2, 2, '#c8c8d0'], [9, 17, 6, 1, '#6a6a74']],
    recado: [[2, 9, 20, 9, '#2c2c34'], [2, 9, 20, 1, '#4a4a56'], [4, 11, 7, 5, '#0a0a0e'], [13, 11, 7, 2, '#8a2a2a'], [13, 14, 7, 2, '#4a4a56'], [4, 5, 16, 4, '#1a1a20'], [2, 6, 3, 5, '#1a1a20'], [19, 6, 3, 5, '#1a1a20']],
  };
  G.memoria = async (id, titulo, tipo, linhas) => {
    const novo = !E.mem[id]; E.mem[id] = true; G.salvar();
    const g = gMem; g.clearRect(0, 0, 480, 270); g.fillStyle = '#0a0608'; g.fillRect(0, 0, 480, 270);
    for (let i = 0; i < 9; i++) { g.globalAlpha = 0.16; Arte.elipse(g, 300, 150, Math.round(300 * (1 - i / 9)), Math.round(190 * (1 - i / 9)), '#c88a4c'); }
    g.globalAlpha = 1;
    const rnd = Arte.rng(5); for (let i = 0; i < 70; i++) { g.fillStyle = `rgba(255,220,160,${0.1 + rnd() * 0.3})`; g.fillRect((rnd() * 480) | 0, (rnd() * 270) | 0, 1, 1); }
    // garota sem rosto, ampliada, de costas para a luz
    g.save(); g.scale(5, 5); Arte.garota(g, 78, 53, false, -1); g.restore();
    // objeto
    const lst = OBJ[tipo] || [], ox = 70, oy = 90, s = 8;
    g.globalAlpha = 1; lst.forEach(([x, y, w, h, c]) => { g.fillStyle = c; g.fillRect(ox + x * s, oy + y * s, w * s, h * s); });
    g.drawImage(vig, 0, 0);
    vMem.className = 'on'; Som.silencio(true, 0.05); await dormir(180); Som.silencio(false, 0.8); Som.memoria();
    await dormir(700);
    for (const l of linhas) await G.dizer(l, { estilo: 'pensa' });
    vMem.className = 'sai'; await dormir(500); vMem.className = '';
    if (novo) { const n = Object.keys(E.mem).length; G.toast('Lembrança ' + n + '/' + G.totalMem + ' — ' + titulo); }
  };
  G.totalMem = 6;

  // ------------------------------------------------------------------ painéis
  const pn = $('painel');
  function abrir(classe, html, aoFechar) {
    return new Promise(res => {
      pn.className = 'on ' + classe; pn.innerHTML = html;
      const fechar = () => { painel = null; pn.className = ''; pn.innerHTML = ''; Som.clique(); if (aoFechar) aoFechar(); res(); };
      painel = { fechar };
      pn.querySelectorAll('[data-fechar]').forEach(b => b.addEventListener('click', fechar));
      pn.querySelectorAll('button,.item').forEach(b => b.setAttribute('data-ui', ''));
      pn.setAttribute('data-ui', '');
    });
  }
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

  G.celular = () => {
    const D = Dados; let aba = 'msg', thread = null;
    const render = () => {
      const msgs = D.mensagens(E);
      let corpo = '';
      if (aba === 'msg' && thread === null) {
        corpo = msgs.map((m, i) => `<div class="item th" data-i="${i}"><div class="nm">${esc(m.nome)}${m.nao ? `<span class="badge">${m.nao}</span>` : ''}</div><div class="pv">${esc(m.previa)}</div></div>`).join('');
      } else if (aba === 'msg') {
        const m = msgs[thread];
        corpo = `<div class="voltar item" data-v>‹ ${esc(m.nome)}</div><div class="conv">` + m.conv.map(c => c.sep ? `<div class="sep">${esc(c.sep)}</div>` : `<div class="bal ${c.eu ? 'eu' : 'el'}">${esc(c.t)}<span>${esc(c.h || '')}</span></div>`).join('') + (m.digitando ? '<div class="bal el dig"><i></i><i></i><i></i></div>' : '') + '</div>';
      } else if (aba === 'cham') {
        corpo = D.chamadas(E).map(c => `<div class="cham ${c.perdida ? 'perd' : ''}"><div><b>${esc(c.nome)}</b><br><small>${esc(c.quando)}</small></div><div>${c.perdida ? '↙' : '↗'}</div></div>`).join('');
      } else if (aba === 'gal') {
        corpo = '<div class="grade">' + D.galeria.map((f, i) => `<div class="item foto" data-g="${i}"><canvas width="48" height="48"></canvas></div>`).join('') + '</div><div class="legenda" id="leg">Toque numa foto.</div>';
      }
      pn.innerHTML = `<div class="celular" data-ui><div class="topo"><span>03:12</span><span>▂▄▆ ▮</span></div><div class="corpo">${corpo}</div><div class="abas"><button data-a="msg" class="${aba === 'msg' ? 'a' : ''}">Mensagens</button><button data-a="cham" class="${aba === 'cham' ? 'a' : ''}">Chamadas</button><button data-a="gal" class="${aba === 'gal' ? 'a' : ''}">Fotos</button><button data-fechar>✕</button></div></div>`;
      pn.querySelectorAll('button,.item').forEach(b => b.setAttribute('data-ui', ''));
      pn.querySelectorAll('[data-fechar]').forEach(b => b.addEventListener('click', painel.fechar));
      pn.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => { aba = b.dataset.a; thread = null; Som.clique(); render(); }));
      pn.querySelectorAll('.th').forEach(b => b.addEventListener('click', () => { thread = +b.dataset.i; Som.clique(); E.flags['leu_' + thread] = true; render(); const cv2 = pn.querySelector('.corpo'); if (cv2) cv2.scrollTop = cv2.scrollHeight; }));
      pn.querySelectorAll('[data-v]').forEach(b => b.addEventListener('click', () => { thread = null; render(); }));
      pn.querySelectorAll('.foto').forEach(b => {
        const i = +b.dataset.g, c2 = b.querySelector('canvas'), g2 = c2.getContext('2d'); g2.imageSmoothingEnabled = false; D.galeria[i].desenhar(g2);
        b.addEventListener('click', () => { Som.clique(); const l = $('leg'); if (l) l.textContent = D.galeria[i].legenda; });
      });
    };
    painel = null; const prom = new Promise(res => {
      pn.className = 'on cel'; pn.innerHTML = '';
      painel = { fechar: () => { painel = null; pn.className = ''; pn.innerHTML = ''; Som.clique(); res(); } };
      render();
    });
    return prom;
  };

  G.diario = () => {
    const pag = Dados.diario(E); let i = 0;
    return new Promise(res => {
      pn.className = 'on dia';
      painel = { fechar: () => { painel = null; pn.className = ''; pn.innerHTML = ''; Som.clique(); res(); } };
      const render = () => {
        const p = pag[i];
        pn.innerHTML = `<div class="livro" data-ui><div class="folha"><div class="dt">${esc(p.data)}</div><div class="tx">${esc(p.texto).replace(/\n/g, '<br>')}</div><div class="num">${i + 1} / ${pag.length}</div></div><div class="nav"><button data-p ${i === 0 ? 'disabled' : ''}>‹</button><button data-fechar>Fechar</button><button data-n ${i === pag.length - 1 ? 'disabled' : ''}>›</button></div></div>`;
        pn.querySelectorAll('button').forEach(b => b.setAttribute('data-ui', ''));
        pn.querySelectorAll('[data-fechar]').forEach(b => b.addEventListener('click', painel.fechar));
        const a = pn.querySelector('[data-p]'), n = pn.querySelector('[data-n]');
        a.addEventListener('click', () => { if (i > 0) { i--; Som.pagina(); render(); } });
        n.addEventListener('click', () => { if (i < pag.length - 1) { i++; Som.pagina(); render(); } });
      };
      Som.pagina(); render();
    });
  };

  G.teclado = () => new Promise(res => {
    let cod = '';
    pn.className = 'on tec';
    painel = { fechar: () => { painel = null; pn.className = ''; pn.innerHTML = ''; res(null); } };
    const render = () => {
      let teclas = ''; for (const k of ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✓']) teclas += `<button data-k="${k}">${k}</button>`;
      pn.innerHTML = `<div class="painelTec" data-ui><div class="vis">${(cod + '____').slice(0, 4).split('').join(' ')}</div><div class="teclas">${teclas}</div><button class="sair" data-s>Sair</button></div>`;
      pn.querySelectorAll('button').forEach(b => b.setAttribute('data-ui', ''));
      pn.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => {
        const k = b.dataset.k; Som.tic();
        if (k === '⌫') cod = cod.slice(0, -1); else if (k === '✓') { if (cod.length === 4) { const c = cod; painel = null; pn.className = ''; pn.innerHTML = ''; res(c); return; } } else if (cod.length < 4) cod += k;
        render();
      }));
      pn.querySelector('[data-s]').addEventListener('click', painel.fechar);
    };
    render();
  });

  G.menu = () => new Promise(res => {
    const render = () => {
      const mems = Dados.memorias.map(m => E.mem[m.id] ? `<li class="ok">${esc(m.nome)}</li>` : '<li>???</li>').join('');
      const itens = E.itens.length ? E.itens.map(i => `<li class="ok">${esc(G.itensNomes[i] || i)}</li>`).join('') : '<li>Nada.</li>';
      pn.className = 'on menu';
      pn.innerHTML = `<div class="menuBox" data-ui><h2>Pausa</h2><div class="cols"><div><h3>Lembranças ${Object.keys(E.mem).length}/${G.totalMem}</h3><ul>${mems}</ul></div><div><h3>Itens</h3><ul>${itens}</ul></div></div><div class="botoes"><button data-dica>Estou preso</button><button data-som>${Som.estaMudo() ? 'Som: desligado' : 'Som: ligado'}</button><button data-novo>Recomeçar</button><button data-fechar>Voltar</button></div><div class="dicaTxt" id="dicaTxt"></div></div>`;
      pn.querySelectorAll('button').forEach(b => b.setAttribute('data-ui', ''));
      pn.querySelector('[data-fechar]').addEventListener('click', painel.fechar);
      pn.querySelector('[data-som]').addEventListener('click', () => { Som.mudo(!Som.estaMudo()); render(); });
      pn.querySelector('[data-dica]').addEventListener('click', () => { $('dicaTxt').textContent = Dados.dica(E); });
      const bn = pn.querySelector('[data-novo]'); let conf = false;
      bn.addEventListener('click', () => { if (!conf) { conf = true; bn.textContent = 'Tem certeza? Toque de novo'; return; } G.apagarSave(); location.reload(); });
    };
    painel = { fechar: () => { painel = null; pn.className = ''; pn.innerHTML = ''; Som.clique(); res(); } };
    render();
  });

  // ------------------------------------------------------------------ HUD
  const hud = $('hud');
  $('bMenu').addEventListener('click', () => { if (!busy && !painel && estado === 'jogo') G.menu(); });
  $('bCel').addEventListener('click', async () => { if (!busy && !painel && estado === 'jogo') { busy = true; await G.celular(); busy = false; if (G.aoFecharCelular) await G.aoFecharCelular(); } });
  $('bDia').addEventListener('click', async () => { if (!busy && !painel && estado === 'jogo') { busy = true; await G.diario(); busy = false; } });
  $('bLupa').addEventListener('click', () => { if (!busy && !painel && estado === 'jogo') { dicaAte = T + 2.8; Som.tic(); } });

  // ------------------------------------------------------------------ novas mensagens
  G.novaMensagem = (t, h = '03:12') => {
    E.flags.extras = E.flags.extras || []; E.flags.extras.push({ t, h }); Som.vibrar(); G.toast('Nova mensagem'); G.salvar();
  };

  // ------------------------------------------------------------------ loop
  function atualizar(dt) {
    T += dt; anim += dt;
    const S = Salas[E.sala];
    // andar
    mov = false;
    if (alvo && !busy && !painel && estado === 'jogo') {
      const dx = alvo.x - E.px, dy = alvo.y - E.py, d = Math.hypot(dx, dy);
      if (d < 2.2) { const a = alvo; alvo = null; if (a.h) executar(a.h); }
      else {
        const v = 86 * dt, s = Math.min(1, v / d); E.px += dx * s; E.py += dy * s; mov = true;
        if (Math.abs(dx) > 1) E.dir = dx > 0 ? 1 : -1;
        passoT -= dt; if (passoT <= 0) { Som.passo(); passoT = 0.34; E.passos++; }
      }
    }
    E.px = clamp(E.px, 12, S.W - 12); E.py = clamp(E.py, 200, 258);
    const ca = clamp(E.px - 240, 0, S.W - 480); cam += (ca - cam) * Math.min(1, dt * 5);
    if (Math.abs(ca - cam) < 0.4) cam = ca;
    // fade
    if (fade < fadeAlvo) fade = Math.min(fadeAlvo, fade + fadeVel * dt); else if (fade > fadeAlvo) fade = Math.max(fadeAlvo, fade - fadeVel * dt);
    shake *= Math.pow(0.02, dt); if (shake < 0.15) shake = 0;
    flashA = Math.max(0, flashA - dt * 1.6); glitch = Math.max(0, glitch - dt);
    // aparições
    aparicoes = aparicoes.filter(a => {
      if (a.sala !== E.sala) return true;
      const idade = T - a.nasc; if (idade > a.dur) return false;
      if (Math.abs(E.px - a.x) < a.some && !busy) { a.fim = a.fim || T; }
      return !(a.fim && T - a.fim > 0.25);
    });
    // eventos ambientes
    if (estado === 'jogo' && !busy && !painel) {
      proxAmb -= dt;
      if (proxAmb <= 0) {
        proxAmb = 14 + Math.random() * 18;
        const r = Math.random();
        if (r < 0.3) Som.pingo(); else if (r < 0.5) Som.batida(1); else if (r < 0.65) Som.rangido(1.6); else if (r < 0.8) Som.eletrico(); else { Som.sussurro(); }
        if (r > 0.65 && r < 0.8) glitch = 0.15;
      }
      if (!E.flags.celularPego && T - ultimoCel > 38 && (E.vistos.introFim)) { ultimoCel = T; Som.vibrar(); G.toast('Algo vibra, perto da cama…'); }
    }
    // hud
    const oculto = busy || !!painel || estado !== 'jogo';
    hud.classList.toggle('oculto', oculto);
    $('bCel').style.display = E.flags.celularPego ? '' : 'none';
    $('bDia').style.display = E.flags.diarioPego ? '' : 'none';
    const rot = $('rotulo'); const h = alvo && alvo.h ? alvo.h : hover;
    if (h && !busy && estado === 'jogo') { rot.textContent = h.nome; rot.classList.add('on'); } else rot.classList.remove('on');
  }

  const noite = '#0a0e18';
  function desenhar() {
    const S = Salas[E.sala], W = S.W;
    if (off.width !== W) { off.width = W; off.height = 270; offG.imageSmoothingEnabled = false; }
    offG.drawImage(estatica(S, E.sala), 0, 0);
    S.dinamico(offG, T, E, { x: E.px, dir: E.dir });
    // personagens, em ordem de profundidade
    const lista = [];
    aparicoes.filter(a => a.sala === E.sala).forEach(a => lista.push({ y: a.y, f: () => { const idade = T - a.nasc; let al = Math.min(1, idade / 1.2); if (a.fim) al *= Math.max(0, 1 - (T - a.fim) / 0.25); offG.globalAlpha = al * (0.85 + 0.15 * Math.sin(T * 9)); Arte.garota(offG, a.x, a.y, a.sombra, a.dir); offG.globalAlpha = 1; } }));
    if (estado === 'jogo' || estado === 'cena') {
      lista.push({ y: E.py, f: () => {
        Arte.sombraChao(offG, E.px, E.py, 18);
        const q = mov ? 1 + (Math.floor(anim * 8) % 4) : 0; Arte.jogador(offG, E.px, E.py, E.dir, q);
      } });
    }
    lista.sort((a, b) => a.y - b.y).forEach(o => o.f());

    // para a tela, com tremor
    const sx = shake ? Math.round((Math.random() - 0.5) * shake * 2) : 0, sy = shake ? Math.round((Math.random() - 0.5) * shake * 2) : 0;
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 480, 270);
    const cx = Math.round(cam);
    ctx.drawImage(off, cx, 0, 480, 270, sx, sy, 480, 270);

    // luzes
    const luzes = S.luzes(T, E).slice();
    if (estado === 'jogo' || estado === 'cena') luzes.push({ x: E.px, y: E.py - 26, r: 34, achat: 0.95, cor: '#8aa0c0', i: 0.3 });
    ctx.globalCompositeOperation = 'lighter';
    luzes.forEach(l => { const s = Arte.spriteLuz(l.r, l.achat, l.cor); ctx.globalAlpha = 0.2 * Math.max(0, l.i); ctx.drawImage(s, Math.round(l.x - cx - s.width / 2) + sx, Math.round(l.y - s.height / 2) + sy); });
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    const lg = lumG; lg.globalCompositeOperation = 'source-over'; lg.globalAlpha = 1; lg.clearRect(0, 0, 480, 270);
    lg.fillStyle = `rgba(5,7,16,${clamp(lumBase + escuroExtra, 0, 0.97)})`; lg.fillRect(0, 0, 480, 270);
    lg.globalCompositeOperation = 'destination-out';
    luzes.forEach(l => { const s = Arte.spriteLuz(l.r, l.achat, '#fff'); lg.globalAlpha = clamp(l.i, 0, 1); lg.drawImage(s, Math.round(l.x - cx - s.width / 2), Math.round(l.y - s.height / 2)); });
    lg.globalAlpha = 1; lg.globalCompositeOperation = 'source-over';
    ctx.drawImage(lum, sx, sy);
    ctx.drawImage(vig, 0, 0);

    // granulado
    ctx.fillStyle = 'rgba(200,210,230,0.10)';
    for (let i = 0; i < 70; i++) ctx.fillRect((Math.random() * 480) | 0, (Math.random() * 270) | 0, 1, 1);
    // glitch
    if (glitch > 0) {
      for (let i = 0; i < 4; i++) { const y = (Math.random() * 250) | 0, h = 2 + ((Math.random() * 12) | 0), o = ((Math.random() - 0.5) * 30 * glitch * 2) | 0; ctx.drawImage(cv, 0, y, 480, h, o, y, 480, h); }
      ctx.fillStyle = `rgba(160,20,30,${0.08 * glitch})`; ctx.fillRect(0, 0, 480, 270);
    }
    // pontos de interação (lupa)
    if (T < dicaAte && estado === 'jogo') {
      const k = Math.min(1, (dicaAte - T) / 0.6);
      ativos().forEach(h => {
        const x = Math.round(h.x + h.w / 2 - cx), y = Math.round(h.y + Math.min(h.h / 2, 30));
        if (x < -4 || x > 484) return; const p = 0.5 + 0.5 * Math.sin(T * 6 + h.x);
        ctx.globalAlpha = k * (0.5 + 0.5 * p); ctx.fillStyle = '#ffe9a8'; ctx.fillRect(x - 1, y - 1, 3, 3);
        ctx.globalAlpha = k * 0.35 * p; ctx.fillRect(x - 3, y, 7, 1); ctx.fillRect(x, y - 3, 1, 7); ctx.globalAlpha = 1;
      });
    }
    // susto com foto real (granulada, vermelha, distorcida)
    if (susto && E.fotoCasa) {
      const im = E.fotoCasa, k = (performance.now() - susto.ini) / 1000;
      ctx.save(); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 480, 270);
      const w = 480, h = im.naturalHeight / im.naturalWidth * 480, escala = 1 + k * 0.12;
      ctx.translate(240, 135); ctx.scale(escala, escala); ctx.translate(-240, -135 + (135 - h * 0.58));
      ctx.imageSmoothingEnabled = true; ctx.drawImage(im, 0, 0, w, h);
      for (let y = 0; y < h; y += 3) { const o = ((Math.random() - 0.5) * 14) | 0; if (Math.random() < 0.25) ctx.drawImage(im, 0, y * im.naturalHeight / h, im.naturalWidth, 3 * im.naturalHeight / h, o, y, w, 3); }
      ctx.restore(); ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = 'rgba(120,0,10,0.38)'; ctx.fillRect(0, 0, 480, 270);
      for (let i = 0; i < 900; i++) { ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.5})`; ctx.fillRect((Math.random() * 480) | 0, (Math.random() * 270) | 0, 1, 1); }
      ctx.drawImage(vig, 0, 0);
    }
    if (flashA > 0) { ctx.globalAlpha = flashA; ctx.fillStyle = flashC || '#fff'; ctx.fillRect(0, 0, 480, 270); ctx.globalAlpha = 1; }
    if (fade < 1) { ctx.globalAlpha = 1 - fade; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 480, 270); ctx.globalAlpha = 1; }
  }

  let ultimo = 0;
  function loop(ts) {
    const dt = Math.min(0.05, (ts - ultimo) / 1000 || 0.016); ultimo = ts;
    try { atualizar(dt); desenhar(); } catch (e) { console.error(e); G.erro = e; }
    requestAnimationFrame(loop);
  }
  G.iniciarLoop = () => requestAnimationFrame(loop);
  G.setEstado = s => { estado = s; };
  G.setBusy = b => { busy = b; };
  G.parar = () => { alvo = null; };
  G.setEntrada = f => { entrada = f; };
  G.tempo = () => T;
  G.camera = () => cam;
  G.escuro = v => { escuroExtra = v; };
})();
