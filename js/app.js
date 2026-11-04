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
      e.setAttribute('aria-label', `Agente ${P.nome}. Trocar de agente`);
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
  Som.abrirMenuBotao($('#bSound'));
  $('#bSonsFechar').onclick = () => $('#sons').classList.remove('on');
  $('#bHow').onclick = () => $('#how').classList.add('on');
  $('#bHowClose').onclick = () => $('#how').classList.remove('on');
  $$('[data-home]').forEach(b => { b.onclick = irParaMenu; });

  /* ---------------- abertura ---------------- */

  let qi = 0;
  function quadro(i) {
    qi = i;
    // a arte aparece inteira; o fundo desfocado (a mesma imagem)
    // preenche a sobra, seja qual for o formato da tela
    $('#story').style.setProperty('--arte', `url(img/story${i + 1}.jpg)`);
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

  // o crachá do topo (rosto + nome) volta para esta tela: dá para
  // trocar de agente ou de nome sem perder o progresso
  $$('.chip.who').forEach(b => {
    b.onclick = () => {
      $('#nameIn').value = P.nome;
      $('#badgeName').textContent = P.nome;
      $$('.avatar').forEach(x => x.classList.toggle('sel', x.dataset.a === P.avatar));
      $('#badgeFace').src = avatarSrc();
      irParaCracha();
    };
  });
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
    central(`Bem-vindo, ${P.nome}! Toque num lugar do mapa para ver os chamados.`);
  };

  /* ---------------- central de chamados ---------------- */

  const concluidos = () => SITUACOES.filter(s => P.concluidos[s.id]).length;

  /* emProgresso = true mostra os protótipos (em-progresso.js) no
     lugar dos chamados. O progresso deles fica numa chave "prof:",
     como os do professor: não soma estrelas nem conta como
     concluído. */
  let emProgresso = false;
  const chaveDe = s => (emProgresso ? 'prof:em-progresso:' + s.id : s.id);

  /* ---------------- mapa da cidade ----------------
     A central é o mapa da abertura (story1.jpg). Cada lugar é a casa
     de um cliente; tocar nele abre os chamados daquele lugar (campo
     "area" da situação). Chamados novos de um cliente — escovar os
     dentes depois do sanduíche — entram no mesmo lugar. As posições
     são em % da imagem, em cima de cada construção. */
  const LUGARES = [
    { id: 'casa',    nome: 'Casa',    rosto: 'img/who1.png', x: 31, y: 30 },
    { id: 'escola',  nome: 'Escola',  rosto: 'img/who3.png', x: 68, y: 33 },
    { id: 'fabrica', nome: 'Fábrica', rosto: 'img/who2.png', x: 38, y: 66 },
    { id: 'jardim',  nome: 'Jardim',  rosto: 'img/who4.png', x: 72, y: 74 },
  ];
  const doLugar = id => SITUACOES.filter(s => s.area === id);

  function desenharMapa() {
    const mapa = $('#mapa');
    mapa.textContent = '';
    for (const lugar of LUGARES) {
      const lista = doLugar(lugar.id);
      if (!lista.length) continue;
      const feitos = lista.filter(s => P.concluidos[s.id]).length;
      const botao = document.createElement('button');
      botao.type = 'button';
      botao.className = 'lugar' + (feitos === lista.length ? ' feito' : '');
      botao.style.left = lugar.x + '%';
      botao.style.top = lugar.y + '%';
      botao.setAttribute('aria-label',
        `${lugar.nome}: ${feitos} de ${lista.length} ${lista.length === 1 ? 'chamado concluído' : 'chamados concluídos'}`);
      botao.innerHTML = `<span class="lugar-rosto"><img alt=""></span>
        <span class="lugar-nome"></span><span class="lugar-conta"></span>`;
      botao.querySelector('img').src = lugar.rosto;
      botao.querySelector('.lugar-nome').textContent = lugar.nome;
      botao.querySelector('.lugar-conta').textContent = `${feitos}/${lista.length}`;
      botao.onclick = () => abrirLugar(lugar);
      mapa.append(botao);
    }
  }

  function abrirLugar(lugar) {
    const modal = $('#local');
    modal.querySelector('.local-nome').textContent = lugar.nome;
    modal.querySelector('.local-rosto').src = lugar.rosto;
    const lista = modal.querySelector('.local-chamados');
    lista.textContent = '';
    doLugar(lugar.id).forEach(s => lista.append(cartaoDeChamado(s, SITUACOES.indexOf(s))));
    modal.classList.add('on');
  }
  $('#local .local-fechar').onclick = () => $('#local').classList.remove('on');

  /* o cartão de um chamado: no lugar do mapa e na lista "Em progresso" */
  function cartaoDeChamado(s, i) {
    const chave = chaveDe(s);
    const prog = Progresso.ler(chave);
    const feito = emProgresso ? prog.fase >= s.fases.length : !!P.concluidos[s.id];
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
    if (s.cena) cartao.querySelector('.pic img').src = s.cena;
    else {
      // protótipo ainda sem ilustração: o quadro tracejado do jogo
      const pic = cartao.querySelector('.pic');
      pic.textContent = 'ilustração do chamado';
      pic.classList.add('figura-vazia');
    }
    cartao.querySelector('b').textContent = s.titulo;

    const nivel = emAndamento ? prog.fase + 1 : feito ? s.fases.length : 1;
    cartao.querySelector('small').textContent =
      `${emProgresso ? 'Protótipo' : 'Chamado'} ${i + 1}${s.local ? ' · ' + s.local : ''} · Nível ${nivel} de ${s.fases.length}`;

    const botao = cartao.querySelector('.btn');
    if (feito && !emAndamento) {
      // concluído: a média de estrelas dos níveis (de 1 a 3) e um
      // botão claro para jogar de novo — ele abre a lista de níveis
      const media = Math.round(Progresso.estrelas(chave) / s.fases.length);
      const estrelas = document.createElement('span');
      estrelas.className = 'st';
      estrelas.setAttribute('role', 'img');
      estrelas.setAttribute('aria-label', `${media} de 3 estrelas`);
      estrelas.innerHTML = Comum.estrelasHTML(media);
      // as estrelas ficam logo acima do botão
      const coluna = document.createElement('div');
      coluna.className = 'rejogar-coluna';
      botao.before(coluna);
      coluna.append(estrelas, botao);
      botao.classList.add('rejogar');
      botao.textContent = 'Jogar de novo ›';
      botao.title = 'Escolher um nível para jogar de novo';
    } else {
      botao.textContent = emAndamento ? 'Continuar ›' : 'Atender ›';
    }
    botao.onclick = () => {
      $('#local').classList.remove('on');
      if (feito && !emAndamento) abrirNiveis(s, chave); else iniciarSituacao(s, chave);
    };
    return cartao;
  }

  function central(mensagem, modoEmProgresso = false) {
    emProgresso = modoEmProgresso;
    atualizarTopo();
    $('#local').classList.remove('on');
    const lista = $('#calls');
    lista.textContent = '';
    $('#hub').classList.toggle('em-progresso', emProgresso);
    $('#hub .title-box').textContent = emProgresso ? 'Em progresso' : 'Mapa da cidade';
    $('#bEmProgresso').textContent = emProgresso ? '‹ Voltar ao mapa' : 'Em progresso';
    $('#mapa').hidden = emProgresso;
    lista.hidden = !emProgresso;

    if (emProgresso) {
      SITUACOES_EM_PROGRESSO.forEach((s, i) => lista.append(cartaoDeChamado(s, i)));
      $('#hubMsg').textContent = mensagem ||
        'Protótipos de chamados novos. O progresso daqui não conta para o jogo.';
      irPara('hub');
      return;
    }

    desenharMapa();
    const n = concluidos(), total = SITUACOES.length;
    $('#bRestart').hidden = n < total;
    $('#progTxt').textContent = `${n} de ${total}`;
    $('#progBar').style.width = (n / total) * 100 + '%';
    $('#hubMsg').textContent = mensagem ||
      (n === 0 ? 'Toque num lugar do mapa para ver os chamados de lá.'
        : n < total ? `Ótimo trabalho! Ainda faltam ${total - n} chamados.`
        : 'Todos os chamados concluídos! Você pode jogar qualquer um de novo.');
    irPara('hub');
  }

  // fim da última fase de um chamado
  document.addEventListener('situacao-concluida', ev => {
    const s = ev.detail.situacao;
    if (SITUACOES_EM_PROGRESSO.includes(s)) {
      central(`Protótipo "${s.titulo}" concluído!`, true);
    } else if (!SITUACOES.includes(s)) {
      central(`Chamado do professor "${s.titulo}" concluído!`);
    } else if (concluidos() === SITUACOES.length && !P.promovido) {
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

  /* ---------------- em progresso (protótipos, com senha) ----------------
     A senha só evita que a turma entre sem querer: está no código,
     então não é proteção de verdade. Depois de digitada, vale até
     fechar o navegador. */

  const SENHA_EM_PROGRESSO = '6234';
  const campoSenha = $('#senhaCampo');
  const avisoSenha = $('#senhaAviso');
  let liberado = false;
  try { liberado = sessionStorage.getItem('algoritimando-em-progresso') === '1'; } catch { /* sem memória */ }

  function entrarEmProgresso() {
    if (campoSenha.value.trim() !== SENHA_EM_PROGRESSO) {
      avisoSenha.textContent = 'Senha errada. Tente de novo.';
      avisoSenha.hidden = false;
      campoSenha.select();
      return;
    }
    liberado = true;
    try { sessionStorage.setItem('algoritimando-em-progresso', '1'); } catch { /* sem memória */ }
    $('#senha').classList.remove('on');
    central('', true);
  }

  $('#bEmProgresso').onclick = () => {
    if (emProgresso) { central(); return; }
    if (liberado) { central('', true); return; }
    campoSenha.value = '';
    avisoSenha.hidden = true;
    $('#senha').classList.add('on');
    setTimeout(() => campoSenha.focus(), 50);
  };
  $('#bSenhaEntrar').onclick = entrarEmProgresso;
  $('#bSenhaCancelar').onclick = () => $('#senha').classList.remove('on');
  campoSenha.addEventListener('keydown', ev => {
    if (ev.key === 'Enter') entrarEmProgresso();
    if (ev.key === 'Escape') $('#senha').classList.remove('on');
  });

  /* ---------------- chamado do professor ----------------
     Um arquivo .json salvo pela Área do professor (editor.html),
     aberto do computador (FileReader, sem servidor) e conferido
     pela mesma função do editor (Comum.validarArquivoSituacao). */

  const inputProf = $('#input-situacao');
  const avisoProf = $('#avisoProf');

  function mostrarAvisoProf(texto) {
    avisoProf.textContent = texto;
    avisoProf.hidden = !texto;
  }

  $('#bProf').onclick = () => {
    mostrarAvisoProf('');
    $('#prof').classList.add('on');
  };
  $('#bProfFechar').onclick = () => $('#prof').classList.remove('on');
  $('#bAbrirProf').onclick = () => inputProf.click();

  inputProf.addEventListener('change', () => {
    const arquivo = inputProf.files[0];
    inputProf.value = '';
    if (!arquivo) return;

    const leitor = new FileReader();
    leitor.onerror = () => {
      mostrarAvisoProf('Não deu para ler esse arquivo. Confira se ele ainda existe e tente de novo.');
    };
    leitor.onload = () => {
      // cada recusa tem a sua frase: quem abre fica sabendo O QUE há
      // de errado, e a tela nunca trava
      const conferencia = Comum.validarArquivoSituacao(leitor.result, true);
      if (!conferencia.ok) {
        mostrarAvisoProf(conferencia.mensagem);
        return;
      }
      const obj = conferencia.situacao;
      $('#prof').classList.remove('on');
      atualizarTopo();
      iniciarSituacao(obj, 'prof:' + (obj.id || 'chamado'));
    };
    leitor.readAsText(arquivo);
  });

  /* ---------------- partida ---------------- */

  $('#nameIn').value = P.comecou ? P.nome : '';
  $('#badgeName').textContent = P.nome;
  $$('.avatar').forEach(x => x.classList.toggle('sel', x.dataset.a === P.avatar));
  $('#badgeFace').src = avatarSrc();
  atualizarTopo();
  $('#bPlay').textContent = P.comecou ? 'Continuar' : 'Jogar';
  $('#menu').classList.add('on');

})();
