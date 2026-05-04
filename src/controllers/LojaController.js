const Loja = require('../models/Loja');

class LojaController{
    async cadastrar(req, res) {
        try{
            //pega os dados passado na requisição
            const {nome, cnpj,  cep, cidade, estado, email, telefone} = req.body;

            if(!nome || !cnpj || !cep){
                return res.status(400).json({erro: 'Nome, cnpj e cep são obrigatórios'});
            }

            //chama o model para salvaer no bd
            const novaLojaId = await Loja.criar(nome, cnpj,  cep, cidade, estado, email, telefone);
            return res.status(201).json({mensagem: 'Loja Cadastrada com sucesso!', id_loja: novaLojaId});

        } catch (erro){
            console.error('Erro ao cadastrar loja: ', erro);

            //if para verificar o tipo do erro:
            if(erro.code === 'ER_DUP_ENTRY'){
                return res.status(409).json({erro: 'Já existe loja cadastrada com o CNPJ informado.'});
            }
            return res.status(500).json({erro: 'Falha interna no servidor.'});
        }
    }
}

module.exports = new LojaController();