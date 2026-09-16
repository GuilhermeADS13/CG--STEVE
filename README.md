# CG-STEVE — Transformações Geométricas 2D

Projeto da disciplina de Computação Gráfica (UNICAP) — Transformações 2D com HTML +
JavaScript + Canvas 2D.

## Tema

O **Steve acena** para quem está olhando. Ele é desenhado com `fillRect` — cabeça,
tronco, braços e pernas — e pode ser transladado, girado, escalado e espelhado
interativamente, enquanto o braço acena sozinho na animação.

> O cenário (céu, sol, nuvens e chão) ainda não foi feito — por enquanto o Steve
> aparece sobre um fundo liso.

## Como abrir

Abra o `index.html` direto no navegador (duplo clique). Não precisa de servidor.

## Arquivos

| arquivo | o que é |
| --- | --- |
| `index.html` | só a marcação: canvas, controles e painéis |
| `css/estilo.css` | aparência da página |
| `js/config.js` | **mexa aqui**: medidas, cores, pivôs, ajustes do aceno e estado inicial |
| `js/steve.js` | desenha o Steve e aplica as transformações |
| `js/controles.js` | sliders, checkboxes, teclado e painel da matriz |
| `js/main.js` | loop de animação com o reset da matriz |
| `steve-png.png` | imagem de referência que inspirou as cores e proporções (não é usada pelo código) |
| `README.md` | este arquivo |

Os scripts são **clássicos** e carregados em ordem (`config` primeiro, `main` por
último), compartilhando o escopo global. Não são módulos ES de propósito:
`type="module"` é bloqueado por CORS no protocolo `file://`, e a entrega exige abrir
sem servidor.

## Como o Steve é montado

A origem `(0,0)` do Steve fica **entre os pés**. No Canvas o eixo `y` cresce para
baixo, então o corpo todo ocupa `y` negativo: quanto mais alto no desenho, mais
negativo o `y`.

```text
             40
          ┌──────┐
          │cabeça│ 40        y = -160  topo
    ┌──┬──┼──────┼──┬──┐
    │br│  │tronco│  │br│ 60  y = -120  ombro
    └──┴──┼──────┼──┴──┘
          │pn│pn │      60   y =  -60  quadril
          └──┴───┘           y =    0  chão
```

Todas as medidas saem de quatro números em `config.js`:

| medida | valor |
| --- | --- |
| largura do tronco e da cabeça | 40 |
| largura de um braço ou perna | 20 |
| altura da cabeça | 40 |
| altura do tronco e das pernas | 60 |

Daí saem os três pivôs, que são só pares de números:

| pivô | posição | de onde vem |
| --- | --- | --- |
| centro do corpo | `(0, -80)` | metade da altura total (160) |
| ombro | `(-30, -120)` | encostado no tronco, na altura do ombro |
| cotovelo | `(-30, -90)` | na metade do braço |

## Onde cada transformação é usada

| requisito | onde no código |
| --- | --- |
| 1. Translação (`ctx.translate`) | posiciona o Steve e desenha a **mesma** `desenhaPerna()` nos dois lados |
| 2. Rotação (`ctx.rotate`) | corpo, braço e mão |
| 3. Escala (`ctx.scale`) | redimensiona o Steve inteiro |
| 4. Composição | translação → escala → rotação na mesma matriz |
| 5. Ponto fixo `T → Op → T⁻¹` | 3 casos: centro do corpo, ombro e cotovelo |
| 6. Animação | `main.js`: `requestAnimationFrame` + `setTransform(1,0,0,1,0,0)` |
| 7. Pilha de estados | `save`/`restore` em cada perna, no braço, na mão e nos marcadores |

### O padrão do ponto fixo

Escrito exatamente como na aula, lembrando que o Canvas aplica as transformações
**de baixo para cima** — a última linha escrita é a primeira que acontece:

```js
ctx.translate(OMBRO.x, OMBRO.y);     // 3a op: volta
ctx.rotate(anguloBraco);             // 2a op: gira
ctx.translate(-OMBRO.x, -OMBRO.y);   // 1a op: leva o ombro à origem
desenhaBracoSuperior();
```

Equivale a `M = T(p) · R(θ) · T(−p)`.

### As composições

Corpo:

```text
T(x, y) · S(s, s) · [ T(c) · R(θ) · T(−c) ]
```

Braço, já dentro da matriz do corpo:

```text
… · [ T(ombro) · R(α) · T(−ombro) ]
```

Mão, já dentro da matriz do braço:

```text
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

## Dois detalhes que valem explicar

- **Os marcadores de pivô** são desenhados logo depois do primeiro `translate`, quando
  o pivô já está na origem. Por isso `marcaPivo` só faz `arc(0, 0, ...)` — não precisa
  de conta nenhuma para achar onde o ponto está.
- **O raio do marcador e a espessura dos eixos** são divididos por `estado.escala`,
  senão cresceriam junto com o Steve quando você aumenta a escala.
