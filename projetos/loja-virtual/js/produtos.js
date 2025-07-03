document.addEventListener("DOMContentLoaded", () => {
    const cartCount = document.getElementById("cart-count");
    const produtosContainer = document.getElementById("produtos-container");
    const pesquisaInput = document.getElementById("pesquisa");

    // Lista de produtos disponíveis
    const produtos = [
    { id: 1, nome: "Fone Bluetooth", preco: 199.90, imagem: "../img/fone.jpeg", descricao: "Fone de ouvido sem fio com alta qualidade de som e bateria duradoura." },
    { id: 2, nome: "Notebook Gamer", preco: 4599.90, imagem: "../img/notebook.jpeg", descricao: "Notebook potente para jogos, com placa de vídeo dedicada e tela Full HD." },
    { id: 3, nome: "Mouse Gamer", preco: 149.90, imagem: "../img/mousegamer.jpeg", descricao: "Mouse ergonômico com iluminação RGB e alta precisão." },
    { id: 4, nome: "Celular smartphone x", preco: 199.90, imagem: "../img/smartphone.jpeg", descricao: "Smartphone com câmera de alta resolução e ótimo desempenho." },
    { id: 5, nome: "Smart watch", preco: 4599.90, imagem: "../img/smartwatch.jpeg", descricao: "Relógio inteligente com monitoramento de saúde e integração com smartphone." },
    { id: 6, nome: "Smartwatch original", preco: 149.90, imagem: "../img/smartwatch2.jpeg", descricao: "Modelo premium com diversas funcionalidades para o seu dia a dia." }
];

    function atualizarCarrinho() {
        let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
        
        // Conta a quantidade total de itens no carrinho
        let totalItens = carrinho.reduce((acc, produto) => acc + produto.quantidade, 0);

        if (cartCount) {
            cartCount.innerText = totalItens;
        }
    }

    function adicionarAoCarrinho(produto) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    // Verifica se o produto já está no carrinho
    let itemExistente = carrinho.find(item => item.id === produto.id);

    if (itemExistente) {
        itemExistente.quantidade++; // Aumenta a quantidade
    } else {
        produto.quantidade = 1; // Se for novo, define quantidade 1
        carrinho.push(produto);
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    atualizarCarrinho();
    exibirNotificacao(produto);
}

// Função para exibir a notificação estilizada
function exibirNotificacao(produto) {
    let notificacao = document.createElement("div");
    notificacao.classList.add("notificacao-carrinho");
    notificacao.innerHTML = `
        <img src="${produto.imagem}" alt="${produto.nome}" class="notificacao-img">
        <div>
            <strong>${produto.nome}</strong> adicionado ao carrinho!
        </div>
    `;

    document.body.appendChild(notificacao);

    // Remove a notificação após 3 segundos
    setTimeout(() => {
        notificacao.classList.add("fade-out");
        setTimeout(() => notificacao.remove(), 500);
    }, 3000);
}





















    function carregarProdutos(filtro = "") {
    produtosContainer.innerHTML = ""; // Limpa a lista antes de carregar

    let produtosFiltrados = produtos.filter(produto => 
        produto.nome.toLowerCase().includes(filtro.toLowerCase())
    );

    produtosFiltrados.forEach(produto => {
        let produtoDiv = document.createElement("div");
        produtoDiv.classList.add("produto");
        produtoDiv.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <p class="descricao">${produto.descricao}</p> <!-- Adicionando a descrição -->
            <p class="preco">R$ ${produto.preco.toFixed(2)}</p>
            <button class="adicionar-carrinho" data-id="${produto.id}">Adicionar ao Carrinho</button>
        `;
        produtosContainer.appendChild(produtoDiv);
    });

    // Adiciona evento aos botões "Adicionar ao Carrinho"
    document.querySelectorAll(".adicionar-carrinho").forEach(botao => {
        botao.addEventListener("click", (e) => {
            let id = parseInt(e.target.getAttribute("data-id"));
            let produtoSelecionado = produtos.find(p => p.id === id);
            if (produtoSelecionado) {
                adicionarAoCarrinho(produtoSelecionado);
            }
        });
    });
}

    // Evento de pesquisa
    pesquisaInput.addEventListener("input", (e) => {
        carregarProdutos(e.target.value);
    });

    carregarProdutos(); // Carrega os produtos ao iniciar a página
    atualizarCarrinho(); // Atualiza o carrinho ao carregar a página
});