/* =====================================================================
   steve.js — o personagem e as guias didáticas.

   É aqui que moram as transformações principais:
     - composição   T · S · [T·R·T⁻¹]
     - ponto fixo   no centro do corpo, no ombro e no cotovelo
     - reflexão     S(-1, 1)
     - hierarquia   a mão desenhada dentro do save/restore do braço
   ===================================================================== */
"use strict";

// Desenha um recorte do sprite na posição local correspondente.
function parte(r, p) {
  ctx.drawImage(sprite, r.sx, r.sy, r.sw, r.sh, p.dx, p.dy, r.sw, r.sh);
}

function desenharSteve(t) {
  ctx.imageSmoothingEnabled = false; // preserva o visual pixelado

  ctx.save();

  // (1) TRANSLAÇÃO — leva a origem local do Steve até a posição na cena
  ctx.translate(estado.x, estado.y);

  // (3) ESCALA — depois dela, 1 unidade local = 1 pixel do sprite
  ctx.scale(estado.escala, estado.escala);

  // (BÔNUS) REFLEXÃO — escala com fator negativo em X espelha o Steve.
  // É o caso especial S(-1, 1) visto na teoria: o tchau troca de lado.
  if (estado.espelhado) ctx.scale(-1, 1);

  // (2)+(5) ROTAÇÃO DO CORPO COM PONTO FIXO no centro: T → R → T⁻¹
  ctx.translate(CENTRO.x, CENTRO.y);
  ctx.rotate(rad(estado.graus));
  ctx.translate(-CENTRO.x, -CENTRO.y);

  // (4) neste ponto a matriz já é a composição T · S · T(c) · R · T(−c)
  matrizAtual = ctx.getTransform();

  // braço parado, desenhado antes para ficar atrás
  parte(R_BRACO_D, P_BRACO_D);

  // (5) BRAÇO ACENANDO — rotação com ponto fixo no OMBRO: T → R → T⁻¹
  const alpha = rad(ACENO.anguloBase + ACENO.amplitude * Math.sin(t * ACENO.velocidade));
  ctx.save();
  ctx.translate(OMBRO.x, OMBRO.y);    // T    leva o ombro até a origem
  ctx.rotate(alpha);                  // R    gira em torno dele
  ctx.translate(-OMBRO.x, -OMBRO.y);  // T⁻¹  devolve o ombro ao lugar
  parte(R_BRACO_SUP, P_BRACO_SUP);

  // (BÔNUS) HIERARQUIA — a mão é desenhada DENTRO do save do braço, então
  // herda a rotação do ombro e ainda gira por conta própria no cotovelo.
  const beta = rad(ACENO.mao * Math.sin(t * ACENO.velocidade + ACENO.atrasoMao));
  ctx.save();
  ctx.translate(COTOVELO.x, COTOVELO.y);
  ctx.rotate(beta);
  ctx.translate(-COTOVELO.x, -COTOVELO.y);
  parte(R_BRACO_INF, P_BRACO_INF);
  ctx.restore();

  if (estado.guias) marcarPivo(COTOVELO, "#ff9f1c", "cotovelo");
  ctx.restore();

  // corpo por cima, escondendo a emenda do ombro
  parte(R_CORPO, P_CORPO);

  if (estado.guias) {
    desenharEixos();
    marcarPivo(CENTRO, "#ffd400", "centro do corpo");
    marcarPivo(OMBRO, "#ff4d4d", "ombro");
  }

  ctx.restore();
}

// Eixos locais do Steve: X em vermelho, Y em verde.
function desenharEixos() {
  ctx.save();
  ctx.lineWidth = 3 / estado.escala; // compensa a escala p/ a linha não engrossar
  ctx.strokeStyle = "#e63946";
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(180, 0); ctx.stroke();
  ctx.strokeStyle = "#2a9d8f";
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -180); ctx.stroke();
  ctx.restore();
}

/* Converte o ponto local para coordenadas de tela aplicando a matriz
   corrente na mão, e depois desenha o marcador com a matriz identidade.
   Assim o círculo e o rótulo não herdam a escala nem a rotação. */
function marcarPivo(p, cor, rotulo) {
  const m = ctx.getTransform();
  const tx = m.a * p.x + m.c * p.y + m.e;
  const ty = m.b * p.x + m.d * p.y + m.f;

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.beginPath();
  ctx.arc(tx, ty, 5, 0, Math.PI * 2);
  ctx.fillStyle = cor;
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "#11141a";
  ctx.stroke();

  ctx.font = "12px Consolas, monospace";
  ctx.fillStyle = "#11141a";
  ctx.fillText(rotulo, tx + 9, ty - 7);
  ctx.fillStyle = cor;
  ctx.fillText(rotulo, tx + 8, ty - 8);

  ctx.restore();
}

function avisoSprite() {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "#11141a";
  ctx.font = "16px Consolas, monospace";
  ctx.textAlign = "center";
  ctx.fillText("steve-png.png não carregou — confira se está na mesma pasta.", LARG / 2, 300);
  ctx.restore();
}
