const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const router = require('./routes');
const middlewares = require('./middlewares');

const app = express();

/** Middlewares */
app.use(express.json());
app.use(morgan('common'));
app.use(cors({ origin: 'http://localhost:3000' }));

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => console.log('Banco de dados conectado!'));

app.use(router);

// Middleware de recurso não encontrado
app.use(middlewares.notFound);
// Middleware de tratamento de erro
app.use(middlewares.errorHandling);

const PORT = 3333;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});