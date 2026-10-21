/* ============================================================
   conclusao.js — tela de lição (fase concluída)

   É aqui que a atividade vira conceito: ao completar a fase, a
   tela de "Parabéns! Você completou o nível!" mostra a LIÇÃO
   daquela fase — um título-pergunta, um texto curto e duas
   perguntas para pensar e conversar — e as recompensas.

   TODO o conteúdo vem de fase.licao (ver o formato no motor.js);
   este arquivo só monta a tela. Nada de frase de sanduíche aqui.

   Uso:  mostrarConclusao(situacao, indiceFase, premio)
         premio = { estrelas, dicas } ganhos nesta fase
   Ao apertar o botão (ou Esc), dispara
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
  const progressoTexto = raiz.querySelector('.conclusao-progresso-texto');
  const pergunta       = raiz.querySelector('.conclusao-pergunta');
  const perguntaTexto  = raiz.querySelector('.conclusao-pergunta-texto');
  const blocoTexto     = raiz.querySelector('.conclusao-texto');
  const reflexao       = raiz.querySelector('.conclusao-reflexao');
  const listaReflexao  = raiz.querySelector('.conclusao-reflexao ul');
  const botao          = raiz.querySelector('.conclusao-continuar');
  const botaoTexto     = raiz.querySelector('.conclusao-continuar-texto');
  const arte           = raiz.querySelector('.licao-arte');
  const premioEstrelas = raiz.querySelector('.premio-estrelas');
  const premioDicas    = raiz.querySelector('.premio-dicas');

  // para o evento de continuar
  let contexto = null;

  function preencherParagrafos(bloco, texto) {
    bloco.textContent = '';
    const frases = Array.isArray(texto) ? texto : [texto];
    for (const frase of frases) {
      const p = document.createElement('p');
      p.textContent = frase;
      bloco.append(p);
    }
  }

  /* ------------- abrir e fechar ------------- */

  function mostrarConclusao(situacao, indiceFase, premio = { estrelas: 0, dicas: 0 }) {
    const licao = situacao.fases[indiceFase].licao || {};

    progressoTexto.textContent =
      `Nível ${indiceFase + 1} de ${situacao.fases.length} concluído`;

    pergunta.hidden = !licao.pergunta;
    perguntaTexto.textContent = licao.pergunta || '';

    blocoTexto.hidden = !licao.texto;
    if (licao.texto) preencherParagrafos(blocoTexto, licao.texto);

    reflexao.hidden = !(licao.reflexao && licao.reflexao.length);
    listaReflexao.textContent = '';
    (licao.reflexao || []).forEach(perguntaReflexao => {
      const li = document.createElement('li');
      li.textContent = perguntaReflexao;
      listaReflexao.append(li);
    });

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
