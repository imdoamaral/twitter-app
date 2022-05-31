const mongoose = require('mongoose');

const Tweet = new mongoose.Schema({
    owner: {
        // Relacionamento do autor do tweet com um usuário
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        required: true,
        min: 1
    },
    likes: [{
        // Relacionamento do like do tweet com um usuário
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
},
    {
        // cria automaticamente os campos 'created_at' e 'updated_at'
        timestamps: true
    }
)

module.exports = mongoose.model('Tweet', Tweet);