const Transportadora = require('../models/Transportadora');

class TransportadoraController{
    async cadastrarTransportadora(req, res){
        try{
            const {nome, cnpj, cep_galpao} = req.body;
            (!nome || !cnpj || !cep_galpao ) 

            if(!nome ||  !cnpj || !cep_galpao){
                return res.status(400).json({erro: 'Nome, cnpj e CEP do galpão dedistribuição são obrigatórios '});
            }

            const id = await  Transportadora.criarDados(req.body);
            return res.status(201).json({mensagem:'Transportadora cadastrada com sucesso', id_transportadora: id});
        } catch(erro){
            console.error('Erro ao cadastrar transportadora', erro);
            return res.status(500).json({erro: 'Erro interno no servidor'});
        }
    }
}

module.exports = new TransportadoraController();