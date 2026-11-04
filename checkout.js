
// ========================================
// HELP BICICLETAS
// Sistema de finalização do pedido
// ========================================

// Exibe os produtos e valores do carrinho
function renderizarResumoCheckout() {
  const listaItens = document.getElementById("checkout-itens");
  const totalElemento = document.getElementById("checkout-total");

  if (!listaItens || !totalElemento) return;

  const itens = obterCarrinho();

  if (itens.length === 0) {
    listaItens.innerHTML = `
      <p>Seu carrinho está vazio.</p>
    `;

    totalElemento.textContent = formatarPreco(0);
    return;
  }

  listaItens.innerHTML = itens.map(item => {
    const subtotal = item.preco * item.quantidade;

    return `
      <div class="checkout-item">
        <div class="checkout-item-name">
          <strong>${escaparTexto(item.nome)}</strong>
          <br>
          Quantidade: ${item.quantidade}
        </div>

        <div class="checkout-item-price">
          ${formatarPreco(subtotal)}
        </div>
      </div>
    `;
  }).join("");

  totalElemento.textContent = formatarPreco(calcularTotal());
}

// Protege textos exibidos na página
function escaparTexto(texto) {
  return String(texto).replace(/[&<>"']/g, caractere => {
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

// Prepara o formulário
function prepararCheckout() {
  const formulario = document.getElementById("checkout-form");
  const mensagem = document.getElementById("checkout-message");
  const botao = document.getElementById("confirmar-pedido");

  if (!formulario || !mensagem || !botao) return;

  renderizarResumoCheckout();

  formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const itens = obterCarrinho();

    if (itens.length === 0) {
      mensagem.style.display = "block";
      mensagem.textContent = "Adicione produtos ao carrinho antes de continuar.";
      return;
    }

    if (!formulario.reportValidity()) return;

    const dadosCliente = new FormData(formulario);

    const pedido = {
      cliente: {
        nome: dadosCliente.get("nome"),
        email: dadosCliente.get("email"),
        telefone: dadosCliente.get("telefone"),
        cep: dadosCliente.get("cep"),
        rua: dadosCliente.get("rua"),
        bairro: dadosCliente.get("bairro"),
        cidade: dadosCliente.get("cidade")
      },
      pagamento: dadosCliente.get("pagamento"),
      itens: obterCarrinho(),
      total: calcularTotal()
    };

    console.log("Pedido preparado:", pedido);

    mensagem.style.display = "block";
    mensagem.textContent =
      "Dados validados! O pedido ainda não foi enviado e nenhum pagamento foi realizado.";
  });
}

// Inicialização
document.addEventListener("DOMContentLoaded", function() {
  prepararCheckout();
});
