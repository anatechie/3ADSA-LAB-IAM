const db = require('../config/database');

class Cancelamento {
    static async registrarCancelamento(dados) {
        const { id_pedido, motivo, tipo_solicitante } = dados;
        
       
        const queryInsert = `
            INSERT INTO cancelamento (id_pedido, motivo, tipo_solicitante) 
            VALUES (?, ?, ?)
        `;
        await db.execute(queryInsert, [id_pedido, motivo, tipo_solicitante || 'Cliente']);

        const queryUpdate = `
            UPDATE pedido SET status = 'Cancelado' WHERE id_pedido = ?
        `;
        const [resultado] = await db.execute(queryUpdate, [id_pedido]);
        
        return resultado.affectedRows > 0;
    }
}

module.exports = Cancelamento;