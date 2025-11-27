import React, { useState, useEffect } from 'react';
import config from '../config';

const Header = ({ user, activePage = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (windowWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [windowWidth]);

  const isMobile = windowWidth < 768;

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
          <div style={{ display: 'flex', alignItems: 'center', flex: '0 0 auto' }}>
            <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <img 
                src="/assets/img/logo.png" 
                alt="HCEN" 
                style={{ 
                  height: isMobile ? '35px' : '45px', 
                  marginRight: isMobile ? '8px' : '12px' 
                }} 
              />
              <span style={{
                fontSize: isMobile ? '18px' : '24px',
                fontWeight: '700',
                color: '#ffffff',
                letterSpacing: '-0.5px'
              }}>
                HCEN
              </span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          )}

          {/* Navigation */}
          <nav style={{ 
            display: isMobile ? (isMobileMenuOpen ? 'flex' : 'none') : 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? '20px' : '40px',
            position: isMobile ? 'absolute' : 'relative',
            top: isMobile ? '70px' : 'auto',
            left: isMobile ? '0' : 'auto',
            right: isMobile ? '0' : 'auto',
            background: isMobile ? 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' : 'transparent',
            padding: isMobile ? '20px' : '0',
            boxShadow: isMobile ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
            width: isMobile ? '100%' : 'auto'
          }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? '20px' : '32px',
              width: isMobile ? '100%' : 'auto'
            }}>
              <a 
                href="/" 
                onClick={() => isMobile && setIsMobileMenuOpen(false)}
                style={{
                  color: activePage === 'home' ? '#ffffff' : '#e5e7eb',
                  textDecoration: 'none',
                  fontWeight: activePage === 'home' ? '600' : '500',
                  fontSize: isMobile ? '18px' : '16px',
                  transition: 'color 0.2s ease',
                  position: 'relative',
                  padding: isMobile ? '8px 0' : '0',
                  width: isMobile ? '100%' : 'auto'
                }}
                onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                onMouseLeave={(e) => e.target.style.color = activePage === 'home' ? '#ffffff' : '#e5e7eb'}
              >
                Inicio
                {activePage === 'home' && !isMobile && (
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
                onClick={() => isMobile && setIsMobileMenuOpen(false)}
                style={{
                  color: activePage === 'historia' ? '#ffffff' : '#e5e7eb',
                  textDecoration: 'none',
                  fontWeight: activePage === 'historia' ? '600' : '500',
                  fontSize: isMobile ? '18px' : '16px',
                  transition: 'color 0.2s ease',
                  position: 'relative',
                  padding: isMobile ? '8px 0' : '0',
                  width: isMobile ? '100%' : 'auto'
                }}
                onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                onMouseLeave={(e) => e.target.style.color = activePage === 'historia' ? '#ffffff' : '#e5e7eb'}
              >
                Historia Clínica
                {activePage === 'historia' && !isMobile && (
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

              {user && user.rol !== 'AD' && (
                <a 
                  href="/mi-perfil" 
                  onClick={() => isMobile && setIsMobileMenuOpen(false)}
                  style={{
                    color: activePage === 'mi-perfil' ? '#ffffff' : '#e5e7eb',
                    textDecoration: 'none',
                    fontWeight: activePage === 'mi-perfil' ? '600' : '500',
                    fontSize: isMobile ? '18px' : '16px',
                    transition: 'color 0.2s ease',
                    position: 'relative',
                    padding: isMobile ? '8px 0' : '0',
                    width: isMobile ? '100%' : 'auto'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.target.style.color = activePage === 'mi-perfil' ? '#ffffff' : '#e5e7eb'}
                >
                  Mi Perfil
                  {activePage === 'mi-perfil' && !isMobile && (
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
              )}

              {user && user.rol === 'AD' && (
                <>
                  <a 
                    href="/gestion-clinicas" 
                    onClick={() => isMobile && setIsMobileMenuOpen(false)}
                    style={{
                      color: activePage === 'gestion-clinicas' ? '#ffffff' : '#e5e7eb',
                      textDecoration: 'none',
                      fontWeight: activePage === 'gestion-clinicas' ? '600' : '500',
                      fontSize: isMobile ? '18px' : '16px',
                      transition: 'color 0.2s ease',
                      position: 'relative',
                      padding: isMobile ? '8px 0' : '0',
                      width: isMobile ? '100%' : 'auto',
                      whiteSpace: isMobile ? 'nowrap' : 'normal'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.target.style.color = activePage === 'gestion-clinicas' ? '#ffffff' : '#e5e7eb'}
                  >
                    {isMobile ? 'Clínicas' : 'Gestión de Clínicas'}
                    {activePage === 'gestion-clinicas' && !isMobile && (
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
                    onClick={() => isMobile && setIsMobileMenuOpen(false)}
                    style={{
                      color: activePage === 'gestion-usuarios' ? '#ffffff' : '#e5e7eb',
                      textDecoration: 'none',
                      fontWeight: activePage === 'gestion-usuarios' ? '600' : '500',
                      fontSize: isMobile ? '18px' : '16px',
                      transition: 'color 0.2s ease',
                      position: 'relative',
                      padding: isMobile ? '8px 0' : '0',
                      width: isMobile ? '100%' : 'auto',
                      whiteSpace: isMobile ? 'nowrap' : 'normal'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.target.style.color = activePage === 'gestion-usuarios' ? '#ffffff' : '#e5e7eb'}
                  >
                    {isMobile ? 'Usuarios' : 'Gestión de Usuarios'}
                    {activePage === 'gestion-usuarios' && !isMobile && (
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
                    onClick={() => isMobile && setIsMobileMenuOpen(false)}
                    style={{
                      color: activePage === 'gestion-prestadores' ? '#ffffff' : '#e5e7eb',
                      textDecoration: 'none',
                      fontWeight: activePage === 'gestion-prestadores' ? '600' : '500',
                      fontSize: isMobile ? '18px' : '16px',
                      transition: 'color 0.2s ease',
                      position: 'relative',
                      padding: isMobile ? '8px 0' : '0',
                      width: isMobile ? '100%' : 'auto',
                      whiteSpace: isMobile ? 'nowrap' : 'normal'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.target.style.color = activePage === 'gestion-prestadores' ? '#ffffff' : '#e5e7eb'}
                  >
                    {isMobile ? 'Prestadores' : 'Gestión de Prestadores'}
                    {activePage === 'gestion-prestadores' && !isMobile && (
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
                    href="/reportes" 
                    onClick={() => isMobile && setIsMobileMenuOpen(false)}
                    style={{
                      color: activePage === 'reportes' ? '#ffffff' : '#e5e7eb',
                      textDecoration: 'none',
                      fontWeight: activePage === 'reportes' ? '600' : '500',
                      fontSize: isMobile ? '18px' : '16px',
                      transition: 'color 0.2s ease',
                      position: 'relative',
                      padding: isMobile ? '8px 0' : '0',
                      width: isMobile ? '100%' : 'auto'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.target.style.color = activePage === 'reportes' ? '#ffffff' : '#e5e7eb'}
                  >
                    Reportes
                    {activePage === 'reportes' && !isMobile && (
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
                onClick={() => isMobile && setIsMobileMenuOpen(false)}
                style={{
                  color: activePage === 'contact' ? '#ffffff' : '#e5e7eb',
                  textDecoration: 'none',
                  fontWeight: activePage === 'contact' ? '600' : '500',
                  fontSize: isMobile ? '18px' : '16px',
                  transition: 'color 0.2s ease',
                  position: 'relative',
                  padding: isMobile ? '8px 0' : '0',
                  width: isMobile ? '100%' : 'auto'
                }}
                onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                onMouseLeave={(e) => e.target.style.color = activePage === 'contact' ? '#ffffff' : '#e5e7eb'}
              >
                Contacto
                {activePage === 'contact' && !isMobile && (
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
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              flexDirection: isMobile ? 'column' : 'row',
              width: isMobile ? '100%' : 'auto',
              marginTop: isMobile ? '20px' : '0'
            }}>
              {user ? (
                <a 
                  href="http://localhost:8080/api/auth/logout" 
                  onClick={() => isMobile && setIsMobileMenuOpen(false)}
                  style={{
                    padding: isMobile ? '12px 20px' : '10px 20px',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: isMobile ? '16px' : '14px',
                    transition: 'all 0.2s ease',
                    border: '2px solid #dc2626',
                    cursor: 'pointer',
                    width: isMobile ? '100%' : 'auto',
                    textAlign: 'center'
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
                <button
                  type="button"
                  onClick={() => {
                    const authUrl = new URL('https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize');
                    authUrl.searchParams.set('client_id', '890192');
                    authUrl.searchParams.set('response_type', 'code');
                    authUrl.searchParams.set('scope', 'openid personal_info email');
                    authUrl.searchParams.set('redirect_uri', config.CALLBACK_URL);
                    authUrl.searchParams.set('state', Math.random().toString(36).substring(2, 15));
                    window.location.href = authUrl.toString();
                  }} 
                  style={{
                    padding: isMobile ? '12px 20px' : '10px 20px',
                    backgroundColor: '#ffffff',
                    color: '#3b82f6',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: isMobile ? '16px' : '14px',
                    transition: 'all 0.2s ease',
                    border: '2px solid #ffffff',
                    cursor: 'pointer',
                    width: isMobile ? '100%' : 'auto',
                    textAlign: 'center'
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
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
