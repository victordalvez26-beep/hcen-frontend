import React from 'react';

const Header = ({ user, activePage = '' }) => {
  return (
    <header style={{padding: '0'}}>
      <div className="header-area" style={{padding: '0'}}>
        <div id="sticky-header" className="main-header-area" style={{padding: '8px 0'}}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-3 col-lg-3">
                <div className="logo-img">
                  <a href="/">
                    <img src="/assets/img/logo.png" alt="HCEN" style={{maxHeight: '35px'}} />
                  </a>
                </div>
              </div>
              <div className="col-xl-9 col-lg-9">
                <div className="menu_wrap d-none d-lg-block">
                  <div className="menu_wrap_inner d-flex align-items-center justify-content-end">
                    <div className="main-menu">
                      <nav>
                        <ul id="navigation" style={{marginBottom: '0', fontSize: '14px'}}>
                          <li><a href="/" className={activePage === 'home' ? 'active' : ''}>Inicio</a></li>
                          <li><a href="/historia-clinica" className={activePage === 'historia' ? 'active' : ''}>Historia Clínica</a></li>
                          <li><a href="/about" className={activePage === 'about' ? 'active' : ''}>Acerca de</a></li>
                          <li><a href="/contact" className={activePage === 'contact' ? 'active' : ''}>Contacto</a></li>
                        </ul>
                      </nav>
                    </div>
                    {user ? (
                      <div className="book_room">
                        <div className="book_btn">
                          <a href="/historia-clinica" className="boxed-btn3" style={{
                            marginRight: '8px',
                            padding: '6px 16px',
                            fontSize: '13px',
                            backgroundColor: '#3b82f6',
                            color: '#ffffff',
                            borderRadius: '4px',
                            textDecoration: 'none'
                          }}>
                            Ver Historia Clínica
                          </a>
                          <a href="http://localhost:8080/api/auth/logout" style={{
                            padding: '6px 16px',
                            fontSize: '13px',
                            backgroundColor: '#dc2626',
                            color: '#ffffff',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease'
                          }}>
                            Cerrar Sesión
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="book_room">
                        <div className="book_btn">
                          <a onClick={() => {
                            const authUrl = new URL('https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize');
                            authUrl.searchParams.set('client_id', '890192');
                            authUrl.searchParams.set('response_type', 'code');
                            authUrl.searchParams.set('scope', 'openid personal_info email');
                            authUrl.searchParams.set('redirect_uri', 'http://localhost:8080');
                            authUrl.searchParams.set('state', Math.random().toString(36).substring(2, 15));
                            window.location.href = authUrl.toString();
                          }} style={{
                            cursor: 'pointer',
                            padding: '6px 16px',
                            fontSize: '13px',
                            backgroundColor: '#3b82f6',
                            color: '#ffffff',
                            borderRadius: '4px',
                            textDecoration: 'none'
                          }}>
                            Iniciar Sesión
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="mobile_menu d-block d-lg-none"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
