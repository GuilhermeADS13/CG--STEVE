# CG-STEVE — Transformações Geométricas 2D

Projeto da disciplina de Computação Gráfica (UNICAP) — Transformações 2D com HTML +
JavaScript + Canvas 2D.

## Tema

Uma cena estilo Minecraft onde o **Steve acena** para quem está olhando. O personagem
é montado a partir de recortes de `steve-png.png` e pode ser transladado, girado,
escalado e espelhado interativamente, enquanto o braço acena sozinho na animação.

## Como abrir

Abra o `index.html` direto no navegador (duplo clique). Não precisa de servidor.

## Arquivos

| arquivo | o que é |
|---|---|
| `index.html` | só a marcação: canvas, controles e painéis |
| `css/estilo.css` | aparência da página |
| `js/config.js` | **mexa aqui**: recortes do sprite, coordenadas locais, pivôs, ajustes do aceno e estado inicial |
| `js/cenario.js` | céu, sol, nuvens e chão de blocos |
| `js/steve.js` | o personagem e as transformações principais |
| `js/controles.js` | sliders, checkboxes, teclado e painel da matriz |
| `js/main.js` | loop de animação com o reset da matriz |
| `steve-png.png` | folha de sprites 1297×769 com 4 poses do Steve |
| `README.md` | este arquivo |

Os scripts são **clássicos** e carregados em ordem (`config` primeiro, `main` por
último), compartilhando o escopo global. Não são módulos ES de propósito: `type="module"`
é bloqueado por CORS no protocolo `file://`, e a entrega exige abrir sem servidor.

## Como o Steve é montado

A folha tem 4 poses lado a lado; o projeto usa só a **pose frontal** (`x` de 672 a 1056).
Ela se decompõe em retângulos **inteiramente opacos** — nenhum deles contém fundo
branco — o que permite separar o braço do corpo sem manipular pixel nenhum
(sem `getImageData`, o que também evita o problema de canvas *tainted* em `file://`).

| parte | recorte no sprite (x, y, largura, altura) |
|---|---|
| corpo (cabeça + tronco + pernas) | 768, 0, 193, 769 |
| braço direito (parado) | 961, 192, 96, 288 |
| braço esquerdo: ombro → cotovelo | 672, 192, 96, 192 |
| braço esquerdo: cotovelo → mão | 672, 384, 96, 96 |

O sistema de coordenadas **local** do Steve tem origem entre os pés, no chão. Como no
Canvas o eixo `y` cresce para baixo, o corpo todo ocupa `y` negativo.

## Onde cada transformação é usada

| requisito | onde no `index.html` | função |
|---|---|---|
| 1. Translação (`ctx.translate`) | `desenharCenario` (sol, nuvens, cada bloco do chão) e `desenharSteve` (posição na cena) | posicionar |
| 2. Rotação (`ctx.rotate`) | `desenharSteve` — corpo, braço e mão | girar |
| 3. Escala (`ctx.scale`) | `desenharSteve` — slider de escala | redimensionar |
| 4. Composição | `desenharSteve` — `T · S · [T·R·T⁻¹]` na mesma matriz | combinar |
| 5. Ponto fixo `T → Op → T⁻¹` | 3 casos: centro do corpo, ombro e cotovelo | girar sem sair do lugar |
| 6. Animação | `quadro()` — `requestAnimationFrame` + `setTransform(1,0,0,1,0,0)` | resetar a matriz por frame |
| 7. Pilha de estados | `save`/`restore` em cenário, corpo, braço, mão e marcadores | isolar estado |

### Composições, na ordem em que são aplicadas

Corpo:

```
T(x, y) · S(s, s) · [ T(c) · R(θ) · T(−c) ]
```

Braço, já dentro da matriz do corpo:

```
… · [ T(ombro) · R(α) · T(−ombro) ]
```

Mão, já dentro da matriz do braço:

```
… · [ T(cotovelo) · R(β) · T(−cotovelo) ]
```

## Bônus

- **Interatividade** — sliders de posição/rotação/escala e teclado: setas movem,
  `Q`/`E` giram, `+`/`−` escalam, `F` espelha.
- **Reflexão** — o checkbox "reflexão" aplica `ctx.scale(-1, 1)`, o caso especial da
  escala com fator negativo. O tchau troca de lado.
- **Hierarquia de transformações** — a mão é desenhada **dentro** do `save`/`restore`
  do braço, então herda a rotação do ombro e ainda gira por conta própria no cotovelo.
  É o caso "a mão acompanha o braço".

## Detalhes de implementação

- **Marcadores de pivô** (`marcarPivo`): o ponto local é convertido para coordenadas de
  tela multiplicando pela matriz corrente na mão, e o círculo é desenhado com
  `setTransform(1,0,0,1,0,0)`. Assim o marcador não herda a escala nem a rotação e
  mantém sempre o mesmo tamanho.
- **Eixos locais** (`desenharEixos`): a espessura da linha é dividida pela escala
  (`3 / estado.escala`) para não engrossar junto com o Steve.
- **Painel da matriz**: mostra `ctx.getTransform()` do corpo em tempo real, no formato
  3×3 de coordenadas homogêneas.
- `imageSmoothingEnabled = false` preserva o visual pixelado do sprite.
