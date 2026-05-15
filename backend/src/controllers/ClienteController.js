const Cliente = require('../models/Cliente');


class ClienteController {

    async cadastrar(req, res) {

        try {

            const {

                nome, cpf, data_nascimento, email, senha,

                telefone, cep, logradouro, numero, bairro, cidade, estado

            } = req.body;


            if (!nome || !cpf || !email || !senha) {

                return res.status(400).json({ erro: 'Nome, CPF, email e senha são obrigatórios.' });

            }


            // Envia para o Model gravar no bd

            const novoClienteId = await Cliente.criar(

                nome, cpf, data_nascimento, email, senha,

                telefone, cep, logradouro, numero, bairro, cidade, estado

            );


            return res.status(201).json({ mensagem: 'Cliente registado com sucesso!', id_cliente: novoClienteId });


        } catch (erro) {

            console.error('Erro ao registar cliente:', erro);

            if (erro.code === 'ER_DUP_ENTRY') {

                return res.status(409).json({ erro: 'Já existe um cliente registado com este CPF ou e-mail.' });

            }

            return res.status(500).json({ erro: 'Falha interna no servidor.' });

        }

    }


    async listarClientes(req, res) {

        try {

            const clientes = await Cliente.buscarTodos();

            return res.status(200).json(clientes);

        } catch (erro) {

            console.error('Erro ao listar clientes:', erro);

            return res.status(500).json({ erro: 'Erro ao carregar lista de clientes.' });

        }

    }


}


module.exports = new ClienteController(); 