const { Router } = require('express');
const router = Router();

//importando o controller 
const LojaController = require('../controllers/LojaController');
const LogisticaController = require('../controllers/LogisticaController');
const ClienteController = require('../controllers/ClienteController');
const PedidoController = require('../controllers/PedidoController');
const PagamentoController = require('../controllers/PagamentoController');
const TransportadoraController = require('../controllers/TransportadoraController');
const EntregaController = require('../controllers/EntregaController');
//const TransportadoraController = require('../controllers/TransportadoraController');
const NotificacaoController = require('../controllers/NotificacaoController');
const CancelamentoController = require('../controllers/CancelamentoController');


//verificar pagamento
router.post('/pagamento', PagamentoController.processarPagamento);

//calcular prazo de entrega
router.get('/logistica/prazo', LogisticaController.consultarPrazo);


//cliente
router.post('/cliente', ClienteController.cadastrar);

//entrega
router.post('/entrega', EntregaController.agendarEntrega);


//cancelar pedido
router.put('/pedido/cancela', CancelamentoController.cancelarPedido);

//gerenciar mensagem
router.post('/mensagem/envio', (req, res) => {
    res.json({status: 'ok', mensagem: '"Rota POST /mensagem/envio acessada'});
});

//criar pedido
router.post('/pedido', PedidoController.criarPedido);

router.post('/loja', LojaController.cadastrar);
module.exports = router;

//transportadora
router.post('/transportadora', TransportadoraController.cadastrarTransportadora);

//notificar entrega
router.post('/notificacao', NotificacaoController.notificarCliente);
