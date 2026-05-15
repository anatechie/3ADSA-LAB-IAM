class TransportadoraService {
    static async calcularFrete(cepOrigem, cepDestino) {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepDestino}/json/`);
            const dadosDestino = await response.json();

            if (dadosDestino.erro) {
                throw new Error('CEP de destino não encontrado.');
            }

            let valorFrete = 15.00;
            let prazoDias = 3;

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
            console.error('Erro ao calcular frete:', erro.message);
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