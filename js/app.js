/* ============================================================
   app.js — as telas em volta da partida

   menu → abertura (4 quadros) → crachá do agente → central de
   chamados → fase (jogo.js) → lição (conclusao.js) → … → central
   → promoção (todos os chamados concluídos) → tela final.

   Cada tela é uma <section class="screen"> do index.html; só uma
   fica com a classe "on" por vez (irPara). Quem joga a fase é o
   jogo.js; aqui só se escolhe O QUE jogar e para onde ir depois.
   ============================================================ */

'use strict';

(function () {

  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  const P = Perfil.dados;

  const ABERTURA = [
    'Na cidade de Algoritimando, os chamados de ajuda não param de chegar.',
    'Este é o Robô-guia. Ele sabe onde cada pessoa precisa de ajuda.',
    'Você vai ser o novo estagiário. Aqui está o seu crachá!',
    'Cada ponto laranja é um chamado. Ensine o robô, passo a passo.',
  ];

  /* ---------------- navegação ---------------- */

  function irPara(id) {
    $$('.screen').forEach(s => s.classList.toggle('on', s.id === id));
    Som.clique();
  }
  window.irPara = irPara;

  /* Os 6 agentes: o número é o P.avatar. Cada um tem o retrato
     (img/avN.png), a cena de promoção (img/promoN.jpg) e o corpo
     inteiro recortado para a tela final. */
  const CORPO = ['menina', 'menino', 'afro-menina', 'afro-menino', 'latina', 'latino'];

  const avatarSrc = () => `img/av${P.avatar}.png`;

  // topo de todas as telas: rosto + nome do agente e total de estrelas
  function atualizarTopo() {
    $$('.chip.who').forEach(e => {
      e.textContent = '';
      const img = document.createElement('img');
      img.className = 'ci';
      img.src = avatarSrc();
      img.alt = '';
      e.append(img, ' ' + P.nome);
    });
    const total = Progresso.total();
    $$('.gStars').forEach(e => { e.textContent = total; });
  }

  /* ---------------- menu ---------------- */

  function irParaMenu() {
    $('#bPlay').textContent = P.comecou ? 'Continuar' : 'Jogar';
    irPara('menu');
  }

  $('#bPlay').onclick = () => {
    if (P.comecou) central();
    else { quadro(0); irPara('story'); }
  };
  Som.ligarBotao($('#bSound'), true);
  $('#bHow').onclick = () => $('#how').classList.add('on');
  $('#bHowClose').onclick = () => $('#how').classList.remove('on');
  $$('[data-home]').forEach(b => { b.onclick = irParaMenu; });

  /* ---------------- abertura ---------------- */

  let qi = 0;
  function quadro(i) {
    qi = i;
    $('#sceneArt').style.backgroundImage = `url(img/story${i + 1}.jpg)`;
    $('#sceneArt').style.backgroundPosition = ['50%', '78%', '58%', '50%'][i] + ' center';
    $('#sceneText').textContent = ABERTURA[i];
    $('#dots').innerHTML = ABERTURA.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('');
    $('#bNext').textContent = i === ABERTURA.length - 1 ? 'Começar!' : 'Avançar ›';
  }
  $('#bNext').onclick = () => (qi < ABERTURA.length - 1 ? quadro(qi + 1) : irParaCracha());
  $('#bSkip').onclick = irParaCracha;

  /* ---------------- crachá ---------------- */

  function irParaCracha() {
    irPara('char');
    $('#nameIn').focus();
  }
  $$('.avatar').forEach(b => {
    b.onclick = () => {
      $$('.avatar').forEach(x => x.classList.remove('sel'));
      b.classList.add('sel');
      P.avatar = b.dataset.a;
      $('#badgeFace').src = avatarSrc();
      Som.clique();
    };
  });
  $('#nameIn').oninput = e => { $('#badgeName').textContent = e.target.value.trim() || 'Agente'; };
  $('#bConfirm').onclick = () => {
    P.comecou = true;
    P.nome = $('#nameIn').value.trim().slice(0, 14) || 'Agente';
    Perfil.gravar();
    central(`Bem-vindo, ${P.nome}! Escolha um chamado e toque em "Atender".`);
  };

  /* ---------------- central de chamados ---------------- */

  const concluidos = () => SITUACOES.filter(s => P.concluidos[s.id]).length;

  function central(mensagem) {
    atualizarTopo();
    const lista = $('#calls');
    lista.textContent = '';

    SITUACOES.forEach((s, i) => {
      const prog = Progresso.ler(s.id);
      const feito = !!P.concluidos[s.id];
      const emAndamento = prog.fase > 0 && prog.fase < s.fases.length;

      const cartao = document.createElement('div');
      cartao.className = 'call' + (feito ? ' done' : '');
      if (s.cor) cartao.style.setProperty('--c', s.cor);
      cartao.innerHTML = `
        <div class="who"><img alt=""></div>
        <div class="pic"><img alt=""></div>
        <div class="meta">
          <div><b></b><small></small></div>
          <button class="btn"></button>
        </div>`;
      cartao.querySelector('.who img').src = s.cliente || 'img/guide.png';
      cartao.querySelector('.pic img').src = s.cena || 'img/guide.png';
      cartao.querySelector('b').textContent = s.titulo;

      const nivel = emAndamento ? prog.fase + 1 : feito ? s.fases.length : 1;
      cartao.querySelector('small').textContent =
        `Chamado ${i + 1}${s.local ? ' · ' + s.local : ''} · Nível ${nivel} de ${s.fases.length}`;

      const botao = cartao.querySelector('.btn');
      if (feito && !emAndamento) {
        // concluído: mostra a média de estrelas dos níveis (de 1 a 3);
        // tocar nelas joga o chamado de novo
        const media = Math.round(Progresso.estrelas(s.id) / s.fases.length);
        botao.className = 'st';
        botao.innerHTML = '★'.repeat(media) + '<u>' + '★'.repeat(3 - media) + '</u>';
        botao.title = 'Jogar de novo';
        botao.setAttribute('aria-label', `${media} de 3 estrelas. Jogar de novo`);
      } else {
        botao.textContent = emAndamento ? 'Continuar ›' : 'Atender ›';
      }
      botao.onclick = () => iniciarSituacao(s, s.id);

      lista.append(cartao);
    });

    const n = concluidos(), total = SITUACOES.length;
    $('#bRestart').hidden = n < total;
    $('#progTxt').textContent = `${n} de ${total}`;
    $('#progBar').style.width = (n / total) * 100 + '%';
    $('#hubMsg').textContent = mensagem ||
      (n === 0 ? 'Toque em "Atender" para começar. Cada chamado tem vários níveis!'
        : n < total ? `Ótimo trabalho! Ainda faltam ${total - n} chamados.`
        : 'Todos os chamados concluídos! Você pode jogar qualquer um de novo.');
    irPara('hub');
  }

  // fim da última fase de um chamado
  document.addEventListener('situacao-concluida', ev => {
    const s = ev.detail.situacao;
    if (concluidos() === SITUACOES.length && !P.promovido) {
      P.promovido = true;
      Perfil.gravar();
      promocao();
    } else {
      central(`Chamado "${s.titulo}" concluído! Escolha o próximo.`);
    }
  });

  /* ---------------- promoção e final ---------------- */

  function promocao() {
    atualizarTopo();
    $('#promo').style.setProperty('--img', `url(img/promo${P.avatar}.jpg)`);
    irPara('promo');
    Som.vitoria();
  }

  $('#bPromoNext').onclick = () => {
    $('#finName').textContent = P.nome;
    $('#finAg').src = `img/agente-${CORPO[+P.avatar]}.png`;
    $('#finStarsN').textContent = Progresso.total();
    irPara('final');
  };
  $('#bToHub').onclick = () => central();

  function recomecar() {
    SITUACOES.forEach(s => Progresso.apagar(s.id));
    Perfil.recomecar();
    central(`Novos chamados chegando! Boa sorte, ${P.nome}!`);
  }
  $('#bAgain').onclick = recomecar;
  $('#bRestart').onclick = () => $('#again').classList.add('on');
  $('#bNo').onclick = () => $('#again').classList.remove('on');
  $('#bYes').onclick = () => {
    $('#again').classList.remove('on');
    recomecar();
  };

  /* ---------------- partida ---------------- */

  $('#nameIn').value = P.comecou ? P.nome : '';
  $('#badgeName').textContent = P.nome;
  $$('.avatar').forEach(x => x.classList.toggle('sel', x.dataset.a === P.avatar));
  $('#badgeFace').src = avatarSrc();
  atualizarTopo();
  $('#bPlay').textContent = P.comecou ? 'Continuar' : 'Jogar';
  $('#menu').classList.add('on');

})();
