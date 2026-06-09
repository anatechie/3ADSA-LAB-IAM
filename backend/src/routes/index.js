const { Router } = require('express');
const express = require('express'); // <-- ADICIONE ESTA IMPORTAÇÃO
const router = Router();
const rotas = require('./rotas/index'); // ou o caminho correto para o seu index.js
app.use('/api', rotas);

const LojaController = require('../controllers/LojaController');
const ClienteController = require('../controllers/ClienteController');
const PedidoController = require('../controllers/PedidoController');
const PagamentoController = require('../controllers/PagamentoController');
const TransportadoraController = require('../controllers/TransportadoraController');
const EntregaController = require('../controllers/EntregaController');
const NotificacaoController = require('../controllers/NotificacaoController');
const CancelamentoController = require('../controllers/CancelamentoController');
const MensagemController = require('../controllers/MensagemController');

// Middleware necessário para processar o JSON enviado pelo checkout.js
router.use(express.json()); // <-- ADICIONE ESTA LINHA AQUI

// Clientes 
router.post('/cliente', ClienteController.cadastrar);
router.get('/cliente', ClienteController.listarClientes);

// Lojas 
router.post('/loja', LojaController.cadastrar);

// Transportadora
router.post('/transportadora', TransportadoraController.cadastrarTransportadora);

// Pedidos 
router.post('/pedido', PedidoController.criar);
router.get('/pedido', PedidoController.listarTodos);
router.get('/pedido/:id', PedidoController.buscarPorId);
router.put('/pedido/:id/status', PedidoController.atualizarStatus);
router.delete('/pedido/:id', PedidoController.excluir);

// Pagamento (CORRIGIDO PARA O PADRÃO DO SEU FRONTEND)
router.post('/pagamentos/processar', PagamentoController.processar); // <-- ALTERADA

// Entrega
router.post('/entrega', EntregaController.agendarEntrega);

// Cancelamento 
router.put('/pedido/cancelar', CancelamentoController.cancelarPedido);

// Mensagem
router.post('/mensagens', MensagemController.enviarMensagem);
router.get('/mensagens/:id_pedido', MensagemController.listarMensagens);

// Notificações
router.post('/notificacao', NotificacaoController.notificarCliente);

module.exports = router;