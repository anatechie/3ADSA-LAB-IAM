const Pagamento = require('../models/Pagamento');
const GatewayPagamentoService = require('../services/GatewayPagamentoService');

class PagamentoController {
    async processar(req, res) {
        try {
            const { id_pedido, valor, metodo, numero_cartao, num_parcelas } = req.body;

            if (!id_pedido || !valor) {
                return res.status(400).json({ erro: 'Pedido e valor são obrigatórios.' });
            }

            // Consome o serviço externo de gateway
            const repostaGateway = await GatewayPagamentoService.processarTransacao({ valor, metodo, numero_cartao });

            const statusFinal = repostaGateway.aprovado ? 'Aprovado' : 'Recusado';
            
            await Pagamento.registrar(id_pedido, req.body, statusFinal, repostaGateway.transacao_id || 'N/A');

            if (repostaGateway.aprovado) {
                return res.status(200).json({
                    mensagem: 'Pagamento aprovado e registrado!',
                    id_pedido,
                    status: statusFinal
                });
            } else {
                return res.status(402).json({
                    erro: repostaGateway.mensagem,
                    status: statusFinal
                });
            }

        } catch (erro) {
            console.error('Erro no processamento de pagamento:', erro);
            return res.status(500).json({ erro: 'Erro interno ao processar transação.' });
        }
    }
}

module.exports = new PagamentoController();