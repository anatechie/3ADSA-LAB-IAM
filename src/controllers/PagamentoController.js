const Pagamento = require('../models/Pagamento');

class PagamentoController {
    async processarPagamento(req, res) {
        try {
            const { id_pedido, valor, metodo, num_parcelas } = req.body;

            if (!id_pedido) {
                return res.status(400).json({ erro: 'O id_pedido é obrigatório.' });
            }

            const sucesso = await Pagamento.aprovar(id_pedido, { valor, metodo, num_parcelas });

            if (sucesso) {
                return res.status(200).json({ 
                    mensagem: 'Pagamento aprovado e registrado!', 
                    id_pedido,
                    status: 'Aprovado'
                });
            }

            return res.status(404).json({ erro: 'Pedido não encontrado.' });
        } catch (erro) {
            console.error('Erro no pagamento:', erro);
            return res.status(500).json({ erro: 'Erro interno ao processar.' });
        }
    }
}

module.exports = new PagamentoController();