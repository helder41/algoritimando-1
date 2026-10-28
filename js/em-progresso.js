/* ============================================================
   em-progresso.js — protótipos de chamados novos.

   Ficam na seção "Em progresso" da central, atrás de senha, para
   testar a base dos níveis (passos, dependências, explicações e
   lição) ANTES de fazer as imagens. O formato é EXATAMENTE o dos
   chamados do jogo (situacoes.js) e do .json do professor: quando
   um protótipo ficar bom, ele só muda de arquivo.

   As imagens apontam para os nomes que elas vão ter
   (img/passos/<chamado>-NN.png, img/licoes/<chamado>-N.png).
   Enquanto não existem, a carta mostra "ilustração do passo".

   O progresso destes chamados é guardado à parte (chave "prof:"):
   não soma estrelas, não conta como chamado concluído e não
   leva à promoção.

   Cada chamado treina uma ideia de algoritmo:
     dentes    — começo, meio e fim (completo)
     maos      — repetição ("esfregue contando até 20")
     planta    — passos escondidos
     rua       — condição ("SE o boneco estiver verde")
     limonada  — passos que podem acontecer ao mesmo tempo
   ============================================================ */

'use strict';

/* ================= ESCOVAR OS DENTES ================= */

const PROTO_DENTES = {
  formato: 'passo-a-passo/1',
  id: 'dentes',
  titulo: 'Escovar os dentes',
  local: 'Banheiro',
  cor: '#3f8fb5',
  montagem: 'tirinha',
  fases: [
    {
      id: 'fase-1',
      titulo: 'Hora de escovar os dentes!',
      instrucao: 'Arraste as cartas para os espaços — ou toque na carta e depois no espaço.',
      mascote: 'Três passos. Qual precisa vir primeiro?',
      passos: [
        { id: 'pegar-escova', texto: 'Pegue a escova de dentes.', imagem: 'img/passos/dentes-01.png', dependeDe: [] },
        {
          id: 'por-pasta', texto: 'Coloque pasta na escova.', imagem: 'img/passos/dentes-04.png', dependeDe: ['pegar-escova'],
          explicacao: 'Pasta em qual escova? Ela ainda está no copo! Pegue a escova primeiro.',
        },
        {
          id: 'escovar', texto: 'Escove os dentes.', imagem: 'img/passos/dentes-05.png', dependeDe: ['por-pasta'],
          explicacao: 'Escovar sem pasta não deixa os dentes limpinhos. Coloque a pasta antes!',
        },
      ],
      licao: {
        pergunta: 'Por que um passo vem antes do outro?',
        imagem: 'img/licoes/dentes-1.png',
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
        { id: 'pegar-escova', texto: 'Pegue a escova de dentes.', imagem: 'img/passos/dentes-01.png', dependeDe: [] },
        { id: 'pegar-pasta', texto: 'Pegue o tubo de pasta.', imagem: 'img/passos/dentes-02.png', dependeDe: [] },
        {
          id: 'abrir-pasta', texto: 'Abra a tampa da pasta.', imagem: 'img/passos/dentes-03.png', dependeDe: ['pegar-pasta'],
          explicacao: 'Abrir o quê? O tubo ainda está na pia. Pegue a pasta primeiro!',
        },
        {
          id: 'por-pasta', texto: 'Coloque pasta na escova.', imagem: 'img/passos/dentes-04.png', dependeDe: ['pegar-escova', 'abrir-pasta'],
          explicacao: {
            'pegar-escova': 'A pasta vai cair na pia! Pegue a escova antes.',
            'abrir-pasta': 'Com a tampa fechada, a pasta não sai. Abra o tubo antes!',
          },
        },
        {
          id: 'escovar', texto: 'Escove os dentes.', imagem: 'img/passos/dentes-05.png', dependeDe: ['por-pasta'],
          explicacao: 'Escovar sem pasta não deixa os dentes limpinhos. Coloque a pasta antes!',
        },
      ],
      licao: {
        pergunta: 'Precisa ser sempre nessa ordem?',
        imagem: 'img/licoes/dentes-2.png',
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
        { id: 'pegar-escova', texto: 'Pegue a escova de dentes.', imagem: 'img/passos/dentes-01.png', dependeDe: [] },
        { id: 'pegar-pasta', texto: 'Pegue o tubo de pasta.', imagem: 'img/passos/dentes-02.png', dependeDe: [] },
        {
          id: 'abrir-pasta', texto: 'Abra a tampa da pasta.', imagem: 'img/passos/dentes-03.png', dependeDe: ['pegar-pasta'],
          explicacao: 'Abrir o quê? O tubo ainda está na pia. Pegue a pasta primeiro!',
        },
        {
          id: 'por-pasta', texto: 'Coloque pasta na escova.', imagem: 'img/passos/dentes-04.png', dependeDe: ['pegar-escova', 'abrir-pasta'],
          explicacao: {
            'pegar-escova': 'A pasta vai cair na pia! Pegue a escova antes.',
            'abrir-pasta': 'Com a tampa fechada, a pasta não sai. Abra o tubo antes!',
          },
        },
        {
          id: 'escovar', texto: 'Escove os dentes.', imagem: 'img/passos/dentes-05.png', dependeDe: ['por-pasta'],
          explicacao: 'Escovar sem pasta não deixa os dentes limpinhos. Coloque a pasta antes!',
        },
        {
          id: 'cuspir', texto: 'Cuspa a espuma na pia.', imagem: 'img/passos/dentes-06.png', dependeDe: ['escovar'],
          explicacao: 'Cuspir agora? Ainda nem tem espuma na boca! Escove primeiro.',
        },
        {
          id: 'enxaguar', texto: 'Enxágue a boca com água.', imagem: 'img/passos/dentes-07.png', dependeDe: ['cuspir'],
          explicacao: 'Água na boca cheia de espuma? Vira uma bagunça! Cuspa a espuma antes.',
        },
        {
          id: 'lavar-escova', texto: 'Lave a escova na água.', imagem: 'img/passos/dentes-08.png', dependeDe: ['escovar'],
          explicacao: 'Lavar a escova agora? Você ainda vai usá-la! Lave depois de escovar.',
        },
      ],
      licao: {
        pergunta: 'Quando um algoritmo termina?',
        imagem: 'img/licoes/dentes-3.png',
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
        { id: 'pegar-escova', texto: 'Pegue a escova de dentes.', imagem: 'img/passos/dentes-01.png', dependeDe: [] },
        { id: 'pegar-pasta', texto: 'Pegue o tubo de pasta.', imagem: 'img/passos/dentes-02.png', dependeDe: [] },
        {
          id: 'abrir-pasta', texto: 'Abra a tampa da pasta.', imagem: 'img/passos/dentes-03.png', dependeDe: ['pegar-pasta'],
          explicacao: 'Abrir o quê? O tubo ainda está na pia. Pegue a pasta primeiro!',
        },
        {
          id: 'por-pasta', texto: 'Coloque pasta na escova.', imagem: 'img/passos/dentes-04.png', dependeDe: ['pegar-escova', 'abrir-pasta'],
          explicacao: {
            'pegar-escova': 'A pasta vai cair na pia! Pegue a escova antes.',
            'abrir-pasta': 'Com a tampa fechada, a pasta não sai. Abra o tubo antes!',
          },
        },
        {
          id: 'fechar-pasta', texto: 'Feche a tampa da pasta.', imagem: 'img/passos/dentes-09.png', dependeDe: ['por-pasta'],
          explicacao: 'Fechar agora? A pasta ainda não foi para a escova!',
        },
        {
          id: 'escovar', texto: 'Escove os dentes.', imagem: 'img/passos/dentes-05.png', dependeDe: ['por-pasta'],
          explicacao: 'Escovar sem pasta não deixa os dentes limpinhos. Coloque a pasta antes!',
        },
        {
          id: 'enxaguar', texto: 'Cuspa e enxágue a boca.', imagem: 'img/passos/dentes-07.png', dependeDe: ['escovar'],
          explicacao: 'Enxaguar antes de escovar? A espuma ainda nem apareceu!',
        },
        {
          id: 'guardar', texto: 'Lave e guarde a escova no copo.', imagem: 'img/passos/dentes-10.png', dependeDe: ['escovar'],
          explicacao: 'Guardar a escova antes de escovar? Ela nem foi usada!',
        },
      ],
      licao: {
        pergunta: 'Começo, meio e fim',
        imagem: 'img/licoes/dentes-4.png',
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

/* ================= LAVAR AS MÃOS ================= */

const PROTO_MAOS = {
  formato: 'passo-a-passo/1',
  id: 'maos',
  titulo: 'Lavar as mãos',
  local: 'Banheiro',
  cor: '#3f9c8a',
  montagem: 'tirinha',
  fases: [
    {
      id: 'fase-1',
      titulo: 'Mãos sujas? Vamos lavar!',
      instrucao: 'Arraste as cartas para os espaços — ou toque na carta e depois no espaço.',
      mascote: 'Água, sabonete, água de novo. Em que ordem?',
      passos: [
        { id: 'molhar', texto: 'Molhe as mãos na água.', imagem: 'img/passos/maos-02.png', dependeDe: [] },
        {
          id: 'sabonete', texto: 'Passe sabonete nas mãos.', imagem: 'img/passos/maos-03.png', dependeDe: ['molhar'],
          explicacao: 'Sabonete na mão seca quase não faz espuma. Molhe as mãos antes!',
        },
        {
          id: 'enxaguar', texto: 'Enxágue as mãos.', imagem: 'img/passos/maos-05.png', dependeDe: ['sabonete'],
          explicacao: 'Enxaguar o quê? Ainda não tem sabonete nas mãos!',
        },
      ],
      licao: {
        pergunta: 'A mesma água, duas vezes?',
        imagem: 'img/licoes/maos-1.png',
        texto: [
          'A água aparece duas vezes: no começo para molhar, no fim para tirar o sabonete.',
          'É o mesmo gesto, mas em momentos diferentes ele tem um trabalho diferente. Por isso a ordem importa.',
        ],
        reflexao: [
          'Por que não dá para enxaguar antes de passar o sabonete?',
          'Que outra tarefa usa a mesma coisa duas vezes?',
        ],
      },
    },
    {
      id: 'fase-2',
      titulo: 'Esfregue bem!',
      instrucao: 'Um passo aqui manda repetir. Encontre o lugar dele!',
      mascote: 'Contar até 20 enquanto esfrega: isso é repetir!',
      passos: [
        { id: 'abrir', texto: 'Abra a torneira.', imagem: 'img/passos/maos-01.png', dependeDe: [] },
        {
          id: 'molhar', texto: 'Molhe as mãos na água.', imagem: 'img/passos/maos-02.png', dependeDe: ['abrir'],
          explicacao: 'Sem água saindo, não dá para molhar as mãos. Abra a torneira!',
        },
        {
          id: 'sabonete', texto: 'Passe sabonete nas mãos.', imagem: 'img/passos/maos-03.png', dependeDe: ['molhar'],
          explicacao: 'Sabonete na mão seca quase não faz espuma. Molhe as mãos antes!',
        },
        {
          id: 'esfregar', texto: 'Esfregue as mãos contando até 20.', imagem: 'img/passos/maos-04.png', dependeDe: ['sabonete'],
          explicacao: 'Esfregar sem sabonete não tira a sujeira. Passe o sabonete antes!',
        },
        {
          id: 'enxaguar', texto: 'Enxágue as mãos.', imagem: 'img/passos/maos-05.png', dependeDe: ['esfregar'],
          explicacao: 'Enxaguar agora leva o sabonete embora antes de ele limpar. Esfregue primeiro!',
        },
      ],
      licao: {
        pergunta: 'Quantas vezes?',
        imagem: 'img/licoes/maos-2.png',
        texto: [
          'Um dos passos manda fazer a mesma coisa muitas vezes: esfregar enquanto conta até 20.',
          'Em vez de escrever "esfregue" vinte vezes, a gente escreve uma vez e diz quantas vezes repetir. Isso também é algoritmo!',
        ],
        reflexao: [
          'Que outra coisa você faz repetindo várias vezes?',
          'Por que contar até 20 em vez de esfregar só um pouquinho?',
        ],
      },
    },
    {
      id: 'fase-3',
      titulo: 'Não esqueça a torneira!',
      instrucao: 'Dois passos do fim podem trocar de lugar. Quais?',
      mascote: 'Fechar a torneira e secar as mãos: qual vem antes? Pense bem!',
      passos: [
        { id: 'abrir', texto: 'Abra a torneira.', imagem: 'img/passos/maos-01.png', dependeDe: [] },
        {
          id: 'molhar', texto: 'Molhe as mãos na água.', imagem: 'img/passos/maos-02.png', dependeDe: ['abrir'],
          explicacao: 'Sem água saindo, não dá para molhar as mãos. Abra a torneira!',
        },
        {
          id: 'sabonete', texto: 'Passe sabonete nas mãos.', imagem: 'img/passos/maos-03.png', dependeDe: ['molhar'],
          explicacao: 'Sabonete na mão seca quase não faz espuma. Molhe as mãos antes!',
        },
        {
          id: 'esfregar', texto: 'Esfregue as mãos contando até 20.', imagem: 'img/passos/maos-04.png', dependeDe: ['sabonete'],
          explicacao: 'Esfregar sem sabonete não tira a sujeira. Passe o sabonete antes!',
        },
        {
          id: 'enxaguar', texto: 'Enxágue as mãos.', imagem: 'img/passos/maos-05.png', dependeDe: ['esfregar'],
          explicacao: 'Enxaguar agora leva o sabonete embora antes de ele limpar. Esfregue primeiro!',
        },
        {
          id: 'fechar', texto: 'Feche a torneira.', imagem: 'img/passos/maos-06.png', dependeDe: ['enxaguar'],
          explicacao: 'Fechar a torneira agora? Você ainda precisa da água para enxaguar!',
        },
        {
          id: 'secar', texto: 'Seque as mãos na toalha.', imagem: 'img/passos/maos-07.png', dependeDe: ['enxaguar'],
          explicacao: 'Secar mãos cheias de sabonete? A toalha fica toda ensaboada! Enxágue antes.',
        },
      ],
      licao: {
        pergunta: 'Dá para economizar água?',
        imagem: 'img/licoes/maos-3.png',
        texto: [
          'Fechar a torneira e secar as mãos podiam vir em qualquer ordem — os dois só depois de enxaguar.',
          'Um bom algoritmo também pensa no que sobra: a torneira aberta gastaria água à toa.',
        ],
        reflexao: [
          'Em que momento a torneira poderia ficar fechada para gastar menos água?',
          'Que passo você mudaria para lavar as mãos sem desperdício?',
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
  cor: '#5f8f3a',
  montagem: 'tirinha',
  fases: [
    {
      id: 'fase-1',
      titulo: 'Vamos plantar!',
      instrucao: 'Arraste as cartas para os espaços — ou toque na carta e depois no espaço.',
      mascote: 'A semente precisa de uma casa antes de ganhar água.',
      passos: [
        { id: 'terra', texto: 'Coloque terra no vaso.', imagem: 'img/passos/planta-02.png', dependeDe: [] },
        {
          id: 'semente', texto: 'Coloque a semente na terra.', imagem: 'img/passos/planta-04.png', dependeDe: ['terra'],
          explicacao: 'Semente num vaso vazio não tem onde crescer. Coloque a terra primeiro!',
        },
        {
          id: 'regar', texto: 'Regue a terra.', imagem: 'img/passos/planta-06.png', dependeDe: ['semente'],
          explicacao: 'Regar agora molha só a terra: a semente ainda nem foi plantada!',
        },
      ],
      licao: {
        pergunta: 'O que a semente precisa primeiro?',
        imagem: 'img/licoes/planta-1.png',
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
        { id: 'vaso', texto: 'Pegue um vaso.', imagem: 'img/passos/planta-01.png', dependeDe: [] },
        {
          id: 'terra', texto: 'Coloque terra no vaso.', imagem: 'img/passos/planta-02.png', dependeDe: ['vaso'],
          explicacao: 'Terra onde? O vaso ainda não está aqui. Pegue o vaso primeiro!',
        },
        {
          id: 'buraco', texto: 'Faça um buraquinho na terra.', imagem: 'img/passos/planta-03.png', dependeDe: ['terra'],
          explicacao: 'Buraquinho em quê? Ainda não tem terra no vaso!',
        },
        {
          id: 'semente', texto: 'Coloque a semente no buraquinho.', imagem: 'img/passos/planta-04.png', dependeDe: ['buraco'],
          explicacao: 'Sem o buraquinho, a semente fica por cima da terra. Faça o buraquinho antes!',
        },
        {
          id: 'cobrir', texto: 'Cubra a semente com terra.', imagem: 'img/passos/planta-05.png', dependeDe: ['semente'],
          explicacao: 'Cobrir o quê? A semente ainda não está no buraquinho!',
        },
      ],
      licao: {
        pergunta: 'Cadê os passos escondidos?',
        imagem: 'img/licoes/planta-2.png',
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
        { id: 'vaso', texto: 'Pegue um vaso.', imagem: 'img/passos/planta-01.png', dependeDe: [] },
        {
          id: 'terra', texto: 'Coloque terra no vaso.', imagem: 'img/passos/planta-02.png', dependeDe: ['vaso'],
          explicacao: 'Terra onde? O vaso ainda não está aqui. Pegue o vaso primeiro!',
        },
        {
          id: 'buraco', texto: 'Faça um buraquinho na terra.', imagem: 'img/passos/planta-03.png', dependeDe: ['terra'],
          explicacao: 'Buraquinho em quê? Ainda não tem terra no vaso!',
        },
        {
          id: 'semente', texto: 'Coloque a semente no buraquinho.', imagem: 'img/passos/planta-04.png', dependeDe: ['buraco'],
          explicacao: 'Sem o buraquinho, a semente fica por cima da terra. Faça o buraquinho antes!',
        },
        {
          id: 'cobrir', texto: 'Cubra a semente com terra.', imagem: 'img/passos/planta-05.png', dependeDe: ['semente'],
          explicacao: 'Cobrir o quê? A semente ainda não está no buraquinho!',
        },
        {
          id: 'regar', texto: 'Regue a terra.', imagem: 'img/passos/planta-06.png', dependeDe: ['cobrir'],
          explicacao: 'Regar com a semente descoberta? A água pode levar a semente embora! Cubra antes.',
        },
        {
          id: 'sol', texto: 'Coloque o vaso perto da janela.', imagem: 'img/passos/planta-07.png', dependeDe: ['cobrir'],
          explicacao: 'Levar o vaso agora? A semente ainda não foi plantada!',
        },
      ],
      licao: {
        pergunta: 'O algoritmo acaba quando a gente para?',
        imagem: 'img/licoes/planta-3.png',
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

/* ================= ATRAVESSAR A RUA ================= */

const PROTO_RUA = {
  formato: 'passo-a-passo/1',
  id: 'rua',
  titulo: 'Atravessar a rua',
  local: 'Rua',
  cor: '#c0663a',
  montagem: 'tirinha',
  fases: [
    {
      id: 'fase-1',
      titulo: 'Vamos para o outro lado!',
      instrucao: 'Arraste as cartas para os espaços — ou toque na carta e depois no espaço.',
      mascote: 'Na rua, a ordem dos passos protege a gente.',
      passos: [
        { id: 'faixa', texto: 'Vá até a faixa de pedestres.', imagem: 'img/passos/rua-02.png', dependeDe: [] },
        {
          id: 'olhar', texto: 'Olhe para os dois lados.', imagem: 'img/passos/rua-05.png', dependeDe: ['faixa'],
          explicacao: 'Olhar daqui não adianta: você ainda nem chegou à faixa!',
        },
        {
          id: 'atravessar', texto: 'Atravesse andando pela faixa.', imagem: 'img/passos/rua-06.png', dependeDe: ['olhar'],
          explicacao: 'Atravessar sem olhar é perigoso! Primeiro olhe para os dois lados.',
        },
      ],
      licao: {
        pergunta: 'Por que olhar antes?',
        imagem: 'img/licoes/rua-1.png',
        texto: [
          'Na rua, a ordem dos passos não é só para dar certo: é para ficar seguro.',
          'Olhar depois de atravessar não adianta nada. O passo certo precisa vir na hora certa.',
        ],
        reflexao: [
          'O que pode acontecer se alguém atravessar sem olhar?',
          'Onde é o lugar mais seguro para atravessar perto da sua escola?',
        ],
      },
    },
    {
      id: 'fase-2',
      titulo: 'E se o sinal estiver vermelho?',
      instrucao: 'Um passo aqui depende do semáforo. Onde ele entra?',
      mascote: 'Boneco vermelho: espere. Boneco verde: pode ir. Isso é uma condição!',
      passos: [
        { id: 'faixa', texto: 'Vá até a faixa de pedestres.', imagem: 'img/passos/rua-02.png', dependeDe: [] },
        {
          id: 'parar', texto: 'Pare na calçada, antes da faixa.', imagem: 'img/passos/rua-03.png', dependeDe: ['faixa'],
          explicacao: 'Parar onde? Você ainda não chegou à faixa!',
        },
        {
          id: 'sinal', texto: 'Espere o boneco verde do semáforo.', imagem: 'img/passos/rua-04.png', dependeDe: ['parar'],
          explicacao: 'Esperar no meio do caminho? Pare na calçada primeiro, longe dos carros.',
        },
        {
          id: 'olhar', texto: 'Olhe para os dois lados.', imagem: 'img/passos/rua-05.png', dependeDe: ['parar'],
          explicacao: 'Olhar andando é difícil! Pare na calçada e depois olhe.',
        },
        {
          id: 'atravessar', texto: 'Atravesse andando pela faixa.', imagem: 'img/passos/rua-06.png', dependeDe: ['sinal', 'olhar'],
          explicacao: {
            sinal: 'O boneco ainda está vermelho! Os carros podem passar. Espere ficar verde.',
            olhar: 'Mesmo com o boneco verde, olhe para os dois lados antes de ir!',
          },
        },
      ],
      licao: {
        pergunta: 'Um passo que faz uma pergunta?',
        imagem: 'img/licoes/rua-2.png',
        texto: [
          '"Espere o boneco verde" é um passo especial: ele depende de uma condição.',
          'SE o boneco está vermelho, você espera. SE está verde, você segue. Os algoritmos também fazem perguntas assim.',
        ],
        reflexao: [
          'Que outra regra sua começa com "se"?',
          'O que você faz numa rua que não tem semáforo?',
        ],
      },
    },
    {
      id: 'fase-3',
      titulo: 'Atravessando junto!',
      instrucao: 'Criança atravessa a rua junto com um adulto. Encaixe esse passo!',
      mascote: 'Dar a mão pode ser logo no começo. Mas precisa ser antes de atravessar!',
      passos: [
        { id: 'mao', texto: 'Dê a mão para um adulto.', imagem: 'img/passos/rua-01.png', dependeDe: [] },
        { id: 'faixa', texto: 'Vá até a faixa de pedestres.', imagem: 'img/passos/rua-02.png', dependeDe: [] },
        {
          id: 'parar', texto: 'Pare na calçada, antes da faixa.', imagem: 'img/passos/rua-03.png', dependeDe: ['faixa'],
          explicacao: 'Parar onde? Você ainda não chegou à faixa!',
        },
        {
          id: 'sinal', texto: 'Espere o boneco verde do semáforo.', imagem: 'img/passos/rua-04.png', dependeDe: ['parar'],
          explicacao: 'Esperar no meio do caminho? Pare na calçada primeiro, longe dos carros.',
        },
        {
          id: 'olhar', texto: 'Olhe para os dois lados.', imagem: 'img/passos/rua-05.png', dependeDe: ['parar'],
          explicacao: 'Olhar andando é difícil! Pare na calçada e depois olhe.',
        },
        {
          id: 'atravessar', texto: 'Atravesse andando pela faixa.', imagem: 'img/passos/rua-06.png', dependeDe: ['mao', 'sinal', 'olhar'],
          explicacao: {
            mao: 'Atravessar sozinho, não! Dê a mão para um adulto antes.',
            sinal: 'O boneco ainda está vermelho! Os carros podem passar. Espere ficar verde.',
            olhar: 'Mesmo com o boneco verde, olhe para os dois lados antes de ir!',
          },
        },
      ],
      licao: {
        pergunta: 'Quantas coisas precisam estar prontas?',
        imagem: 'img/licoes/rua-3.png',
        texto: [
          'Para atravessar, três coisas precisam estar prontas: a mão dada, o boneco verde e os dois lados olhados.',
          'O último passo espera por todos eles. Se faltar um, não dá para ir.',
        ],
        reflexao: [
          'Qual dos três você acha mais importante? Por quê?',
          'Que outra tarefa só pode começar quando várias coisas estão prontas?',
        ],
      },
    },
  ],
};

/* ================= FAZER UMA LIMONADA ================= */

const PROTO_LIMONADA = {
  formato: 'passo-a-passo/1',
  id: 'limonada',
  titulo: 'Fazer uma limonada',
  local: 'Cozinha',
  cor: '#b8941f',
  montagem: 'tirinha',
  fases: [
    {
      id: 'fase-1',
      titulo: 'Que calor! Vamos fazer limonada!',
      instrucao: 'Arraste as cartas para os espaços — ou toque na carta e depois no espaço.',
      mascote: 'O limão passa por três passos antes de virar suco.',
      passos: [
        { id: 'lavar', texto: 'Lave os limões.', imagem: 'img/passos/limonada-01.png', dependeDe: [] },
        {
          id: 'cortar', texto: 'Peça a um adulto para cortar os limões.', imagem: 'img/passos/limonada-02.png', dependeDe: ['lavar'],
          explicacao: 'Cortar limão sujo leva a sujeira para dentro do suco. Lave antes!',
        },
        {
          id: 'espremer', texto: 'Esprema os limões no espremedor.', imagem: 'img/passos/limonada-03.png', dependeDe: ['cortar'],
          explicacao: 'Limão inteiro não solta suco no espremedor. Ele precisa ser cortado antes!',
        },
      ],
      licao: {
        pergunta: 'Do limão ao suco',
        imagem: 'img/licoes/limonada-1.png',
        texto: [
          'O limão muda a cada passo: sujo, limpo, cortado, espremido.',
          'Cada passo só funciona com o limão do jeito que o passo anterior deixou.',
        ],
        reflexao: [
          'Por que um adulto corta o limão?',
          'Que outra comida muda de jeito a cada passo da receita?',
        ],
      },
    },
    {
      id: 'fase-2',
      titulo: 'Agora a jarra!',
      instrucao: 'Duas coisas podem ser preparadas ao mesmo tempo. Quais?',
      mascote: 'Enquanto um amigo espreme o limão, outro pode encher a jarra!',
      passos: [
        { id: 'lavar', texto: 'Lave os limões.', imagem: 'img/passos/limonada-01.png', dependeDe: [] },
        {
          id: 'cortar', texto: 'Peça a um adulto para cortar os limões.', imagem: 'img/passos/limonada-02.png', dependeDe: ['lavar'],
          explicacao: 'Cortar limão sujo leva a sujeira para dentro do suco. Lave antes!',
        },
        {
          id: 'espremer', texto: 'Esprema os limões no espremedor.', imagem: 'img/passos/limonada-03.png', dependeDe: ['cortar'],
          explicacao: 'Limão inteiro não solta suco no espremedor. Ele precisa ser cortado antes!',
        },
        { id: 'agua', texto: 'Coloque água gelada na jarra.', imagem: 'img/passos/limonada-04.png', dependeDe: [] },
        {
          id: 'misturar', texto: 'Junte o suco na jarra e mexa.', imagem: 'img/passos/limonada-06.png', dependeDe: ['espremer', 'agua'],
          explicacao: {
            espremer: 'Juntar o quê? O suco do limão ainda não foi espremido!',
            agua: 'Suco de limão puro é azedo demais! Coloque água na jarra antes.',
          },
        },
      ],
      licao: {
        pergunta: 'Dá para fazer duas coisas ao mesmo tempo?',
        imagem: 'img/licoes/limonada-2.png',
        texto: [
          'Pôr água na jarra não depende do limão: pode ser antes, no meio ou depois de espremer.',
          'Passos assim podem ser feitos ao mesmo tempo, por duas pessoas. O algoritmo fica mais rápido!',
        ],
        reflexao: [
          'Se vocês fossem dois na cozinha, como dividiriam os passos?',
          'Qual passo precisa esperar os dois terminarem?',
        ],
      },
    },
    {
      id: 'fase-3',
      titulo: 'Limonada pronta para servir!',
      instrucao: 'Agora tem açúcar e copo. Cuidado com o que precisa esperar!',
      mascote: 'Lavar o limão, pôr água, pôr açúcar... vários começos possíveis!',
      passos: [
        { id: 'lavar', texto: 'Lave os limões.', imagem: 'img/passos/limonada-01.png', dependeDe: [] },
        {
          id: 'cortar', texto: 'Peça a um adulto para cortar os limões.', imagem: 'img/passos/limonada-02.png', dependeDe: ['lavar'],
          explicacao: 'Cortar limão sujo leva a sujeira para dentro do suco. Lave antes!',
        },
        {
          id: 'espremer', texto: 'Esprema os limões no espremedor.', imagem: 'img/passos/limonada-03.png', dependeDe: ['cortar'],
          explicacao: 'Limão inteiro não solta suco no espremedor. Ele precisa ser cortado antes!',
        },
        { id: 'agua', texto: 'Coloque água gelada na jarra.', imagem: 'img/passos/limonada-04.png', dependeDe: [] },
        {
          id: 'acucar', texto: 'Coloque um pouco de açúcar na jarra.', imagem: 'img/passos/limonada-05.png', dependeDe: ['agua'],
          explicacao: 'Açúcar na jarra seca gruda no fundo. Coloque a água antes!',
        },
        {
          id: 'misturar', texto: 'Junte o suco na jarra e mexa.', imagem: 'img/passos/limonada-06.png', dependeDe: ['espremer', 'acucar'],
          explicacao: {
            espremer: 'Juntar o quê? O suco do limão ainda não foi espremido!',
            acucar: 'Mexer agora e pôr o açúcar depois? Ele vai ficar no fundo sem misturar!',
          },
        },
        {
          id: 'servir', texto: 'Sirva a limonada no copo.', imagem: 'img/passos/limonada-07.png', dependeDe: ['misturar'],
          explicacao: 'Servir antes de misturar? Vai sair só água no copo!',
        },
      ],
      licao: {
        pergunta: 'Quem espera por quem?',
        imagem: 'img/licoes/limonada-3.png',
        texto: [
          'Aqui há dois caminhos: o do limão (lavar, cortar, espremer) e o da jarra (água, açúcar).',
          'Os dois podem andar ao mesmo tempo. O "misturar" espera os dois chegarem — e só então dá para servir.',
        ],
        reflexao: [
          'Desenhe os dois caminhos como duas trilhas que se encontram.',
          'Em que outra tarefa duas partes se juntam no final?',
        ],
      },
    },
  ],
};

const SITUACOES_EM_PROGRESSO = [PROTO_DENTES, PROTO_MAOS, PROTO_PLANTA, PROTO_RUA, PROTO_LIMONADA];
