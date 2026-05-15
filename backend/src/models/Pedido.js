const db = require('../config/database');

class Pedido {
    static async criar(id_cliente, id_loja, valor_total) {
        const query = `
            INSERT INTO pedido (status, valor_total, id_cliente, id_loja)
            VALUES ('Aguardando Pagamento', ?, ?, ?)
        `;
        const [resultado] = await db.execute(query, [valor_total, id_cliente, id_loja]);
        return resultado.insertId;
    }

    static async buscarPorId(id_pedido) {
        const query = 'SELECT * FROM pedido WHERE id_pedido = ?';
        const [rows] = await db.execute(query, [id_pedido]);
        return rows[0];
    }

    static async buscarTodos() {
        const query = `
            SELECT p.id_pedido, p.status as status_pedido, p.valor_total, p.data_criacao,
                   c.nome as cliente_nome, l.nome as loja_nome
            FROM pedido p
            JOIN cliente c ON p.id_cliente = c.id_cliente
            JOIN loja l ON p.id_loja = l.id_loja
            ORDER BY p.id_pedido DESC
        `;
        const [linhas] = await db.execute(query);
        return linhas;
    }

    static async atualizarStatus(id_pedido, status) {
        const query = 'UPDATE pedido SET status = ? WHERE id_pedido = ?';
        const [resultado] = await db.execute(query, [status, id_pedido]);
        return resultado.affectedRows > 0;
    }

    static async deletar(id_pedido) {
        // Remove dependências primeiro ou usa CASCADE no banco. Aqui deletamos direto para fins acadêmicos.
        await db.execute('DELETE FROM mensagem WHERE id_pedido = ?', [id_pedido]);
        await db.execute('DELETE FROM cancelamento WHERE id_pedido = ?', [id_pedido]);
        await db.execute('DELETE FROM pagamento WHERE id_pedido = ?', [id_pedido]);
        
        const query = 'DELETE FROM pedido WHERE id_pedido = ?';
        const [resultado] = await db.execute(query, [id_pedido]);
        return resultado.affectedRows > 0;
    }
}

module.exports = Pedido;