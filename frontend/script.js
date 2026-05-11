document.addEventListener("DOMContentLoaded", () => {
    fetch('http://localhost:3000/api/pedido')
        .then(res => res.json())
        .then(pedidos => {
            if (pedidos.length > 0) {
                const pedido = pedidos[0]; 

                // atualiza o Número do Pedido
                document.querySelector('.cabecalho-pedido h2').innerText = `Detalhes do pedido: #${pedido.id_pedido}`;

                // atualiza o Status 
                const statusElement = document.querySelector('.status-pagamento .sucesso');
                statusElement.innerText = `✓ Status: ${pedido.status}`;
                
               
                if(pedido.status === 'Cancelado') {
                    statusElement.style.color = '#ef4444'; 
                }

                // 3. Atualiza o Valor Total 
                console.log("Sistema atualizado com dados do banco!");
            }
        })
        .catch(err => console.error("Erro ao carregar dados:", err));
});