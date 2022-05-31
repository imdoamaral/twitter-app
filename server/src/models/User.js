const mongoose = require('mongoose');

const User = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        max: 128
    },
    // relacionamento entre a tabela User e o Tweet
    tweets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet'
    }]
},
    {
        // cria automaticamente os campos 'created_at' e 'updated_at'
        timestamps: true
    }
)

module.exports = mongoose.model('User', User);