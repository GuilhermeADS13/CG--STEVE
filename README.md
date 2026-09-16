# CG-STEVE — Transformações Geométricas 2D

Projeto da disciplina de Computação Gráfica (UNICAP) — Transformações 2D com HTML +
JavaScript + Canvas 2D.

## Tema

O **Steve acena** para quem está olhando. Ele é desenhado com `fillRect` — cabeça,
tronco, braços e pernas — e pode ser transladado, girado, escalado e espelhado
interativamente, enquanto o braço acena sozinho na animação.

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


- **Reflexão** — o checkbox "reflexão" aplica `ctx.scale(-1, 1)`, o caso especial da
  escala com fator negativo. O tchau troca de lado.
- **Hierarquia de transformações** — a mão é desenhada **dentro** do `save`/`restore`
  do braço, então herda a rotação do ombro e ainda gira por conta própria no cotovelo.
  É o caso "a mão acompanha o braço".
