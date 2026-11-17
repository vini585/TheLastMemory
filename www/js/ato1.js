'use strict';
// ATO I — SOLIDÃO. Todo o texto e a lógica de cada objeto ficam aqui.
// Regras do projeto: o nome do protagonista e o nome interno da garota NUNCA aparecem aqui.

const CODIGO = '0312';
G.itensNomes = { chave: 'Chavinha prateada', fita: 'Fita cassete sem rótulo' };

const Dados = {
  memorias: [
    { id: 'caixa', nome: 'A caixa de música' }, { id: 'cafe', nome: 'O café ainda quente' }, { id: 'blusa', nome: 'A blusa no cesto' },
    { id: 'recado', nome: 'O recado na secretária' }, { id: 'fita', nome: 'A fita sem rótulo' }, { id: 'cachecol', nome: 'O cachecol vermelho' },
  ],
  mensagens(E) {
    const extras = (E.flags.extras || []).map(e => ({ t: e.t, h: e.h }));
    const conv = [
      { sep: 'há muito tempo' },
      { t: 'Cheguei. Tô na mesa do fundo.', h: '19:40' }, { t: 'Chego já.', h: '19:52', eu: true }, { t: 'Sem pressa. Eu espero.', h: '19:53' },
      { sep: 'depois' },
      { t: 'Você viu o que eu mandei?', h: 'ter 03:12' }, { t: 'Oi. Só pra saber se você chegou bem.', h: 'qua 03:12' },
      { t: 'Tá tudo bem?', h: 'qui 03:12' }, { t: 'Atende.', h: 'sex 03:12' },
      { t: 'Eu passei aí. A luz estava acesa.', h: 'sáb 03:12' }, { t: 'Não precisa responder. Só quero saber se você está bem.', h: 'dom 03:12' },
      { t: 'Fiz aquele bolo que você gosta. Sobrou um pedaço.', h: 'seg 03:12' }, { t: 'Já faz tanto tempo, né?', h: 'ter 03:12' },
      { t: 'Você está bem?', h: '03:12' },
    ].concat(extras.length ? [{ sep: 'agora' }] : []).concat(extras);
    const nao = conv.filter(c => !c.sep && !c.eu).length;
    return [
      { nome: '(sem nome)', previa: extras.length ? extras[extras.length - 1].t : 'Você está bem?', nao: E.flags.leu_0 ? 0 : nao, conv, digitando: E.flags.digitando },
      { nome: 'Operadora', previa: 'Você tem 112 novas mensagens de voz.', nao: 0, conv: [{ t: 'Você tem 112 novas mensagens de voz. Para ouvi-las, disque *123.', h: 'seg' }, { t: 'Você tem 112 novas mensagens de voz.', h: 'qui' }] },
      { nome: 'Entregas', previa: 'Tentamos entregar sua encomenda. Ninguém atendeu.', nao: 0, conv: [{ t: 'Tentamos entregar sua encomenda. Ninguém atendeu.', h: 'ter' }, { t: 'Nova tentativa de entrega: ninguém atendeu.', h: 'sex' }, { t: 'Sua encomenda foi devolvida ao remetente.', h: 'seg' }] },
      { nome: 'Banco', previa: 'Sua conta está inativa.', nao: 0, conv: [{ t: 'Percebemos que sua conta não tem movimentação. Está tudo bem?', h: 'dom' }] },
    ];
  },
  chamadas(E) {
    const l = []; for (let i = 0; i < 7; i++) l.push({ nome: '(sem nome)', quando: ['hoje', 'ontem', 'anteontem', 'sáb', 'sex', 'qui', 'qua'][i] + ' · 03:12', perdida: true });
    l.push({ nome: '… mais 40 chamadas perdidas', quando: 'todas às 03:12', perdida: true });
    l.push({ nome: '(sem nome)', quando: 'há muito tempo · 4 min', perdida: false });
    return l;
  },
  galeria: [
    { legenda: 'Uma praia. Duas pegadas na areia, uma sombra só.', desenhar(g) { g.fillStyle = '#7e8ea4'; g.fillRect(0, 0, 48, 22); g.fillStyle = '#4f6a80'; g.fillRect(0, 22, 48, 10); g.fillStyle = '#b8a47e'; g.fillRect(0, 32, 48, 16); g.fillStyle = '#6e5e44'; for (let i = 0; i < 6; i++) { g.fillRect(8 + i * 5, 38 + (i % 2) * 3, 2, 3); } g.fillStyle = '#3a3030'; g.fillRect(30, 36, 3, 8); g.fillRect(29, 33, 5, 4); } },
    { legenda: 'Duas pessoas. O rosto da segunda está borrado, como se a foto tivesse se mexido.', desenhar(g) { Arte.fotoPessoas(g, 0, 0, 48, 48, 0); } },
    { legenda: 'Uma mesa de café. Duas xícaras. Uma delas está meio apagada na imagem.', desenhar(g) { g.fillStyle = '#4a3a30'; g.fillRect(0, 0, 48, 48); g.fillStyle = '#6a5444'; g.fillRect(0, 26, 48, 22); g.fillStyle = '#d8d0c0'; g.fillRect(8, 20, 10, 9); g.fillStyle = 'rgba(216,208,192,.25)'; g.fillRect(30, 20, 10, 9); g.fillStyle = '#2a1a12'; g.fillRect(8, 20, 10, 2); } },
    { legenda: 'A foto está escura. Só dá pra ver o reflexo da tela.', desenhar(g) { g.fillStyle = '#05060a'; g.fillRect(0, 0, 48, 48); g.fillStyle = '#10141e'; g.fillRect(14, 8, 20, 36); g.fillStyle = '#05060a'; g.fillRect(16, 10, 16, 30); } },
    { legenda: 'Uma foto sua, de lado, dormindo. Alguém tirou. Não foi você.', desenhar(g) { g.fillStyle = '#1a1626'; g.fillRect(0, 0, 48, 48); g.fillStyle = '#37425e'; g.fillRect(0, 26, 48, 22); g.fillStyle = '#8a90a8'; g.fillRect(4, 20, 18, 8); g.fillStyle = '#7a5a48'; g.fillRect(8, 16, 8, 8); g.fillStyle = '#14131c'; g.fillRect(7, 14, 10, 4); } },
    { legenda: '(sem imagem)', desenhar(g) { g.fillStyle = '#0a0c12'; g.fillRect(0, 0, 48, 48); g.fillStyle = '#2a3042'; for (let i = 0; i < 20; i++) g.fillRect((i * 17) % 48, (i * 29) % 48, 1, 1); } },
  ],
  diario(E) {
    const p = [
      { data: 'Segunda', texto: 'Choveu o dia todo.\nComi em pé na cozinha. Não lembro de ter ligado a TV, mas estava ligada quando voltei.\n\nÀs vezes eu falo em voz alta só pra ver se a casa responde.' },
      { data: 'Quinta?', texto: 'Perdi a conta dos dias. Acordei às três e doze. De novo.\n\nÉ sempre às três e doze. O relógio do quarto parou nessa hora, e eu fico olhando, esperando ele decidir andar.' },
      { data: 'Sem data', texto: 'Deixei o celular virado pra baixo.\nSei quem é. Eu sei o tom da vibração.\n\nSe eu responder, vai ser verdade que eu sumi.' },
      { data: '—', texto: 'Alguém arrancou a página seguinte.\n\nSobraram só os sulcos da caneta, bem fundos. Dá pra ler uma palavra, se você inclinar:\n\n"d e s c u l p a"' },
    ];
    return p.slice(0, E.flags.diarioPag || 4);
  },
  dica(E) {
    const f = E.flags;
    if (!f.celularPego) return 'Algo vibrava perto da cama, no quarto.';
    if (!f.viuPortaTrancada) return 'Há mais do apartamento além do quarto. Siga o corredor até o fim.';
    if (!f.tentouCodigo) return 'A porta do fim do corredor pede quatro dígitos. Procure por algo que marque uma hora.';
    return 'Três lugares do apartamento marcam a mesma hora: um relógio, um bilhete e uma página do diário. Tente 0312 se ainda não tentou.';
  },
};

// ---------------------------------------------------------------- atalhos
const d = (t, o) => G.dizer(t, o), p = (...l) => G.pensa(...l), ex = (...l) => G.fala(...l), E_ = () => G.E();
const f = k => G.E().flags[k], set = (k, v = true) => { G.E().flags[k] = v; };
const vez = id => G.vez(id);
const porta = (destino, x, y = 214) => async () => { Som.interruptor(); await G.ir(destino, x, y); };
function memoriasCount() { return Object.keys(G.E().mem).length; }

// ---------------------------------------------------------------- pontos de interação
G.hot = {
  quarto: [
    { nome: 'Cama', x: 14, y: 98, w: 140, h: 76, ax: 100, async acao() {
      const n = vez('cama');
      if (n === 0) await p('A cama está desfeita. O lado direito está frio.', 'Como se ninguém dormisse ali há muito tempo.');
      else await p('O lado direito continua frio.');
      const r = await G.escolher(['Deitar um pouco', 'Deixar pra lá']);
      if (r === 0) {
        await G.escurecer(900); Som.silencio(true, 0.3); await G.esperar(1600); Som.silencio(false, 1.0);
        await p('Você fecha os olhos. A chuva não deixa.');
        Som.vibrar(); await G.esperar(900); await G.clarear(700);
        await p('O celular vibrou de novo. Três vezes.');
      }
    } },
    { nome: 'Travesseiro', x: 28, y: 120, w: 36, h: 16, ax: 70, async acao() {
      if (vez('trav') === 0) await p('Tem a marca da sua cabeça. Do outro lado, o travesseiro está intacto.', 'Arrumado. Alguém arrumou.');
      else await p('Intacto. Arrumado demais.');
    } },
    { nome: 'Caixa embaixo da cama', x: 60, y: 163, w: 50, h: 12, ax: 84, async acao() {
      if (f('mem_caixa_aberta')) { await p('A caixa de música está vazia agora. A melodia continua na sua cabeça.'); return; }
      if (!G.tem('chave')) {
        if (vez('caixaT') === 0) await p('Uma caixa de madeira, empurrada para o fundo.', 'Trancada. Uma fechadura pequena, cansada de tanto uso.');
        else await p('Trancada. A chave deve estar em algum lugar da casa.');
        return;
      }
      await p('A chavinha cabe na fechadura. Gira sem fazer força, como se já soubesse o caminho.');
      set('mem_caixa_aberta'); Som.clique();
      await p('Dentro, uma caixa de música. E uma foto instantânea, virada para baixo.');
      Som.caixaMusica(); await G.esperar(900);
      await G.memoria('caixa', 'A caixa de música', 'caixa', ['Você não lembra de ter comprado isso.', 'Mas a melodia termina antes de você querer que ela termine.', 'Alguém girou a manivela por você, uma vez. Segurando a sua mão.']);
      await p('Você vira a foto. Duas pessoas. A segunda não tem rosto.', 'Não está borrado. Não tem.');
      set('fotoQuarto', 1); G.invalidar();
    } },
    { nome: 'Janela', x: 190, y: 38, w: 96, h: 78, ax: 238, async acao() {
      const n = vez('janQ');
      if (n === 0) await p('Chove. Dá pra ver as luzes de uma rua que você conhece de cor.', 'Nenhum carro. Nenhuma pessoa.');
      else await p('O vidro embaça por dentro. Dedos escreveram algo ali, e a chuva ainda está apagando.');
      const r = await G.escolher(['Abrir a janela', 'Deixar fechada']);
      if (r === 0) {
        Som.chuva(0.95, false); await p('O barulho da chuva enche o quarto. Cheiro de terra molhada.', 'Lá embaixo, na calçada, alguém olha para cima.');
        await p('Você pisca. A calçada está vazia.'); Som.chuva(0.5, false); Som.clique(); await p('Você fecha de novo.');
      }
    } },
    { nome: 'Abajur', x: 163, y: 98, w: 26, h: 38, ax: 176, async acao() { const on = f('abajur') === undefined ? true : f('abajur'); set('abajur', !on); Som.interruptor(); if (on) await p('O quarto fica azul. A luz da rua é a única que sobra.'); } },
    { nome: 'Celular', x: 170, y: 124, w: 20, h: 10, ax: 180, ver: E => !E.flags.celularPego, async acao() {
      await p('O celular está quente. Como se alguém tivesse acabado de segurá-lo.');
      set('celularPego'); Som.clique(); await G.celular();
      await p('Quarenta e sete chamadas perdidas. Todas do mesmo número.', 'Todas às 03:12.');
    } },
    { nome: 'Gaveta do criado-mudo', x: 160, y: 144, w: 30, h: 18, ax: 176, async acao() {
      const n = vez('gavQ');
      if (n === 0) await p('Carregador, tampões de ouvido, bilhetes de ônibus.', 'E um batom que não é seu.');
      else await p('O batom ainda está lá. Você o fecha, com cuidado.');
    } },
    { nome: 'Criado-mudo', x: 158, y: 132, w: 34, h: 42, ax: 176, async acao() { await p('Uma madeira escura, riscada por anos de uso. Tem um círculo de copo no tampo. Dois, na verdade.'); } },
    { nome: 'Foto na parede', x: 158, y: 50, w: 34, h: 40, ax: 176, async acao() {
      const v = f('fotoQuarto') || 0;
      if (v === 0) { await p('Duas pessoas, ombro com ombro. Você reconhece uma.', 'A outra tem o rosto borrado, como se tivesse se mexido na hora do clique.'); }
      else { await p('Agora só você aparece na foto.', 'Você tem certeza de que tinha alguém ao seu lado?'); }
    } },
    { nome: 'Guarda-roupa (esquerda)', x: 320, y: 74, w: 42, h: 98, ax: 340, async acao() {
      await p('Suas roupas. Todas iguais, dobradas com uma precisão que não é sua.');
      await p('No fundo, um cabide sozinho, balançando devagar.');
    } },
    { nome: 'Guarda-roupa (direita)', x: 366, y: 74, w: 42, h: 98, ax: 388, async acao() {
      const n = vez('gdD');
      if (n === 0) {
        await p('Você abre uma fresta.'); Som.sussurro(); G.glitch(0.4); await G.esperar(900);
        await p('Cabides vazios. E o cheiro de um perfume que você quase reconhece.');
        await p('Você fecha. Rápido.');
      } else await p('Cabides vazios. Você não abre de novo.');
    } },
    { nome: 'Relógio', x: 313, y: 41, w: 34, h: 34, ax: 330, async acao() {
      const n = vez('relQ');
      await p('O relógio parou. Três e doze.');
      if (n === 0) await p('O ponteiro dos minutos treme, como se quisesse andar e alguma coisa não deixasse.');
      set('viuRelogio');
    } },
    { nome: 'Sapatos', x: 236, y: 180, w: 66, h: 16, ax: 268, async acao() {
      if (vez('sap') === 0) await p('Dois pares de sapatos. O seu, e outro, de número menor.', 'O menor ainda está molhado. Há uma poça embaixo.');
      else await p('A poça embaixo do sapato menor não seca.');
    } },
    { nome: 'Porta', x: 426, y: 90, w: 48, h: 86, ax: 450, ay: 210, acao: porta('corredor', 62, 212) },
  ],

  corredor: [
    { nome: 'Porta do quarto', x: 38, y: 90, w: 48, h: 86, ax: 62, ay: 210, acao: porta('quarto', 450, 212) },
    { nome: 'Porta do banheiro', x: 188, y: 90, w: 48, h: 86, ax: 212, ay: 210, acao: porta('banheiro', 450, 212) },
    { nome: 'Porta da cozinha', x: 338, y: 90, w: 48, h: 86, ax: 362, ay: 210, acao: porta('cozinha', 36, 212) },
    { nome: 'Arco da sala', x: 514, y: 80, w: 76, h: 96, ax: 552, ay: 210, acao: porta('sala', 36, 212) },
    { nome: 'Casaco', x: 104, y: 76, w: 28, h: 98, ax: 118, async acao() {
      if (vez('casaco') === 0) await p('Um casaco azul-marinho. Pesado de chuva.', 'No bolso: dois ingressos de cinema. Um deles está rasgado ao meio, com cuidado.');
      else await p('Dois ingressos. Um rasgado ao meio. O outro nunca foi usado.');
    } },
    { nome: 'Cachecol vermelho', x: 115, y: 94, w: 10, h: 36, ax: 118, async acao() {
      if (f('mem_cachecol')) { await p('O cachecol continua ali. Você deixa.'); return; }
      await p('Um cachecol vermelho. Não é seu.', 'Você encosta o rosto nele sem pensar. Ainda cheira a alguém.');
      set('mem_cachecol');
      await G.memoria('cachecol', 'O cachecol vermelho', 'cachecol', ['Alguém enrolando isso no seu pescoço, na porta, numa noite fria.', '"Não esquece de voltar."', 'Você esqueceu?']);
    } },
    { nome: 'Quadro torto', x: 248, y: 56, w: 40, h: 36, ax: 268, async acao() {
      const n = vez('quadro');
      if (n === 0) {
        await p('Uma praia. O quadro está torto.');
        const r = await G.escolher(['Endireitar', 'Deixar']);
        if (r === 0) { Som.clique(); await p('Você o endireita. Dá um passo para trás.'); await G.esperar(900); Som.rangido(0.8); await p('Ele volta a ficar torto. Devagar, como se alguém o inclinasse com o dedo.'); }
      } else await p('Não adianta endireitar. Ele sempre volta.');
    } },
    { nome: 'Telefone com secretária', x: 402, y: 112, w: 38, h: 20, ax: 420, async acao() {
      if (f('mem_recado')) {
        await p('Fim da primeira mensagem. A segunda está corrompida: só estática e uma respiração.'); Som.estatica(0.15); await G.esperar(1400); Som.estatica(0); return;
      }
      await p('A luz da secretária eletrônica pisca: 1 mensagem nova.');
      const r = await G.escolher(['Ouvir', 'Não agora']); if (r === 1) return;
      Som.clique(); Som.estatica(0.2); await G.esperar(900); Som.estatica(0); Som.tic();
      await d('Eu não sei se você ainda escuta essas mensagens.', { quem: 'SECRETÁRIA', estilo: 'voz' });
      await d('Eu só queria que você soubesse que tentei.', { quem: 'SECRETÁRIA', estilo: 'voz' });
      await d('Não precisa responder. Eu só queria saber se você está bem.', { quem: 'SECRETÁRIA', estilo: 'voz' });
      Som.estatica(0.12); await G.esperar(800); Som.estatica(0);
      await G.memoria('recado', 'O recado na secretária', 'recado', ['A voz é calma. Cansada de um jeito que você conhece.', 'Você já ouviu isso antes. Foi você quem apertou "apagar" da última vez?']);
      set('mem_recado');
      G.novaMensagem('Você ouviu?');
    } },
    { nome: 'Console', x: 400, y: 130, w: 42, h: 44, ax: 420, async acao() {
      if (vez('console') === 0) await p('Gaveta cheia de contas. Todas pagas. Algumas ainda lacradas, com carimbo: ENTREGUE.', 'Alguém vinha pagar pelas coisas e deixar tudo em ordem.');
      else await p('Contas pagas. Ninguém cobra nada de você.');
    } },
    { nome: 'Relógio de parede', x: 456, y: 44, w: 28, h: 28, ax: 470, async acao() { await p('O ponteiro dos segundos anda para trás.', 'Ele faz um tique-taque… invertido.'); Som.tic(); } },
    { nome: 'Interruptor', x: 598, y: 108, w: 14, h: 18, ax: 604, ay: 210, async acao() {
      const on = f('luzCorredor') === undefined ? true : f('luzCorredor');
      Som.interruptor();
      if (on) {
        set('luzCorredor', false);
        if (!f('viuGarota1')) {
          set('viuGarota1'); G.aparecer('corredor', 700, 214, { dur: 5, some: 130, dir: -1 });
          await G.esperar(1600); Som.estatica(0.08); G.glitch(0.3); await G.esperar(300); Som.estatica(0);
          await p('No fundo do corredor, alguém está parada.', 'Uma silhueta. Sem rosto.');
          set('luzCorredor', true); Som.interruptor(); G.limparAparicoes(); await p('Você acende de volta. Não há ninguém.');
        }
      } else { set('luzCorredor', true); }
    } },
    { nome: 'Teclado da porta', x: 664, y: 108, w: 22, h: 30, ax: 676, ay: 210, async acao() {
      set('viuPortaTrancada');
      if (f('portaAberta')) { await p('O teclado está apagado. A porta está aberta.'); return; }
      if (!f('tentouCodigo')) await p('Um teclado numérico ao lado da porta. Quatro dígitos.');
      const c = await G.teclado(); if (c === null) return;
      set('tentouCodigo');
      if (c === CODIGO) {
        Som.ok(); set('tecladoErro', false); await G.esperar(500); Som.interruptor(); Som.rangido(2);
        await p('Um clique grave, vindo de dentro da parede.');
        set('portaAberta'); G.tremer(3); await G.esperar(900);
        await p('A porta se abre sozinha, devagar. Uma luz quente escorre pelo corredor.', 'Cheiro de bolo recém-saído do forno.');
        set('portaAberta2');
      } else {
        const e = (f('erros') || 0) + 1; set('erros', e); set('tecladoErro', true); Som.erro();
        await p('Um apito curto. Vermelho.');
        if (e === 1) { Som.eletrico(); await p('Em algum lugar do apartamento, algo cai no chão.'); }
        if (e === 2) { set('luzCorredor', false); Som.eletrico(); G.glitch(0.5); await G.esperar(1200); set('luzCorredor', true); Som.interruptor(); await p('A luz volta. Você tem a impressão de que alguém estava ali um segundo atrás.'); }
        if (e >= 3 && !f('susto1')) {
          set('susto1'); Som.sussurro(); await G.esperar(900); G.aparecer('corredor', 640, 214, { dur: 4, some: 60, dir: -1 });
          await G.esperar(1400); await G.fotoSusto(1200); G.limparAparicoes();
          await p('O que foi isso?', 'Uma casa, à noite, uma luz amarela. Você conhece esse lugar.');
        }
        await p('Pense numa hora. Uma hora que não sai da sua cabeça.');
      }
    } },
    { nome: 'Porta do fim do corredor', x: 688, y: 80, w: 64, h: 96, ax: 720, ay: 212, async acao() {
      set('viuPortaTrancada');
      if (f('portaAberta2')) { await atravessar(); return; }
      if (vez('portaT') === 0) { await p('A porta do fim do corredor. Trancada.', 'Você nunca a viu fechada antes. Ou será que sim?'); await p('Ao lado, um teclado numérico.'); }
      else { await p('Trancada. Por baixo da porta, uma luz azulada pulsa, como respiração.'); Som.pingo(); }
    } },
    { nome: 'Marcas de água no chão', x: 628, y: 214, w: 44, h: 16, ax: 650, ay: 226, ver: E => E.flags.celularPego, async acao() { await p('Marcas de pés molhados. Pequenos.', 'Vão até a porta trancada. E param.'); } },
  ],

  banheiro: [
    { nome: 'Porta', x: 426, y: 90, w: 48, h: 86, ax: 450, ay: 210, acao: porta('corredor', 212, 212) },
    { nome: 'Espelho', x: 146, y: 40, w: 88, h: 78, ax: 190, async acao() {
      const n = f('espelhoN') || 0; set('espelhoN', n + 1);
      if (n === 0) await G.rosto('cansado', ['Seu rosto.', 'Faz dias que você não o olha de verdade.', 'Olheiras fundas. O cabelo, de quem não se importa mais.']);
      else if (n === 1) { await p('O reflexo demora um pouco mais do que deveria para te acompanhar.'); Som.pingo(); }
      else if (n === 2) {
        await p('Atrás do seu reflexo, alguém.'); Som.sussurro(); G.glitch(0.5); await G.esperar(1000);
        await p('Você vira. Ninguém.'); await p('Quando olha de novo, só você. Mas você tem a impressão de ter piscado depois dele.');
      } else if (n === 3) {
        await G.rosto('medo', ['Seu reflexo está sorrindo.', 'Você não está.']);
      } else await p('Você evita olhar por muito tempo.');
    } },
    { nome: 'Bilhete no espelho', x: 208, y: 48, w: 19, h: 19, ax: 218, async acao() {
      set('viuBilhete');
      await p('Um post-it amarelo, colado no canto do espelho. A tinta está borrada, como se tivesse pingado água.');
      await d('"Eu liguei às 03:12. Você não atendeu."', { estilo: 'pensa' });
      await d('"Não precisa se explicar."', { estilo: 'pensa' });
      if (!f('piscaBanheiro')) { set('piscaBanheiro'); Som.eletrico(); G.glitch(0.3); await p('A luz do banheiro pisca uma vez.'); }
    } },
    { nome: 'Torneira', x: 176, y: 94, w: 30, h: 30, ax: 190, async acao() {
      const on = !!f('torneira'); set('torneira', !on); Som.torneira(!on);
      if (!on) { if (vez('torn') === 0) await p('A água sai gelada. Nunca esquenta.'); } else Som.clique();
    } },
    { nome: 'Pia', x: 134, y: 112, w: 112, h: 64, ax: 190, async acao() { await p('Respingos de pasta de dente no mármore. Dois tipos de respingo: um azul, um branco.'); } },
    { nome: 'Escovas de dente', x: 216, y: 86, w: 14, h: 28, ax: 222, async acao() {
      const n = vez('escova');
      if (n === 0) await p('Duas escovas no copo. A azul é sua.', 'A branca está seca. Intacta. Há quanto tempo ela está ali?');
      const r = await G.escolher(['Escovar os dentes', 'Deixar']);
      if (r === 0) {
        Som.torneira(true); await G.rosto('escova', ['Dois minutos. Parecem vinte.', 'Você olha para o próprio rosto no espelho e não reconhece o cansaço.', 'Por que tudo cansa tanto?']); Som.torneira(false);
      }
    } },
    { nome: 'Toalhas', x: 36, y: 64, w: 52, h: 48, ax: 62, async acao() {
      if (vez('toalha') === 0) await p('Duas toalhas. A azul, a sua, está seca e dura.', 'A rosa está úmida. Como se alguém tivesse acabado de usar.');
      else await p('A toalha rosa continua úmida.');
    } },
    { nome: 'Cesto de roupas', x: 88, y: 134, w: 38, h: 40, ax: 106, async acao() {
      if (f('mem_blusa')) { await p('Só roupas suas. E o espaço onde a blusa estava.'); return; }
      await p('Roupas suas. Uma pilha de dias iguais.', 'No fundo, uma blusa cor de terra. Não é sua.');
      await p('Ela está quente.'); set('mem_blusa');
      await G.memoria('blusa', 'A blusa no cesto', 'blusa', ['Alguém que ria baixo e esquecia a blusa nos seus cômodos de propósito.', '"Assim você tem que me ver de novo."', 'Você ria? Você ria, não ria?']);
    } },
    { nome: 'Chuveiro', x: 284, y: 38, w: 80, h: 122, ax: 324, async acao() {
      const n = vez('chuv');
      if (n === 0) {
        await p('A cortina está fechada.'); const r = await G.escolher(['Abrir a cortina', 'Deixar']);
        if (r === 0) { Som.pagina(); await p('Vazio. O ralo gorgoleja.', 'Fios de cabelo longos e escuros, presos na grade.'); Som.torneira(true); await G.esperar(900); Som.torneira(false); await p('O chuveiro pingou uma vez. Duas. Parou.'); }
      } else await p('O chuveiro pinga devagar. Cada gota demora mais que a anterior.');
    } },
    { nome: 'Janela', x: 376, y: 32, w: 48, h: 44, ax: 400, async acao() {
      await p('O prédio em frente. Uma única janela acesa.', 'Alguém está sentado lá, parado, olhando para cá.'); set('viuVizinho');
    } },
  ],

  cozinha: [
    { nome: 'Porta', x: 12, y: 90, w: 48, h: 86, ax: 36, ay: 210, acao: porta('corredor', 362, 212) },
    { nome: 'Geladeira', x: 70, y: 54, w: 68, h: 122, ax: 104, async acao() {
      await p('Você abre a geladeira. A luz de dentro é fraca.');
      await p('Leite vencido. Duas marmitas com etiqueta, de dias diferentes.', 'Intocadas.');
      Som.clique();
    } },
    { nome: 'Recado na geladeira', x: 82, y: 62, w: 22, h: 18, ax: 94, async acao() {
      await p('Um papel preso por um ímã.'); await d('"Come alguma coisa, por favor."', { estilo: 'pensa' }); await p('A letra é redonda. Cuidadosa. Você tem a sensação de que já leu isso dezenas de vezes.');
    } },
    { nome: 'Calendário', x: 148, y: 62, w: 32, h: 40, ax: 164, async acao() {
      await p('Os dias estão riscados com X vermelho, um por um.', 'Eles param num dia. Depois, nada. Nem mês, nem ano.'); await p('Alguém desenhou um círculo em volta de uma data, três vezes. Mas o número está borrado.');
    } },
    { nome: 'Lixeira', x: 144, y: 144, w: 30, h: 32, ax: 160, async acao() { await p('Embalagens de entrega. E uma caixinha de presente, aberta com cuidado, sem rasgar o papel.', 'Vazia.'); } },
    { nome: 'Armário alto', x: 180, y: 32, w: 134, h: 50, ax: 246, async acao() {
      if (f('xicaraLascada')) { await p('Só xícaras sem uso, alinhadas.'); return; }
      await p('Duas xícaras. Uma sem uso. A outra, lascada na borda.'); await p('Você pega a lascada sem pensar.'); set('xicaraLascada');
      await p('Sua mão sabia onde ela estava. A mão de outra pessoa segurava essa xícara diferente.', 'Mais devagar. Com as duas mãos.');
    } },
    { nome: 'Gavetas', x: 180, y: 118, w: 134, h: 56, ax: 246, async acao() {
      const n = vez('gav');
      if (n === 0) await p('Talheres para duas pessoas. Um abridor de garrafas, uma tesoura.');
      else if (n === 1) await p('Na terceira gaveta: velas de aniversário. Quatro já foram usadas, queimadas até o fim.');
      else await p('Velas usadas, talheres de duas pessoas, um dia só.');
    } },
    { nome: 'Torneira', x: 242, y: 90, w: 24, h: 22, ax: 254, async acao() { const on = !!f('torneiraCozinha'); set('torneiraCozinha', !on); Som.torneira(!on); if (!on && vez('tc') === 0) await p('A água corre. Você a deixa correr um pouco, só pelo som.'); } },
    { nome: 'Janela', x: 326, y: 44, w: 88, h: 72, ax: 370, async acao() {
      if (!f('vizinhoOlhou')) {
        await p('Na janela do prédio em frente, um homem sentado, imóvel, de costas para a luz.');
        const r = await G.escolher(['Acenar', 'Ignorar']);
        if (r === 0) {
          set('vizinhoOlhou'); await p('Você acena. Ele vira o rosto devagar.'); Som.rangido(1.2); await G.esperar(900);
          await d('Você ainda está esperando alguém?', { quem: 'VIZINHO', estilo: 'voz' });
          await p('A voz chegou como se ele estivesse do seu lado, e não do outro lado da rua.');
        }
      } else await p('O vizinho ainda está lá. Olhando para a sua janela.', 'Esperando você responder.');
    } },
    { nome: 'Xícara quente', x: 388, y: 112, w: 22, h: 20, ax: 398, async acao() {
      if (f('mem_cafe')) { await p('O café ainda está quente. Mesmo agora.'); return; }
      await p('Uma xícara na mesa. Vapor subindo.', 'Quente. Alguém acabou de sair.');
      const r = await G.escolher(['Beber um gole', 'Deixar']);
      if (r === 0) {
        await p('Café com açúcar demais. Você não toma assim. Alguém tomava.'); set('mem_cafe');
        await G.memoria('cafe', 'O café ainda quente', 'xicara', ['"Você bebe sem açúcar, que coisa triste."', 'Alguém sentada na outra cadeira, rindo de você, empurrando o açucareiro com um dedo.', 'Você achava essa mania insuportável. Agora é a coisa de que mais sente falta.']);
      }
    } },
    { nome: 'Xícara fria', x: 350, y: 112, w: 22, h: 20, ax: 362, async acao() { await p('A outra xícara está fria. Cheia. Com uma película na superfície.', 'Há quanto tempo ela espera?'); } },
    { nome: 'Mesa', x: 324, y: 128, w: 102, h: 14, ax: 376, async acao() { await p('Uma mesa para dois. As marcas de copo desenham um padrão: duas pessoas de frente uma para a outra.'); } },
    { nome: 'Cadeira (esquerda)', x: 284, y: 116, w: 26, h: 60, ax: 296, async acao() { await p('A cadeira está puxada para trás, como se alguém tivesse acabado de se levantar.'); } },
    { nome: 'Cadeira (direita)', x: 430, y: 108, w: 14, h: 68, ax: 410, ay: 218, async acao() { await p('Coberta de poeira. Só uma das cadeiras é usada nesta casa.'); } },
    { nome: 'Relógio', x: 426, y: 48, w: 28, h: 28, ax: 440, async acao() { await p('Três e doze.', 'O ponteiro dos segundos treme no mesmo lugar, sem avançar.'); set('viuRelogio'); } },
  ],

  sala: [
    { nome: 'Porta do corredor', x: 12, y: 90, w: 48, h: 86, ax: 36, ay: 210, acao: porta('corredor', 552, 212) },
    { nome: 'Livros', x: 80, y: 48, w: 70, h: 76, ax: 114, async acao() {
      const n = vez('livros');
      if (n === 0) await p('Você puxa um livro qualquer. Há anotações nas margens, em letra pequena.', '"Não leia o final sem mim."');
      else await p('Todos os livros têm anotações. Uma só letra. Só uma pessoa leu isso.');
    } },
    { nome: 'Prateleira de baixo', x: 80, y: 124, w: 70, h: 40, ax: 114, async acao() {
      if (G.tem('fita')) { await p('A prateleira de baixo. O livro oco ainda está lá, vazio.'); return; }
      await p('O último livro da prateleira de baixo é mais leve que os outros.'); await p('Oco. Dentro dele, uma fita cassete sem rótulo.'); G.dar('fita', 'Fita cassete sem rótulo');
    } },
    { nome: 'Janela', x: 186, y: 36, w: 118, h: 84, ax: 244, async acao() {
      if (vez('janS') === 0) await p('A rua inteira para você. O semáforo pisca no amarelo.', 'Faz horas que ele pisca no amarelo.');
      else await p('Ninguém atravessa a rua. Ninguém espera o sinal.');
    } },
    { nome: 'Rádio', x: 198, y: 112, w: 36, h: 22, ax: 216, async acao() {
      if (G.tem('fita') && !f('mem_fita')) {
        await p('O rádio tem uma entrada para fita.'); const r = await G.escolher(['Colocar a fita', 'Agora não']); if (r === 1) return;
        Som.clique(); await G.esperar(500); set('radio'); Som.estatica(0.18, 1800); await G.esperar(1300); Som.estatica(0.05, 1800);
        await d('Duas risadas. Uma é a sua.', { estilo: 'pensa' }); await d('A outra está borrada, como a foto.', { estilo: 'pensa' });
        await d('Você tenta lembrar do som da voz. A fita acaba antes.', { estilo: 'pensa' }); Som.estatica(0);
        set('mem_fita'); await G.memoria('fita', 'A fita sem rótulo', 'fita', ['Era um dia comum. Ninguém sabia que seria importante.', 'Vocês gravaram sem querer. Riram tanto que a fita ficou com a risada.']); set('radio', false);
        return;
      }
      const on = !!f('radio'); set('radio', !on);
      if (!on) { Som.estatica(0.12, 1400); await p('Estática. Entre os chiados, uma mulher cantarola, bem longe.'); await G.esperar(600); Som.estatica(0); set('radio', false); await p('Some. O rádio desliga sozinho.'); } else { Som.estatica(0); }
    } },
    { nome: 'Planta', x: 264, y: 96, w: 28, h: 38, ax: 278, async acao() { await p('Uma planta seca. Você nem lembra de ter comprado.'); await p('Espetado na terra, um bilhete: "Rega ela por mim."'); } },
    { nome: 'Aparador', x: 184, y: 130, w: 122, h: 46, ax: 245, async acao() {
      if (G.tem('chave') || f('chaveDada')) { await p('Pilhas, velas, garantias de eletrodomésticos. Nada mais.'); return; }
      await p('Pilhas, velas, garantias de eletrodomésticos.'); await p('No fundo da gaveta, uma chavinha prateada, pequena demais para uma porta.'); G.dar('chave', 'Chavinha prateada'); set('chaveDada');
    } },
    { nome: 'Foto da praia', x: 320, y: 50, w: 32, h: 38, ax: 336, async acao() { await p('Uma praia. Duas pegadas na areia.', 'Só uma sombra.'); } },
    { nome: 'Foto do grupo', x: 354, y: 50, w: 32, h: 38, ax: 370, async acao() {
      if (!f('fotosMudaram')) await p('Quatro pessoas posando. Você reconhece só uma: você.', 'Os outros rostos estão ali, mas você não consegue fixar o olhar neles.');
      else { await p('A foto está vazia. Só o fundo.', 'Antes tinha gente aqui. Você tem certeza.'); Som.sussurro(); }
    } },
    { nome: 'Moldura vazia', x: 388, y: 50, w: 32, h: 38, ax: 404, async acao() { await p('Uma moldura sem foto. Atrás do vidro, só uma marca de dedo.', 'Alguém tocou aqui, muitas vezes.'); } },
    { nome: 'Sofá', x: 308, y: 110, w: 124, h: 68, ax: 370, async acao() {
      if (!f('sentou')) {
        await p('O lado esquerdo do sofá está afundado e gasto. O seu.', 'O direito está intacto, mas tem uma marca: alguém se sentava ali por horas.');
        const r = await G.escolher(['Sentar', 'Deixar']); if (r === 1) return;
        set('sentou'); await G.escurecer(700); Som.silencio(true, 0.2); await G.esperar(2200);
        Som.silencio(false, 1.2); Som.sussurro(); await G.esperar(1400); G.invalidar(); set('fotosMudaram'); set('fotoQuarto', 1);
        await G.clarear(800);
        await p('Você ficou ali quanto tempo?', 'A TV mudou de canal sozinha. As fotos na parede… mudaram.');
        G.aparecer('sala', 520, 218, { dur: 7, some: 90, dir: -1 }); G.glitch(0.4); Som.estatica(0.1); await G.esperar(900); Som.estatica(0);
        await p('Alguém está ali, perto da luminária. Parada, de frente para você.');
      } else await p('Você não quer sentar de novo. Ainda sente o peso do outro lado.');
    } },
    { nome: 'Televisão', x: 434, y: 92, w: 92, h: 60, ax: 478, async acao() {
      const lig = f('tvLigada') === undefined ? true : f('tvLigada');
      if (!lig) { set('tvLigada', true); Som.interruptor(); await p('A TV acende. Sozinha, ela já tinha escolhido o canal.'); return; }
      const c = f('canal') || 0;
      const falas = ['Uma rua molhada. Você reconhece sem saber de onde.', 'Um parquinho à noite. Um balanço se mexe, sem vento.', 'Um quarto de criança. Vazio. Só o abajur aceso.', 'Uma casa, de noite. Uma luz amarela na janela do segundo andar.', 'Chuvisco. Entre o chiado, alguém sussurra: "ainda está aí?"'];
      await p(falas[c]);
      if (c === 4) { Som.estatica(0.12); G.glitch(0.4); await G.esperar(700); Som.estatica(0); }
      const r = await G.escolher(['Mudar de canal', 'Desligar', 'Deixar']);
      if (r === 0) { set('canal', (c + 1) % 5); Som.clique(); Som.estatica(0.12); await G.esperar(180); Som.estatica(0); } else if (r === 1) { set('tvLigada', false); Som.interruptor(); await p('Silêncio. Só a chuva.'); }
    } },
    { nome: 'Diário', x: 356, y: 176, w: 28, h: 12, ax: 370, ay: 214, ver: E => !E.flags.diarioPego, async acao() {
      await p('Um caderno de capa escura, em cima da mesa de centro.'); await p('É a sua letra.'); set('diarioPego'); Som.pagina(); await G.diario();
      await p('Alguém arrancou a última página.');
      if (!f('msgDiario')) { set('msgDiario'); await G.esperar(500); G.novaMensagem('Ainda está aí?'); }
    } },
    { nome: 'Mesa de centro', x: 334, y: 184, w: 74, h: 20, ax: 370, ay: 222, async acao() {
      if (vez('mesaC') === 0) await p('Uma xícara vazia, com um círculo de café seco.', 'Do lado do sofá onde ninguém se senta.');
      else await p('Duas marcas de copo. Mais uma vez.');
    } },
    { nome: 'Almofada no chão', x: 298, y: 196, w: 30, h: 14, ax: 286, ay: 228, async acao() { await p('Uma almofada no chão, junto ao sofá.', 'Alguém sentava aqui para ficar mais perto de você.'); } },
    { nome: 'Luminária', x: 560, y: 56, w: 28, h: 120, ax: 574, async acao() { const on = f('luminaria') === undefined ? true : f('luminaria'); set('luminaria', !on); Som.interruptor(); } },
    { nome: 'Relógio', x: 594, y: 46, w: 32, h: 32, ax: 610, async acao() { await p('Três e doze.', 'Você deixou de se espantar com isso.'); } },
  ],
};

// quando a luminária é a mesma de uma aparição, não deixa o diário bloqueado por bug: nada a fazer.

// ---------------------------------------------------------------- eventos
G.aoEntrar = async (sala, primeira) => {
  if (!primeira) return;
  if (sala === 'corredor') await p('O corredor é mais longo do que você lembrava.');
  if (sala === 'banheiro') await p('Cheiro de sabonete. Não é o seu.');
  if (sala === 'cozinha') await p('A cozinha cheira a café. Mas não tem ninguém.');
  if (sala === 'sala') { await p('A TV está ligada. Sempre está.'); }
};
G.aoFecharCelular = async () => {
  if (!f('celularFechou')) { set('celularFechou'); }
};

async function atravessar() {
  G.setBusy(true);
  await p('Você respira fundo.', 'Atrás da porta, a luz tem a cor de uma tarde que você já viveu.');
  await G.escurecer(1400); Som.silencio(true, 0.4); await G.esperar(1800); Som.coracao(3);
  G.flash('#fff2d0', 1);
  await G.esperar(1800); Som.silencio(false, 1.2); set('ato1fim'); G.E().fim = true; G.salvar();
  fimDoAto();
}
function fimDoAto() {
  const t = $('titulo'); t.className = 'on fim';
  const n = memoriasCount();
  t.innerHTML = `<p>ATO I</p><h1>SOLIDÃO</h1><p>Lembranças encontradas: ${n} de ${G.totalMem}</p><p class="aviso">Atrás da porta, o apartamento fica pequeno.<br>O que vem depois tem luz quente. E é pior.</p><button id="bVoltar">Voltar ao apartamento</button><p class="aviso">Ato II — NOSTALGIA em breve.</p>`;
  $('bVoltar').addEventListener('click', async () => {
    t.className = ''; t.innerHTML = ''; G.setEstado('jogo'); G.setSala('corredor', 640, 220); set('portaAberta', false); set('portaAberta2', false); await G.clarear(900);
    await p('A porta voltou a fechar sozinha. A luz azul voltou a pulsar por baixo dela.', 'Ainda restam coisas para lembrar.'); G.setBusy(false); G.salvar();
  });
}

// ---------------------------------------------------------------- abertura
async function novoJogo() {
  const t = $('titulo'); t.className = ''; t.innerHTML = '';
  G.setEstado('cena'); G.setBusy(true); G.setSala('quarto', 200, 226);
  Som.drone(0.25); Som.chuva(0.5, false);
  await G.escurecer(10); await G.esperar(1500);
  await G.rosto('cansado', ['...', 'Mais uma noite em que a chuva não deixa dormir.', 'Ou já é de manhã?', 'Você não lembra de ter deitado.']);
  G.setEstado('jogo'); await G.clarear(1400);
  await p('O quarto. As luzes da rua. A chuva na janela.', 'Tudo no lugar. Menos você.');
  G.toast('Toque para andar · toque nos objetos · ◎ mostra o que dá pra examinar');
  G.vez('introFim'); G.E().vistos.introFim = 1;
  G.setBusy(false); G.salvar();
}
async function continuar() {
  const t = $('titulo'); t.className = ''; t.innerHTML = '';
  G.carregar(); const E = G.E(); G.setSala(E.sala, E.px, E.py);
  Som.drone(0.25); G.setEstado('jogo'); G.setBusy(false); G.setSala(E.sala, E.px, E.py); E.vistos.introFim = 1;
  await G.clarear(900);
  if (E.fim && E.flags.ato1fim && !E.flags.portaVolta) { /* já terminou antes; segue livre */ }
}

function telaTitulo() {
  G.setEstado('titulo'); G.setSala('quarto', 330, 226); G.escuro(0.1); G.ambiente(0.9);
  const t = $('titulo'); t.className = 'on';
  const tem = G.temSave();
  t.innerHTML = `<p>ATO I</p><h1>THE LAST MEMORY</h1><p>um jogo de terror psicológico</p>` +
    (tem ? '<button id="bCont">Continuar</button>' : '') + '<button id="bNovo">' + (tem ? 'Novo jogo' : 'Começar') + '</button>' +
    '<p class="aviso">Jogue com fones, no escuro, com tempo.<br>Este jogo trata de solidão, luto e tristeza.<br>Se algo pesar demais, pare e converse com alguém. No Brasil, o CVV atende de graça, 24h, no 188.</p>';
  const ir = async fn => { Som.garantir(); G.escuro(0); G.ambiente(0.68); await G.escurecer(500); t.className = ''; await fn(); };
  if (tem) $('bCont').addEventListener('click', () => ir(continuar));
  $('bNovo').addEventListener('click', () => { if (tem) G.apagarSave(); ir(novoJogo); });
}

G.arrancar = () => {
  Arte.criarSprites();
  const im = new Image(); im.src = 'img/casa.jpg'; G.E().fotoCasa = im;
  const re = () => { G.E().fotoCasa = im; }; im.onload = re;
  G.iniciarLoop(); telaTitulo();
  // o nome do protagonista fica em segredo.json e só é lido no final secreto (Ato final). Nada é lido aqui.
};
window.addEventListener('load', () => { try { G.arrancar(); } catch (e) { console.error(e); document.body.insertAdjacentHTML('beforeend', '<pre style="color:#f88;position:fixed;top:0;z-index:99">' + e.stack + '</pre>'); } });
window.addEventListener('error', e => { console.error('ERRO', e.message); });
