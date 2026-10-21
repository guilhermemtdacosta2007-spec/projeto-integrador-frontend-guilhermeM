/*
 * AULA 10 (JavaScript): mini-analisador de vendas do DataLab
 *
 * TEMA: loja de periféricos de informática (análise de vendas do mês).
 * ENTRADA: limite de unidades para considerar "alta saída" (prompt) e,
 *          depois, nomes de produtos para consulta até digitar "sair".
 * PROCESSAMENTO: classificar cada produto pelas vendas, definir o corredor
 *          pela categoria e resumir (contar, somar, achar o maior).
 * SAÍDA: tabela no console (console.table) e resumo na página.
 *
 * PSEUDOCÓDIGO:
 * 1. Ter a lista de produtos (nome, preço, vendas, categoria)
 * 2. Pedir o limite de alta saída e validar (null, vazio, NaN, faixa)
 * 3. Para cada produto: classificar (Sem vendas / Baixa saída / Alta saída)
 * 4. Pelo switch da categoria, definir o corredor da loja
 * 5. Contar sem vendas, somar a receita e achar o mais vendido
 * 6. Mostrar a tabela e o resumo
 * 7. Repetir consultas por nome até o usuário digitar "sair"
 *
 * TESTE DE MESA (limite = 20), três primeiras voltas do for...of:
 * | volta | produto          | vendas | situação    | semVendas | receitaTotal | maisVendido |
 * |-------|------------------|--------|-------------|-----------|--------------|-------------|
 * | 1     | teclado mecânico | 48     | Alta saída  | 0         | 12000        | teclado     |
 * | 2     | mouse sem fio    | 120    | Alta saída  | 0         | 22800        | mouse       |
 * | 3     | monitor 24"      | 15     | Baixa saída | 0         | 34800        | mouse       |
 */

// Dados do tema: 6 objetos com 4 propriedades cada
const produtos = [
  { nome: "teclado mecânico", preco: 250, vendas: 48, categoria: "perifericos" },
  { nome: "mouse sem fio", preco: 90, vendas: 120, categoria: "perifericos" },
  { nome: 'monitor 24"', preco: 800, vendas: 15, categoria: "telas" },
  { nome: "headset", preco: 220, vendas: 33, categoria: "audio" },
  { nome: "caixa de som", preco: 150, vendas: 8, categoria: "audio" },
  { nome: "webcam hd", preco: 180, vendas: 0, categoria: "perifericos" },
];

// Entrada com prompt, convertida com Number() e validada
function pedirLimiteAltaSaida() {
  const limitePadrao = 20;
  let limite = null;

  while (limite === null) {
    const entrada = prompt("Digite o limite de vendas para 'alta saída' (de 1 a 200):");

    if (entrada === null) {
      alert(`Entrada cancelada. Usando o limite padrão: ${limitePadrao}.`);
      return limitePadrao;
    }
    if (entrada.trim() === "") {
      alert("Você não digitou nada. Informe um número.");
      continue;
    }

    const numero = Number(entrada);

    if (Number.isNaN(numero)) {
      alert("Isso não é um número. Tente de novo.");
    } else if (numero < 1 || numero > 200) {
      alert("O número deve estar entre 1 e 200.");
    } else {
      limite = numero;
    }
  }

  return limite;
}

function executarAnalise() {
  const limiteAltaSaida = pedirLimiteAltaSaida();

  const relatorio = [];
  let semVendas = 0; // padrão: contador
  let receitaTotal = 0; // padrão: acumulador
  let maisVendido = produtos[0]; // padrão: máximo

  for (const produto of produtos) {
    // if / else if / else: do caso mais restrito para o mais geral
    let situacao;
    if (produto.vendas === 0) {
      situacao = "Sem vendas";
      semVendas++;
    } else if (produto.vendas <= limiteAltaSaida) {
      situacao = "Baixa saída";
    } else {
      situacao = "Alta saída";
    }

    // switch sobre a categoria, com break em todos os cases e default
    let corredor;
    switch (produto.categoria) {
      case "perifericos":
        corredor = "Corredor A";
        break;
      case "telas":
        corredor = "Corredor B";
        break;
      case "audio":
        corredor = "Corredor C";
        break;
      default:
        corredor = "Sem corredor definido";
        break;
    }

    receitaTotal += produto.preco * produto.vendas;

    if (produto.vendas > maisVendido.vendas) {
      maisVendido = produto;
    }

    relatorio.push({
      produto: produto.nome,
      categoria: produto.categoria,
      vendas: produto.vendas,
      situacao: situacao,
      corredor: corredor,
    });
  }

  const receitaFormatada = receitaTotal.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const resumo =
    `Limite de alta saída: ${limiteAltaSaida} unidades\n` +
    `Receita total do mês: ${receitaFormatada}\n` +
    `Produto mais vendido: ${maisVendido.nome} (${maisVendido.vendas} unidades)\n` +
    `Produtos sem vendas: ${semVendas} de ${produtos.length}`;

  console.table(relatorio);
  console.log(resumo);

  const saida = document.getElementById("resultado-analise");
  if (saida) {
    saida.textContent = resumo;
  }

  consultarProdutos();
}

// while com condição de saída atualizada dentro do laço
function consultarProdutos() {
  let consulta = prompt('Consulte um produto pelo nome (ou digite "sair"):');

  while (consulta !== null && consulta.trim().toLowerCase() !== "sair") {
    const nomeBuscado = consulta.trim().toLowerCase();
    let encontrado = null;

    for (const produto of produtos) {
      if (produto.nome === nomeBuscado) {
        encontrado = produto;
      }
    }

    if (encontrado === null) {
      alert(`Não encontrei "${consulta}" no catálogo.`);
    } else {
      alert(
        `${encontrado.nome}: R$ ${encontrado.preco.toFixed(2)}, ` +
          `${encontrado.vendas} vendas (${encontrado.categoria}).`
      );
    }

    // Atualiza a condição do while (evita laço infinito)
    consulta = prompt('Consulte outro produto (ou digite "sair"):');
  }

  console.log("Consulta encerrada.");
}

const botaoAnalise = document.getElementById("botao-analise");
if (botaoAnalise) {
  botaoAnalise.addEventListener("click", executarAnalise);
}
