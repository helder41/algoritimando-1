/* ============================================================
   editor.js — Área do professor.

   Gera e lê o MESMO formato de chamado que já vem no jogo (ver
   motor.js e situacoes.js): um formato só, nunca dois. Salva e abre
   arquivos .json na máquina do professor — sem servidor, sem nuvem.
   No jogo, o menu "Área do professor" abre esse arquivo para jogar.

   O professor nunca vê a palavra "grafo". Ele:
     - escreve os passos NA ORDEM CERTA, de cima para baixo;
     - marca "pode vir antes ou depois do anterior" quando a ordem
       entre dois passos tanto faz (vira ordemLivre nos dados);
     - escreve o que o Robô-guia diz à criança que coloca o passo
       cedo demais (vira explicacao nos dados).
   O motor deriva as dependências disso, no editor e no jogo.

   A PRÉVIA é o jogo de verdade: o editor.html traz as telas de fase
   e de lição do index.html, e quem joga é o jogo.js, com o arrasto.js
   e o motor.js. O progresso e as dicas da prévia ficam em chaves
   próprias (ALGORITIMANDO_PREVIA), longe do jogo da criança.
   ============================================================ */

'use strict';

(function () {

  /* ---------------------- constantes ---------------------- */

  const CHAVE_RASCUNHO = 'algoritimando-editor-rascunho';
  const CHAVE_PREVIA = 'prof:previa';

  // foto de celular chega com 4000px e 3–5MB; no jogo a carta tem
  // ~200px. Cada imagem é reduzida a esta largura ANTES de entrar
  // nos dados — só o resultado é guardado, o original é descartado
  const LARGURA_MAX_IMAGEM = 400;

  // acima disso o arquivo fica pesado para abrir e compartilhar
  const LIMITE_TAMANHO = 4 * 1024 * 1024;

  /* ---------------------- elementos ---------------------- */

  const $ = s => document.querySelector(s);

  const campoTitulo        = $('#campo-titulo');
  const campoCenario       = $('#campo-cenario');
  const listaFases         = $('#lista-fases');
  const semFase            = $('#sem-fase');
  const faseConteudo       = $('#fase-conteudo');
  const faseCabecalho      = $('#fase-cabecalho');
  const campoFaseTitulo    = $('#campo-fase-titulo');
  const campoFaseInstrucao = $('#campo-fase-instrucao');
  const campoFaseMascote   = $('#campo-fase-mascote');
  const listaPassos        = $('#lista-passos');
  const campoPergunta      = $('#campo-licao-pergunta');
  const campoTextoLicao    = $('#campo-licao-texto');
  const campoReflexao1     = $('#campo-licao-reflexao1');
  const campoReflexao2     = $('#campo-licao-reflexao2');
  const caixaAvisos        = $('#avisos');
  const btnAbrir           = $('#btn-abrir');
  const btnNovo            = $('#btn-novo');
  const btnSalvar          = $('#btn-salvar');
  const btnNovaFase        = $('#btn-nova-fase');
  const btnNovoPasso       = $('#btn-novo-passo');
  const btnTestar          = $('#btn-testar');
  const inputImagem        = $('#input-imagem');
  const inputAbrir         = $('#input-abrir');
  const indicadorTamanho   = $('#indicador-tamanho');

  /* ---------------------- estado ---------------------- */

  let situacao = null;              // o que está sendo editado
  let indiceFase = 0;               // nível aberto no painel
  let passoAguardandoImagem = null; // passo que pediu imagem
  let salvarConfirmado = false;     // já viu os avisos e insistiu?
  let avisouRascunho = false;       // aviso de rascunho cheio, uma vez só

  function faseAtual() {
    return situacao.fases[indiceFase] || null;
  }

  /* ============================================================
     CENÁRIOS — os fundos dos quatro chamados do jogo
     ============================================================ */

  const CENARIOS = SITUACOES.map(s => ({
    id: s.id, nome: `${s.local} (${s.titulo})`,
    fundo: s.fundo, fundoConclusao: s.fundoConclusao, cor: s.cor,
  }));

  campoCenario.append(new Option('Nenhum (fundo liso)', ''));
  CENARIOS.forEach(c => campoCenario.append(new Option(c.nome, c.id)));

  // arquivo aberto: descobre o cenário pelo fundo que ele traz
  function cenarioDoFundo(fundo) {
    const c = CENARIOS.find(x => x.fundo === fundo);
    return c ? c.id : '';
  }

  /* ============================================================
     MODELO
     ============================================================ */

  function novaSituacao() {
    return { id: '', titulo: '', cenario: '', fases: [novaFase()] };
  }

  function novaFase() {
    return {
      titulo: '', instrucao: '', mascote: '',
      passos: [novoPasso(), novoPasso(), novoPasso()],
      licao: { pergunta: '', texto: '', reflexao: ['', ''] },
    };
  }

  function novoPasso() {
    // id provisório único; vira um id legível na hora de exportar
    return {
      id: 'p-' + Math.random().toString(36).slice(2, 8),
      texto: '', imagem: '', ordemLivre: false, explicacao: '',
    };
  }

  /* qualquer coisa vinda de fora (arquivo aberto, rascunho antigo)
     passa por aqui e sai no formato interno do editor */
  function normalizarSituacao(obj) {
    const fases = Array.isArray(obj.fases) ? obj.fases : [];
    return {
      id: typeof obj.id === 'string' ? obj.id : '',
      titulo: typeof obj.titulo === 'string' ? obj.titulo : '',
      cenario: typeof obj.cenario === 'string' ? obj.cenario : cenarioDoFundo(obj.fundo),
      // entradas que não são objetos (arquivo mexido à mão) são puladas
      fases: fases.filter(f => f && typeof f === 'object').map(normalizarFase),
    };
  }

  function normalizarFase(f) {
    const licao = f.licao || {};
    const reflexao = Array.isArray(licao.reflexao) ? licao.reflexao : [];
    return {
      titulo: typeof f.titulo === 'string' ? f.titulo : '',
      instrucao: typeof f.instrucao === 'string' ? f.instrucao : '',
      mascote: typeof f.mascote === 'string' ? f.mascote : '',
      passos: (Array.isArray(f.passos) ? f.passos : [])
        .filter(p => p && typeof p === 'object').map(p => ({
          id: (typeof p.id === 'string' && p.id) ? p.id : novoPasso().id,
          texto: typeof p.texto === 'string' ? p.texto : '',
          // só imagens embutidas (data:) viajam com o arquivo; um
          // caminho de outro computador não abriria aqui
          imagem: typeof p.imagem === 'string' ? p.imagem : '',
          ordemLivre: !!p.ordemLivre,
          // string OU objeto {idPreRequisito: texto} — o objeto é
          // preservado até o professor mexer no campo
          explicacao: p.explicacao || '',
        })),
      licao: {
        pergunta: typeof licao.pergunta === 'string' ? licao.pergunta : '',
        // no editor o texto vive numa caixa só: cada linha = um parágrafo
        texto: Array.isArray(licao.texto) ? licao.texto.join('\n')
             : (typeof licao.texto === 'string' ? licao.texto : ''),
        reflexao: [reflexao[0] || '', reflexao[1] || ''],
      },
    };
  }

  /* ---------------- rascunho automático ---------------- */

  function guardarRascunho() {
    try { localStorage.setItem(CHAVE_RASCUNHO, JSON.stringify(situacao)); }
    catch {
      if (!avisouRascunho) {
        avisouRascunho = true;
        mostrarAvisos([], ['O rascunho automático não coube na memória do navegador ' +
          '(as imagens ocupam espaço). Nada sumiu da tela, mas salve o arquivo ' +
          '.json para não perder o trabalho.']);
      }
    }
  }

  function lerRascunho() {
    try {
      const bruto = localStorage.getItem(CHAVE_RASCUNHO);
      return bruto ? normalizarSituacao(JSON.parse(bruto)) : null;
    } catch { return null; }
  }

  // toda mudança passa por aqui: guarda o rascunho e desarma o
  // "Salvar mesmo assim" (os avisos podem ter mudado)
  function mudou() {
    salvarConfirmado = false;
    btnSalvar.textContent = 'Salvar arquivo';
    guardarRascunho();
    atualizarTamanho();
  }

  /* ---------------- tamanho do arquivo ----------------
     O professor vê o quanto o arquivo pesa enquanto monta — as
     imagens dominam a conta. */

  function formatarTamanho(bytes) {
    if (bytes < 1024 * 1024) {
      return Math.max(1, Math.round(bytes / 1024)) + ' KB';
    }
    return (bytes / (1024 * 1024)).toLocaleString('pt-BR',
      { maximumFractionDigits: 1 }) + ' MB';
  }

  let temporizadorTamanho = 0;
  function atualizarTamanho() {
    // pequena espera para não medir megabytes a cada tecla digitada
    clearTimeout(temporizadorTamanho);
    temporizadorTamanho = setTimeout(() => {
      const bytes = new Blob([JSON.stringify(situacao)]).size;
      const pesado = bytes > LIMITE_TAMANHO;
      indicadorTamanho.classList.toggle('alerta', pesado);
      indicadorTamanho.textContent = pesado
        ? `Tamanho do arquivo: ${formatarTamanho(bytes)}, passou de 4 MB. ` +
          'Assim ele fica lento para abrir e compartilhar; menos fotos ajuda.'
        : `Tamanho do arquivo: ${formatarTamanho(bytes)}`;
    }, 300);
  }

  /* ============================================================
     EXPORTAÇÃO — do modelo do editor para o formato do jogo
     ============================================================ */

  function slug(texto) {
    return (texto || '')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /* troca os ids provisórios (p-xxxxxx) por ids legíveis tirados
     da legenda; ids que vieram de arquivo aberto não mudam, para
     não quebrar explicações que apontam para eles */
  function estabilizarIds(fase) {
    const usados = new Set(fase.passos.filter(p => !/^p-/.test(p.id)).map(p => p.id));
    for (const p of fase.passos) {
      if (!/^p-/.test(p.id)) continue;
      const base = slug(p.texto).slice(0, 30) || p.id;
      let id = base, n = 2;
      while (usados.has(id)) id = `${base}-${n++}`;
      usados.add(id);
      p.id = id;
    }
  }

  function exportarSituacao() {
    const fora = {
      formato: 'passo-a-passo/1',
      id: slug(situacao.titulo) || 'meu-chamado',
      titulo: situacao.titulo.trim(),
    };
    const cenario = CENARIOS.find(c => c.id === situacao.cenario);
    if (cenario) {
      fora.cor = cenario.cor;
      fora.fundo = cenario.fundo;
      fora.fundoConclusao = cenario.fundoConclusao;
    }
    fora.fases = situacao.fases.map(exportarFase);
    return fora;
  }

  function exportarFase(fase, i) {
    estabilizarIds(fase);

    const fora = { id: `fase-${i + 1}`, titulo: fase.titulo.trim() };
    if (fase.instrucao.trim()) fora.instrucao = fase.instrucao.trim();
    if (fase.mascote.trim()) fora.mascote = fase.mascote.trim();

    fora.passos = fase.passos.map((p, j) => {
      const passo = { id: p.id, texto: p.texto.trim() };
      if (p.imagem) passo.imagem = p.imagem;
      // o primeiro passo não tem "anterior": a marcação não vale nele
      if (p.ordemLivre && j > 0) passo.ordemLivre = true;
      if (typeof p.explicacao === 'string') {
        if (p.explicacao.trim()) passo.explicacao = p.explicacao.trim();
      } else if (p.explicacao) {
        passo.explicacao = p.explicacao;   // objeto vindo de arquivo
      }
      return passo;
    });

    const licao = exportarLicao(fase.licao);
    if (licao) fora.licao = licao;
    return fora;
  }

  function exportarLicao(licao) {
    const fora = {};
    if (licao.pergunta.trim()) fora.pergunta = licao.pergunta.trim();
    const linhas = licao.texto.split('\n').map(l => l.trim()).filter(Boolean);
    if (linhas.length === 1) fora.texto = linhas[0];
    else if (linhas.length > 1) fora.texto = linhas;
    const reflexao = licao.reflexao.map(r => r.trim()).filter(Boolean);
    if (reflexao.length) fora.reflexao = reflexao;
    return Object.keys(fora).length ? fora : null;
  }

  /* ============================================================
     VALIDAÇÃO ANTES DE SALVAR
     Só uma coisa BLOQUEIA de verdade: material injogável (nenhum
     nível, ou nível sem passo nenhum). O resto avisa — quem decide
     é o professor, com um segundo clique.
     ============================================================ */

  function validarSituacao(obj) {
    const erros = [], avisos = [];

    if (!obj.fases.length) {
      erros.push('O chamado não tem nenhum nível. Crie pelo menos um antes de salvar.');
    }
    if (!obj.titulo) {
      avisos.push('O chamado está sem nome: dê um nome para ele aparecer direito para a turma.');
    }

    obj.fases.forEach((fase, i) => {
      const nomeFase = `Nível ${i + 1}` + (fase.titulo ? ` ("${fase.titulo}")` : '');

      if (!fase.passos.length) {
        erros.push(`O ${nomeFase} está sem nenhum passo: adicione os passos ou apague o nível.`);
        return;
      }
      if (fase.passos.length < 3) {
        avisos.push(`O ${nomeFase} tem só ${fase.passos.length} passo(s): com menos de 3, a atividade fica fácil demais.`);
      }
      if (fase.passos.length > 8) {
        avisos.push(`O ${nomeFase} tem ${fase.passos.length} passos: com mais de 8, o tabuleiro não cabe bem na tela do celular.`);
      }
      if (!fase.titulo) avisos.push(`O ${nomeFase} está sem título.`);

      const dependencias = derivarDependencias(fase.passos);

      fase.passos.forEach((p, j) => {
        const nomePasso = `o passo ${j + 1}` + (p.texto ? ` ("${p.texto}")` : '');
        if (!p.imagem) {
          avisos.push(`${nomeFase}: ${nomePasso} está sem imagem, e a carta vai mostrar ` +
            'o quadro "ilustração do passo".');
        }
        if (!p.texto) avisos.push(`${nomeFase}: ${nomePasso} está sem legenda.`);

        const temPre = (dependencias[p.id] || []).length > 0;
        const temExplicacao = typeof p.explicacao === 'string'
          ? p.explicacao.trim() !== '' : !!p.explicacao;
        if (temPre && !temExplicacao) {
          avisos.push(`${nomeFase}: ${nomePasso} está sem a fala do Robô-guia. Se a criança ` +
            'o colocar cedo demais, vai ver só uma frase automática do jogo, não a sua explicação.');
        }
      });

      if (!fase.licao) {
        avisos.push(`O ${nomeFase} está sem os textos da tela de lição: a criança vai ` +
          'terminar o nível sem a conversa sobre o que aprendeu.');
      }
    });

    return { erros, avisos };
  }

  function mostrarAvisos(erros, avisos, mensagemOk) {
    caixaAvisos.textContent = '';
    const criar = (classe, prefixo, texto) => {
      const div = document.createElement('div');
      div.className = 'ed-aviso ' + classe;
      const forte = document.createElement('strong');
      forte.textContent = prefixo + ' ';
      div.append(forte, texto);
      caixaAvisos.append(div);
    };
    erros.forEach(t => criar('ed-aviso-erro', 'Falta:', t));
    avisos.forEach(t => criar('ed-aviso-atencao', 'Atenção:', t));
    if (!erros.length && mensagemOk) criar('ed-aviso-ok', 'Pronto!', mensagemOk);

    caixaAvisos.hidden = caixaAvisos.children.length === 0;
    if (!caixaAvisos.hidden) {
      caixaAvisos.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function limparAvisos() {
    caixaAvisos.textContent = '';
    caixaAvisos.hidden = true;
  }

  /* ============================================================
     LISTA DE NÍVEIS (coluna da esquerda)
     ============================================================ */

  function renderizarFases() {
    listaFases.textContent = '';
    situacao.fases.forEach((fase, i) => {
      const li = document.createElement('li');
      li.className = 'ed-fase-item' + (i === indiceFase ? ' atual' : '');

      const abrir = document.createElement('button');
      abrir.type = 'button';
      abrir.className = 'ed-fase-abrir';
      abrir.addEventListener('click', () => {
        indiceFase = i;
        renderizarFases();
        renderizarFase();
      });

      const forte = document.createElement('strong');
      forte.textContent = `Nível ${i + 1}`;
      const nome = document.createElement('span');
      nome.className = 'ed-fase-nome';
      nome.textContent = fase.titulo || '(sem título)';
      const qtd = document.createElement('span');
      qtd.className = 'ed-fase-qtd';
      qtd.textContent = `${fase.passos.length} passo(s)`;
      abrir.append(forte, nome, qtd);

      const botoes = document.createElement('div');
      botoes.className = 'ed-fase-botoes';
      botoes.append(
        botaoMini('↑', `Mover o nível ${i + 1} para cima`, i === 0,
          () => moverFase(i, -1)),
        botaoMini('↓', `Mover o nível ${i + 1} para baixo`, i === situacao.fases.length - 1,
          () => moverFase(i, +1)),
        botaoMini('✕', `Apagar o nível ${i + 1}`, false,
          () => apagarFase(i), 'ed-apagar'),
      );

      li.append(abrir, botoes);
      listaFases.append(li);
    });
  }

  function botaoMini(texto, rotulo, desligado, acao, classeExtra) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ed-botao-mini' + (classeExtra ? ' ' + classeExtra : '');
    b.textContent = texto;
    b.setAttribute('aria-label', rotulo);
    b.title = rotulo;
    b.disabled = desligado;
    b.addEventListener('click', acao);
    return b;
  }

  function moverFase(i, delta) {
    const j = i + delta;
    if (j < 0 || j >= situacao.fases.length) return;
    const [f] = situacao.fases.splice(i, 1);
    situacao.fases.splice(j, 0, f);
    if (indiceFase === i) indiceFase = j;
    else if (indiceFase === j) indiceFase = i;
    renderizarFases();
    renderizarFase();
    mudou();
  }

  function apagarFase(i) {
    const fase = situacao.fases[i];
    const nome = fase.titulo ? `"${fase.titulo}"` : `o Nível ${i + 1}`;
    if (!confirm(`Apagar ${nome}? Os passos dele serão perdidos.`)) return;
    situacao.fases.splice(i, 1);
    indiceFase = Math.max(0, Math.min(indiceFase, situacao.fases.length - 1));
    renderizarFases();
    renderizarFase();
    mudou();
  }

  /* ============================================================
     NÍVEL ABERTO (painel da direita)
     ============================================================ */

  function renderizarFase() {
    const fase = faseAtual();
    semFase.hidden = !!fase;
    faseConteudo.hidden = !fase;
    if (!fase) return;

    faseCabecalho.textContent = `Nível ${indiceFase + 1}`;
    campoFaseTitulo.value = fase.titulo;
    campoFaseInstrucao.value = fase.instrucao;
    campoFaseMascote.value = fase.mascote;
    campoPergunta.value = fase.licao.pergunta;
    campoTextoLicao.value = fase.licao.texto;
    campoReflexao1.value = fase.licao.reflexao[0];
    campoReflexao2.value = fase.licao.reflexao[1];

    renderizarPassos();
  }

  /* ---------------- cartões de passo ---------------- */

  function renderizarPassos() {
    const fase = faseAtual();
    listaPassos.textContent = '';
    if (!fase) return;

    // o motor diz quem depende de quem — o professor só vê frases
    const dependencias = derivarDependencias(fase.passos);
    const porId = {};
    fase.passos.forEach(p => { porId[p.id] = p; });

    fase.passos.forEach((passo, i) => {
      listaPassos.append(cartaoDePasso(passo, i, dependencias, porId));
    });
  }

  function nomeDoPasso(p) {
    return p && p.texto.trim() ? `“${p.texto.trim()}”` : '(passo sem legenda)';
  }

  function cartaoDePasso(passo, indice, dependencias, porId) {
    const fase = faseAtual();
    const li = document.createElement('li');
    li.className = 'ed-passo';

    /* alça: número + mover/apagar */
    const alca = document.createElement('div');
    alca.className = 'ed-passo-alca';
    const num = document.createElement('span');
    num.className = 'ed-passo-num';
    num.textContent = indice + 1;
    const botoes = document.createElement('div');
    botoes.className = 'ed-passo-botoes';
    botoes.append(
      botaoMini('↑', `Mover o passo ${indice + 1} para cima`, indice === 0,
        () => moverPasso(indice, -1)),
      botaoMini('↓', `Mover o passo ${indice + 1} para baixo`, indice === fase.passos.length - 1,
        () => moverPasso(indice, +1)),
      botaoMini('✕', `Apagar o passo ${indice + 1}`, false,
        () => apagarPasso(indice), 'ed-apagar'),
    );
    alca.append(num, botoes);

    /* corpo: imagem + campos */
    const corpo = document.createElement('div');
    corpo.className = 'ed-passo-corpo';
    corpo.append(botaoDeImagem(passo, indice));

    const campos = document.createElement('div');
    campos.className = 'ed-passo-campos';

    // legenda
    const campoLegenda = document.createElement('label');
    campoLegenda.className = 'ed-campo';
    const rotuloLegenda = document.createElement('span');
    rotuloLegenda.className = 'ed-rotulo';
    rotuloLegenda.textContent = 'Legenda da carta';
    const inputLegenda = document.createElement('input');
    inputLegenda.type = 'text';
    inputLegenda.maxLength = 80;
    inputLegenda.placeholder = 'Ex.: Coloque a semente no algodão.';
    inputLegenda.value = passo.texto;
    inputLegenda.addEventListener('input', () => {
      passo.texto = inputLegenda.value;
      atualizarVemDepois();
      mudou();
    });
    campoLegenda.append(rotuloLegenda, inputLegenda);
    campos.append(campoLegenda);

    // caixa de marcação (o primeiro passo não tem "anterior")
    if (indice > 0) {
      const check = document.createElement('label');
      check.className = 'ed-check';
      const caixa = document.createElement('input');
      caixa.type = 'checkbox';
      caixa.checked = passo.ordemLivre;
      caixa.addEventListener('change', () => {
        passo.ordemLivre = caixa.checked;
        // a mudança rearruma quem espera quem: redesenha os cartões
        renderizarPassos();
        mudou();
      });
      const textos = document.createElement('span');
      textos.className = 'ed-check-textos';
      const frase = document.createElement('span');
      frase.textContent = 'Este passo pode vir antes ou depois do anterior';
      const ajuda = document.createElement('span');
      ajuda.className = 'ed-ajuda';
      ajuda.textContent = 'Marque quando a ordem entre os dois tanto faz. ' +
        'Ex.: "colocar o queijo" e "colocar o presunto": qualquer um pode vir primeiro.';
      textos.append(frase, ajuda);
      check.append(caixa, textos);
      campos.append(check);
    }

    // a regra derivada, em palavras — e o texto do Robô-guia no erro
    const meusPre = dependencias[passo.id] || [];
    if (meusPre.length) {
      const linha = document.createElement('p');
      linha.className = 'ed-vem-depois';
      linha.dataset.passo = passo.id;
      linha.textContent = fraseVemDepois(meusPre, porId);
      campos.append(linha);

      const campoExpl = document.createElement('label');
      campoExpl.className = 'ed-campo';
      const rotuloExpl = document.createElement('span');
      rotuloExpl.className = 'ed-rotulo';
      rotuloExpl.textContent = 'O que o Robô-guia diz se a criança colocar este passo cedo demais?';
      const areaExpl = document.createElement('textarea');
      areaExpl.rows = 2;
      areaExpl.placeholder = 'Ex.: Sem a semente no algodão, a água não tem o que molhar!';
      areaExpl.value = explicacaoComoTexto(passo.explicacao);
      areaExpl.addEventListener('input', () => {
        passo.explicacao = areaExpl.value;   // mexeu: vira texto único
        mudou();
      });
      const ajudaExpl = document.createElement('span');
      ajudaExpl.className = 'ed-ajuda';
      ajudaExpl.textContent = typeof passo.explicacao === 'object' && passo.explicacao
        ? 'Este passo veio de um arquivo com um texto para cada caso; se você editar aqui, vira um texto único.'
        : 'Conte a consequência do erro, não a regra. Sem esse texto, o jogo mostra uma frase automática.';
      campoExpl.append(rotuloExpl, areaExpl, ajudaExpl);
      campos.append(campoExpl);
    } else {
      const linha = document.createElement('p');
      linha.className = 'ed-vem-depois livre';
      linha.dataset.passo = passo.id;
      linha.textContent = 'Este passo pode ser um dos primeiros: não precisa esperar nenhum outro.';
      campos.append(linha);
    }

    corpo.append(campos);
    li.append(alca, corpo);
    return li;
  }

  function fraseVemDepois(idsPre, porId) {
    const nomes = idsPre.map(id => nomeDoPasso(porId[id]));
    return 'No jogo, este passo só pode entrar depois de: ' + nomes.join(' e ') + '.';
  }

  // legendas mudaram: refaz só as frases "vem depois de", sem
  // redesenhar os cartões (o professor está digitando neles)
  function atualizarVemDepois() {
    const fase = faseAtual();
    if (!fase) return;
    const dependencias = derivarDependencias(fase.passos);
    const porId = {};
    fase.passos.forEach(p => { porId[p.id] = p; });
    listaPassos.querySelectorAll('.ed-vem-depois[data-passo]').forEach(el => {
      const pre = dependencias[el.dataset.passo] || [];
      if (pre.length) el.textContent = fraseVemDepois(pre, porId);
    });
  }

  function explicacaoComoTexto(explicacao) {
    if (typeof explicacao === 'string') return explicacao;
    if (explicacao && typeof explicacao === 'object') {
      return explicacao['*'] || Object.values(explicacao)[0] || '';
    }
    return '';
  }

  function moverPasso(indice, delta) {
    const fase = faseAtual();
    const j = indice + delta;
    if (j < 0 || j >= fase.passos.length) return;
    const [p] = fase.passos.splice(indice, 1);
    fase.passos.splice(j, 0, p);
    renderizarPassos();
    mudou();
  }

  function apagarPasso(indice) {
    const fase = faseAtual();
    const passo = fase.passos[indice];
    const nome = passo.texto ? `"${passo.texto}"` : `o passo ${indice + 1}`;
    if (!confirm(`Apagar ${nome}?`)) return;
    fase.passos.splice(indice, 1);
    renderizarPassos();
    renderizarFases();   // a contagem de passos do nível mudou
    mudou();
  }

  /* ---------------- imagem do passo ----------------
     Um arquivo do computador (foto do material da própria turma,
     desenho feito pela classe…). Ela é reduzida e embutida no .json,
     para o arquivo funcionar em qualquer computador. Sem imagem, a
     carta mostra o quadro "ilustração do passo", como no jogo. */

  function botaoDeImagem(passo, indice) {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'ed-miniatura' + (passo.imagem ? '' : ' vazia');
    botao.setAttribute('aria-label',
      (passo.imagem ? 'Trocar' : 'Escolher') + ` a imagem do passo ${indice + 1}`);

    const figura = document.createElement('span');
    figura.className = 'ed-miniatura-figura';
    if (passo.imagem) figura.style.backgroundImage = `url("${passo.imagem}")`;
    else figura.textContent = 'ilustração do passo';

    const rotulo = document.createElement('span');
    rotulo.className = 'ed-miniatura-rotulo';
    rotulo.textContent = passo.imagem ? 'Trocar imagem' : 'Escolher imagem…';

    botao.append(figura, rotulo);
    botao.addEventListener('click', () => {
      passoAguardandoImagem = passo;
      inputImagem.click();
    });

    if (!passo.imagem) return botao;

    // com imagem, dá para tirá-la e voltar ao quadro vazio
    const bloco = document.createElement('div');
    bloco.className = 'ed-figura';
    const tirar = document.createElement('button');
    tirar.type = 'button';
    tirar.className = 'ed-tirar-imagem';
    tirar.textContent = 'Tirar imagem';
    tirar.addEventListener('click', () => {
      passo.imagem = '';
      renderizarPassos();
      mudou();
    });
    bloco.append(botao, tirar);
    return bloco;
  }

  inputImagem.addEventListener('change', () => {
    const arquivo = inputImagem.files[0];
    inputImagem.value = '';
    if (!arquivo || !passoAguardandoImagem) return;
    const passo = passoAguardandoImagem;
    passoAguardandoImagem = null;

    const leitor = new FileReader();
    leitor.onload = () => {
      const img = new Image();
      img.onload = () => {
        // encolhe até a largura máxima, mantendo a proporção
        const escala = Math.min(1, LARGURA_MAX_IMAGEM / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * escala));
        canvas.height = Math.max(1, Math.round(img.height * escala));
        const ctx = canvas.getContext('2d');
        // jpeg não tem transparência: sem este fundo, um png
        // transparente sairia com fundo preto
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // só o resultado reduzido é guardado; o original é descartado
        passo.imagem = canvas.toDataURL('image/jpeg', 0.8);
        renderizarPassos();
        mudou();
      };
      img.onerror = () => {
        mostrarAvisos([], ['Não deu para ler esse arquivo como imagem. Tente um .png ou .jpg.']);
      };
      img.src = leitor.result;
    };
    leitor.readAsDataURL(arquivo);
  });

  /* ============================================================
     CAMPOS FIXOS (ligados uma única vez; escrevem no nível atual)
     ============================================================ */

  function ligarCampo(el, gravar) {
    el.addEventListener('input', () => {
      gravar(el.value);
      mudou();
    });
  }

  ligarCampo(campoTitulo, v => { situacao.titulo = v; });
  campoCenario.addEventListener('change', () => {
    situacao.cenario = campoCenario.value;
    mudou();
  });
  ligarCampo(campoFaseTitulo, v => {
    const f = faseAtual(); if (!f) return;
    f.titulo = v;
    renderizarFases();          // o nome na lista acompanha
  });
  ligarCampo(campoFaseInstrucao, v => { const f = faseAtual(); if (f) f.instrucao = v; });
  ligarCampo(campoFaseMascote, v => { const f = faseAtual(); if (f) f.mascote = v; });
  ligarCampo(campoPergunta,  v => { const f = faseAtual(); if (f) f.licao.pergunta = v; });
  ligarCampo(campoTextoLicao, v => { const f = faseAtual(); if (f) f.licao.texto = v; });
  ligarCampo(campoReflexao1, v => { const f = faseAtual(); if (f) f.licao.reflexao[0] = v; });
  ligarCampo(campoReflexao2, v => { const f = faseAtual(); if (f) f.licao.reflexao[1] = v; });

  /* ============================================================
     AÇÕES DO CABEÇALHO
     ============================================================ */

  btnNovaFase.addEventListener('click', () => {
    situacao.fases.push(novaFase());
    indiceFase = situacao.fases.length - 1;
    renderizarFases();
    renderizarFase();
    mudou();
    campoFaseTitulo.focus();
  });

  btnNovoPasso.addEventListener('click', () => {
    const fase = faseAtual();
    if (!fase) return;
    fase.passos.push(novoPasso());
    renderizarPassos();
    renderizarFases();
    mudou();
    const ultimo = listaPassos.lastElementChild;
    if (ultimo) ultimo.querySelector('input[type="text"]').focus();
  });

  function carregar(nova) {
    situacao = nova;
    if (!situacao.fases.length) situacao.fases.push(novaFase());
    indiceFase = 0;
    campoTitulo.value = situacao.titulo;
    campoCenario.value = situacao.cenario;
    renderizarFases();
    renderizarFase();
  }

  btnNovo.addEventListener('click', () => {
    if (!confirm('Começar do zero? O que está na tela será apagado.')) return;
    carregar(novaSituacao());
    limparAvisos();
    mudou();
    campoTitulo.focus();
  });

  /* ---------------- salvar ---------------- */

  btnSalvar.addEventListener('click', () => {
    const obj = exportarSituacao();
    const { erros, avisos } = validarSituacao(obj);

    const json = JSON.stringify(obj, null, 2);
    const bytes = new Blob([json]).size;
    if (bytes > LIMITE_TAMANHO) {
      avisos.push(`O arquivo ficou com ${formatarTamanho(bytes)}: acima de 4 MB ` +
        'ele demora para abrir e para passar para outros professores. ' +
        'Usar menos fotos (ou fotos menores) resolve.');
    }

    if (erros.length) {
      mostrarAvisos(erros, avisos);
      return;
    }

    // com avisos, o primeiro clique mostra a lista; salvar de
    // verdade exige um segundo clique consciente
    if (avisos.length && !salvarConfirmado) {
      salvarConfirmado = true;
      btnSalvar.textContent = 'Salvar mesmo assim';
      mostrarAvisos([], avisos.concat(
        ['Revise os pontos acima, ou clique em "Salvar mesmo assim" para baixar do jeito que está.']));
      return;
    }

    baixarArquivo(`${obj.id}.json`, json);
    salvarConfirmado = false;
    btnSalvar.textContent = 'Salvar arquivo';
    mostrarAvisos([], avisos, `Arquivo "${obj.id}.json" (${formatarTamanho(bytes)}) baixado! ` +
      'Para jogar, abra o jogo e use "Área do professor" no menu.');
  });

  function baixarArquivo(nome, json) {
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = nome;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  /* ---------------- abrir ---------------- */

  btnAbrir.addEventListener('click', () => inputAbrir.click());

  inputAbrir.addEventListener('change', () => {
    const arquivo = inputAbrir.files[0];
    inputAbrir.value = '';
    if (!arquivo) return;

    const leitor = new FileReader();
    leitor.onerror = () => {
      mostrarAvisos(['Não deu para ler esse arquivo. Confira se ele ainda existe e tente de novo.'], []);
    };
    leitor.onload = () => {
      /* a conferência é a MESMA do jogo (comum.js), mas aqui a
         exigência é a mais frouxa: o editor existe justamente para
         completar um chamado pela metade */
      const conferencia = Comum.validarArquivoSituacao(leitor.result, false);
      if (!conferencia.ok) {
        mostrarAvisos([conferencia.mensagem], []);
        return;
      }
      let aberta;
      try { aberta = normalizarSituacao(conferencia.situacao); }
      catch {
        mostrarAvisos(['Este arquivo está incompleto ou fora do formato: não deu para abrir.'], []);
        return;
      }
      carregar(aberta);
      mudou();
      const resultado = validarSituacao(exportarSituacao());
      mostrarAvisos(resultado.erros, resultado.avisos, 'Chamado aberto!');
    };
    leitor.readAsText(arquivo);
  });

  /* ============================================================
     PRÉVIA — o nível exatamente como a criança verá.
     As telas são as do jogo, e quem joga é o jogo.js: aqui só se
     abre a camada da prévia e se entrega o chamado a ele.
     ============================================================ */

  const previa = $('.ed-previa');

  // o jogo.js chama irPara('fase' | 'licao'); na prévia só existem
  // essas duas telas
  window.irPara = id => {
    previa.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === id));
  };

  btnTestar.addEventListener('click', () => {
    const obj = exportarSituacao();
    const fase = obj.fases[indiceFase];
    if (!fase || !fase.passos.length) {
      mostrarAvisos(['Este nível ainda não tem nenhum passo para testar.'], []);
      return;
    }
    limparAvisos();
    obj.titulo = obj.titulo || 'Teste do chamado';

    // a prévia começa limpa, com todos os níveis liberados e dicas
    // para o professor experimentar
    Progresso.gravar(CHAVE_PREVIA, { fase: obj.fases.length, niveis: [] });
    Perfil.dados.dicas = 3;

    previa.hidden = false;
    document.body.classList.add('ed-testando');
    iniciarSituacao(obj, CHAVE_PREVIA, indiceFase);
  });

  function fecharPrevia() {
    if (previa.hidden) return;
    previa.hidden = true;
    document.body.classList.remove('ed-testando');
    document.querySelector('#niveis').classList.remove('on');
    previa.querySelectorAll('.screen').forEach(s => s.classList.remove('on'));
    Progresso.apagar(CHAVE_PREVIA);
    btnTestar.focus();
  }

  // o botão de casa das telas do jogo volta para o editor
  previa.querySelectorAll('[data-home]').forEach(b => {
    b.title = 'Voltar ao editor';
    b.setAttribute('aria-label', 'Voltar ao editor');
    b.addEventListener('click', fecharPrevia);
  });

  // terminou a lição de um nível: volta para o editor
  document.addEventListener('conclusao-continuar', fecharPrevia);

  // Esc sai da prévia (a não ser que haja carta selecionada: aí o
  // Esc do arrasto.js só cancela a seleção)
  document.addEventListener('keydown', ev => {
    if (ev.key !== 'Escape' || previa.hidden) return;
    if (document.querySelector('.carta-selecionada')) return;
    if (document.querySelector('#niveis.on')) return;
    fecharPrevia();
  }, true);

  /* ============================================================
     PARTIDA
     ============================================================ */

  carregar(lerRascunho() || novaSituacao());
  atualizarTamanho();

})();
