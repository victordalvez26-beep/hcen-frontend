/**
 * Configuración del Frontend HCEN.
 * 
 * Permite configurar la URL del backend mediante variables de entorno.
 * 
 * DESARROLLO LOCAL (por defecto):
 * - BACKEND_URL: http://localhost:8080
 * 
 * PRODUCCIÓN (configurar variable de entorno):
 * - REACT_APP_BACKEND_URL=https://env-6105410.web.elasticloud.uy
 * 
 * Uso:
 * import config from './config';
 * fetch(config.BACKEND_URL + '/api/nodos')
 */

const config = {
  // URL del backend HCEN (configurable por variable de entorno)
  // Para API calls: usa BACKEND_URL + /api/...
  // Para Gub.uy callback: usa CALLBACK_URL
  BACKEND_URL: process.env.REACT_APP_BACKEND_URL || 'https://env-6105410.web.elasticloud.uy/hcen',
  
  // URL completa del callback de Gub.uy
  CALLBACK_URL: process.env.REACT_APP_CALLBACK_URL || 'https://env-6105410.web.elasticloud.uy/hcen/api/auth/login/callback',
};

// Log para debugging (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Configuración Frontend HCEN:');
  console.log('   BACKEND_URL:', config.BACKEND_URL);
  console.log('   CALLBACK_URL:', config.CALLBACK_URL);
  console.log('   Variables de entorno:', 
    process.env.REACT_APP_BACKEND_URL ? 'Configurada ✅' : 'Usando defaults');
}

export default config;


