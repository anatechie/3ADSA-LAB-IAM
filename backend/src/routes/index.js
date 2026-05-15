const { Router } = require('express');
const router = Router();

const LojaController = require('../controllers/LojaController');
const ClienteController = require('../controllers/ClienteController');
const PedidoController = require('../controllers/PedidoController');
const PagamentoController = require('../controllers/PagamentoController');
const TransportadoraController = require('../controllers/TransportadoraController');
const EntregaController = require('../controllers/EntregaController');
const NotificacaoController = require('../controllers/NotificacaoController');
const CancelamentoController = require('../controllers/CancelamentoController');
const MensagemController = require('../controllers/MensagemController');

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

// Pagamento 
router.post('/pagamento', PagamentoController.processar);

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