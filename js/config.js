/* =====================================================================
   config.js — canvas, recortes do sprite, coordenadas locais e estado.

   Este é o arquivo que você mexe para ajustar a cena: tamanho do Steve,
   posição inicial, velocidade do aceno, pivôs das rotações.
   ===================================================================== */
"use strict";

const canvas = document.getElementById("cena");
const ctx = canvas.getContext("2d");

const LARG = canvas.width;     // 960
const ALT_CV = canvas.height;  // 600
const CHAO_Y = 520;            // linha do chão na cena

/* ---------------------------------------------------------------------
   1) Recortes da folha de sprites

   steve-png.png tem 1297x769 e traz 4 poses do Steve lado a lado.
   Usamos só a pose frontal, que vai de x=672 a x=1056.

   Ela se decompõe em retângulos inteiramente opacos (nenhum deles contém
   fundo branco), o que permite separar o braço do corpo sem precisar
   mexer em pixel nenhum — nada de getImageData. Isso também é o que faz
   a página funcionar abrindo o index.html direto, sem servidor.
--------------------------------------------------------------------- */
const R_CORPO   = { sx: 768, sy:   0, sw: 193, sh: 769 }; // cabeça + tronco + pernas
const R_BRACO_D = { sx: 961, sy: 192, sw:  96, sh: 288 }; // braço da direita (parado)

// O braço do tchau é cortado em dois elos para montar a hierarquia ombro → cotovelo.
const R_BRACO_SUP = { sx: 672, sy: 192, sw: 96, sh: 192 }; // ombro → cotovelo
const R_BRACO_INF = { sx: 672, sy: 384, sw: 96, sh:  96 }; // cotovelo → mão

/* ---------------------------------------------------------------------
   2) Sistema de coordenadas LOCAL do Steve

   Origem (0,0) = entre os pés, no chão. Y cresce para baixo (padrão do
   canvas), então o corpo todo ocupa y negativo.
--------------------------------------------------------------------- */
const MEIA_LARG = R_CORPO.sw / 2;  // 96.5
const ALT_STEVE = R_CORPO.sh;      // 769

const P_CORPO     = { dx: -MEIA_LARG,                  dy: -ALT_STEVE };
const P_BRACO_D   = { dx:  MEIA_LARG,                  dy: -ALT_STEVE + R_BRACO_D.sy };
const P_BRACO_SUP = { dx: -MEIA_LARG - R_BRACO_SUP.sw, dy: -ALT_STEVE + R_BRACO_SUP.sy };
const P_BRACO_INF = { dx: -MEIA_LARG - R_BRACO_INF.sw, dy: -ALT_STEVE + R_BRACO_INF.sy };

// Pivôs usados nas rotações com ponto fixo (topo-centro de cada elo)
const OMBRO    = { x: P_BRACO_SUP.dx + R_BRACO_SUP.sw / 2, y: P_BRACO_SUP.dy };
const COTOVELO = { x: P_BRACO_INF.dx + R_BRACO_INF.sw / 2, y: P_BRACO_INF.dy };
const CENTRO   = { x: 0, y: -ALT_STEVE / 2 };  // centro do corpo

/* ---------------------------------------------------------------------
   3) Ajustes do aceno — mexa aqui para mudar o tchau
--------------------------------------------------------------------- */
const ACENO = {
  anguloBase: 155,  // graus: o quanto o braço fica levantado
  amplitude: 18,    // graus: o quanto ele vai e volta
  velocidade: 5,    // rad/s da oscilação
  mao: 22,          // graus: amplitude do giro extra da mão no cotovelo
  atrasoMao: 1.1    // defasagem da mão em relação ao braço
};

/* ---------------------------------------------------------------------
   4) Estado controlado pelo usuário
--------------------------------------------------------------------- */
const estado = {
  x: LARG / 2,
  y: CHAO_Y,
  graus: 0,
  escala: 0.45,
  espelhado: false,
  guias: true
};

const PADRAO = Object.assign({}, estado);

// Matriz composta do corpo no frame atual — steve.js escreve, controles.js lê.
let matrizAtual = null;

/* ---------------------------------------------------------------------
   5) Sprite
--------------------------------------------------------------------- */
const sprite = new Image();
let spritePronto = false;
let spriteFalhou = false;
sprite.onload  = function () { spritePronto = true; };
sprite.onerror = function () { spriteFalhou = true; };
sprite.src = "steve-png.png";

const rad = g => g * Math.PI / 180;
