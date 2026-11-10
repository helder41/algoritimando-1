/* ============================================================
   em-progresso.js — protótipos de chamados novos.

   Ficam na seção "Em progresso" da central, atrás de senha, para
   testar a base dos níveis (passos, dependências, explicações e
   lição) ANTES de fazer as imagens. O formato é EXATAMENTE o dos
   chamados do jogo (situacoes.js) e do .json do professor: quando
   um protótipo ficar bom, ele só muda de arquivo.

   As imagens apontam para os nomes que elas vão ter
   (img/passos/<chamado>-NN.webp, img/licoes/<chamado>-N.webp).
   Enquanto não existem, a carta mostra "ilustração do passo".

   O progresso destes chamados é guardado à parte (chave "prof:"):
   não soma estrelas, não conta como chamado concluído e não
   leva à promoção.

   Três protótipos já viraram chamados do jogo (lavar as mãos,
   atravessar a rua e fazer uma limonada: ver situacoes.js). Os
   dois daqui ficaram para ajuste; o que falta em cada um está em
   docs/revisao-chamados-novos.md:
     dentes    — começo, meio e fim (repete lições que já existem;
                 a fase 4 troca cartas detalhadas por resumidas)
     planta    — passos escondidos (ideia repetida; a lição de
                 "esperar" não tem carta)
   ============================================================ */

'use strict';

/* ================= ESCOVAR OS DENTES ================= */

const PROTO_DENTES = {
  formato: 'passo-a-passo/1',
  id: 'dentes',
  titulo: 'Escovar os dentes',
  local: 'Banheiro',
  area: 'casa',
  cor: '#3f8fb5',
  montagem: 'tirinha',
  fases: [
    {
      id: 'fase-1',
      titulo: 'Hora de escovar os dentes!',
      instrucao: 'Arraste as cartas para os espaços — ou toque na carta e depois no espaço.',
      mascote: 'Três passos. Qual precisa vir primeiro?',
      passos: [
        { id: 'pegar-escova', texto: 'Pegue a escova de dentes.', imagem: 'img/passos/dentes-01.webp', dependeDe: [] },
        {
          id: 'por-pasta', texto: 'Coloque pasta na escova.', imagem: 'img/passos/dentes-04.webp', dependeDe: ['pegar-escova'],
          explicacao: 'Pasta em qual escova? Ela ainda está no copo! Pegue a escova primeiro.',
        },
        {
          id: 'escovar', texto: 'Escove os dentes.', imagem: 'img/passos/dentes-05.webp', dependeDe: ['por-pasta'],
          explicacao: 'Escovar sem pasta não deixa os dentes limpinhos. Coloque a pasta antes!',
        },
      ],
      licao: {
        pergunta: 'Por que um passo vem antes do outro?',
        imagem: 'img/licoes/dentes-1.webp',
        texto: [
          'Cada passo prepara o próximo: sem a escova na mão, não dá para pôr a pasta.',
          'E sem a pasta, a escovação não limpa direito. A ordem faz o trabalho dar certo.',
        ],
        reflexao: [
          'O que aconteceria se você tentasse escovar antes de pegar a escova?',
          'Que outra tarefa sua tem um passo que prepara o outro?',
        ],
      },
    },
    {
      id: 'fase-2',
      titulo: 'A pasta também precisa ser aberta!',
      instrucao: 'Alguns passos podem trocar de lugar entre si. Outros não. Fique de olho!',
      mascote: 'Pegar a escova e pegar a pasta: tanto faz qual vem antes!',
      passos: [
        { id: 'pegar-escova', texto: 'Pegue a escova de dentes.', imagem: 'img/passos/dentes-01.webp', dependeDe: [] },
        { id: 'pegar-pasta', texto: 'Pegue o tubo de pasta.', imagem: 'img/passos/dentes-02.webp', dependeDe: [] },
        {
          id: 'abrir-pasta', texto: 'Abra a tampa da pasta.', imagem: 'img/passos/dentes-03.webp', dependeDe: ['pegar-pasta'],
          explicacao: 'Abrir o quê? O tubo ainda está na pia. Pegue a pasta primeiro!',
        },
        {
          id: 'por-pasta', texto: 'Coloque pasta na escova.', imagem: 'img/passos/dentes-04.webp', dependeDe: ['pegar-escova', 'abrir-pasta'],
          explicacao: {
            'pegar-escova': 'A pasta vai cair na pia! Pegue a escova antes.',
            'abrir-pasta': 'Com a tampa fechada, a pasta não sai. Abra o tubo antes!',
          },
        },
        {
          id: 'escovar', texto: 'Escove os dentes.', imagem: 'img/passos/dentes-05.webp', dependeDe: ['por-pasta'],
          explicacao: 'Escovar sem pasta não deixa os dentes limpinhos. Coloque a pasta antes!',
        },
      ],
      licao: {
        pergunta: 'Precisa ser sempre nessa ordem?',
        imagem: 'img/licoes/dentes-2.webp',
        texto: [
          'Pegar a escova e pegar a pasta podiam vir em qualquer ordem: um não depende do outro.',
          'Mas colocar a pasta precisa esperar os dois: a escova na mão e o tubo aberto.',
        ],
        reflexao: [
          'Quais passos daqui você poderia trocar de lugar?',
          'E quais nunca podem trocar? Por quê?',
        ],
      },
    },
    {
      id: 'fase-3',
      titulo: 'Escovar não termina na escova!',
      instrucao: 'Depois de escovar ainda tem passos. Não esqueça nenhum!',
      mascote: 'Quando a escova sai da boca, ainda falta coisa. Pense no fim!',
      passos: [
        { id: 'pegar-escova', texto: 'Pegue a escova de dentes.', imagem: 'img/passos/dentes-01.webp', dependeDe: [] },
        { id: 'pegar-pasta', texto: 'Pegue o tubo de pasta.', imagem: 'img/passos/dentes-02.webp', dependeDe: [] },
        {
          id: 'abrir-pasta', texto: 'Abra a tampa da pasta.', imagem: 'img/passos/dentes-03.webp', dependeDe: ['pegar-pasta'],
          explicacao: 'Abrir o quê? O tubo ainda está na pia. Pegue a pasta primeiro!',
        },
        {
          id: 'por-pasta', texto: 'Coloque pasta na escova.', imagem: 'img/passos/dentes-04.webp', dependeDe: ['pegar-escova', 'abrir-pasta'],
          explicacao: {
            'pegar-escova': 'A pasta vai cair na pia! Pegue a escova antes.',
            'abrir-pasta': 'Com a tampa fechada, a pasta não sai. Abra o tubo antes!',
          },
        },
        {
          id: 'escovar', texto: 'Escove os dentes.', imagem: 'img/passos/dentes-05.webp', dependeDe: ['por-pasta'],
          explicacao: 'Escovar sem pasta não deixa os dentes limpinhos. Coloque a pasta antes!',
        },
        {
          id: 'cuspir', texto: 'Cuspa a espuma na pia.', imagem: 'img/passos/dentes-06.webp', dependeDe: ['escovar'],
          explicacao: 'Cuspir agora? Ainda nem tem espuma na boca! Escove primeiro.',
        },
        {
          id: 'enxaguar', texto: 'Enxágue a boca com água.', imagem: 'img/passos/dentes-07.webp', dependeDe: ['cuspir'],
          explicacao: 'Água na boca cheia de espuma? Vira uma bagunça! Cuspa a espuma antes.',
        },
        {
          id: 'lavar-escova', texto: 'Lave a escova na água.', imagem: 'img/passos/dentes-08.webp', dependeDe: ['escovar'],
          explicacao: 'Lavar a escova agora? Você ainda vai usá-la! Lave depois de escovar.',
        },
      ],
      licao: {
        pergunta: 'Quando um algoritmo termina?',
        imagem: 'img/licoes/dentes-3.webp',
        texto: [
          'Escovar os dentes não acaba quando a escova sai da boca.',
          'Cuspir, enxaguar e lavar a escova também fazem parte. Um algoritmo completo pensa no fim, não só no meio.',
        ],
        reflexao: [
          'Qual passo do fim você costuma esquecer?',
          'O que acontece com a escova se ninguém lavar?',
        ],
      },
    },
    {
      id: 'fase-4',
      titulo: 'Deixe a pia arrumada!',
      instrucao: 'Tudo que foi aberto precisa ser fechado. Tudo que foi pego, guardado!',
      mascote: 'Fechar a pasta pode ser antes ou depois de escovar. Mas quando ela já pode ser fechada?',
      passos: [
        { id: 'pegar-escova', texto: 'Pegue a escova de dentes.', imagem: 'img/passos/dentes-01.webp', dependeDe: [] },
        { id: 'pegar-pasta', texto: 'Pegue o tubo de pasta.', imagem: 'img/passos/dentes-02.webp', dependeDe: [] },
        {
          id: 'abrir-pasta', texto: 'Abra a tampa da pasta.', imagem: 'img/passos/dentes-03.webp', dependeDe: ['pegar-pasta'],
          explicacao: 'Abrir o quê? O tubo ainda está na pia. Pegue a pasta primeiro!',
        },
        {
          id: 'por-pasta', texto: 'Coloque pasta na escova.', imagem: 'img/passos/dentes-04.webp', dependeDe: ['pegar-escova', 'abrir-pasta'],
          explicacao: {
            'pegar-escova': 'A pasta vai cair na pia! Pegue a escova antes.',
            'abrir-pasta': 'Com a tampa fechada, a pasta não sai. Abra o tubo antes!',
          },
        },
        {
          id: 'fechar-pasta', texto: 'Feche a tampa da pasta.', imagem: 'img/passos/dentes-09.webp', dependeDe: ['por-pasta'],
          explicacao: 'Fechar agora? A pasta ainda não foi para a escova!',
        },
        {
          id: 'escovar', texto: 'Escove os dentes.', imagem: 'img/passos/dentes-05.webp', dependeDe: ['por-pasta'],
          explicacao: 'Escovar sem pasta não deixa os dentes limpinhos. Coloque a pasta antes!',
        },
        {
          id: 'enxaguar', texto: 'Cuspa e enxágue a boca.', imagem: 'img/passos/dentes-07.webp', dependeDe: ['escovar'],
          explicacao: 'Enxaguar antes de escovar? A espuma ainda nem apareceu!',
        },
        {
          id: 'guardar', texto: 'Lave e guarde a escova no copo.', imagem: 'img/passos/dentes-10.webp', dependeDe: ['escovar'],
          explicacao: 'Guardar a escova antes de escovar? Ela nem foi usada!',
        },
      ],
      licao: {
        pergunta: 'Começo, meio e fim',
        imagem: 'img/licoes/dentes-4.webp',
        texto: [
          'Agora o seu algoritmo vai do começo ao fim: preparar, escovar e arrumar.',
          'Fechar a pasta podia ser antes ou depois de escovar — mas só depois de usar a pasta.',
        ],
        reflexao: [
          'Por que é bom deixar a pia arrumada no fim?',
          'Conte para um colega o seu algoritmo de escovar os dentes, sem pular nenhum passo.',
        ],
      },
    },
  ],
};

/* ================= PLANTAR UMA SEMENTE ================= */

const PROTO_PLANTA = {
  formato: 'passo-a-passo/1',
  id: 'planta',
  titulo: 'Plantar uma semente',
  local: 'Horta',
  area: 'jardim',
  cor: '#5f8f3a',
  montagem: 'tirinha',
  fases: [
    {
      id: 'fase-1',
      titulo: 'Vamos plantar!',
      instrucao: 'Arraste as cartas para os espaços — ou toque na carta e depois no espaço.',
      mascote: 'A semente precisa de uma casa antes de ganhar água.',
      passos: [
        { id: 'terra', texto: 'Coloque terra no vaso.', imagem: 'img/passos/planta-02.webp', dependeDe: [] },
        {
          id: 'semente', texto: 'Coloque a semente na terra.', imagem: 'img/passos/planta-04.webp', dependeDe: ['terra'],
          explicacao: 'Semente num vaso vazio não tem onde crescer. Coloque a terra primeiro!',
        },
        {
          id: 'regar', texto: 'Regue a terra.', imagem: 'img/passos/planta-06.webp', dependeDe: ['semente'],
          explicacao: 'Regar agora molha só a terra: a semente ainda nem foi plantada!',
        },
      ],
      licao: {
        pergunta: 'O que a semente precisa primeiro?',
        imagem: 'img/licoes/planta-1.webp',
        texto: [
          'A semente precisa de terra para ficar, e depois de água para crescer.',
          'Cada passo deixa tudo pronto para o próximo.',
        ],
        reflexao: [
          'O que aconteceria com a semente sem terra?',
          'E sem água?',
        ],
      },
    },
    {
      id: 'fase-2',
      titulo: 'A semente precisa ficar coberta!',
      instrucao: 'Tem passos que a gente esquece porque são pequenos. Encontre todos!',
      mascote: 'Semente em cima da terra fica no sol e os passarinhos comem. O que falta?',
      passos: [
        { id: 'vaso', texto: 'Pegue um vaso.', imagem: 'img/passos/planta-01.webp', dependeDe: [] },
        {
          id: 'terra', texto: 'Coloque terra no vaso.', imagem: 'img/passos/planta-02.webp', dependeDe: ['vaso'],
          explicacao: 'Terra onde? O vaso ainda não está aqui. Pegue o vaso primeiro!',
        },
        {
          id: 'buraco', texto: 'Faça um buraquinho na terra.', imagem: 'img/passos/planta-03.webp', dependeDe: ['terra'],
          explicacao: 'Buraquinho em quê? Ainda não tem terra no vaso!',
        },
        {
          id: 'semente', texto: 'Coloque a semente no buraquinho.', imagem: 'img/passos/planta-04.webp', dependeDe: ['buraco'],
          explicacao: 'Sem o buraquinho, a semente fica por cima da terra. Faça o buraquinho antes!',
        },
        {
          id: 'cobrir', texto: 'Cubra a semente com terra.', imagem: 'img/passos/planta-05.webp', dependeDe: ['semente'],
          explicacao: 'Cobrir o quê? A semente ainda não está no buraquinho!',
        },
      ],
      licao: {
        pergunta: 'Cadê os passos escondidos?',
        imagem: 'img/licoes/planta-2.webp',
        texto: [
          'Fazer o buraquinho e cobrir a semente são passos pequenos — e fáceis de esquecer.',
          'Quando a gente explica para alguém, precisa contar até os passos pequenos. Senão, a semente fica de fora!',
        ],
        reflexao: [
          'Qual passo você teria esquecido se fosse explicar sem as cartas?',
          'Por que a semente precisa ficar coberta?',
        ],
      },
    },
    {
      id: 'fase-3',
      titulo: 'Cuide da plantinha!',
      instrucao: 'Depois de plantar, a semente precisa de água e de luz.',
      mascote: 'Regar e levar para o sol: tanto faz qual vem antes. Mas só depois de cobrir!',
      passos: [
        { id: 'vaso', texto: 'Pegue um vaso.', imagem: 'img/passos/planta-01.webp', dependeDe: [] },
        {
          id: 'terra', texto: 'Coloque terra no vaso.', imagem: 'img/passos/planta-02.webp', dependeDe: ['vaso'],
          explicacao: 'Terra onde? O vaso ainda não está aqui. Pegue o vaso primeiro!',
        },
        {
          id: 'buraco', texto: 'Faça um buraquinho na terra.', imagem: 'img/passos/planta-03.webp', dependeDe: ['terra'],
          explicacao: 'Buraquinho em quê? Ainda não tem terra no vaso!',
        },
        {
          id: 'semente', texto: 'Coloque a semente no buraquinho.', imagem: 'img/passos/planta-04.webp', dependeDe: ['buraco'],
          explicacao: 'Sem o buraquinho, a semente fica por cima da terra. Faça o buraquinho antes!',
        },
        {
          id: 'cobrir', texto: 'Cubra a semente com terra.', imagem: 'img/passos/planta-05.webp', dependeDe: ['semente'],
          explicacao: 'Cobrir o quê? A semente ainda não está no buraquinho!',
        },
        {
          id: 'regar', texto: 'Regue a terra.', imagem: 'img/passos/planta-06.webp', dependeDe: ['cobrir'],
          explicacao: 'Regar com a semente descoberta? A água pode levar a semente embora! Cubra antes.',
        },
        {
          id: 'sol', texto: 'Coloque o vaso perto da janela.', imagem: 'img/passos/planta-07.webp', dependeDe: ['cobrir'],
          explicacao: 'Levar o vaso agora? A semente ainda não foi plantada!',
        },
      ],
      licao: {
        pergunta: 'O algoritmo acaba quando a gente para?',
        imagem: 'img/licoes/planta-3.webp',
        texto: [
          'Plantar termina com água e luz — e depois a semente trabalha sozinha por alguns dias.',
          'Alguns algoritmos têm um passo de esperar. Esperar também faz parte!',
        ],
        reflexao: [
          'Quantos dias você acha que a semente leva para brotar?',
          'O que precisa ser repetido todos os dias para a planta crescer?',
        ],
      },
    },
  ],
};

const SITUACOES_EM_PROGRESSO = [PROTO_DENTES, PROTO_PLANTA];
