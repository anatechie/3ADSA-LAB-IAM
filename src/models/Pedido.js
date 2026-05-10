const db = require('../config/database')

class Pedido{
    static async criar(id_cliente, id_loja, valor_total){
        const query =`
        INSERT INTO pedido (status, valor_total, data_criacao, data_atualizacao, id_cliente, id_loja)
        VALUES ('Aguardando Pagamento', ?, now(), now(), ?, ?)
        `;

        //? -> substituidas na ordem do array
        const [resultado] = await db.execute(query, [valor_total, id_cliente, id_loja]);
        return resultado.insertId;
    }

    static async buscarPorId(id_pedido){
        const query = `
        SELECT * FROM pedido WHERE id_pedido = ?
        `;
        const [rows] = await db.execute(query, [id_pedido]);
        return rows[0];
    }
}

module.exports = Pedido;