const db = require('../config/database');

class Pagamento {
    static async aprovar(id_pedido, dadosPagamento) {
        const { valor, metodo, num_parcelas } = dadosPagamento;

        // Registra o pagamento 
        const queryInsert = `
            INSERT INTO pagamento (
                id_pedido, 
                metodo, 
                status, 
                valor, 
                transacao_gateway, 
                num_parcelas, 
                link_comprovante, 
                data_pagamento
            ) VALUES (?, ?, 'Aprovado', ?, ?, ?, ?, NOW())
        `;

        // Simulando dados qde um gateway
        const transacaoGateway = `gw_${Math.random().toString(36).substr(2, 9)}`;
        const linkComprovante = `https://comprovantes.online/transacao/${transacaoGateway}`;

        await db.execute(queryInsert, [
            id_pedido,
            metodo || 'PIX',
            valor || 0.00,
            transacaoGateway,
            num_parcelas || 1,
            linkComprovante
        ]);

        // 2º Passo: Atualiza o status na tabela de pedido
        const queryUpdate = `
            UPDATE pedido SET status = 'Pagamento Aprovado' WHERE id_pedido = ?
        `;
        const [resultado] = await db.execute(queryUpdate, [id_pedido]);
        
        return resultado.affectedRows > 0;
    }
}

module.exports = Pagamento;