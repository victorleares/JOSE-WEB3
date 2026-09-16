import api from './api';

export const getUsuarios = async () => {
    const response = await api.get("/usuarios");
    return response;    
}

export const addUsuario = async ({nome, email, senha}) => {
    const response = await api.post("/usuarios", { nome, email, senha});
    return response.data;
}
