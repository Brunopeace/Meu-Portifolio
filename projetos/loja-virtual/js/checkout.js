document.addEventListener("DOMContentLoaded", () => {
    const listaCheckout = document.getElementById("lista-checkout");
    const totalElement = document.getElementById("total");
    const btnPix = document.getElementById("btnPix");
    const pixContainer = document.getElementById("pixContainer");
    const btnWhatsApp = document.getElementById("btnWhatsApp");

    // Recupera o carrinho do localStorage
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    function carregarCheckout() {
        listaCheckout.innerHTML = "";
        let total = 0;

        if (carrinho.length === 0) {
            listaCheckout.innerHTML = "<p>Seu carrinho está vazio.</p>";
            totalElement.innerText = "R$ 0,00";
            return;
        }

        carrinho.forEach(produto => {
            let item = document.createElement("li");
            item.innerHTML = `
<img src="${produto.imagem}" alt="${produto.nome}" style="width: 50px; vertical-align: middle;">
${produto.nome} - R$ ${(produto.preco * produto.quantidade).toFixed(2)}
                (Quantidade: ${produto.quantidade})
            `;
            listaCheckout.appendChild(item);
            total += produto.preco * produto.quantidade;
        });

        totalElement.innerText = `R$ ${total.toFixed(2)}`;
    }

    // Mostra o QR Code para pagamento via PIX e exibe o botão do WhatsApp
    if (btnPix && pixContainer && btnWhatsApp) {
        btnPix.addEventListener("click", () => {
            pixContainer.style.display = "block"; // Exibe o QR Code
            btnWhatsApp.style.display = "flex"; // Exibe o botão do WhatsApp
        });
    }
    
    // Enviar comprovante via WhatsApp com a descrição dos produtos
    if (btnWhatsApp) {
        btnWhatsApp.addEventListener("click", () => {
            let numeroWhatsApp = "5581982258462"; // Seu número de WhatsApp com DDD
            let mensagem = "*Segue o comprovante do pagamento, referente ao pedido*:\n\n";

            let total = 0;

            carrinho.forEach(produto => {
                let subtotal = produto.preco * produto.quantidade;
                mensagem += `${produto.nome} - R$ ${subtotal.toFixed(2)} (Qtd: ${produto.quantidade})\n`;
                total += subtotal;
            });

            mensagem += `\n *Total: R$ ${total.toFixed(2)}*`;

            let urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

            window.open(urlWhatsApp, "_blank");
        });

        // Inicialmente oculta o botão de comprovante
        btnWhatsApp.style.display = "none";
    }

    // Carrega os dados do carrinho ao carregar a página
    carregarCheckout();
});
