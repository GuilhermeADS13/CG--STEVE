"use strict";

function bloco(cor, x, y, larg, alt) {
  ctx.fillStyle = cor;
  ctx.fillRect(x, y, larg, alt);
  ctx.strokeStyle = CONTORNO;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, larg, alt);
}

function desenhaCabeca() {
  const m = LARG_CORPO / 2;

  bloco(PELE, -m, Y_TOPO, LARG_CORPO, ALT_CABECA);

  ctx.fillStyle = CABELO;
  ctx.fillRect(-m, Y_TOPO, LARG_CORPO, 12);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(-14, Y_TOPO + 18, 10, 6);
  ctx.fillRect(4, Y_TOPO + 18, 10, 6);
  ctx.fillStyle = "#0055aa";
  ctx.fillRect(-10, Y_TOPO + 18, 6, 6);
  ctx.fillRect(4, Y_TOPO + 18, 6, 6);

  ctx.fillStyle = BOCA;
  ctx.fillRect(-6, Y_TOPO + 30, 12, 4);
}

function desenhaTronco() {
  bloco(CAMISA, -LARG_CORPO / 2, Y_OMBRO, LARG_CORPO, ALT_TRONCO);
}

function desenhaPerna() {
  const m = LARG_MEMBRO / 2;
  bloco(CALCA, -m, 0, LARG_MEMBRO, ALT_PERNA - 12);
  bloco(SAPATO, -m, ALT_PERNA - 12, LARG_MEMBRO, 12);
}

function desenhaBracoDireito() {
  const x = LARG_CORPO / 2;
  bloco(CAMISA, x, Y_OMBRO, LARG_MEMBRO, ALT_TRONCO / 2);
  bloco(PELE, x, Y_OMBRO + ALT_TRONCO / 2, LARG_MEMBRO, ALT_TRONCO / 2);
}

function desenhaBracoSuperior() {
  bloco(CAMISA, BRACO_X - LARG_MEMBRO / 2, Y_OMBRO, LARG_MEMBRO, ALT_TRONCO / 2);
}

function desenhaMao() {
  bloco(PELE, BRACO_X - LARG_MEMBRO / 2, COTOVELO.y, LARG_MEMBRO, ALT_TRONCO / 2);
}

function desenhaSteve() {
  ctx.save();

  // COMPOSIÇÃO: M = T . R . S
  const px = CENTRO.x * estado.escala;
  const py = CENTRO.y * estado.escala;

  ctx.translate(estado.x, estado.y);          // 3a op: translacao

  ctx.translate(px, py);                      // PONTO FIXO: volta
  ctx.rotate(rad(estado.graus));              // 2a op: rotacao
  ctx.translate(-px, -py);                    // PONTO FIXO: leva à origem

  ctx.scale(estado.escala, estado.escala);    // 1a op: escala

  // REFLEXÃO
  if (estado.espelhado) ctx.scale(-1, 1);

  matrizAtual = ctx.getTransform();

  ctx.save();
  ctx.translate(-LARG_MEMBRO / 2, Y_QUADRIL);
  desenhaPerna();
  ctx.restore();

  ctx.save();
  ctx.translate(LARG_MEMBRO / 2, Y_QUADRIL);
  desenhaPerna();
  ctx.restore();

  desenhaBracoDireito();

  const anguloBraco = rad(estado.anguloOmbro);

  // PONTO FIXO no ombro
  ctx.save();
  ctx.translate(OMBRO.x, OMBRO.y);            // 3a op: volta
  ctx.rotate(anguloBraco);                    // 2a op: gira
  ctx.translate(-OMBRO.x, -OMBRO.y);          // 1a op: leva à origem
  desenhaBracoSuperior();

  const anguloMao = rad(estado.anguloCotovelo);

  // HIERARQUIA: dentro do save do braço, a mão herda a rotação do ombro
  ctx.save();
  ctx.translate(COTOVELO.x, COTOVELO.y);      // 3a op: volta
  ctx.rotate(anguloMao);                      // 2a op: gira
  ctx.translate(-COTOVELO.x, -COTOVELO.y);    // 1a op: leva à origem
  desenhaMao();
  ctx.restore();

  ctx.restore();

  desenhaTronco();
  desenhaCabeca();

  ctx.restore();
}
