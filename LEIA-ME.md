# THE LAST MEMORY — Ato I: Solidão

Jogo de terror psicológico, point and click, em pixel art. Tudo (arte, som, história) é gerado por código — nenhum arquivo de áudio ou imagem externa, só a sua foto da casa (`www/img/casa.jpg`).

## Como virar APK (só pelo site do GitHub)

1. Crie um repositório novo no GitHub (pode ser privado).
2. Envie **todo o conteúdo desta pasta** (Add file → Upload files, arrastando as pastas).
   - ⚠️ A pasta oculta `.github` às vezes não sobe pelo arrastar. Se depois de enviar não existir `.github/workflows/apk.yml` no repositório:
     Add file → Create new file → digite `.github/workflows/apk.yml` como nome → cole o conteúdo do arquivo `apk.yml` desta pasta (está em `.github/workflows/`) → Commit.
3. Abra a aba **Actions**. O workflow "Compilar APK" roda sozinho (leva uns 5–8 min). Se não rodar: Actions → Compilar APK → Run workflow.
4. Quando ficar verde, baixe o APK de um destes jeitos:
   - Repositório → **Releases → "APK mais recente"** → `TheLastMemory.apk` (o mais fácil, dá pra baixar direto no celular), ou
   - Actions → clique na execução → **Artifacts → TheLastMemory-APK** (vem num .zip).
5. No celular: abra o APK e permita "instalar apps desconhecidos" se pedir.

Se o Actions ficar vermelho, abra o passo que falhou, copie o erro e me mande.

## Testar rápido no computador
Abra `www/index.html` no Chrome. Funciona igual (mouse = toque).

## Como jogar
- Toque no chão para andar (segure e arraste para seguir o dedo).
- Toque num objeto para andar até ele e examinar.
- `◎` mostra por 3 segundos onde há coisas para examinar.
- `▯` celular e `▤` diário (aparecem quando você os pega). `☰` pausa: lembranças, itens, som e **"Estou preso"** (dica).

## Onde mexer
- `www/js/ato1.js` — todo o texto, objetos, mensagens do celular, diário, finais do Ato I.
- `www/js/salas.js` — desenho de cada cômodo.
- `www/js/arte.js` — sprites, rostos em close, canais da TV.
- `www/js/audio.js` — sons.
- `www/segredo.json` — reservado ao nome do protagonista. O Ato I não lê nada daqui.

## Regras do projeto respeitadas
- Nome do protagonista: não existe em nenhum arquivo do jogo.
- Nome interno da garota: não existe no código nem na interface. Ela é só "a silhueta sem rosto".
