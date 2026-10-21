/* ============================================================
   jogo.js — a partida da criança, do primeiro passo à última fase.

   Liga as partes: a tela da fase (index.html), as cartas
   (comum.js), o arrasto (arrasto.js), o motor de validação
   (motor.js), a montagem (montagem.js), o som (som.js), a lição (conclusao.js) e a memória
   (progresso.js e perfil.js). A central de chamados (app.js) chama
   iniciarSituacao(situacao, chave); daqui para a frente:

   - o tabuleiro e a bandeja são MONTADOS DOS DADOS da fase
     (situacoes.js ou arquivo do professor — mesmo formato);
   - a cada movimento a sequência é lida do DOM e validada;
   - acerto → a carta "assenta" e soa;
   - erro → a carta ganha marcação de atenção, o pré-requisito
     pisca, o robô-guia fica confuso e a explicação (escrita nos
     DADOS) toma o balão dele;
   - fase completa sem erro → tela de lição → próxima fase;
   - última fase → evento 'situacao-concluida' (o app.js decide se
     é hora da promoção ou de voltar à central);
   - o botão "Nível X de N" abre a lista de níveis: qualquer fase já
     liberada pode ser jogada de novo.

   ESTRELAS por fase, como no resto do jogo: 3 sem nenhum erro,
   2 com um erro, 1 com mais. Cada problema NOVO que aparece no
   tabuleiro conta como um erro (o mesmo problema continuando na
   tela não conta de novo), e usar uma dica também conta.

   DICAS são um estoque do agente (perfil.js): cada fase concluída
   dá +1. A dica coloca no tabuleiro a carta do primeiro espaço
   que está vazio ou errado, e o robô-guia diz qual passo é.
   ============================================================ */

'use strict';

(function () {

  /* ---------------- elementos ---------------- */

  const tela         = document.querySelector('#fase');
  const titulo       = tela.querySelector('.fase-titulo');
  const instrucao    = tela.querySelector('.fase-instrucao');
  const grade        = tela.querySelector('.tabuleiro-grade');
  const fila         = tela.querySelector('.bandeja-fila');
  const guia         = tela.querySelector('.guia');
  const balao        = tela.querySelector('.mascote-balao');
  const rosto        = tela.querySelector('.guia-rosto');
  const leitor       = document.querySelector('.leitor-explicacao');
  const contador     = tela.querySelector('.contador-estrelas');
  const contadorNum  = tela.querySelector('.contador-estrelas-num');
  const progTexto    = tela.querySelector('.progresso-texto');
  const btnDica      = tela.querySelector('#btn-dica');
  const dicaRestantes = tela.querySelector('.dica-restantes');

  // fala do robô-guia quando a fase não traz a sua própria
  const balaoPadrao = 'Pense na ordem dos passos!';

  // expressões do robô-guia: tudo bem, problema na tela, dica
  const ROSTO = {
    normal: 'img/guide.png',
    erro:   'img/guide-triste.png',
    dica:   'img/guide-feliz.png',
  };

  /* A fala do robô-guia sai dos DADOS da fase (campo "mascote"),
     como a explicação de erro e a lição. É o que o balão mostra
     enquanto está tudo bem; ao errar, a explicação toma o balão e
     depois esta frase volta. */
  function falaDoMascote() {
    return (situacao && fase().mascote) || balaoPadrao;
  }

  /* ---------------- estado da partida ---------------- */

  let situacao   = null;   // situação em jogo
  let chave      = null;   // chave do progresso no localStorage
  let indiceFase = 0;
  let progresso  = null;   // { fase, niveis } — ver progresso.js
  let erros      = 0;      // erros nesta fase (decide as estrelas)
  let faseConcluida = false;
  /* qual erro já soou: o som do erro toca UMA vez por problema.
     Sem isto, mexer numa carta qualquer enquanto o mesmo problema
     continua na tela repetiria o som — insistência que a explicação
     escrita, essa sim, já faz de graça e sem barulho. */
  let erroQueSoou = null;

  function fase() { return situacao.fases[indiceFase]; }

  /* ============================================================
     ENTRADA NA PARTIDA
     ============================================================ */

  /**
   * Começa (ou continua) uma situação. Chamada pela central e pela
   * lista de níveis. chaveProgresso identifica a situação no
   * localStorage; nivel (opcional) é a fase escolhida para jogar —
   * sem ele, continua de onde parou, e quem concluiu tudo joga de
   * novo desde a fase 1.
   */
  function iniciarSituacao(obj, chaveProgresso, nivel) {
    situacao = obj;
    chave = chaveProgresso;
    progresso = Progresso.ler(chave);

    if (Number.isInteger(nivel)) indiceFase = nivel;
    else indiceFase = progresso.fase < situacao.fases.length ? progresso.fase : 0;

    // aparência do chamado (campos opcionais — ver motor.js)
    tela.style.setProperty('--img', situacao.fundo ? `url("${situacao.fundo}")` : 'none');
    tela.style.setProperty('--cor', situacao.cor || '#8c6d4a');
    tela.classList.toggle('sem-fundo', !situacao.fundo);

    montarFase();
    irPara('fase');
    focarPrimeiraCarta();
  }

  function focarPrimeiraCarta() {
    const primeira = fila.querySelector('.carta');
    if (primeira) primeira.focus({ preventScroll: true });
  }

  /* ============================================================
     MONTAGEM DA FASE — tudo nasce dos dados
     ============================================================ */

  /* A carta e o embaralhamento moram no comum.js: a prévia do
     editor monta a carta com a MESMA função, então o professor
     testa exatamente a carta que a criança vai ver. */
  const { criarCarta, embaralhar } = Comum;

  function montarFase() {
    const f = fase();

    titulo.textContent = f.titulo || situacao.titulo;
    instrucao.textContent = f.instrucao ||
      'Arraste as cartas para os espaços — ou toque na carta e depois no espaço.';

    // um espaço numerado por passo, todos vazios; até 4 por linha
    tela.style.setProperty('--colunas', Math.min(f.passos.length, 4));
    grade.textContent = '';
    f.passos.forEach((_, i) => {
      const li = document.createElement('li');
      li.className = 'espaco vazio';
      const numero = document.createElement('span');
      numero.className = 'espaco-numero';
      numero.textContent = i + 1;
      const alvo = document.createElement('div');
      alvo.className = 'espaco-alvo';
      li.append(numero, alvo);
      grade.append(li);
    });

    // as cartas entram embaralhadas na bandeja
    fila.textContent = '';
    embaralhar(f.passos).forEach(p => {
      const li = document.createElement('li');
      li.append(criarCarta(p));
      fila.append(li);
    });

    // rodapé: nível atual
    progTexto.textContent = `Nível ${indiceFase + 1} de ${situacao.fases.length}`;

    atualizarBotaoDica();

    erros = 0;
    faseConcluida = false;
    erroQueSoou = null;
    limparReacao();
    atualizarEstrelas();
    Montagem.preparar(situacao, f);
  }

  /* Fase completa sem erro: grava o avanço e mostra a lição. */
  function aoConcluirFase() {
    const ganhas = erros === 0 ? 3 : erros === 1 ? 2 : 1;
    progresso.niveis[indiceFase] = Math.max(progresso.niveis[indiceFase] || 0, ganhas);
    // rejogar um nível antigo nunca faz o chamado voltar atrás
    progresso.fase = Math.max(progresso.fase, indiceFase + 1);
    Progresso.gravar(chave, progresso);
    atualizarEstrelas();

    Perfil.dados.dicas += 1;
    const ultima = indiceFase + 1 >= situacao.fases.length;
    // chamado do professor não entra na conta da promoção
    if (ultima && !chave.startsWith('prof:')) Perfil.dados.concluidos[situacao.id] = true;
    Perfil.gravar();

    const premio = { estrelas: ganhas, dicas: 1 };
    document.querySelectorAll('#licao .gStars').forEach(e => { e.textContent = contadorNum.textContent; });
    rosto.src = ROSTO.dica;
    // a espera deixa a criança ver a última carta assentar; o som de
    // vitória entra junto com a lição, sem atropelar o som do acerto
    setTimeout(() => {
      if (!situacao) return;
      Som.vitoria();
      mostrarConclusao(situacao, indiceFase, premio);
      irPara('licao');
    }, 650);
  }

  // "Continuar" da lição: próxima fase — ou, na última, a central
  document.addEventListener('conclusao-continuar', () => {
    if (!situacao) return;
    if (indiceFase + 1 < situacao.fases.length) {
      indiceFase += 1;
      montarFase();
      irPara('fase');
      focarPrimeiraCarta();
    } else {
      const terminou = situacao;
      situacao = null;
      document.dispatchEvent(new CustomEvent('situacao-concluida', { detail: { situacao: terminou } }));
    }
  });

  /* ---------------- estrelas do topo ---------------- */

  // o topo mostra o total do agente, como na central
  function atualizarEstrelas() {
    contadorNum.textContent = chave && chave.startsWith('prof:')
      ? Progresso.estrelas(chave) : Progresso.total();
    contador.setAttribute('aria-label', `${contadorNum.textContent} estrelas`);
  }

  /* ============================================================
     DICA — coloca a carta do primeiro espaço vazio ou errado
     ============================================================ */

  function atualizarBotaoDica() {
    const restam = Perfil.dados.dicas;
    dicaRestantes.textContent = restam;
    btnDica.setAttribute('aria-label', restam > 0
      ? `Pedir uma dica — ${restam === 1 ? 'resta 1 dica' : `restam ${restam} dicas`}`
      : 'Suas dicas acabaram. Conclua um nível para ganhar mais!');
  }

  /* Onde a dica age: o primeiro espaço que está vazio ou que tem
     uma carta cujos pré-requisitos não estão todos antes dela. A
     carta que vai para lá é o primeiro passo (na ordem do
     professor) que ainda não está nesse começo certo e cujos
     pré-requisitos já estão todos nele. */
  function lugarDaDica() {
    const seq = lerSequencia();
    const dependencias = derivarDependencias(fase().passos);
    const certos = new Set();
    for (let i = 0; i < seq.length; i++) {
      const id = seq[i];
      if (id && dependencias[id].every(d => certos.has(d))) {
        certos.add(id);
        continue;
      }
      const passo = fase().passos.find(p =>
        !certos.has(p.id) && dependencias[p.id].every(d => certos.has(d)));
      return passo ? { indice: i, passo } : null;
    }
    return null;                                // tabuleiro já completo
  }

  btnDica.addEventListener('click', () => {
    if (faseConcluida) return;
    if (Perfil.dados.dicas <= 0) {
      balao.textContent = 'Você não tem dicas. Conclua um nível para ganhar mais!';
      return;
    }

    const lugar = lugarDaDica();
    if (!lugar) return;
    const carta = cartaDe(lugar.passo.id);
    const espaco = grade.querySelectorAll('.espaco')[lugar.indice];
    if (!carta || !espaco) return;

    Perfil.dados.dicas -= 1;
    Perfil.gravar();
    atualizarBotaoDica();
    erros += 1;

    // a carta entra pelas mesmas regras do arrasto (o jogo valida
    // ao ouvir 'carta-movida'); depois o robô diz qual passo era
    Arrasto.mover(carta, { tipo: 'espaco', espaco });
    if (faseConcluida) return;
    carta.classList.add('carta-dica');
    rosto.src = ROSTO.dica;
    balao.textContent =
      `Passo ${lugar.indice + 1}: "${lugar.passo.texto}" Dá para fazer o resto!`;
    anunciar(balao.textContent);
  });

  /* ============================================================
     ESCOLHER NÍVEL — rejogar qualquer fase já liberada
     ============================================================ */

  const modalNiveis = document.querySelector('#niveis');
  const listaNiveis = modalNiveis.querySelector('.lista-niveis');

  /* Mostra todas as fases do chamado: as já concluídas com as suas
     estrelas, a próxima como "Novo!" e as que vêm depois bloqueadas
     (cada fase é mais detalhada que a anterior, então a ordem
     importa na primeira vez). */
  function abrirNiveis(obj, chaveProgresso) {
    const prog = Progresso.ler(chaveProgresso);
    modalNiveis.querySelector('.niveis-titulo').textContent = obj.titulo;
    listaNiveis.textContent = '';
    obj.fases.forEach((f, i) => {
      const botao = document.createElement('button');
      botao.type = 'button';
      botao.className = 'nivel-btn';
      const nome = document.createElement('b');
      nome.textContent = `Nível ${i + 1}`;
      const info = document.createElement('span');
      const estrelas = prog.niveis[i] || 0;
      if (i > prog.fase) {
        botao.disabled = true;
        info.textContent = 'bloqueado';
        botao.setAttribute('aria-label', `Nível ${i + 1}, bloqueado`);
      } else if (estrelas) {
        info.className = 'st';
        info.innerHTML = '★'.repeat(estrelas) + '<u>' + '★'.repeat(3 - estrelas) + '</u>';
        botao.setAttribute('aria-label', `Nível ${i + 1}, ${estrelas} de 3 estrelas. Jogar de novo`);
      } else {
        info.textContent = 'Novo!';
        botao.classList.add('novo');
      }
      if (situacao === obj && i === indiceFase && document.querySelector('#fase.on')) {
        botao.classList.add('atual');
      }
      botao.append(nome, info);
      botao.onclick = () => {
        modalNiveis.classList.remove('on');
        iniciarSituacao(obj, chaveProgresso, i);
      };
      listaNiveis.append(botao);
    });
    modalNiveis.classList.add('on');
    const primeiro = listaNiveis.querySelector('.atual, .novo') || listaNiveis.querySelector('button:not(:disabled)');
    if (primeiro) primeiro.focus();
  }

  modalNiveis.querySelector('.niveis-fechar').addEventListener('click', () => {
    modalNiveis.classList.remove('on');
  });

  tela.querySelector('#btn-niveis').addEventListener('click', () => {
    if (situacao) abrirNiveis(situacao, chave);
  });

  /* ---------------- leitura do tabuleiro ---------------- */

  // um item por espaço, na ordem: id do passo colocado, ou null
  function lerSequencia() {
    return [...grade.querySelectorAll('.espaco')].map(espaco => {
      const carta = espaco.querySelector('.carta');
      return carta ? carta.dataset.passo : null;
    });
  }

  function cartaDe(idPasso) {
    return tela.querySelector(`.carta[data-passo="${idPasso}"]`);
  }

  function legendaDe(carta) {
    const p = carta.querySelector('.carta-legenda');
    return p ? p.textContent.trim() : 'carta';
  }

  /* ---------------- reação a cada movimento ---------------- */

  function aoMoverCarta(ev) {
    if (!situacao || !tela.classList.contains('on')) return;

    limparReacao();

    const sequencia = lerSequencia();
    const resultado = validarSequencia(fase(), sequencia);
    // a montagem mostra a ordem que está na tela, certa ou errada
    Montagem.atualizar(sequencia, resultado.erro, resultado.completa);

    if (resultado.erro) {
      faseConcluida = false;
      mostrarErro(resultado.erro);
      return;
    }

    erroQueSoou = null;                        // caminho livre de novo

    const { carta, alvo, mudou } = ev.detail;
    if (mudou && alvo.tipo === 'espaco') {
      assentar(carta);
      Som.acerto();
    }

    if (resultado.completa) {
      if (!faseConcluida) {
        faseConcluida = true;
        aoConcluirFase();
      }
    } else {
      faseConcluida = false;
    }
  }

  /* ---------------- acerto: retorno discreto ---------------- */

  function assentar(carta) {
    carta.classList.remove('carta-assentou');
    void carta.offsetWidth; // reinicia a animação se ela já rodou
    carta.classList.add('carta-assentou');
    carta.addEventListener('animationend',
      () => carta.classList.remove('carta-assentou'), { once: true });
  }

  /* ---------------- erro: mostrar, não corrigir ---------------- */

  /* A carta mal colocada NÃO volta sozinha para o lugar certo, de
     propósito. Se o jogo corrigisse automaticamente, o tabuleiro se
     arrumaria diante da criança sem que ela entendesse o porquê — e é
     exatamente no confronto entre "o que eu fiz" e "a consequência
     que apareceu" que ela aprende. A carta permanece onde foi solta,
     marcada com atenção, ao lado da explicação da consequência; quem
     decide o que mover, e quando, é a criança. */
  function mostrarErro(erro) {
    // o som só marca a CHEGADA do problema, não a permanência dele
    const chaveErro = erro.passo.id + '→' + (erro.preRequisito ? erro.preRequisito.id : '');
    if (chaveErro !== erroQueSoou) {
      erroQueSoou = chaveErro;
      erros += 1;
      Som.erro();
    }

    const cartaProblema = cartaDe(erro.passo.id);
    if (cartaProblema) cartaProblema.classList.add('carta-atencao');

    // o pré-requisito faltando pisca para a criança ligar a
    // explicação ao objeto na tela
    if (erro.preRequisito) {
      const cartaPre = cartaDe(erro.preRequisito.id);
      if (cartaPre) cartaPre.classList.add('carta-piscar');
    }

    // quem explica é o robô-guia, no balão dele
    balao.textContent = erro.mensagem;
    guia.classList.add('atencao');
    rosto.src = ROSTO.erro;

    anunciar(erro.mensagem);
  }

  // a explicação fica na tela até a criança mexer de novo —
  // nunca some por tempo
  function limparReacao() {
    tela.querySelectorAll('.carta-atencao, .carta-piscar, .carta-dica').forEach(c => {
      c.classList.remove('carta-atencao', 'carta-piscar', 'carta-dica');
    });

    balao.textContent = falaDoMascote();
    guia.classList.remove('atencao');
    rosto.src = ROSTO.normal;
  }

  /* ---------------- leitor de tela ---------------- */

  // região viva própria: não disputa com os avisos de movimento
  // do arrasto.js (os dois seriam lidos, um depois do outro)
  function anunciar(texto) {
    if (!leitor) return;
    leitor.textContent = '';
    setTimeout(() => { leitor.textContent = texto; }, 60);
  }

  document.addEventListener('carta-movida', aoMoverCarta);

  window.iniciarSituacao = iniciarSituacao;
  window.abrirNiveis = abrirNiveis;

})();
