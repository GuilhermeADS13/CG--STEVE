"use strict";

function animar() {
  // RESET obrigatório
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, LARG, ALT_CV);

  desenhaSteve();
  atualizarMatriz();

  tempo += 0.016;
  requestAnimationFrame(animar);
}

animar();
