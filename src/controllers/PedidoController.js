const Pedido = require('../models/Pedido');

class PedidoController{
    async criarPedido(req, res){
        try {
            //pegando campos exigidos
            const {
                id_cliente, id_loja, valor_total
            } = req.body;

            if(!id_cliente || !id_loja || !valor_total) {
                return res.status(400).json({erro: 'Faltam dados: id_cliente, id_loja e o valor_total. Eles são obrigatórios!'});
            }

            const novoPedidoId = await Pedido.criar(id_cliente, id_loja, valor_total);
            return res.status(201).json({mensagem: 'Pedido inserido com sucesso!', id_pedido: novoPedidoId, status: 'Aguardando Pagamento'});
        }catch (erro){
            console.error('Erro ao processar pedido: ', erro);
            return res.status(500).json({erro: 'Erro interno ao salvar no banco de dados.'});
        }
    }
}

module.exports = new PedidoController();