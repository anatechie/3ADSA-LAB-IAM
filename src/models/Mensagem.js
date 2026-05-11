const db = require('../config/database');

class Mensagem {
    static async enviarMensagem(dados) {
        const { conteudo, id_pedido, id_cliente, id_loja } = dados;
    
        const query = `
            INSERT INTO mensagem (conteudo, id_pedido, id_cliente, id_loja) 
            VALUES (?, ?, ?, ?)
        `;
        
        // null é se caso um dos IDs não seja passado na requisição 
        const [resultado] = await db.execute(query, [
            conteudo, 
            id_pedido, 
            id_cliente || null, 
            id_loja || null
        ]);
        
        return resultado.insertId;
    }
}

module.exports = Mensagem;