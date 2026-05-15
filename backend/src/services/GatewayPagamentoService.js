class GatewayPagamentoService {
    static async processarTransacao(dadosPagamento) {
        const { valor, metodo, numero_cartao } = dadosPagamento;
        console.log(`[GATEWAY] Processando pagamento de R$ ${valor} via ${metodo}...`);

        // Simula tempo de rede
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            if (valor <= 0) {
                throw new Error('Valor inválido para transação.');
            }

            if (metodo === 'cartao_credito' && numero_cartao?.startsWith('0000')) {
                return {
                    aprovado: false,
                    mensagem: 'Cartão recusado. Saldo insuficiente ou bloqueado.',
                    codigo_erro: 'REFUSED_BY_BANK'
                };
            }

            return {
                aprovado: true,
                transacao_id: `PAY-${Math.random().toString(36).toUpperCase().substring(2, 12)}`,
                mensagem: 'Pagamento aprovado.',
                auth_code: Math.floor(100000 + Math.random() * 900000)
            };
        } catch (erro) {
            console.error('[ERRO GATEWAY]:', erro.message);
            return { aprovado: false, mensagem: erro.message };
        }
    }
}

module.exports = GatewayPagamentoService;