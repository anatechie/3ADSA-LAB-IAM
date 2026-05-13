const Pedido = require('../models/Pedido');

class PedidoController {
    async criarPedido(req, res) {
        try {
            //pegando campos exigidos
            const {
                id_cliente, id_loja, valor_total
            } = req.body;

            if (!id_cliente || !id_loja || !valor_total) {
                return res.status(400).json({ erro: 'Faltam dados: id_cliente, id_loja e o valor_total. Eles são obrigatórios!' });
            }

            const novoPedidoId = await Pedido.criar(id_cliente, id_loja, valor_total);
            return res.status(201).json({ mensagem: 'Pedido inserido com sucesso!', id_pedido: novoPedidoId, status: 'Aguardando Pagamento' });
        } catch (erro) {
            console.error('Erro ao processar pedido: ', erro);
            return res.status(500).json({ erro: 'Erro interno ao salvar no banco de dados.' });
        }
    }

    async listarPedidos(req, res) {
        try {
            const pedidos = await Pedido.buscarTodos();
            return res.status(200).json(pedidos);
        } catch (erro) {
            console.error('Erro ao listar pedidos:', erro);
            return res.status(500).json({ erro: 'Erro ao buscar pedidos no banco.' });
        }
    }

    async updateStatus(req, res) {
        const { id } = req.params;
        const { status } = req.body;
        try {
            await db.execute('UPDATE pedido SET status = ? WHERE id_pedido = ?', [status, id]);
            res.json({ message: "Status atualizado com sucesso!" });
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar no banco" });
        }
    }

}

module.exports = new PedidoController();