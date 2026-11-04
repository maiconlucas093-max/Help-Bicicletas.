// ========================================
// HELP BICICLETAS
// Controle principal da loja integrado ao Supabase
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
  return String(valor ?? "").replace(/[&<>"']/g, caractere => {
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

// Mostra os produtos recebidos do Supabase
function renderizarProdutos() {
  const lista = document.getElementById("lista-produtos");
  
  if (!lista) return;
  
  if (!produtos || produtos.length === 0) {
    lista.innerHTML = `
      <p class="product-loading">
        Nenhum produto disponível no momento.
      </p>
    `;
    return;
  }
  
  lista.innerHTML = produtos.map(produto => {
    const imagem = produto.imagem ?
      `
        <img
          src="${escaparHTML(produto.imagem)}"
          alt="${escaparHTML(produto.nome)}"
          loading="lazy"
        >
      ` :
      `
        <div class="product-loading">
          Imagem indisponível
        </div>
      `;
    
    return `
      <article class="product-card">
        <div class="product-image">
          ${imagem}
        </div>

        <div class="product-info">
          <small>${escaparHTML(produto.categoria).toUpperCase()}</small>

          <h3>${escaparHTML(produto.nome)}</h3>

          <p class="product-price">
            ${formatarPreco(produto.preco)}
          </p>

          <button
            type="button"
            class="product-button"
            data-adicionar-carrinho="${escaparHTML(produto.id)}"
          >
            ADICIONAR AO CARRINHO
          </button>
        </div>
      </article>
    `;
  }).join("");
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
              data-diminuir="${escaparHTML(item.id)}"
              aria-label="Diminuir quantidade"
            >−</button>

            <span>${item.quantidade}</span>

            <button
              type="button"
              data-aumentar="${escaparHTML(item.id)}"
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
            data-remover="${escaparHTML(item.id)}"
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

// Prepara os botões dinâmicos dos produtos
function prepararBotoesProdutos() {
  const lista = document.getElementById("lista-produtos");
  
  if (!lista) return;
  
  lista.addEventListener("click", evento => {
    const botao = evento.target.closest(
      "[data-adicionar-carrinho]"
    );
    
    if (!botao || !lista.contains(botao)) return;
    
    const idProduto = botao.dataset.adicionarCarrinho;
    
    adicionarProduto(idProduto);
  });
}

// Controla os botões de quantidade e remoção
function prepararControlesCarrinho() {
  const lista = document.getElementById("lista-carrinho");
  
  if (!lista) return;
  
  lista.addEventListener("click", evento => {
    const botao = evento.target.closest("button");
    
    if (!botao) return;
    
    if (botao.dataset.aumentar !== undefined) {
      const item = obterCarrinho().find(
        produto =>
        String(produto.id) === String(botao.dataset.aumentar)
      );
      
      if (item) {
        alterarQuantidade(item.id, item.quantidade + 1);
      }
    }
    
    if (botao.dataset.diminuir !== undefined) {
      const item = obterCarrinho().find(
        produto =>
        String(produto.id) === String(botao.dataset.diminuir)
      );
      
      if (item) {
        alterarQuantidade(item.id, item.quantidade - 1);
      }
    }
    
    if (botao.dataset.remover !== undefined) {
      removerDoCarrinho(botao.dataset.remover);
    }
    
    renderizarCarrinho();
  });
}

// Prepara o botão de finalizar compra
function prepararBotaoFinalizarCompra() {
  const botao = document.getElementById("finalizar-compra");
  
  if (!botao) return;
  
  botao.addEventListener("click", function() {
    if (obterCarrinho().length === 0) {
      alert(
        "Seu carrinho está vazio. Adicione um produto antes de continuar."
      );
      return;
    }
    
    window.location.href = "checkout.html";
  });
}

// Inicializa as funções da loja
async function iniciarLoja() {
  prepararBotoesProdutos();
  prepararControlesCarrinho();
  prepararBotaoFinalizarCompra();
  
  renderizarCarrinho();
  
  const lista = document.getElementById("lista-produtos");
  
  try {
    await carregarProdutos();
    renderizarProdutos();
    
  } catch (erro) {
    console.error("Erro ao iniciar catálogo:", erro);
    
    if (lista) {
      lista.innerHTML = `
        <p class="product-loading">
          Não foi possível carregar os produtos.
          Tente atualizar a página.
        </p>
      `;
    }
  }
}

// Aguarda o carregamento do HTML
document.addEventListener("DOMContentLoaded", iniciarLoja);