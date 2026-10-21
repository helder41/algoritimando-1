/* ============================================================
   comum.js — o que o jogo, o editor e a tela inicial fazem igual.

   Três coisas moravam copiadas em mais de um arquivo e agora
   moram aqui:

     1. montar a carta de um passo (jogo.js e a prévia do editor
        desenham a MESMA carta — se as duas divergirem, o
        professor testa uma coisa e a criança joga outra);
     2. embaralhar a bandeja;
     3. conferir um arquivo .json antes de abri-lo (a tela inicial
        e o editor faziam a mesma conferência com textos quase
        iguais; agora a frase que o professor lê é a mesma nos
        dois lugares).

   Este arquivo mexe no DOM — ao contrário do motor.js, que roda
   no Node para os testes.
   ============================================================ */

'use strict';

(function () {

  /* ============================================================
     FIGURA DA CARTA

     O campo "imagem" de um passo aceita duas coisas bem
     diferentes:
       - uma REFERÊNCIA DE ARQUIVO (caminho "img/pao.png" ou uma
         data: URL vinda do editor);
       - um EMOJI ("🍞") — texto curto, desenhado direto.

     E existe o campo "imagemReserva": um emoji usado quando o
     arquivo não carrega. É ele que segura o jogo de pé enquanto
     as ilustrações não ficam prontas (ou quando o professor
     move o .json de pasta e os caminhos quebram): em vez de um
     retângulo bege vazio, a criança vê um desenho.
     ============================================================ */

  // "img/pao.png" e "data:image/..." são arquivos; "🍞" não é
  function ehReferenciaDeArquivo(valor) {
    return /^data:/.test(valor) || /[\\/.]/.test(valor);
  }

  /* Quantos DESENHOS há neste texto.

     Contar caracteres não serve: "🛍️" é o saco mais um seletor de
     variação, "🖐️" idem, e uma família é uma pilha de bonecos
     costurados por juntores — todos aparecem como UM desenho, mas
     valem 2, 3, 7 caracteres. Quem sabe separar isso é o
     Intl.Segmenter; onde ele não existir, tirar os invisíveis já
     acerta o caso comum. */
  function contarDesenhos(texto) {
    if (typeof Intl === 'undefined' || !Intl.Segmenter) {
      // navegador antigo: na dúvida, letra do tamanho normal —
      // dois emojis apertados são melhores do que um emoji miúdo
      return 1;
    }
    return [...new Intl.Segmenter().segment(texto)].length;
  }

  function desenharEmoji(el, emoji) {
    el.classList.remove('figura-imagem');
    el.style.backgroundImage = '';
    el.classList.add('figura-emoji');
    el.textContent = emoji;
    // um emoji ocupa um quadrado; dois já pedem letra menor para
    // caber na carta estreita do celular
    el.classList.toggle('figura-emoji-duplo', contarDesenhos(emoji) > 1);
  }

  function preencherFigura(el, imagem, imagemReserva) {
    const reserva = (imagemReserva || '').trim();

    if (!imagem) {
      // sem arquivo: ou o emoji de reserva, ou o retângulo padrão
      if (reserva) desenharEmoji(el, reserva);
      return;
    }

    if (!ehReferenciaDeArquivo(imagem)) {
      desenharEmoji(el, imagem);
      return;
    }

    el.classList.add('figura-imagem');
    el.style.backgroundImage = `url("${imagem}")`;

    /* background-image não avisa quando falha, então a mesma URL é
       pedida de novo por um Image() só para ouvir o onerror. O
       navegador serve as duas do mesmo cache: é uma requisição, não
       duas. Se falhar, o emoji de reserva entra no lugar. */
    if (!reserva) return;
    const sonda = new Image();
    sonda.onerror = () => desenharEmoji(el, reserva);
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
    preencherFigura(figura, passo.imagem, passo.imagemReserva);

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

  /* ============================================================
     CONFERIR UM ARQUIVO .json

     Devolve { ok: true } ou { ok: false, mensagem }. Cada recusa
     tem a SUA frase: quem abre o arquivo fica sabendo o que há de
     errado com ele, e a tela nunca trava.

     paraJogar = true  → a tela inicial vai jogar isto agora, então
                         exige material jogável (fases com passos);
     paraJogar = false → o editor vai CONSERTAR o arquivo, então
                         aceita fases vazias de propósito.
     ============================================================ */

  function validarArquivoSituacao(texto, paraJogar) {
    let obj;
    try { obj = JSON.parse(texto); }
    catch {
      return { ok: false, mensagem: 'Este arquivo não é um .json válido. ' +
        'Ele foi salvo pelo editor do jogo?' };
    }

    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
      return { ok: false, mensagem: 'Este arquivo não parece ser uma situação do jogo.' };
    }

    if (typeof obj.formato === 'string' && !obj.formato.startsWith('passo-a-passo/')) {
      return { ok: false, mensagem: `Este arquivo é de outro programa ` +
        `(formato "${obj.formato}"), não uma situação do Passo a Passo.` };
    }

    if (!Array.isArray(obj.fases)) {
      return { ok: false, mensagem: 'Este arquivo não parece ser uma situação ' +
        'do jogo (não achei as fases).' };
    }

    if (!paraJogar) return { ok: true, situacao: obj };

    if (!obj.fases.length) {
      return { ok: false, mensagem: 'Este arquivo não tem nenhuma fase para jogar. ' +
        'Abra-o no editor para completá-lo.' };
    }

    const jogavel = obj.fases.every(f =>
      f && typeof f === 'object' && Array.isArray(f.passos) && f.passos.length);
    if (!jogavel) {
      return { ok: false, mensagem: 'Este arquivo tem fase sem nenhum passo — ' +
        'abra-o no editor para completá-lo.' };
    }

    return { ok: true, situacao: obj };
  }

  window.Comum = { preencherFigura, criarCarta, embaralhar, validarArquivoSituacao };

})();
