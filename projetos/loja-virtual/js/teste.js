document.addEventListener("DOMContentLoaded", () => {
    const listaCarrinho = document.getElementById("lista-carrinho");
    const totalElement = document.getElementById("total");
    const cartCount = document.getElementById("cart-count"); // Contador do carrinho
    const btnFinalizarCompra = document.getElementById("finalizarCompra");

    // Recupera o carrinho do localStorage
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    // Função para agrupar produtos iguais e contar quantidades
    function agruparCarrinho() {
        let carrinhoAgrupado = {};
        carrinho.forEach(produto => {
            if (carrinhoAgrupado[produto.id]) {
                carrinhoAgrupado[produto.id].quantidade += produto.quantidade || 1;
            } else {
                carrinhoAgrupado[produto.id] = { ...produto, quantidade: produto.quantidade || 1 };
            }
        });
        return Object.values(carrinhoAgrupado);
    }

    // Função para atualizar o carrinho na tela
    function carregarCarrinho() {
    listaCarrinho.innerHTML = "";
    let total = 0;
    let quantidadeTotal = 0;

    if (carrinho.length === 0) {
        listaCarrinho.innerHTML = "<p>Seu carrinho está vazio.</p>";
        totalElement.innerText = "R$ 0,00";
        cartCount.innerText = "0"; // Atualiza o contador do carrinho
        return;
    }

    let carrinhoAgrupado = agruparCarrinho();

    carrinhoAgrupado.forEach(produto => {
        let item = document.createElement("li");
        item.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}" style="width: 50px; vertical-align: middle;">
            ${produto.nome} - R$ ${(produto.preco * produto.quantidade).toFixed(2)} 
            (Quantidade: ${produto.quantidade})
            <button onclick="diminuirQuantidade(${produto.id})">➖</button>
            <button onclick="aumentarQuantidade(${produto.id})">➕</button>
            <button onclick="removerItem(${produto.id})">Excluir</button>
        `;
        listaCarrinho.appendChild(item);
        total += produto.preco * produto.quantidade;
        quantidadeTotal += produto.quantidade;
    });

    totalElement.innerText = `Total (${quantidadeTotal} itens): R$ ${total.toFixed(2)}`;
    cartCount.innerText = quantidadeTotal; // Atualiza o contador do carrinho
}

    // Função para diminuir a quantidade do item
    window.diminuirQuantidade = (id) => {
        let index = carrinho.findIndex(produto => produto.id === id);
        if (index !== -1) {
            if (carrinho[index].quantidade > 1) {
                carrinho[index].quantidade--;
            } else {
                carrinho.splice(index, 1);
            }
            localStorage.setItem("carrinho", JSON.stringify(carrinho));
            carregarCarrinho();
        }
    };

    // Função para aumentar a quantidade do item
    window.aumentarQuantidade = (id) => {
        let index = carrinho.findIndex(produto => produto.id === id);
        if (index !== -1) {
            carrinho[index].quantidade++;
            localStorage.setItem("carrinho", JSON.stringify(carrinho));
            carregarCarrinho();
        }
    };

    // Função para remover um item completamente
    window.removerItem = (id) => {
        carrinho = carrinho.filter(produto => produto.id !== id);
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        carregarCarrinho();
    };

    // Evento de clique para finalizar compra
    btnFinalizarCompra.addEventListener("click", () => {
        if (carrinho.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }
        window.location.href = "../checkout/checkout.html";
    });

    carregarCarrinho();
});