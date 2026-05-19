const Notificacao = require('../models/Notificacao');

class NotificacaoController {
    async notificarCliente(req, res) {
        try {
            const { id_cliente, tipo, mensagem, id_pedido } = req.body;

            if (!id_cliente || !tipo || !mensagem) {
                return res.status(400).json({ erro: 'ID do cliente, tipo e mensagem são obrigatórios.' });
            }

            // Simula tempo de disparo deEmail real 
            console.log(`[SIMULAÇÃO] Disparando ${tipo} para o Cliente ${id_cliente}...`);

            const id_notificacao = await Notificacao.enviarNotificacao(req.body);
            
            return res.status(201).json({ 
                Mensagem_enviada: true,
                mensagem: `Notificação do tipo '${tipo}' enviada com sucesso!`, 
                id_registro: id_notificacao
            });

        } catch (erro) {
            console.error('Erro ao enviar notificação:', erro);
            return res.status(500).json({ erro: 'Erro interno no serviço de mensagens.' });
        }
    }
}

module.exports = new NotificacaoController();