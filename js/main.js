/* =====================================================================
   main.js — loop de animação.

   O reset da matriz no começo de cada frame é obrigatório. Sem ele as
   transformações acumulam (o bug do exemplo 04 da aula: a escala vira
   1.01^n e o desenho foge da tela).
   ===================================================================== */
"use strict";

function animar() {
  // RESET obrigatório
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, LARG, ALT_CV);

  desenhaSteve();
  atualizarMatriz();

  tempo += 0.016;  // ~16 ms por frame
  requestAnimationFrame(animar);
}

animar();
