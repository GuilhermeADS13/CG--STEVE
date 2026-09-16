"use strict";

const canvas = document.getElementById("cena");
const ctx = canvas.getContext("2d");

const LARG = canvas.width;
const ALT_CV = canvas.height;
const CHAO = 500;

const LARG_CORPO  = 40;
const LARG_MEMBRO = 20;
const ALT_CABECA  = 40;
const ALT_TRONCO  = 60;
const ALT_PERNA   = 60;

const Y_QUADRIL = -ALT_PERNA;               // -60
const Y_OMBRO   = Y_QUADRIL - ALT_TRONCO;   // -120
const Y_TOPO    = Y_OMBRO - ALT_CABECA;     // -160

const CENTRO   = { x: 0, y: Y_TOPO / 2 };                                // (0, -80)
const OMBRO    = { x: -(LARG_CORPO / 2 + LARG_MEMBRO / 2), y: Y_OMBRO };  // (-30, -120)
const COTOVELO = { x: OMBRO.x, y: Y_OMBRO + ALT_TRONCO / 2 };             // (-30, -90)

const PELE   = "#ffbb77";
const CAMISA = "#00eedd";
const CALCA  = "#0088cc";
const SAPATO = "#888888";
const CABELO = "#885522";
const BOCA   = "#8a5a2b";

const ACENO = {
  anguloBase: 150,
  amplitude: 20,
  velocidade: 5,
  mao: 22,
  atrasoMao: 1.1
};

const estado = {
  x: LARG / 2,
  y: CHAO,
  graus: 0,
  escala: 2,
  espelhado: false,
  guias: true
};

const PADRAO = Object.assign({}, estado);

let tempo = 0;
let matrizAtual = null;

const rad = g => g * Math.PI / 180;
