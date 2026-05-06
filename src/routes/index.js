const { Router } = require('express');
const router = Router();

//importando o controller 
const LojaController = require('../controllers/LojaController');
const LogisticaController = require('../controllers/LogisticaController');
const ClienteController = require('../controllers/ClienteController');
const PedidoController = require('../controllers/PedidoController');

//verificar pagamento
router.post('/pagamento/verifica', (req, res) => {
    res.json({status: 'ok', mensagem: 'Rota POST/pagamento/verifica acessada'})
});

//calcular prazo de entrega
router.get('/logistica/prazo', LogisticaController.consultarPrazo);


//cliente
router.post('/cliente', ClienteController.cadastrar);

//notificar entrega
router.post('/notificacao/envio', (req, res) => {
    res.json({status: 'ok', mensagem: 'Rota PUT/pedido/cancela acessada'});
});


//cancelar pedido
router.put('/pedido/cancela', (req, res) => {
    res.json({status:'ok', mensagem: 'Rota PUT /pedido/cancela acessada'});
});

//gerenciar mensagem
router.post('/mensagem/envio', (req, res) => {
    res.json({status: 'ok', mensagem: '"Rota POST /mensagem/envio acessada'});
});

//criar pedido
router.post('/pedido', PedidoController.criarPedido);

router.post('/loja', LojaController.cadastrar);
module.exports = router;

