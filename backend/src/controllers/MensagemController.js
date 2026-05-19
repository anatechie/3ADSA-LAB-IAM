const Mensagem = require('../models/Mensagem');

class MensagemController {
    async enviarMensagem(req, res) {
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

async listarMensagens(req, res) {
        try {
            const { id_pedido } = req.params;
            const mensagens = await Mensagem.listarMensagens(id_pedido); // Verifique se seu Model tem essa função
            return res.status(200).json(mensagens);
        } catch (error) {
            console.error('Erro ao listar mensagens:', error);
            return res.status(500).json({ erro: 'Erro ao buscar mensagens.' });
        }
    }
} // fecha a classe

module.exports = new MensagemController();