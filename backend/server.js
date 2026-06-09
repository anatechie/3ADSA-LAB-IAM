require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

// Rota que o Gateway (ou uma simulação) vai chamar para aprovar o pagamento
app.post('/api/gateway/webhook', (req, res) => {
    // O gateway geralmente envia o ID do pedido e o novo status
    const { id_pedido, status_pagamento } = req.body;

    // Se o pagamento foi aprovado pelo gateway, definimos o status correto
    let novoStatus = 'Aguardando Pagamento';
    if (status_pagamento === 'approved' || status_pagamento === 'success') {
        novoStatus = 'Pagamento Aprovado';
    }

    const query = 'UPDATE pedidos SET status = ?, data_atualizacao = NOW() WHERE id_pedido = ?';

    db.query(query, [novoStatus, id_pedido], (err, result) => {
        if (err) {
            console.error("Erro ao atualizar status do pagamento:", err);
            return res.status(500).json({ error: 'Erro interno ao atualizar status.' });
        }
        
        res.status(200).json({ message: `Pedido ${id_pedido} atualizado para: ${novoStatus}` });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
