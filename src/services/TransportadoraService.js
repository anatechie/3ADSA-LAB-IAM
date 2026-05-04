class TransportadoraService {
    static async calcularFrete(cepOrigem, cepDestino) {
        try {
            // Chamada HTTPS nativa do Node.js para buscar dados da localidade
            const response = await fetch(`https://viacep.com.br/ws/${cepDestino}/json/`);
            const dadosDestino = await response.json();

            if (dadosDestino.erro) {
                throw new Error('CEP de destino inválido ou não encontrado.');
            }

            // Simulando o cálculo 
            let valorFrete = 15.00;
            let prazoDias = 3;

            // Se for fora do Distrito Federal, aumenta o prazo e o valor
            if (dadosDestino.uf !== 'DF') {
                valorFrete = 35.50;
                prazoDias = 7;
            }

            return {
                transportadora: 'Correios (Simulado)',
                localidade: `${dadosDestino.localidade} - ${dadosDestino.uf}`,
                valor_frete: valorFrete,
                prazo_dias: prazoDias,
                data_estimada: this.calcularDataEstimada(prazoDias)
            };
        } catch (erro) {
            console.error('Erro na integração com Transportadora:', erro.message);
            throw erro;
        }
    }

    static calcularDataEstimada(dias) {
        const data = new Date();
        data.setDate(data.getDate() + dias);
        return data.toISOString().split('T')[0]; 
    }
}

module.exports = TransportadoraService;