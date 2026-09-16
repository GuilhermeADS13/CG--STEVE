# CG-STEVE — Transformações Geométricas 2D

Projeto da disciplina de Computação Gráfica (UNICAP) — Transformações 2D com HTML +
JavaScript + Canvas 2D.

## Tema

O **Steve acena** para quem está olhando. Ele é desenhado com `fillRect` — cabeça,
tronco, braços e pernas — e pode ser transladado, girado, escalado e espelhado
interativamente.

## Como o Steve é montado

             40
          ┌──────┐
          │cabeça│ 40        y = -160  topo
    ┌──┬──┼──────┼──┬──┐
    │br│  │tronco│  │br│ 60  y = -120  ombro
    └──┴──┼──────┼──┴──┘
          │pn│pn │      60   y =  -60  quadril
          └──┴───┘           y =    0  chão
