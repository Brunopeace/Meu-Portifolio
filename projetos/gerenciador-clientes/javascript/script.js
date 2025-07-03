if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('service-worker.js').then(function(registration) {
        console.log('Service Worker registrado com sucesso:', registration);
      }, function(err) {
        console.log('Falha ao registrar o Service Worker:', err);
      });
    });
  }


/* código para instalar o aplicativo */

  let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Criar um botão ou outro elemento na interface para o usuário instalar
    const installButton = document.createElement('button');
    installButton.innerText = 'Instalar App';
    installButton.style.position = 'fixed';
    installButton.style.bottom = '10px';
    installButton.style.right = '10px';
    document.body.appendChild(installButton);

    installButton.addEventListener('click', () => {
        deferredPrompt.prompt(); // Mostra o prompt de instalação

        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Usuário aceitou instalar o app');
            } else {
                console.log('Usuário rejeitou instalar o app');
            }
            deferredPrompt = null; // Limpa o prompt armazenado
            installButton.remove(); // Remove o botão da interface
        });
    });
});

// Opcional: Remover o botão após um tempo se o usuário não interagir
setTimeout(() => {
    if (deferredPrompt && installButton) {
        installButton.remove();
        console.log('Botão de instalação removido por inatividade.');
    }
}, 15000); // Remove o botão após 15 segundos

document.addEventListener("DOMContentLoaded", () => {
    const loading = document.getElementById("loading");

    // Verifica se a sessão já foi iniciada
    const hasVisited = sessionStorage.getItem("hasVisited");

    if (!hasVisited) {
        // Mostra o loader e salva a sessão como visitada
        sessionStorage.setItem("hasVisited", "true");
        setTimeout(() => {
            loading.style.display = "none";
        }, 3000); // Tempo de exibição do loader (3 segundos)
    } else {
        // Esconde o loader se a sessão já foi iniciada
        loading.style.display = "none";
    }
});

// Mostra o botão quando o usuário rola 20px para baixo
window.onscroll = function() {
    const backToTopButton = document.getElementById('backToTop');
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
};

// Função para rolar para o topo
document.getElementById('backToTop').onclick = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};


function esvaziarLixeira() {
    if (confirm("Tem certeza de que deseja esvaziar a lixeira? Isso removerá permanentemente todos os clientes nela.")) {
        localStorage.removeItem('lixeira');
        carregarLixeiraPagina();
    }
}

function carregarLixeiraPagina() {
    const lixeira = carregarLixeira();
    const tbody = document.querySelector('#tabelaLixeira tbody');
    tbody.innerHTML = '';

    lixeira.forEach(cliente => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="checkbox" class="checkboxCliente" data-nome="${cliente.nome}"></td>
            <td>${cliente.nome}</td>
            <td>
                <button onclick="restaurarCliente('${cliente.nome}')">Restaurar</button>
                <button onclick="removerPermanentemente('${cliente.nome}')">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    const esvaziarLixeiraButton = document.getElementById('esvaziarLixeira');
    esvaziarLixeiraButton.style.display = lixeira.length === 0 ? 'none' : 'block';

    const quantidadeClientes = contarClientesLixeira();
    document.getElementById('quantidadeClientesLixeira').textContent = `Clientes na lixeira: ${quantidadeClientes}`;
}

document.addEventListener('DOMContentLoaded', function() {
    carregarLixeiraPagina();
});

function removerPermanentemente(nome) {
    const lixeira = carregarLixeira();
    const clienteIndex = lixeira.findIndex(c => c.nome.toLowerCase() === nome.toLowerCase());

    if (clienteIndex !== -1) {
        lixeira.splice(clienteIndex, 1);
        salvarLixeira(lixeira);

        window.location.reload();
    }
}

function carregarLixeira() {
    const lixeira = localStorage.getItem('lixeira');
    return lixeira ? JSON.parse(lixeira) : [];
}

function salvarLixeira(lixeira) {
    localStorage.setItem('lixeira', JSON.stringify(lixeira));
}

window.addEventListener('load', carregarLixeiraPagina);

function restaurarCliente(nome) {
    const lixeira = carregarLixeira();
    const clientes = carregarClientes();
    const clienteIndex = lixeira.findIndex(c => c.nome === nome);

    if (clienteIndex !== -1) {
        const cliente = lixeira.splice(clienteIndex, 1)[0];
        clientes.push(cliente);

        salvarClientes(clientes);
        salvarLixeira(lixeira);
        carregarLixeiraPagina();
        atualizarInfoClientes();
        atualizarTabelaClientes();
        window.location.reload();
    }
}

function atualizarTabelaClientes() {
    const clientes = carregarClientes();
    const tabela = document.getElementById('corpoTabela');
    tabela.innerHTML = '';

    clientes.forEach(cliente => {
        adicionarLinhaTabela(cliente.nome, cliente.telefone, cliente.data);
    });
}

function carregarClientes() {
    return JSON.parse(localStorage.getItem('clientes')) || [];
}

function salvarClientes(clientes) {
    localStorage.setItem('clientes', JSON.stringify(clientes));
}

window.addEventListener('load', function() {
    const clientes = carregarClientes();
    clientes.forEach(cliente => adicionarLinhaTabela(cliente.nome, cliente.telefone, cliente.data));
});

// Função para alternar a exibição da lixeira
function alternarLixeira() {
const containerLixeira = document.getElementById('containerLixeira');
const toggleButton = document.getElementById('toggleLixeira');

if (containerLixeira.style.display === 'none') {
containerLixeira.style.display = 'block';
toggleButton.textContent = 'Fechar Lixeira';
} else {
containerLixeira.style.display = 'none';
toggleButton.textContent = 'Abrir Lixeira';
}
}

function excluirCliente(nome) {
    const clientes = carregarClientes();
    const clienteIndex = clientes.findIndex(c => c.nome.toLowerCase() === nome.toLowerCase());

    if (clienteIndex !== -1) {
        // Tocar o som de exclusão
        const somExclusao = new Audio('sounds/exclusao.mp3');
        somExclusao.play();

        const cliente = clientes.splice(clienteIndex, 1)[0];
        salvarClientes(clientes);

        const lixeira = carregarLixeira();
        lixeira.push(cliente);
        salvarLixeira(lixeira);

        const linhaCliente = document.querySelector(`tr[data-nome="${nome}"]`);
        if (linhaCliente) {
            linhaCliente.classList.add('desintegrate');
            setTimeout(() => {
                linhaCliente.remove();
                atualizarInfoClientes();
                carregarLixeiraPagina();
            }, 500);
        }
    }
}

function pesquisarClientesLixeira() {
    const input = document.getElementById('pesquisarLixeira');
    const filter = input.value.toLowerCase();
    const trs = document.querySelectorAll('#tabelaLixeira tbody tr');

    trs.forEach(tr => {
        const td = tr.querySelector('td:nth-child(2)');
        if (td) {
            const textValue = td.textContent || td.innerText;
            tr.style.display = textValue.toLowerCase().includes(filter) ? '' : 'none';
        }
    });
}

function toggleSelecionarTodos(source) {
    const checkboxes = document.querySelectorAll('.checkboxCliente');
    checkboxes.forEach(checkbox => {
        checkbox.checked = source.checked;
    });
}

function restaurarSelecionados() {
    const checkboxes = document.querySelectorAll('.checkboxCliente:checked');
    const lixeira = carregarLixeira();
    let clientes = carregarClientes();
    let clientesRestaurados = false;

    checkboxes.forEach(checkbox => {
        const nome = checkbox.getAttribute('data-nome');
        const clienteIndex = lixeira.findIndex(c => c.nome === nome);

        // Verifica se o cliente existe na lista de clientes e se ele está na lixeira
        if (clienteIndex !== -1 && !clientes.some(cliente => cliente.nome === nome)) {
            const cliente = lixeira.splice(clienteIndex, 1)[0];
            clientes.push(cliente);
            clientesRestaurados = true;
        }
    });

    salvarClientes(clientes);
    salvarLixeira(lixeira);
    carregarLixeiraPagina();
    atualizarInfoClientes();
    atualizarTabelaClientes();
    carregarPagina();

    if (clientesRestaurados) {
        exibirFeedback("Clientes restaurados com sucesso");
    } else {
        exibirFeedback("Nenhum cliente foi restaurado. Clientes com o mesmo nome já existem.");
    }
}

function exibirFeedback(mensagem) {
    let feedbackElement = document.getElementById('feedbackR');
    if (!feedbackElement) {
        feedbackElement = document.createElement('div');
        feedbackElement.id = 'feedbackR';
        document.body.appendChild(feedbackElement);
    }
    feedbackElement.innerText = mensagem;
    feedbackElement.style.display = "block";  // Exibe a mensagem
    setTimeout(() => {
        feedbackElement.style.display = "none";  // Oculta a mensagem após 4 segundos
    }, 4000);
}

function adicionarCliente() {
    const nomeInput = document.getElementById('inputNome');
    const telefoneInput = document.getElementById('inputTelefone');
    const dataInput = document.getElementById('inputData');

    const nome = nomeInput.value.trim();
    const telefone = telefoneInput.value.trim();
    const data = dataInput.value;

    let erro = false;

    // Verifica o nome
    if (!nome) {
        exibirErro(nomeInput, "Nome do cliente não pode estar vazio.");
        erro = true;
    } else {
        limparErro(nomeInput);
    }

    // Verifica o telefone
    if (!validarTelefone(telefone)) {
        exibirErro(telefoneInput, "Telefone inválido. Deve conter 11 dígitos.");
        erro = true;
    } else {
        limparErro(telefoneInput);
    }

    // Verifica a data
    const dataFormatada = new Date(data);
    if (!data || isNaN(dataFormatada.getTime())) {
        exibirErro(dataInput, "Data inválida. Escolha uma data válida.");
        erro = true;
    } else {
        limparErro(dataInput);
    }

    if (erro) return; // Se houver erro, para a execução

    const clientes = carregarClientes();

    // 🔹 verifica se o nome já existe, permitindo números repetidos
const clienteExistente = clientes.some(cliente => 
cliente.nome.toLowerCase() === nome.toLowerCase()
    );

    if (clienteExistente) {
        alert("Cliente com o mesmo nome já existe.");
        return;
    }

    const dataVencimento = calcularDataVencimento(dataFormatada);
    clientes.push({ nome, telefone, data: dataVencimento });
    salvarClientes(clientes);

    window.location.reload();
}
// Função para validar telefone corretamente
function validarTelefone(telefone) {
    const numeroLimpo = telefone.replace(/\D/g, ''); // Remove tudo que não for número

    if (numeroLimpo.length !== 11) return false; // Deve ter exatamente 11 dígitos

    const ddd = numeroLimpo.substring(0, 2); // Captura os dois primeiros dígitos (DDD)
    const primeiroDigito = numeroLimpo[2]; // Primeiro dígito do número

    // Lista de DDDs válidos no Brasil
    const dddsValidos = [
        "11", "12", "13", "14", "15", "16", "17", "18", "19", // SP
        "21", "22", "24", // RJ
        "27", "28", // ES
        "31", "32", "33", "34", "35", "37", "38", // MG
        "41", "42", "43", "44", "45", "46", // PR
        "47", "48", "49", // SC
        "51", "53", "54", "55", // RS
        "61", // DF
        "62", "64", // GO
        "63", // TO
        "65", "66", // MT
        "67", // MS
        "68", "69", // AC e RO
        "71", "73", "74", "75", "77", // BA
        "79", // SE
        "81", "82", "83", "84", "85", "86", "87", "88", "89", // Nordeste (inclui 81 PE)
        "91", "92", "93", "94", "95", "96", "97", "98", "99" // Norte
    ];

    return dddsValidos.includes(ddd) && primeiroDigito === '9'; // Celulares no Brasil sempre começam com 9
}

// Função para formatar celular com o codigo do país +55)
function formatarTelefone(telefone) {
    const numeroLimpo = telefone.replace(/\D/g, '');

    if (!validarTelefone(numeroLimpo)) return "Número inválido";

    return `+55${numeroLimpo}`;
}

// Função para exibir erro no input
function exibirErro(input, mensagem) {
    let erroSpan = input.nextElementSibling;

    if (!erroSpan || !erroSpan.classList.contains("erro-mensagem")) {
        erroSpan = document.createElement("span");
        erroSpan.classList.add("erro-mensagem");
        input.parentNode.appendChild(erroSpan);
    }
    
    erroSpan.textContent = mensagem;
    input.classList.add("input-erro");
}

// Função para limpar o erro do input
function limparErro(input) {
    const erroSpan = input.nextElementSibling;
    if (erroSpan && erroSpan.classList.contains("erro-mensagem")) {
        erroSpan.remove();
    }
    input.classList.remove("input-erro");
}

function calcularDataVencimento(data) {
    let dia = data.getDate() + 1;
    let mes = data.getMonth() + 1;
    let ano = data.getFullYear();

    if (mes > 11) {
        mes = 0;
        ano += 1;
    }

    let dataVencimento = new Date(ano, mes, dia);

    if (dataVencimento.getMonth() !== mes) {
        dataVencimento = new Date(ano, mes + 1, 0);
    }

    return dataVencimento;
}

function adicionarLinhaTabela(nome, telefone, data) {
    const tabela = document.getElementById('corpoTabela');
    const novaLinha = document.createElement('tr');
    novaLinha.setAttribute('data-nome', nome); // Adiciona atributo de nome à linha

    // Adiciona a caixa de seleção
    const celulaSelecionar = novaLinha.insertCell(0);
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('cliente-checkbox');
    celulaSelecionar.appendChild(checkbox);

    const celulaNome = novaLinha.insertCell(1);
    celulaNome.innerText = nome;

    const celulaTelefone = novaLinha.insertCell(2);
    celulaTelefone.innerText = telefone;

    const celulaData = novaLinha.insertCell(3);
    celulaData.innerText = new Date(data).toLocaleDateString('pt-BR');

    const celulaAcoes = novaLinha.insertCell(4);

    celulaAcoes.appendChild(criarBotao("Editar", function() {
        const novoNome = prompt("Digite o novo nome do cliente:", nome);
        const novoTelefone = prompt("Digite o novo telefone do cliente:", telefone);
        const novaData = prompt("Digite a nova data de vencimento (DD/MM/AAAA):", new Date(data).toLocaleDateString('pt-BR'));

        // Verifica se o usuário não cancelou algum dos prompts
        if (novoNome !== null && novoTelefone !== null && novaData !== null && novoNome && validarTelefone(novoTelefone)) {
            const partesData = novaData.split('/');
            if (partesData.length === 3) {
                const novaDataVencimento = new Date(partesData[2], partesData[1] - 1, partesData[0]);
                if (!isNaN(novaDataVencimento.getTime())) {
                    const dataAnterior = new Date(data).toLocaleDateString('pt-BR');
                    const novaDataFormatada = novaDataVencimento.toLocaleDateString('pt-BR');

                    if (dataAnterior !== novaDataFormatada) {
                        atualizarClientesAlterados(nome, dataAnterior, novaDataFormatada);
                    }

                    celulaNome.innerText = novoNome;
                    celulaTelefone.innerText = novoTelefone;
                    celulaData.innerText = novaDataFormatada;

                    const clientes = carregarClientes();
                    const clienteIndex = clientes.findIndex(c => c.nome.toLowerCase() === nome.toLowerCase());
                    if (clienteIndex !== -1) {
                        clientes[clienteIndex].nome = novoNome;
                        clientes[clienteIndex].telefone = novoTelefone;
                        clientes[clienteIndex].data = novaDataVencimento;
                        salvarClientes(clientes);
                        atualizarCorCelulaData(celulaData, novaDataVencimento);
                        location.reload();
                    }
                }
            }
        }
    }));
 celulaAcoes.appendChild(criarBotao("Excluir", function() {
        if (confirm("Tem certeza de que deseja excluir este cliente?")) {
            excluirCliente(nome);
        }
    }));
    
    celulaAcoes.appendChild(criarBotao("WhatsApp", function() {
        const dataVencimentoDestacada = `\`${celulaData.innerText}\``;

        // Obter a hora atual
        const horaAtual = new Date().getHours();
        let saudacao;

        // Determinar a saudação com base na hora atual
        if (horaAtual >= 0 && horaAtual < 12) {
            saudacao = "bom dia";
        } else if (horaAtual >= 12 && horaAtual < 18) {
            saudacao = "boa tarde";
        } else {
            saudacao = "boa noite";
        }

        // Construir a mensagem com a saudação correta
        const mensagem = encodeURIComponent(
            `*Olá ${saudacao}, seu plano de canais está vencendo, com data de vencimento dia ${dataVencimentoDestacada}. Caso queira renovar após esta data, favor entrar em contato.* \n \n \n \n `
        );
        const telefoneCliente = telefone.replace(/\D/g, '');
        abrirWhatsApp(telefoneCliente, mensagem);
    }));

    atualizarCorCelulaData(celulaData, data);

    tabela.appendChild(novaLinha);
}

function criarBotao(texto, acao) {
    const botao = document.createElement('button');
    botao.innerText = texto;
    botao.addEventListener('click', acao);
    return botao;
}

function atualizarCorCelulaData(celulaData, dataVencimento) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Garante que só a data importa

    const diferencaDias = Math.ceil((dataVencimento - hoje) / (1000 * 60 * 60 * 24));

    // Remove classes antigas
    celulaData.classList.remove('red', 'yellow', 'orange');

    // Define a cor conforme a diferença de dias
    if (diferencaDias < 0) {
        celulaData.classList.add('red'); // Já venceu
    } else if (diferencaDias === 0) {
        celulaData.classList.add('yellow'); // Vence hoje
    } else if (diferencaDias === 2) {
        celulaData.classList.add('orange'); // Faltam 2 dias
    }
}

function renovarCliente(nome) {
    const hoje = new Date().toLocaleDateString('pt-BR');
    let clientesHoje = JSON.parse(localStorage.getItem('clientesRenovadosHoje')) || { data: hoje, nomes: [] };

    // Se a data armazenada for diferente da data atual, reinicie a lista de nomes
    if (clientesHoje.data !== hoje) {
        clientesHoje = { data: hoje, nomes: [] };
    }

    // Verifica se o cliente já foi renovado hoje
    if (!clientesHoje.nomes.includes(nome)) {
        clientesHoje.nomes.push(nome);
        localStorage.setItem('clientesRenovadosHoje', JSON.stringify(clientesHoje));
        exibirClientesRenovadosHoje();
    }
}

function registrarClienteRenovadoHoje(nomeCliente) {
    const hoje = new Date().toLocaleDateString('pt-BR');
    let clientesHoje = JSON.parse(localStorage.getItem('clientesRenovadosHoje')) || { data: hoje, nomes: [] };

    if (clientesHoje.data === hoje && !clientesHoje.nomes.includes(nomeCliente)) {
        clientesHoje.nomes.push(nomeCliente);
    } else if (clientesHoje.data !== hoje) {
        clientesHoje = { data: hoje, nomes: [nomeCliente] };
    }

    localStorage.setItem('clientesRenovadosHoje', JSON.stringify(clientesHoje));
}

function exibirClientesRenovadosHoje() {
    const hoje = new Date().toLocaleDateString('pt-BR');
    const clientesHoje = JSON.parse(localStorage.getItem('clientesRenovadosHoje')) || { data: hoje, nomes: [] };
    const campoClientesRenovados = document.getElementById('infoClientes');

    if (clientesHoje.nomes.length > 0) {
        const listaClientes = clientesHoje.nomes.map(nome => `<li>${nome}</li>`).join('');
        campoClientesRenovados.innerHTML = `<span class="titulo-clientes-renovados">Clientes renovados hoje:</span><ul>${listaClientes}</ul>`;
    } else {
        campoClientesRenovados.innerHTML = '<span class="nenhum-cliente-renovado">Nenhum cliente renovado hoje</span>';
    }
}

// Chama a função para exibir os clientes renovados ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    exibirClientesRenovadosHoje();
});

// Função para atualizar a lista de clientes alterados no localStorage
function atualizarClientesAlterados(nome, dataAnterior, novaData) {
const hoje = new Date().toLocaleDateString('pt-BR');
let clientesAlterados = JSON.parse(localStorage.getItem('clientesAlterados')) || [];
let clientesHoje = clientesAlterados.find(c => c.data === hoje);

if (!clientesHoje) {
clientesHoje = { data: hoje, nomes: [] };
clientesAlterados.push(clientesHoje);
}

clientesHoje.nomes.push({ nome: nome, dataAnterior: dataAnterior, novaData: novaData });
localStorage.setItem('clientesAlterados', JSON.stringify(clientesAlterados));
exibirClientesAlterados();
}

// Função para exibir a lista de clientes alterados na interface
function registrarClienteAlterado(nome) {
    const hoje = new Date().toLocaleDateString('pt-BR');
    let clientesAlterados = JSON.parse(localStorage.getItem('clientesAlterados')) || [];
    let clientesRenovados = JSON.parse(localStorage.getItem('clientesRenovadosHoje')) || { data: hoje, nomes: [] };

    // Verifica se o cliente já foi renovado hoje
    const clienteJaRenovado = clientesRenovados.nomes.some(c => c.nome === nome);

    if (clienteJaRenovado) {
        return; // Não registrar o cliente se ele já foi renovado hoje
    }

    // Verifica se já existe uma entrada para a data de hoje
    let clientesHoje = clientesAlterados.find(c => c.data === hoje);

    if (!clientesHoje) {
        // Se não existe uma entrada para hoje, cria uma nova
        clientesHoje = { data: hoje, nomes: [] };
        clientesAlterados.push(clientesHoje);
    }

    // Verifica se o cliente já foi alterado hoje
    if (!clientesHoje.nomes.some(c => c.nome === nome)) {
        clientesHoje.nomes.push({ nome });
        localStorage.setItem('clientesAlterados', JSON.stringify(clientesAlterados));
        exibirClientesAlterados();
    }
}

function exibirClientesAlterados() {
    const clientesAlterados = JSON.parse(localStorage.getItem('clientesAlterados')) || [];
    const hoje = new Date().toLocaleDateString('pt-BR');
    const clientesHoje = clientesAlterados.find(c => c.data === hoje);
    const campoClientesAlterados = document.getElementById('infoClientes');

    if (clientesHoje && clientesHoje.nomes.length > 0) {
        const nomesUnicos = [...new Set(clientesHoje.nomes.map(cliente => cliente.nome))];
        const listaClientes = nomesUnicos.map(nome => `<li>${nome}</li>`).join('');
        campoClientesAlterados.innerHTML = `<span class="titulo-clientes-renovados">Clientes renovados hoje:</span><ul>${listaClientes}</ul>`;
    } else {
        campoClientesAlterados.innerHTML = '<span class="nenhum-cliente-renovado">Nenhum cliente renovado hoje</span>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    exibirClientesAlterados();
});

function atualizarDataVencimento(nomeCliente, novaData) {
    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    let clienteExistente = clientes.find(c => c.nome === nomeCliente);

    if (clienteExistente) {
        let dataAnterior = new Date(clienteExistente.data).toLocaleDateString('pt-BR');
        let novaDataFormatada = new Date(novaData).toLocaleDateString('pt-BR');

        if (dataAnterior !== novaDataFormatada) {
            clienteExistente.data = novaData;
            localStorage.setItem('clientes', JSON.stringify(clientes));
            atualizarClientesAlterados(nomeCliente, dataAnterior, novaDataFormatada);
    
        }
    }
}

function editarCliente(nomeAntigo, novoNome, novoTelefone, novaDataVencimento) {
            let clientes = carregarClientes();
            let clienteExistente = clientes.find(c => c.nome.toLowerCase() === nomeAntigo.toLowerCase());

            if (clienteExistente) {
                let dataAnterior = new Date(clienteExistente.data).toLocaleDateString('pt-BR');
                let novaDataFormatada = novaDataVencimento.toLocaleDateString('pt-BR');

                if (dataAnterior !== novaDataFormatada) {
                    clienteExistente.nome = novoNome;
                    clienteExistente.telefone = novoTelefone;
                    clienteExistente.data = novaDataVencimento;

                    salvarClientes(clientes);
                    atualizarClientesAlterados(novoNome, dataAnterior, novaDataFormatada);
                }
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            exibirClientesAlterados();
        });

function criarBotao(texto, callback) {
    const btn = document.createElement("button");
    btn.innerText = texto;
    btn.onclick = callback;
    return btn;
}

function abrirWhatsApp(telefoneCliente, mensagem) {
    window.open(`https://api.whatsapp.com/send?phone=55${telefoneCliente}&text=${mensagem}`, '_blank');
}

function pesquisarCliente() {
    const termoPesquisa = document.getElementById('inputPesquisar').value.toLowerCase();
    const linhas = document.getElementById('corpoTabela').getElementsByTagName('tr');

    for (let i = 0; i < linhas.length; i++) {
        const nome = linhas[i].getElementsByTagName('td')[1].innerText.toLowerCase();
        const telefone = linhas[i].getElementsByTagName('td')[2].innerText.toLowerCase();

        if (nome.includes(termoPesquisa) || telefone.includes(termoPesquisa)) {
            linhas[i].style.display = '';
        } else {
            linhas[i].style.display = 'none';
        }
    }
}

function atualizarInfoClientes() {
    const totalVencidos = calcularTotalClientesVencidos();
    const totalNaoVencidos = calcularTotalClientesNaoVencidos();
    document.getElementById('infoClientes2').innerHTML = `
        <span class="clientes-vencidos">Clientes vencidos: ${totalVencidos}</span><br>
        <span class="clientes-ativos">Clientes ativos: ${totalNaoVencidos}</span>
    `;
}

function calcularTotalClientesVencidos() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const clientes = carregarClientes();
    let totalVencidos = 0;
    clientes.forEach(function(cliente) {
        const dataVencimento = new Date(cliente.data);
        if (dataVencimento < hoje) {
            totalVencidos++; }
    });
    return totalVencidos;
}

function calcularTotalClientesNaoVencidos() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const clientes = carregarClientes();
    let totalNaoVencidos = 0;
    clientes.forEach(function(cliente) {
        const dataVencimento = new Date(cliente.data);
        if (dataVencimento >= hoje) {
            totalNaoVencidos++;
        }
    });
    return totalNaoVencidos;
}

function carregarPagina() {
    const clientes = carregarClientes();
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const clientesOrdenados = {
        doisDias: [],
        hoje: [],
        vencidos: [],
        outros: []
    };

    clientes.forEach(cliente => {
        const dataVencimento = new Date(cliente.data);
        const diferencaDias = Math.ceil((dataVencimento - hoje) / (1000 * 60 * 60 * 24));
        
        if (diferencaDias === 2) {
            clientesOrdenados.doisDias.push(cliente);
        } else if (diferencaDias === 0) {
            clientesOrdenados.hoje.push(cliente);
        } else if (diferencaDias < 0) {
            clientesOrdenados.vencidos.push(cliente);
        } else {
            clientesOrdenados.outros.push(cliente);
        }
    });

    const tabela = document.getElementById('corpoTabela');
    tabela.innerHTML = ''; // Limpa a tabela antes de adicionar os clientes ordenados

    // Adicionar clientes na ordem correta
    clientesOrdenados.doisDias.forEach(cliente => {
        adicionarLinhaTabela(cliente.nome, cliente.telefone, new Date(cliente.data));
    });

    clientesOrdenados.hoje.forEach(cliente => {
        adicionarLinhaTabela(cliente.nome, cliente.telefone, new Date(cliente.data));
    });

    clientesOrdenados.outros.forEach(cliente => {
        adicionarLinhaTabela(cliente.nome, cliente.telefone, new Date(cliente.data));
    });

    clientesOrdenados.vencidos.forEach(cliente => {
        adicionarLinhaTabela(cliente.nome, cliente.telefone, new Date(cliente.data));
    });

    atualizarInfoClientes();
}

function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');

    const footer = document.querySelector('footer');
    footer.classList.toggle('footer-light'); // Alterna a classe para o footer

    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('dark-mode', isDarkMode);
}

function carregarDarkMode() {
    const isDarkMode = localStorage.getItem('dark-mode') === 'true';
    const body = document.body;
    const footer = document.querySelector('footer');
    
    if (isDarkMode) {
        body.classList.add('dark-mode');
        footer.classList.remove('footer-light'); // Garante que a classe correta seja aplicada
    } else {
        footer.classList.add('footer-light'); // Garante que a classe correta seja aplicada
    }
}

function exportarClientes() {
    const clientes = carregarClientes();
    const blob = new Blob([JSON.stringify(clientes)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clientes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importarClientes(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const clientesImportados = JSON.parse(e.target.result);
            const clientesAtuais = carregarClientes();
            
            // Mapa para rastrear clientes já existentes pelo nome
            const mapaClientes = new Map();
            clientesAtuais.forEach(cliente => {
                mapaClientes.set(cliente.nome.toLowerCase(), cliente);
            });

            // Atualizar clientes existentes e adicionar novos clientes do backup
            clientesImportados.forEach(clienteImportado => {
                const nomeClienteImportado = clienteImportado.nome.toLowerCase();
                if (mapaClientes.has(nomeClienteImportado)) {
                    // Cliente já existe, atualizar com informações do backup
                    const clienteExistente = mapaClientes.get(nomeClienteImportado);
                    clienteExistente.telefone = clienteImportado.telefone;
                    clienteExistente.data = clienteImportado.data;
                } else {
                    // Novo cliente do backup, adicionar à lista
                    clientesAtuais.push(clienteImportado);
                }
            });

            // Salvar a lista atualizada de clientes
            salvarClientes(clientesAtuais);
            window.location.reload();
        };
        reader.readAsText(file);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('importarClientes').addEventListener('change', importarClientes);
    
    if (typeof displayClients === 'function') {
        displayClients(); // Verifica se a função displayClients existe antes de chamá-la
    }
});

function backupClientes() {
    // Carrega os clientes do localStorage
    const clientes = carregarClientes();
    // Carrega a lixeira do localStorage
    const lixeira = carregarLixeira();

    // Cria um objeto para armazenar o backup
    const backup = {
        clientes: clientes,
        lixeira: lixeira
    };

    // Converte o objeto de backup para uma string JSON
    const backupJSON = JSON.stringify(backup);

    // Salva o JSON no localStorage
    localStorage.setItem('backupDiario', backupJSON);

    // Cria um blob a partir da string JSON
    const blob = new Blob([backupJSON], { type: 'application/json' });

    // Cria um link temporário para fazer o download do backup
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `backup_clientes_${new Date().toLocaleDateString('pt-BR')}.json`;
    link.click();
}

// Agendar a verificação de backup diário
setInterval(verificarBackupDiario, 60 * 60 * 1000); // Verifica a cada hora

document.getElementById('select-all').addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('.cliente-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });
});


// Função para verificar e realizar o backup diário

function verificarBackupDiario() {
    const hoje = new Date();
    const ultimaBackupStr = localStorage.getItem('ultimaBackup');
    const ultimaBackup = ultimaBackupStr ? new Date(ultimaBackupStr) : null;

    // Se não houve backup antes ou se um dia passou desde o último backup
    if (!ultimaBackup || (hoje.getTime() - ultimaBackup.getTime()) >= 24 * 60 * 60 * 1000) {
        backupClientes();
        localStorage.setItem('ultimaBackup', hoje.toISOString());
    }
}

document.getElementById('select-all').addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('.cliente-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });
});


function contarClientesLixeira() {
const lixeira = carregarLixeira();
return lixeira.length;
}

function excluirClientesSelecionados() {
    const checkboxes = document.querySelectorAll('.cliente-checkbox:checked');
    const clientes = carregarClientes();
    const lixeira = carregarLixeira();
    let clientesExcluidos = false;

    checkboxes.forEach(checkbox => {
        const nome = checkbox.closest('tr').getAttribute('data-nome');
        const clienteIndex = clientes.findIndex(c => c.nome.toLowerCase() === nome.toLowerCase());

        if (clienteIndex !== -1) {
            const cliente = clientes.splice(clienteIndex, 1)[0];
            lixeira.push(cliente);
            clientesExcluidos = true;  // Marca que ao menos um cliente foi excluído
        }
    });

    if (clientesExcluidos) {
        // Tocar o som de exclusão
        const somExclusao = new Audio('sounds/exclusao.mp3');
        somExclusao.play();
    }

    salvarClientes(clientes);
    salvarLixeira(lixeira);
    carregarLixeiraPagina();
    atualizarTabelaClientes();
    atualizarInfoClientes();
    carregarPagina();

    if (clientesExcluidos) {
        const feedbackElement = document.getElementById('feedback');
        feedbackElement.innerText = "Clientes excluídos com sucesso";
        feedbackElement.style.display = "block";  // Exibe a mensagem
        setTimeout(() => {
            feedbackElement.style.display = "none";  // Oculta a mensagem após 3 segundos
        }, 4000);
    }
}

window.onload = function() {

    carregarPagina();
    carregarDarkMode();
    verificarBackupDiario();
    exibirClientesAlterados();
    
    
    // Chama a função de scroll para garantir que o botão seja configurado corretamente
    window.onscroll();
};