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
    'No mapa, cada alfinete com um rosto é um chamado. Ensine o robô, passo a passo.',
  ];

  /* ---------------- navegação ---------------- */

  function irPara(id) {
    $$('.screen').forEach(s => s.classList.toggle('on', s.id === id));
    Som.clique();
  }
  window.irPara = irPara;

  /* Os 6 agentes: o número é o P.avatar. Cada um tem o retrato
     (img/avN.webp), a cena de promoção (img/promoN.webp) e o corpo
     inteiro recortado para a tela final. */
  const CORPO = ['menina', 'menino', 'afro-menina', 'afro-menino', 'latina', 'latino'];

  const avatarSrc = () => `img/av${P.avatar}.webp`;

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

  // imagens não são arrastáveis (o arrasto das cartas é outro, por
  // Pointer Events) — evita o "fantasma" da imagem ao segurar o mouse
  document.addEventListener('dragstart', ev => {
    if (ev.target instanceof HTMLImageElement) ev.preventDefault();
  });

  /* ---------------- celular deitado ----------------
     O aviso "vire o celular em pé" aparece por CSS (style.css) só em
     tela deitada e baixa. Dispensado, não volta até fechar a aba. */
  const CHAVE_GIRAR = 'algoritimando-deitado';
  const palco = $('#stage');
  try { if (sessionStorage.getItem(CHAVE_GIRAR) === '1') palco.classList.add('deitado-ok'); } catch { /* sem memória */ }
  $('#bGirarSeguir').onclick = () => {
    palco.classList.add('deitado-ok');
    try { sessionStorage.setItem(CHAVE_GIRAR, '1'); } catch { /* sem memória */ }
  };

  /* ---------------- menu ---------------- */

  function irParaMenu() {
    $('#bPlay').textContent = P.comecou ? 'Continuar' : 'Jogar';
    // sem progresso, não há o que reiniciar
    $('#bReiniciar').hidden = !P.comecou;
    irPara('menu');
  }

  $('#bPlay').onclick = () => {
    if (P.comecou) central();
    else { revendo = false; quadro(0); irPara('story'); }
  };

  // rever a abertura: no fim (ou no "Pular") volta para o menu
  $('#bHistoria').onclick = () => {
    revendo = P.comecou;
    quadro(0);
    irPara('story');
  };

  /* Reiniciar apaga o progresso, o perfil e os protótipos jogados;
     os ajustes de som ficam. Pede confirmação, porque não tem volta. */
  $('#bReiniciar').onclick = () => $('#reiniciar').classList.add('on');
  $('#bReiniciarNao').onclick = () => $('#reiniciar').classList.remove('on');
  $('#bReiniciarSim').onclick = () => {
    ['algoritimando-progresso', 'algoritimando-perfil', 'algoritimando-montagem'].forEach(k => {
      try { localStorage.removeItem(k); } catch { /* sem memória: nada a apagar */ }
    });
    location.reload();
  };
  Som.abrirMenuBotao($('#bSound'));
  // atalho de som no topo de todas as telas, ao lado do crachá
  const ICONE_SOM = '<svg class="icone" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M4 9v6h4l5 4V5L8 9H4Z"/>' +
    '<path class="onda" d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
    '<path class="risco" d="M16 9l6 6M22 9l-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
    '</svg>';
  $$('.top').forEach(topo => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip som-atalho';
    b.title = 'Sons';
    b.setAttribute('aria-label', 'Ajustar os sons');
    b.innerHTML = ICONE_SOM;
    const depois = topo.querySelector('.chip.who') || topo.querySelector('.chip.home');
    if (depois) depois.after(b); else topo.prepend(b);
    Som.abrirMenuBotao(b, true);
  });
  $('#bSonsFechar').onclick = () => $('#sons').classList.remove('on');
  $('#bHow').onclick = () => $('#how').classList.add('on');
  $('#bHowClose').onclick = () => $('#how').classList.remove('on');
  $$('[data-home]').forEach(b => { b.onclick = irParaMenu; });

  /* ---------------- abertura ---------------- */

  let qi = 0;
  let revendo = false;   // abertura vista de novo pelo menu
  function quadro(i) {
    qi = i;
    // a arte aparece inteira; o fundo desfocado (a mesma imagem)
    // preenche a sobra, seja qual for o formato da tela
    // ?v= faz o navegador buscar a imagem nova quando ela muda
    $('#story').style.setProperty('--arte', `url(img/story${i + 1}.webp?v=202611110727)`);
    $('#sceneText').textContent = ABERTURA[i];
    $('#dots').innerHTML = ABERTURA.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('');
    const ultimo = i === ABERTURA.length - 1;
    $('#bNext').textContent = ultimo ? (revendo ? 'Voltar ao menu' : 'Começar!') : 'Avançar ›';
  }
  const fimDaHistoria = () => (revendo ? irParaMenu() : irParaCracha());
  $('#bNext').onclick = () => (qi < ABERTURA.length - 1 ? quadro(qi + 1) : fimDaHistoria());
  $('#bSkip').onclick = fimDaHistoria;

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

  /* A promoção exige só os chamados originais (SITUACOES_BASE). Os
     novos (SITUACOES_NOVAS) aparecem no mapa e somam estrelas, mas
     não entram nessa conta: ver o fim do situacoes.js. */
  const feitosDe = lista => lista.filter(s => P.concluidos[s.id]).length;
  const concluidos = () => feitosDe(SITUACOES_BASE);

  /* emProgresso = true mostra os protótipos (em-progresso.js) no
     lugar dos chamados. O progresso deles fica numa chave "prof:",
     como os do professor: não soma estrelas nem conta como
     concluído. */
  let emProgresso = false;
  const chaveDe = s => (emProgresso ? 'prof:em-progresso:' + s.id : s.id);

  /* ---------------- mapa da cidade ----------------
     A central é o mapa da abertura (story1.webp). Cada lugar é a casa
     de um cliente; tocar nele abre os chamados daquele lugar (campo
     "area" da situação); um lugar pode juntar vários chamados. As
     posições são em % da imagem, em cima de cada construção. */
  /* x e y: a ponta do marcador, em % da imagem — logo acima ou ao
     lado da construção, para o marcador não cobrir o desenho */
  const LUGARES = [
    { id: 'casa',      nome: 'Casa',      rosto: 'img/who1.webp', x: 7,  y: 27 },
    { id: 'escola',    nome: 'Escola',    rosto: 'img/who3.webp', x: 70, y: 26 },
    { id: 'fabrica',   nome: 'Fábrica',   rosto: 'img/who2.webp', x: 28, y: 42 },
    { id: 'faixa',     nome: 'Faixa',     rosto: 'img/who5.webp', x: 39, y: 47 },
    { id: 'casa-azul', nome: 'Casa azul', rosto: 'img/who6.webp', x: 62, y: 37 },
    { id: 'limonada',  nome: 'Limonada',  rosto: 'img/who5.webp', x: 51, y: 76 },
    { id: 'jardim',    nome: 'Jardim',    rosto: 'img/who4.webp', x: 89, y: 44 },
  ];
  const doLugar = id => SITUACOES.filter(s => s.area === id);

  /* rosto de cliente: se o arquivo ainda não existe (a menina da
     Casa azul, por exemplo), mostra o Robô-guia no lugar */
  function rosto(img, src) {
    img.onerror = () => { img.onerror = null; img.src = 'img/guide.webp'; };
    img.src = src;
  }

  function desenharMapa() {
    // a imagem e os marcadores ficam num miolo: no celular ele é mais
    // largo que a tela e o mapa rola para os lados
    const quadro = $('#mapa');
    quadro.textContent = '';
    const mapa = document.createElement('div');
    mapa.className = 'mapa-miolo';
    quadro.append(mapa);
    for (const lugar of LUGARES) {
      const lista = doLugar(lugar.id);
      if (!lista.length) continue;
      const feitos = lista.filter(s => P.concluidos[s.id]).length;
      const botao = document.createElement('button');
      botao.type = 'button';
      botao.className = 'lugar' + (feitos === lista.length ? ' feito' : '');
      // a posição vai em variáveis: no celular o mapa é mais alto e
      // corta as laterais da imagem, e o CSS refaz a conta do "left"
      botao.style.setProperty('--x', lugar.x + '%');
      botao.style.setProperty('--y', lugar.y + '%');
      botao.setAttribute('aria-label',
        `${lugar.nome}: ${feitos} de ${lista.length} ${lista.length === 1 ? 'chamado concluído' : 'chamados concluídos'}`);
      botao.innerHTML = `<span class="lugar-rosto"><img alt=""></span>
        <span class="lugar-nome"></span><span class="lugar-conta"></span>`;
      rosto(botao.querySelector('img'), lugar.rosto);
      botao.querySelector('.lugar-nome').textContent = lugar.nome;
      botao.querySelector('.lugar-conta').textContent = `${feitos}/${lista.length}`;
      botao.onclick = () => abrirLugar(lugar);
      mapa.append(botao);
    }
    // começa centrado (no PC não rola, então não muda nada)
    requestAnimationFrame(() => {
      quadro.scrollLeft = (quadro.scrollWidth - quadro.clientWidth) / 2;
    });
  }

  function abrirLugar(lugar) {
    const modal = $('#local');
    modal.querySelector('.local-nome').textContent = lugar.nome;
    rosto(modal.querySelector('.local-rosto'), lugar.rosto);
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
    rosto(cartao.querySelector('.who img'), s.cliente || 'img/guide.webp');
    if (s.cena) cartao.querySelector('.pic img').src = s.cena;
    else {
      // protótipo ainda sem ilustração: o quadro tracejado do jogo
      const pic = cartao.querySelector('.pic');
      pic.textContent = 'ilustração do chamado';
      pic.classList.add('figura-vazia');
    }
    cartao.querySelector('b').textContent = s.titulo;

    const nivel = emAndamento ? prog.fase + 1 : feito ? s.fases.length : 1;
    // "Chamado 5 · Banheiro · Nível 1 de 4": cada parte no seu <span>,
    // para o celular mostrar o lugar e o nível em linhas separadas
    const partes = [[`${emProgresso ? 'Protótipo' : 'Chamado'} ${i + 1}`, 'call-num']];
    if (s.local) partes.push([s.local, 'call-local']);
    partes.push([`Nível ${nivel} de ${s.fases.length}`, 'call-nivel']);
    const linha = cartao.querySelector('small');
    partes.forEach(([texto, classe], k) => {
      if (k) {
        const ponto = document.createElement('span');
        ponto.className = 'call-sep';
        ponto.textContent = ' · ';
        linha.append(ponto);
      }
      const parte = document.createElement('span');
      parte.className = classe;
      parte.textContent = texto;
      linha.append(parte);
    });

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
    // o cartão inteiro abre o chamado; o botão fica só como sinal
    // visual do que vai acontecer (e não recebe foco separado)
    const abrir = () => {
      $('#local').classList.remove('on');
      if (feito && !emAndamento) abrirNiveis(s, chave); else iniciarSituacao(s, chave);
    };
    botao.tabIndex = -1;
    botao.setAttribute('aria-hidden', 'true');
    cartao.classList.add('call-clicavel');
    cartao.tabIndex = 0;
    cartao.setAttribute('role', 'button');
    cartao.setAttribute('aria-label', `${s.titulo}: ${botao.textContent.replace('›', '').trim()}`);
    cartao.onclick = abrir;
    cartao.onkeydown = ev => {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); abrir(); }
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
    // a barra conta os chamados da promoção; os novos têm a sua linha
    const n = concluidos(), total = SITUACOES_BASE.length;
    const novos = feitosDe(SITUACOES_NOVAS), totalNovos = SITUACOES_NOVAS.length;
    const faltam = total - n, faltamNovos = totalNovos - novos;
    $('#bRestart').hidden = n < total;
    $('#progTxt').textContent = `${n} de ${total}`;
    $('#progBar').style.width = (n / total) * 100 + '%';
    $('#progNovos').hidden = !totalNovos;
    $('#progNovos').textContent = `Chamados novos: ${novos} de ${totalNovos}`;
    $('#hubMsg').textContent = mensagem ||
      (n + novos === 0 ? 'Toque num lugar do mapa para ver os chamados de lá.'
        : faltam > 0 ? `Ótimo trabalho! ${faltam === 1 ? 'Falta 1 chamado' : `Faltam ${faltam} chamados`} para a sua promoção.`
        : faltamNovos > 0 ? `Você já é agente! Ainda ${faltamNovos === 1 ? 'tem 1 chamado novo' : `tem ${faltamNovos} chamados novos`} no mapa.`
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
    } else if (SITUACOES_BASE.includes(s) && concluidos() === SITUACOES_BASE.length && !P.promovido) {
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
    $('#promo').style.setProperty('--img', `url(img/promo${P.avatar}.webp)`);
    irPara('promo');
    Som.vitoria();
  }

  $('#bPromoNext').onclick = () => {
    $('#finName').textContent = P.nome;
    $('#finAg').src = `img/agente-${CORPO[+P.avatar]}.webp`;
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
  $('#bReiniciar').hidden = !P.comecou;
  $('#menu').classList.add('on');

})();
