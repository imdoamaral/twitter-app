const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authenticate = require('./auth');
const User = require('./models/User');
const Tweet = require('./models/Tweet');
const { send } = require('express/lib/response');

const router = new Router();

/** ROTAS */

// Boas Vindas
router.get('/', (req, res) => {
    res.send('Bem vindo à disciplina de Banco de Dados 2! 🤓');
});

// Criar usuário
router.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Verifica se o username é valido
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400)
                .send({ error: 'Esse nome de usuário já está em uso.' });
        }

        // Criptografar a senha
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Cria novo usuário no BD
        const user = await User.create({
            username,
            password: hash
        });

        res.status(201).send({
            id: user.id,
            username: user.username
        });
    }

    catch (err) {
        res.status(400);
        next(err);
    }
})

// Login
router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Verifica se o username é valido
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send({ error: "Usuário não encontrado." });
        }

        // Verifica se a senha é valida
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send({ message: "Senha inválida." });
        }

        // Cria token de validação de usuário
        const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET);
        res.header('auth-token', token).send(token);
    }

    catch (err) {
        res.status(400);
        send(err);
    }
});

// Criar tweet
router.post('/tweets', authenticate, async (req, res, next) => {
    const { content } = req.body;

    try {
        const tweet = await Tweet.create({ owner: req.user, content });

        if (!tweet) {
            res.status(400).send({ error: 'Não foi possível criar o tweet.' });
        }

        res.status(201).send(tweet);
    }

    catch (err) {
        res.status(400);
        send(err);
    }
});

// Deletar um tweet
router.delete('/tweets/:id', authenticate, async (req, res, next) => {
    const { id } = req.params;
    console.log(id);

    try {
        await Tweet.deleteOne({ _id: id });
        res.status(200).send({ message: 'Tweet deletado.' });
    }

    catch (err) {
        res.status(400);
        next(err);
    }
});

// Atualizar um tweet (like, unlike)
router.put('/tweets/:id', authenticate, async (req, res, next) => {
    const { id } = req.params;

    try {
        const tweet = await Tweet.findById({ _id: id });

        if (!tweet) {
            return res.status(400).send({ error: 'Tweet não encontrado.' });
        }

        // Verifica se o tweet pertence ao usuairo que esta logado
        if (tweet.owner === req.user._id) {
            return res.status(400).send({ error: 'Não é possível atualizar o tweet.' });
        }

        const tweetAlreadyLiked = tweet.likes.some(like => like == req.user._id);

        // Verifica se tweet ja foi curtido pelo usuario logado
        if (tweetAlreadyLiked) {
            // Se sim, remove a curtida do proprio usuario
            tweet.likes = tweet.likes.filter(like => like != req.user._id);
        } else {
            // Se nao, adiciona a curtida a a propriedade likes
            tweet.likes.push(req.user._id);
        }

        tweet.save();

        res.status(200).send(tweet);
    }

    catch (err) {
        res.status(400);
        next(err);
    }
});

module.exports = router;