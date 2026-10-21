/* ============================================================
   som.js — os três retornos sonoros do jogo.

   Nada de arquivos de áudio: as notas são sintetizadas na hora
   pelo Web Audio, então o jogo continua sendo uma pasta que abre
   com dois cliques, sem download nenhum.

     acerto   duas notas subindo — a carta entrou no lugar
     erro     duas notas descendo, graves e curtas — sem susto,
              sem "buzina de errado": o erro aqui é parte de
              aprender, não uma punição
     vitoria  quatro notas subindo — a fase acabou
     clique   uma nota curta — troca de tela

   DESLIGAR É DE VERDADE. Sala de aula com trinta crianças, criança
   que se incomoda com som, professor explicando: o botão está no
   topo da tela, e a escolha fica guardada no navegador. Enquanto
   estiver desligado nenhum oscilador chega a ser criado.

   O contexto de áudio só nasce no primeiro som — ou seja, depois
   de a criança já ter tocado na tela. É o que os navegadores
   exigem, e evita o aviso de "AudioContext bloqueado" no console.
   ============================================================ */

'use strict';

(function () {

  const CHAVE = 'algoritimando-som';

  let ligado = lerPreferencia();
  let contexto = null;

  function lerPreferencia() {
    try { return localStorage.getItem(CHAVE) !== 'desligado'; }
    catch { return true; }          // sem localStorage, o som vem ligado
  }

  function gravarPreferencia() {
    try { localStorage.setItem(CHAVE, ligado ? 'ligado' : 'desligado'); }
    catch { /* segue sem lembrar na próxima visita */ }
  }

  /* ---------------- síntese ---------------- */

  /* notas: [[frequência em Hz, duração em segundos], ...] tocadas
     em sequência, cada uma desaparecendo suavemente (sem o "clique"
     que um corte seco produziria no alto-falante) */
  function tocar(notas, volume) {
    if (!ligado) return;
    try {
      const Contexto = window.AudioContext || window.webkitAudioContext;
      if (!Contexto) return;
      contexto = contexto || new Contexto();
      // alguns navegadores devolvem o contexto suspenso
      if (contexto.state === 'suspended') contexto.resume();

      let t = contexto.currentTime;
      for (const [frequencia, duracao] of notas) {
        const oscilador = contexto.createOscillator();
        const ganho = contexto.createGain();
        oscilador.type = 'sine';                  // onda macia, sem aspereza
        oscilador.frequency.value = frequencia;
        ganho.gain.setValueAtTime(volume, t);
        ganho.gain.exponentialRampToValueAtTime(0.0001, t + duracao);
        oscilador.connect(ganho).connect(contexto.destination);
        oscilador.start(t);
        oscilador.stop(t + duracao);
        t += duracao * 0.85;                      // as notas se encavalam de leve
      }
    } catch { /* sem áudio o jogo funciona igual */ }
  }

  const acerto  = () => tocar([[523, 0.10], [659, 0.16]], 0.10);
  const erro    = () => tocar([[233, 0.14], [196, 0.20]], 0.07);
  const clique  = () => tocar([[440, 0.07]], 0.06);
  const vitoria = () => tocar([[523, 0.13], [659, 0.13], [784, 0.13], [1047, 0.32]], 0.11);

  /* ---------------- botões de ligar/desligar ---------------- */

  /* Recebe um <button> e cuida dele por inteiro: rótulo, estado e
     clique. Pode haver mais de um (o do menu e o da fase): todos
     mudam juntos. Com comTexto, o botão também mostra o estado
     escrito ("Sons: ligado"). */
  const botoes = [];

  function atualizarBotoes() {
    for (const { botao, comTexto } of botoes) {
      botao.classList.toggle('mudo', !ligado);
      botao.setAttribute('aria-pressed', String(ligado));
      const rotulo = ligado ? 'Desligar o som' : 'Ligar o som';
      if (comTexto) {
        botao.textContent = 'Sons: ' + (ligado ? 'ligado' : 'desligado');
      } else {
        botao.setAttribute('aria-label', rotulo);
        botao.title = rotulo;
      }
    }
  }

  function ligarBotao(botao, comTexto = false) {
    if (!botao) return;
    botoes.push({ botao, comTexto });
    botao.addEventListener('click', () => {
      ligado = !ligado;
      gravarPreferencia();
      atualizarBotoes();
      if (ligado) acerto();        // confirma a escolha com o próprio som
    });
    atualizarBotoes();
  }

  window.Som = { acerto, erro, vitoria, clique, ligarBotao };

})();
