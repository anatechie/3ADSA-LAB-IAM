document.getElementById('form-pagamento').addEventListener('submit', function(event) {
    event.preventDefault();

    const btnFinalizar = document.getElementById('btn-finalizar');
    const statusDiv = document.getElementById('status-pagamento');

    // Mudança de estado do botão para indicar carregamento simulado
    btnFinalizar.disabled = true;
    btnFinalizar.innerText = "Processando pagamento...";

    statusDiv.style.display = "block";
    statusDiv.innerHTML = `
        <div class="alerta-sucesso" style="margin: 0; padding: 20px; text-align: center; border-radius: 8px; background-color: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9;">
            <span class="material-icons" style="font-size: 48px; display: block; margin-bottom: 10px;">check_circle</span>
            <strong>✓ Pagamento Aprovado!</strong><br>
            Sua demonstração foi processada com sucesso.<br>
            <small style="display:block; margin-top:10px;">Redirecionando para a tela de sucesso...</small>
        </div>
    `;
    
    // Redireciona para a nova tela de sucesso após 2.5 segundos
    setTimeout(() => {
        window.location.href = 'sucesso.html';
    }, 2500);
});