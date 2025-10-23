// Servicio para obtener configuraciones del backend
const API_BASE_URL = 'http://localhost:8080/api';

export const configService = {
  // Obtener lista de nacionalidades
  async getNacionalidades() {
    try {
      const response = await fetch(`${API_BASE_URL}/config/nacionalidades`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const nacionalidades = await response.json();
      return nacionalidades;
    } catch (error) {
      console.error('Error obteniendo nacionalidades:', error);
      throw error;
    }
  }
};