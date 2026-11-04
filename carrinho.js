
// ========================================
// HELP BICICLETAS
// Sistema inicial do carrinho
// ========================================

const CHAVE_CARRINHO = "help_bicicletas_carrinho";

let carrinho = carregarCarrinho();

// Carrega os itens salvos no navegador
function carregarCarrinho() {
  try {
    const dados = localStorage.getItem(CHAVE_CARRINHO);
    return dados ? JSON.parse(dados) : [];
  } catch (erro) {
    console.error("Erro ao carregar carrinho:", erro);
    return [];
  }
}

// Salva o carrinho no navegador
function salvarCarrinho() {
  localStorage.setItem(
    CHAVE_CARRINHO,
    JSON.stringify(carrinho)
  );
}

// Adiciona um produto
function adicionarAoCarrinho(idProduto) {
  const produto = produtos.find(
    item => item.id === Number(idProduto)
  );

  if (!produto) {
    console.error("Produto não encontrado.");
    return false;
  }

  const itemExistente = carrinho.find(
    item => item.id === produto.id
  );

  if (itemExistente) {
    itemExistente.quantidade++;
  } else {
    carrinho.push({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      imagem: produto.imagem,
      quantidade: 1
    });
  }

  salvarCarrinho();
  return true;
}

// Remove um produto do carrinho
function removerDoCarrinho(idProduto) {
  carrinho = carrinho.filter(
    item => item.id !== Number(idProduto)
  );

  salvarCarrinho();
}

// Altera a quantidade de um produto
function alterarQuantidade(idProduto, quantidade) {
  const item = carrinho.find(
    produto => produto.id === Number(idProduto)
  );

  if (!item) return;

  const novaQuantidade = Number(quantidade);

  if (!Number.isInteger(novaQuantidade) || novaQuantidade <= 0) {
    removerDoCarrinho(idProduto);
    return;
  }

  item.quantidade = novaQuantidade;
  salvarCarrinho();
}

// Retorna os produtos do carrinho
function obterCarrinho() {
  return carrinho;
}

// Calcula a quantidade total de unidades
function obterQuantidadeTotal() {
  return carrinho.reduce(
    (total, item) => total + item.quantidade,
    0
  );
}

// Calcula o subtotal em centavos
function calcularSubtotal() {
  return carrinho.reduce(
    (total, item) => total + item.preco * item.quantidade,
    0
  );
}

// Calcula o total em centavos
function calcularTotal() {
  return calcularSubtotal();
}

// Limpa todo o carrinho
function limparCarrinho() {
  carrinho = [];
  salvarCarrinho();
}

// Formata valores para reais
function formatarPreco(valorEmCentavos) {
  return (valorEmCentavos / 100).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL"
    }
  );
}
