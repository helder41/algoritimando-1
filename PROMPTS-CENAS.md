# Prompts das cenas dos chamados novos

9 imagens para `img/`: três para cada chamado novo (Lavar as mãos, Atravessar a rua e Fazer uma limonada). Sem elas o jogo funciona, mas mostra um quadro tracejado no cartão do chamado e um fundo liso nas telas do nível e da lição.

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
- **Personagens:** Lavar as mãos e Fazer uma limonada são da Casa (o menino de avental, `img/cliente0.webp`). Atravessar a rua é da Escola (a menina, `img/cliente2.webp`).

**Se sair errado:** "keep the right side empty and blurred", "move the characters to the left", "remove all text", "same boy as the reference", "simpler, fewer objects".

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

**Arquivos:** `pic5.webp`, `level5.webp`, `win5.webp`.

**Anexe como referência:** `img/pic3.webp` (estilo da ilustração do chamado), `img/level3.webp` e `img/win3.webp` (composição dos fundos), `img/cliente0.webp` (o menino), `img/guide.webp` (Robô-guia) e, quando existirem, as cartas `img/passos/maos-01.webp` a `maos-07.webp`.

**Consistência:** a mesma pia branca com torneira prateada de alavanca, o mesmo sabonete em barra verde-claro e a mesma toalha azul-clara das cartas.

### `pic5.webp` — ilustração do chamado

```
Subject: A small white bathroom sink seen slightly from above and the front, with a silver lever tap, a pale green bar of soap resting on the edge of the sink and three or four soap bubbles floating above it. No water running. Objects have no faces.
Attached images: style reference (the backpack).
Style: cute flat cartoon sticker illustration for a children's educational game (ages 8 to 10), matching the attached style reference exactly: thick dark brown outlines (#3B2A2A), soft warm pastel colors, simple flat shading with one small white highlight, rounded friendly shapes. Composition: one single subject, centered, filling about 80% of the frame, nothing touching the edges. Background: plain soft cream (#FDF5E8), no scenery, no floor line, no frame, no border. Never include: text, letters, numbers, logos, watermarks, people, faces on objects, photorealism, 3D render, heavy gradients. Must stay readable when shown small (about 150 px wide): bold simple silhouette, few details. Aspect ratio 16:10, landscape, 1240x784 px.
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

**Arquivos:** `pic6.webp`, `level6.webp`, `win6.webp`.

**Anexe como referência:** `img/pic3.webp` (estilo da ilustração do chamado), `img/level3.webp` e `img/win3.webp` (composição dos fundos), `img/cliente2.webp` (a menina), `img/guide.webp` (Robô-guia), `img/story1.webp` (as ruas e casas da cidade) e, quando existirem, as cartas `img/passos/rua-01.webp` a `rua-06.webp`.

**Consistência:** a mesma faixa de pedestres (listras brancas no asfalto cinza) e o mesmo semáforo de pedestres das cartas. A menina com a mochila azul nas costas.

**Cuidado com o tom:** a menina está sempre na calçada ou já do outro lado. Nenhum carro perto dela, nenhum susto.

### `pic6.webp` — ilustração do chamado

```
Subject: A short piece of a zebra crossing (four white stripes on dark grey asphalt) seen slightly from above, with a pedestrian traffic light on a pole standing beside it: a dark box with two lamps, a red standing little figure on top and a green walking little figure below, both softly lit. No cars, no people. Objects have no faces.
Attached images: style reference (the backpack).
Style: cute flat cartoon sticker illustration for a children's educational game (ages 8 to 10), matching the attached style reference exactly: thick dark brown outlines (#3B2A2A), soft warm pastel colors, simple flat shading with one small white highlight, rounded friendly shapes. Composition: one single subject, centered, filling about 80% of the frame, nothing touching the edges. Background: plain soft cream (#FDF5E8), no scenery, no floor line, no frame, no border. Never include: text, letters, numbers, logos, watermarks, people, faces on objects, photorealism, 3D render, heavy gradients. Must stay readable when shown small (about 150 px wide): bold simple silhouette, few details. Aspect ratio 16:10, landscape, 1240x784 px.
```

### `level6.webp` — fundo do nível

```
Scene: A calm street corner of the friendly cartoon town from the reference, in the morning. On the left, the girl from the reference (school uniform, blue backpack on her back) stands on the light grey sidewalk, facing the street and thinking. Next to her floats the small round white Robô-guia robot with a black face screen, green eyes and a small green antenna light (from the reference). Above the girl, a soft cream thought bubble contains the zebra crossing with the pedestrian traffic light from the attached illustration. At her feet the sidewalk ends at the curb, where a zebra crossing begins. The street, the houses and the trees continue to the right, soft and blurred, with no cars.
Attached images: the chamado illustration (pic6), composition reference (level3), the girl, the robot, the town.
Style: cute flat cartoon illustration for a children's educational game (ages 8 to 10), matching the attached references exactly: thick dark brown outlines (#3B2A2A) on the characters and on the objects near them, soft warm pastel colors, simple flat shading, rounded friendly shapes. Layout (very important): the characters, the thought bubble and every sharp detail stay inside the LEFT 40% of the image. The RIGHT 60% is the same room continuing, but soft, pale and heavily blurred, with no characters, no strong shapes and no strong colors: the game draws its board and cards on top of that area. Lighting: warm soft daylight coming from the left. Never include: text, letters, numbers, logos, watermarks, photorealism, 3D render. Aspect ratio 16:9, landscape, 1376x768 px.
```

### `win6.webp` — fundo da lição

```
Scene: The same calm street corner, now seen from the other sidewalk: the girl from the reference (school uniform, blue backpack) has already crossed and stands safely on the sidewalk, giving a thumbs up with a big smile. Next to her the small round white Robô-guia robot with a black face screen, green eyes and a small green antenna light (from the reference) cheers with its arms up and happy curved eyes. Above them, a round green badge with a white check mark and a shiny gold star with small sparkles and a few pieces of pastel confetti. Behind them, the zebra crossing she just used and the pedestrian traffic light with the green walking figure lit. The street and the houses continue to the right, soft and blurred, with no cars.
Attached images: composition reference (win3), the girl, the robot, the town.
Style: cute flat cartoon illustration for a children's educational game (ages 8 to 10), matching the attached references exactly: thick dark brown outlines (#3B2A2A) on the characters and on the objects near them, soft warm pastel colors, simple flat shading, rounded friendly shapes. Layout (very important): the characters, the green check, the star and every sharp detail stay inside the LEFT 55% of the image, in its upper two thirds. The RIGHT 45% is the same place continuing, but soft, pale and heavily blurred, with no characters and no strong shapes: the game draws the lesson panel on top of that area. Mood: happy, a small celebration. Never include: text, letters, numbers, logos, watermarks, photorealism, 3D render. Aspect ratio 16:9, landscape, 1600x893 px.
```

## Fazer uma limonada (Cozinha)

**Arquivos:** `pic7.webp`, `level7.webp`, `win7.webp`.

**Anexe como referência:** `img/pic3.webp` (estilo da ilustração do chamado), `img/level1.webp` e `img/win1.webp` (a mesma cozinha do sanduíche, e a composição dos fundos), `img/cliente0.webp` (o menino), `img/guide.webp` (Robô-guia) e, quando existirem, as cartas `img/passos/limonada-01.webp` a `limonada-07.webp`.

**Consistência:** a MESMA cozinha do sanduíche (bancada de madeira, janela, geladeira lilás). Os mesmos limões verdes, a mesma jarra de vidro com alça e o mesmo copo das cartas.

### `pic7.webp` — ilustração do chamado

```
Subject: A clear glass jug with a handle, full of pale yellow-green lemonade with three ice cubes and one thin green lime slice floating in it, and beside it one whole green lime and one lime cut in half showing the pale green inside. Objects have no faces.
Attached images: style reference (the backpack).
Style: cute flat cartoon sticker illustration for a children's educational game (ages 8 to 10), matching the attached style reference exactly: thick dark brown outlines (#3B2A2A), soft warm pastel colors, simple flat shading with one small white highlight, rounded friendly shapes. Composition: one single subject, centered, filling about 80% of the frame, nothing touching the edges. Background: plain soft cream (#FDF5E8), no scenery, no floor line, no frame, no border. Never include: text, letters, numbers, logos, watermarks, people, faces on objects, photorealism, 3D render, heavy gradients. Must stay readable when shown small (about 150 px wide): bold simple silhouette, few details. Aspect ratio 16:10, landscape, 1240x784 px.
```

### `level7.webp` — fundo do nível

```
Scene: The same warm home kitchen as in the kitchen reference (wooden counter, window, lilac fridge). On the left, the curly-haired boy from the reference (apron, striped shirt) stands at the counter looking thirsty and hopeful, holding an empty glass. On the counter in front of him are three whole green limes and an empty clear glass jug. Next to him floats the small round white Robô-guia robot with a black face screen, green eyes and a small green antenna light (from the reference). Above the boy, a soft cream thought bubble contains the jug of lemonade from the attached illustration. The rest of the kitchen continues to the right, soft and blurred.
Attached images: the chamado illustration (pic7), the kitchen and composition reference (level1), the boy, the robot.
Style: cute flat cartoon illustration for a children's educational game (ages 8 to 10), matching the attached references exactly: thick dark brown outlines (#3B2A2A) on the characters and on the objects near them, soft warm pastel colors, simple flat shading, rounded friendly shapes. Layout (very important): the characters, the thought bubble and every sharp detail stay inside the LEFT 40% of the image. The RIGHT 60% is the same room continuing, but soft, pale and heavily blurred, with no characters, no strong shapes and no strong colors: the game draws its board and cards on top of that area. Lighting: warm soft daylight coming from the left. Never include: text, letters, numbers, logos, watermarks, photorealism, 3D render. Aspect ratio 16:9, landscape, 1376x768 px.
```

### `win7.webp` — fundo da lição

```
Scene: The same warm home kitchen as in the kitchen reference. On the left, the curly-haired boy from the reference (apron, striped shirt) happily raises a glass of pale yellow-green lemonade with an ice cube and a lime slice on the rim, smiling with his mouth open. Next to him the small round white Robô-guia robot with a black face screen, green eyes and a small green antenna light (from the reference) cheers with its arms up and happy curved eyes. Above them, a round green badge with a white check mark and a shiny gold star with small sparkles and a few pieces of pastel confetti. On the counter behind them, the glass jug of lemonade, half full. The rest of the kitchen continues to the right, soft and blurred.
Attached images: the kitchen and composition reference (win1), the boy, the robot.
Style: cute flat cartoon illustration for a children's educational game (ages 8 to 10), matching the attached references exactly: thick dark brown outlines (#3B2A2A) on the characters and on the objects near them, soft warm pastel colors, simple flat shading, rounded friendly shapes. Layout (very important): the characters, the green check, the star and every sharp detail stay inside the LEFT 55% of the image, in its upper two thirds. The RIGHT 45% is the same place continuing, but soft, pale and heavily blurred, with no characters and no strong shapes: the game draws the lesson panel on top of that area. Mood: happy, a small celebration. Never include: text, letters, numbers, logos, watermarks, photorealism, 3D render. Aspect ratio 16:9, landscape, 1600x893 px.
```
