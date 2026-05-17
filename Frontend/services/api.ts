// services/api.ts — Cliente Axios centralizado NaHora
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Em desenvolvimento local use localhost; em dispositivo físico use o IP da máquina
export const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Injeta o JWT em todas as requisições autenticadas
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@nahora:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Trata erros globais — extrai mensagem legível
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Erro de conexão com o servidor';
    return Promise.reject(new Error(message));
  }
);

export default api;
