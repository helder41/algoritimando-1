#!/usr/bin/env node
/* ============================================================
   testes/motor.js — roda os 9 testes do motor (js/motor.js) e
   devolve erro se algum falhar, para o GitHub Actions marcar o PR.

   O js/motor.js só escreve o resultado na tela; aqui a última linha
   ("=== Resultado: X passou(aram), Y falhou(aram) ===") é conferida.
   ============================================================ */

'use strict';

const { execFileSync } = require('child_process');
const path = require('path');

const saida = execFileSync(process.execPath, [path.join(__dirname, '..', 'js', 'motor.js')], { encoding: 'utf8' });
process.stdout.write(saida);

const m = saida.match(/Resultado: (\d+) passou\(aram\), (\d+) falhou\(aram\)/);
if (!m) {
  console.error('\nNão achei a linha de resultado do motor.');
  process.exit(1);
}
const [passou, falhou] = [Number(m[1]), Number(m[2])];
if (falhou > 0 || passou === 0) {
  console.error(`\nO motor tem ${falhou} teste(s) falhando.`);
  process.exit(1);
}
