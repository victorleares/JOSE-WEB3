const bcrypt = require ('bcrypt');
const Usuario = require('../models/Usuario');

const login = async (email, senha) => {
    const usuario = await Usuario.scope('comSenha').findOne({ where: { email } });

    if (!usuario) {
        throw new Error('CREDENCIAS_INVALIDAS');
    }

    const confere = await bcrypt.compare(senha, usuario.senha);

    if (!confere) {
        throw new Error('CREDENCIAS_INVALIDAS');
    }

    return { id: usuario.id, nome: usuario.nome, email: usuario.email };

};

module.exports = { login };