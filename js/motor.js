/* ============================================================
   motor.js — modelo de dados e motor de validação
   (sem interface: teste no console com `node motor.js`
    ou colando o arquivo no console do navegador)
   ============================================================ */

'use strict';

/* ============================================================
   1. FORMATO DA SITUAÇÃO

   Uma SITUAÇÃO é um tema completo (ex.: "Fazer um sanduíche")
   dividido em FASES. Cada fase tem uma lista de PASSOS.

   O professor NÃO escreve grafo nenhum. Ele só faz duas coisas:
     a) escreve os passos NA ORDEM CORRETA, de cima para baixo;
     b) quando um passo pode vir em qualquer ordem em relação ao
        passo anterior, marca nele  "ordemLivre": true.

   Formato:

   {
     "formato": "passo-a-passo/1",
     "id": "sanduiche",
     "titulo": "Fazer um sanduíche",
     "fases": [
       {
         "id": "fase-1",
         "titulo": "Monte o sanduíche na ordem certa!",
         "passos": [
           { "id": "pao",      "texto": "Pegue o pão.",              "imagem": "img/pao.png" },
           { "id": "manteiga", "texto": "Pegue a manteiga.",         "imagem": "img/manteiga.png", "ordemLivre": true },
           { "id": "passar",   "texto": "Passe a manteiga no pão.",  "imagem": "img/passar.png" }
         ]
       }
     ]
   }

   Leitura em voz alta do exemplo acima:
   "Pegue o pão. Pegue a manteiga — tanto faz qual dos dois vem
    primeiro (ordemLivre). Depois dos dois, passe a manteiga."

   Campos opcionais da SITUAÇÃO inteira (além de formato, id,
   titulo e fases):
     cena        ilustração grande da situação, mostrada ao lado
                 dela na tela inicial (o desenho do mundo em que a
                 aventura acontece: a cozinha, o pátio do robô…)
     cenaReserva emoji desenhado no lugar da cena quando a imagem
                 não carrega — o mesmo papel que imagemReserva faz
                 na carta.
     local       onde o chamado acontece ("Cozinha"), mostrado no
                 cartão da central de chamados
     cor         cor do título da fase e do cartão na central
     cliente     retrato de quem fez o chamado (círculo do cartão)
     fundo       ilustração de fundo da tela da fase
     fundoConclusao  ilustração da tela de lição (fase concluída)
   Todos são só aparência: sem eles o jogo usa um visual padrão,
   e nenhum deles muda a validação.

   Campos de cada passo:
     id         identificador único dentro da fase
     texto      legenda da carta
     imagem     referência da imagem da carta (caminho, emoji ou data:)
     imagemReserva (opcional) — um emoji desenhado quando a imagem
                não carrega (arquivo que ainda não existe, .json
                movido de pasta, caminho errado). Sem ele a carta
                fica um retângulo bege vazio; com ele a criança
                sempre vê alguma figura. Vale também sozinho, sem
                nenhuma "imagem": aí o emoji É a figura da carta.
     ordemLivre (opcional, padrão false) — "posso trocar de lugar
                com o passo de cima"
     explicacao (opcional) — texto mostrado quando este passo é
                colocado antes de um pré-requisito dele. Duas formas:
                - uma string única, usada seja qual for o
                  pré-requisito violado;
                - um objeto { idDoPreRequisito: texto, ... }, com
                  "*" como texto reserva para os ids não listados.
                Assim CADA REGRA DE DEPENDÊNCIA CARREGA SEU PRÓPRIO
                TEXTO: quem escreve a situação escreve também a
                explicação, e o código do jogo não conhece frase
                nenhuma sobre sanduíche, escova de dente etc.
                Sem o campo, o motor monta uma frase genérica.

   Campos opcionais de cada FASE (além de id, titulo e passos):
     instrucao  frase curta mostrada sob o título da fase
     mascote    fala do mascote enquanto a fase é jogada (o balão
                ao lado dele). Sem o campo, ele diz a frase padrão
                do jogo. É a fase que dá a deixa: aqui o mascote
                fala do que ESTA fase tem de novo. Quando a criança
                erra, a explicação do erro toma o balão; corrigido
                o erro, esta frase volta.
     licao      conteúdo da tela de conclusão da fase, mostrada
                quando o tabuleiro fica completo sem erro:
                {
                  pergunta:   título da lição, em forma de pergunta
                  texto:      2 ou 3 frases curtas (string única ou
                              array de strings — cada uma vira um
                              parágrafo)
                  comparacao: { certa: [ids], errada: [ids] } —
                              duas mini-ordens montadas com passos
                              DESTA fase, mostradas lado a lado com
                              marcação de certo e errado
                  reflexao:   [pergunta, pergunta] — para a criança
                              pensar ou conversar com o professor;
                              não há campo de resposta
                  reforco:    a lição inteira em uma frase
                }
                Como a explicacao dos passos, a licao mora nos
                DADOS: a tela de conclusão (conclusao.js) só lê
                daqui, e o código do jogo não conhece frase nenhuma
                sobre sanduíche, escova de dente etc.
   ============================================================ */

/* ============================================================
   2. DERIVAÇÃO DO GRAFO DE DEPENDÊNCIAS

   Ideia central: a marcação ordemLivre corta a lista do professor
   em CAMADAS.

   - Um passo SEM a marcação abre uma camada nova.
   - Um passo COM "ordemLivre": true entra na MESMA camada do
     passo anterior.

   No exemplo do sanduíche:

       camada 1: [pegar o pão, pegar a manteiga]   ← trocáveis entre si
       camada 2: [passar a manteiga no pão]

   A regra de dependência derivada é uma só:

       CADA PASSO DEPENDE DE TODOS OS PASSOS DA CAMADA ANTERIOR.

   Por que isso basta?
   - Dentro da mesma camada ninguém depende de ninguém → qualquer
     ordem interna é aceita (é exatamente o que o professor quis
     dizer com "tanto faz").
   - Entre camadas, tudo da camada N precisa vir antes de tudo da
     camada N+1 → a ordem geral do professor é respeitada.
   - Não precisamos ligar cada passo a TODAS as camadas anteriores,
     só à imediatamente anterior: a corrente já garante o resto.
     (Se A vem antes de B e B antes de C, então A vem antes de C —
     e qualquer sequência que desrespeite isso sempre quebra pelo
     menos um elo direto da corrente, que a validação encontra.)
   ============================================================ */

/**
 * Corta a lista ordenada do professor em camadas.
 * Devolve um array de arrays de passos.
 */
function agruparEmCamadas(passos) {
  const camadas = [];
  for (const passo of passos) {
    if (passo.ordemLivre && camadas.length > 0) {
      // junta-se à camada do passo anterior
      camadas[camadas.length - 1].push(passo);
    } else {
      // abre uma camada nova
      camadas.push([passo]);
    }
  }
  return camadas;
}

/**
 * Deriva o grafo de dependências a partir da lista do professor.
 *
 * Devolve um objeto no formato:
 *   { idDoPasso: [ids dos passos de que ele depende], ... }
 *
 * Exemplo (sanduíche):
 *   { pao: [], manteiga: [], passar: ["pao", "manteiga"] }
 */
function derivarDependencias(passos) {
  const camadas = agruparEmCamadas(passos);
  const dependencias = {};

  camadas.forEach((camada, i) => {
    // A camada anterior inteira é o pré-requisito desta camada.
    // A primeira camada não tem pré-requisito nenhum.
    const anterior = i === 0 ? [] : camadas[i - 1].map(p => p.id);
    for (const passo of camada) {
      dependencias[passo.id] = anterior.slice();
    }
  });

  return dependencias;
}

/* ============================================================
   3. VALIDAÇÃO DA SEQUÊNCIA MONTADA PELA CRIANÇA

   Entrada:
     fase       objeto da fase (com .passos)
     sequencia  array com um item por espaço do tabuleiro, na
                ordem: o id do passo colocado, ou null se o
                espaço está vazio.

   IMPORTANTE: a validação NUNCA compara a posição da carta com a
   posição na lista original do professor. Ela só pergunta, para
   cada carta colocada: "os pré-requisitos dela estão antes dela?"
   É por isso que uma ordem alternativa válida (trocar dois passos
   da mesma camada) é ACEITA — não existe sequência decorada,
   existe lógica de dependência.

   Saída:
     {
       ok:       true se nenhum problema foi encontrado até aqui,
       completa: true se todos os espaços estão preenchidos,
       erro:     null, ou o PRIMEIRO problema encontrado:
         {
           tipo:         "pre-requisito-depois" | "sem-espaco-antes"
                         | "passo-desconhecido" | "passo-repetido",
           indice:       posição (começando em 0) do passo com problema,
           passo:        o passo mal colocado,
           preRequisito: o passo que precisava vir antes (quando houver),
           mensagem:     explicação pronta em português
         }
     }

   Tipos de problema:
     "pre-requisito-depois"  o pré-requisito foi colocado DEPOIS
     "sem-espaco-antes"      o pré-requisito ainda não foi colocado
                             e não sobrou nenhum espaço vazio antes
                             (logo é impossível consertar sem mover
                             esta carta)
   Se o pré-requisito ainda não foi colocado mas AINDA HÁ espaço
   vazio antes, não é erro: a criança ainda pode completar.
   ============================================================ */

/**
 * Texto da regra de dependência violada, vindo DOS DADOS da fase.
 * Devolve null quando o passo não traz texto próprio — aí a
 * validação usa a frase genérica montada pelo motor.
 */
function textoDaRegra(passo, preRequisito) {
  const e = passo.explicacao;
  if (!e) return null;
  if (typeof e === 'string') return e;
  return e[preRequisito.id] || e['*'] || null;
}

function validarSequencia(fase, sequencia) {
  const dependencias = derivarDependencias(fase.passos);
  const porId = {};
  fase.passos.forEach(p => { porId[p.id] = p; });

  // posição de cada passo já colocado
  const posicao = {};
  for (let i = 0; i < sequencia.length; i++) {
    const id = sequencia[i];
    if (id === null || id === undefined) continue;

    if (!porId[id]) {
      return resultado(false, sequencia, {
        tipo: 'passo-desconhecido', indice: i, passo: { id }, preRequisito: null,
        mensagem: `O id "${id}" não existe nesta fase.`,
      });
    }
    if (posicao[id] !== undefined) {
      return resultado(false, sequencia, {
        tipo: 'passo-repetido', indice: i, passo: porId[id], preRequisito: null,
        mensagem: `O passo "${porId[id].texto}" aparece duas vezes.`,
      });
    }
    posicao[id] = i;
  }

  // percorre da esquerda para a direita e devolve o PRIMEIRO problema
  for (let i = 0; i < sequencia.length; i++) {
    const id = sequencia[i];
    if (id === null || id === undefined) continue;
    const passo = porId[id];

    for (const idPre of dependencias[id]) {
      const preRequisito = porId[idPre];
      const j = posicao[idPre];

      if (j !== undefined && j > i) {
        return resultado(false, sequencia, {
          tipo: 'pre-requisito-depois', indice: i, passo, preRequisito,
          mensagem: textoDaRegra(passo, preRequisito) ||
                    `"${passo.texto}" precisa vir depois de "${preRequisito.texto}", ` +
                    `mas "${preRequisito.texto}" está mais para o fim.`,
        });
      }

      if (j === undefined) {
        const vaziosAntes = sequencia.slice(0, i)
          .filter(x => x === null || x === undefined).length;
        if (vaziosAntes === 0) {
          return resultado(false, sequencia, {
            tipo: 'sem-espaco-antes', indice: i, passo, preRequisito,
            mensagem: textoDaRegra(passo, preRequisito) ||
                      `"${passo.texto}" precisa vir depois de "${preRequisito.texto}", ` +
                      `mas não sobrou nenhum espaço vazio antes dele.`,
          });
        }
        // pré-requisito ausente COM espaço antes: ainda dá para
        // completar — não é erro.
      }
    }
  }

  return resultado(true, sequencia, null);
}

function resultado(ok, sequencia, erro) {
  return {
    ok,
    completa: sequencia.every(x => x !== null && x !== undefined),
    erro,
  };
}

/* ============================================================
   4. TESTES — rodam sozinhos no console
   ============================================================ */

const SITUACAO_EXEMPLO = {
  formato: 'passo-a-passo/1',
  id: 'sanduiche',
  titulo: 'Fazer um sanduíche',
  fases: [
    {
      id: 'fase-1',
      titulo: 'Monte o sanduíche na ordem certa!',
      passos: [
        { id: 'pao',      texto: 'Pegue o pão.',      imagem: 'img/pao.png' },
        { id: 'manteiga', texto: 'Pegue a manteiga.', imagem: 'img/manteiga.png', ordemLivre: true },
        {
          id: 'passar', texto: 'Passe a manteiga no pão.', imagem: 'img/passar.png',
          explicacao: {
            pao:      'A manteiga precisa do pão já na mesa. Do jeito que está, não tem onde passar!',
            manteiga: 'Para passar a manteiga, ela precisa estar na mesa. Do jeito que está, a faca vai raspar o ar!',
          },
        },
        {
          id: 'queijo', texto: 'Coloque o queijo.', imagem: 'img/queijo.png',
          explicacao: 'O queijo vai por cima da manteiga. Do jeito que está, ele cai no pão ainda seco!',
        },
        {
          id: 'presunto', texto: 'Coloque o presunto.', imagem: 'img/presunto.png', ordemLivre: true,
          explicacao: 'O presunto vai por cima da manteiga. Do jeito que está, ele cai no pão ainda seco!',
        },
        {
          id: 'fechar', texto: 'Feche o sanduíche.', imagem: 'img/fechar.png',
          explicacao: {
            queijo:   'Para fechar o sanduíche, o queijo já precisa estar dentro. Fechando agora, ele fica de fora!',
            presunto: 'Para fechar o sanduíche, o presunto já precisa estar dentro. Fechando agora, ele fica de fora!',
          },
        },
      ],
    },
  ],
};

function rodarTestes() {
  const fase = SITUACAO_EXEMPLO.fases[0];
  let passou = 0, falhou = 0;

  function teste(nome, sequencia, esperado) {
    const r = validarSequencia(fase, sequencia);
    const obtido = {
      ok: r.ok,
      completa: r.completa,
      tipoErro: r.erro ? r.erro.tipo : null,
      passo: r.erro ? r.erro.passo.id : null,
      preRequisito: r.erro && r.erro.preRequisito ? r.erro.preRequisito.id : null,
    };
    const deuCerto = JSON.stringify(obtido) === JSON.stringify(esperado);
    if (deuCerto) passou++; else falhou++;

    console.log(`\n${deuCerto ? '✅ PASSOU' : '❌ FALHOU'} — ${nome}`);
    console.log('  sequência:', JSON.stringify(sequencia));
    console.log('  esperava :', JSON.stringify(esperado));
    console.log('  obteve   :', JSON.stringify(obtido));
    if (r.erro) console.log('  mensagem :', r.erro.mensagem);
  }

  console.log('=== Camadas derivadas da lista do professor ===');
  console.log(agruparEmCamadas(fase.passos).map(c => c.map(p => p.id)));
  console.log('\n=== Grafo de dependências derivado ===');
  console.log(derivarDependencias(fase.passos));

  teste(
    'sequência correta (a ordem original do professor)',
    ['pao', 'manteiga', 'passar', 'queijo', 'presunto', 'fechar'],
    { ok: true, completa: true, tipoErro: null, passo: null, preRequisito: null },
  );

  teste(
    'pré-requisito violado (passar a manteiga antes de pegar a manteiga)',
    ['pao', 'passar', 'manteiga', 'queijo', 'presunto', 'fechar'],
    { ok: false, completa: true, tipoErro: 'pre-requisito-depois', passo: 'passar', preRequisito: 'manteiga' },
  );

  teste(
    'ordem alternativa VÁLIDA (manteiga antes do pão, presunto antes do queijo) — deve ser ACEITA',
    ['manteiga', 'pao', 'passar', 'presunto', 'queijo', 'fechar'],
    { ok: true, completa: true, tipoErro: null, passo: null, preRequisito: null },
  );

  teste(
    'sequência incompleta sem nenhuma violação (ainda dá para completar)',
    ['manteiga', null, 'passar', null, null, null],
    { ok: true, completa: false, tipoErro: null, passo: null, preRequisito: null },
  );

  teste(
    'sequência incompleta JÁ impossível (queijo no primeiro espaço: não sobrou espaço antes para o pré-requisito)',
    ['queijo', null, null, null, null, null],
    { ok: false, completa: false, tipoErro: 'sem-espaco-antes', passo: 'queijo', preRequisito: 'passar' },
  );

  console.log(`\n=== Resultado: ${passou} passou(aram), ${falhou} falhou(aram) ===`);
}

// Os testes rodam sozinhos no Node e na página de teste; na página
// do jogo (que tem tabuleiro) o motor fica em silêncio.
if (typeof document === 'undefined' || !document.querySelector('.tabuleiro')) {
  rodarTestes();
}
