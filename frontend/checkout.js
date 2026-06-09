document.getElementById('form-pagamento').addEventListener('submit', async function(event) {
    event.preventDefault();

    const btnFinalizar = document.getElementById('btn-finalizar');
    const statusDiv = document.getElementById('status-pagamento');
    
    // Captura os dados da tela
    const numeroCartao = document.getElementById('cartao-numero').value.replace(/\s/g, '');
    const numParcelas = document.getElementById('cartao-parcelas').value;

    // Dados mockados/simulados vindos do contexto da tela atual
    const idPedido = 1002; 
    const valorTotal = 250.00;

    // Mudança de estado do botão para indicar carregamento
    btnFinalizar.disabled = true;
    btnFinalizar.innerText = "Processando pagamento...";

    statusDiv.style.display = "block";
    statusDiv.innerHTML = `
        <div class="card" style="background-color: #f5f5f5; text-align: center; padding: 20px;">
            <p class="carregando">Validando com a operadora do cartão...</p>
        </div>
    `;

    try {
        // Faz a requisição para a rota que aponta para o PagamentoController.processar
const resposta = await fetch('http://localhost:3000/api/pagamentos/processar', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        id_pedido: idPedido,
        valor: valorTotal,
        metodo: 'cartao_credito',
        numero_cartao: numeroCartao,
        num_parcelas: parseInt(numParcelas)
    })
});

        const resultado = await resposta.json();

        if (resposta.status === 200) {
            // Pagamento Aprovado com sucesso!
            statusDiv.innerHTML = `
                <div class="alerta-sucesso" style="margin: 0; padding: 20px; text-align: center; border-radius: 8px;">
                    <span class="material-icons" style="font-size: 48px; display: block; margin-bottom: 10px;">check_circle</span>
                    <strong>✓ Pagamento Aprovado!</strong><br>
                    ${resultado.mensagem}<br>
                    <small style="display:block; margin-top:10px;">Redirecionando para suas compras...</small>
                </div>
            `;
            
            // Simula redirecionamento para a tela de acompanhamento após 3 segundos
            setTimeout(() => {
                window.location.href = 'minhasCompras.html';
            }, 3000);

        } else {
            // Tratamento de Recusa (ex: cartão iniciado com '0000') ou Erro 402 do Gateway
            statusDiv.innerHTML = `
                <div class="card" style="border-left: 5px solid #d32f2f; padding: 20px;">
                    <div style="display: flex; align-items: center; gap: 10px; color: #d32f2f;">
                        <span class="material-icons">error</span>
                        <strong>Pagamento Recusado</strong>
                    </div>
                    <p style="margin-top: 10px;">Motivo: ${resultado.erro || 'Transação não autorizada.'}</p>
                    <button onclick="tentarNovamente()" class="btn-blue" style="margin-top: 10px; width: auto;">Tentar outro cartão</button>
                </div>
            `;
            btnFinalizar.disabled = false;
            btnFinalizar.innerText = "CONFIRMAR E PAGAR";
        }

    } catch (erro) {
        // Tratamento de falhas de rede ou erro 500 do servidor interno
        console.error("Erro na comunicação:", erro);
        statusDiv.innerHTML = `
            <div class="card" style="border-left: 5px solid #ff9800; padding: 20px;">
                <div style="display: flex; align-items: center; gap: 10px; color: #ff9800;">
                    <span class="material-icons">warning</span>
                    <strong>Erro de Conexão</strong>
                </div>
                <p style="margin-top: 10px;">Não foi possível contatar o servidor. Tente novamente mais tarde.</p>
            </div>
        `;
        btnFinalizar.disabled = false;
        btnFinalizar.innerText = "CONFIRMAR E PAGAR";
    }
});

function tentarNovamente() {
    document.getElementById('status-pagamento').style.display = 'none';
    document.getElementById('cartao-numero').focus();
}