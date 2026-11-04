
// ========================================
// HELP BICICLETAS
// Controle principal da loja
// ========================================

// Atualiza o contador de produtos no cabeçalho
function atualizarContadorCarrinho() {
  const contador = document.getElementById(
    "contador-carrinho"
  );

  if (contador) {
    contador.textContent = obterQuantidadeTotal();
  }
}

// Adiciona produto e atualiza o contador
function adicionarProduto(idProduto) {
  const sucesso = adicionarAoCarrinho(idProduto);

  if (sucesso) {
    atualizarContadorCarrinho();
    console.log("Produto adicionado ao carrinho!");
  }
}

// Prepara os botões de adicionar ao carrinho
function prepararBotoesProdutos() {
  const botoes = document.querySelectorAll(
    "[data-adicionar-carrinho]"
  );

  botoes.forEach(botao => {
    botao.addEventListener("click", () => {
      const idProduto = botao.dataset.adicionarCarrinho;
      adicionarProduto(idProduto);
    });
  });
}

// Inicializa as funções da loja
function iniciarLoja() {
  atualizarContadorCarrinho();
  prepararBotoesProdutos();
}

// Aguarda o carregamento do HTML
document.addEventListener("DOMContentLoaded", iniciarLoja);
