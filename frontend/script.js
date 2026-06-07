const API_BASE = 'http://localhost:3000/api';
let pedidoParaCancelar = null; // Guarda o ID do pedido que vai ser cancelado

//  INICIALIZAÇÃO DA PÁGINA 
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    // Descobre em qual página estamos e roda a função certa
    if (path.includes('vendedor.html')) {
        carregarPedidosVendedor();
    } else if (path.includes('minhasCompras.html')) {
        carregarPedidosCliente();
    } else if (path.includes('chat.html')) {
        configurarChat();
    } else if (path.includes('index.html') || path === '/') {
        // Chame aqui a função que vai listar todos os pedidos na index
        carregarListaGeralPedidos(); 
    }


    // enter na barra de busca 
    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        searchBar.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); 
                const termoDeBusca = searchBar.value.toLowerCase().trim();
                filtrarPedidos(termoDeBusca);
            }
        });
    }
});

//  MENU HAMBÚRGUER 
function toggleMenu() {
    const sidebar = document.getElementById('sidebar-menu');
    const overlay = document.getElementById('overlay-menu');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

// TELA cliente
async function carregarPedidosCliente() {
    try {
        const resposta = await fetch(`${API_BASE}/pedido`);
        const pedidos = await resposta.json();
        const container = document.getElementById('lista-produtos-cliente');
        const alertaDiv = document.querySelector('.alerta-sucesso');

        // Esconde a notificação verde no início
        if (alertaDiv) alertaDiv.style.display = 'none';
        
        if (!container) return;

        if (!Array.isArray(pedidos) || pedidos.length === 0) {
            container.innerHTML = '<p>Você ainda não possui pedidos.</p>';
            return;
        }

        // Pega o pedido mais recente para mostrar na tela
        const pedidoVigente = pedidos[0];
        const idPedido = pedidoVigente.id_pedido;
        const valorTotal = pedidoVigente.valor_total;
        
        // Cobre os dois padrões de nome que podem vir do seu MySQL
        const statusPedido = pedidoVigente.status || pedidoVigente['Status do Pedido: '] || 'Aguardando';

        document.getElementById('numero-pedido-cabecalho').innerText = `Detalhes do pedido: #${idPedido}`;
        
        const statusEl = document.querySelector('.status-pagamento .sucesso');
        if (statusEl) statusEl.innerText = `✓ Status: ${statusPedido}`;

        container.innerHTML = `
            <div class="produto-item">
                <div class="produto-img"><span class="material-icons">inventory_2</span></div>
                <div class="produto-nome">Pedido Consolidado - Loja #${pedidoVigente.id_loja || 1}</div>
                <div class="produto-preco">R$ ${valorTotal}</div>
            </div>
        `;

        // Coloca o ID e o Valor  no botão de excluir
        const btnExcluir = document.querySelector('.btn-excluir');
        if (btnExcluir) {
            btnExcluir.setAttribute('onclick', `abrirModal(${idPedido}, '${valorTotal}')`);
        }

        // Atualiza o link do chat para o pedido
        const btnChat = document.querySelector('.btn-mensagem');
        if (btnChat) {
            btnChat.href = `chat.html?pedido=${idPedido}`;
        }

    } catch (erro) {
        console.error('Erro ao carregar pedidos do cliente:', erro);
    }
}

// Modal de Cancelamento
function abrirModal(idPedido, valorTotal) {
    pedidoParaCancelar = idPedido;
    document.getElementById('id-modal-dinamico').innerText = `#${idPedido}`;
    document.getElementById('valor-estorno-dinamico').innerText = `R$ ${valorTotal}`;
    document.getElementById('modal-cancel').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modal-cancel').style.display = 'none';
    pedidoParaCancelar = null;
}

async function executarCancelamento() {
    if (!pedidoParaCancelar) return;

    const motivoSelect = document.getElementById('motivo-select');
    const motivo = motivoSelect ? motivoSelect.value : 'Desistência';

    try {
        const resposta = await fetch(`${API_BASE}/pedido`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_pedido: pedidoParaCancelar,
                motivo: motivo,
                tipo_solicitante: 'Cliente'
            })
        });

        if (resposta.ok) {
            fecharModal();
            const alertaSucesso = document.querySelector('.alerta-sucesso');
            if (alertaSucesso) {
                alertaSucesso.style.display = 'block';
                alertaSucesso.style.backgroundColor = '#ef4444'; 
                alertaSucesso.innerText = `✓ Pedido #${pedidoParaCancelar} cancelado e estorno solicitado via Pix.`;
                setTimeout(() => { alertaSucesso.style.display = 'none'; }, 6000);
            }
            carregarPedidosCliente(); // Recarrega para ver o novo status
        } else {
            alert('Falha ao processar o cancelamento no banco.');
        }
    } catch (erro) {
        console.error('Erro de conexão:', erro);
        alert('Erro ao conectar com o servidor.');
    }
}


// TELA: VENDEDOR 
async function carregarPedidosVendedor() {
    const grid = document.getElementById('grid-vendedor');
    if (!grid) return;

    try {
        const resposta = await fetch(`${API_BASE}/pedido`);
        const pedidos = await resposta.json();
        
        if (!Array.isArray(pedidos)) {
            grid.innerHTML = `<p class="texto-erro">Erro no banco de dados.</p>`;
            return;
        }

        if (pedidos.length === 0) {
            grid.innerHTML = '<p>Nenhum pedido no sistema.</p>';
            return;
        }

        grid.innerHTML = ''; // Limpa o "Sincronizando..."
        
        pedidos.forEach(pedido => {
            const id = pedido.id_pedido;
            const status = pedido.status || pedido['Status do Pedido: '] || 'Pendente';
            const total = pedido.valor_total;
            const dataCriacao = pedido.data_criacao ? new Date(pedido.data_criacao).toLocaleDateString('pt-BR') : 'Hoje';

            grid.innerHTML += `
                <div class="card-vendedor">
                    <div class="info-vendedor">
                        <h3>Pedido #${id}</h3>
                        <p><strong>Total:</strong> R$ ${total}</p>
                        <p><strong>Status:</strong> ${status}</p>
                        <p><strong>Data:</strong> ${dataCriacao}</p>
                        <div style="margin-top: 15px; display: flex; gap: 10px;">
                            <button class="btn-primary" onclick="atualizarStatus(${id}, 'Em Transporte')">Enviar Pedido</button>
                            <button class="btn-excluir" onclick="deletarPedido(${id})">Apagar</button>
                        </div>
                    </div>
                </div>
            `;
        });

    } catch (erro) {
        console.error("Erro no Fetch:", erro);
        grid.innerHTML = '<p class="texto-erro">Erro de conexão com o backend. O Node.js está rodando?</p>';
    }
}

function filtrarPedidos(termo) {
    const cards = document.querySelectorAll('.card-vendedor');
    let encontrouAlgo = false;

    cards.forEach(card => {
        const textoDoCard = card.innerText.toLowerCase();
        if (textoDoCard.includes(termo)) {
            card.style.display = 'flex';
            encontrouAlgo = true;
        } else {
            card.style.display = 'none';
        }
    });

    let grid = document.getElementById('grid-vendedor');
    let msgErro = document.getElementById('msg-busca-vazia');
    
    if (!encontrouAlgo) {
        if (!msgErro && grid) {
            const p = document.createElement('p');
            p.id = 'msg-busca-vazia';
            p.className = 'texto-erro';
            p.innerText = `Nenhum pedido encontrado para "${termo}".`;
            grid.appendChild(p);
        }
    } else {
        if (msgErro) msgErro.remove();
    }
}

async function atualizarStatus(idPedido, novoStatus) {
    try {
        const resposta = await fetch(`${API_BASE}/pedido/${idPedido}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: novoStatus })
        });

        if (resposta.ok) {
            alert('Status atualizado com sucesso!');
            carregarPedidosVendedor();
        }
    } catch (erro) {
        alert('Erro de conexão ao atualizar status.');
    }
}

async function deletarPedido(idPedido) {
    if (!confirm(`Tem certeza que deseja APAGAR o pedido #${idPedido} do sistema?`)) return;

    try {
        const resposta = await fetch(`${API_BASE}/pedido/${idPedido}`, { method: 'DELETE' });
        if (resposta.ok) {
            alert('Pedido apagado.');
            carregarPedidosVendedor(); 
        } else {
            alert('Ocorreu um erro no servidor ao tentar apagar.');
        }
    } catch (erro) {
        alert('Erro ao tentar apagar o pedido. Verifique o console.');
    }
}


// === 5. TELA: CHAT ===
function configurarChat() {
    const urlParams = new URLSearchParams(window.location.search);
    const pedidoId = urlParams.get('pedido') || 1;

    const displayId = document.getElementById('display-id-pedido');
    if (displayId) displayId.innerText = `#${pedidoId}`;

    const form = document.getElementById('form-mensagem');
    const input = document.getElementById('input-msg');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const conteudo = input.value.trim();
            if (!conteudo) return;

            input.value = '';
            input.focus();

            await fetch(`${API_BASE}/mensagens`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conteudo: conteudo,
                    id_pedido: parseInt(pedidoId),
                    id_cliente: 1
                })
            });
            carregarMensagens(pedidoId);
        });
    }

    carregarMensagens(pedidoId);
    setInterval(() => carregarMensagens(pedidoId), 3000);
}

async function carregarMensagens(idPedido) {
    const chatWindow = document.getElementById('chat-window');
    if (!chatWindow) return;

    try {
        const res = await fetch(`${API_BASE}/mensagens/${idPedido}`);
        if (!res.ok) return;
        const mensagens = await res.json();

        chatWindow.innerHTML = '';

        if (mensagens.length === 0) {
            chatWindow.innerHTML = '<p class="carregando">Nenhuma mensagem. Comece a conversa!</p>';
            return;
        }

        mensagens.forEach(msg => {
            const classeBalao = msg.id_loja ? 'recebida' : 'enviada';
            const div = document.createElement('div');
            div.className = `balao ${classeBalao}`;
            div.innerHTML = `
                <div class="texto-corpo">${msg.conteudo}</div>
                <span class="data-msg">${new Date(msg.data_envio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            `;
            chatWindow.appendChild(div);
        });

        chatWindow.scrollTop = chatWindow.scrollHeight;
    } catch (err) { }
}