/* [AULA 11] Constantes de apoio para classificação visual e itens iniciais */
const CLASSES_FAIXA = {
  'Alta demanda': 'faixa-destaque',
  'Estável': 'faixa-estavel',
  'Atenção': 'faixa-atencao',
  'Crítico': 'faixa-critico'
};

/* [AULA 11 / AULA 12] Novos produtos adicionados dinamicamente via botão */
const filaNovosProdutos = [
  { produto: 'Monitor IPS 24" 144Hz', categoria: 'Monitores', preco: 980, unidades: 54, avaliacao: 4.9 },
  { produto: 'Hub USB-C 6 Portas', categoria: 'Acessórios', preco: 140, unidades: 12, avaliacao: 4.1 }
];

/* [AULA 12] Fonte única de verdade em memória: catálogo e conjunto de favoritos */
const catalogo = [];
const favoritos = new Set();

/* [AULA 11 / AULA 12] Seleções de elementos no DOM */
const grade = document.querySelector('.grade-produtos');
const menuPrincipal = document.querySelector('#menu-principal');
const botaoMenu = document.querySelector('.menu-hamburguer');
const botaoAdicionar = document.querySelector('#btn-adicionar-produto');
const campoBusca = document.querySelector('#campo-busca');
const filtroCategoria = document.querySelector('#filtro-categoria');
const contadorExibidos = document.querySelector('#contador-exibidos');
const botaoOrdem = document.querySelector('#btn-ordem');
const botaoTravar = document.querySelector('#btn-travar');
const saidaOrdem = document.querySelector('#saida-ordem');

/* [AULA 11] Função pura: calcula receita estimada com desconto opcional */
function calcularReceitaItem(preco, unidades, descontoPercentual = 0) {
  const fator = 1 - descontoPercentual / 100;
  return preco * unidades * fator;
}

/* [AULA 11] Função pura: classifica volume em faixas do maior para o menor */
function classificarVolume(unidades) {
  if (unidades >= 50) return 'Alta demanda';
  if (unidades >= 30) return 'Estável';
  if (unidades >= 15) return 'Atenção';
  return 'Crítico';
}

/* [AULA 11] Função pura: formata número para moeda BRL */
function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/* [AULA 11] Arrow function para obter receita de um item */
const receitaDoProduto = (item) => calcularReceitaItem(item.preco, item.unidades);

/* [AULA 11] Lê atributos data-* do card e converte campos numéricos com Number */
function lerProdutoDoCard(card) {
  return {
    produto: card.dataset.produto,
    categoria: card.dataset.categoria,
    preco: Number(card.dataset.preco),
    unidades: Number(card.dataset.unidades),
    avaliacao: Number(card.dataset.notaAvaliacao)
  };
}

/* [AULA 11] Insere desempenho e classe de faixa dentro de um card existente */
function exibirDesempenho(card) {
  const dados = lerProdutoDoCard(card);
  const faixa = classificarVolume(dados.unidades);
  const receita = receitaDoProduto(dados);

  const info = document.createElement('p');
  info.className = 'desempenho';
  info.textContent = `${faixa} · Receita: ${formatarMoeda(receita)}`;

  const classeFaixa = CLASSES_FAIXA[faixa];
  if (classeFaixa) {
    card.classList.add(classeFaixa);
  }
  card.append(info);
}

/* [AULA 12] Cria botão de favoritar acessível com aria-pressed e aria-label fixo */
function adicionarBotaoFavorito(card) {
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = 'botao-favoritar';
  botao.textContent = '★';
  botao.setAttribute('aria-pressed', 'false');
  botao.setAttribute('aria-label', `Favoritar ${card.dataset.produto}`);
  card.append(botao);
}

/* [AULA 11 / AULA 12] Monta um novo card no DOM usando textContent (sem innerHTML com dados) */
function criarCardProduto(item) {
  const card = document.createElement('article');
  card.className = 'card-produto';
  card.dataset.produto = item.produto;
  card.dataset.categoria = item.categoria;
  card.dataset.preco = String(item.preco);
  card.dataset.unidades = String(item.unidades);
  card.dataset.notaAvaliacao = String(item.avaliacao);

  const titulo = document.createElement('h3');
  titulo.textContent = item.produto;

  const meta = document.createElement('p');
  meta.className = 'meta';
  meta.textContent = `${item.categoria} · ${formatarMoeda(item.preco)}`;

  const avaliacao = document.createElement('p');
  avaliacao.className = 'avaliacao';
  const destaque = document.createElement('strong');
  destaque.textContent = String(item.avaliacao);
  avaliacao.append('Avaliação: ', destaque);

  card.append(titulo, meta, avaliacao);
  exibirDesempenho(card);
  adicionarBotaoFavorito(card);
  return card;
}

/* [AULA 11 / AULA 12] Painel de resumo criado uma vez e atualizado via replaceChildren */
const painelResumo = document.createElement('section');
painelResumo.className = 'resumo-analise';
const tituloResumo = document.createElement('h3');
tituloResumo.textContent = 'Resumo de vendas';
const listaResumo = document.createElement('ul');
painelResumo.append(tituloResumo, listaResumo);

/* [AULA 11] Insere o painel logo após o título da seção do catálogo */
const tituloSecao = document.querySelector('#catalogo-produtos h2');
if (tituloSecao) {
  tituloSecao.after(painelResumo);
}

/* [AULA 12] Função pura de filtro por termo de busca e categoria selecionada */
function produtoPassaNoFiltro(item) {
  const termo = campoBusca ? campoBusca.value.trim().toLowerCase() : '';
  const categoria = filtroCategoria ? filtroCategoria.value : '';
  const achouNome = item.produto.toLowerCase().includes(termo);
  const achouCategoria = categoria === '' || item.categoria === categoria;
  return achouNome && achouCategoria;
}

/* [AULA 12] Redesenha o resumo a partir do array catalogo e dos filtros atuais */
function atualizarResumo() {
  if (catalogo.length === 0) return;

  const exibidos = catalogo.filter(produtoPassaNoFiltro).length;
  const totalReceita = catalogo.reduce((soma, item) => soma + receitaDoProduto(item), 0);
  const melhorItem = catalogo.reduce((melhor, atual) =>
    receitaDoProduto(atual) > receitaDoProduto(melhor) ? atual : melhor
  );

  const linhas = [
    ['Produtos no catálogo', String(catalogo.length)],
    ['Exibidos agora', String(exibidos)],
    ['Receita estimada total', formatarMoeda(totalReceita)],
    ['Maior receita', `${melhorItem.produto} (${formatarMoeda(receitaDoProduto(melhorItem))})`]
  ];

  listaResumo.replaceChildren(
    ...linhas.map(([rotulo, valor]) => {
      const li = document.createElement('li');
      li.textContent = `${rotulo}: ${valor}`;
      return li;
    })
  );
}

/* [AULA 12] Aplica ou remove hidden nos cards sem recriá-los e atualiza contador/resumo */
function filtrarCards() {
  if (!grade) return;

  let visiveis = 0;
  for (const card of grade.children) {
    const passa = produtoPassaNoFiltro(lerProdutoDoCard(card));
    card.hidden = !passa;
    if (passa) visiveis += 1;
  }

  if (contadorExibidos) {
    contadorExibidos.textContent =
      visiveis === 1 ? '1 produto exibido' : `${visiveis} produtos exibidos`;
  }

  atualizarResumo();
}

/* [AULA 12] Atualiza o Set de favoritos, o aria-pressed do botão e o resumo */
function alternarFavorito(botao) {
  const card = botao.closest('.card-produto');
  if (!card) return;

  const nomeProduto = card.dataset.produto;
  const marcado = !favoritos.has(nomeProduto);

  if (marcado) {
    favoritos.add(nomeProduto);
  } else {
    favoritos.delete(nomeProduto);
  }

  botao.setAttribute('aria-pressed', String(marcado));
  atualizarResumo();
}

/* [AULA 12] Delegação de evento na grade usando closest e dataset */
function aoClicarNaGrade(evento) {
  const botao = evento.target.closest('.botao-favoritar');
  if (botao && grade && grade.contains(botao)) {
    alternarFavorito(botao);
  }
}

/* [AULA 12] Adiciona próximo item da fila ao catálogo e ao DOM */
function adicionarProximoProduto() {
  if (!grade) return;

  const proximo = filaNovosProdutos.shift();
  if (!proximo) return;

  catalogo.push(proximo);
  grade.append(criarCardProduto(proximo));

  if (filaNovosProdutos.length === 0 && botaoAdicionar) {
    botaoAdicionar.disabled = true;
  }

  filtrarCards();
}

/* [AULA 12] Alterna menu mobile e atualiza aria-expanded e aria-label */
function alternarMenu() {
  if (!menuPrincipal || !botaoMenu) return;

  const aberto = menuPrincipal.classList.toggle('aberto');
  botaoMenu.setAttribute('aria-expanded', String(aberto));
  botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
}

/* [AULA 12] Fecha menu ao pressionar Escape e devolve o foco ao botão */
function fecharMenuComEscape(evento) {
  if (
    evento.key === 'Escape' &&
    menuPrincipal &&
    botaoMenu &&
    menuPrincipal.classList.contains('aberto')
  ) {
    alternarMenu();
    botaoMenu.focus();
  }
}

/* [AULA 12] Demonstra ordem: código síncrono, microtarefa (Promise) e tarefa (setTimeout) */
function mostrarOrdemDeExecucao() {
  if (!saidaOrdem) return;

  const registro = [];
  registro.push('1. código síncrono');

  setTimeout(() => {
    registro.push('4. setTimeout (tarefa)');
    saidaOrdem.textContent = registro.join(' | ');
  }, 0);

  Promise.resolve().then(() => {
    registro.push('3. promessa (microtarefa)');
  });

  registro.push('2. fim do código síncrono');
}

/* [AULA 12] Demonstra bloqueio da pilha principal com espera ocupada por 3 segundos */
function travarPagina() {
  if (!saidaOrdem) return;

  saidaOrdem.textContent = 'Travando por 3 segundos...';
  const limite = Date.now() + 3000;
  while (Date.now() < limite) {
    // Mantém a execução ocupada até o fim da janela de 3 segundos
  }
  saidaOrdem.textContent = 'Pronto: a pilha esvaziou e a página voltou.';
}

/* [AULA 12] Funções iniciar...() para organizar os registros de eventos */
function iniciarMenu() {
  if (botaoMenu) {
    botaoMenu.addEventListener('click', alternarMenu);
  }
  document.addEventListener('keydown', fecharMenuComEscape);
}

function iniciarCatalogoEInteracoes() {
  if (grade) {
    grade.querySelectorAll('.card-produto').forEach((card) => {
      exibirDesempenho(card);
      adicionarBotaoFavorito(card);
      catalogo.push(lerProdutoDoCard(card));
    });
    grade.addEventListener('click', aoClicarNaGrade);
  }

  if (botaoAdicionar) {
    botaoAdicionar.addEventListener('click', adicionarProximoProduto);
  }
}

function iniciarFiltro() {
  if (campoBusca) {
    campoBusca.addEventListener('input', filtrarCards);
  }
  if (filtroCategoria) {
    filtroCategoria.addEventListener('change', filtrarCards);
  }
}

function iniciarDemonstracaoEventLoop() {
  if (botaoOrdem) {
    botaoOrdem.addEventListener('click', mostrarOrdemDeExecucao);
  }
  if (botaoTravar) {
    botaoTravar.addEventListener('click', travarPagina);
  }
}

/* [AULA 12] Inicialização dos ouvintes e primeira renderização do contador/resumo */
iniciarMenu();
iniciarCatalogoEInteracoes();
iniciarFiltro();
iniciarDemonstracaoEventLoop();
filtrarCards();
