
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

// Adiciona produto e atualiza a tela
function adicionarProduto(idProduto) {
  const sucesso = adicionarAoCarrinho(idProduto);

  if (sucesso) {
    atualizarContadorCarrinho();
    renderizarCarrinho();
    console.log("Produto adicionado ao carrinho!");
  }
}

// Evita interpretar dados dos produtos como HTML
function escaparHTML(valor) {
  return String(valor).replace(/[&<>"']/g, caractere => {
    const entidades = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return entidades[caractere];
  });
}

// Mostra os produtos salvos no carrinho
function renderizarCarrinho() {
  const lista = document.getElementById("lista-carrinho");
  const subtotalElemento = document.getElementById(
    "subtotal-carrinho"
  );
  const totalElemento = document.getElementById(
    "total-carrinho"
  );

  if (!lista) return;

  const itens = obterCarrinho();

  if (itens.length === 0) {
    lista.innerHTML = `
      <div class="cart-empty">
        <p>Seu carrinho está vazio.</p>
        <a href="#produtos" class="button">
          CONTINUAR COMPRANDO
        </a>
      </div>
    `;
  } else {
    lista.innerHTML = itens.map(item => `
      <div class="cart-item">
        <img
          src="${escaparHTML(item.imagem)}"
          alt="${escaparHTML(item.nome)}"
          class="cart-item-image"
        >

        <div class="cart-item-info">
          <h3>${escaparHTML(item.nome)}</h3>

          <p>
            ${formatarPreco(item.preco)} por unidade
          </p>

          <div class="cart-item-controls">
            <button
              type="button"
              data-diminuir="${item.id}"
              aria-label="Diminuir quantidade"
            >−</button>

            <span>${item.quantidade}</span>

            <button
              type="button"
              data-aumentar="${item.id}"
              aria-label="Aumentar quantidade"
            >+</button>
          </div>
        </div>

        <div class="cart-item-actions">
          <strong>
            ${formatarPreco(item.preco * item.quantidade)}
          </strong>

          <button
            type="button"
            class="cart-remove"
            data-remover="${item.id}"
          >
            REMOVER
          </button>
        </div>
      </div>
    `).join("");
  }

  const subtotal = calcularSubtotal();

  if (subtotalElemento) {
    subtotalElemento.textContent = formatarPreco(subtotal);
  }

  if (totalElemento) {
    totalElemento.textContent = formatarPreco(calcularTotal());
  }

  atualizarContadorCarrinho();
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

// Controla os botões de quantidade e remoção
function prepararControlesCarrinho() {
  const lista = document.getElementById("lista-carrinho");

  if (!lista) return;

  lista.addEventListener("click", evento => {
    const botao = evento.target.closest("button");

    if (!botao) return;

    if (botao.dataset.aumentar) {
      const item = obterCarrinho().find(
        produto => produto.id === Number(botao.dataset.aumentar)
      );

      if (item) {
        alterarQuantidade(item.id, item.quantidade + 1);
      }
    }

    if (botao.dataset.diminuir) {
      const item = obterCarrinho().find(
        produto => produto.id === Number(botao.dataset.diminuir)
      );

      if (item) {
        alterarQuantidade(item.id, item.quantidade - 1);
      }
    }

    if (botao.dataset.remover) {
      removerDoCarrinho(botao.dataset.remover);
    }

    renderizarCarrinho();
  });
}

// Inicializa as funções da loja
function iniciarLoja() {
  prepararBotoesProdutos();
  prepararControlesCarrinho();
  renderizarCarrinho();
}

// Aguarda o carregamento do HTML
document.addEventListener("DOMContentLoaded", iniciarLoja);
