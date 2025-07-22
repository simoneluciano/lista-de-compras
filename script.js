let totalGasto = 0;
let limite = 300;
let dinheiroDisponivel = 0;
let carrinho = [];

let mesAtual = new Date().toLocaleString('default', { month: 'long' }); 

if (localStorage.getItem('dinheiroDisponivel')) {
    dinheiroDisponivel = parseFloat(localStorage.getItem('dinheiroDisponivel'));
    limite = dinheiroDisponivel;
}
if (localStorage.getItem('totalGasto')) {
    totalGasto = parseFloat(localStorage.getItem('totalGasto'));
}
if (localStorage.getItem('carrinho')) {
    carrinho = JSON.parse(localStorage.getItem('carrinho'));
}


document.addEventListener("DOMContentLoaded", () => {
    atualizarGasto();
    const totalCompra = document.getElementById("totalCompra");
    if (totalCompra) {
        totalCompra.textContent = `Total: R$${totalGasto.toFixed(2)}`;
        totalCompra.style.color = totalGasto > limite ? "red" : "black";
    }
    const mensagem = document.getElementById("mensagem");
    if (mensagem && totalGasto > 0) {
        mensagem.textContent = "Seus produtos estão sendo contabilizados corretamente!";
        mensagem.style.color = "green";
    }

   
    if (document.getElementById("carrinho")) {
        mostrarCarrinho();
    }
    
});

document.getElementById("total").addEventListener("click", function (e) {
    e.preventDefault();
    let novoLimite = prompt("Digite seu dinheiro disponível:");
    if (novoLimite && !isNaN(novoLimite)) {
        dinheiroDisponivel = parseFloat(novoLimite);
        limite = dinheiroDisponivel; 
        localStorage.setItem('dinheiroDisponivel', dinheiroDisponivel.toString());
        localStorage.setItem('totalGasto', totalGasto.toString()); 
        alert(`Você informou R$${dinheiroDisponivel.toFixed(2)} disponíveis.`);
        atualizarGasto();
    } else {
        alert("Valor inválido");
    }
});

function adicionarProduto() {
    let produto = document.getElementById("produto");
    let preco = document.getElementById("preco");
    let quantidade = document.getElementById("quantidade");
    let listaProdutos = document.getElementById("listaProdutos");
    let totalCompra = document.getElementById("totalCompra");
    let mensagem = document.getElementById("mensagem");

    const nomeProduto = produto.value.trim();
    const nomePreco = parseFloat(preco.value);
    const nomeQuantidade = parseInt(quantidade.value);

    if (!nomeProduto || isNaN(nomePreco) || isNaN(nomeQuantidade)) {
        mensagem.textContent = "Preencha todos os campos corretamente.";
        mensagem.style.color = "red";
        return;
    }

    const valorTotal = nomePreco * nomeQuantidade;

 
    if (valorTotal > dinheiroDisponivel) {
        mensagem.textContent = "Você não tem dinheiro suficiente 💸";
        mensagem.style.color = "red";
        return;
    }

    dinheiroDisponivel -= valorTotal;
    totalGasto += valorTotal;
   
    localStorage.setItem('dinheiroDisponivel', dinheiroDisponivel.toString());
    localStorage.setItem('totalGasto', totalGasto.toString());

  
    let texto = `${nomeProduto} - R$${nomePreco.toFixed(2)} - ${nomeQuantidade} un.`;
    let itemLista = document.createElement("li");
    itemLista.textContent = texto;

    const botaoEnviarCarrinho = document.createElement("button");
    botaoEnviarCarrinho.textContent = "Adicionar ao carrinho";
    botaoEnviarCarrinho.classList.add("adicionar-carrinho");
    botaoEnviarCarrinho.onclick = function(event){
        event.preventDefault();
        adicionarProdutoAoCarrinho(nomeProduto, nomePreco, nomeQuantidade, valorTotal);
        
    }

    itemLista.appendChild(botaoEnviarCarrinho);
    listaProdutos.appendChild(itemLista);

    
    totalCompra.textContent = `Total: R$${totalGasto.toFixed(2)}`;
    totalCompra.style.color = totalGasto > limite ? "red" : "black";

    mensagem.textContent = "Produto adicionado com sucesso!";
    mensagem.style.color = "green";

  
    let objetoProduto = {
        nome: nomeProduto,
        preco: nomePreco,
        quantidade: nomeQuantidade,
        subtotal: valorTotal,
        mes: mesAtual
    };


    
    produto.value = "";
    preco.value = "";
    quantidade.value = "";

    

    atualizarGasto();
}
function adicionarProdutoAoCarrinho(nomeProduto, nomePreco, nomeQuantidade, valorTotal) {
    
    let objetoProduto = {
        nome: nomeProduto,
        preco: nomePreco,
        quantidade: nomeQuantidade,
        subtotal: valorTotal,
        mes: mesAtual
    };

  
    carrinho.push(objetoProduto);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    

  
    if (document.getElementById("carrinho")) {
        mostrarCarrinho();
    }
    

   
    alert(`${nomeProduto} foi adicionado ao carrinho!`);
}



function mostrarCarrinho() {
    const carrinhoDiv = document.getElementById("carrinho"); 
    carrinhoDiv.innerHTML = ""; 

    if (carrinho.length === 0) {
        const mensagemVazio = document.createElement("p");
        mensagemVazio.textContent = "Seu carrinho está vazio!";
        return;
    }

    carrinho.forEach((produto, index) => {
        
        const itemCarrinho = document.createElement("div");
        itemCarrinho.classList.add("item-carrinho");

        
        itemCarrinho.innerHTML = `
            <p><strong>${produto.nome}</strong></p>
            <p>Preço: R$${produto.preco.toFixed(2)}</p>
            <p>Quantidade: ${produto.quantidade}</p>
            <p>Subtotal: R$${produto.subtotal.toFixed(2)}</p>
            <p>Mês: ${produto.mes}</p>
        `;

        
        carrinhoDiv.appendChild(itemCarrinho);
    });

    
    atualizarGasto();
}

function atualizarGasto() {
    const gastoTotal = document.getElementById("gastoTotal");
    gastoTotal.textContent = `Sobrando: R$${dinheiroDisponivel.toFixed(2).replace(".", ",")}`;
}
function limparLista() {
    carrinho = []; 
    totalGasto = 0;
    localStorage.removeItem('carrinho');
    document.getElementById('listaProdutos').innerHTML = ''; 
    document.getElementById('mensagem').textContent = 'Lista limpa com sucesso!';
    document.getElementById('totalCompra').textContent = 'Total: R$0,00';
    document.getElementById('gastoTotal').textContent = 'Gasto: R$0,00';
}
