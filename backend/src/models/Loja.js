const db = require('../config/database');

class Loja{
    //static para chamar Loja.criar() no controller

    static async criar(nome, cnpj, cep, cidade, estado, email, telefone){
        const query = 
        `
        INSERT INTO loja (nome, cnpj, cep, cidade, estado, email, telefone) VALUES(?, ?, ?, ?, ?, ?, ?)

        `;

        const [resultado] = await db.execute(query, [nome, cnpj,  cep, cidade, estado, email, telefone]);
        return resultado.insertId;
    }

    static async buscaCepId(id_loja){
        const query = 'SELECT cep FROM loja WHERE id_loja = ?';
        const [row1] = await db.execute(query, [id_loja]);

        if(row1.length === 0){
            return null;
        }

        return row1[0].cep;
    }
}

module.exports = Loja;