const API_BASE = 'http://localhost:3000/api';

document.addEventListener("DOMContentLoaded", () => {
    const url = window.location.href;

    if (url.includes("minhasCompras.html") || url.includes("index.html")) {
        carregarPedidoCliente();
    } else if (url.includes("vendedor.html")) {
        carregarPedidosVendedor();
    } else if (url.includes("chat.html")) {
        configurarChat();
    }
});

// --- 1. FUNÇÕES DE PEDIDO E INTERFACE ---
async function carregarPedidoCliente() {
    try {
        const res = await fetch(`${API_BASE}/pedido`);
        const pedidos = await res.json();
        if (pedidos.length > 0) {
            const pedido = pedidos[0];
            const idFormatado = `#${pedido.id_pedido}`;
            if (document.getElementById('numero-pedido-cabecalho')) 
                document.getElementById('numero-pedido-cabecalho').innerText = `Detalhes do pedido: ${idFormatado}`;
            
            const statusLabel = document.querySelector('.status-pagamento .sucesso');
            if (statusLabel) {
                statusLabel.innerText = `✓ Status: ${pedido.status || "Pendente"}`;
                statusLabel.style.color = (pedido.status === 'Cancelado') ? '#ef4444' : '#22c55e';
            }
            
            const containerProdutos = document.getElementById('lista-produtos-cliente');
            if (containerProdutos) {
                containerProdutos.innerHTML = `
                    <div class="produto-item">
                        <div class="produto-img"><span class="material-icons">inventory_2</span></div>
                        <span class="produto-nome">${pedido.nome_produto || "Produto"}</span>
                        <span class="produto-preco">R$ ${pedido.valor_total}</span>
                    </div>`;
            }
        }
    } catch (err) { console.error(err); }
}

async function carregarPedidosVendedor() {
    try {
        const res = await fetch(`${API_BASE}/pedido`);
        const pedidos = await res.json();
        const grid = document.getElementById('grid-vendedor');
        if (grid) {
            grid.innerHTML = ""; 
            pedidos.forEach(p => {
                grid.innerHTML += `
                    <div class="card-vendedor">
                        <div class="info-vendedor">
                            <h3>Pedido #${p.id_pedido}</h3>
                            <p><strong>Status:</strong> ${p.status}</p>
                            <button class="btn-primary" onclick="confirmarEnvio(${p.id_pedido})">Confirmar Envio</button>
                        </div>
                    </div>`;
            });
        }
    } catch (err) { console.error(err); }
}

// --- 2. FUNÇÕES DE CHAT (O QUE VOCÊ PRECISA) ---

function configurarChat() {
    const urlParams = new URLSearchParams(window.location.search);
    const pedidoId = urlParams.get('pedido');

    if (!pedidoId) return;

    // Coloca o ID no título
    const displayId = document.getElementById('display-id-pedido');
    if (displayId) displayId.innerText = `#${pedidoId}`;

    const form = document.getElementById('form-mensagem');
    if (form) {
        // CORREÇÃO DO ENTER: Usar onsubmit garante a captura da tecla Enter
        form.onsubmit = async (e) => {
            e.preventDefault();
            const input = document.getElementById('input-msg');
            const conteudo = input.value.trim();

            if (!conteudo) return;

            try {
                const res = await fetch(`${API_BASE}/mensagens`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        conteudo: conteudo,
                        id_pedido: pedidoId,
                        id_cliente: 1, 
                        id_loja: null  
                    })
                });

                if (res.ok) {
                    input.value = '';
                    await carregarMensagens(pedidoId); // Atualiza na hora
                }
            } catch (err) { console.error("Erro ao enviar:", err); }
        };
    }

    // Carrega as mensagens e limpa o "Iniciando conversa"
    carregarMensagens(pedidoId);
    setInterval(() => carregarMensagens(pedidoId), 4000);
}

async function carregarMensagens(idPedido) {
    const chatWindow = document.getElementById('chat-window');
    if (!chatWindow) return;

    try {
        const res = await fetch(`${API_BASE}/mensagens/${idPedido}`);
        
        // Se a resposta não for ok (ex: 404 ou 500), não fazemos nada para não exibir erro
        if (!res.ok) return;

        const mensagens = await res.json();
        
        // Limpa o conteúdo (remove o "Iniciando conversa...") apenas se houver mensagens
        if (mensagens.length > 0) {
            chatWindow.innerHTML = ''; 
            mensagens.forEach(msg => {
                const div = document.createElement('div');
                const classeBalao = msg.id_loja ? 'recebida' : 'enviada';
                div.className = `balao ${classeBalao}`;
                div.innerHTML = `
                    ${msg.conteudo}
                    <span class="data-msg">${new Date(msg.data_envio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                `;
                chatWindow.appendChild(div);
            });
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    } catch (err) { 
        // Catch vazio: se o servidor cair, o "Iniciando conversa..." continua lá parado
        // em vez de aparecer a mensagem vermelha de erro.
        console.log("Servidor offline, tentando reconectar...");
    }
}

// --- 3. UI ---
function abrirModal() { document.getElementById('modal-cancel').style.display = 'flex'; }
function fecharModal() { document.getElementById('modal-cancel').style.display = 'none'; }
function toggleMenu() {
    document.getElementById('sidebar-menu').classList.toggle('active');
    document.getElementById('overlay-menu').classList.toggle('active');
}