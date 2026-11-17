'use strict';
// Desenho dos cômodos (parte estática em cache + parte animada) e suas luzes.
const Salas = (() => {
  const { R, rng, elipse, dither, linha, caixa } = Arte;
  const f = (E, k, padrao) => (E.flags[k] === undefined ? padrao : E.flags[k]);
  const tremer = (t, v = 1) => 0.5 + 0.5 * Math.sin(t * 37 * v) * Math.sin(t * 11.3 * v + 1.7);

  // ---------------------------------------------------------------- QUARTO
  const quarto = {
    W: 480, nome: 'Quarto',
    estatico(g) {
      Arte.parede(g, 480, { seed: 3 });
      R(g, 172, 204, 160, 46, '#221d2c'); R(g, 172, 204, 160, 1, '#2d2639'); R(g, 176, 208, 152, 38, '#272033'); dither(g, 176, 208, 152, 38, '#201a2a');
      Arte.janela(g, 196, 44, 84, 64, { cena: 'rua', cortina: true });
      // cama
      R(g, 14, 170, 140, 8, '#06070b');
      R(g, 14, 166, 4, 10, '#1a1620'); R(g, 146, 166, 4, 10, '#1a1620');
      caixa(g, 14, 150, 136, 16, '#2a2230', { luz: '#3c3244' });
      caixa(g, 14, 98, 10, 68, '#2a2230', { luz: '#3c3244' });
      caixa(g, 24, 134, 126, 18, '#37425e', { luz: '#52607f', sombra: '#2a3248' });
      caixa(g, 28, 122, 34, 13, '#8a90a8', { luz: '#b4bad0', sombra: '#6a7088' }); R(g, 36, 126, 18, 3, '#767c94');
      caixa(g, 70, 126, 80, 14, '#4a3f66', { luz: '#62568a', sombra: '#352c4c' });
      R(g, 84, 128, 1, 10, '#352c4c'); R(g, 106, 127, 1, 12, '#352c4c'); R(g, 126, 128, 1, 10, '#352c4c');
      dither(g, 70, 134, 80, 6, '#352c4c');
      R(g, 96, 140, 30, 14, '#4a3f66'); R(g, 96, 140, 30, 1, '#62568a'); dither(g, 96, 148, 30, 6, '#352c4c');
      R(g, 14, 152, 136, 14, '#2a2230'); R(g, 15, 153, 134, 1, '#3c3244');
      // criado-mudo
      caixa(g, 158, 132, 34, 42, '#2e2638', { luz: '#463a54', sombra: '#211b2a' });
      caixa(g, 162, 146, 26, 14, '#2a2234', { luz: '#3a3046' }); R(g, 173, 152, 4, 2, '#d0c090');
      R(g, 162, 164, 26, 1, '#211b2a');
      // moldura da foto
      Arte.moldura(g, 160, 52, 30, 36);
      // guarda-roupa
      caixa(g, 318, 70, 92, 104, '#2a2430', { luz: '#40364a', sombra: '#1c1822' });
      R(g, 316, 66, 96, 5, '#352c3e'); R(g, 316, 66, 96, 1, '#4c4058');
      R(g, 364, 72, 1, 100, '#1a1620'); R(g, 363, 72, 1, 100, '#40364a');
      R(g, 322, 76, 38, 92, '#2d2735'); R(g, 322, 76, 38, 1, '#40364a'); R(g, 368, 76, 38, 92, '#2d2735'); R(g, 368, 76, 38, 1, '#40364a');
      R(g, 356, 118, 3, 12, '#d0c090'); R(g, 369, 118, 3, 12, '#d0c090');
      R(g, 320, 172, 88, 2, '#14101a');
      // relógio
      Arte.relogio(g, 330, 58, 13);
      // porta
      Arte.porta(g, 428, 92, 44, 82);
      // sapatos
      caixa(g, 238, 184, 16, 8, '#17161c', { luz: '#2a2a34' }); caixa(g, 256, 186, 16, 7, '#17161c', { luz: '#2a2a34' });
      caixa(g, 276, 186, 10, 6, '#5a4a52', { luz: '#7a6a72' }); caixa(g, 288, 188, 10, 5, '#5a4a52', { luz: '#7a6a72' });
      dither(g, 238, 184, 16, 4, '#2a2a34');
    },
    dinamico(g, t, E) {
      Arte.chuvaJanela(g, 196, 44, 84, 64, t, 5);
      // luz do abajur / abajur
      const on = f(E, 'abajur', true);
      R(g, 172, 118, 6, 14, '#16121c'); R(g, 166, 130, 18, 3, '#16121c');
      const sc = on ? '#e8c87a' : '#6a5a46', sc2 = on ? '#fff0b0' : '#7a6a56';
      for (let i = 0; i < 18; i++) { const w = 12 + Math.floor(i * 0.6); R(g, 175 - (w >> 1), 102 + i, w, 1, i < 2 ? sc2 : sc); }
      R(g, 164, 119, 22, 1, on ? '#b8944a' : '#3a2f26');
      // foto
      Arte.fotoPessoas(g, 164, 56, 22, 28, f(E, 'fotoQuarto', 0));
      // ponteiros parados em 3:12
      Arte.ponteiros(g, 330, 58, 13, 3, 12, null);
      // celular na mesinha
      if (!f(E, 'celularPego', false)) {
        const p = tremer(t, 0.4) > 0.55;
        R(g, 173, 128, 14, 4, '#08080c'); R(g, 174, 128, 12, 3, p ? '#8fc4ff' : '#3a5a7a'); R(g, 174, 128, 12, 1, p ? '#d8ecff' : '#4a6a8a');
      }
      // caixa embaixo da cama
      if (!f(E, 'mem_caixa', false)) { R(g, 62, 166, 44, 8, '#74634c'); R(g, 62, 166, 44, 1, '#9a876a'); R(g, 62, 172, 44, 2, '#463a2c'); R(g, 80, 168, 8, 3, '#2a2218'); }
      else { R(g, 62, 166, 44, 8, '#74634c'); R(g, 60, 164, 48, 3, '#9a876a'); }
    },
    luzes(t, E) {
      const L1 = [];
      if (f(E, 'abajur', true)) L1.push({ x: 175, y: 116, r: 70, achat: 0.9, cor: '#e8b86a', i: 0.8 - 0.1 * tremer(t, 0.3) });
      L1.push({ x: 238, y: 80, r: 96, achat: 0.85, cor: '#5b7fb5', i: 0.5 });
      return L1;
    },
    chuva: 0.5,
  };

  // ---------------------------------------------------------------- CORREDOR
  const corredor = {
    W: 800, nome: 'Corredor',
    estatico(g) {
      Arte.parede(g, 800, { seed: 5, cor: '#1e2433', cor2: '#181e2b', chao: '#13161f', chao2: '#0d1017' });
      R(g, 44, 206, 656, 34, '#251f2d'); R(g, 44, 206, 656, 1, '#30283a'); dither(g, 48, 212, 648, 22, '#1f1a27'); R(g, 44, 238, 656, 2, '#15111a');
      [40, 190, 340].forEach(x => Arte.porta(g, x, 92, 44, 82));
      // cabideiro
      R(g, 115, 76, 3, 98, '#16121a'); R(g, 106, 76, 24, 3, '#16121a'); R(g, 104, 170, 28, 4, '#16121a');
      caixa(g, 106, 82, 22, 56, '#3a3340', { luz: '#50485a', sombra: '#27222e' }); R(g, 108, 84, 6, 52, '#2c2632'); R(g, 106, 82, 22, 3, '#50485a');
      R(g, 118, 96, 3, 30, '#8a2a2a');
      // quadro torto (cisalhado)
      const q = Arte.criar(34, 28), qg = q.getContext('2d'); Arte.quadroPaisagem(qg, 0, 0, 34, 28, 'praia');
      for (let x = 0; x < 34; x++) g.drawImage(q, x, 0, 1, 28, 250 + x, 60 + Math.round((x - 17) * 0.16), 1, 28);
      // console + telefone fixo
      caixa(g, 400, 130, 40, 6, '#3a2e26', { luz: '#5a4636' }); R(g, 404, 136, 4, 38, '#2a2018'); R(g, 432, 136, 4, 38, '#2a2018');
      caixa(g, 410, 148, 20, 10, '#2e2420', { luz: '#4a382e' });
      caixa(g, 406, 120, 28, 10, '#1b1a20', { luz: '#34343e' }); caixa(g, 404, 114, 32, 6, '#222228', { luz: '#3c3c48' }); R(g, 416, 124, 8, 3, '#0a0a0e');
      // relógio de parede
      Arte.relogio(g, 470, 58, 12);
      // arco para a sala
      R(g, 516, 82, 72, 94, '#2d2a38'); R(g, 520, 86, 64, 88, '#09080e'); Arte.elipse(g, 552, 86, 32, 6, '#09080e'); R(g, 520, 140, 64, 34, '#0e0c14'); dither(g, 520, 150, 64, 24, '#13101a');
      // interruptor
      R(g, 600, 110, 9, 13, '#cfc9b8'); R(g, 600, 110, 9, 1, '#fff'); R(g, 603, 113, 3, 5, '#6e6858');
      // porta trancada
      Arte.porta(g, 690, 82, 60, 92, { cor: '#2b2226', luz: '#3c2e34', sombra: '#1a1216', maca: '#9a8a64', trinca: true });
      R(g, 668, 112, 14, 22, '#0a0a0e'); R(g, 669, 113, 12, 20, '#1c1c24');
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) R(g, 671 + i * 3, 117 + j * 4, 2, 2, '#585868');
      // lâmpadas pendentes
      [260, 560].forEach(x => { R(g, x, 0, 1, 22, '#07080c'); R(g, x - 3, 22, 7, 4, '#2a2a32'); });
    },
    dinamico(g, t, E) {
      const on = f(E, 'luzCorredor', true);
      [260, 560].forEach((x, i) => { Arte.elipse(g, x, 29, 3, 3, on && (i === 0 || tremer(t) > 0.12) ? '#fff2c8' : '#4a4638'); });
      Arte.ponteiros(g, 470, 58, 12, 11, 47, (60 - ((t * 1) % 60)) % 60); // segundos voltando
      R(g, 417, 124, 0, 0, '#000');
      const aberta = f(E, 'portaAberta', false);
      if (aberta) {
        R(g, 692, 84, 56, 90, '#e9c98a'); for (let i = 0; i < 90; i += 3) R(g, 692, 84 + i, 56, 1, i % 6 ? '#f2d9a2' : '#e2bf80');
        Arte.elipse(g, 720, 172, 40, 5, 'rgba(255,230,170,0.5)');
      } else {
        const p = 0.5 + 0.5 * Math.sin(t * 2.3);
        R(g, 692, 172, 56, 2, p > 0.2 ? '#9fb8ee' : '#6a80b0');
        R(g, 673, 114, 4, 2, f(E, 'tecladoErro', false) ? '#d02a2a' : '#2a7a3a');
      }
    },
    luzes(t, E) {
      const out = [];
      if (f(E, 'luzCorredor', true)) {
        out.push({ x: 260, y: 36, r: 90, achat: 0.8, cor: '#f0e6c0', i: 0.55 });
        out.push({ x: 560, y: 36, r: 90, achat: 0.8, cor: '#f0e6c0', i: 0.5 * (tremer(t) > 0.12 ? 1 : 0.2) });
      }
      out.push(f(E, 'portaAberta', false) ? { x: 720, y: 150, r: 130, achat: 0.9, cor: '#ffd890', i: 1 } : { x: 720, y: 150, r: 84, achat: 0.95, cor: '#7fa0e8', i: 0.75 });
      out.push({ x: 552, y: 150, r: 50, achat: 0.8, cor: '#c8903c', i: 0.12 });
      return out;
    },
    chuva: 0.3,
  };

  // ---------------------------------------------------------------- BANHEIRO
  const refl = { dir: 1, alvo: 1, tmr: 0 };
  const banheiro = {
    W: 480, nome: 'Banheiro',
    estatico(g) {
      Arte.parede(g, 480, { seed: 7, cor: '#26323c', cor2: '#1e2931', chao: '#141c24', chao2: '#0e141a', rodape: '#3a4a58', azulejo: true });
      // piso xadrez sutil
      for (let y = WB + 4; y < 270; y += 16) for (let x = ((y / 16) & 1) * 16; x < 480; x += 32) R(g, x, y, 16, 16, 'rgba(255,255,255,0.025)');
      Arte.janela(g, 380, 36, 40, 36, { cena: 'predio' });
      // espelho
      caixa(g, 146, 40, 88, 78, '#3a4656', { luz: '#566478' });
      R(g, 152, 46, 76, 66, '#16202c');
      // pia
      caixa(g, 140, 122, 100, 52, '#2c3340', { luz: '#434c5c', sombra: '#1e242e' }); R(g, 189, 124, 1, 48, '#1e242e'); R(g, 180, 142, 3, 6, '#aab4c0'); R(g, 196, 142, 3, 6, '#aab4c0');
      caixa(g, 134, 112, 112, 11, '#cdd4dc', { luz: '#fff', sombra: '#8a939e' }); R(g, 168, 114, 44, 5, '#7a838e');
      R(g, 186, 98, 5, 15, '#aab4c0'); R(g, 186, 98, 14, 3, '#aab4c0'); R(g, 196, 101, 3, 4, '#aab4c0'); R(g, 172, 106, 8, 4, '#8a939e'); R(g, 200, 106, 8, 4, '#8a939e');
      // copo com escovas
      R(g, 218, 102, 11, 10, '#7e98b2'); R(g, 218, 102, 11, 1, '#b0c8e0'); R(g, 221, 90, 2, 14, '#3e7ee0'); R(g, 221, 88, 2, 3, '#7ab0ff'); R(g, 225, 93, 2, 11, '#d8d8e2'); R(g, 225, 91, 2, 3, '#a0a0b0');
      // chuveiro
      caixa(g, 286, 152, 76, 22, '#cdd4dc', { luz: '#fff', sombra: '#8a939e' });
      R(g, 322, 40, 3, 46, '#8a939e'); R(g, 312, 34, 20, 5, '#8a939e');
      // toalheiro
      R(g, 38, 68, 48, 3, '#aab4c0'); R(g, 38, 66, 3, 7, '#aab4c0'); R(g, 83, 66, 3, 7, '#aab4c0');
      caixa(g, 44, 71, 16, 38, '#4a6a8c', { luz: '#6a8aac', sombra: '#34506c' }); caixa(g, 63, 71, 18, 34, '#7a5a5a', { luz: '#9a7a7a', sombra: '#5a3c3c' }); R(g, 70, 100, 4, 6, '#e8e0c0');
      // cesto
      caixa(g, 90, 142, 34, 32, '#6a5a46', { luz: '#8a7a60', sombra: '#463a2c' }); dither(g, 92, 146, 30, 26, '#524434');
      R(g, 96, 138, 14, 6, '#8a90a8'); R(g, 108, 136, 8, 8, '#4a3f66');
      // tapete
      R(g, 148, 192, 72, 18, '#1f2e3c'); R(g, 148, 192, 72, 1, '#2d4054'); dither(g, 150, 196, 68, 10, '#233444');
      // bilhete
      R(g, 210, 50, 15, 15, '#d9c96a'); R(g, 210, 50, 15, 2, '#efe08a'); for (let i = 0; i < 4; i++) R(g, 212, 54 + i * 3, 9 - (i & 1) * 3, 1, '#6a5a2a'); dither(g, 220, 60, 5, 5, '#b8a850');
      Arte.porta(g, 428, 92, 44, 82);
    },
    dinamico(g, t, E, P) {
      Arte.chuvaJanela(g, 380, 36, 40, 36, t, 9);
      // reflexo
      const n = f(E, 'espelhoN', 0);
      R(g, 152, 46, 76, 66, '#16202c');
      const p = P || { x: 190, dir: 1 };
      if (p.dir !== refl.alvo) { refl.alvo = p.dir; refl.tmr = n >= 2 ? 0.7 : 0.05; }
      if (refl.tmr > 0) refl.tmr -= 1 / 60; else refl.dir = refl.alvo;
      g.save(); g.beginPath(); g.rect(152, 46, 76, 66); g.clip();
      const near = Math.abs(p.x - 190) < 60;
      if (n >= 3 && near) { // a garota, atrás do reflexo
        g.globalAlpha = 0.35 + 0.25 * tremer(t, 0.5); Arte.garota(g, 212, 114, true, -1); g.globalAlpha = 1;
      }
      g.globalAlpha = 0.78; Arte.jogador(g, 188 + (n >= 2 ? Math.sin(t * 0.8) * 1.5 : 0), 112, -refl.dir, 0); g.globalAlpha = 1;
      R(g, 152, 46, 76, 66, 'rgba(40,70,100,0.18)');
      for (let i = 0; i < 6; i++) linha(g, 160 + i * 10, 112, 190 + i * 10, 46, 'rgba(255,255,255,0.025)');
      g.restore();
      R(g, 150, 44, 80, 1, 'rgba(255,255,255,0.08)');
      // água
      if (f(E, 'torneira', false)) { const k = ((t * 60) | 0) % 4; R(g, 192, 106 + k, 1, 6, 'rgba(180,210,240,0.6)'); }
      else if (((t * 0.7) % 1) < 0.1) R(g, 193, 108 + (((t * 0.7) % 1) * 90 | 0), 1, 2, 'rgba(180,210,240,0.7)');
      // cortina
      const ond = Math.sin(t * 0.9) * 1;
      R(g, 288, 46, 74, 2, '#aab4c0');
      for (let x = 0; x < 72; x++) { const xx = 289 + x, o = Math.round(Math.sin(x / 5 + t * 0.9) * 0.8 * (x % 8 < 4 ? 1 : 0.5)); R(g, xx, 48, 1, 108 + o, (x % 8 < 3) ? '#5a6c7c' : '#6c8090'); }
      R(g, 288, 150, 74, 6, 'rgba(0,0,0,0.25)'); dither(g, 288, 148, 74, 8, '#4a5c6c');
      R(g, 286 + ond, 48, 2, 108, '#4a5c6c');
      // ponteiro? (sem relógio aqui)
    },
    luzes(t, E) {
      const k = tremer(t, 1.3) > 0.1 ? 1 : 0.35;
      return [{ x: 190, y: 40, r: 100, achat: 0.9, cor: '#b8d0e8', i: 0.7 * (E.flags.piscaBanheiro ? k : 1) }, { x: 400, y: 56, r: 60, achat: 0.8, cor: '#5b7fb5', i: 0.3 }];
    },
    chuva: 0.35,
  };

  // ---------------------------------------------------------------- COZINHA
  const cozinha = {
    W: 480, nome: 'Cozinha',
    estatico(g) {
      Arte.parede(g, 480, { seed: 11, cor: '#242a34', cor2: '#1d222b', chao: '#161a21', chao2: '#0f1218' });
      Arte.janela(g, 330, 48, 80, 64, { cena: 'predio' });
      // geladeira
      caixa(g, 72, 56, 64, 118, '#6e7886', { luz: '#93a0b0', sombra: '#4c5562' }); R(g, 72, 98, 64, 2, '#2a3038'); R(g, 126, 68, 3, 24, '#d0d8e2'); R(g, 126, 106, 3, 32, '#d0d8e2');
      R(g, 84, 64, 18, 15, '#e8e2cc'); for (let i = 0; i < 4; i++) R(g, 86, 67 + i * 3, 12 - (i & 1) * 4, 1, '#7a6a4a');
      R(g, 106, 66, 5, 5, '#c04a3a'); R(g, 106, 76, 5, 5, '#3a8a5a');
      // calendário
      R(g, 150, 64, 28, 36, '#d8d0b8'); R(g, 150, 64, 28, 6, '#a04040'); for (let j = 0; j < 5; j++) for (let i = 0; i < 6; i++) { R(g, 152 + i * 4, 73 + j * 5, 3, 3, '#b8b098'); if (j < 3 || (j === 3 && i < 2)) { linha(g, 152 + i * 4, 73 + j * 5, 154 + i * 4, 75 + j * 5, '#a02828'); } }
      // lixeira
      caixa(g, 148, 148, 22, 26, '#2e333c', { luz: '#454c58' }); R(g, 146, 146, 26, 3, '#3a414c');
      // bancada
      caixa(g, 182, 118, 130, 56, '#3a3f4c', { luz: '#525a6a', sombra: '#2a2e38' }); R(g, 214, 120, 1, 52, '#2a2e38'); R(g, 262, 120, 1, 52, '#2a2e38');
      R(g, 204, 140, 6, 2, '#aaa'); R(g, 252, 140, 6, 2, '#aaa'); R(g, 300, 140, 6, 2, '#aaa');
      caixa(g, 180, 108, 134, 11, '#8a94a2', { luz: '#bcc6d4', sombra: '#5e6674' }); R(g, 222, 110, 50, 5, '#4a525e');
      R(g, 246, 94, 5, 15, '#aab4c0'); R(g, 246, 94, 14, 3, '#aab4c0'); R(g, 256, 97, 3, 4, '#aab4c0');
      caixa(g, 182, 34, 130, 46, '#323846', { luz: '#4a5262' }); R(g, 225, 36, 1, 42, '#232833'); R(g, 268, 36, 1, 42, '#232833'); R(g, 218, 52, 3, 8, '#aaa'); R(g, 230, 52, 3, 8, '#aaa'); R(g, 262, 52, 3, 8, '#aaa');
      R(g, 214, 8, 64, 5, '#4a525e'); R(g, 214, 8, 64, 1, '#8a94a2');
      // mesa e cadeiras
      caixa(g, 326, 130, 98, 7, '#4a3a30', { luz: '#6a5444' }); R(g, 332, 137, 5, 37, '#3a2e26'); R(g, 412, 137, 5, 37, '#3a2e26');
      caixa(g, 352, 120, 11, 9, '#d8d0c0', { luz: '#fff' }); R(g, 353, 121, 9, 2, '#2a1a12');
      caixa(g, 390, 120, 11, 9, '#d8d0c0', { luz: '#fff' }); R(g, 391, 121, 9, 2, '#3a2418');
      R(g, 434, 112, 5, 62, '#3a2e26'); R(g, 424, 146, 16, 5, '#4a3a30'); R(g, 424, 151, 3, 23, '#3a2e26'); R(g, 437, 151, 3, 23, '#3a2e26');
      R(g, 286, 118, 5, 56, '#3a2e26'); R(g, 286, 148, 22, 5, '#4a3a30'); R(g, 286, 153, 3, 21, '#3a2e26'); R(g, 305, 153, 3, 21, '#3a2e26');
      Arte.relogio(g, 440, 62, 12);
      Arte.porta(g, 14, 92, 44, 82);
    },
    dinamico(g, t, E) {
      Arte.chuvaJanela(g, 330, 48, 80, 64, t, 13);
      // vizinho na janela da frente
      R(g, 368, 74, 26, 22, '#8a7040'); dither(g, 368, 74, 26, 22, '#b89a58'); R(g, 366, 72, 30, 2, '#06080e'); R(g, 366, 96, 30, 2, '#06080e'); R(g, 366, 72, 2, 26, '#06080e'); R(g, 394, 72, 2, 26, '#06080e');
      const olha = f(E, 'vizinhoOlhou', false), bob = Math.sin(t * 0.6) * 0.6;
      R(g, 376, 88 + bob, 12, 8, '#0c0a0a'); R(g, 374, 96, 16, 2, '#0c0a0a');
      Arte.elipse(g, olha ? 379 : 382, 84 + bob, 3, 3, '#0c0a0a');
      // vapor da xícara
      for (let i = 0; i < 6; i++) { const ph = (t * 0.55 + i / 6) % 1; R(g, 395 + Math.sin(t * 1.5 + i * 2) * 2, 118 - ph * 24, 1, 2, `rgba(205,215,235,${0.4 * (1 - ph)})`); }
      // relógio: ponteiro dos segundos tremendo no mesmo lugar
      Arte.ponteiros(g, 440, 62, 12, 3, 12, 20 + Math.sin(t * 9) * 0.8);
      if (f(E, 'torneiraCozinha', false)) { const k = ((t * 60) | 0) % 4; R(g, 249, 102 + k, 1, 6, 'rgba(180,210,240,0.6)'); }
    },
    luzes(t, E) {
      const fl = tremer(t, 0.6) > 0.08 ? 1 : 0.4;
      return [{ x: 246, y: 40, r: 100, achat: 0.85, cor: '#cfe0f0', i: 0.6 * fl }, { x: 370, y: 82, r: 80, achat: 0.8, cor: '#5b7fb5', i: 0.32 }, { x: 395, y: 124, r: 34, achat: 0.8, cor: '#e8b86a', i: 0.3 }];
    },
    chuva: 0.4,
  };

  // ---------------------------------------------------------------- SALA
  const sala = {
    W: 640, nome: 'Sala',
    estatico(g) {
      Arte.parede(g, 640, { seed: 15, cor: '#232837', cor2: '#1c212e' });
      R(g, 236, 200, 300, 52, '#2a2236'); R(g, 236, 200, 300, 1, '#372d46'); R(g, 242, 206, 288, 40, '#30263e'); dither(g, 242, 206, 288, 40, '#281f34'); R(g, 236, 250, 300, 2, '#1c1624');
      Arte.janela(g, 190, 40, 110, 76, { cena: 'rua', cortina: true });
      // estante
      caixa(g, 80, 48, 70, 126, '#2e2630', { luz: '#463a48', sombra: '#211b24' });
      const r = rng(77), cores = ['#6a3a3a', '#3a4a66', '#4a5a3a', '#6a5a3a', '#4a3a5a', '#7a7a6a', '#2a3a4a'];
      [52, 88, 124].forEach(y => {
        R(g, 84, y + 33, 62, 2, '#463a48'); let x = 85;
        while (x < 142) { const w = 3 + ((r() * 4) | 0), h = 22 + ((r() * 10) | 0); if (r() < 0.12) { x += 6; continue; } R(g, x, y + 33 - h, w, h, cores[(r() * cores.length) | 0]); R(g, x, y + 33 - h, 1, h, 'rgba(255,255,255,0.1)'); x += w + 1; }
      });
      R(g, 84, 162, 62, 8, '#241e28'); R(g, 86, 164, 58, 4, '#2e2630');
      // aparador + rádio + planta
      caixa(g, 186, 132, 118, 42, '#2e2630', { luz: '#463a48', sombra: '#211b24' }); R(g, 244, 134, 1, 38, '#211b24'); R(g, 222, 150, 4, 2, '#d0c090'); R(g, 264, 150, 4, 2, '#d0c090');
      caixa(g, 200, 114, 32, 18, '#5a4636', { luz: '#7a6048', sombra: '#3e2e22' }); dither(g, 204, 118, 12, 10, '#2a2018'); R(g, 204, 118, 12, 10, '#2a2018'); dither(g, 204, 118, 12, 10, '#3a2e22'); R(g, 220, 119, 8, 5, '#2a2018'); linha(g, 228, 114, 238, 96, '#8a8a96');
      caixa(g, 268, 120, 20, 12, '#7a4a36', { luz: '#9a6046' }); R(g, 270, 119, 16, 2, '#2a1a12');
      linha(g, 278, 120, 272, 100, '#5a4a2a'); linha(g, 278, 120, 285, 98, '#5a4a2a'); linha(g, 278, 120, 266, 108, '#5a4a2a'); linha(g, 278, 120, 290, 108, '#5a4a2a');
      R(g, 270, 99, 3, 3, '#6a5a2a'); R(g, 285, 96, 3, 3, '#6a5a2a'); R(g, 264, 108, 3, 3, '#6a5a2a'); R(g, 289, 108, 3, 3, '#6a5a2a'); R(g, 276, 124, 5, 1, '#1a120e');
      // TV
      caixa(g, 430, 150, 100, 24, '#2a2430', { luz: '#3e3446' }); R(g, 440, 148, 80, 3, '#14121a');
      caixa(g, 436, 94, 88, 56, '#12121a', { luz: '#2a2a38', sombra: '#0a0a10' });
      // sofá
      caixa(g, 318, 112, 104, 20, '#3a3550', { luz: '#544e70', sombra: '#2a2640' });
      caixa(g, 320, 128, 100, 28, '#3f3a58', { luz: '#58527a', sombra: '#2a2640' }); R(g, 370, 130, 1, 24, '#242038');
      dither(g, 322, 132, 46, 22, '#2e2a46'); // lado gasto (o meu)
      caixa(g, 310, 122, 14, 52, '#3a3550', { luz: '#544e70', sombra: '#2a2640' }); caixa(g, 416, 122, 14, 52, '#3a3550', { luz: '#544e70', sombra: '#2a2640' });
      R(g, 316, 172, 6, 4, '#16121c'); R(g, 420, 172, 6, 4, '#16121c');
      // almofada no chão
      caixa(g, 300, 198, 26, 10, '#4a3f66', { luz: '#62568a', sombra: '#352c4c' }); dither(g, 303, 200, 20, 6, '#3c3258');
      // mesa de centro
      caixa(g, 336, 186, 70, 6, '#4a3a30', { luz: '#6a5444' }); R(g, 340, 192, 4, 10, '#3a2e26'); R(g, 398, 192, 4, 10, '#3a2e26');
      R(g, 388, 181, 8, 5, '#d8d0c0'); R(g, 389, 182, 6, 1, '#2a1a12');
      // luminária de pé (haste)
      R(g, 566, 170, 14, 4, '#16121c'); R(g, 572, 74, 3, 98, '#16121c');
      Arte.relogio(g, 610, 62, 12);
      Arte.porta(g, 14, 92, 44, 82);
    },
    dinamico(g, t, E) {
      Arte.chuvaJanela(g, 190, 40, 110, 76, t, 17);
      // semáforo piscando no amarelo
      R(g, 266, 96, 4, 14, '#04060a'); R(g, 264, 90, 8, 8, '#04060a'); if (((t * 1.2) | 0) % 2) { R(g, 266, 92, 4, 4, '#e0b030'); }
      // fotos na parede (mudam com o tempo)
      const m = f(E, 'fotosMudaram', false);
      Arte.quadroPaisagem(g, 322, 52, 28, 34, 'praia'); Arte.quadroPaisagem(g, 356, 52, 28, 34, m ? 'vazio' : 'grupo'); Arte.quadroPaisagem(g, 390, 52, 28, 34, 'vazio');
      if (m) { dither(g, 360, 58, 20, 22, '#a8a08c'); }
      Arte.ponteiros(g, 610, 62, 12, 3, 12, null);
      // rádio ligado
      if (f(E, 'radio', false)) { R(g, 221, 120, 6, 2, '#ffd890'); Arte.elipse(g, 224, 121, 6, 3, 'rgba(255,200,120,0.15)'); }
      // TV
      const canal = f(E, 'canal', 0), lig = f(E, 'tvLigada', true);
      if (lig) { const c = Arte.canalTV(canal, t, E.fotoCasa); g.imageSmoothingEnabled = false; g.drawImage(c, 441, 99, 78, 46); R(g, 441, 99, 78, 3, 'rgba(255,255,255,0.05)'); }
      else R(g, 441, 99, 78, 46, '#050508');
      R(g, 441, 99, 78, 1, 'rgba(255,255,255,0.12)'); R(g, 441, 99, 1, 46, 'rgba(255,255,255,0.08)');
      // luminária
      const on = f(E, 'luminaria', true);
      for (let i = 0; i < 18; i++) { const w = 14 + Math.floor(i * 0.9); R(g, 573 - (w >> 1), 60 + i, w, 1, i < 2 ? (on ? '#fff0b0' : '#7a6a56') : (on ? '#e8c87a' : '#6a5a46')); }
      // diário
      if (!f(E, 'diarioPego', false)) { R(g, 360, 180, 20, 6, '#2a1c1c'); R(g, 360, 180, 20, 1, '#4a3030'); R(g, 362, 182, 16, 1, '#6a5040'); }
    },
    luzes(t, E) {
      const out = [{ x: 245, y: 80, r: 104, achat: 0.85, cor: '#5b7fb5', i: 0.45 }];
      if (f(E, 'tvLigada', true)) {
        const c = f(E, 'canal', 0), cor = ['#6fb8c8', '#8090d0', '#c8a0d8', '#a8d890', '#c0c8d0'][c] || '#6fb8c8';
        out.push({ x: 480, y: 124, r: 130, achat: 0.8, cor, i: 0.75 * (0.85 + 0.15 * tremer(t, 1.7)) });
      }
      if (f(E, 'luminaria', true)) out.push({ x: 573, y: 84, r: 90, achat: 0.9, cor: '#e8b86a', i: 0.8 });
      if (f(E, 'radio', false)) out.push({ x: 224, y: 121, r: 24, achat: 0.8, cor: '#ffc070', i: 0.5 });
      return out;
    },
    chuva: 0.45,
  };

  return { quarto, corredor, banheiro, cozinha, sala };
})();
