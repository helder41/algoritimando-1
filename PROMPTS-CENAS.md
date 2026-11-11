# Prompts das cenas dos chamados

13 imagens para `img/`: três para cada chamado novo (Lavar as mãos, Atravessar a rua, Fazer uma limonada e Escovar os dentes) e o retrato da menina de Escovar os dentes. **Já existem:** `level5`, `win5`, `pic6`, `level6`, `win6` e o retrato do menino da rua (`who5`). **Faltam 8:** `pic5`, `pic7`, `level7`, `win7`, `who6`, `pic8`, `level8` e `win8`. Sem elas o jogo funciona, mas mostra um quadro tracejado no cartão do chamado e um fundo liso nas telas do nível e da lição. No fim do arquivo há também versões novas das ilustrações dos quatro chamados originais (`pic1` a `pic4`), no mesmo padrão de mini-cena.

| Imagem | Onde aparece | Modelo que já existe | Campo em `js/situacoes.js` |
|---|---|---|---|
| ilustração do chamado | cartão do chamado, no painel do lugar | `img/pic3.webp` (a mochila) | `cena` |
| fundo do nível | tela do nível, atrás do tabuleiro | `img/level3.webp` | `fundo` |
| fundo da lição | tela de "Parabéns", atrás do painel | `img/win3.webp` | `fundoConclusao` |

## Antes de começar

- **Gere um chamado por vez, na mesma conversa**, sempre anexando as referências indicadas (estão no repositório). Gere primeiro as cartas do chamado (`PROMPTS-CARTAS.md`): os objetos daqui precisam ser os mesmos.
- **A ilustração do chamado vem primeiro.** Quando ela ficar boa, anexe-a ao gerar o fundo do nível: é ela que aparece dentro do balão de pensamento.
- **Nos dois fundos, o lado direito fica vazio e desfocado de propósito.** No PC o tabuleiro e o painel da lição são desenhados por cima dele. Se o gerador puser personagem ou objeto forte à direita, peça de novo.
- **Nada de texto** em nenhuma das imagens.
- **Personagens:** Lavar as mãos é do menino de avental (`img/cliente0.webp`), na Casa, e os fundos dele já estão prontos. Escovar os dentes é da menina de pijama da Casa azul (`img/who6.webp`, a gerar primeiro). **Atravessar a rua e Fazer uma limonada são do menino de moletom amarelo** do `img/level6.webp` (pele morena, cabelo cacheado castanho-escuro, moletom amarelo, bermuda azul-marinho, tênis azul). Na rua ele usa a mochila azul; na cozinha, não.

**A ilustração do chamado (`picN`)** é a imagem do cartão, no painel do lugar. Nos chamados novos ela é uma **mini-cena do pedido**, não um objeto solto:

- **Um pedacinho do lugar, como uma ilha:** um quadrado de chão visto de cima e de lado (três quartos), com no máximo uma parede baixa atrás. Tudo acontece em cima dele. É o mesmo jeito das cartas da rua com a calçada, que ficaram boas.
- **O cliente grande, fazendo o pedido:** mãos sujas, calor e copo vazio, sono na hora de escovar, a dúvida diante do semáforo. Ao lado, o Robô-guia oferecendo ajuda.
- **Três ou quatro objetos grandes**, os mesmos das cartas. Nada de detalhe miúdo: o cartão mostra a imagem com uns 190 px.
- **Fundo creme liso** (#FDF3E6) em volta da ilha, igual ao cartão.
- **Anexe** o retrato ou o fundo do personagem, o `img/guide.webp`, as cartas do chamado e, como modelo de estilo, `img/passos/rua-01.webp` e `img/passos/rua-05.webp`.
- Gere **três ou quatro versões** e escolha olhando a imagem bem pequena.
- Se sair errado: "make the characters bigger", "only one floor tile, nothing outside it", "fewer objects, bigger shapes", "flat cream background", "same boy as the reference", "the robot must be the same as the reference".

**Se sair errado:** "keep the right side empty and blurred", "move the characters to the left", "remove all text", "same boy as the level6 reference", "simpler, fewer objects".

## Depois de gerar

Estas imagens **não entram sozinhas** no jogo, ao contrário das cartas e das lições: é preciso salvar o arquivo com o nome indicado e acrescentar o campo no chamado, em `js/situacoes.js`. Para Lavar as mãos, por exemplo:

```js
cliente: 'img/who1.webp',
cena: 'img/pic5.webp',
fundo: 'img/level5.webp',
fundoConclusao: 'img/win5.webp',
```

Se preferir, mande as imagens no chat com o nome de cada uma: a conversão para WebP, o ajuste de tamanho e esses campos são feitos na hora de aplicar.

## Lavar as mãos (Banheiro)

**Arquivos:** `pic5.webp`, `level5.webp`, `win5.webp`. **Prontos:** `level5` e `win5`. **Falta:** `pic5`.

**Anexe como referência:** `img/pic3.webp` (estilo da ilustração do chamado), `img/level3.webp` e `img/win3.webp` (composição dos fundos), `img/cliente0.webp` (o menino), `img/guide.webp` (Robô-guia) e, quando existirem, as cartas `img/passos/maos-01.webp` a `maos-07.webp`.

**Consistência:** a mesma pia branca com torneira prateada de alavanca, o mesmo sabonete em barra verde-claro e a mesma toalha azul-clara das cartas.

### `pic5.webp` — ilustração do chamado

```
Subject: The moment the call arrives: a bathroom diorama (a tile of pale cream floor with a low wall of white tiles behind). On it stands the white pedestal sink with the silver lever tap and the pale green soap bar from the attached hand-washing cards, and a light blue towel hanging on a small rail on the wall. The curly-haired boy from the reference (apron, striped shirt) stands in front of the sink holding up his two hands, covered in big brown mud smudges, looking at them with a funny 'oops' face (eyebrows up, small open mouth). A few drops of mud fall on the floor. The small round white Robô-guia robot with a black face screen, green eyes and a small green antenna light (from the reference) floats next to him, holding the soap bar out to him with one hand and smiling. Two or three soap bubbles float between them.
Attached images: the boy (cliente0), the robot (guide), the cards maos-01 and maos-03 (sink, tap, soap) and the style references (the street cards rua-01 and rua-05).
Style: cute flat cartoon illustration for a children's educational game (ages 8 to 10), matching the attached character and card references exactly: thick, smooth dark brown outlines (#3B2A2A), soft warm pastel colors, simple flat shading with small white highlights, rounded friendly shapes, expressive faces. Composition (very important): a small floating diorama, like a thick square tile of floor cut out of the place and seen in a three-quarter view from slightly above, with only one low wall piece at the back where needed. Everything sits on this tile: one or two characters and three or four big, clear objects. The diorama is centered and fills about 90% of the image width, with a thin even margin. The main character is big (about half the height of the image) and is clearly doing something. A soft grey oval shadow under the tile. Background around the diorama: flat solid cream (#FDF3E6) from edge to edge, no sky, no scenery outside the tile, no frame, no border. Readability: it must be understandable at 190 px wide: big shapes, strong silhouettes, one clear action, no tiny details. Never include: text, letters, numbers, speech bubbles with words, logos, watermarks, photorealism, 3D render. Aspect ratio 16:10, landscape, 1240x784 px.
```

### `level5.webp` — fundo do nível

```
Scene: A bright, tidy home bathroom. On the left, the curly-haired boy from the reference (apron, striped shirt) stands in front of a white sink with a silver lever tap, showing his two hands, which are a little dirty with small brown smudges, and looking at them with a curious smile. Next to him floats the small round white Robô-guia robot with a black face screen, green eyes and a small green antenna light (from the reference). Above the boy, a soft cream thought bubble contains the sink with the soap bar and bubbles from the attached illustration. On the wall near the sink hangs a light blue towel. The rest of the bathroom (pale tiles, a window, a bathtub) continues to the right, soft and blurred.
Attached images: the chamado illustration (pic5), composition reference (level3), the boy, the robot.
Style: cute flat cartoon illustration for a children's educational game (ages 8 to 10), matching the attached references exactly: thick dark brown outlines (#3B2A2A) on the characters and on the objects near them, soft warm pastel colors, simple flat shading, rounded friendly shapes. Layout (very important): the characters, the thought bubble and every sharp detail stay inside the LEFT 40% of the image. The RIGHT 60% is the same room continuing, but soft, pale and heavily blurred, with no characters, no strong shapes and no strong colors: the game draws its board and cards on top of that area. Lighting: warm soft daylight coming from the left. Never include: text, letters, numbers, logos, watermarks, photorealism, 3D render. Aspect ratio 16:9, landscape, 1376x768 px.
```

### `win5.webp` — fundo da lição

```
Scene: The same bright home bathroom. On the left, the curly-haired boy from the reference (apron, striped shirt) proudly holds up his two clean hands with small sparkles around them, smiling with his mouth open, the light blue towel over his shoulder. Next to him the small round white Robô-guia robot with a black face screen, green eyes and a small green antenna light (from the reference) cheers with its arms up and happy curved eyes. Above them, a round green badge with a white check mark and a shiny gold star with small sparkles and a few pieces of pastel confetti. The white sink with the closed tap is behind them. The rest of the bathroom continues to the right, soft and blurred.
Attached images: composition reference (win3), the boy, the robot.
Style: cute flat cartoon illustration for a children's educational game (ages 8 to 10), matching the attached references exactly: thick dark brown outlines (#3B2A2A) on the characters and on the objects near them, soft warm pastel colors, simple flat shading, rounded friendly shapes. Layout (very important): the characters, the green check, the star and every sharp detail stay inside the LEFT 55% of the image, in its upper two thirds. The RIGHT 45% is the same place continuing, but soft, pale and heavily blurred, with no characters and no strong shapes: the game draws the lesson panel on top of that area. Mood: happy, a small celebration. Never include: text, letters, numbers, logos, watermarks, photorealism, 3D render. Aspect ratio 16:9, landscape, 1600x893 px.
```

## Atravessar a rua (Caminho da escola)

**Arquivos:** `pic6.webp`, `level6.webp`, `win6.webp`. **Prontos:** `pic6`, `level6` e `win6`. Os prompts abaixo ficam só como registro.

**Anexe como referência:** `img/pic3.webp` (estilo da ilustração do chamado), `img/level3.webp` e `img/win3.webp` (composição dos fundos), `img/level6.webp` (o menino de moletom amarelo, a rua, o semáforo e a faixa), `img/guide.webp` (Robô-guia), `img/story1.webp` (as ruas e casas da cidade) e, quando existirem, as cartas `img/passos/rua-01.webp` a `rua-06.webp`.

**Consistência:** a mesma faixa de pedestres (listras brancas no asfalto cinza) e o mesmo semáforo de pedestres do `level6.webp` e das cartas (caixa escura com três luzes: vermelha em cima, amarela no meio e o boneco verde andando embaixo). O menino de moletom amarelo com a mochila azul nas costas.

**Cuidado com o tom:** o menino está sempre na calçada ou já do outro lado. Nenhum carro perto dela, nenhum susto.

### `pic6.webp` — ilustração do chamado

Já existe uma versão (só o semáforo e a faixa). Este prompt é a versão nova, com o menino e o Robô-guia, no mesmo padrão das outras três. Se ela ficar boa, substitui a atual.

```
Subject: The moment the call arrives: a street-corner diorama (a tile of light grey tiled sidewalk with a curb, and in front of it a piece of dark grey asphalt with a white zebra crossing). On the corner stands the pedestrian traffic light from the reference (dark grey box on a grey pole, three round lamps), with only the TOP lamp lit bright red with a standing figure. The boy from the reference (brown skin, curly dark brown hair, yellow hoodie, blue backpack, navy shorts, blue sneakers) stands still on the sidewalk right at the edge of the crossing, both feet together, looking up at the red light with a thoughtful face and one finger on his chin. The small round white Robô-guia robot with a black face screen, green eyes and a small green antenna light (from the reference) floats beside him, pointing up at the traffic light. No cars anywhere.
Attached images: the level background (level6: the boy, the traffic light, the crossing), the robot (guide) and the style references (the street cards rua-01 and rua-05).
Style: cute flat cartoon illustration for a children's educational game (ages 8 to 10), matching the attached character and card references exactly: thick, smooth dark brown outlines (#3B2A2A), soft warm pastel colors, simple flat shading with small white highlights, rounded friendly shapes, expressive faces. Composition (very important): a small floating diorama, like a thick square tile of floor cut out of the place and seen in a three-quarter view from slightly above, with only one low wall piece at the back where needed. Everything sits on this tile: one or two characters and three or four big, clear objects. The diorama is centered and fills about 90% of the image width, with a thin even margin. The main character is big (about half the height of the image) and is clearly doing something. A soft grey oval shadow under the tile. Background around the diorama: flat solid cream (#FDF3E6) from edge to edge, no sky, no scenery outside the tile, no frame, no border. Readability: it must be understandable at 190 px wide: big shapes, strong silhouettes, one clear action, no tiny details. Never include: text, letters, numbers, speech bubbles with words, logos, watermarks, photorealism, 3D render. Aspect ratio 16:10, landscape, 1240x784 px.
```

### `level6.webp` — fundo do nível (já pronto)

Já existe (o menino de moletom amarelo, o semáforo e a faixa). Não precisa gerar: ele é a referência das outras imagens da rua e da limonada.

### `win6.webp` — fundo da lição

```
Scene: The same calm street corner as the attached level background (light grey tiled sidewalk, white zebra stripes on dark grey asphalt, the pedestrian traffic light, a soft pastel city skyline, green trees and a bus stop far behind), now seen from the other sidewalk: the boy from the attached level background (brown skin, curly dark brown hair, yellow hoodie, navy shorts, blue sneakers, blue backpack on his back) has already crossed and stands safely on the sidewalk, giving a thumbs up with a big smile. Next to her the small round white Robô-guia robot with a black face screen, green eyes and a small green antenna light (from the reference) cheers with its arms up and happy curved eyes. Above them, a round green badge with a white check mark and a shiny gold star with small sparkles and a few pieces of pastel confetti. Behind them, the zebra crossing he just used and the pedestrian traffic light with the green walking figure lit. The street and the houses continue to the right, soft and blurred, with no cars.
Attached images: composition reference (win3), the level background (the boy, the street, the traffic light), the robot.
Style: cute flat cartoon illustration for a children's educational game (ages 8 to 10), matching the attached references exactly: thick dark brown outlines (#3B2A2A) on the characters and on the objects near them, soft warm pastel colors, simple flat shading, rounded friendly shapes. Layout (very important): the characters, the green check, the star and every sharp detail stay inside the LEFT 55% of the image, in its upper two thirds. The RIGHT 45% is the same place continuing, but soft, pale and heavily blurred, with no characters and no strong shapes: the game draws the lesson panel on top of that area. Mood: happy, a small celebration. Never include: text, letters, numbers, logos, watermarks, photorealism, 3D render. Aspect ratio 16:9, landscape, 1600x893 px.
```

## Fazer uma limonada (Cozinha)

**Arquivos:** `pic7.webp`, `level7.webp`, `win7.webp`.

**Anexe como referência:** `img/pic3.webp` (estilo da ilustração do chamado), `img/level1.webp` e `img/win1.webp` (a mesma cozinha do sanduíche, e a composição dos fundos), `img/level6.webp` (o menino de moletom amarelo; só o menino, a rua não entra), `img/guide.webp` (Robô-guia) e, quando existirem, as cartas `img/passos/limonada-01.webp` a `limonada-07.webp`.

**Consistência:** a MESMA cozinha do sanduíche (bancada de madeira, janela, geladeira lilás). Os mesmos limões verdes, a mesma jarra de vidro com alça e o mesmo copo das cartas. O menino de moletom amarelo do `level6.webp`, sem a mochila, porque está em casa.

### `pic7.webp` — ilustração do chamado

```
Subject: The moment the call arrives: a kitchen diorama (a tile of warm wooden floor with a low wooden kitchen counter on it). The boy from the reference (brown skin, curly dark brown hair, yellow hoodie, navy shorts, blue sneakers, no backpack) stands at the counter, hot and thirsty: one hand fanning his face, a small drop of sweat on his forehead, the other hand holding up an empty drinking glass, with a hopeful smile. A small round cartoon sun with soft rays floats above him (no face). On the counter: three whole green limes, an empty clear glass pitcher with a handle and a glass citrus juicer. The small round white Robô-guia robot with a black face screen, green eyes and a small green antenna light (from the reference) floats beside the counter, happily holding up one green lime.
Attached images: the boy (the level background level6, for his look only; do not copy the street), the robot (guide), the lemonade cards if they exist (limes, pitcher, juicer) and the style references (the street cards rua-01 and rua-05).
Style: cute flat cartoon illustration for a children's educational game (ages 8 to 10), matching the attached character and card references exactly: thick, smooth dark brown outlines (#3B2A2A), soft warm pastel colors, simple flat shading with small white highlights, rounded friendly shapes, expressive faces. Composition (very important): a small floating diorama, like a thick square tile of floor cut out of the place and seen in a three-quarter view from slightly above, with only one low wall piece at the back where needed. Everything sits on this tile: one or two characters and three or four big, clear objects. The diorama is centered and fills about 90% of the image width, with a thin even margin. The main character is big (about half the height of the image) and is clearly doing something. A soft grey oval shadow under the tile. Background around the diorama: flat solid cream (#FDF3E6) from edge to edge, no sky, no scenery outside the tile, no frame, no border. Readability: it must be understandable at 190 px wide: big shapes, strong silhouettes, one clear action, no tiny details. Never include: text, letters, numbers, speech bubbles with words, logos, watermarks, photorealism, 3D render. Aspect ratio 16:10, landscape, 1240x784 px.
```

### `level7.webp` — fundo do nível

```
Scene: The same warm home kitchen as in the kitchen reference (wooden counter, window, lilac fridge). On the left, the boy from the attached level background (brown skin, curly dark brown hair, yellow hoodie, navy shorts, blue sneakers; no backpack, he is at home) stands at the counter looking thirsty and hopeful, holding an empty glass. On the counter in front of him are three whole green limes and an empty clear glass jug. Next to him floats the small round white Robô-guia robot with a black face screen, green eyes and a small green antenna light (from the reference). Above the boy, a soft cream thought bubble contains the jug of lemonade from the attached illustration. The rest of the kitchen continues to the right, soft and blurred.
Attached images: the chamado illustration (pic7), the kitchen and composition reference (level1), the level background (only for the boy's look; do not copy the street), the robot.
Style: cute flat cartoon illustration for a children's educational game (ages 8 to 10), matching the attached references exactly: thick dark brown outlines (#3B2A2A) on the characters and on the objects near them, soft warm pastel colors, simple flat shading, rounded friendly shapes. Layout (very important): the characters, the thought bubble and every sharp detail stay inside the LEFT 40% of the image. The RIGHT 60% is the same room continuing, but soft, pale and heavily blurred, with no characters, no strong shapes and no strong colors: the game draws its board and cards on top of that area. Lighting: warm soft daylight coming from the left. Never include: text, letters, numbers, logos, watermarks, photorealism, 3D render. Aspect ratio 16:9, landscape, 1376x768 px.
```

### `win7.webp` — fundo da lição

```
Scene: The same warm home kitchen as in the kitchen reference. On the left, the boy from the attached level background (brown skin, curly dark brown hair, yellow hoodie, navy shorts, blue sneakers; no backpack, he is at home) happily raises a glass of pale yellow-green lemonade with an ice cube and a lime slice on the rim, smiling with his mouth open. Next to him the small round white Robô-guia robot with a black face screen, green eyes and a small green antenna light (from the reference) cheers with its arms up and happy curved eyes. Above them, a round green badge with a white check mark and a shiny gold star with small sparkles and a few pieces of pastel confetti. On the counter behind them, the glass jug of lemonade, half full. The rest of the kitchen continues to the right, soft and blurred.
Attached images: the kitchen and composition reference (win1), the level background (only for the boy's look; do not copy the street), the robot.
Style: cute flat cartoon illustration for a children's educational game (ages 8 to 10), matching the attached references exactly: thick dark brown outlines (#3B2A2A) on the characters and on the objects near them, soft warm pastel colors, simple flat shading, rounded friendly shapes. Layout (very important): the characters, the green check, the star and every sharp detail stay inside the LEFT 55% of the image, in its upper two thirds. The RIGHT 45% is the same place continuing, but soft, pale and heavily blurred, with no characters and no strong shapes: the game draws the lesson panel on top of that area. Mood: happy, a small celebration. Never include: text, letters, numbers, logos, watermarks, photorealism, 3D render. Aspect ratio 16:9, landscape, 1600x893 px.
```

## Escovar os dentes (Banheiro da Casa azul)

**Arquivos:** `who6.webp` (retrato da menina), `pic8.webp`, `level8.webp`, `win8.webp`.

**Ordem:** primeiro o retrato (ele vira a referência de tudo), depois as cartas (`PROMPTS-CARTAS.md`), depois as três imagens daqui.

**Anexe como referência:** `img/who1.webp` (enquadramento e estilo do retrato), `img/pic3.webp` (estilo da ilustração do chamado), `img/level5.webp` e `img/win5.webp` (composição dos fundos de banheiro), `img/guide.webp` (Robô-guia) e, quando existirem, `img/who6.webp` e as cartas `img/passos/dentes-01.webp` a `dentes-08.webp`.

**Personagem:** uma menina nova, diferente dos outros clientes: uns 8 anos, pele clara com sardinhas, cabelo castanho-avermelhado ondulado em duas marias-chiquinhas baixas com elásticos azul-claros, pijama azul-claro com estrelinhas amarelas e chinelos brancos. É hora de dormir: a luz é de abajur, quentinha.

**Consistência:** a mesma escova branca de cabo azul-claro, o mesmo tubo de pasta de tampa azul-clara e o mesmo copo amarelo-claro das cartas. O banheiro tem azulejos azul-claros, para não se confundir com o banheiro de Lavar as mãos.

### `who6.webp` — retrato da menina (cliente da Casa azul)

```
Subject: Head-and-shoulders portrait of a new girl character (about 8 years old, light skin with a few freckles, wavy reddish-brown hair in two low pigtails tied with light blue hair ties, light blue pajamas with small yellow stars, white slippers), facing forward with a friendly closed-mouth smile and rosy cheeks, framed exactly like the attached portrait reference (the face fills the frame, the top of the hair almost touches the top edge, the shoulders cut at the bottom).
Attached images: portrait reference (who1) for framing and style.
Style: cute flat cartoon illustration for a children's educational game (ages 8 to 10), matching the attached portrait exactly: thick dark brown outlines (#3B2A2A), soft warm pastel colors, simple flat shading, big friendly eyes. Background: a soft blurred light blue tiled bathroom wall. Never include: text, letters, numbers, logos, watermarks, photorealism, 3D render. Aspect ratio 1:1, square, 1024x1024 px.
```

### `pic8.webp` — ilustração do chamado

```
Subject: The moment the call arrives: a bedtime bathroom diorama (a tile of light blue tiled floor with a low light blue tiled wall behind, with a small round window showing a dark blue night sky and a moon). On it stands a small white sink with a pale yellow plastic cup holding a white toothbrush with a light blue handle and a small white toothpaste tube with a light blue cap. The girl from the attached portrait (about 8 years old, light skin with a few freckles, wavy reddish-brown hair in two low pigtails with light blue hair ties, light blue pajamas with small yellow stars, white slippers) stands at the sink in a big sleepy yawn, one hand rubbing her eye and the other hugging a small teddy bear. The small round white Robô-guia robot with a black face screen, green eyes and a small green antenna light (from the reference) floats next to her, holding the toothbrush out to her with a cheerful face. A few soft stars float near the window.
Attached images: the girl's portrait (who6), the robot (guide), the cards dentes-01 to dentes-03 if they exist (toothbrush, cup, tube) and the style references (the street cards rua-01 and rua-05).
Style: cute flat cartoon illustration for a children's educational game (ages 8 to 10), matching the attached character and card references exactly: thick, smooth dark brown outlines (#3B2A2A), soft warm pastel colors, simple flat shading with small white highlights, rounded friendly shapes, expressive faces. Composition (very important): a small floating diorama, like a thick square tile of floor cut out of the place and seen in a three-quarter view from slightly above, with only one low wall piece at the back where needed. Everything sits on this tile: one or two characters and three or four big, clear objects. The diorama is centered and fills about 90% of the image width, with a thin even margin. The main character is big (about half the height of the image) and is clearly doing something. A soft grey oval shadow under the tile. Background around the diorama: flat solid cream (#FDF3E6) from edge to edge, no sky, no scenery outside the tile, no frame, no border. Readability: it must be understandable at 190 px wide: big shapes, strong silhouettes, one clear action, no tiny details. Never include: text, letters, numbers, speech bubbles with words, logos, watermarks, photorealism, 3D render. Aspect ratio 16:10, landscape, 1240x784 px.
```

### `level8.webp` — fundo do nível

```
Scene: A cozy home bathroom at bedtime, with light blue tiles and a small window showing a dark blue night sky with a moon. On the left, the girl from the attached portrait (about 8 years old, light skin with a few freckles, wavy reddish-brown hair in two low pigtails tied with light blue hair ties, light blue pajamas with small yellow stars, white slippers) stands in front of a white sink holding the white toothbrush with a light blue handle, looking at it with a sleepy, curious smile. On the sink: the pale yellow cup and the white toothpaste tube with its light blue cap closed. Next to her floats the small round white Robô-guia robot with a black face screen, green eyes and a green antenna (from the reference). Above the girl, a soft cream thought bubble contains the toothbrush, cup and tube from the attached illustration. The rest of the bathroom (tiles, a towel rail, a bathtub) continues to the right, soft and blurred.
Attached images: the chamado illustration (pic8), composition reference (level5), the girl's portrait, the robot.
Style: cute flat cartoon illustration for a children's educational game (ages 8 to 10), matching the attached references exactly: thick dark brown outlines (#3B2A2A) on the characters and on the objects near them, soft warm pastel colors, simple flat shading, rounded friendly shapes. Layout (very important): the characters, the thought bubble and every sharp detail stay inside the LEFT 40% of the image. The RIGHT 60% is the same room continuing, but soft, pale and heavily blurred, with no characters, no strong shapes and no strong colors: the game draws its board and cards on top of that area. Lighting: warm soft evening lamp light coming from the left. Never include: text, letters, numbers, logos, watermarks, photorealism, 3D render. Aspect ratio 16:9, landscape, 1376x768 px.
```

### `win8.webp` — fundo da lição

```
Scene: The same cozy bedtime bathroom with light blue tiles. On the left, the girl from the attached portrait (about 8 years old, light skin with a few freckles, wavy reddish-brown hair in two low pigtails tied with light blue hair ties, light blue pajamas with small yellow stars, white slippers) gives a big smile showing clean shiny teeth with small sparkles, holding a small teddy bear, ready for bed. Behind her, the sink is tidy: the clean toothbrush standing in the pale yellow cup and the toothpaste tube closed. Next to her the small round white Robô-guia robot with a black face screen, green eyes and a green antenna (from the reference) cheers with its arms up and happy curved eyes. Above them, a round green badge with a white check mark and a shiny gold star with small sparkles and a few pieces of pastel confetti. The rest of the bathroom continues to the right, soft and blurred.
Attached images: composition reference (win5), the girl's portrait, the robot.
Style: cute flat cartoon illustration for a children's educational game (ages 8 to 10), matching the attached references exactly: thick dark brown outlines (#3B2A2A) on the characters and on the objects near them, soft warm pastel colors, simple flat shading, rounded friendly shapes. Layout (very important): the characters, the green check, the star and every sharp detail stay inside the LEFT 55% of the image, in its upper two thirds. The RIGHT 45% is the same place continuing, but soft, pale and heavily blurred, with no characters and no strong shapes: the game draws the lesson panel on top of that area. Mood: happy, a small celebration. Never include: text, letters, numbers, logos, watermarks, photorealism, 3D render. Aspect ratio 16:9, landscape, 1600x893 px.
```

## Ilustrações dos quatro chamados originais (versão nova)

As imagens de hoje (`pic1` a `pic4`) são um objeto sozinho (sanduíche, caixa, mochila, favo). Estas versões seguem o padrão das mini-cenas dos chamados novos, para todos os cartões ficarem iguais. Salve com o **mesmo nome**: a imagem troca sozinha, sem mexer no código.

**Dica:** gere as quatro na mesma conversa, uma depois da outra, e anexe a primeira que ficar boa nas seguintes. Assim a ilha de chão sai do mesmo tamanho e do mesmo ângulo em todas.

### `pic1.webp` — Fazer um sanduíche (Casa)

**Anexe:** `img/cliente0.webp` (o menino de avental), `img/guide.webp`, as cartas `img/passos/sanduiche-01.webp` a `sanduiche-04.webp` (pão, queijo, presunto) e, como modelo de estilo, `img/passos/rua-01.webp` e `img/passos/rua-05.webp`.

```
Subject: The moment the call arrives: a kitchen diorama (a tile of warm wooden floor with a low wooden kitchen counter on it and a small piece of wall with a window behind). The curly-haired boy from the reference (apron, striped shirt) stands at the counter holding out his empty white plate with both hands, his tummy rumbling (two small curved lines near his tummy) and a hungry, hopeful smile. On the counter, big and clear, the ingredients from the attached cards waiting in a row: two slices of white bread, a yellow slice of cheese and a pink slice of ham. The small round white Robô-guia robot with a black face screen, green eyes and a small green antenna light (from the reference) floats beside the counter holding up one slice of bread, ready to help.
Attached images: the boy (cliente0), the robot (guide), the sandwich cards (bread, cheese, ham) and the style references (the street cards rua-01 and rua-05).
Style: cute flat cartoon illustration for a children's educational game (ages 8 to 10), matching the attached character and card references exactly: thick, smooth dark brown outlines (#3B2A2A), soft warm pastel colors, simple flat shading with small white highlights, rounded friendly shapes, expressive faces. Composition (very important): a small floating diorama, like a thick square tile of floor cut out of the place and seen in a three-quarter view from slightly above, with only one low wall piece at the back where needed. Everything sits on this tile: one or two characters and three or four big, clear objects. The diorama is centered and fills about 90% of the image width, with a thin even margin. The main character is big (about half the height of the image) and is clearly doing something. A soft grey oval shadow under the tile. Background around the diorama: flat solid cream (#FDF3E6) from edge to edge, no sky, no scenery outside the tile, no frame, no border. Readability: it must be understandable at 190 px wide: big shapes, strong silhouettes, one clear action, no tiny details. Never include: text, letters, numbers, speech bubbles with words, logos, watermarks, photorealism, 3D render. Aspect ratio 16:10, landscape, 1240x784 px.
```

### `pic2.webp` — O robô e o cubo (Fábrica)

**Anexe:** `img/cliente1.webp` (o robô laranja), `img/guide.webp`, o fundo `img/level2.webp` (o cubo cinza e a base redonda verde) e, como modelo de estilo, `img/passos/rua-01.webp` e `img/passos/rua-05.webp`.

```
Subject: The moment the call arrives: a factory diorama (a tile of light grey factory floor with a yellow guide line painted on it and a low grey wall with a round porthole window behind). On the left of the tile sits a big grey cube. On the right, a round flat platform glowing soft green, empty. The orange boxy robot from the reference (screen face with a happy smile, grey claw hands, small black wheels) stands between them, one claw pointing at the cube and the other at the green platform, with a confused face and a small question mark above its head. A dotted arrow on the floor goes from the cube to the platform. The small round white Robô-guia robot with a black face screen, green eyes and a small green antenna light (from the reference) floats beside it, giving a friendly thumbs up.
Attached images: the orange robot (cliente1), the Robô-guia (guide), the factory background (level2: the cube and the green platform) and the style references (the street cards rua-01 and rua-05).
Style: cute flat cartoon illustration for a children's educational game (ages 8 to 10), matching the attached character and card references exactly: thick, smooth dark brown outlines (#3B2A2A), soft warm pastel colors, simple flat shading with small white highlights, rounded friendly shapes, expressive faces. Composition (very important): a small floating diorama, like a thick square tile of floor cut out of the place and seen in a three-quarter view from slightly above, with only one low wall piece at the back where needed. Everything sits on this tile: one or two characters and three or four big, clear objects. The diorama is centered and fills about 90% of the image width, with a thin even margin. The main character is big (about half the height of the image) and is clearly doing something. A soft grey oval shadow under the tile. Background around the diorama: flat solid cream (#FDF3E6) from edge to edge, no sky, no scenery outside the tile, no frame, no border. Readability: it must be understandable at 190 px wide: big shapes, strong silhouettes, one clear action, no tiny details. Never include: text, letters, numbers, speech bubbles with words, logos, watermarks, photorealism, 3D render. Aspect ratio 16:10, landscape, 1240x784 px.
```

### `pic3.webp` — Arrumar a mochila (Escola)

**Anexe:** `img/cliente2.webp` (a menina), `img/guide.webp`, as cartas `img/passos/mochila-01.webp` a `mochila-08.webp` (mochila azul e amarela, estojo lilás, caderno, lápis, borracha) e, como modelo de estilo, `img/passos/rua-01.webp` e `img/passos/rua-05.webp`.

```
Subject: The moment the call arrives: a classroom diorama (a tile of light wooden floor with a small school desk on it and a piece of pale green wall behind). The girl from the reference (black hair in two low pigtails, purple sailor school uniform with a red neckerchief, dark pleated skirt, white socks, black shoes) stands next to the desk with both hands on her cheeks, a little worried, looking at the mess on the desk: the open blue and yellow backpack from the attached cards, the lilac pencil case open, a notebook, a pencil and an eraser scattered around. The small round white Robô-guia robot with a black face screen, green eyes and a small green antenna light (from the reference) floats beside the desk holding the lilac pencil case, smiling.
Attached images: the girl (cliente2), the robot (guide), the backpack cards (backpack, pencil case, notebook, pencil, eraser) and the style references (the street cards rua-01 and rua-05).
Style: cute flat cartoon illustration for a children's educational game (ages 8 to 10), matching the attached character and card references exactly: thick, smooth dark brown outlines (#3B2A2A), soft warm pastel colors, simple flat shading with small white highlights, rounded friendly shapes, expressive faces. Composition (very important): a small floating diorama, like a thick square tile of floor cut out of the place and seen in a three-quarter view from slightly above, with only one low wall piece at the back where needed. Everything sits on this tile: one or two characters and three or four big, clear objects. The diorama is centered and fills about 90% of the image width, with a thin even margin. The main character is big (about half the height of the image) and is clearly doing something. A soft grey oval shadow under the tile. Background around the diorama: flat solid cream (#FDF3E6) from edge to edge, no sky, no scenery outside the tile, no frame, no border. Readability: it must be understandable at 190 px wide: big shapes, strong silhouettes, one clear action, no tiny details. Never include: text, letters, numbers, speech bubbles with words, logos, watermarks, photorealism, 3D render. Aspect ratio 16:10, landscape, 1240x784 px.
```

### `pic4.webp` — Ajudar as abelhas (Jardim)

**Anexe:** `img/cliente3.webp` (a abelha), `img/guide.webp`, o fundo `img/level4.webp` (colmeia, girassóis, favo) e, como modelo de estilo, `img/passos/rua-01.webp` e `img/passos/rua-05.webp`.

```
Subject: The moment the call arrives: a garden diorama (a tile of green grass with soft brown soil at the edges). On the left, two big sunflowers and one pink flower with yellow pollen. On the right, a small wooden post holding a round golden beehive with a little entrance hole, and next to it a piece of honeycomb with some empty cells. The fluffy round bee from the reference (yellow and dark grey stripes, white wings, rosy cheeks) hovers in the middle holding its small woven basket, empty, with a pleading, hopeful face. The small round white Robô-guia robot with a black face screen, green eyes and a small green antenna light (from the reference) floats beside the bee, pointing at the sunflowers.
Attached images: the bee (cliente3), the robot (guide), the garden background (level4: hive, sunflowers, honeycomb) and the style references (the street cards rua-01 and rua-05).
Style: cute flat cartoon illustration for a children's educational game (ages 8 to 10), matching the attached character and card references exactly: thick, smooth dark brown outlines (#3B2A2A), soft warm pastel colors, simple flat shading with small white highlights, rounded friendly shapes, expressive faces. Composition (very important): a small floating diorama, like a thick square tile of floor cut out of the place and seen in a three-quarter view from slightly above, with only one low wall piece at the back where needed. Everything sits on this tile: one or two characters and three or four big, clear objects. The diorama is centered and fills about 90% of the image width, with a thin even margin. The main character is big (about half the height of the image) and is clearly doing something. A soft grey oval shadow under the tile. Background around the diorama: flat solid cream (#FDF3E6) from edge to edge, no sky, no scenery outside the tile, no frame, no border. Readability: it must be understandable at 190 px wide: big shapes, strong silhouettes, one clear action, no tiny details. Never include: text, letters, numbers, speech bubbles with words, logos, watermarks, photorealism, 3D render. Aspect ratio 16:10, landscape, 1240x784 px.
```
