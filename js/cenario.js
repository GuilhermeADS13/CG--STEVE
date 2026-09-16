/* =====================================================================
   cenario.js — céu, sol, nuvens e chão.

   REQUISITO 1 (translação): a mesma forma é desenhada uma vez e
   reposicionada só com ctx.translate. O bloco de grama é um único
   fillRect(0, 0, B, B) repetido pela cena inteira.
   ===================================================================== */
"use strict";

function desenharCenario() {
  const ceu = ctx.createLinearGradient(0, 0, 0, CHAO_Y);
  ceu.addColorStop(0, "#5c94fc");
  ceu.addColorStop(1, "#b6d8ff");
  ctx.fillStyle = ceu;
  ctx.fillRect(0, 0, LARG, CHAO_Y);

  // sol
  ctx.save();
  ctx.translate(830, 92);
  ctx.fillStyle = "#ffe97f";
  ctx.fillRect(-30, -30, 60, 60);
  ctx.restore();

  // nuvens
  ctx.fillStyle = "rgba(255,255,255,.85)";
  const nuvens = [[140, 110], [420, 70], [645, 145]];
  for (let i = 0; i < nuvens.length; i++) {
    ctx.save();
    ctx.translate(nuvens[i][0], nuvens[i][1]);
    ctx.fillRect(0, 0, 90, 24);
    ctx.fillRect(22, -22, 52, 22);
    ctx.restore();
  }

  // chão de blocos
  const B = 48;
  for (let i = 0; i * B < LARG; i++) {
    for (let j = 0; CHAO_Y + j * B < ALT_CV; j++) {
      ctx.save();
      ctx.translate(i * B, CHAO_Y + j * B);
      ctx.fillStyle = j === 0 ? "#5fae3a" : "#8a5a2b";
      ctx.fillRect(0, 0, B, B);
      ctx.strokeStyle = "rgba(0,0,0,.13)";
      ctx.strokeRect(0.5, 0.5, B - 1, B - 1);
      ctx.restore();
    }
  }
}
