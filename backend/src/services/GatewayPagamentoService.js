class GatewayPagamentoService {
 
    static async processarTransacao(dadosPagamento) {
        const { valor, metodo, numero_cartao } = dadosPagamento;

        console.log(`[GATEWAY] Conectando ao servidor da operadora para processar R$ ${valor}...`);

        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            if (valor <= 0) {
                throw new Error('Valor da transação inválido.');
            }
            if (metodo === 'cartao_credito' && numero_cartao?.startsWith('0000')) {
                return {
                    aprovado: false,
                    mensagem: 'Cartão recusado pela operadora (Saldo insuficiente ou bloqueado).',
                    codigo_erro: 'REFUSED_BY_BANK'
                };
            }

            // Caso de sucesso
            return {
                aprovado: true,
                transacao_id: `PAY-${Math.random().toString(36).toUpperCase().substring(2, 12)}`,
                mensagem: 'Pagamento autorizado com sucesso!',
                auth_code: Math.floor(100000 + Math.random() * 900000)
            };

        } catch (erro) {
            console.error('[GATEWAY ERROR]:', erro.message);
            return { aprovado: false, mensagem: erro.message };
        }
    }
}

module.exports = GatewayPagamentoService;