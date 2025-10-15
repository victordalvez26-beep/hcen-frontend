import React, { useEffect, useState } from 'react';
import './Login.css';

const Login = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const loginStatus = urlParams.get('login');
    const logoutStatus = urlParams.get('logout');
    const error = urlParams.get('error');
    
    if (loginStatus === 'success') {
      console.log('Login exitoso! Verificando sesión...');
      window.history.replaceState({}, document.title, window.location.pathname);
      checkSession();
    } else if (logoutStatus === 'success') {
      console.log('Logout exitoso');
      setUser(null);
      setLoading(false);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      checkSession();
    }
    
    if (error) {
      console.error('Error en autenticación:', error);
      alert('Error en la autenticación: ' + error);
      window.history.replaceState({}, document.title, window.location.pathname);
      setLoading(false);
    }
  }, []);
  
  const checkSession = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/session', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.authenticated) {
        console.log('Sesión activa para:', data.nombre);
        setUser(data);
      } else {
        console.log('No hay sesión activa');
        setUser(null);
      }
    } catch (error) {
      console.error('Error verificando sesión:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGubUyLogin = () => {
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('oauth_state', state);
    
    const authUrl = new URL('https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', '890192');
    authUrl.searchParams.set('redirect_uri', 'http://localhost:8080');
    authUrl.searchParams.set('scope', 'openid personal_info email');
    authUrl.searchParams.set('state', state);
    
    window.location.href = authUrl.toString();
  };

  const handleLogout = () => {
    window.location.href = 'http://localhost:8080/api/auth/logout';
  };

  if (loading) {
    return (
      <div className="login-container">
        <div className="login-content">
          <div className="loading-spinner"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-content">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo">
            <div className="logo-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path 
                  d="M20 4L24 12H32L26 18L28 26L20 22L12 26L14 18L8 12H16L20 4Z" 
                  fill="var(--indigo-dye)"
                />
              </svg>
            </div>
            <span className="logo-text">HCEN</span>
          </div>
        </div>

        <div className="login-card">
          {user ? (
            <>
              <h1 className="login-title">Bienvenido a HCEN</h1>
              <div className="user-info">
                <p><strong>UID:</strong> {user.uid || 'N/A'}</p>
                <p><strong>Nombre Completo:</strong> {user.nombre || 'N/A'}</p>
                <p><strong>Email:</strong> {user.email || 'N/A'}</p>
                <p><strong>Documento:</strong> {user.documento || 'No disponible'}</p>
              </div>
              <div className="user-info-debug">
                <details>
                  <summary>Ver información detallada</summary>
                  <pre>{JSON.stringify(user, null, 2)}</pre>
                </details>
              </div>
              <div className="login-form">
                <button onClick={handleLogout} className="login-button logout-button">
                  Cerrar Sesión
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="login-title">Iniciar Sesión en HCEN</h1>
              <div className="login-form">
                <button onClick={handleGubUyLogin} className="login-button gubuy-button">
                  Iniciar Sesión con gub.uy
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="footer">
          <div className="footer-separator"></div>
          <p className="copyright">© 2024 HCEN. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
