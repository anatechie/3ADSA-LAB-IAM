const Cancelamento = require('../models/Cancelamento');

class CancelamentoController {
    async cancelarPedido(req, res) {
        try {
            const { id_pedido, motivo, tipo_solicitante } = req.body;

            if (!id_pedido || !motivo) {
                return res.status(400).json({ erro: 'O ID do pedido e o motivo do cancelamento são obrigatórios.' });
            }

            const sucesso = await Cancelamento.registrarCancelamento({ id_pedido, motivo, tipo_solicitante });

            if (sucesso) {
                return res.status(200).json({
                    mensagem: 'Pedido cancelado com sucesso e estorno solicitado.',
                    id_pedido: id_pedido,
                    status: 'Cancelado'
                });
            }

            return res.status(404).json({ erro: 'Pedido não encontrado.' });
        } catch (erro) {
            console.error('Erro ao cancelar pedido:', erro);
            return res.status(500).json({ erro: 'Erro interno ao processar o cancelamento.' });
        }
    }
}

module.exports = new CancelamentoController();