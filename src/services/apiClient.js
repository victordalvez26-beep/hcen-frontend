/**
 * Helper para hacer requests autenticados al backend.
 * Automáticamente agrega el header Authorization con el JWT del localStorage.
 * Funciona igual en localhost y producción (Vercel + Elastic Cloud).
 */
import config from '../config';

/**
 * Obtiene el JWT del localStorage
 */
export const getAuthToken = () => {
  return localStorage.getItem('hcen_access_token');
};

/**
 * Guarda el JWT en localStorage
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('hcen_access_token', token);
  } else {
    localStorage.removeItem('hcen_access_token');
  }
};

/**
 * Elimina el JWT del localStorage (logout)
 */
export const clearAuthToken = () => {
  localStorage.removeItem('hcen_access_token');
};

/**
 * Hace logout completo: redirige a nuestro backend que maneja la redirección a gub.uy
 * 
 * Funciona igual que antes (rama dev), pero ahora pasamos el token como query parameter
 * porque ya no usamos cookies (usamos Authorization header).
 * 
 * Flujo:
 * 1. Frontend redirige a /api/auth/logout?token=...
 * 2. Backend recibe el token, busca la sesión y obtiene el idToken de gub.uy
 * 3. Backend redirige a gub.uy para logout externo (con id_token_hint)
 * 4. gub.uy procesa el logout y redirige de vuelta a POST_LOGOUT_REDIRECT_URI
 * 5. El callback limpia todo y redirige al frontend con ?logout=success
 */
export const logout = () => {
  // Obtener el token ANTES de limpiar localStorage
  const token = getAuthToken();
  
  console.log('🔍 [logout] Iniciando logout');
  console.log('🔍 [logout] Token obtenido de localStorage:', token ? 'SÍ (' + token.substring(0, 50) + '...)' : 'NO HAY TOKEN');
  
  if (!token) {
    console.log('⚠️ [logout] No hay token, haciendo logout local');
    // No hay token, solo limpiar y redirigir al home
    clearAuthToken();
    window.location.href = '/?logout=success';
    return;
  }
  
  // Construir la URL de logout con el token ANTES de limpiar localStorage
  const logoutUrl = `${config.BACKEND_URL}/api/auth/logout?token=${encodeURIComponent(token)}`;
  console.log('🔍 [logout] URL de logout construida:', logoutUrl);
  console.log('🔍 [logout] Token codificado (primeros 50 chars):', encodeURIComponent(token).substring(0, 50) + '...');
  
  // AHORA sí limpiar localStorage (después de obtener el token y construir la URL)
  clearAuthToken();
  console.log('🔍 [logout] localStorage limpiado');
  
  // Redirigir a nuestro backend - el backend manejará todo: buscará el idToken y redirigirá a gub.uy
  console.log('🔍 [logout] Redirigiendo al backend para logout...');
  window.location.href = logoutUrl;
};

/**
 * Hace un fetch autenticado al backend.
 * Automáticamente agrega el header Authorization si hay un token.
 * 
 * @param {string} url - URL relativa o absoluta del endpoint
 * @param {object} options - Opciones para fetch (method, body, headers, etc.)
 * @returns {Promise<Response>} Response del fetch
 */
export const fetchWithAuth = async (url, options = {}) => {
  // Construir URL completa si es relativa
  const fullUrl = url.startsWith('http') ? url : `${config.BACKEND_URL}${url}`;
  
  // Preparar headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Agregar Authorization header si hay token
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('🔍 [apiClient] Token encontrado, agregando Authorization header');
  } else {
    console.log('⚠️ [apiClient] No hay token en localStorage');
  }
  
  // Preparar opciones del fetch
  const fetchOptions = {
    ...options,
    headers,
    // No usar credentials: 'include' porque no usamos cookies
    // credentials: 'include', // Comentado porque usamos Authorization header
  };
  
  console.log('🔍 [apiClient] Haciendo request a:', fullUrl);
  console.log('🔍 [apiClient] Headers:', JSON.stringify(headers, null, 2));
  
  // Hacer el request
  const response = await fetch(fullUrl, fetchOptions);
  
  console.log('🔍 [apiClient] Response status:', response.status);
  
  // Si el token expiró (401), limpiar el token
  if (response.status === 401) {
    clearAuthToken();
  }
  
  return response;
};

/**
 * Helper para hacer GET requests autenticados
 */
export const get = async (url, options = {}) => {
  return fetchWithAuth(url, { ...options, method: 'GET' });
};

/**
 * Helper para hacer POST requests autenticados
 */
export const post = async (url, body, options = {}) => {
  return fetchWithAuth(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  });
};

/**
 * Helper para hacer PUT requests autenticados
 */
export const put = async (url, body, options = {}) => {
  return fetchWithAuth(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body),
  });
};

/**
 * Helper para hacer DELETE requests autenticados
 */
export const del = async (url, options = {}) => {
  return fetchWithAuth(url, { ...options, method: 'DELETE' });
};

/**
 * Helper para hacer PATCH requests autenticados
 */
export const patch = async (url, body, options = {}) => {
  return fetchWithAuth(url, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(body),
  });
};

export default {
  getAuthToken,
  setAuthToken,
  clearAuthToken,
  logout,
  fetchWithAuth,
  get,
  post,
  put,
  delete: del,
  patch,
};

