/** MIDDLEWARE de recurso não encontrado */
const notFound = (req, res, next) => {
    const error = new Error(`Não encontrado - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

/** MIDDLEWARE de tratamento de erro */
const errorHandling = (error, req, res, next) => {
    // Caso a response tenha o status 200 (sucesso)
    // significa que ela ainda não foi tratada
    // e deve ser retornada como um erro ao cliente
    // portanto, alteramos o status para 500 (erro no servidor)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.statusCode = statusCode;
    res.json({
        message: error.message,
        stack: error.stack
    });
};

module.exports = {
    notFound,
    errorHandling
};