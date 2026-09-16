/* =====================================================================
   controles.js — sliders, checkboxes, teclado e o painel da matriz.
   ===================================================================== */
"use strict";

const cX = document.getElementById("c-x");
const cY = document.getElementById("c-y");
const cR = document.getElementById("c-r");
const cS = document.getElementById("c-s");
const cG = document.getElementById("c-guias");
const cF = document.getElementById("c-espelho");

const vX = document.getElementById("v-x");
const vY = document.getElementById("v-y");
const vR = document.getElementById("v-r");
const vS = document.getElementById("v-s");

const elMatriz = document.getElementById("matriz");

function sincronizar() {
  cX.value = estado.x;      vX.textContent = Math.round(estado.x);
  cY.value = estado.y;      vY.textContent = Math.round(estado.y);
  cR.value = estado.graus;  vR.textContent = Math.round(estado.graus) + "°";
  cS.value = estado.escala; vS.textContent = estado.escala.toFixed(2) + "×";
  cG.checked = estado.guias;
  cF.checked = estado.espelhado;
}

cX.addEventListener("input", function () { estado.x = +cX.value; sincronizar(); });
cY.addEventListener("input", function () { estado.y = +cY.value; sincronizar(); });
cR.addEventListener("input", function () { estado.graus = +cR.value; sincronizar(); });
cS.addEventListener("input", function () { estado.escala = +cS.value; sincronizar(); });
cG.addEventListener("change", function () { estado.guias = cG.checked; });
cF.addEventListener("change", function () { estado.espelhado = cF.checked; });

document.getElementById("reset").addEventListener("click", function () {
  Object.assign(estado, PADRAO);
  sincronizar();
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
    case "+": case "=": estado.escala = limite(estado.escala + 0.03, 0.15, 1.1); break;
    case "-": case "_": estado.escala = limite(estado.escala - 0.03, 0.15, 1.1); break;
    case "f": case "F": estado.espelhado = !estado.espelhado; break;
    default: usou = false;
  }

  if (usou) { e.preventDefault(); sincronizar(); }
});

// Mostra a matriz composta do corpo no formato 3x3 de coordenadas homogêneas.
const f3 = n => (Math.abs(n) < 0.0005 ? 0 : n).toFixed(3).padStart(8);

function atualizarMatriz() {
  if (!matrizAtual) return;
  const m = matrizAtual;
  elMatriz.textContent =
    "| " + f3(m.a) + " " + f3(m.c) + " " + f3(m.e) + " |\n" +
    "| " + f3(m.b) + " " + f3(m.d) + " " + f3(m.f) + " |\n" +
    "| " + f3(0)   + " " + f3(0)   + " " + f3(1)   + " |";
}

sincronizar();
