# Prompts das cenas dos chamados novos

13 imagens para `img/`: três para cada chamado novo (Lavar as mãos, Atravessar a rua, Fazer uma limonada e Escovar os dentes) e o retrato da menina de Escovar os dentes. **Já existem:** `level5`, `win5`, `pic6`, `level6`, `win6` e o retrato do menino da rua (`who5`). **Faltam 8:** `pic5`, `pic7`, `level7`, `win7`, `who6`, `pic8`, `level8` e `win8`. Sem elas o jogo funciona, mas mostra um quadro tracejado no cartão do chamado e um fundo liso nas telas do nível e da lição.

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

**A ilustração do chamado (`picN`)** é a imagem do cartão, no painel do lugar. Para ela sair tão boa quanto a do sanduíche:

- **Anexe sempre** `img/pic1.webp` (sanduíche) e `img/pic3.webp` (mochila). São o modelo de enquadramento, de contorno e de cor.
- **Um objeto só, grande**, visto de cima e de lado (três quartos), ocupando quase a imagem inteira. Sem cenário, sem sombra no chão, sem pessoas e sem mãos.
- **Fundo creme liso** (#FDF3E6), igual ao do cartão: assim a imagem não parece um quadrado colado.
- Gere **três ou quatro versões** e escolha a de silhueta mais clara. Teste olhando a imagem bem pequena: se ainda der para saber o que é, está boa.
- Se sair errado: "make the object bigger, filling the frame like the sandwich", "remove the shadow and the floor", "thicker outlines", "flat cream background, no gradient", "fewer small details", "no hands, no people".

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
Subject: A chunky oval bar of pale mint-green soap resting on a small round white ceramic soap dish, the top of the soap covered with a soft, puffy cloud of thick white foam, and a small cluster of five round soap bubbles of different sizes rising from the foam toward the top right, each bubble with a tiny white highlight, all of them touching or very close to the foam so the whole group reads as one object. Three small clear water droplets on the rim of the dish. The soap is the same pale green as in the attached hand-washing card.
Attached images: style references (the sandwich pic1 and the backpack pic3) and the hand-washing card maos-03 (the soap).
Style: cute flat cartoon sticker illustration for a children's educational game (ages 8 to 10), matching the two attached references (the sandwich and the backpack) exactly: very thick, smooth, even dark brown outlines (#3B2A2A) around every shape, soft warm pastel colors, flat fills with only one slightly darker tone on the shaded side and one or two small soft white highlights, rounded, chunky, friendly shapes, no texture, no grain, no gradients. Composition: ONE hero object, or one tight group of objects that touch each other, seen in a three-quarter view from slightly above, large and centered, filling about 90% of the image width and 85% of the height, with only a thin even margin around it, exactly like the references. Background: flat solid cream (#FDF3E6) from edge to edge, no shadow under the object, no floor line, no table, no scenery, no frame, no border, no vignette. Never include: text, letters, numbers, logos, watermarks, people, hands, faces on objects, photorealism, 3D render, glow. Must stay readable when shown at 150 px wide: bold simple silhouette, a few large shapes, very few small details. Aspect ratio 16:10, landscape, 1240x784 px.
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

```
Subject: A short piece of a zebra crossing (four white stripes on dark grey asphalt) seen slightly from above, with the pedestrian traffic light from the attached level background on a pole standing beside it: a dark grey box with three round lamps, red on top, amber in the middle and a green walking little figure at the bottom, only the green figure lit. No cars, no people. Objects have no faces.
Attached images: style reference (the backpack) and level background (the traffic light and the crossing).
Style: cute flat cartoon sticker illustration for a children's educational game (ages 8 to 10), matching the attached style reference exactly: thick dark brown outlines (#3B2A2A), soft warm pastel colors, simple flat shading with one small white highlight, rounded friendly shapes. Composition: one single subject, centered, filling about 80% of the frame, nothing touching the edges. Background: plain soft cream (#FDF5E8), no scenery, no floor line, no frame, no border. Never include: text, letters, numbers, logos, watermarks, people, faces on objects, photorealism, 3D render, heavy gradients. Must stay readable when shown small (about 150 px wide): bold simple silhouette, few details. Aspect ratio 16:10, landscape, 1240x784 px.
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
Subject: A big clear glass pitcher with a round belly and a handle on the right, almost full of pale yellow-green lemonade, with three square ice cubes and two thin round lime slices floating inside and a few tiny bubbles near the top. Leaning against the front left of the pitcher, one whole shiny green lime and one lime cut in half showing its pale green inside with simple segments. The glass is drawn flat: a light blue-white tint on the rim and the handle and one long white highlight on the belly, not realistic transparency.
Attached images: style references (the sandwich pic1 and the backpack pic3) and, if they exist, the lemonade cards limonada-04 and limonada-07 (the pitcher and the limes).
Style: cute flat cartoon sticker illustration for a children's educational game (ages 8 to 10), matching the two attached references (the sandwich and the backpack) exactly: very thick, smooth, even dark brown outlines (#3B2A2A) around every shape, soft warm pastel colors, flat fills with only one slightly darker tone on the shaded side and one or two small soft white highlights, rounded, chunky, friendly shapes, no texture, no grain, no gradients. Composition: ONE hero object, or one tight group of objects that touch each other, seen in a three-quarter view from slightly above, large and centered, filling about 90% of the image width and 85% of the height, with only a thin even margin around it, exactly like the references. Background: flat solid cream (#FDF3E6) from edge to edge, no shadow under the object, no floor line, no table, no scenery, no frame, no border, no vignette. Never include: text, letters, numbers, logos, watermarks, people, hands, faces on objects, photorealism, 3D render, glow. Must stay readable when shown at 150 px wide: bold simple silhouette, a few large shapes, very few small details. Aspect ratio 16:10, landscape, 1240x784 px.
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
Subject: A pale yellow plastic cup standing upright, holding a white toothbrush with a light blue handle, bristles up, with a neat wavy swirl of white and light blue striped toothpaste on the bristles. Leaning against the right side of the cup, a small white toothpaste tube with a light blue screw cap, closed. Two or three small round bubbles just above the bristles, each with a tiny white highlight.
Attached images: style references (the sandwich pic1 and the backpack pic3) and, if they exist, the cards dentes-01 and dentes-03 (the toothbrush, the cup and the tube).
Style: cute flat cartoon sticker illustration for a children's educational game (ages 8 to 10), matching the two attached references (the sandwich and the backpack) exactly: very thick, smooth, even dark brown outlines (#3B2A2A) around every shape, soft warm pastel colors, flat fills with only one slightly darker tone on the shaded side and one or two small soft white highlights, rounded, chunky, friendly shapes, no texture, no grain, no gradients. Composition: ONE hero object, or one tight group of objects that touch each other, seen in a three-quarter view from slightly above, large and centered, filling about 90% of the image width and 85% of the height, with only a thin even margin around it, exactly like the references. Background: flat solid cream (#FDF3E6) from edge to edge, no shadow under the object, no floor line, no table, no scenery, no frame, no border, no vignette. Never include: text, letters, numbers, logos, watermarks, people, hands, faces on objects, photorealism, 3D render, glow. Must stay readable when shown at 150 px wide: bold simple silhouette, a few large shapes, very few small details. Aspect ratio 16:10, landscape, 1240x784 px.
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
