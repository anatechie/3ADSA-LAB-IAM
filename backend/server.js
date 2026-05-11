require('dotenv').config();
const express = require ('express');
const cors = require('cors');
const routes = require('./src/routes');//importa o arquivo central 

const app = express();

//middlewares - tradutor do json
app.use(cors());
app.use(express.json());

//segunda rota 
app.use('/api', routes);
const PORT =process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

/*require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;

// Em vez de só dar um app.listen, vamos guardar ele numa variável
const server = app.listen(PORT, () => {
    console.log(`✅ [OK] Servidor rodando firmemente na porta ${PORT}`);
});

// --- 🛑 ARMADILHAS PARA PEGAR O ERRO INVISÍVEL 🛑 ---

// 1. Pega erros invisíveis na rede/porta
server.on('error', (erro) => {
    console.error('❌ [ERRO NO SERVIDOR] Motivo:', erro.message);
});

// 2. Avisa exatamente o momento em que o Node decide se desligar
process.on('exit', (codigo) => {
    console.warn(`⚠️ [AVISO] O servidor desligou de repente. Código de saída: ${codigo}`);
});

// 3. Pega qualquer outro erro de programação perdido no projeto
process.on('uncaughtException', (erro) => {
    console.error('🔥 [ERRO FATAL ESCONDIDO]', erro);
});*/