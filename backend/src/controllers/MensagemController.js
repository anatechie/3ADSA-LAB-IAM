const Mensagem = require('../models/Mensagem');

class MensagemController {
    async enviarMensagemCon(req, res) {
        try {
            const { conteudo, id_pedido, id_cliente, id_loja } = req.body;

            // Validação dos campos obrigatórios 
            if (!conteudo || !id_pedido) {
                return res.status(400).json({ erro: 'O conteúdo da mensagem e o ID do pedido são obrigatórios.' });
            }

            // Validação remetente
            if (!id_cliente && !id_loja) {
                return res.status(400).json({ erro: 'A mensagem precisa ser enviada por um cliente ou por uma loja.' });
            }

            const id_mensagem = await Mensagem.enviarMensagem(req.body);

            return res.status(201).json({ 
                mensagem: 'Mensagem enviada com sucesso no chat do pedido!', 
                id_mensagem: id_mensagem 
            });

        } catch (erro) {
            console.error('Erro ao enviar mensagem:', erro);
            return res.status(500).json({ erro: 'Erro interno ao processar a mensagem no chat.' });
        }
    }
}

module.exports = new MensagemController();