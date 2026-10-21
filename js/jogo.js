/* ============================================================
   jogo.js — a partida da criança, do primeiro passo à última fase.

   Liga as partes: a tela da fase (index.html), as cartas
   (comum.js), o arrasto (arrasto.js), o motor de validação
   (motor.js), o som (som.js), a lição (conclusao.js) e a memória
   (progresso.js e perfil.js). A central de chamados (app.js) chama
   iniciarSituacao(situacao, chave); daqui para a frente:

   - o tabuleiro e a bandeja são MONTADOS DOS DADOS da fase
     (situacoes.js ou arquivo do professor — mesmo formato);
   - a cada movimento a sequência é lida do DOM e validada;
   - acerto → a carta "assenta", soa e pode render uma estrela;
   - erro → a carta ganha marcação de atenção, o pré-requisito
     pisca, o robô-guia fica confuso e a explicação (escrita nos
     DADOS) toma o balão dele;
   - fase completa sem erro → tela de lição → próxima fase;
   - última fase → evento 'situacao-concluida' (o app.js decide se
     é hora da promoção ou de voltar à central).

   ESTRELAS contam acertos e nunca punem o erro: cada carta que
   entra no lugar sem criar problema vale 1 estrela (uma vez por
   fase). Errar e corrigir não tira nada — a criança que erra e
   conserta aprende mais do que a que acerta de primeira.

   DICAS são um estoque do agente (perfil.js): cada fase concluída
   dá +1. A dica destaca a carta que pode entrar AGORA, sem
   colocá-la — quem coloca é sempre a criança.
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
  const progBolinhas = tela.querySelector('.progresso-bolinhas');
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

  Som.ligarBotao(tela.querySelector('#btn-som'));

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
  let progresso  = null;   // { fase, estrelas, cartas } — ver progresso.js
  let estrelasNoInicio = 0; // para a lição dizer quantas a fase rendeu
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
   * Começa (ou continua) uma situação. Chamada pela central.
   * chaveProgresso identifica a situação no localStorage.
   */
  function iniciarSituacao(obj, chaveProgresso) {
    situacao = obj;
    chave = chaveProgresso;
    progresso = Progresso.ler(chave);

    // continua de onde parou; quem concluiu tudo recomeça da fase 1
    indiceFase = progresso.fase < situacao.fases.length ? progresso.fase : 0;
    if (progresso.fase >= situacao.fases.length) {
      progresso = { fase: 0, estrelas: progresso.estrelas, cartas: [] };
    }

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

    // rodapé: nível atual e bolinhas
    progTexto.textContent = `Nível ${indiceFase + 1} de ${situacao.fases.length}`;
    progBolinhas.textContent = '';
    situacao.fases.forEach((_, i) => {
      const b = document.createElement('i');
      b.className = 'bolinha' + (i < indiceFase ? ' feita' : i === indiceFase ? ' atual' : '');
      progBolinhas.append(b);
    });

    atualizarBotaoDica();

    estrelasNoInicio = progresso.estrelas;
    faseConcluida = false;
    erroQueSoou = null;
    limparReacao();
    atualizarEstrelas(false);
  }

  /* Fase completa sem erro: grava o avanço e mostra a lição. */
  function aoConcluirFase() {
    progresso.fase = indiceFase + 1;
    progresso.cartas = [];
    Progresso.gravar(chave, progresso);

    Perfil.dados.dicas += 1;
    const ultima = indiceFase + 1 >= situacao.fases.length;
    if (ultima) Perfil.dados.concluidos[situacao.id] = true;
    Perfil.gravar();

    const premio = { estrelas: progresso.estrelas - estrelasNoInicio, dicas: 1 };
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

  /* ============================================================
     ESTRELAS — contam acertos, nunca punem o erro
     ============================================================ */

  function atualizarEstrelas(animar) {
    // o topo mostra o total do agente, como na central; a situação
    // do professor conta à parte, só ela
    contadorNum.textContent = chave.startsWith('prof:') ? progresso.estrelas : Progresso.total();
    contador.setAttribute('aria-label', `${contadorNum.textContent} estrelas`);
    if (animar) {
      contador.classList.remove('estrela-ganha');
      void contador.offsetWidth;
      contador.classList.add('estrela-ganha');
    }
  }

  /* A carta entrou num espaço e os pré-requisitos dela já estão
     todos ANTES dela no tabuleiro: acerto de verdade, vale 1
     estrela — uma única vez por fase (tirar e recolocar não paga
     de novo, e errar antes de acertar não desconta nada). */
  function premiarSePrimeiraVez(carta) {
    const id = carta.dataset.passo;
    if (progresso.cartas.includes(id)) return;

    const seq = lerSequencia();
    const indice = seq.indexOf(id);
    if (indice < 0) return;
    const antes = new Set(seq.slice(0, indice).filter(Boolean));
    const dependencias = derivarDependencias(fase().passos);
    if (!dependencias[id].every(d => antes.has(d))) return;
    progresso.cartas.push(id);
    progresso.estrelas += 1;
    Progresso.gravar(chave, progresso);
    atualizarEstrelas(true);
  }

  /* ============================================================
     DICA — mostra qual carta pode entrar agora, sem colocá-la
     ============================================================ */

  function atualizarBotaoDica() {
    const restam = Perfil.dados.dicas;
    dicaRestantes.textContent = restam;
    btnDica.disabled = restam <= 0;
    btnDica.setAttribute('aria-label', restam > 0
      ? `Pedir uma dica — ${restam === 1 ? 'resta 1 dica' : `restam ${restam} dicas`}`
      : 'Suas dicas acabaram. Conclua um nível para ganhar mais!');
  }

  /* Qual carta "deveria vir agora"?
     - Se o tabuleiro tem um problema, é o pré-requisito que falta:
       destacá-lo liga a explicação ao objeto na tela.
     - Senão, é o primeiro passo (na ordem do professor) ainda fora
       do tabuleiro cujos pré-requisitos já estão todos colocados. */
  function passoDaDica() {
    const seq = lerSequencia();
    const resultado = validarSequencia(fase(), seq);
    if (resultado.erro && resultado.erro.preRequisito) {
      return resultado.erro.preRequisito;
    }
    const colocados = new Set(seq.filter(Boolean));
    const dependencias = derivarDependencias(fase().passos);
    for (const p of fase().passos) {
      if (colocados.has(p.id)) continue;
      if (dependencias[p.id].every(d => colocados.has(d))) return p;
    }
    return null;
  }

  btnDica.addEventListener('click', () => {
    if (Perfil.dados.dicas <= 0 || faseConcluida) return;

    const passo = passoDaDica();
    if (!passo) return;                        // tabuleiro já completo

    const carta = cartaDe(passo.id);
    if (!carta) return;

    // a dica não some sozinha: fica até o próximo movimento
    document.querySelectorAll('.carta-dica').forEach(c => c.classList.remove('carta-dica'));
    void carta.offsetWidth;
    carta.classList.add('carta-dica');
    carta.scrollIntoView({ block: 'nearest', inline: 'nearest' });

    Perfil.dados.dicas -= 1;
    Perfil.gravar();
    atualizarBotaoDica();

    rosto.src = ROSTO.dica;
    balao.textContent = `Dica: a carta "${legendaDe(carta)}" pode entrar agora!`;
    anunciar(`Dica: a carta "${legendaDe(carta)}" pode entrar agora.`);
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

    const resultado = validarSequencia(fase(), lerSequencia());

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
      premiarSePrimeiraVez(carta);
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

})();
