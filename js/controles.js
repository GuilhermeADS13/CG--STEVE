"use strict";

const cX = document.getElementById("c-x");
const cY = document.getElementById("c-y");
const cR = document.getElementById("c-r");
const cS = document.getElementById("c-s");
const cO = document.getElementById("c-ombro");
const cC = document.getElementById("c-cotovelo");

const vX = document.getElementById("v-x");
const vY = document.getElementById("v-y");
const vR = document.getElementById("v-r");
const vS = document.getElementById("v-s");
const vO = document.getElementById("v-ombro");
const vC = document.getElementById("v-cotovelo");

const elMatriz = document.getElementById("matriz");

const GRAU = "°";

function sincronizar() {
  cX.value = estado.x;      vX.textContent = Math.round(estado.x);
  cY.value = estado.y;      vY.textContent = Math.round(estado.y);
  cR.value = estado.graus;  vR.textContent = Math.round(estado.graus) + GRAU;
  cS.value = estado.escala; vS.textContent = estado.escala.toFixed(2) + "×";
  cO.value = estado.anguloOmbro;    vO.textContent = Math.round(estado.anguloOmbro) + GRAU;
  cC.value = estado.anguloCotovelo; vC.textContent = Math.round(estado.anguloCotovelo) + GRAU;
}

function atualiza() {
  sincronizar();
  desenha();
}

cX.addEventListener("input", function () { estado.x = +cX.value; atualiza(); });
cY.addEventListener("input", function () { estado.y = +cY.value; atualiza(); });
cR.addEventListener("input", function () { estado.graus = +cR.value; atualiza(); });
cS.addEventListener("input", function () { estado.escala = +cS.value; atualiza(); });
cO.addEventListener("input", function () { estado.anguloOmbro = +cO.value; atualiza(); });
cC.addEventListener("input", function () { estado.anguloCotovelo = +cC.value; atualiza(); });

document.getElementById("reset").addEventListener("click", function () {
  Object.assign(estado, PADRAO);
  atualiza();
});

const limite = (v, min, max) => Math.min(max, Math.max(min, v));

window.addEventListener("keydown", function (e) {
  const passo = e.shiftKey ? 20 : 6;
  let usou = true;

  switch (e.key) {
    case "ArrowLeft":   estado.x = limite(estado.x - passo, 0, LARG); break;
    case "ArrowRight":  estado.x = limite(estado.x + passo, 0, LARG); break;
    case "ArrowUp":     estado.y = limite(estado.y - passo, 120, ALT_CV); break;
    case "ArrowDown":   estado.y = limite(estado.y + passo, 120, ALT_CV); break;
    case "q": case "Q": estado.graus = limite(estado.graus - 4, -180, 180); break;
    case "e": case "E": estado.graus = limite(estado.graus + 4, -180, 180); break;
    case "+": case "=": estado.escala = limite(estado.escala + 0.1, 0.5, 4); break;
    case "-": case "_": estado.escala = limite(estado.escala - 0.1, 0.5, 4); break;
    case "a": case "A": estado.anguloOmbro = limite(estado.anguloOmbro - 5, -180, 180); break;
    case "d": case "D": estado.anguloOmbro = limite(estado.anguloOmbro + 5, -180, 180); break;
    case "f": case "F": estado.espelhado = !estado.espelhado; break;
    default: usou = false;
  }

  if (usou) { e.preventDefault(); atualiza(); }
});

const f3 = n => (Math.abs(n) < 0.0005 ? 0 : n).toFixed(3).padStart(8);

function atualizarMatriz() {
  if (!matrizAtual) return;
  const m = matrizAtual;
  elMatriz.textContent =
    "| " + f3(m.a) + " " + f3(m.c) + " " + f3(m.e) + " |\n" +
    "| " + f3(m.b) + " " + f3(m.d) + " " + f3(m.f) + " |\n" +
    "| " + f3(0)   + " " + f3(0)   + " " + f3(1)   + " |";
}
