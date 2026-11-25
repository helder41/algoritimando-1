# Teaser de 1 minuto: roteiro e prompts

O vídeo ainda **não foi gerado**: falta combinar outros pontos com o dono. Este arquivo guarda o que já foi decidido.

## Decisões

- **Duração:** 60 s.
- **Formatos:** os dois, com **foco no horizontal** (16:9, 1920×1080). O vertical (9:16, 1080×1920) é uma adaptação, com as telas gravadas no tamanho de celular.
- **Som:** só a música do jogo (`audio/musica-tema.mp3`) e os efeitos do próprio jogo. **Sem voz.**
- **Texto:** frases curtas na tela.
- **Público:** geral (visitantes, professores, famílias e crianças). O vídeo apresenta o jogo, como ele funciona, a mecânica das cartas e da montagem, a dica e o álbum. Não deve ficar técnico demais nem infantil demais.
- **Sem pessoas reais.** O lugar da "criança jogando" é de uma agente do jogo segurando um tablet, numa pseudoanimação com 4 poses. A tela do tablet sai verde, e o gameplay de verdade é colocado nela na edição.
- **Sem logos** da BTX ou da UNEB, por enquanto.
- **Gravações do jogo:** feitas com Playwright (PC 1920×1080 e celular 390×844) e montadas com ffmpeg.

## Roteiro (horizontal)

| Tempo | Imagem | Texto na tela |
|---|---|---|
| 0–4 s | A cidade (`story1`) com zoom lento | **Algoritimando**. "Um jogo para aprender algoritmos com tarefas do dia a dia" |
| 4–10 s | O mapa da central com os alfinetes dos moradores | "Os moradores da cidade precisam de ajuda" |
| 10–16 s | Agente com o tablet (poses A e B), com o chamado na tela | "Cada chamado é uma tarefa: um sanduíche, a mochila, atravessar a rua..." |
| 16–24 s | Gameplay: arrastar as cartas para os espaços | "Arraste as cartas e monte o passo a passo" |
| 24–32 s | A montagem em três chamados: o sanduíche empilha, o robô anda na grade e a limonada muda na bancada | "A montagem mostra o que acontece com a ordem que você escolheu" |
| 32–39 s | Verificar com erro, depois a dica do Robô-guia (com a agente pensando, pose C) | "Algo fora de ordem? O Robô-guia explica o porquê, sem dar a resposta" |
| 39–45 s | Os selos e "Meus aprendizados" | "8 chamados, 8 ideias: ordem, repetição, condição, ao mesmo tempo..." |
| 45–49 s | A lição e a figurinha colando no álbum | "Cada nível vira uma figurinha no álbum" |
| 49–52 s | Promoção a Agente Sênior e o certificado (agente comemorando, pose D) | "De estagiário a Agente Sênior, com certificado" |
| 52–55 s | Cartão final | **Algoritimando**. "Grátis, no navegador: celular ou PC, até sem internet". **brinqueaprenda.com.br/jogo/algoritimando** e QR code |
| 55–60 s | **Créditos** (ver abaixo) | A equipe, o orientador e a universidade |

## Tela de créditos do teaser

É a própria tela **Créditos** do jogo, gravada sem o botão "Voltar":
- **Fundo:** a cidade (`story1`) borrada, com um véu roxo, raios de luz girando atrás do título e brilhos dourados.
- **Título:** "Créditos" numa faixa dourada, que entra com um salto.
- **Equipe:** cada pessoa é um **crachá de agente**, no mesmo desenho do crachá do jogo, com as iniciais na cor dela. Os crachás caem pendurados nos cordões, um de cada vez, e balançam até parar. Todos os crachás são iguais, só muda a cor.
- **Orientador:** um selo com medalha dourada. Embaixo, a universidade, só em texto.
- **Robô-guia:** comemora no canto.
- **Tempo:** a entrada leva uns 2,5 s, e o resto fica parado para dar tempo de ler.
- **Horizontal:** os 4 crachás lado a lado.
- **Vertical:** os crachás em 2 × 2, e tudo cabe na tela 9:16 sem rolar.

**Conteúdo** (o mesmo da janela "Créditos" do jogo):

- **Paulo Helder de Santana Souza**: Idealizador e gestor do projeto Algoritimando
- **Murilo do Vale Moreira Santana**: Designer
- **Maria Eduarda Nascimento Silva**: Programadora
- **Gustavo Santos Souza**: Programador
- **Professor orientador:** Peterson Lobato
- Universidade do Estado da Bahia (UNEB), só em texto, sem logo

O **vertical** usa as mesmas cenas, na mesma ordem, com as gravações no tamanho de celular, textos maiores e a agente centralizada.

## Prompts da agente com o tablet (pseudoanimação)

**Arquivos:** `teaser-agente-a.webp` a `teaser-agente-d.webp` (não entram no jogo, só no vídeo).

**Como gerar** (para as 4 poses ficarem iguais):

1. Gere a **A** primeiro.
2. Gere a **B**, a **C** e a **D** como **edição da A**, anexando a própria A. Assim a câmera, o fundo e a personagem não mudam entre as poses.

**Anexe como referência:**
- `img/agente-afro-menina.webp`: a agente;
- `img/guide.webp`: o Robô-guia;
- `img/story1.webp`: o estilo da cidade.

Para trocar de agente, anexe outro `img/agente-*.webp` e troque a descrição dela no prompt.

**Tela verde:** o tablet precisa ficar com a tela **verde chapada** (#00FF00), sem reflexo, desenho ou brilho, porque o gameplay entra ali na edição. Se o Flow desenhar algo na tela, peça "make the tablet screen a plain flat solid bright green, nothing on it".

**Composição:** a agente e o tablet ficam no centro, com espaço livre dos lados. Assim, o mesmo quadro serve para o vídeo vertical, cortando as laterais.

**Se sair errado:**
- "remove all text";
- "same girl as the reference, same coat and headset";
- "keep the same camera and background as the attached image";
- "the tablet screen must stay plain solid green".

```
Batch: Teaser agente. Generate these images, in this order:

### teaser-agente-a.webp
Scene: A cozy, softly blurred room with a window showing the same friendly cartoon town as the attached town map, in warm daylight. In the center, the girl agent from the attached reference sits at a small wooden table, seen from the front, upper body and table visible: brown skin, two puffy black hair buns, black headset with a small microphone, long dark grey coat with lilac trim, a small green holographic screen floating next to her ear, exactly like the reference. She holds a large tablet with both hands, tilted toward the viewer at a slight angle so its screen is clearly visible and big, taking about one third of the image width. The tablet screen is a plain flat solid bright green (#00FF00), completely empty, with no reflections, no icons and no drawings. She looks at the tablet, curious, with a small smile, her right index finger raised just above the screen, about to touch it. The small round white Robô-guia robot from the reference (egg-shaped white body, black face screen with green eyes and a small smile, two small round white arms, a thin antenna with a small green light on top) floats beside her on the right, looking at the tablet.
Attached images: the agent girl (agente-afro-menina), the robot (guide) and the town map (story1).
Style: cute flat cartoon illustration for an educational game (ages 8 to 10), matching the attached town map and character references exactly: thick, smooth dark brown outlines (#3B2A2A), soft warm pastel colors, simple flat shading with small white highlights, rounded friendly shapes, expressive faces. Composition: the girl, the tablet and the robot are grouped in the center of the image, with calm background space on both sides; everything well inside the frame. Never include: text, letters, numbers, speech bubbles with words, logos, watermarks, photorealism, 3D render. Aspect ratio 16:9, landscape, 1376x768 px.

### teaser-agente-b.webp
Edit the attached image (teaser-agente-a). Keep exactly the same camera, room, window, table, tablet position, girl and robot. Change only the pose: the girl's right index finger now touches the tablet screen and slides to the side, as if dragging something across it; she is focused, with her tongue slightly out in concentration. The robot leans in, interested. The tablet screen stays a plain flat solid bright green (#00FF00), completely empty, with no reflections, no icons and no drawings.
Attached images: teaser-agente-a.
Style: cute flat cartoon illustration for an educational game (ages 8 to 10), exactly the same style as the attached image: thick, smooth dark brown outlines (#3B2A2A), soft warm pastel colors, simple flat shading with small white highlights, rounded friendly shapes, expressive faces. Never include: text, letters, numbers, speech bubbles with words, logos, watermarks, photorealism, 3D render. Aspect ratio 16:9, landscape, 1376x768 px.

### teaser-agente-c.webp
Edit the attached image (teaser-agente-a). Keep exactly the same camera, room, window, table, tablet position, girl and robot. Change only the poses: the girl holds the tablet with her left hand and rests her right hand on her chin, thinking, eyes looking up. The robot points at the tablet with one small round arm, friendly, as if giving a helpful tip, its antenna light glowing brighter green. The tablet screen stays a plain flat solid bright green (#00FF00), completely empty, with no reflections, no icons and no drawings.
Attached images: teaser-agente-a.
Style: cute flat cartoon illustration for an educational game (ages 8 to 10), exactly the same style as the attached image: thick, smooth dark brown outlines (#3B2A2A), soft warm pastel colors, simple flat shading with small white highlights, rounded friendly shapes, expressive faces. Never include: text, letters, numbers, speech bubbles with words, logos, watermarks, photorealism, 3D render. Aspect ratio 16:9, landscape, 1376x768 px.

### teaser-agente-d.webp
Edit the attached image (teaser-agente-a). Keep exactly the same camera, room, window, table, tablet position, girl and robot. Change only the poses: the girl celebrates, one arm raised high in a cheer, a big open smile, the other hand still holding the tablet toward the viewer. The robot raises both arms happily, with happy curved eyes. A few small golden stars and sparkles float around them. The tablet screen stays a plain flat solid bright green (#00FF00), completely empty, with no reflections, no icons and no drawings.
Attached images: teaser-agente-a.
Style: cute flat cartoon illustration for an educational game (ages 8 to 10), exactly the same style as the attached image: thick, smooth dark brown outlines (#3B2A2A), soft warm pastel colors, simple flat shading with small white highlights, rounded friendly shapes, expressive faces. Never include: text, letters, numbers, speech bubbles with words, logos, watermarks, photorealism, 3D render. Aspect ratio 16:9, landscape, 1376x768 px.
```

## Material pronto (em `docs/teaser/`)

- **As 4 poses da agente** (`teaser-agente-a.webp` a `teaser-agente-d.webp`), já geradas no Flow:
  - A: segurando o tablet;
  - B: arrastando;
  - C: pensando;
  - D: comemorando.

  A tela verde está exatamente no mesmo lugar nas quatro, então o gameplay entra sempre no mesmo ponto.
- **O QR code** (`qr-algoritimando.png`), que leva para **https://brinqueaprenda.com.br/jogo/algoritimando**. Ele foi conferido lendo a imagem reduzida.
- **A tela de créditos:** é a própria tela do jogo (botão "Créditos" do menu).

## O vídeo (gerado em 25/11/2026)

- **Frases:**
  - abertura: "As máquinas dependem dos detalhes. Até para fazer um sanduíche.";
  - fechamento: "Aprender a pensar, um passo de cada vez."
- **Arquivos** (entregues ao dono, fora do repositório, ~22 MB cada):
  - `algoritimando-teaser-horizontal.mp4`: 1920×1080, 30 qps, 60 s;
  - `algoritimando-teaser-vertical.mp4`: 1080×1920, 30 qps, 60 s.
- **Cenas, na ordem:**
  1. abertura;
  2. título;
  3. mapa;
  4. agente com o tablet (mochila);
  5. sanduíche;
  6. robô;
  7. limonada;
  8. agente pensando;
  9. erro e dica;
  10. lição e álbum;
  11. Meus aprendizados;
  12. agente comemorando;
  13. promoção a Agente Sênior;
  14. certificado, abrindo com a festa;
  15. cartão final (frase, site e QR);
  16. créditos.
- **Som:** a música do jogo (a 50%) e os efeitos sonoros do próprio jogo, nos instantes em que o jogo os toca: a carta entrando, o erro, a dica, o acerto, a vitória, a figurinha, a promoção e o certificado.
  - O `grava.js` anota o nome e o instante de cada som (`sons.json` em cada cena), e o `monta.py` mistura os arquivos de `audio/efeitos/` nesses instantes.
  - O clique da troca de tela fica de fora.
  - Os volumes seguem a proporção do jogo e ficam no topo da seção "efeitos sonoros" do `monta.py`.
- **Versão atual:** refeito em 25/11/2026 com os sons novos, os crachás iguais nos créditos e o certificado animado.
- **Na vertical:** as cartas entram por toque (carta e depois espaço, rolando a tela), como no celular.

### Como refazer

Os scripts ficam em `ferramentas/teaser/` e precisam de Playwright com Chromium, ffmpeg e Python com Pillow.

```
cd ferramentas/teaser
node grava.js h          # grava as cenas em 1920x1080 (cenas-h/)
node grava.js v          # grava as cenas em 1080x1920 (cenas-v/)
python3 monta.py h       # monta saida-h/algoritimando-teaser-horizontal.mp4
python3 monta.py v       # monta saida-v/algoritimando-teaser-vertical.mp4
```

- **O que fica em cada arquivo:**
  - as cenas e as ações, em `grava.js`;
  - as durações, as legendas e os recortes, em `monta.py` (função `roteiro`);
  - a abertura, o título e o cartão final, em `cartoes.html`.
- **Refazer só algumas cenas:** dá para passar os nomes depois da orientação (ex.: `node grava.js h sanduiche` e `python3 monta.py h sanduiche`).
- **A vertical** usa a gravação horizontal da mochila dentro do tablet, então `cenas-h/` precisa existir.
- **O que não vai para o repositório** (no `.gitignore`): as pastas `cenas-*` e `saida-*`.
