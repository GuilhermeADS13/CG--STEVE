"use strict";

function desenha() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, LARG, ALT_CV);

  desenhaSteve();
  atualizarMatriz();
}

// TODO: a animação entra aqui, com requestAnimationFrame

atualiza();
