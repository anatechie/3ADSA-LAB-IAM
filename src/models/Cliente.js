const db = require('../config/database');

class Cliente{
    static async criar(nome, cpf, data_nascimento, email, senha, telefone, cep, logradouro, numero, bairro, cidade, estado){
        const query = `INSERT INTO cliente (nome, cpf, data_nascimento, email, senha, telefone, cep, logradouro, numero, bairro, cidade, estado)
                        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const [resultado] = await db.execute(query, [nome, cpf, data_nascimento, email, senha, telefone, cep, logradouro, numero, bairro, cidade, estado]);
        return resultado.insertId;
    }
}

module.exports = Cliente;