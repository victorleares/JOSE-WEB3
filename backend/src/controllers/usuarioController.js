const usuarioService = require('../services/usuarioService');

const buscarUsuarios = async (req, res) => {
    const usuarios = await usuarioService.obterTodosUsuarios();
        res.status(200).json(usuarios);
};

module.exports = { buscarUsuarios }