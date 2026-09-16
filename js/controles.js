"use strict";

const elMatriz = document.getElementById("matriz");

const CONTROLES = [
  { id: "x",        campo: "x",              texto: v => Math.round(v) },
  { id: "y",        campo: "y",              texto: v => Math.round(v) },
  { id: "r",        campo: "graus",          texto: v => Math.round(v) + "°" },
  { id: "s",        campo: "escala",         texto: v => v.toFixed(2) + "×" },
  { id: "ombro",    campo: "anguloOmbro",    texto: v => Math.round(v) + "°" },
  { id: "cotovelo", campo: "anguloCotovelo", texto: v => Math.round(v) + "°" }
];

for (const c of CONTROLES) {
  c.slider = document.getElementById("c-" + c.id);
  c.valor = document.getElementById("v-" + c.id);
  c.slider.addEventListener("input", () => {
    estado[c.campo] = +c.slider.value;
    atualiza();
  });
}

function sincronizar() {
  for (const c of CONTROLES) {
    c.slider.value = estado[c.campo];
    c.valor.textContent = c.texto(estado[c.campo]);
  }
}

function atualiza() {
  sincronizar();
  desenha();
}

function ajusta(campo, delta) {
  const c = CONTROLES.find(c => c.campo === campo);
  const v = estado[campo] + delta;
  estado[campo] = Math.min(+c.slider.max, Math.max(+c.slider.min, v));
}

const TECLAS = {
  ArrowLeft:  passo => ajusta("x", -passo),
  ArrowRight: passo => ajusta("x", passo),
  ArrowUp:    passo => ajusta("y", -passo),
  ArrowDown:  passo => ajusta("y", passo),
  q: () => ajusta("graus", -4),
  e: () => ajusta("graus", 4),
  a: () => ajusta("anguloOmbro", -5),
  d: () => ajusta("anguloOmbro", 5),
  "+": () => ajusta("escala", 0.1),
  "=": () => ajusta("escala", 0.1),
  "-": () => ajusta("escala", -0.1),
  _: () => ajusta("escala", -0.1),
  f: () => { estado.espelhado = !estado.espelhado; }
};

window.addEventListener("keydown", e => {
  const acao = TECLAS[e.key] || TECLAS[e.key.toLowerCase()];
  if (!acao) return;
  e.preventDefault();
  acao(e.shiftKey ? 20 : 6);
  atualiza();
});

document.getElementById("reset").addEventListener("click", () => {
  Object.assign(estado, PADRAO);
  atualiza();
});

function formata(n) {
  if (Math.abs(n) < 0.0005) n = 0;
  return n.toFixed(3).padStart(8);
}

function atualizarMatriz() {
  if (!matrizAtual) return;
  const m = matrizAtual;
  elMatriz.textContent = [
    [m.a, m.c, m.e],
    [m.b, m.d, m.f],
    [  0,   0,   1]
  ].map(linha => "| " + linha.map(formata).join(" ") + " |").join("\n");
}
