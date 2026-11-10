# algoritimando
Algoritimando é um jogo web educativo, feito com HTML, CSS e JavaScript puros e baseado em um protótipo do Figma. O jogador vira um agente da Central de chamados e ajuda um Robô-guia a atender 7 pedidos (Sanduíche, Robô e o cubo, Mochila, Abelhas, Lavar as mãos, Atravessar a rua e Limonada), arrastando os passos para a ordem correta. Assim, aprende de forma lúdica a pensar em sequência, como um algoritmo. O jogo tem escolha de agente, sistema de estrelas e dicas, sons e uma tela de promoção ao final.

Para jogar, basta abrir o `index.html` no navegador (sem servidor, sem instalação).

## Como funciona

- Cada chamado tem de 3 a 5 níveis, e cada nível tem de 3 a 8 passos. Os passos ficam mais detalhados a cada nível, para mostrar as etapas que a gente pula quando explica algo para outra pessoa.
- A resposta não é uma ordem fixa: cada passo diz de quais outros ele depende (`dependeDe`). Passos que não dependem um do outro podem vir em qualquer ordem, e cada dependência tem a sua explicação para quando a criança erra.
- Na tela de lição, a criança vê uma imagem; o texto fica no botão "Para o professor".
- Montagem: ao lado do tabuleiro, a imagem se monta na ordem das cartas — em **pilha** (o sanduíche vai sendo empilhado; fora de ordem, o queijo aparece por cima do pão fechado), em **cena** (na mochila, cada peça entra no seu lugar; fechar o estojo antes deixa o lápis de fora) ou em **tirinha** (um quadrinho por passo; no primeiro erro a história trava). No celular ela é opcional, no botão "Ver a montagem", e ocupa o lugar da cena.
- A criança monta a sequência inteira e toca em **Verificar**. Se algo estiver fora de ordem, o tabuleiro avisa (sem dizer qual passo) e a montagem mostra a consequência. O Robô-guia só explica o problema quando a criança pede uma **dica** — e explica só o primeiro. A carta nunca é bloqueada: a criança move de novo.
- A central é um **mapa da cidade**: cada lugar (Casa, Escola, Fábrica, Jardim) é a casa de um cliente, e tocar nele mostra os chamados de lá (campo `area` de cada chamado).
- Depois de cada nível aparece a lição, que liga a atividade ao conceito de algoritmo.
- Os quatro primeiros chamados levam a criança da "ordem importa" até o nome "algoritmo", e são eles que contam para a **promoção**. Os três chamados novos trazem uma ideia a mais cada um: **repetição** (Lavar as mãos), **condição** (Atravessar a rua) e **caminhos paralelos** (Fazer uma limonada). Eles aparecem no mapa desde o começo, somam estrelas e dicas, mas não são exigidos para a promoção. O porquê de cada decisão está em [docs/revisao-chamados-novos.md](docs/revisao-chamados-novos.md).
- Estrelas por nível: 3 sem erro, 2 com um erro, 1 com mais (usar dica conta como erro). Cada nível concluído dá +1 dica, e a dica coloca a carta certa no lugar.
- O arrasto usa Pointer Events (mouse, dedo e teclado).
- No celular em pé, a tela do nível rola e o rodapé fica fixo: Verificar, Dica, Ver montagem e Nível estão sempre à vista. Arrastando uma carta para perto do alto ou do rodapé, a tela rola sozinha. Tudo o que se toca tem pelo menos 44 px de altura. Com o celular deitado, um aviso sugere virar o aparelho (dá para dispensar).
- Os chamados ficam em dados (`js/situacoes.js`), no mesmo formato do `.json` que a Área do professor gera.

## Área do professor

- Por enquanto a Área do professor está **fora do jogo** (o botão do menu está escondido), mas os arquivos continuam no projeto: abra o `editor.html` direto para usar.
- O professor escreve os passos na ordem certa, marca em cada passo quais passos precisam vir antes dele e escreve o que o Robô-guia diz se a criança errar. Escolhe também o cenário, as imagens das cartas, a imagem da lição e o texto para o professor.
- "Testar este nível" abre o nível exatamente como a criança verá, sem mexer no progresso do jogo.
- "Salvar arquivo" baixa um `.json` com tudo dentro, inclusive as imagens. Para jogar: menu do jogo → "Área do professor" → "Abrir chamado (.json)".
- Sem servidor e sem nuvem: o arquivo fica no computador do professor.

## Arquivos

| Arquivo | O que faz |
|---|---|
| `js/motor.js` | formato dos dados e validação pelas dependências (`node js/motor.js` roda os testes) |
| `js/situacoes.js` | os 7 chamados (4 originais e 3 novos), no mesmo formato do `.json` do professor |
| `js/em-progresso.js` | os 2 protótipos que ainda não foram aprovados, Escovar os dentes e Plantar uma semente (seção "Em progresso", senha 6234; o botão está escondido no `index.html` por enquanto) |
| `js/arrasto.js` | arrastar, tocar e teclado |
| `js/jogo.js` | a partida: tabuleiro, erros, estrelas e dicas |
| `js/montagem.js` | a montagem (pilha, cena ou tirinha) ao lado do tabuleiro |
| `js/conclusao.js` | a tela de lição |
| `js/app.js` | menu, abertura, crachá, central, promoção, final e abrir o chamado do professor |
| `editor.html`, `editor.css`, `js/editor.js` | a Área do professor |
| `js/som.js`, `audio/musica-tema.mp3` | música ("Agentes de Algoritimando", em loop) e efeitos, com o menu "Sons" (liga/desliga e volume de cada um) |
| `js/comum.js`, `js/progresso.js`, `js/perfil.js` | cartas e memória do jogo |

## Imagens que ainda faltam

Os três chamados novos ainda não têm ilustração: as cartas mostram o quadro "ilustração do passo" enquanto ela não existe. A lista completa do que falta desenhar, com o nome de cada arquivo, está em [IMAGENS.md](IMAGENS.md), e os prompts para gerar cada uma em [PROMPTS-CARTAS.md](PROMPTS-CARTAS.md) e [PROMPTS-LICOES.md](PROMPTS-LICOES.md).

## Versão dos arquivos (cache)

Os `.js` e `.css` são carregados com `?v=AAAAMMDDHHMM` no `index.html` e no `editor.html`. Ao publicar uma mudança, troque esse número: assim o navegador (principalmente no celular) baixa os arquivos novos em vez de usar os guardados.
