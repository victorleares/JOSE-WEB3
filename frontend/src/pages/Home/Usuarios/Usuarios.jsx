import { useState, useEffect } from 'react';
import {
    getUsuarios,
    getUsuarioPorId,
    addUsuario,
    editarUsuario,
    excluirUsuario
} from '../../../services/usuariosService';

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);

    // modal de criar/editar
    const [modalAberto, setModalAberto] = useState(false);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [usuarioEditandoId, setUsuarioEditandoId] = useState(null);
    const [form, setForm] = useState({ nome: '', email: '', senha: '' });
    const [salvando, setSalvando] = useState(false);
    const [erroForm, setErroForm] = useState('');

    // busca por id
    const [buscaId, setBuscaId] = useState('');
    const [usuarioBuscado, setUsuarioBuscado] = useState(null);
    const [erroBusca, setErroBusca] = useState('');

    const fetchUsuarios = async () => {
        try {
            const dados = await getUsuarios();
            setUsuarios(dados.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const abrirModalCriar = () => {
        setModoEdicao(false);
        setUsuarioEditandoId(null);
        setForm({ nome: '', email: '', senha: '' });
        setErroForm('');
        setModalAberto(true);
    };

    const abrirModalEditar = (usuario) => {
        setModoEdicao(true);
        setUsuarioEditandoId(usuario.id);
        setForm({ nome: usuario.nome, email: usuario.email, senha: '' });
        setErroForm('');
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setErroForm('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSalvar = async (e) => {
        e.preventDefault();
        setErroForm('');

        if (!form.nome || !form.email || (!modoEdicao && !form.senha)) {
            setErroForm('Preencha nome, email e senha.');
            return;
        }

        try {
            setSalvando(true);

            if (modoEdicao) {
                await editarUsuario(usuarioEditandoId, form);
            } else {
                await addUsuario(form);
            }

            setForm({ nome: '', email: '', senha: '' });
            fecharModal();
            await fetchUsuarios();
        } catch (err) {
            console.log(err);
            setErroForm(err.response?.data?.err || 'Erro ao salvar usuário.');
        } finally {
            setSalvando(false);
        }
    };

    const handleExcluir = async (usuario) => {
        const confirmar = window.confirm(`Excluir o usuário "${usuario.nome}"?`);
        if (!confirmar) return;

        try {
            await excluirUsuario(usuario.id);
            await fetchUsuarios();
        } catch (err) {
            console.log(err);
        }
    };

    const handleBuscarPorId = async (e) => {
        e.preventDefault();
        setErroBusca('');
        setUsuarioBuscado(null);

        if (!buscaId) return;

        try {
            const usuario = await getUsuarioPorId(buscaId);
            setUsuarioBuscado(usuario);
        } catch (err) {
            console.log(err);
            setErroBusca('Usuário não encontrado.');
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Lista de Usuarios</h1>
                <button onClick={abrirModalCriar}>+ Novo usuário</button>
            </div>

            <form onSubmit={handleBuscarPorId} className="busca-id-form">
                <input
                    type="text"
                    placeholder="Buscar por ID"
                    value={buscaId}
                    onChange={(e) => setBuscaId(e.target.value)}
                />
                <button type="submit">Buscar</button>
            </form>
            {erroBusca && <p className="erro">{erroBusca}</p>}
            {usuarioBuscado && (
                <p>
                    Resultado: #{usuarioBuscado.id} - {usuarioBuscado.nome} (
                    {usuarioBuscado.email})
                </p>
            )}

            <ul>
                {usuarios.map(user => (
                    <li key={user.id}>
                        <span>{user.nome}</span>
                        <button onClick={() => abrirModalEditar(user)}>Editar</button>
                        <button onClick={() => handleExcluir(user)}>Excluir</button>
                    </li>
                ))}
            </ul>

            {modalAberto && (
                <div className="modal-overlay" onClick={fecharModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>{modoEdicao ? 'Editar Usuário' : 'Cadastrar Usuário'}</h2>

                        <form onSubmit={handleSalvar}>
                            <label>
                                Nome:
                                <input
                                    type="text"
                                    name="nome"
                                    value={form.nome}
                                    onChange={handleChange}
                                    autoFocus
                                />
                            </label>

                            <label>
                                Email:
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </label>

                            <label>
                                Senha:{modoEdicao && ' (deixe vazio p/ manter)'}
                                <input
                                    type="password"
                                    name="senha"
                                    value={form.senha}
                                    onChange={handleChange}
                                />
                            </label>

                            {erroForm && <p className="erro">{erroForm}</p>}

                            <div className="modal-actions">
                                <button type="button" onClick={fecharModal}>
                                    Cancelar
                                </button>
                                <button type="submit" disabled={salvando}>
                                    {salvando ? 'Salvando...' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Usuarios;
