const db = require('../config/database');

class Entrega{
    static async programarEntrega(dadosEntrega){
        const {cep, endereco, id_transportadora, tipo_frete, prazo_dias, id_pedido} = dadosEntrega;

        const query = 
        `
        INSERT INTO entrega(cep, endereco, id_transportadora, tipo_frete, prazo_dias, data_envio_prevista, id_pedido)
        VALUES (?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL ? DAY), ?)
        `;

        const [resultado] = await db.execute(query, [cep, endereco, id_transportadora, tipo_frete, prazo_dias, prazo_dias, id_pedido]);
        return resultado.insertId;
    }
}

module.exports = Entrega;