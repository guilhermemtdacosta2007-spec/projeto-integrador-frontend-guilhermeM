// AULA 5: gráfico de barras animado em Canvas (requestAnimationFrame + clearRect a cada quadro)
const telaGrafico = document.getElementById("grafico-vendas");

if (telaGrafico && telaGrafico.getContext) {
  const contextoGrafico = telaGrafico.getContext("2d");
  const dadosGrafico = [
    ["Teclado", 48],
    ["Mouse", 120],
    ["Monitor", 15],
    ["Headset", 33],
    ["Caixa", 8],
    ["Webcam", 0],
  ];
  const maiorValorGrafico = 120;
  let progressoGrafico = 0;

  function desenharGrafico() {
    // Limpa o quadro anterior para não acumular desenhos
    contextoGrafico.clearRect(0, 0, telaGrafico.width, telaGrafico.height);
    contextoGrafico.font = "14px sans-serif";

    dadosGrafico.forEach(([rotulo, valor], indice) => {
      const x = 30 + indice * 85;
      const altura = (valor / maiorValorGrafico) * 200 * progressoGrafico;
      contextoGrafico.fillStyle = valor === maiorValorGrafico ? "#ff8c00" : "#2e75b6";
      contextoGrafico.fillRect(x, 260 - altura, 60, altura);
      contextoGrafico.fillStyle = "#1f2937";
      contextoGrafico.fillText(rotulo, x, 282);
      contextoGrafico.fillText(String(valor), x, 254 - altura);
    });

    if (progressoGrafico < 1) {
      progressoGrafico = Math.min(progressoGrafico + 0.02, 1);
      requestAnimationFrame(desenharGrafico);
    }
  }

  desenharGrafico();
}
