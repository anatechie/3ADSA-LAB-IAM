const Pedido = require('../models/Pedido');

class PedidoController {
    async criar(req, res) {
        try {
            const { id_cliente, id_loja, valor_total } = req.body;

            if (!id_cliente || !id_loja || !valor_total) {
                return res.status(400).json({ erro: 'Dados incompletos. Informe id_cliente, id_loja e valor_total.' });
            }

            const idPedido = await Pedido.criar(id_cliente, id_loja, valor_total);
            return res.status(201).json({ mensagem: 'Pedido criado', id_pedido: idPedido });
        } catch (erro) {
            console.error('Erro ao criar pedido:', erro);
            return res.status(500).json({ erro: 'Erro interno ao salvar pedido.' });
        }
    }

    async listarTodos(req, res) {
        try {
            const pedidos = await Pedido.buscarTodos();
            return res.status(200).json(pedidos);
        } catch (erro) {
            console.error('Erro ao listar pedidos:', erro);
            return res.status(500).json({ erro: 'Erro ao buscar pedidos.' });
        }
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const pedido = await Pedido.buscarPorId(id);
            if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado.' });
            return res.status(200).json(pedido);
        } catch (erro) {
            return res.status(500).json({ erro: 'Erro ao buscar o pedido.' });
        }
    }

    async atualizarStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            
            const sucesso = await Pedido.atualizarStatus(id, status);
            if (!sucesso) return res.status(404).json({ erro: 'Pedido não encontrado para atualização.' });
            
            return res.json({ mensagem: 'Status atualizado com sucesso!' });
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao atualizar pedido' });
        }
    }

    async excluir(req, res) {
        try {
            const { id } = req.params;
            const sucesso = await Pedido.deletar(id);
            if (!sucesso) return res.status(404).json({ erro: 'Pedido não encontrado.' });
            
            return res.json({ mensagem: 'Pedido excluído permanentemente.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao excluir pedido. Verifique integridade de dados.' });
        }
    }
}

module.exports = new PedidoController();