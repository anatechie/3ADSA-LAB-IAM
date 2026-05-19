const db = require('../config/database');

class Notificacao{
    static async enviarNotificacao(dados) {
        const { id_cliente, tipo, mensagem, id_pedido } = dados;
        
        const query = `
            INSERT INTO notificacao (id_cliente, tipo, mensagem,  data_envio, id_pedido) 
            VALUES (?, ?, ?, NOW(), ?)
        `;
        
        const [resultado] = await db.execute(query, [id_cliente, tipo, mensagem, id_pedido]);
        return resultado.insertId;
    }
}

module.exports = Notificacao;