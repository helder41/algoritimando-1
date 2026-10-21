/* ============================================================
   situacoes.js — os quatro chamados que já vêm no jogo.
   Usam EXATAMENTE o mesmo formato que o editor do professor
   gera e salva em .json. Um formato só, nunca dois: nenhum
   campo daqui é especial — tudo pode ser criado no editor.

   As quatro situações (cada uma é um chamado da central):
     SITUACAO_SANDUICHE  cotidiano doméstico (5 fases, 3→8 passos)
     SITUACAO_ROBO       mundo da máquina    (5 fases, 3→8 passos)
     SITUACAO_MOCHILA    rotina escolar      (4 fases, 3→8 passos)
     SITUACAO_ABELHAS    natureza            (4 fases, 3→8 passos)

   Os campos visuais (local, cor, cliente, cena, fundo,
   fundoConclusao) são opcionais e estão descritos no motor.js.

   A dificuldade cresce de propósito: a cada fase os passos
   ficam mais detalhados, para expor as etapas que a gente
   normalmente pula quando fala com outra pessoa — e que uma
   máquina não consegue adivinhar.

   Progressão conceitual (aparece na LIÇÃO de cada fase):
     a ordem importa → passos livres × passos presos →
     passos escondidos → o computador não adivinha ("instrução") →
     a ideia ganha nome ("algoritmo") + começo, meio e fim.

   As palavras "algoritmo" e "instrução" NUNCA aparecem nas
   primeiras fases: primeiro a criança vive a ideia, só depois
   a ideia ganha nome.

   Regras de dependência que o modelo de camadas cria "a mais"
   (ex.: abrir a garra antes de andar) são sempre narradas na
   instrucao da fase e no texto da explicacao, para virarem
   regra do mundo da fase em vez de erro sem sentido.
   ============================================================ */

'use strict';

/* ============================================================
   SITUAÇÃO 1 · FAZER UM SANDUÍCHE
   ============================================================ */

const SITUACAO_SANDUICHE = {
  formato: 'passo-a-passo/1',
  id: 'sanduiche',
  titulo: 'Fazer um sanduíche',
  local: 'Cozinha',
  cor: '#8a5a2b',
  cliente: 'img/who1.png',
  cena: 'img/pic1.jpg',
  cenaReserva: '🥪',
  fundo: 'img/level1.jpg',
  fundoConclusao: 'img/win1.jpg',
  fases: [

    /* ---------- FASE 1 · a ordem importa (3 passos) ---------- */
    {
      id: 'fase-1',
      titulo: 'Monte o sanduíche na ordem certa!',
      instrucao: 'Arraste as cartas para os espaços — ou toque na carta e depois no espaço.',
      mascote: 'Cada carta é um passo. Qual precisa acontecer primeiro?',
      passos: [
        { id: 'pao', texto: 'Pegue duas fatias de pão.', imagem: 'img/passos/sanduiche-01.png' },
        {
          id: 'queijo', texto: 'Coloque o queijo no pão.', imagem: 'img/passos/sanduiche-02.png',
          explicacao: 'O queijo vai em cima do pão. Sem pão na mesa, o queijo fica voando!',
        },
        {
          id: 'fechar', texto: 'Feche o sanduíche.', imagem: 'img/passos/sanduiche-04.png',
          explicacao: 'Fechar o sanduíche agora? O queijo ainda está fora — ele fica sem entrar!',
        },
      ],
      licao: {
        pergunta: 'Por que a ordem dos passos importa?',
        texto: [
          'Para montar o sanduíche, você colocou os passos em uma ordem.',
          'Se a gente troca os passos de lugar, dá confusão: o queijo pode ficar de fora do sanduíche!',
          'Com a ordem certa, tudo dá certo no final.',
        ],
        comparacao: {
          certa:  ['queijo', 'fechar'],
          errada: ['fechar', 'queijo'],
        },
        reflexao: [
          'O que acontece com o queijo se você fechar o sanduíche antes de colocá-lo?',
          'O que mais você faz no seu dia que só dá certo em uma ordem?',
        ],
        reforco: 'Quando os passos estão na ordem certa, a gente chega onde quer!',
      },
    },

    /* ---------- FASE 2 · passos livres e passos presos (4 passos) ---------- */
    {
      id: 'fase-2',
      titulo: 'Agora o sanduíche vai ficar recheado!',
      instrucao: 'Alguns passos podem trocar de lugar entre si. Outros não. Fique de olho!',
      mascote: 'O queijo e o presunto podem trocar de lugar. Os outros, não!',
      passos: [
        { id: 'pao', texto: 'Pegue duas fatias de pão.', imagem: 'img/passos/sanduiche-01.png' },
        {
          id: 'queijo', texto: 'Coloque o queijo no pão.', imagem: 'img/passos/sanduiche-02.png',
          explicacao: 'O queijo vai em cima do pão. Sem pão na mesa, o queijo fica voando!',
        },
        {
          id: 'presunto', texto: 'Coloque o presunto no pão.', imagem: 'img/passos/sanduiche-03.png', ordemLivre: true,
          explicacao: 'O presunto vai em cima do pão. Sem pão na mesa, o presunto fica voando!',
        },
        {
          id: 'fechar', texto: 'Feche o sanduíche.', imagem: 'img/passos/sanduiche-04.png',
          explicacao: {
            queijo:   'Para fechar o sanduíche, o queijo já precisa estar dentro. Fechando agora, ele fica de fora!',
            presunto: 'Para fechar o sanduíche, o presunto já precisa estar dentro. Fechando agora, ele fica de fora!',
          },
        },
      ],
      licao: {
        pergunta: 'Todo passo tem uma hora certa?',
        texto: [
          'O queijo e o presunto podiam entrar em qualquer ordem: um não precisa do outro.',
          'Mas fechar o sanduíche precisa esperar os dois estarem dentro.',
          'Um passo só espera aquilo de que ele precisa — os outros são livres!',
        ],
        comparacao: {
          certa:  ['presunto', 'queijo'],
          errada: ['fechar', 'queijo'],
        },
        reflexao: [
          'Quais cartas podiam trocar de lugar sem estragar nada?',
          'Por que fechar o sanduíche não pode vir antes do recheio?',
        ],
        reforco: 'Cada passo espera só os passos de que ele precisa — os outros são livres!',
      },
    },

    /* ---------- FASE 3 · os passos escondidos (5 passos) ---------- */
    {
      id: 'fase-3',
      titulo: 'Monte o sanduíche sem esquecer nenhum passo!',
      instrucao: 'Primeiro separe na mesa tudo o que vai usar. Depois monte!',
      mascote: 'Não dá para usar o que ainda está guardado. Separe tudo primeiro!',
      passos: [
        { id: 'pegar-pao',      texto: 'Pegue o saco de pão.', imagem: 'img/passos/sanduiche-05.png' },
        { id: 'pegar-manteiga', texto: 'Pegue a manteiga.',    imagem: 'img/passos/sanduiche-06.png', ordemLivre: true },
        {
          id: 'abrir-saco', texto: 'Abra o saco e tire duas fatias.', imagem: 'img/passos/sanduiche-07.png',
          explicacao: {
            'pegar-pao':      'Para abrir o saco de pão, ele precisa estar na sua mão!',
            'pegar-manteiga': 'Antes de começar a abrir, separe tudo na mesa — a manteiga também!',
          },
        },
        {
          id: 'passar', texto: 'Passe a manteiga nas fatias.', imagem: 'img/passos/sanduiche-09.png',
          explicacao: 'As fatias ainda estão dentro do saco! Abra o saco primeiro.',
        },
        {
          id: 'fechar', texto: 'Feche o sanduíche.', imagem: 'img/passos/sanduiche-04.png',
          explicacao: 'Fechar antes de passar a manteiga? Vira um sanduíche de nada!',
        },
      ],
      licao: {
        pergunta: 'Cadê os passos escondidos?',
        texto: [
          'Abrir o saco de pão… você faz isso sem nem pensar.',
          'Quando a gente explica para alguém, esses passos pequenos ficam escondidos — a pessoa adivinha sozinha.',
          'Mas eles existem! Sem eles, o sanduíche não sai.',
        ],
        comparacao: {
          certa:  ['pegar-manteiga', 'pegar-pao'],
          errada: ['passar', 'abrir-saco'],
        },
        reflexao: [
          'Qual passo desta fase você nunca fala em voz alta quando ensina alguém a fazer um sanduíche?',
          'Se ninguém abrir o saco, como as fatias vão parar na mesa?',
        ],
        reforco: 'Os passos pequenos também contam — mesmo quando ninguém fala deles!',
      },
    },

    /* ---------- FASE 4 · o computador não adivinha (6 passos) ---------- */
    {
      id: 'fase-4',
      titulo: 'Ensine o computador a fazer um sanduíche!',
      instrucao: 'O computador não adivinha nada. Diga cada passo, um por um.',
      mascote: 'O computador não sabe nada sobre sanduíche. Conte tudo para ele!',
      passos: [
        { id: 'pegar-pao',    texto: 'Pegue o saco de pão.',       imagem: 'img/passos/sanduiche-05.png' },
        { id: 'pegar-queijo', texto: 'Pegue uma fatia de queijo.', imagem: 'img/passos/sanduiche-10.png', ordemLivre: true },
        {
          id: 'abrir-saco', texto: 'Abra o saco de pão.', imagem: 'img/passos/sanduiche-07.png',
          explicacao: {
            'pegar-pao':    'O saco precisa estar na mão do computador antes de abrir!',
            'pegar-queijo': 'Primeiro separe tudo na mesa. O computador não sai pegando as coisas sozinho!',
          },
        },
        {
          id: 'tirar-fatias', texto: 'Tire duas fatias do saco.', imagem: 'img/passos/sanduiche-08.png',
          explicacao: 'Tirar fatias de um saco fechado? O computador trava: não dá!',
        },
        {
          id: 'por-queijo', texto: 'Coloque o queijo na fatia.', imagem: 'img/passos/sanduiche-02.png',
          explicacao: 'As fatias ainda estão dentro do saco! O queijo cairia em cima da mesa.',
        },
        {
          id: 'fechar', texto: 'Feche com a outra fatia.', imagem: 'img/passos/sanduiche-04.png',
          explicacao: 'Fechar antes de o queijo entrar? O computador entrega um sanduíche de nada!',
        },
      ],
      licao: {
        pergunta: 'E se quem monta o sanduíche for um computador?',
        texto: [
          'Um amigo adivinha os passos escondidos. O computador não adivinha nada!',
          'Ele só faz o que a gente diz, do jeitinho que a gente diz. Cada frase dessas é uma instrução.',
          'Por isso a lista para ele precisa ter todos os passos, na ordem certa.',
        ],
        comparacao: {
          certa:  ['abrir-saco', 'tirar-fatias'],
          errada: ['tirar-fatias', 'abrir-saco'],
        },
        reflexao: [
          'Por que o computador não consegue tirar o pão de um saco fechado?',
          'Qual passo desta fase você esqueceria de falar?',
        ],
        reforco: 'O computador faz exatamente o que a gente manda — nem mais, nem menos.',
      },
    },

    /* ---------- FASE 5 · algoritmo, do começo ao fim (8 passos) ---------- */
    {
      id: 'fase-5',
      titulo: 'Do primeiro passo até arrumar a mesa!',
      instrucao: 'Pegue tudo, abra tudo, monte — e termine arrumando!',
      mascote: 'Começo, meio e fim: pegar, montar e arrumar a mesa.',
      passos: [
        { id: 'pegar-pao',      texto: 'Pegue o saco de pão.',      imagem: 'img/passos/sanduiche-05.png' },
        { id: 'pegar-manteiga', texto: 'Pegue o pote de manteiga.', imagem: 'img/passos/sanduiche-06.png', ordemLivre: true },
        { id: 'pegar-faca',     texto: 'Pegue uma faca sem ponta.', imagem: 'img/passos/sanduiche-11.png', ordemLivre: true },
        {
          id: 'abrir-saco', texto: 'Abra o saco e tire duas fatias.', imagem: 'img/passos/sanduiche-07.png',
          explicacao: {
            'pegar-pao': 'O saco precisa estar na sua mão!',
            '*':         'Primeiro pegue tudo e deixe na mesa. Depois comece a abrir!',
          },
        },
        {
          id: 'abrir-pote', texto: 'Abra o pote de manteiga.', imagem: 'img/passos/sanduiche-12.png', ordemLivre: true,
          explicacao: {
            'pegar-manteiga': 'O pote precisa estar na sua mão!',
            '*':              'Primeiro pegue tudo e deixe na mesa. Depois comece a abrir!',
          },
        },
        {
          id: 'passar', texto: 'Espalhe a manteiga nas fatias.', imagem: 'img/passos/sanduiche-09.png',
          explicacao: {
            'abrir-saco': 'As fatias ainda estão dentro do saco!',
            'abrir-pote': 'A manteiga ainda está trancada no pote! A faca não atravessa a tampa.',
          },
        },
        {
          id: 'fechar-sanduiche', texto: 'Junte as duas fatias.', imagem: 'img/passos/sanduiche-04.png',
          explicacao: 'Juntar as fatias sem manteiga dentro? Sanduíche de nada!',
        },
        {
          id: 'guardar', texto: 'Guarde tudo e deixe a mesa limpa.', imagem: 'img/passos/sanduiche-13.png',
          explicacao: 'O sanduíche ainda não está pronto! Termine de montar antes de guardar as coisas.',
        },
      ],
      licao: {
        pergunta: 'Esse passo a passo tem um nome?',
        texto: [
          'Uma lista de instruções completa e na ordem certa tem nome: algoritmo!',
          'E o seu foi até o fim de verdade: montar, guardar tudo, deixar a mesa limpa.',
          'Quem cria um algoritmo pensa no começo, no meio e no fim.',
        ],
        comparacao: {
          certa:  ['fechar-sanduiche', 'guardar'],
          errada: ['guardar', 'fechar-sanduiche'],
        },
        reflexao: [
          'Por que guardar as coisas também faz parte do passo a passo?',
          'Qual outro algoritmo você segue todo dia sem perceber?',
        ],
        reforco: 'Algoritmo é um passo a passo completo, na ordem certa — com começo, meio e fim!',
      },
    },

  ],
};

/* ============================================================
   SITUAÇÃO 2 · O ROBÔ E O CUBO
   Mais perto da máquina: os erros mostram passos que humanos
   acham óbvios (virar antes de andar, abrir a garra antes de
   pegar, soltar depois de chegar, ligar antes de tudo).
   ============================================================ */

const SITUACAO_ROBO = {
  formato: 'passo-a-passo/1',
  id: 'robo',
  titulo: 'O robô e o cubo',
  local: 'Fábrica',
  cor: '#2f4f7f',
  cliente: 'img/who2.png',
  cena: 'img/pic2.jpg',
  cenaReserva: '🤖',
  fundo: 'img/level2.jpg',
  fundoConclusao: 'img/win2.jpg',
  fases: [

    /* ---------- FASE 1 · a máquina precisa de ordem (3 passos) ---------- */
    {
      id: 'fase-1',
      titulo: 'Mande o robô guardar o cubo!',
      instrucao: 'O robô faz um passo de cada vez. Coloque na ordem!',
      mascote: 'O robô só faz o que você mandar — e na ordem que você mandar.',
      passos: [
        { id: 'andar', texto: 'Ande até o cubo.', imagem: 'img/passos/robo-01.png' },
        {
          id: 'pegar', texto: 'Pegue o cubo.', imagem: 'img/passos/robo-02.png',
          explicacao: 'O braço do robô não estica! De longe, a garra fecha no ar. Primeiro ande até o cubo.',
        },
        {
          id: 'colocar', texto: 'Coloque o cubo na plataforma.', imagem: 'img/passos/robo-03.png',
          explicacao: 'A garra do robô está vazia! Colocar o quê? Primeiro pegue o cubo.',
        },
      ],
      licao: {
        pergunta: 'Como um robô entende um pedido?',
        texto: [
          'O robô não pensa como a gente: ele faz um passo de cada vez, na ordem que recebe.',
          'Se a ordem estiver trocada, ele tenta mesmo assim — e dá tudo errado!',
          'Com a ordem certa, o cubo chega à plataforma.',
        ],
        comparacao: {
          certa:  ['andar', 'pegar'],
          errada: ['pegar', 'andar'],
        },
        reflexao: [
          'Por que o robô não consegue pegar o cubo de longe?',
          'Se você fosse um robô, o que faria primeiro ao acordar?',
        ],
        reforco: 'Máquina segue os passos na ordem em que eles chegam!',
      },
    },

    /* ---------- FASE 2 · passos livres: a garra aparece (4 passos) ---------- */
    {
      id: 'fase-2',
      titulo: 'Apareceu a garra!',
      instrucao: 'A garra começa fechada — e garra fechada não pega nada.',
      mascote: 'Garra fechada não pega nada. Repare quando ela precisa abrir!',
      passos: [
        { id: 'andar',       texto: 'Ande até o cubo.', imagem: 'img/passos/robo-01.png' },
        { id: 'abrir-garra', texto: 'Abra a garra.',    imagem: 'img/passos/robo-04.png', ordemLivre: true },
        {
          id: 'fechar-garra', texto: 'Feche a garra no cubo.', imagem: 'img/passos/robo-02.png',
          explicacao: {
            'andar':       'Fechar a garra daqui? Ela fecha no ar! Primeiro chegue perto do cubo.',
            'abrir-garra': 'A garra está fechada! Garra fechada não pega nada — primeiro abra.',
          },
        },
        {
          id: 'colocar', texto: 'Coloque o cubo na plataforma.', imagem: 'img/passos/robo-03.png',
          explicacao: 'A garra ainda não está segurando o cubo! Feche a garra nele primeiro.',
        },
      ],
      licao: {
        pergunta: 'Todos os passos precisam esperar?',
        texto: [
          'Andar até o cubo e abrir a garra: tanto faz qual vem primeiro — um não precisa do outro!',
          'Mas fechar a garra no cubo precisa esperar os dois.',
          'Um passo só espera aquilo de que ele precisa.',
        ],
        comparacao: {
          certa:  ['abrir-garra', 'andar'],
          errada: ['fechar-garra', 'abrir-garra'],
        },
        reflexao: [
          'Quais dois passos podiam trocar de lugar sem estragar nada?',
          'Por que abrir a garra precisa vir antes de fechar a garra?',
        ],
        reforco: 'Passos que não dependem um do outro podem vir em qualquer ordem!',
      },
    },

    /* ---------- FASE 3 · o óbvio para nós, não para ele (5 passos) ---------- */
    {
      id: 'fase-3',
      titulo: 'Vire o robô antes de ele andar!',
      instrucao: 'Prepare o robô antes de ele sair do lugar: vire-o para o lado certo e abra a garra.',
      mascote: 'O robô anda para onde está virado. Vire antes de mandar andar!',
      passos: [
        { id: 'virar-cubo',  texto: 'Vire o robô para o cubo.', imagem: 'img/passos/robo-05.png' },
        { id: 'abrir-garra', texto: 'Abra a garra.',            imagem: 'img/passos/robo-04.png', ordemLivre: true },
        {
          id: 'andar-cubo', texto: 'Ande até o cubo.', imagem: 'img/passos/robo-01.png',
          explicacao: {
            'virar-cubo':  'O robô anda sempre reto, para onde está virado. Sem virar antes, ele bate na parede!',
            'abrir-garra': 'Este robô sai andando já com a garra pronta. Abra a garra antes de mandar ele andar!',
          },
        },
        {
          id: 'fechar-garra', texto: 'Feche a garra no cubo.', imagem: 'img/passos/robo-02.png',
          explicacao: 'Fechar a garra daqui? Ela fecha no ar! Primeiro chegue perto do cubo.',
        },
        {
          id: 'colocar', texto: 'Coloque o cubo na plataforma.', imagem: 'img/passos/robo-03.png',
          explicacao: 'A garra ainda não está segurando o cubo! Feche a garra nele primeiro.',
        },
      ],
      licao: {
        pergunta: 'Quem manda alguém "se virar antes de andar"?',
        texto: [
          'Ninguém fala isso — todo mundo se vira sem pensar.',
          'O robô não: se ninguém mandar virar, ele sai reto e bate na parede.',
          'Para uma máquina, até o passo mais óbvio precisa ser dito.',
        ],
        comparacao: {
          certa:  ['virar-cubo', 'andar-cubo'],
          errada: ['andar-cubo', 'virar-cubo'],
        },
        reflexao: [
          'Que outros passos você faz sem perceber quando atravessa a sala?',
          'O que acontece com um robô que anda sem virar para o lugar certo?',
        ],
        reforco: 'O que é óbvio para a gente precisa ser dito para a máquina!',
      },
    },

    /* ---------- FASE 4 · a viagem completa: soltar também é passo (7 passos) ---------- */
    {
      id: 'fase-4',
      titulo: 'Leve o cubo até a plataforma!',
      instrucao: 'Agora a viagem é completa: pegar o cubo, levar até a plataforma e soltar.',
      mascote: 'Ida e volta: pegar o cubo aqui, soltar lá na plataforma.',
      passos: [
        { id: 'virar-cubo',  texto: 'Vire o robô para o cubo.', imagem: 'img/passos/robo-05.png' },
        { id: 'abrir-garra', texto: 'Abra a garra.',            imagem: 'img/passos/robo-04.png', ordemLivre: true },
        {
          id: 'andar-cubo', texto: 'Ande até o cubo.', imagem: 'img/passos/robo-01.png',
          explicacao: {
            'virar-cubo':  'O robô anda sempre reto, para onde está virado. Sem virar antes, ele bate na parede!',
            'abrir-garra': 'Este robô sai andando já com a garra pronta. Abra a garra antes de mandar ele andar!',
          },
        },
        {
          id: 'fechar-garra', texto: 'Feche a garra no cubo.', imagem: 'img/passos/robo-02.png',
          explicacao: 'Fechar a garra daqui? Ela fecha no ar! Primeiro chegue perto do cubo.',
        },
        {
          id: 'virar-plataforma', texto: 'Vire o robô para a plataforma.', imagem: 'img/passos/robo-06.png',
          explicacao: 'Se o robô virar agora, o cubo fica para trás, sozinho na mesa! Primeiro feche a garra nele.',
        },
        {
          id: 'andar-plataforma', texto: 'Ande até a plataforma.', imagem: 'img/passos/robo-07.png',
          explicacao: 'O robô anda para onde está virado. Sem virar antes, ele leva o cubo direto para a parede!',
        },
        {
          id: 'soltar', texto: 'Abra a garra em cima da plataforma.', imagem: 'img/passos/robo-08.png',
          explicacao: 'Abrir a garra agora? O cubo despenca no meio do caminho! Primeiro chegue até a plataforma.',
        },
      ],
      licao: {
        pergunta: 'O que se esconde dentro de "coloque na plataforma"?',
        texto: [
          'Quando a gente fala "coloque lá", tem um monte de passo escondido: virar, andar, soltar.',
          'O robô não adivinha nenhum deles. Cada frase dessas é uma instrução.',
          'Se a instrução de soltar não existir, o cubo fica preso na garra para sempre!',
        ],
        comparacao: {
          certa:  ['andar-plataforma', 'soltar'],
          errada: ['soltar', 'andar-plataforma'],
        },
        reflexao: [
          'O que acontece se ninguém mandar o robô soltar o cubo?',
          'Quantos passos escondidos tem em "guarde o brinquedo na caixa"?',
        ],
        reforco: 'Para a máquina, cada pedacinho do caminho é uma instrução!',
      },
    },

    /* ---------- FASE 5 · algoritmo: comece do comecinho (8 passos) ---------- */
    {
      id: 'fase-5',
      titulo: 'Comece do verdadeiro começo!',
      instrucao: 'Um robô desligado não faz nada. Comece do comecinho!',
      mascote: 'Faltou um passo bem no comecinho. Percebe qual?',
      passos: [
        { id: 'ligar', texto: 'Aperte o botão de ligar.', imagem: 'img/passos/robo-09.png' },
        {
          id: 'virar-cubo', texto: 'Vire o robô para o cubo.', imagem: 'img/passos/robo-05.png',
          explicacao: 'O robô está desligado! Robô sem energia não escuta instrução nenhuma.',
        },
        {
          id: 'abrir-garra', texto: 'Abra a garra.', imagem: 'img/passos/robo-04.png', ordemLivre: true,
          explicacao: 'O robô está desligado! Robô sem energia não escuta instrução nenhuma.',
        },
        {
          id: 'andar-cubo', texto: 'Ande até o cubo.', imagem: 'img/passos/robo-01.png',
          explicacao: {
            'virar-cubo':  'O robô anda sempre reto, para onde está virado. Sem virar antes, ele bate na parede!',
            'abrir-garra': 'Este robô sai andando já com a garra pronta. Abra a garra antes de mandar ele andar!',
          },
        },
        {
          id: 'fechar-garra', texto: 'Feche a garra no cubo.', imagem: 'img/passos/robo-02.png',
          explicacao: 'Fechar a garra daqui? Ela fecha no ar! Primeiro chegue perto do cubo.',
        },
        {
          id: 'virar-plataforma', texto: 'Vire o robô para a plataforma.', imagem: 'img/passos/robo-06.png',
          explicacao: 'Se o robô virar agora, o cubo fica para trás, sozinho na mesa! Primeiro feche a garra nele.',
        },
        {
          id: 'andar-plataforma', texto: 'Ande até a plataforma.', imagem: 'img/passos/robo-07.png',
          explicacao: 'O robô anda para onde está virado. Sem virar antes, ele leva o cubo direto para a parede!',
        },
        {
          id: 'soltar', texto: 'Abra a garra em cima da plataforma.', imagem: 'img/passos/robo-08.png',
          explicacao: 'Abrir a garra agora? O cubo despenca no meio do caminho! Primeiro chegue até a plataforma.',
        },
      ],
      licao: {
        pergunta: 'Esse passo a passo tem um nome?',
        texto: [
          'Uma lista de instruções completa e na ordem certa tem nome: algoritmo!',
          'E o seu começou do verdadeiro começo: ligar o robô — o passo mais esquecido do mundo.',
          'Quem cria um algoritmo pensa no começo, no meio e no fim.',
        ],
        comparacao: {
          certa:  ['ligar', 'abrir-garra'],
          errada: ['abrir-garra', 'ligar'],
        },
        reflexao: [
          'O nosso algoritmo esqueceu um passo lá no finzinho. Qual? Pense no botão…',
          'O que mais precisa ser "ligado" antes de funcionar na sua casa?',
        ],
        reforco: 'Algoritmo é o passo a passo completo — do ligar até o desligar!',
      },
    },

  ],
};

/* ============================================================
   SITUAÇÃO 3 · HORA DE ARRUMAR A MOCHILA
   Rotina escolar: acontece dentro da sala, e o professor pode
   fotografar o material (ou os próprios alunos arrumando) para
   recriar a situação no editor com as fotos da turma.
   ============================================================ */

const SITUACAO_MOCHILA = {
  formato: 'passo-a-passo/1',
  id: 'mochila',
  titulo: 'Arrumar a mochila',
  local: 'Escola',
  cor: '#3f7d3f',
  cliente: 'img/who3.png',
  cena: 'img/pic3.jpg',
  cenaReserva: '🎒',
  fundo: 'img/level3.jpg',
  fundoConclusao: 'img/win3.jpg',
  fases: [

    /* ---------- FASE 1 · a ordem importa (3 passos) ---------- */
    {
      id: 'fase-1',
      titulo: 'O sinal tocou! Guarde o material.',
      instrucao: 'Coloque os passos na ordem certa para nada ficar para trás.',
      mascote: 'O estojo precisa estar fechado antes de entrar na mochila.',
      passos: [
        { id: 'guardar-lapis', texto: 'Guarde o lápis no estojo.', imagem: 'img/passos/mochila-01.png' },
        {
          id: 'fechar-estojo', texto: 'Feche o estojo.', imagem: 'img/passos/mochila-03.png',
          explicacao: 'Fechar o estojo agora? O lápis fica de fora, perdido na mesa!',
        },
        {
          id: 'estojo-mochila', texto: 'Guarde o estojo na mochila.', imagem: 'img/passos/mochila-04.png',
          explicacao: 'O estojo ainda está aberto! Se ele entrar assim, os lápis se espalham dentro da mochila.',
        },
      ],
      licao: {
        pergunta: 'Por que a ordem dos passos importa?',
        texto: [
          'Para guardar o material, você colocou os passos em uma ordem.',
          'Se a gente troca os passos de lugar, dá confusão: o lápis pode ficar perdido na mesa!',
          'Com a ordem certa, nada fica para trás.',
        ],
        comparacao: {
          certa:  ['guardar-lapis', 'fechar-estojo'],
          errada: ['fechar-estojo', 'guardar-lapis'],
        },
        reflexao: [
          'O que acontece com o lápis se o estojo fechar antes de ele entrar?',
          'O que você guarda todo dia na hora da saída?',
        ],
        reforco: 'Quando os passos estão na ordem certa, nada fica para trás!',
      },
    },

    /* ---------- FASE 2 · lápis e borracha não brigam (5 passos) ---------- */
    {
      id: 'fase-2',
      titulo: 'Agora tem mais coisa na mesa!',
      instrucao: 'O lápis e a borracha não brigam: qualquer um pode entrar primeiro!',
      mascote: 'Lápis ou borracha primeiro? Aqui tanto faz!',
      passos: [
        { id: 'guardar-lapis',    texto: 'Guarde o lápis no estojo.',    imagem: 'img/passos/mochila-01.png' },
        { id: 'guardar-borracha', texto: 'Guarde a borracha no estojo.', imagem: 'img/passos/mochila-02.png', ordemLivre: true },
        {
          id: 'fechar-estojo', texto: 'Feche o estojo.', imagem: 'img/passos/mochila-03.png',
          explicacao: {
            'guardar-lapis':    'O lápis ainda está fora! Fechando agora, ele fica perdido na mesa.',
            'guardar-borracha': 'A borracha ainda está fora! Fechando agora, ela fica perdida na mesa.',
          },
        },
        {
          id: 'estojo-mochila', texto: 'Guarde o estojo na mochila.', imagem: 'img/passos/mochila-04.png',
          explicacao: 'O estojo aberto derrama tudo dentro da mochila! Feche o estojo primeiro.',
        },
        {
          id: 'fechar-mochila', texto: 'Feche o zíper da mochila.', imagem: 'img/passos/mochila-05.png',
          explicacao: 'Fechar a mochila sem o estojo dentro? Ele fica esquecido na escola!',
        },
      ],
      licao: {
        pergunta: 'Todo passo tem uma hora certa?',
        texto: [
          'O lápis e a borracha podiam entrar no estojo em qualquer ordem: um não precisa do outro.',
          'Mas fechar o estojo precisa esperar os dois estarem dentro.',
          'Um passo só espera aquilo de que ele precisa — os outros são livres!',
        ],
        comparacao: {
          certa:  ['guardar-borracha', 'guardar-lapis'],
          errada: ['fechar-estojo', 'guardar-borracha'],
        },
        reflexao: [
          'Quais cartas podiam trocar de lugar sem estragar nada?',
          'Por que fechar o estojo precisa esperar o lápis E a borracha?',
        ],
        reforco: 'Cada passo espera só os passos de que ele precisa — os outros são livres!',
      },
    },

    /* ---------- FASE 3 · o passo escondido: abrir a mochila (6 passos) ---------- */
    {
      id: 'fase-3',
      titulo: 'Tem um passo que ninguém fala…',
      instrucao: 'Primeiro termine o estojo. Depois é a vez da mochila!',
      mascote: 'Tem um passo que a gente faz sem perceber. Ele está aí!',
      passos: [
        { id: 'guardar-lapis',    texto: 'Guarde o lápis no estojo.',    imagem: 'img/passos/mochila-01.png' },
        { id: 'guardar-borracha', texto: 'Guarde a borracha no estojo.', imagem: 'img/passos/mochila-02.png', ordemLivre: true },
        {
          id: 'fechar-estojo', texto: 'Feche o estojo.', imagem: 'img/passos/mochila-03.png',
          explicacao: {
            'guardar-lapis':    'O lápis ainda está fora! Fechando agora, ele fica perdido na mesa.',
            'guardar-borracha': 'A borracha ainda está fora! Fechando agora, ela fica perdida na mesa.',
          },
        },
        {
          id: 'abrir-mochila', texto: 'Abra o zíper da mochila.', imagem: 'img/passos/mochila-06.png', ordemLivre: true,
          explicacao: 'Primeiro termine o estojo: lápis e borracha dentro! A mochila é a próxima parte.',
        },
        {
          id: 'estojo-mochila', texto: 'Guarde o estojo na mochila.', imagem: 'img/passos/mochila-04.png',
          explicacao: {
            'fechar-estojo': 'O estojo aberto derrama tudo dentro da mochila! Feche o estojo primeiro.',
            'abrir-mochila': 'A mochila está fechada! O estojo não atravessa o zíper — abra a mochila primeiro.',
          },
        },
        {
          id: 'fechar-mochila', texto: 'Feche o zíper da mochila.', imagem: 'img/passos/mochila-05.png',
          explicacao: 'Fechar a mochila sem o estojo dentro? Ele fica esquecido na escola!',
        },
      ],
      licao: {
        pergunta: 'Quem lembra de falar "abra a mochila"?',
        texto: [
          'Ninguém fala "abra a mochila" — todo mundo abre sem pensar.',
          'Mas se esse passo não existir, o estojo não entra: ele bate no zíper fechado!',
          'Os passos escondidos existem, mesmo quando ninguém fala deles.',
        ],
        comparacao: {
          certa:  ['abrir-mochila', 'estojo-mochila'],
          errada: ['estojo-mochila', 'abrir-mochila'],
        },
        reflexao: [
          'Qual passo desta fase você faz todo dia sem nem perceber?',
          'O que mais você abre sem pensar antes de guardar alguma coisa?',
        ],
        reforco: 'Os passos pequenos também contam — mesmo quando ninguém fala deles!',
      },
    },

    /* ---------- FASE 4 · algoritmo completo, até a mochila nas costas (8 passos) ---------- */
    {
      id: 'fase-4',
      titulo: 'Arrumação completa, do lápis às costas!',
      instrucao: 'Termine o estojo, abra a mochila, guarde tudo — e ela vai para as costas!',
      mascote: 'Do lápis até as costas: o passo a passo inteiro, sem pular nada.',
      passos: [
        { id: 'guardar-lapis',    texto: 'Guarde o lápis no estojo.',    imagem: 'img/passos/mochila-01.png' },
        { id: 'guardar-borracha', texto: 'Guarde a borracha no estojo.', imagem: 'img/passos/mochila-02.png', ordemLivre: true },
        {
          id: 'fechar-estojo', texto: 'Feche o estojo.', imagem: 'img/passos/mochila-03.png',
          explicacao: {
            'guardar-lapis':    'O lápis ainda está fora! Fechando agora, ele fica perdido na mesa.',
            'guardar-borracha': 'A borracha ainda está fora! Fechando agora, ela fica perdida na mesa.',
          },
        },
        {
          id: 'abrir-mochila', texto: 'Abra o zíper da mochila.', imagem: 'img/passos/mochila-06.png', ordemLivre: true,
          explicacao: 'Primeiro termine o estojo: lápis e borracha dentro! A mochila é a próxima parte.',
        },
        {
          id: 'estojo-mochila', texto: 'Guarde o estojo na mochila.', imagem: 'img/passos/mochila-04.png',
          explicacao: {
            'fechar-estojo': 'O estojo aberto derrama tudo dentro da mochila! Feche o estojo primeiro.',
            'abrir-mochila': 'A mochila está fechada! O estojo não atravessa o zíper — abra a mochila primeiro.',
          },
        },
        {
          id: 'caderno-mochila', texto: 'Guarde o caderno na mochila.', imagem: 'img/passos/mochila-07.png', ordemLivre: true,
          explicacao: {
            'abrir-mochila': 'A mochila está fechada! O caderno não atravessa o zíper — abra a mochila primeiro.',
            'fechar-estojo': 'Deixe o estojo prontinho e fechado antes de começar a encher a mochila.',
          },
        },
        {
          id: 'fechar-mochila', texto: 'Feche o zíper da mochila.', imagem: 'img/passos/mochila-05.png',
          explicacao: {
            'estojo-mochila':  'O estojo ainda está fora! Fechando agora, ele fica esquecido na escola.',
            'caderno-mochila': 'O caderno ainda está fora! Fechando agora, ele fica esquecido na escola.',
          },
        },
        {
          id: 'colocar-costas', texto: 'Coloque a mochila nas costas.', imagem: 'img/passos/mochila-08.png',
          explicacao: 'Mochila aberta nas costas? Vira uma chuva de lápis e caderno pelo chão!',
        },
      ],
      licao: {
        pergunta: 'Esse passo a passo tem um nome?',
        texto: [
          'Uma lista de passos completa e na ordem certa tem nome: algoritmo!',
          'Você montou um algoritmo de verdade — e ele foi até o fim: mochila fechada e nas costas.',
          'Quem cria um algoritmo pensa no começo, no meio e no fim.',
        ],
        comparacao: {
          certa:  ['fechar-mochila', 'colocar-costas'],
          errada: ['colocar-costas', 'fechar-mochila'],
        },
        reflexao: [
          'O que ainda falta fazer antes de sair da sala? Olhe para a cadeira…',
          'Qual algoritmo você segue amanhã de manhã antes de vir para a escola?',
        ],
        reforco: 'Algoritmo é um passo a passo completo, na ordem certa — com começo, meio e fim!',
      },
    },

  ],
};

/* As três situações prontas, na ordem em que aparecem no jogo. */
/* ============================================================
   SITUAÇÃO 4 · AJUDAR AS ABELHAS
   Natureza: a abelha segue um caminho que ela nunca pula —
   sair, achar a flor, coletar, voltar, guardar. Bom para a
   criança perceber que até um bicho pequeno segue um passo a
   passo completo.
   ============================================================ */

const SITUACAO_ABELHAS = {
  formato: 'passo-a-passo/1',
  id: 'abelhas',
  titulo: 'Ajudar as abelhas',
  local: 'Jardim',
  cor: '#a8820a',
  cliente: 'img/who4.png',
  cena: 'img/pic4.jpg',
  cenaReserva: '🐝',
  fundo: 'img/level4.jpg',
  fundoConclusao: 'img/win4.jpg',
  fases: [

    /* ---------- FASE 1 · a ordem importa (3 passos) ---------- */
    {
      id: 'fase-1',
      titulo: 'Ajude a abelha a buscar néctar!',
      instrucao: 'A abelha faz um passo de cada vez. Coloque na ordem!',
      mascote: 'O néctar mora dentro da flor. O que a abelha faz primeiro?',
      passos: [
        { id: 'voar-flor', texto: 'Voe até a flor.', imagem: 'img/passos/abelhas-01.png' },
        {
          id: 'nectar', texto: 'Colete o néctar da flor.', imagem: 'img/passos/abelhas-02.png',
          explicacao: 'Coletar néctar daqui? A flor está longe! Primeiro voe até ela.',
        },
        {
          id: 'voltar', texto: 'Leve o néctar para a colmeia.', imagem: 'img/passos/abelhas-03.png',
          explicacao: 'Voltar para a colmeia de mãos vazias? Primeiro colete o néctar!',
        },
      ],
      licao: {
        pergunta: 'Por que a ordem dos passos importa?',
        texto: [
          'Para levar néctar para casa, a abelha seguiu os passos em uma ordem.',
          'Se a ordem fica trocada, ela volta para a colmeia sem nada!',
          'Com a ordem certa, o néctar chega em casa.',
        ],
        comparacao: {
          certa:  ['voar-flor', 'nectar'],
          errada: ['nectar', 'voar-flor'],
        },
        reflexao: [
          'O que acontece se a abelha voltar para a colmeia antes de coletar o néctar?',
          'Que caminho você faz todo dia que só dá certo em uma ordem?',
        ],
        reforco: 'Quando os passos estão na ordem certa, a gente chega onde quer!',
      },
    },

    /* ---------- FASE 2 · passos livres e passos presos (5 passos) ---------- */
    {
      id: 'fase-2',
      titulo: 'Néctar e pólen: dá para levar os dois!',
      instrucao: 'Alguns passos podem trocar de lugar entre si. Outros não. Fique de olho!',
      mascote: 'Néctar ou pólen primeiro? Tanto faz — mas os dois só depois de chegar na flor!',
      passos: [
        { id: 'sair', texto: 'Saia da colmeia.', imagem: 'img/passos/abelhas-04.png' },
        {
          id: 'voar-flor', texto: 'Voe até a flor.', imagem: 'img/passos/abelhas-01.png',
          explicacao: 'A abelha ainda está dentro da colmeia! Primeiro ela precisa sair.',
        },
        {
          id: 'nectar', texto: 'Colete o néctar da flor.', imagem: 'img/passos/abelhas-02.png',
          explicacao: 'Coletar néctar daqui? A flor está longe! Primeiro voe até ela.',
        },
        {
          id: 'polen', texto: 'Junte o pólen nas patinhas.', imagem: 'img/passos/abelhas-05.png', ordemLivre: true,
          explicacao: 'Juntar pólen daqui? A flor está longe! Primeiro voe até ela.',
        },
        {
          id: 'voltar', texto: 'Leve tudo para a colmeia.', imagem: 'img/passos/abelhas-03.png',
          explicacao: {
            nectar: 'Voltar agora? O néctar ficou na flor! Colete antes de ir embora.',
            polen:  'Voltar agora? O pólen ficou na flor! Junte nas patinhas antes de ir embora.',
          },
        },
      ],
      licao: {
        pergunta: 'Todo passo tem uma hora certa?',
        texto: [
          'O néctar e o pólen podiam ser coletados em qualquer ordem: um não precisa do outro.',
          'Mas voltar para a colmeia precisa esperar os dois.',
          'Um passo só espera aquilo de que ele precisa — os outros são livres!',
        ],
        comparacao: {
          certa:  ['polen', 'nectar'],
          errada: ['voltar', 'nectar'],
        },
        reflexao: [
          'Quais cartas podiam trocar de lugar sem estragar nada?',
          'Por que voltar para a colmeia não pode vir antes de coletar?',
        ],
        reforco: 'Cada passo espera só os passos de que ele precisa — os outros são livres!',
      },
    },

    /* ---------- FASE 3 · o passo escondido (6 passos) ---------- */
    {
      id: 'fase-3',
      titulo: 'Tem um passo que ninguém fala…',
      instrucao: 'Antes de voar, a abelha precisa saber para onde. Procure a flor!',
      mascote: 'Voar para onde? Tem um passo escondido aqui no meio.',
      passos: [
        { id: 'sair', texto: 'Saia da colmeia.', imagem: 'img/passos/abelhas-04.png' },
        {
          id: 'procurar', texto: 'Procure uma flor aberta.', imagem: 'img/passos/abelhas-06.png',
          explicacao: 'De dentro da colmeia não dá para ver as flores! Primeiro saia.',
        },
        {
          id: 'voar-flor', texto: 'Voe até a flor.', imagem: 'img/passos/abelhas-01.png',
          explicacao: 'Voar para onde? A abelha ainda não achou nenhuma flor. Procure primeiro!',
        },
        {
          id: 'nectar', texto: 'Colete o néctar da flor.', imagem: 'img/passos/abelhas-02.png',
          explicacao: 'Coletar néctar daqui? A flor está longe! Primeiro voe até ela.',
        },
        {
          id: 'polen', texto: 'Junte o pólen nas patinhas.', imagem: 'img/passos/abelhas-05.png', ordemLivre: true,
          explicacao: 'Juntar pólen daqui? A flor está longe! Primeiro voe até ela.',
        },
        {
          id: 'voltar', texto: 'Leve tudo para a colmeia.', imagem: 'img/passos/abelhas-03.png',
          explicacao: {
            nectar: 'Voltar agora? O néctar ficou na flor! Colete antes de ir embora.',
            polen:  'Voltar agora? O pólen ficou na flor! Junte nas patinhas antes de ir embora.',
          },
        },
      ],
      licao: {
        pergunta: 'Quem lembra de falar "procure a flor"?',
        texto: [
          'Quando alguém conta o que a abelha faz, ninguém fala "procure uma flor aberta".',
          'Esse passo fica escondido: parece óbvio, então a gente pula.',
          'Mas sem ele a abelha voa sem rumo e não acha néctar nenhum!',
        ],
        comparacao: {
          certa:  ['procurar', 'voar-flor'],
          errada: ['voar-flor', 'procurar'],
        },
        reflexao: [
          'Qual passo desta fase você esqueceria de contar para alguém?',
          'Para onde a abelha iria se voasse antes de procurar a flor?',
        ],
        reforco: 'Os passos pequenos também contam — mesmo quando ninguém fala deles!',
      },
    },

    /* ---------- FASE 4 · algoritmo, do começo ao fim (8 passos) ---------- */
    {
      id: 'fase-4',
      titulo: 'Da colmeia até o mel guardado!',
      instrucao: 'Sair, buscar, voltar — e terminar guardando tudo no favo!',
      mascote: 'Começo, meio e fim: o trabalho só acaba quando o favo está fechado.',
      passos: [
        { id: 'sair', texto: 'Saia da colmeia.', imagem: 'img/passos/abelhas-04.png' },
        {
          id: 'procurar', texto: 'Procure uma flor aberta.', imagem: 'img/passos/abelhas-06.png',
          explicacao: 'De dentro da colmeia não dá para ver as flores! Primeiro saia.',
        },
        {
          id: 'voar-flor', texto: 'Voe até a flor.', imagem: 'img/passos/abelhas-01.png',
          explicacao: 'Voar para onde? A abelha ainda não achou nenhuma flor. Procure primeiro!',
        },
        {
          id: 'nectar', texto: 'Colete o néctar da flor.', imagem: 'img/passos/abelhas-02.png',
          explicacao: 'Coletar néctar daqui? A flor está longe! Primeiro voe até ela.',
        },
        {
          id: 'polen', texto: 'Junte o pólen nas patinhas.', imagem: 'img/passos/abelhas-05.png', ordemLivre: true,
          explicacao: 'Juntar pólen daqui? A flor está longe! Primeiro voe até ela.',
        },
        {
          id: 'voltar', texto: 'Leve tudo para a colmeia.', imagem: 'img/passos/abelhas-03.png',
          explicacao: {
            nectar: 'Voltar agora? O néctar ficou na flor! Colete antes de ir embora.',
            polen:  'Voltar agora? O pólen ficou na flor! Junte nas patinhas antes de ir embora.',
          },
        },
        {
          id: 'guardar', texto: 'Guarde o néctar no favo.', imagem: 'img/passos/abelhas-07.png',
          explicacao: 'Guardar o néctar onde? A abelha ainda está lá fora! Primeiro volte para a colmeia.',
        },
        {
          id: 'tampar', texto: 'Feche o favo com cera.', imagem: 'img/passos/abelhas-08.png',
          explicacao: 'Fechar o favo vazio? Guarde o néctar dentro antes de tampar!',
        },
      ],
      licao: {
        pergunta: 'Esse passo a passo tem um nome?',
        texto: [
          'Uma lista de instruções completa e na ordem certa tem nome: algoritmo!',
          'E o seu foi até o fim de verdade: guardar o néctar e fechar o favo para virar mel.',
          'Quem cria um algoritmo pensa no começo, no meio e no fim.',
        ],
        comparacao: {
          certa:  ['guardar', 'tampar'],
          errada: ['tampar', 'guardar'],
        },
        reflexao: [
          'Por que fechar o favo também faz parte do passo a passo?',
          'Qual outro algoritmo você vê na natureza?',
        ],
        reforco: 'Algoritmo é um passo a passo completo, na ordem certa — com começo, meio e fim!',
      },
    },

  ],
};

const SITUACOES = [SITUACAO_SANDUICHE, SITUACAO_ROBO, SITUACAO_MOCHILA, SITUACAO_ABELHAS];

/* ============================================================
   EMOJI DE RESERVA DE CADA IMAGEM

   Os desenhos de img/ ainda não existem. Sem reserva, toda carta
   seria um retângulo bege vazio e a criança jogaria lendo só a
   legenda — que é justamente o contrário da ideia do jogo, onde a
   figura carrega o passo para quem ainda lê devagar.

   A tabela é por ARQUIVO, não por passo, porque a mesma imagem é
   reaproveitada em todas as fases em que o passo aparece (as 38
   imagens cobrem os 96 passos). Trocar um
   emoji aqui troca em todas as fases de uma vez.

   Regra ao escolher: dentro de UMA MESMA FASE, dois passos nunca
   podem ter o mesmo emoji — a criança precisa distinguir as cartas
   de relance. Entre fases diferentes, repetir é livre.

   O laço logo abaixo copia o emoji para dentro de cada passo, de
   modo que o objeto que o jogo lê fica idêntico ao que o editor do
   professor exporta: campo imagemReserva em cada passo, um formato
   só. Quando as ilustrações ficarem prontas, nada muda aqui — o
   emoji simplesmente para de aparecer.
   ============================================================ */

const EMOJI_RESERVA = {
  // sanduíche
  'img/passos/sanduiche-01.png': '🍞',   // duas fatias de pão na mesa
  'img/passos/sanduiche-02.png': '🫓',   // queijo já em cima da fatia
  'img/passos/sanduiche-03.png': '🥓',   // presunto
  'img/passos/sanduiche-04.png': '🥪',   // sanduíche fechado
  'img/passos/sanduiche-05.png': '🛍️',   // saco de pão fechado
  'img/passos/sanduiche-06.png': '🧈',   // pote de manteiga
  'img/passos/sanduiche-07.png': '👐',   // abrindo o saco
  'img/passos/sanduiche-08.png': '🍞',   // fatias saindo do saco
  'img/passos/sanduiche-09.png': '🫓',   // fatia com a manteiga espalhada
  'img/passos/sanduiche-10.png': '🧀',   // fatia de queijo na mão
  'img/passos/sanduiche-11.png': '🔪',   // faca sem ponta
  'img/passos/sanduiche-12.png': '🫙',   // pote sendo aberto
  'img/passos/sanduiche-13.png': '🧹',   // guardar tudo, mesa limpa

  // robô
  'img/passos/robo-01.png': '🚶',        // andando até o cubo
  'img/passos/robo-02.png': '✊',        // garra fechando no cubo
  'img/passos/robo-03.png': '⬇️',        // pousando o cubo
  'img/passos/robo-04.png': '🖐️',        // garra abrindo, vazia
  'img/passos/robo-05.png': '🔄',        // virando para o cubo
  'img/passos/robo-06.png': '↩️',        // virando para a plataforma
  'img/passos/robo-07.png': '🏃',        // andando com o cubo
  'img/passos/robo-08.png': '👐',        // soltando o cubo na plataforma
  'img/passos/robo-09.png': '⚡',        // apertando o botão de ligar

  // mochila
  'img/passos/mochila-01.png': '✏️',      // lápis no estojo
  'img/passos/mochila-02.png': '🧽',      // borracha no estojo
  'img/passos/mochila-03.png': '🧰',      // estojo fechado
  'img/passos/mochila-04.png': '🎒',      // estojo entrando na mochila
  'img/passos/mochila-05.png': '🔒',      // zíper da mochila fechando
  'img/passos/mochila-06.png': '🔓',      // zíper da mochila abrindo
  'img/passos/mochila-07.png': '📒',      // caderno na mochila
  'img/passos/mochila-08.png': '🧍',      // mochila nas costas

  // abelhas
  'img/passos/abelhas-01.png': '🌻',      // voando até a flor
  'img/passos/abelhas-02.png': '💧',      // sugando o néctar
  'img/passos/abelhas-03.png': '🏠',      // voltando para a colmeia
  'img/passos/abelhas-04.png': '🐝',      // saindo da colmeia
  'img/passos/abelhas-05.png': '🌼',      // pólen nas patinhas
  'img/passos/abelhas-06.png': '👀',      // procurando uma flor aberta
  'img/passos/abelhas-07.png': '🍯',      // néctar entrando no favo
  'img/passos/abelhas-08.png': '🕯️',      // favo fechado com cera
};

for (const situacao of SITUACOES) {
  for (const fase of situacao.fases) {
    for (const passo of fase.passos) {
      if (!passo.imagemReserva && EMOJI_RESERVA[passo.imagem]) {
        passo.imagemReserva = EMOJI_RESERVA[passo.imagem];
      }
    }
  }
}
