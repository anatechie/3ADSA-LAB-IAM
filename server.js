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