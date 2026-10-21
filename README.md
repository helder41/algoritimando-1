# algoritimando
Algoritimando é um jogo web educativo, feito com HTML, CSS e JavaScript puros e baseado em um protótipo do Figma. O jogador vira um agente da Central de chamados e ajuda um Robô-guia a atender 4 pedidos (Sanduíche, Robô e o cubo, Mochila e Abelhas), arrastando os passos para a ordem correta. Assim, aprende de forma lúdica a pensar em sequência, como um algoritmo. O jogo tem escolha de agente, sistema de estrelas e dicas, sons e uma tela de promoção ao final.

Para jogar, basta abrir o `index.html` no navegador (sem servidor, sem instalação).

## Como funciona

- Cada chamado tem de 4 a 5 níveis, e cada nível tem de 3 a 8 passos. Os passos ficam mais detalhados a cada nível, para mostrar as etapas que a gente pula quando explica algo para outra pessoa.
- A resposta não é uma ordem fixa: cada passo depende dos passos da camada anterior (`ordemLivre` junta passos que podem trocar de lugar). Ordens alternativas válidas são aceitas.
- O erro é explicado na hora, pelo Robô-guia, e só o primeiro problema da sequência. A carta nunca é bloqueada: a criança move de novo.
- Depois de cada nível aparece a lição, que liga a atividade ao conceito de algoritmo.
- O arrasto usa Pointer Events (mouse, dedo e teclado).
- O professor pode abrir uma situação própria em `.json` pelo menu (o editor fica para a próxima etapa).

## Arquivos

| Arquivo | O que faz |
|---|---|
| `js/motor.js` | formato dos dados e validação pelas dependências (`node js/motor.js` roda os testes) |
| `js/situacoes.js` | os 4 chamados, no mesmo formato do `.json` do professor |
| `js/arrasto.js` | arrastar, tocar e teclado |
| `js/jogo.js` | a partida: tabuleiro, erros, estrelas e dicas |
| `js/conclusao.js` | a tela de lição |
| `js/app.js` | menu, abertura, crachá, central, promoção e final |
| `js/comum.js`, `js/som.js`, `js/progresso.js`, `js/perfil.js` | cartas, sons e memória do jogo |

## Imagens que ainda faltam

As cartas usam um emoji enquanto a ilustração não existe. Cada arquivo abaixo, quando colocado em `img/passos/`, substitui o emoji sozinho:

- Sanduíche: `sanduiche-01` a `sanduiche-13` (o `sanduiche-03`, presunto, já existe)
- Robô e o cubo: `robo-01` a `robo-09`
- Mochila: `mochila-01` a `mochila-08`
- Abelhas: `abelhas-01` a `abelhas-08`

A descrição de cada imagem está no fim de `js/situacoes.js` (tabela `EMOJI_RESERVA`).
