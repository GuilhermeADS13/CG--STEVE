let animando = false;
let idAnimacao;
let funcaoRetomada = null;
let roteiroEmAndamento = false;

const botao = document.querySelector('#play-button');

function animarAcao(acao, passosMax, sinal) {
  return new Promise((resolve) => {
    let inc;
    if (acao === "escala") {
      inc = (sinal === "pos") ? 0.01 : -0.01;
    } else if (acao === "y") {
      inc = (sinal === "pos") ? 5 : -5;
    } else {
      inc = (sinal === "pos") ? 1 : -1;
    }

    let passoAtual = 0;
    const maximo = parseInt(passosMax, 10);

    function quadro() {
      if (!animando) {
        funcaoRetomada = quadro;
        return;
      }

      ajusta(acao, inc);
      atualiza();
      passoAtual++;

      // se ainda não acabou, chama o próximo quadro
      if (passoAtual < maximo) {
        idAnimacao = requestAnimationFrame(quadro);
      } else { //caso contrário, libera a promise pra permitir prox ação
        resolve();
      }
    }

    quadro();
  });
}

// roteiro com as ações desejadas pra animação (executa uma após a outra)
async function roteiroAnimacao() {
  // NOTE: ações desejadas
  await animarAcao("escala", 80, "pos");
  await animarAcao("escala", 80, "neg");
  await animarAcao("anguloOmbro", 150, "pos");
  await animarAcao("anguloCotovelo", 15, "pos"); //movimenta antebraço
  await animarAcao("anguloOmbro", 30, "neg");
  await animarAcao("anguloOmbro", 30, "pos");
  await animarAcao("anguloOmbro", 30, "neg");
  await animarAcao("anguloOmbro", 30, "pos");
  await animarAcao("anguloOmbro", 30, "neg");
  await animarAcao("anguloOmbro", 120, "neg");
  await animarAcao("anguloCotovelo", 15, "neg"); //retorna antebraço
  await animarAcao("y", 12, "pos"); //desce pro chao
  await animarAcao("y", 12, "neg"); //pulinhos
  await animarAcao("y", 12, "pos");
  await animarAcao("y", 12, "neg");
  await animarAcao("y", 12, "pos");
  await animarAcao("y", 12, "neg");
  await animarAcao("y", 12, "pos");

  //reseta o botão
  animando = false;
  roteiroEmAndamento = false;
  botao.textContent = "Iniciar animação";
}

function animacao() {
  animando = !animando;

  if (animando) {
    botao.textContent = "Pausar animação";

    if (!roteiroEmAndamento) {
      Object.assign(estado, PADRAO); //reseta sempre que reinicia
      atualiza();

      roteiroEmAndamento = true;
      roteiroAnimacao();
    } else if (funcaoRetomada) { //se pausou, retorna a animação de onde parou
      const continuar = funcaoRetomada;
      funcaoRetomada = null;
      continuar();
    }
  } else {
    botao.textContent = "Continuar animação";
  }
}
