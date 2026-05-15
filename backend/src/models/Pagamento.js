const db = require('../config/database');

class Pagamento {
    static async registrar(id_pedido, dadosPagamento, statusGateway, transacaoGateway) {
        const { valor, metodo, num_parcelas } = dadosPagamento;
        const linkComprovante = `https://comprovantes.online/transacao/${transacaoGateway}`;

        const queryInsert = `
            INSERT INTO pagamento (
                id_pedido, metodo, status, valor, transacao_gateway, num_parcelas, link_comprovante, data_pagamento
            ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        await db.execute(queryInsert, [
            id_pedido,
            metodo || 'PIX',
            statusGateway,
            valor,
            transacaoGateway,
            num_parcelas || 1,
            linkComprovante
        ]);

        if (statusGateway === 'Aprovado') {
            await db.execute("UPDATE pedido SET status = 'Pagamento Aprovado' WHERE id_pedido = ?", [id_pedido]);
        }
        
        return true;
    }
}

module.exports = Pagamento;