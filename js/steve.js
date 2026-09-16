/* =====================================================================
   steve.js — desenha o Steve e aplica as transformações.

   Cada parte é um fillRect na posição que ela ocupa no corpo. Depois as
   transformações movem, giram e escalam tudo isso.
   ===================================================================== */
"use strict";

/* ---------------------------------------------------------------------
   PARTE 1 — funções que só desenham, sem transformar nada
--------------------------------------------------------------------- */

function desenhaCabeca() {
  const m = LARG_CORPO / 2;  // 20

  ctx.fillStyle = PELE;
  ctx.fillRect(-m, Y_TOPO, LARG_CORPO, ALT_CABECA);

  ctx.fillStyle = CABELO;
  ctx.fillRect(-m, Y_TOPO, LARG_CORPO, 12);

  // olhos
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(-14, Y_TOPO + 18, 10, 6);
  ctx.fillRect(4, Y_TOPO + 18, 10, 6);
  ctx.fillStyle = "#0055aa";
  ctx.fillRect(-10, Y_TOPO + 18, 6, 6);
  ctx.fillRect(4, Y_TOPO + 18, 6, 6);

  // boca
  ctx.fillStyle = BOCA;
  ctx.fillRect(-6, Y_TOPO + 30, 12, 4);
}

function desenhaTronco() {
  ctx.fillStyle = CAMISA;
  ctx.fillRect(-LARG_CORPO / 2, Y_OMBRO, LARG_CORPO, ALT_TRONCO);
}

// Uma perna, desenhada a partir do quadril para baixo.
// Quem chama decide de que lado ela fica, usando translate.
function desenhaPerna() {
  const m = LARG_MEMBRO / 2;
  ctx.fillStyle = CALCA;
  ctx.fillRect(-m, 0, LARG_MEMBRO, ALT_PERNA - 12);
  ctx.fillStyle = SAPATO;
  ctx.fillRect(-m, ALT_PERNA - 12, LARG_MEMBRO, 12);
}

// Braço parado (o direito), inteiro.
function desenhaBracoDireito() {
  const x = LARG_CORPO / 2;
  ctx.fillStyle = CAMISA;
  ctx.fillRect(x, Y_OMBRO, LARG_MEMBRO, ALT_TRONCO / 2);
  ctx.fillStyle = PELE;
  ctx.fillRect(x, Y_OMBRO + ALT_TRONCO / 2, LARG_MEMBRO, ALT_TRONCO / 2);
}

// O braço que acena é dividido em dois pedaços, para a mão poder
// girar sozinha no cotovelo.
function desenhaBracoSuperior() {
  ctx.fillStyle = CAMISA;
  ctx.fillRect(OMBRO.x - LARG_MEMBRO / 2, Y_OMBRO, LARG_MEMBRO, ALT_TRONCO / 2);
}

function desenhaMao() {
  ctx.fillStyle = PELE;
  ctx.fillRect(COTOVELO.x - LARG_MEMBRO / 2, COTOVELO.y, LARG_MEMBRO, ALT_TRONCO / 2);
}

// Bolinha que marca o ponto fixo. Só funciona se for chamada quando o
// pivô já estiver na origem, logo depois do primeiro translate.
function marcaPivo(cor) {
  ctx.beginPath();
  ctx.arc(0, 0, 4 / estado.escala, 0, Math.PI * 2);  // divide pela escala
  ctx.fillStyle = cor;                               // para não crescer junto
  ctx.fill();
}

// Eixos locais do Steve: X vermelho, Y verde.
function desenhaEixos() {
  ctx.lineWidth = 2 / estado.escala;
  ctx.strokeStyle = "#e63946";
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(60, 0); ctx.stroke();
  ctx.strokeStyle = "#2a9d8f";
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -60); ctx.stroke();
}

/* ---------------------------------------------------------------------
   PARTE 2 — as transformações

   Lembre-se: o Canvas aplica as transformações DE BAIXO PARA CIMA.
   A última linha escrita é a primeira que acontece com o desenho.
--------------------------------------------------------------------- */

function desenhaSteve() {
  ctx.save();

  // COMPOSIÇÃO: translação + escala + rotação, na mesma matriz
  ctx.translate(estado.x, estado.y);   // 3a op: leva o Steve para a cena
  ctx.scale(estado.escala, estado.escala);  // 2a op: muda o tamanho

  // REFLEXÃO: escala com fator negativo em x, o caso especial S(-1, 1)
  if (estado.espelhado) ctx.scale(-1, 1);

  // ROTAÇÃO COM PONTO FIXO no centro do corpo — o padrão T -> R -> T
  ctx.translate(CENTRO.x, CENTRO.y);          // 3a op: volta
  ctx.rotate(rad(estado.graus));              // 2a op: gira
  ctx.translate(-CENTRO.x, -CENTRO.y);        // 1a op: leva o centro à origem

  // guarda a matriz composta para mostrar no painel
  matrizAtual = ctx.getTransform();

  // --- pernas: a MESMA função desenhada em dois lugares, só com translate
  ctx.save();
  ctx.translate(-LARG_MEMBRO / 2, Y_QUADRIL);
  desenhaPerna();
  ctx.restore();

  ctx.save();
  ctx.translate(LARG_MEMBRO / 2, Y_QUADRIL);
  desenhaPerna();
  ctx.restore();

  desenhaBracoDireito();

  // --- braço que acena: rotação com ponto fixo no OMBRO
  const anguloBraco = rad(
    ACENO.anguloBase + ACENO.amplitude * Math.sin(tempo * ACENO.velocidade)
  );

  ctx.save();
  ctx.translate(OMBRO.x, OMBRO.y);            // 3a op: volta
  if (estado.guias) marcaPivo("#ff4d4d");     // aqui o ombro está na origem
  ctx.rotate(anguloBraco);                    // 2a op: gira
  ctx.translate(-OMBRO.x, -OMBRO.y);          // 1a op: leva o ombro à origem
  desenhaBracoSuperior();

  // HIERARQUIA: a mão é desenhada DENTRO do save do braço, então ela
  // herda a rotação do ombro e ainda gira sozinha no cotovelo.
  const anguloMao = rad(
    ACENO.mao * Math.sin(tempo * ACENO.velocidade + ACENO.atrasoMao)
  );

  ctx.save();
  ctx.translate(COTOVELO.x, COTOVELO.y);      // 3a op: volta
  if (estado.guias) marcaPivo("#ff9f1c");     // o cotovelo está na origem
  ctx.rotate(anguloMao);                      // 2a op: gira
  ctx.translate(-COTOVELO.x, -COTOVELO.y);    // 1a op: leva o cotovelo à origem
  desenhaMao();
  ctx.restore();

  ctx.restore();

  // tronco e cabeça por cima, escondendo a emenda do ombro
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
