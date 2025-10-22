import React, { useEffect, useState } from 'react';

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
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
        setUser(data);
      } else {
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
    const authUrl = new URL('https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize');
    authUrl.searchParams.set('client_id', '890192');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid personal_info email');
    authUrl.searchParams.set('redirect_uri', 'http://localhost:8080');
    authUrl.searchParams.set('state', Math.random().toString(36).substring(2, 15));
    
    window.location.href = authUrl.toString();
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/logout', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        setUser(null);
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  if (loading) {
    return (
      <div className="slider_area" style={{minHeight: '100vh', display: 'flex', alignItems: 'center'}}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="slider_text text-center">
                <h3>Cargando...</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="slider_area" style={{minHeight: '100vh'}}>
        <div className="slider_active">
          <div className="single_slider d-flex align-items-center slider_bg_1 overlay" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1f2b7b 0%, #3b82f6 50%, #06b6d4 100%)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              background: 'url("/assets/img/banner/banner.png") center/cover',
              opacity: '0.2',
              zIndex: '1'
            }}></div>
            <div className="container" style={{position: 'relative', zIndex: '2'}}>
              <div className="row">
                <div className="col-xl-12">
                  <div className="slider_text text-center">
                    <span style={{
                      color: '#e2e8f0',
                      fontSize: '20px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      marginBottom: '20px',
                      display: 'block'
                    }}>
                      Sistema Nacional de Salud
                    </span>
                    <h3 style={{
                      fontSize: '56px',
                      fontWeight: '800',
                      color: '#ffffff',
                      marginBottom: '25px',
                      textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                      lineHeight: '1.2'
                    }}>
                      <span style={{color: '#fbbf24'}}>Historia Clínica</span> <br />
                      Electrónica Nacional
                    </h3>
                    <p style={{
                      color: '#e2e8f0', 
                      marginTop: '20px', 
                      marginBottom: '50px',
                      fontSize: '18px',
                      fontWeight: '400',
                      maxWidth: '600px',
                      margin: '20px auto 50px',
                      lineHeight: '1.6'
                    }}>
                      Accede de forma segura a tu información médica y mantén un control completo de tu salud
                    </p>
                    {user ? (
                      <a href="/historia-clinica" className="boxed-btn5" style={{
                        padding: '18px 40px',
                        fontSize: '16px',
                        fontWeight: '600',
                        borderRadius: '50px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                        transition: 'all 0.3s ease',
                        backgroundColor: '#ffffff',
                        color: '#1f2b7b',
                        textDecoration: 'none',
                        display: 'inline-block'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f8fafc';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#ffffff';
                        e.target.style.transform = 'translateY(0)';
                      }}>
                        <i className="flaticon-medical" style={{marginRight: '10px'}}></i>
                        Ver Mi Historia Clínica
                      </a>
                    ) : (
                      <a onClick={handleGubUyLogin} className="boxed-btn5" style={{
                        cursor: 'pointer',
                        padding: '18px 40px',
                        fontSize: '16px',
                        fontWeight: '600',
                        borderRadius: '50px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                        transition: 'all 0.3s ease',
                        backgroundColor: '#ffffff',
                        color: '#1f2b7b',
                        textDecoration: 'none',
                        display: 'inline-block'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f8fafc';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#ffffff';
                        e.target.style.transform = 'translateY(0)';
                      }}>
                        <i className="flaticon-user" style={{marginRight: '10px'}}></i>
                        Iniciar Sesión con gub.uy
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Home;