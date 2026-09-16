/* =====================================================================
   main.js — loop de animação.

   REQUISITO 6: a matriz é zerada com setTransform(1,0,0,1,0,0) no começo
   de todo frame. Sem isso as transformações acumulam (o bug do exemplo 04
   da aula: a escala vira 1.01^n).
   ===================================================================== */
"use strict";

const t0 = performance.now();

function quadro(agora) {
  const t = (agora - t0) / 1000; // segundos desde o início

  // RESET obrigatório
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, LARG, ALT_CV);

  if (spritePronto) {
    desenharSteve(t);
    atualizarMatriz();
  } else if (spriteFalhou) {
    avisoSprite();
  }

  requestAnimationFrame(quadro);
}

requestAnimationFrame(quadro);
