import { Search } from 'lucide-react';
import api from './api';

export const getUsuarios = async () => {
    const response = await api.get("/usuarios");
    return response;
    
}
