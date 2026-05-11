const db = require('../config/database');

class Transportadora{
    static async criarDados(dados){
        const{nome, cnpj, url_api, cep_galpao, cidade, estado} = dados;
        
        const query = 
        `
        INSERT INTO transportadora (nome, cnpj, url_api, cep_galpao, cidade, estado ) VALUES (?, ?, ?, ?, ?, ?)
         `;

         const [resultado] = await db.execute(query, [nome, cnpj, url_api || null, cep_galpao, cidade || null, estado || null]);
         return resultado.insertId;
    }
}

module.exports = Transportadora;