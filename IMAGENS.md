# Imagens que faltam

> **Formato no jogo:** todas as imagens ficam em **WebP** (carregam bem mais rápido que PNG e JPG). As imagens geradas podem vir em PNG ou JPG: na hora de aplicar, elas são convertidas para `.webp`.

Lista de todos os lugares do jogo que pedem uma imagem e ainda não têm. Enquanto o arquivo não existe, o jogo mostra um quadro tracejado no lugar (nas cartas, "ilustração do passo"). Basta salvar o arquivo com o nome e a pasta indicados: ele aparece sozinho, sem mexer no código.

Há três tipos principais: as cartas dos passos (seção 1), as imagens das lições (seção 2), que substituem o texto da tela de "Parabéns" para a criança, e as peças da montagem (seção 3).

## 1. Ilustrações das cartas (`img/passos/`)

Todas as 38 estão prontas.

Formato sugerido: PNG com fundo transparente, quadrado ou 4:3 (por exemplo 600 × 450), mesmo estilo das ilustrações do Figma. A mesma imagem é usada em todos os níveis em que o passo aparece.

Os prompts prontos para gerar cada uma estão em [PROMPTS-CARTAS.md](PROMPTS-CARTAS.md).

### Fazer um sanduíche (Cozinha)

| Arquivo | O que desenhar | Legenda da carta | Níveis |
|---|---|---|---|
| `sanduiche-01.webp` (já existe) | duas fatias de pão na mesa | Pegue duas fatias de pão. | 1, 2 |
| `sanduiche-02.webp` (já existe) | queijo já em cima da fatia | Coloque o queijo no pão. / Coloque o queijo na fatia. | 1, 2, 4 |
| `sanduiche-03.webp` (já existe) | presunto | Coloque o presunto no pão. | 2 |
| `sanduiche-04.webp` (já existe) | sanduíche fechado | Feche o sanduíche. / Feche com a outra fatia. / Junte as duas fatias. | 1, 2, 3, 4, 5 |
| `sanduiche-05.webp` (já existe) | saco de pão fechado | Pegue o saco de pão. | 3, 4, 5 |
| `sanduiche-06.webp` (já existe) | pote de manteiga | Pegue a manteiga. / Pegue o pote de manteiga. | 3, 5 |
| `sanduiche-07.webp` (já existe) | abrindo o saco | Abra o saco e tire duas fatias. / Abra o saco de pão. | 3, 4, 5 |
| `sanduiche-08.webp` (já existe) | fatias saindo do saco | Tire duas fatias do saco. | 4 |
| `sanduiche-09.webp` (já existe) | fatia com a manteiga espalhada | Passe a manteiga nas fatias. / Espalhe a manteiga nas fatias. | 3, 5 |
| `sanduiche-10.webp` (já existe) | fatia de queijo na mão | Pegue uma fatia de queijo. | 4 |
| `sanduiche-11.webp` (já existe) | faca sem ponta | Pegue uma faca sem ponta. | 5 |
| `sanduiche-12.webp` (já existe) | pote sendo aberto | Abra o pote de manteiga. | 5 |
| `sanduiche-13.webp` (já existe) | guardar tudo, mesa limpa | Guarde tudo e deixe a mesa limpa. | 5 |

### O robô e o cubo (Fábrica)

| Arquivo | O que desenhar | Legenda da carta | Níveis |
|---|---|---|---|
| `robo-01.webp` (já existe) | andando até o cubo | Ande até o cubo. | 1, 2, 3, 4, 5 |
| `robo-02.webp` (já existe) | garra fechando no cubo | Pegue o cubo. / Feche a garra no cubo. | 1, 2, 3, 4, 5 |
| `robo-03.webp` (já existe) | pousando o cubo | Coloque o cubo na plataforma. | 1, 2, 3 |
| `robo-04.webp` (já existe) | garra abrindo, vazia | Abra a garra. | 2, 3, 4, 5 |
| `robo-05.webp` (já existe) | virando para o cubo | Vire o robô para o cubo. | 3, 4, 5 |
| `robo-06.webp` (já existe) | virando para a plataforma | Vire o robô para a plataforma. | 4, 5 |
| `robo-07.webp` (já existe) | andando com o cubo | Ande até a plataforma. | 4, 5 |
| `robo-08.webp` (já existe) | soltando o cubo na plataforma | Abra a garra em cima da plataforma. | 4, 5 |
| `robo-09.webp` (já existe) | apertando o botão de ligar | Aperte o botão de ligar. | 5 |

### Arrumar a mochila (Escola)

| Arquivo | O que desenhar | Legenda da carta | Níveis |
|---|---|---|---|
| `mochila-01.webp` (já existe) | lápis no estojo | Guarde o lápis no estojo. | 1, 2, 3, 4 |
| `mochila-02.webp` (já existe) | borracha no estojo | Guarde a borracha no estojo. | 2, 3, 4 |
| `mochila-03.webp` (já existe) | estojo fechado | Feche o estojo. | 1, 2, 3, 4 |
| `mochila-04.webp` (já existe) | estojo entrando na mochila | Guarde o estojo na mochila. | 1, 2, 3, 4 |
| `mochila-05.webp` (já existe) | zíper da mochila fechando | Feche o zíper da mochila. | 2, 3, 4 |
| `mochila-06.webp` (já existe) | zíper da mochila abrindo | Abra o zíper da mochila. | 3, 4 |
| `mochila-07.webp` (já existe) | caderno na mochila | Guarde o caderno na mochila. | 4 |
| `mochila-08.webp` (já existe) | mochila nas costas | Coloque a mochila nas costas. | 4 |

### Ajudar as abelhas (Jardim)

| Arquivo | O que desenhar | Legenda da carta | Níveis |
|---|---|---|---|
| `abelhas-01.webp` (já existe) | abelha voando até a flor | Voe até a flor. | 1, 2, 3, 4 |
| `abelhas-02.webp` (já existe) | abelha sugando o néctar da flor | Colete o néctar da flor. | 1, 2, 3, 4 |
| `abelhas-03.webp` (já existe) | abelha voltando para a colmeia | Leve o néctar para a colmeia. / Leve tudo para a colmeia. | 1, 2, 3, 4 |
| `abelhas-04.webp` (já existe) | abelha saindo da colmeia | Saia da colmeia. | 2, 3, 4 |
| `abelhas-05.webp` (já existe) | pólen amarelo nas patinhas da abelha | Junte o pólen nas patinhas. | 2, 3, 4 |
| `abelhas-06.webp` (já existe) | abelha procurando uma flor aberta | Procure uma flor aberta. | 3, 4 |
| `abelhas-07.webp` (já existe) | néctar entrando no favo | Guarde o néctar no favo. | 4 |
| `abelhas-08.webp` (já existe) | favo fechado com cera | Feche o favo com cera. | 4 |

## 2. Imagens das lições (`img/licoes/`)

Todas as 18 estão prontas, em `img/licoes/` como WebP (1200 × 896).

Na tela de "Parabéns! Você completou o nível!", a criança vê só a pergunta e esta imagem. O texto da lição fica atrás do botão "Para o professor: ler a lição", para ele conduzir a conversa. Enquanto a imagem não existe, aparece o quadro "ilustração da lição".

Os prompts prontos para gerar cada uma estão em [PROMPTS-LICOES.md](PROMPTS-LICOES.md).

Formato sugerido: PNG ou JPG em 4:3 (por exemplo 1200 × 900), mesmo estilo das outras ilustrações. A imagem precisa contar a ideia da coluna da direita sem palavras: de preferência mostrando o certo e o errado lado a lado (por exemplo, o sanduíche com o queijo para fora e o sanduíche certo).

### Fazer um sanduíche (Cozinha)

| Arquivo | Pergunta na tela | Ideia que a imagem precisa mostrar |
|---|---|---|
| `sanduiche-1.webp` (nível 1) | Por que a ordem dos passos importa? | Para montar o sanduíche, você colocou os passos em uma ordem. Se a gente troca os passos de lugar, dá confusão: o queijo pode ficar de fora do sanduíche! Com a ordem certa, tudo dá certo no final. |
| `sanduiche-2.webp` (nível 2) | Todo passo tem uma hora certa? | O queijo e o presunto podiam entrar em qualquer ordem: um não precisa do outro. Mas fechar o sanduíche precisa esperar os dois estarem dentro. Um passo só espera aquilo de que ele precisa — os outros são livres! |
| `sanduiche-3.webp` (nível 3) | Cadê os passos escondidos? | Abrir o saco de pão… você faz isso sem nem pensar. Quando a gente explica para alguém, esses passos pequenos ficam escondidos — a pessoa adivinha sozinha. Mas eles existem! Sem eles, o sanduíche não sai. |
| `sanduiche-4.webp` (nível 4) | E se quem monta o sanduíche for um computador? | Um amigo adivinha os passos escondidos. O computador não adivinha nada! Ele só faz o que a gente diz, do jeitinho que a gente diz. Cada frase dessas é uma instrução. Por isso a lista para ele precisa ter todos os passos, na ordem certa. |
| `sanduiche-5.webp` (nível 5) | Esse passo a passo tem um nome? | Uma lista de instruções completa e na ordem certa tem nome: algoritmo! E o seu foi até o fim de verdade: montar, guardar tudo, deixar a mesa limpa. Quem cria um algoritmo pensa no começo, no meio e no fim. |

### O robô e o cubo (Fábrica)

| Arquivo | Pergunta na tela | Ideia que a imagem precisa mostrar |
|---|---|---|
| `robo-1.webp` (nível 1) | Como um robô entende um pedido? | O robô não pensa como a gente: ele faz um passo de cada vez, na ordem que recebe. Se a ordem estiver trocada, ele tenta mesmo assim — e dá tudo errado! Com a ordem certa, o cubo chega à plataforma. |
| `robo-2.webp` (nível 2) | Todos os passos precisam esperar? | Andar até o cubo e abrir a garra: tanto faz qual vem primeiro — um não precisa do outro! Mas fechar a garra no cubo precisa esperar os dois. Um passo só espera aquilo de que ele precisa. |
| `robo-3.webp` (nível 3) | Quem manda alguém "se virar antes de andar"? | Ninguém fala isso — todo mundo se vira sem pensar. O robô não: se ninguém mandar virar, ele sai reto e bate na parede. Para uma máquina, até o passo mais óbvio precisa ser dito. |
| `robo-4.webp` (nível 4) | O que se esconde dentro de "coloque na plataforma"? | Quando a gente fala "coloque lá", tem um monte de passo escondido: virar, andar, soltar. O robô não adivinha nenhum deles. Cada frase dessas é uma instrução. Se a instrução de soltar não existir, o cubo fica preso na garra para sempre! |
| `robo-5.webp` (nível 5) | Esse passo a passo tem um nome? | Uma lista de instruções completa e na ordem certa tem nome: algoritmo! E o seu começou do verdadeiro começo: ligar o robô — o passo mais esquecido do mundo. Quem cria um algoritmo pensa no começo, no meio e no fim. |

### Arrumar a mochila (Escola)

| Arquivo | Pergunta na tela | Ideia que a imagem precisa mostrar |
|---|---|---|
| `mochila-1.webp` (nível 1) | Por que a ordem dos passos importa? | Para guardar o material, você colocou os passos em uma ordem. Se a gente troca os passos de lugar, dá confusão: o lápis pode ficar perdido na mesa! Com a ordem certa, nada fica para trás. |
| `mochila-2.webp` (nível 2) | Todo passo tem uma hora certa? | O lápis e a borracha podiam entrar no estojo em qualquer ordem: um não precisa do outro. Mas fechar o estojo precisa esperar os dois estarem dentro. Um passo só espera aquilo de que ele precisa — os outros são livres! |
| `mochila-3.webp` (nível 3) | Quem lembra de falar "abra a mochila"? | Ninguém fala "abra a mochila" — todo mundo abre sem pensar. Mas se esse passo não existir, o estojo não entra: ele bate no zíper fechado! Os passos escondidos existem, mesmo quando ninguém fala deles. |
| `mochila-4.webp` (nível 4) | Esse passo a passo tem um nome? | Uma lista de passos completa e na ordem certa tem nome: algoritmo! Você montou um algoritmo de verdade — e ele foi até o fim: mochila fechada e nas costas. Quem cria um algoritmo pensa no começo, no meio e no fim. |

### Ajudar as abelhas (Jardim)

| Arquivo | Pergunta na tela | Ideia que a imagem precisa mostrar |
|---|---|---|
| `abelhas-1.webp` (nível 1) | Por que a ordem dos passos importa? | Para levar néctar para casa, a abelha seguiu os passos em uma ordem. Se a ordem fica trocada, ela volta para a colmeia sem nada! Com a ordem certa, o néctar chega em casa. |
| `abelhas-2.webp` (nível 2) | Todo passo tem uma hora certa? | O néctar e o pólen podiam ser coletados em qualquer ordem: um não precisa do outro. Mas voltar para a colmeia precisa esperar os dois. Um passo só espera aquilo de que ele precisa — os outros são livres! |
| `abelhas-3.webp` (nível 3) | Quem lembra de falar "procure a flor"? | Quando alguém conta o que a abelha faz, ninguém fala "procure uma flor aberta". Esse passo fica escondido: parece óbvio, então a gente pula. Mas sem ele a abelha voa sem rumo e não acha néctar nenhum! |
| `abelhas-4.webp` (nível 4) | Esse passo a passo tem um nome? | Uma lista de instruções completa e na ordem certa tem nome: algoritmo! E o seu foi até o fim de verdade: guardar o néctar e fechar o favo para virar mel. Quem cria um algoritmo pensa no começo, no meio e no fim. |

## 3. Peças da montagem (`img/pecas/`)

A montagem é a imagem que se forma ao lado do tabuleiro conforme a criança coloca as cartas, na ordem em que elas estão (certa ou errada). No PC ela fica abaixo da bandeja; no celular é opcional, no botão "Ver a montagem".

### Pilha: Fazer um sanduíche

**Pronto.** As 5 peças (`sanduiche-pao`, `sanduiche-manteiga`, `sanduiche-queijo`, `sanduiche-presunto`, `sanduiche-pao-cima`) são WebP transparentes, vistas de lado, todas com 600 px de largura.

### Cena: Arrumar a mochila

**Pronto.** As 9 imagens foram montadas a partir das ilustrações das cartas da mochila (o estojo, o lápis, a borracha, a mochila e o caderno são recortados delas e colocados sempre no mesmo lugar): `mochila-cena-fechada`, `mochila-cena-aberta`, `mochila-lapis`, `mochila-borracha`, `mochila-estojo-fechado`, `mochila-abrir`, `mochila-estojo-dentro`, `mochila-caderno` e `mochila-fechar` (WebP, 1600 × 1200, fundo transparente).

### Tirinha: robô e abelhas

Cada quadrinho usa hoje a **ilustração da carta** (seção 1); enquanto ela não existe, mostra a legenda do passo. Se quiserem quadrinhos próprios (a cena DEPOIS do passo: o robô já perto do cubo, a garra já fechada...), basta pôr o caminho no campo `peca` do passo, em 4:3.

## 4. Outras partes que usam um desenho provisório

| Onde | Como está hoje | Imagem que entraria |
|---|---|---|
| Botão de casa (topo de todas as telas) | ícone de casa desenhado em código (SVG) | ícone de casa do Figma, em `img/ui/casa.webp` |
| Crachá da tela "Quem é você, agente?" | moldura feita no CSS e cinco estrelas em texto | `cracha_perfil.webp` (já está no Drive, pasta `files/algoritimando_recortes/png/interface`) |
| Carta e lição sem imagem no chamado do professor | quadros "ilustração do passo" e "ilustração da lição" | a imagem que o professor escolher na Área do professor |

## 5. Imagens do Drive que ainda não têm onde entrar

- `cracha_nivel1_estagiario.webp` e `cracha_nivel3_senior.webp`: não há tela que mostre o crachá de Estagiário nem promoção para Sênior.
- `robo_comemorando`, `robo_confuso`, `robo_feliz`, `robo_pensativo`: o Robô-guia usa os rostos recortados que já estavam em `img/` (`guide.webp`, `guide-feliz.webp`, `guide-triste.webp`).
- Central com 9 chamados (Figma): só existem conteúdo e arte para os 4 chamados atuais.
