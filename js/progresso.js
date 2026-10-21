/* ============================================================
   progresso.js — memória do jogo entre visitas (localStorage)

   Guarda, por situação, onde a criança está:

     {
       fase:     índice da PRÓXIMA fase a jogar (0 = ainda não
                 começou; igual ao total de fases = concluiu tudo)
       estrelas: total de estrelas ganhas na situação
       cartas:   ids dos passos que já renderam estrela NA FASE
                 ATUAL (para recarregar a página não pagar de novo)
     }

   A chave de cada situação é o id dela; situações abertas de
   arquivo do professor ganham o prefixo "prof:" para nunca
   disputarem com as situações que já vêm no jogo.

   Se o localStorage estiver indisponível (modo anônimo restrito,
   memória cheia), o jogo segue funcionando — só não lembra.
   ============================================================ */

'use strict';

(function () {

  const CHAVE = 'algoritimando-progresso';

  function lerTudo() {
    try {
      const bruto = localStorage.getItem(CHAVE);
      const obj = bruto ? JSON.parse(bruto) : null;
      return (obj && typeof obj === 'object') ? obj : {};
    } catch { return {}; }
  }

  function gravarTudo(tudo) {
    try { localStorage.setItem(CHAVE, JSON.stringify(tudo)); } catch { /* segue sem memória */ }
  }

  /** Progresso de uma situação, sempre no formato completo. */
  function ler(id) {
    const p = lerTudo()[id];
    if (!p || typeof p !== 'object') return { fase: 0, estrelas: 0, cartas: [] };
    return {
      fase: Number.isInteger(p.fase) && p.fase >= 0 ? p.fase : 0,
      estrelas: Number.isInteger(p.estrelas) && p.estrelas >= 0 ? p.estrelas : 0,
      cartas: Array.isArray(p.cartas) ? p.cartas.filter(c => typeof c === 'string') : [],
    };
  }

  function gravar(id, dados) {
    const tudo = lerTudo();
    tudo[id] = { fase: dados.fase, estrelas: dados.estrelas, cartas: dados.cartas };
    gravarTudo(tudo);
  }

  /** Recomeçar do zero: apaga fase, estrelas e cartas da situação. */
  function apagar(id) {
    const tudo = lerTudo();
    delete tudo[id];
    gravarTudo(tudo);
  }

  /** Estrelas de todas as situações que vêm no jogo, somadas. */
  function total() {
    return Object.entries(lerTudo())
      .filter(([id]) => !id.startsWith('prof:'))
      .reduce((soma, [id]) => soma + ler(id).estrelas, 0);
  }

  window.Progresso = { ler, gravar, apagar, total };

})();
