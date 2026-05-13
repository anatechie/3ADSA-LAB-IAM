const db = require('../config/database')

class Pedido {
    static async criar(id_cliente, id_loja, valor_total) {
        const query = `
        INSERT INTO pedido (status, valor_total, data_criacao, data_atualizacao, id_cliente, id_loja)
        VALUES ('Aguardando Pagamento', ?, now(), now(), ?, ?)
        `;

        const [resultado] = await db.execute(query, [valor_total, id_cliente, id_loja]);
        return resultado.insertId;
    }

    static async buscarPorId(id_pedido) {
        const query = `
        SELECT * FROM pedido WHERE id_pedido = ?
        `;
        const [rows] = await db.execute(query, [id_pedido]);
        return rows[0];
    }

    //join, une entrega e pagamento
    static async buscarTodos() {
        const query = `
        SELECT p.id_pedido, p.status as "Status do Pedido: ",  p.valor_total, pag.status as "Status do Pagamento: ", pag.metodo as "Método de Pagamento: ", 
               e.data_envio_prevista, e.prazo_dias, e.cep 
        FROM pedido p 
        LEFT JOIN pagamento pag 
        ON p.id_pedido = pag.id_pedido
        LEFT JOIN entrega e 
        ON p.id_pedido = e.id_pedido
        ORDER BY p.id_pedido DESC
        `;
        const [linhas] = await db.execute(query);
        return linhas;
    }
}

module.exports = Pedido;