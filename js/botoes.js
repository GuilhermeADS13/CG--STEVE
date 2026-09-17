const botaoAnimacao = document.querySelector('#play-button');
const botaoControles = document.querySelector('#controls-toggle');

// botaoAnimacao.addEventListener('click', () => {
//
// });

botaoControles.addEventListener('click', () => {
  const estaVisivel = botaoControles.textContent.trim() === "Esconder controles";
  
  botaoControles.textContent = estaVisivel ? "Mostrar controles" : "Esconder controles";

  canvas.classList.toggle('diminuido');
  document.querySelector('#painel-wrapper').classList.toggle('active');
});
