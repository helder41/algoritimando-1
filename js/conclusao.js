/* ============================================================
   conclusao.js — tela de conclusão de fase

   É aqui que a atividade vira conceito: ao completar a fase, um
   painel cobre o jogo com a LIÇÃO daquela fase — parabéns e
   progresso, um título-pergunta, um texto curto, a comparação de
   uma ordem que funciona com uma que não funciona, duas perguntas
   para pensar, e a lição em uma frase.

   TODO o conteúdo vem de fase.licao (ver o formato no motor.js);
   este arquivo só monta a tela. Nada de frase de sanduíche aqui.

   Uso:  mostrarConclusao(situacao, indiceFase, premio)
         premio = { estrelas, dicas } ganhos nesta fase
   Ao apertar Continuar (ou Esc), dispara
   CustomEvent('conclusao-continuar', { detail: { situacao,
   indiceFase } }) no document — o jogo.js avança para a próxima
   fase (ou volta à central, na última). Mostrar e esconder a tela
   é com o app.js (irPara), como todas as outras.
   ============================================================ */

'use strict';

(function () {

  const raiz = document.querySelector('#licao');
  if (!raiz) return;

  const painel         = raiz.querySelector('.conclusao-painel');
  const bolinhas       = raiz.querySelector('.conclusao-bolinhas');
  const progressoTexto = raiz.querySelector('.conclusao-progresso-texto');
  const pergunta       = raiz.querySelector('.conclusao-pergunta');
  const perguntaTexto  = raiz.querySelector('.conclusao-pergunta-texto');
  const blocoTexto     = raiz.querySelector('.conclusao-texto');
  const comparacao     = raiz.querySelector('.conclusao-comparacao');
  const filaCerta      = raiz.querySelector('.comparacao-certa .comparacao-fila');
  const filaErrada     = raiz.querySelector('.comparacao-errada .comparacao-fila');
  const reflexao       = raiz.querySelector('.conclusao-reflexao');
  const listaReflexao  = raiz.querySelector('.conclusao-reflexao ul');
  const reforco        = raiz.querySelector('.conclusao-reforco');
  const reforcoTexto   = raiz.querySelector('.conclusao-reforco-texto');
  const botao          = raiz.querySelector('.conclusao-continuar');
  const botaoTexto     = raiz.querySelector('.conclusao-continuar-texto');
  const arte           = raiz.querySelector('.licao-arte');
  const premioEstrelas = raiz.querySelector('.premio-estrelas');
  const premioDicas    = raiz.querySelector('.premio-dicas');

  // para o evento de continuar
  let contexto = null;

  /* ------------- pedaços da tela ------------- */

  /* Versão pequena da carta do jogo. A cor da figura é copiada da
     carta de verdade que está na tela (mesmo desenho = a criança
     reconhece); se a carta não estiver na página, fica a cor padrão. */
  function miniCarta(passo) {
    const carta = document.createElement('span');
    carta.className = 'mini-carta';

    const figura = document.createElement('span');
    figura.className = 'mini-figura';
    const figuraReal = document.querySelector(
      `.carta[data-passo="${passo.id}"] .carta-figura`);
    if (figuraReal) {
      const estilo = getComputedStyle(figuraReal);
      figura.style.backgroundColor = estilo.backgroundColor;
      // cartas com imagem (situações do professor): a mini também a mostra
      if (estilo.backgroundImage !== 'none') {
        figura.style.backgroundImage = estilo.backgroundImage;
        figura.style.backgroundSize = 'contain';
        figura.style.backgroundPosition = 'center';
        figura.style.backgroundRepeat = 'no-repeat';
      }
      // cartas com emoji (inclusive as que caíram na reserva porque a
      // imagem não carregou): a mini repete o mesmo emoji, senão a
      // comparação viraria uma fila de quadradinhos iguais
      if (figuraReal.classList.contains('figura-emoji')) {
        figura.classList.add('mini-figura-emoji');
        figura.textContent = figuraReal.textContent;
      }
    }

    const legenda = document.createElement('span');
    legenda.className = 'mini-legenda';
    legenda.textContent = passo.texto;

    carta.append(figura, legenda);
    return carta;
  }

  function preencherFila(fila, ids, porId) {
    fila.textContent = '';
    ids.forEach((id, i) => {
      if (i > 0) {
        const seta = document.createElement('span');
        seta.className = 'comparacao-seta';
        seta.textContent = '→';
        seta.setAttribute('aria-hidden', 'true');
        fila.append(seta);
      }
      if (porId[id]) fila.append(miniCarta(porId[id]));
    });
  }

  function preencherParagrafos(bloco, texto) {
    bloco.textContent = '';
    const frases = Array.isArray(texto) ? texto : [texto];
    for (const frase of frases) {
      const p = document.createElement('p');
      p.textContent = frase;
      bloco.append(p);
    }
  }

  function preencherBolinhas(total, concluidas) {
    bolinhas.textContent = '';
    for (let i = 0; i < total; i++) {
      const b = document.createElement('i');
      b.className = 'conclusao-bolinha' + (i < concluidas ? ' feita' : '');
      bolinhas.append(b);
    }
  }

  /* ------------- abrir e fechar ------------- */

  function mostrarConclusao(situacao, indiceFase, premio = { estrelas: 0, dicas: 0 }) {
    const fase = situacao.fases[indiceFase];
    const licao = fase.licao || {};
    const porId = {};
    fase.passos.forEach(p => { porId[p.id] = p; });

    preencherBolinhas(situacao.fases.length, indiceFase + 1);
    progressoTexto.textContent =
      `Nível ${indiceFase + 1} de ${situacao.fases.length} concluído!`;

    pergunta.hidden = !licao.pergunta;
    perguntaTexto.textContent = licao.pergunta || '';

    blocoTexto.hidden = !licao.texto;
    if (licao.texto) preencherParagrafos(blocoTexto, licao.texto);

    const temComparacao = licao.comparacao &&
      licao.comparacao.certa && licao.comparacao.errada;
    comparacao.hidden = !temComparacao;
    if (temComparacao) {
      preencherFila(filaCerta,  licao.comparacao.certa,  porId);
      preencherFila(filaErrada, licao.comparacao.errada, porId);
    }

    reflexao.hidden = !(licao.reflexao && licao.reflexao.length);
    listaReflexao.textContent = '';
    (licao.reflexao || []).forEach(perguntaReflexao => {
      const li = document.createElement('li');
      li.textContent = perguntaReflexao;
      listaReflexao.append(li);
    });

    reforco.hidden = !licao.reforco;
    reforcoTexto.textContent = licao.reforco || '';

    // recompensas da fase e o caminho a seguir
    const e = premio.estrelas;
    premioEstrelas.textContent = `+${e} ${e === 1 ? 'estrela' : 'estrelas'}`;
    premioDicas.textContent = `+${premio.dicas} ${premio.dicas === 1 ? 'dica' : 'dicas'}`;
    const ultima = indiceFase + 1 >= situacao.fases.length;
    botaoTexto.textContent = ultima ? 'Voltar à central' : 'Próximo nível';
    arte.style.backgroundImage = situacao.fundoConclusao ? `url("${situacao.fundoConclusao}")` : '';
    raiz.classList.toggle('sem-arte', !situacao.fundoConclusao);

    contexto = { situacao, indiceFase };
    painel.scrollTop = 0;
    setTimeout(() => painel.focus({ preventScroll: true }), 50);
  }

  function fechar() {
    if (!contexto) return;
    const detail = contexto;
    contexto = null;

    document.dispatchEvent(new CustomEvent('conclusao-continuar', { detail }));
  }

  botao.addEventListener('click', fechar);

  // Esc também continua
  raiz.addEventListener('keydown', ev => {
    if (ev.key === 'Escape') {
      ev.preventDefault();
      fechar();
    }
  });

  window.mostrarConclusao = mostrarConclusao;

})();
