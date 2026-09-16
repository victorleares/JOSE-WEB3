const Usuario = require('../models/Usuario');

const obterTodosUsuarios = async () => {
    return await Usuario.findAll();
};

const criarUsuario = async (nome, email, senha) => {
    return await Usuario.create({ nome, email, senha })
}

module.exports = { obterTodosUsuarios, criarUsuario }