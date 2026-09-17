No dia da entrega, durante a aula, vocês devem mostrar o código e o projeto funcionando. Aqui nessa atividade coloquem os códigos ou link do github.

Descrição:

Criar uma cena ou aplicação 2D interativa usando HTML, JavaScript e Canvas 2D que demonstre domínio das transformações geométricas aprendidas em aula.

O tema é livre — o grupo escolhe o que quer criar.

Informações Gerais

- Grupos: até 2 alunos
- Entrega/Aoresentação: 25/09
- Tecnologia: JavaScript + HTML + Canvas 2D
- Alternativa: quem preferir pode usar OpenGL (C/C++ ou WebGL)

Requisitos Obrigatórios

O projeto deve utilizar:

1. Translação (`ctx.translate`) — mover objetos na cena
2. Rotação (`ctx.rotate`) — girar pelo menos um objeto
3. Escala (`ctx.scale`) — redimensionar objetos
4. Composição de transformações — combinar pelo menos duas operações em sequência (ex: rotação + translação)
5. Rotação ou escala com ponto fixo — pelo menos um caso usando o padrão T → Op → T
6. Animação — usar `requestAnimationFrame` com reset de matriz a cada frame
7. save/restore ou setTransform — gerenciamento correto da pilha de estados

Requisitos Bônus (pontos extras)

- Interatividade com teclado ou mouse
- Uso de reflexão ou cisalhamento
- Hierarquia de transformações (ex: braço de robô, sistema solar com luas)


Exemplos e template que comentei na aula podem ser vistos em: https://github.com/prximenes/cg/tree/main/transformacoes2d/projeto
