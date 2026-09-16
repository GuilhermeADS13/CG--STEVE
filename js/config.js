/* =====================================================================
   config.js — medidas, cores, pivôs e estado.

   É o arquivo que você mexe para mudar o Steve de tamanho, de cor ou
   para ajustar o aceno. Nada aqui desenha nada.
   ===================================================================== */
"use strict";

const canvas = document.getElementById("cena");
const ctx = canvas.getContext("2d");

const LARG = canvas.width;     // 960
const ALT_CV = canvas.height;  // 600
const CHAO = 500;              // linha do chão: é onde os pés do Steve ficam

/* ---------------------------------------------------------------------
   1) Medidas do Steve

   A origem (0,0) fica ENTRE OS PÉS. No Canvas o eixo y cresce para
   baixo, então o corpo todo fica em y negativo: quanto mais alto no
   desenho, mais negativo o y.

                 40
              ┌──────┐
              │cabeça│ 40        y = -160  topo
        ┌──┬──┼──────┼──┬──┐
        │br│  │tronco│  │br│ 60  y = -120  ombro
        └──┴──┼──────┼──┴──┘
              │pn│pn │        60  y =  -60  quadril
              └──┴───┘            y =    0  chão
--------------------------------------------------------------------- */
const LARG_CORPO  = 40;  // largura do tronco e da cabeça
const LARG_MEMBRO = 20;  // largura de um braço ou de uma perna
const ALT_CABECA  = 40;
const ALT_TRONCO  = 60;
const ALT_PERNA   = 60;

// Alturas acumuladas, de baixo para cima
const Y_QUADRIL = -ALT_PERNA;               // -60
const Y_OMBRO   = Y_QUADRIL - ALT_TRONCO;   // -120
const Y_TOPO    = Y_OMBRO - ALT_CABECA;     // -160

/* ---------------------------------------------------------------------
   2) Pivôs — os pontos fixos das rotações

   Cada um é só um par de números no sistema local do Steve.
--------------------------------------------------------------------- */
const CENTRO = { x: 0, y: Y_TOPO / 2 };  // (0, -80)  meio do corpo

// ombro esquerdo: encostado no tronco, na altura do ombro
const OMBRO = { x: -(LARG_CORPO / 2 + LARG_MEMBRO / 2), y: Y_OMBRO };  // (-30, -120)

// cotovelo: na metade do braço
const COTOVELO = { x: OMBRO.x, y: Y_OMBRO + ALT_TRONCO / 2 };          // (-30, -90)

/* ---------------------------------------------------------------------
   3) Cores
--------------------------------------------------------------------- */
const PELE   = "#ffbb77";
const CAMISA = "#00eedd";
const CALCA  = "#0088cc";
const SAPATO = "#888888";
const CABELO = "#885522";
const BOCA   = "#8a5a2b";

/* ---------------------------------------------------------------------
   4) Ajustes do aceno — mexa aqui para mudar o tchau
--------------------------------------------------------------------- */
const ACENO = {
  anguloBase: 150,  // graus: o quanto o braço fica levantado
  amplitude: 20,    // graus: o quanto ele vai e volta
  velocidade: 5,    // o quão rápido
  mao: 22,          // graus: o giro extra da mão no cotovelo
  atrasoMao: 1.1    // defasagem da mão em relação ao braço
};

/* ---------------------------------------------------------------------
   5) Estado controlado pelo usuário
--------------------------------------------------------------------- */
const estado = {
  x: LARG / 2,
  y: CHAO,
  graus: 0,
  escala: 2,
  espelhado: false,
  guias: true
};

const PADRAO = Object.assign({}, estado);

// Tempo da animação, em segundos. main.js soma 0.016 a cada frame.
let tempo = 0;

// Matriz composta do corpo — steve.js escreve, controles.js mostra na tela.
let matrizAtual = null;

// Converte graus para radianos, porque ctx.rotate só aceita radianos.
const rad = g => g * Math.PI / 180;
