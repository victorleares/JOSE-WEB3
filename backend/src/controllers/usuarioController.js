const usuarioService = require('../services/usuarioService');
const bcrypt = require('bcrypt');

const buscarUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioService.obterTodosUsuarios();
        res.status(200).json(usuarios);
    }   catch(err) {
        res.status(500).json({ err: 'Erro interno ao buascar usuarios'});
    }
};

const criarUsuarios = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if(!nome || !email || !senha) return res.status(400).json({ err: 'Dados inválidos' });

        const hash = await bcrypt.hash(senha, 10);

        const usuario = await usuarioService.criarUsuario(nome, email, hash);
        res.status(201).json(usuario);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Erro interno ao criar usuario' });
    }
}

// criar excluir, editar e buscar por id, 
// sequencia de arquivos -> controller, service e routes
// depois no frontend (usuariosService -> Usuarios.jsx)
// no frontend segue a mesma logica do criar que vc fez com slides, aqui pode usar IA a vontade
// não precisa ficar quebrando a cabeça com css nem componentes na tela, pode pedir pra IA

module.exports = { buscarUsuarios, criarUsuarios }