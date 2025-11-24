/**
 * Configuración del frontend HCEN
 */
const config = {
  BACKEND_URL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080',
  CALLBACK_URL: process.env.REACT_APP_CALLBACK_URL || 'http://localhost:8080',
};

// Log para verificar las variables de entorno (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 [CONFIG] Variables de entorno cargadas:');
  console.log('  REACT_APP_BACKEND_URL:', process.env.REACT_APP_BACKEND_URL);
  console.log('  REACT_APP_CALLBACK_URL:', process.env.REACT_APP_CALLBACK_URL);
  console.log('  BACKEND_URL configurado:', config.BACKEND_URL);
  console.log('  CALLBACK_URL configurado:', config.CALLBACK_URL);
}

export default config;
