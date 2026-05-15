const Entrega = require('../models/Entrega');


class EntregaController {

    async agendarEntrega(req, res) {

        try {

            const { cep, id_transportadora, id_pedido } = req.body;


            if (!cep || !id_transportadora || !id_pedido) {

                return res.status(400).json({ erro: 'o cep, o Id da transportadora eo Id do Pedido são obrigatórios' });

            }


            const id = await Entrega.programarEntrega(req.body);

            return res.status(201).json({

                mensagem: 'Entrega programada no sistema',

                id_entrega: id,

                status: 'Separando o pedido...'

            });

        } catch (erro) {

            console.error('Erro ao programara entrega: ', erro);

            return res.status(500).json({ erro: 'Erro interno ao processar entrega' });

        }

    }

}


module.exports = new EntregaController(); 