const { Router } = require('express');
const router = Router();

//importando o controller 
const LojaController = require('../controllers/LojaController');
const ClienteController = require('../controllers/ClienteController');
const PedidoController = require('../controllers/PedidoController');
const PagamentoController = require('../controllers/PagamentoController');
const TransportadoraController = require('../controllers/TransportadoraController');
const EntregaController = require('../controllers/EntregaController');
//const TransportadoraController = require('../controllers/TransportadoraController');
const NotificacaoController = require('../controllers/NotificacaoController');
const CancelamentoController = require('../controllers/CancelamentoController');
const MensagemController = require('../controllers/MensagemController');


//verificar pagamento
router.post('/pagamento', PagamentoController.processarPagamento);

//cliente
router.post('/cliente', ClienteController.cadastrar);
router.get('/cliente', ClienteController.listarClientes);

//entrega
router.post('/entrega', EntregaController.agendarEntrega);


//cancelar pedido
router.put('/pedido', CancelamentoController.cancelarPedido);

//gerenciar mensagem
router.post('/mensagem/envio', MensagemController.enviarMensagemCon);

//criar pedido
router.post('/pedido', PedidoController.criarPedido);
router.get('/pedido', PedidoController.listarPedidos)
router.post('/loja', LojaController.cadastrar);
module.exports = router;

//transportadora
router.post('/transportadora', TransportadoraController.cadastrarTransportadora);

//notificar entrega
router.post('/notificacao', NotificacaoController.notificarCliente);
