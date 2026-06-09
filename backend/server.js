require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./src/config/database'); // Importa o pool do seu database.js

const app = express();

app.use(cors());
app.use(express.json());

// Rota que o seu front-end vai chamar ao clicar no botão
app.post('/api/pagamentos/processar', async (req, res) => {
    const { id_pedido, numero_cartao } = req.body;

    // Regra simples de simulação baseada na dica do seu HTML: se começar com 0000, recusa
    if (numero_cartao.startsWith('0000')) {
        return res.status(402).json({ erro: 'Cartão recusado pela operadora.' });
    }

    try {
        // Altera o status do pedido no banco de dados para 'Pagamento Aprovado'
        const query = 'UPDATE pedidos SET status = ?, data_atualizacao = NOW() WHERE id_pedido = ?';
        const [result] = await pool.execute(query, ['Pagamento Aprovado', id_pedido]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: 'Pedido não encontrado no banco de dados.' });
        }

        // Retorna a resposta de sucesso para o front-end
        return res.status(200).json({ mensagem: 'Transação autorizada com sucesso!' });

    } catch (error) {
        console.error('Erro ao atualizar o banco de dados:', error);
        return res.status(500).json({ erro: 'Erro interno do servidor ao atualizar pedido.' });
    }
});
// ==========================================
// ROTA PARA LISTAR TODOS OS PEDIDOS (Usada pelo Vendedor e Cliente)
// ==========================================
app.get('/api/pedido', async (req, res) => {
    try {
        // Busca todos os pedidos do banco de dados (ordenados pelo mais recente)
        const [rows] = await pool.execute('SELECT * FROM pedidos ORDER BY id_pedido DESC');
        return res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        return res.status(500).json({ erro: 'Erro ao buscar pedidos no banco de dados.' });
    }
});

// ==========================================
// ROTA PARA ATUALIZAR STATUS DO PEDIDO (Usada pelo Vendedor)
// ==========================================
app.put('/api/pedido/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const query = 'UPDATE pedidos SET status = ?, data_atualizacao = NOW() WHERE id_pedido = ?';
        await pool.execute(query, [status, id]);
        return res.json({ mensagem: 'Status atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        return res.status(500).json({ erro: 'Erro ao atualizar status.' });
    }
});

// ==========================================
// ROTA PARA APAGAR UM PEDIDO (Usada pelo Vendedor)
// ==========================================
app.delete('/api/pedido/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM pedidos WHERE id_pedido = ?', [id]);
        return res.json({ mensagem: 'Pedido excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir pedido:', error);
        return res.status(500).json({ erro: 'Erro ao excluir pedido.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});