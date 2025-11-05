import React from 'react';

const Header = ({ user, activePage = '' }) => {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
      boxShadow: '0 2px 20px rgba(0,0,0,0.15)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <img 
                src="/assets/img/logo.png" 
                alt="HCEN" 
                style={{ height: '45px', marginRight: '12px' }} 
              />
              <span style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#ffffff',
                letterSpacing: '-0.5px'
              }}>
                HCEN
              </span>
            </a>
          </div>

          {/* Navigation */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <div style={{ display: 'flex', gap: '32px' }}>
              <a 
                href="/" 
                style={{
                  color: activePage === 'home' ? '#ffffff' : '#e5e7eb',
                  textDecoration: 'none',
                  fontWeight: activePage === 'home' ? '600' : '500',
                  fontSize: '16px',
                  transition: 'color 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                onMouseLeave={(e) => e.target.style.color = activePage === 'home' ? '#ffffff' : '#e5e7eb'}
              >
                Inicio
                {activePage === 'home' && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-8px',
                    left: '0',
                    right: '0',
                    height: '2px',
                    backgroundColor: '#ffffff',
                    borderRadius: '1px'
                  }} />
                )}
              </a>
              
              <a 
                href="/historia-clinica" 
                style={{
                  color: activePage === 'historia' ? '#ffffff' : '#e5e7eb',
                  textDecoration: 'none',
                  fontWeight: activePage === 'historia' ? '600' : '500',
                  fontSize: '16px',
                  transition: 'color 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                onMouseLeave={(e) => e.target.style.color = activePage === 'historia' ? '#ffffff' : '#e5e7eb'}
              >
                Historia Clínica
                {activePage === 'historia' && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-8px',
                    left: '0',
                    right: '0',
                    height: '2px',
                    backgroundColor: '#ffffff',
                    borderRadius: '1px'
                  }} />
                )}
              </a>

              {user && user.rol === 'AD' && (
                <>
                  <a 
                    href="/gestion-clinicas" 
                    style={{
                      color: activePage === 'gestion-clinicas' ? '#ffffff' : '#e5e7eb',
                      textDecoration: 'none',
                      fontWeight: activePage === 'gestion-clinicas' ? '600' : '500',
                      fontSize: '16px',
                      transition: 'color 0.2s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.target.style.color = activePage === 'gestion-clinicas' ? '#ffffff' : '#e5e7eb'}
                  >
                    Gestión de Clínicas
                    {activePage === 'gestion-clinicas' && (
                      <div style={{
                        position: 'absolute',
                        bottom: '-8px',
                        left: '0',
                        right: '0',
                        height: '2px',
                        backgroundColor: '#ffffff',
                        borderRadius: '1px'
                      }} />
                    )}
                  </a>
                  <a 
                    href="/gestion-usuarios" 
                    style={{
                      color: activePage === 'gestion-usuarios' ? '#ffffff' : '#e5e7eb',
                      textDecoration: 'none',
                      fontWeight: activePage === 'gestion-usuarios' ? '600' : '500',
                      fontSize: '16px',
                      transition: 'color 0.2s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.target.style.color = activePage === 'gestion-usuarios' ? '#ffffff' : '#e5e7eb'}
                  >
                    Gestión de Usuarios
                    {activePage === 'gestion-usuarios' && (
                      <div style={{
                        position: 'absolute',
                        bottom: '-8px',
                        left: '0',
                        right: '0',
                        height: '2px',
                        backgroundColor: '#ffffff',
                        borderRadius: '1px'
                      }} />
                    )}
                  </a>
                  <a 
                    href="/gestion-prestadores" 
                    style={{
                      color: activePage === 'gestion-prestadores' ? '#ffffff' : '#e5e7eb',
                      textDecoration: 'none',
                      fontWeight: activePage === 'gestion-prestadores' ? '600' : '500',
                      fontSize: '16px',
                      transition: 'color 0.2s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.target.style.color = activePage === 'gestion-prestadores' ? '#ffffff' : '#e5e7eb'}
                  >
                    Gestión de Prestadores
                    {activePage === 'gestion-prestadores' && (
                      <div style={{
                        position: 'absolute',
                        bottom: '-8px',
                        left: '0',
                        right: '0',
                        height: '2px',
                        backgroundColor: '#ffffff',
                        borderRadius: '1px'
                      }} />
                    )}
                  </a>
                </>
              )}


              <a 
                href="/contact" 
                style={{
                  color: activePage === 'contact' ? '#ffffff' : '#e5e7eb',
                  textDecoration: 'none',
                  fontWeight: activePage === 'contact' ? '600' : '500',
                  fontSize: '16px',
                  transition: 'color 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                onMouseLeave={(e) => e.target.style.color = activePage === 'contact' ? '#ffffff' : '#e5e7eb'}
              >
                Contacto
                {activePage === 'contact' && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-8px',
                    left: '0',
                    right: '0',
                    height: '2px',
                    backgroundColor: '#ffffff',
                    borderRadius: '1px'
                  }} />
                )}
              </a>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {user ? (
                <a 
                  href="http://localhost:8080/api/auth/logout" 
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                    border: '2px solid #dc2626',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#b91c1c';
                    e.target.style.borderColor = '#b91c1c';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#dc2626';
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Cerrar Sesión
                </a>
              ) : (
                <a 
                  onClick={() => {
                    const authUrl = new URL('https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize');
                    authUrl.searchParams.set('client_id', '890192');
                    authUrl.searchParams.set('response_type', 'code');
                    authUrl.searchParams.set('scope', 'openid personal_info email');
                    authUrl.searchParams.set('redirect_uri', 'http://localhost:8080');
                    authUrl.searchParams.set('state', Math.random().toString(36).substring(2, 15));
                    window.location.href = authUrl.toString();
                  }} 
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#ffffff',
                    color: '#3b82f6',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                    border: '2px solid #ffffff',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f8fafc';
                    e.target.style.color = '#1e40af';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.color = '#3b82f6';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Iniciar Sesión
                </a>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
