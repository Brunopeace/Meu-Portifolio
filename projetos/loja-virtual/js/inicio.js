// Lista de produtos disponíveis na loja
const produtos = [
    { id: 2, nome: "Notebook Gamer", preco: 4599.90, imagem: "./img/notebook.jpeg", descricao: "Notebook potente para jogos, com placa de vídeo dedicada e tela Full HD." },
    { id: 3, nome: "Mouse Gamer", preco: 149.90, imagem: "./img/mousegamer.jpeg", descricao: "Mouse ergonômico com iluminação RGB e alta precisão." },
    { id: 5, nome: "Smart watch", preco: 4599.90, imagem: "./img/smartwatch.jpeg", descricao: "Relógio inteligente com monitoramento de saúde e integração com smartphone." }
];

// Atualiza a página ao carregar
document.addEventListener("DOMContentLoaded", () => {
    carregarProdutos();
    atualizarCarrinho();
});

// Função para carregar produtos na página
function carregarProdutos() {
    let container = document.getElementById("destaques");

    if (!container) {
        console.error("Erro: Elemento #destaques não encontrado.");
        return;
    }

    container.innerHTML = "<h2>Produtos mais vendidos</h2>";

    produtos.forEach(produto => {
        let produtoHTML = `
            <div class="produto">
                <img src="${produto.imagem}" alt="${produto.nome}">
                <h3>${produto.nome}</h3>
                <p class="descricao-produto">${produto.descricao}</p>
                <p>R$ ${produto.preco.toFixed(2)}</p>                
                <button class="adicionar-carrinho" data-id="${produto.id}">Adicionar ao Carrinho</button>
            </div>
        `;
        container.innerHTML += produtoHTML;
    });

    adicionarEventosBotoes();
}

// Função para adicionar eventos aos botões
function adicionarEventosBotoes() {
    document.querySelectorAll(".adicionar-carrinho").forEach(botao => {
        botao.addEventListener("click", (event) => {
            let idProduto = event.target.getAttribute("data-id");

            if (!idProduto) {
                console.error("Erro: Botão sem data-id.");
                return;
            }

            let produto = produtos.find(p => p.id == idProduto);

            if (produto) {
                adicionarAoCarrinho(produto);
            } else {
                console.error("Erro: Produto não encontrado para o ID:", idProduto);
            }
        });
    });
}

// Função para adicionar produto ao carrinho
function adicionarAoCarrinho(produto) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    let itemExistente = carrinho.find(item => item.id === produto.id);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        let novoProduto = {
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem.replace("./", "../"), // Ajusta o caminho
            quantidade: 1
        };
        carrinho.push(novoProduto);
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    atualizarCarrinho();
    exibirNotificacao(produto);
}

// Função para atualizar o contador do carrinho
function atualizarCarrinho() {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    let cartCount = document.getElementById("cart-count");

    if (cartCount) {
        let quantidadeTotal = carrinho.reduce((acc, produto) => acc + produto.quantidade, 0);
        cartCount.innerText = quantidadeTotal;
    } else {
        console.warn("Elemento #cart-count não encontrado.");
    }
}

function toggleChat() {
        let chatBox = document.getElementById("whatsapp-chat");
        chatBox.style.display = (chatBox.style.display === "block") ? "none" : "block";
    }

    function enviarWhatsApp() {
        let numero = "5581982258462";
        let mensagem = document.getElementById("chat-message").value;

        if (mensagem.trim() !== "") {
            let url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
            window.open(url, "_blank");
        } else {
            alert("Digite uma mensagem antes de enviar!");
        }
    }

// Função para exibir notificação ao adicionar produto ao carrinho
function exibirNotificacao(produto) {
    let notificacao = document.createElement("div");
    notificacao.classList.add("notificacao-carrinho");

    notificacao.innerHTML = `
        <img src="${produto.imagem}" alt="${produto.nome}" class="notificacao-img">
        <div>
            <strong>${produto.nome}</strong> foi adicionado ao carrinho!
        </div>
    `;

    document.body.appendChild(notificacao);

    setTimeout(() => {
        notificacao.classList.add("fade-out");
        setTimeout(() => notificacao.remove(), 500);
    }, 3000);
}