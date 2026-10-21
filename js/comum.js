/* ============================================================
   comum.js — a carta de um passo e o embaralhamento da bandeja.

   Moram aqui (e não no jogo.js) porque o editor do professor, na
   próxima etapa, vai mostrar a MESMA carta na prévia: se as duas
   divergirem, o professor testa uma coisa e a criança joga outra.

   Este arquivo mexe no DOM — ao contrário do motor.js, que roda
   no Node para os testes.
   ============================================================ */

'use strict';

(function () {

  /* ============================================================
     FIGURA DA CARTA

     O campo "imagem" de um passo é um caminho ("img/passos/...")
     ou uma data: URL (vinda do editor). Enquanto o arquivo não
     existe — as ilustrações ainda estão sendo feitas, veja
     IMAGENS.md — ou quando ele não carrega, a carta mostra o
     quadro tracejado "ilustração do passo", como no Figma. A
     legenda continua dizendo o passo inteiro.
     ============================================================ */

  function mostrarQuadroVazio(el) {
    el.classList.remove('figura-imagem');
    el.style.backgroundImage = '';
    el.classList.add('figura-vazia');
    el.textContent = 'ilustração do passo';
  }

  function preencherFigura(el, imagem) {
    if (!imagem) {
      mostrarQuadroVazio(el);
      return;
    }

    el.classList.add('figura-imagem');
    el.style.backgroundImage = `url("${imagem}")`;

    /* background-image não avisa quando falha, então a mesma URL é
       pedida de novo por um Image() só para ouvir o onerror. O
       navegador serve as duas do mesmo cache: é uma requisição, não
       duas. */
    const sonda = new Image();
    sonda.onerror = () => mostrarQuadroVazio(el);
    sonda.src = imagem;
  }

  /* ---------------- a carta inteira ---------------- */

  function criarCarta(passo) {
    const carta = document.createElement('article');
    carta.className = 'carta';
    carta.dataset.passo = passo.id;
    // o arrasto.js prepara assim as cartas que já existem na
    // página; estas nascem depois, então recebem os atributos aqui
    carta.tabIndex = 0;
    carta.setAttribute('role', 'button');
    carta.setAttribute('aria-pressed', 'false');

    const figura = document.createElement('div');
    figura.className = 'carta-figura';
    figura.setAttribute('aria-hidden', 'true');   // a legenda já diz tudo
    preencherFigura(figura, passo.imagem);

    const legenda = document.createElement('p');
    legenda.className = 'carta-legenda';
    legenda.textContent = passo.texto || '(sem legenda)';

    carta.append(figura, legenda);
    return carta;
  }

  /* ---------------- bandeja embaralhada ---------------- */

  function embaralhar(passos) {
    const lista = passos.slice();
    for (let i = lista.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lista[i], lista[j]] = [lista[j], lista[i]];
    }
    // se por sorte saiu a ordem certa, desfaz a "dica"
    if (lista.length > 1 && lista.every((p, i) => p === passos[i])) {
      lista.push(lista.shift());
    }
    return lista;
  }

  window.Comum = { criarCarta, embaralhar };

})();
