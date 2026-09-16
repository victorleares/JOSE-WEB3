const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/', usuarioController.buscarUsuarios);
router.post('/', usuarioController.criarUsuarios);
// editar
// buscarporid
// excluir

module.exports = router;