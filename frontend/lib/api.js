import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          if (data.error === 'Error de validación' && data.details) {
            error.response.data.error = `Error de validación: ${data.details.join(', ')}`;
          } else if (data.error === 'El usuario ya existe' || data.error === 'El email ya está registrado') {
            error.response.data.error = 'Este email ya está registrado. Por favor, utiliza otro.';
          }
          break;
        case 401:
          if (data.error === 'Credenciales incorrectas') {
            error.response.data.error = 'Email o contraseña incorrectos. Inténtalo de nuevo.';
          } else if (data.error === 'Token de autenticación requerido') {
            error.response.data.error = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
          } else {
            error.response.data.error = 'No autorizado. Por favor, verifica tus credenciales.';
          }
          break;
        case 403:
          error.response.data.error = 'Acceso denegado. Tu token puede haber expirado.';
          // Opcional: redirigir a login si el token es inválido
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
          break;
        case 404:
          error.response.data.error = 'Recurso no encontrado.';
          break;
        case 409:
          error.response.data.error = 'Este email ya está registrado. Por favor, utiliza otro.';
          break;
        case 422:
          error.response.data.error = 'Error de validación en los datos enviados.';
          break;
        case 500:
          error.response.data.error = 'Error interno del servidor. Por favor, inténtalo más tarde.';
          break;
        default:
          error.response.data.error = data.error || 'Ocurrió un error inesperado.';
      }
      
      if (!error.response.data.error && data.message) {
        error.response.data.error = data.message;
      }
      
    } else if (error.request) {
      error.response = {
        data: {
          error: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
        },
      };
    } else {
      error.response = {
        data: {
          error: 'Error en la configuración de la petición.',
        },
      };
    }
    
    // Mostrar error en consola en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.error('Error en la petición:', error.response?.data?.error || error.message);
    }
    
    return Promise.reject(error);
  }
);

export const get = (url, config = {}) => api.get(url, config);
export const post = (url, data, config = {}) => api.post(url, data, config);
export const put = (url, data, config = {}) => api.put(url, data, config);
export const del = (url, config = {}) => api.delete(url, config);
export const patch = (url, data, config = {}) => api.patch(url, data, config);

export default api;