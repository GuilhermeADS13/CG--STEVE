"use strict";

function desenhaCabeca() {
  const m = LARG_CORPO / 2;

  ctx.fillStyle = PELE;
  ctx.fillRect(-m, Y_TOPO, LARG_CORPO, ALT_CABECA);

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
  ctx.fillStyle = CAMISA;
  ctx.fillRect(-LARG_CORPO / 2, Y_OMBRO, LARG_CORPO, ALT_TRONCO);
}

function desenhaPerna() {
  const m = LARG_MEMBRO / 2;
  ctx.fillStyle = CALCA;
  ctx.fillRect(-m, 0, LARG_MEMBRO, ALT_PERNA - 12);
  ctx.fillStyle = SAPATO;
  ctx.fillRect(-m, ALT_PERNA - 12, LARG_MEMBRO, 12);
}

function desenhaBracoDireito() {
  const x = LARG_CORPO / 2;
  ctx.fillStyle = CAMISA;
  ctx.fillRect(x, Y_OMBRO, LARG_MEMBRO, ALT_TRONCO / 2);
  ctx.fillStyle = PELE;
  ctx.fillRect(x, Y_OMBRO + ALT_TRONCO / 2, LARG_MEMBRO, ALT_TRONCO / 2);
}

function desenhaBracoSuperior() {
  ctx.fillStyle = CAMISA;
  ctx.fillRect(OMBRO.x - LARG_MEMBRO / 2, Y_OMBRO, LARG_MEMBRO, ALT_TRONCO / 2);
}

function desenhaMao() {
  ctx.fillStyle = PELE;
  ctx.fillRect(COTOVELO.x - LARG_MEMBRO / 2, COTOVELO.y, LARG_MEMBRO, ALT_TRONCO / 2);
}

// Chamada quando o pivô já está na origem, por isso desenha em (0,0).
// O raio é dividido pela escala para o ponto não crescer junto com o Steve.
function marcaPivo(cor) {
  ctx.beginPath();
  ctx.arc(0, 0, 4 / estado.escala, 0, Math.PI * 2);
  ctx.fillStyle = cor;
  ctx.fill();
}

function desenhaEixos() {
  ctx.lineWidth = 2 / estado.escala;
  ctx.strokeStyle = "#e63946";
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(60, 0); ctx.stroke();
  ctx.strokeStyle = "#2a9d8f";
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -60); ctx.stroke();
}

/* O Canvas aplica as transformações DE BAIXO PARA CIMA: a última linha
   escrita é a primeira que acontece com o desenho. */
function desenhaSteve() {
  ctx.save();

  // COMPOSIÇÃO: translação + escala + rotação na mesma matriz
  ctx.translate(estado.x, estado.y);
  ctx.scale(estado.escala, estado.escala);

  // REFLEXÃO: escala com fator negativo, o caso especial S(-1, 1)
  if (estado.espelhado) ctx.scale(-1, 1);

  // PONTO FIXO no centro do corpo: T -> R -> T
  ctx.translate(CENTRO.x, CENTRO.y);          // 3a op: volta
  ctx.rotate(rad(estado.graus));              // 2a op: gira
  ctx.translate(-CENTRO.x, -CENTRO.y);        // 1a op: leva o centro à origem

  matrizAtual = ctx.getTransform();

  // a MESMA função desenhada em dois lugares, só com translate
  ctx.save();
  ctx.translate(-LARG_MEMBRO / 2, Y_QUADRIL);
  desenhaPerna();
  ctx.restore();

  ctx.save();
  ctx.translate(LARG_MEMBRO / 2, Y_QUADRIL);
  desenhaPerna();
  ctx.restore();

  desenhaBracoDireito();

  const anguloBraco = rad(
    ACENO.anguloBase + ACENO.amplitude * Math.sin(tempo * ACENO.velocidade)
  );

  // PONTO FIXO no ombro
  ctx.save();
  ctx.translate(OMBRO.x, OMBRO.y);            // 3a op: volta
  if (estado.guias) marcaPivo("#ff4d4d");
  ctx.rotate(anguloBraco);                    // 2a op: gira
  ctx.translate(-OMBRO.x, -OMBRO.y);          // 1a op: leva o ombro à origem
  desenhaBracoSuperior();

  const anguloMao = rad(
    ACENO.mao * Math.sin(tempo * ACENO.velocidade + ACENO.atrasoMao)
  );

  // HIERARQUIA: a mão é desenhada DENTRO do save do braço, então herda a
  // rotação do ombro e ainda gira sozinha no cotovelo.
  ctx.save();
  ctx.translate(COTOVELO.x, COTOVELO.y);      // 3a op: volta
  if (estado.guias) marcaPivo("#ff9f1c");
  ctx.rotate(anguloMao);                      // 2a op: gira
  ctx.translate(-COTOVELO.x, -COTOVELO.y);    // 1a op: leva o cotovelo à origem
  desenhaMao();
  ctx.restore();

  ctx.restore();

  // por cima, escondendo a emenda do ombro
  desenhaTronco();
  desenhaCabeca();

  if (estado.guias) {
    desenhaEixos();
    ctx.save();
    ctx.translate(CENTRO.x, CENTRO.y);
    marcaPivo("#ffd400");
    ctx.restore();
  }

  ctx.restore();
}
