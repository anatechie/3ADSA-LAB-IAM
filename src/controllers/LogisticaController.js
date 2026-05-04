//importar o model daLOja para q ele busque o cep
const TransportadoraService = require('../services/TransportadoraService');

const Loja = require('../models/Loja');

class LogisticaController{
    async consultarPrazo(req, res){
        try{
            const {cep_destino, id_loja } = req.query;
            
            if(!cep_destino || !id_loja){
                return res.status(400).json({ erro: 'O cep de destino e o ID da loja são obrigatórios.'});
            }

            const cepOrigemLoja = await Loja.buscaCepId(id_loja);

            if(!cepOrigemLoja){
                res.status(404).json({erro: "Loja não encontrada no banco de dados."});
            }

            //faz o calculo na api
            const resultado = await TransportadoraService.calcularFrete(cepOrigemLoja, cep_destino);

            return res.status(200).json(resultado);
        }
        catch(erro){
            console.error('Erro na logística: ', erro);

            return res.status(500).json({erro: erro.message});
        }
    }
}

module.exports = new LogisticaController();