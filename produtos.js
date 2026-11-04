
// ========================================
// HELP BICICLETAS
// Catálogo de produtos integrado ao Supabase
// ========================================

let produtos = [];

// Busca os produtos ativos no banco de dados
async function carregarProdutos() {
  try {
    if (!window.helpSupabase) {
      throw new Error(
        "Conexão com o Supabase não encontrada."
      );
    }

    const { data, error } = await window.helpSupabase
      .from("produtos")
      .select(
        "id, nome, descricao, categoria, preco_centavos, imagem_url, estoque"
      )
      .eq("ativo", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    produtos = (data || []).map(produto => ({
      id: produto.id,
      nome: produto.nome,
      descricao: produto.descricao || "",
      categoria: produto.categoria || "geral",
      preco: produto.preco_centavos,
      imagem: produto.imagem_url || "",
      estoque: produto.estoque
    }));

    console.info(
      "HELP BICICLETAS: produtos carregados:",
      produtos.length
    );

    return produtos;

  } catch (erro) {
    console.error(
      "Erro ao carregar produtos do Supabase:",
      erro
    );

    produtos = [];

    return produtos;
  }
}
