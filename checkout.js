
// ========================================
// HELP BICICLETAS
// Finalização do pedido pelo WhatsApp
// ========================================

const WHATSAPP_LOJA = "5531989683113";

function renderizarResumoCheckout() {
  const listaItens = document.getElementById("checkout-itens");
  const totalElemento = document.getElementById("checkout-total");

  if (!listaItens || !totalElemento) return;

  const itens = obterCarrinho();

  if (itens.length === 0) {
    listaItens.innerHTML = "<p>Seu carrinho está vazio.</p>";
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

function escaparTexto(texto) {
  return String(texto ?? "").replace(/[&<>"']/g, caractere => {
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
      mensagem.textContent = "Seu carrinho está vazio. Volte à loja e adicione produtos.";
      return;
    }

    if (!formulario.reportValidity()) return;

    const dados = new FormData(formulario);

    const pagamento = {
      pix: "Pix",
      cartao: "Cartão de crédito",
      combinar: "Combinar com a loja"
    }[dados.get("pagamento")] || "A combinar";

    const linhasProdutos = itens.map(item => {
      const subtotal = item.preco * item.quantidade;

      return `• ${item.nome} | Qtd: ${item.quantidade} | Unitário: ${formatarPreco(item.preco)} | Subtotal: ${formatarPreco(subtotal)}`;
    });

    const endereco = [
      dados.get("rua"),
      dados.get("bairro"),
      dados.get("cidade"),
      "CEP " + dados.get("cep")
    ].filter(Boolean).join(", ");

    const texto = [
      "Olá! Gostaria de fazer este pedido na HELP BICICLETAS:",
      "",
      ...linhasProdutos,
      "",
      `TOTAL DOS PRODUTOS: ${formatarPreco(calcularTotal())}`,
      "",
      "DADOS DO CLIENTE",
      `Nome: ${dados.get("nome")}`,
      `E-mail: ${dados.get("email")}`,
      `WhatsApp: ${dados.get("telefone")}`,
      `Endereço: ${endereco}`,
      `Forma de pagamento preferida: ${pagamento}`,
      "",
      "Por favor, confirme a disponibilidade, o frete e o valor final. Obrigado!"
    ].join("\n");

    const url = `https://wa.me/${WHATSAPP_LOJA}?text=${encodeURIComponent(texto)}`;

    mensagem.style.display = "block";
    mensagem.textContent = "Abrindo o WhatsApp para você revisar e enviar o pedido...";

    window.location.href = url;
  });
}

document.addEventListener("DOMContentLoaded", function() {
  prepararCheckout();
});
