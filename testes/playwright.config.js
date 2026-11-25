/* ============================================================
   testes/playwright.config.js — testes das telas do jogo

   Rodar:  npm install  e depois  npm test
   (ou só as telas:  npx playwright test -c testes)

   O jogo é servido por um servidor simples (python3 -m http.server)
   e testado no Chromium em dois tamanhos: PC (1366×768) e celular
   em pé (390×844).
   ============================================================ */

'use strict';

const { defineConfig } = require('@playwright/test');

const PORTA = 4173;

module.exports = defineConfig({
  testDir: '.',
  testMatch: '*.spec.js',
  outputDir: 'resultados',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['github'], ['list'], ['html', { outputFolder: 'relatorio', open: 'never' }]]
    : [['list']],
  use: {
    baseURL: `http://127.0.0.1:${PORTA}/`,
    // o sw.js guardaria arquivos entre os testes: fica desligado
    serviceWorkers: 'block',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    locale: 'pt-BR',
  },
  projects: [
    { name: 'pc', use: { browserName: 'chromium', viewport: { width: 1366, height: 768 } } },
    {
      name: 'celular',
      use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 },
    },
  ],
  webServer: {
    command: `python3 -m http.server ${PORTA} --bind 127.0.0.1`,
    cwd: '..',
    url: `http://127.0.0.1:${PORTA}/index.html`,
    reuseExistingServer: !process.env.CI,
  },
});
