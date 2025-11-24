import React, { useEffect, useState, useCallback, useRef } from 'react';
import config from '../config';
import { setAuthToken, clearAuthToken, fetchWithAuth, getAuthToken, logout } from '../services/apiClient';

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const tokenProcessedRef = useRef(false); // Protección para evitar procesar el token dos veces

  const checkSession = useCallback(async () => {
    try {
      // Asegurar que el loading esté activo mientras verificamos
      setLoading(true);
      
      // Esperar un momento para asegurar que localStorage esté completamente actualizado
      // Esto previene problemas de timing cuando el token se acaba de guardar
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Verificar si hay token en localStorage (después de la pequeña espera)
      let token = getAuthToken();
      console.log('🔍 [DEBUG] checkSession - Token en localStorage (después de espera):', token ? 'SÍ' : 'NO');
      
      // Si aún no hay token, esperar un poco más (puede estar guardándose)
      if (!token) {
        console.log('⏳ [DEBUG] Token no encontrado, esperando un poco más...');
        await new Promise(resolve => setTimeout(resolve, 100));
        token = getAuthToken();
        console.log('🔍 [DEBUG] checkSession - Token en localStorage (después de segunda espera):', token ? 'SÍ' : 'NO');
      }
      
      // Si no hay token, no hacer la llamada
      if (!token) {
        console.log('⚠️ [DEBUG] checkSession - No hay token, retornando sin llamar al backend');
        setUser(null);
        setLoading(false);
        return;
      }
      
      // Usar helper para requests autenticados (agrega Authorization header automáticamente)
      const response = await fetchWithAuth('/api/auth/session', {
        method: 'GET',
      });

      console.log('🔍 [DEBUG] checkSession - Response status:', response.status);
      const data = await response.json();
      console.log('🔍 [DEBUG] checkSession - Response data:', data);

      if (data.authenticated) {
        console.log('✅ Usuario autenticado:', data.nombre);
        console.log('🔍 [DEBUG] setUser llamado con:', JSON.stringify(data, null, 2));
        
        // Actualizar estado del usuario y loading en la misma actualización
        // React agrupará estas actualizaciones y el componente se renderizará con ambos cambios
        setUser(data);
        
        // Usar setTimeout para asegurar que React procese primero setUser antes de setLoading(false)
        // Esto garantiza que cuando el componente se renderice con loading=false, user ya esté disponible
        setTimeout(() => {
          setLoading(false);
          console.log('🔍 [DEBUG] setLoading(false) ejecutado - Usuario debería estar visible ahora');
        }, 100); // Esperar un poco más para asegurar que el estado se actualice
        
        console.log('🔍 [DEBUG] setUser ejecutado, esperando para setLoading(false)');
      } else {
        console.log('❌ Usuario no autenticado');
        setUser(null);
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Error verificando sesión:', error);
      setUser(null);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Verificar si hay token temporal en la URL para intercambiar
    const urlParams = new URLSearchParams(window.location.search);
    const loginStatus = urlParams.get('login');
    const logoutStatus = urlParams.get('logout');
    const tempToken = urlParams.get('token');
    
    console.log('🔍 [DEBUG] Home.js useEffect ejecutado');
    console.log('🔍 [DEBUG] URL completa:', window.location.href);
    console.log('🔍 [DEBUG] loginStatus:', loginStatus);
    console.log('🔍 [DEBUG] logoutStatus:', logoutStatus);
    console.log('🔍 [DEBUG] tempToken:', tempToken ? 'PRESENTE' : 'NO PRESENTE');
    console.log('🔍 [DEBUG] tempToken valor:', tempToken);
    console.log('🔍 [DEBUG] tokenProcessedRef.current:', tokenProcessedRef.current);
    
    // Manejar logout exitoso
    if (logoutStatus === 'success') {
      console.log('✅ Logout exitoso, limpiando estado');
      clearAuthToken();
      setUser(null);
      setLoading(false);
      // Limpiar URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }
    
    // Si ya se procesó el token, solo verificar sesión si el token ya está en localStorage
    // Esto previene que React StrictMode (que ejecuta useEffect dos veces) cause problemas
    if (tokenProcessedRef.current) {
      const existingToken = getAuthToken();
      if (existingToken) {
        console.log('✅ Token ya procesado y presente en localStorage, verificando sesión...');
        // Mantener loading en true hasta que la sesión se verifique
        checkSession();
      } else {
        console.log('⏳ Token siendo procesado, esperando a que se complete el intercambio...');
        // Mantener loading en true mientras se procesa
        setLoading(true);
      }
      return;
    }
    
    if (loginStatus === 'success' && tempToken) {
      console.log('✅ Login exitoso! Intercambiando token temporal...');
      tokenProcessedRef.current = true; // Marcar como procesado antes de hacer la llamada
      // Asegurar que loading esté en true durante todo el proceso
      setLoading(true);
      exchangeTokenAndSetCookie(tempToken);
    } else {
      // Solo verificar sesión si hay token en localStorage (no durante el proceso de login)
      const existingToken = getAuthToken();
      if (existingToken) {
        console.log('🔍 [DEBUG] Token encontrado en localStorage, verificando sesión...');
        checkSession();
      } else {
        console.log('🔍 [DEBUG] No hay token en localStorage, esperando login...');
        setLoading(false); // No hay sesión, dejar de cargar
      }
    }
  }, [checkSession]);
  
  const exchangeTokenAndSetCookie = async (tempToken) => {
    // Protección adicional: si ya se procesó, no hacer nada
    if (tokenProcessedRef.current && !tempToken) {
      console.log('⚠️ Token ya procesado, evitando llamada duplicada');
      return;
    }
    
    // Asegurar que loading esté activo durante todo el proceso
    setLoading(true);
    
    try {
      console.log('🔄 Intercambiando token temporal:', tempToken);
      // Intercambiar token temporal por JWT real
      const response = await fetch(`${config.BACKEND_URL || 'http://localhost:8080'}/api/auth/exchange-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tempToken: tempToken })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        // Si el error es 401 (token ya usado), no es crítico, solo loguear
        if (response.status === 401) {
          console.warn('⚠️ Token ya fue usado (401), probablemente procesado en otra ejecución');
          // Limpiar URL y verificar sesión de todas formas
          window.history.replaceState({}, document.title, window.location.pathname);
          await checkSession();
          return;
        }
        throw new Error(errorData.error || 'Error intercambiando token');
      }
      
      const data = await response.json();
      const jwtToken = data.jwt;
      const expires = data.expires || 86400; // 24 horas por defecto
      
      console.log('✅ Token recibido del backend');
      
      // Guardar JWT en localStorage (funciona cross-domain)
      setAuthToken(jwtToken);
      
      // Verificar que el token se guardó correctamente
      const savedToken = getAuthToken();
      if (!savedToken) {
        throw new Error('Token no se guardó correctamente en localStorage');
      }
      console.log('🔍 [DEBUG] Token confirmado en localStorage:', savedToken ? 'SÍ' : 'NO');
      console.log('🔍 [DEBUG] Token (primeros 50 chars):', savedToken ? savedToken.substring(0, 50) + '...' : 'null');
      
      console.log('✅ Token intercambiado y guardado en localStorage');
      
      // Limpiar URL inmediatamente (remover token de la barra de direcciones)
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Esperar un momento para asegurar que localStorage esté completamente sincronizado
      // Esto previene que checkSession se ejecute antes de que el token esté disponible
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verificar sesión (el token ya está guardado y hemos esperado)
      // Usar await para asegurar que se complete antes de continuar
      console.log('🔍 [DEBUG] Llamando a checkSession después de guardar token');
      await checkSession(); // Esperar a que se complete
      console.log('🔍 [DEBUG] checkSession completado - El componente debería re-renderizarse automáticamente');
      
    } catch (error) {
      console.error('❌ Error intercambiando token:', error);
      // Si el error es porque el token ya fue usado, no mostrar alert
      if (error.message && error.message.includes('401')) {
        console.warn('⚠️ Token ya procesado, continuando...');
        window.history.replaceState({}, document.title, window.location.pathname);
        await checkSession();
        return;
      }
      alert('Error al completar el login: ' + error.message);
      window.history.replaceState({}, document.title, window.location.pathname);
      setLoading(false);
      setUser(null);
    }
  };

  const handleGubUyLogin = () => {
    const authUrl = new URL('https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize');
    authUrl.searchParams.set('client_id', '890192');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid personal_info email');
    authUrl.searchParams.set('redirect_uri', config.CALLBACK_URL);
    authUrl.searchParams.set('state', Math.random().toString(36).substring(2, 15));
    
    window.location.href = authUrl.toString();
  };

  const handleLogout = async () => {
    // Usar función centralizada de logout
    await logout();
  };

  // Efecto para asegurar que si hay token, siempre tengamos el usuario cargado
  // Esto previene que el componente se renderice mostrando "Iniciar sesión" cuando hay token
  useEffect(() => {
    const token = getAuthToken();
    // Si hay token pero no hay usuario, mantener loading en true y verificar sesión
    if (token && !user) {
      console.log('🔍 [DEBUG] Token presente pero sin usuario, verificando sesión...');
      setLoading(true);
      checkSession();
    }
  }, [user, checkSession]);

  // Si estamos cargando O si hay token pero no hay usuario todavía, mostrar loading
  // Esto previene que se muestre "Iniciar sesión" durante el proceso de login
  // IMPORTANTE: Esta verificación se hace en el render para evitar el flash de "Iniciar sesión"
  const token = getAuthToken();
  const shouldShowLoading = loading || (token && !user);
  
  if (shouldShowLoading) {
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

  // Log para debug del estado de user en cada render
  console.log('🔍 [DEBUG] Render Home - user:', user ? `SÍ (${user.nombre || user.uid})` : 'NO');
  console.log('🔍 [DEBUG] Render Home - loading:', loading);
  console.log('🔍 [DEBUG] Render Home - user.authenticated:', user?.authenticated);

  // Calcular si el usuario está autenticado
  // Si hay token pero no hay usuario todavía, NO considerar autenticado (mostrará loading)
  // Esto previene que se muestre "Iniciar sesión" cuando hay token pero el usuario aún se está cargando
  const tokenForAuth = getAuthToken();
  const isAuthenticated = user && user.authenticated && (!tokenForAuth || user); // Si hay token, necesitamos usuario
  console.log('🔍 [DEBUG] Render Home - isAuthenticated:', isAuthenticated);
  console.log('🔍 [DEBUG] Render Home - tokenForAuth:', tokenForAuth ? 'SÍ' : 'NO');

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f8fafc'}}>
      {/* Hero Section */}
      <div className="slider_area" style={{minHeight: '70vh'}}>
        <div className="slider_active">
          <div className="single_slider d-flex align-items-center slider_bg_1 overlay" style={{
            minHeight: '70vh',
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
                      HCEN
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
                    {isAuthenticated ? (
                      <a href="/historia-clinica" style={{
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
                        display: 'inline-block',
                        border: '2px solid #1f2b7b',
                        cursor: 'pointer'
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
                      <button
                        type="button"
                        onClick={handleGubUyLogin}
                        style={{
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
                          display: 'inline-block',
                          border: '2px solid #1f2b7b'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#f8fafc';
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#ffffff';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        <i className="flaticon-user" style={{marginRight: '10px'}}></i>
                        Iniciar Sesión con gub.uy
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información sobre HCEN */}
      <div style={{padding: '80px 0', backgroundColor: '#ffffff'}}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div style={{maxWidth: '900px', margin: '0 auto', textAlign: 'center'}}>
                <h2 style={{
                  fontSize: '42px',
                  fontWeight: '700',
                  color: '#1f2937',
                  marginBottom: '30px',
                  lineHeight: '1.3'
                }}>
                  ¿Qué es HCEN?
                </h2>
                <div style={{
                  fontSize: '18px',
                  color: '#4b5563',
                  lineHeight: '1.8',
                  textAlign: 'left',
                  marginBottom: '40px'
                }}>
                  <p style={{marginBottom: '20px'}}>
                    La <strong>Historia Clínica Electrónica Nacional (HCEN)</strong> es una plataforma que permite acceder a la Historia Clínica Digital de los usuarios del sistema de salud y que posibilita el registro de cualquier evento médico independientemente del lugar geográfico y prestador de salud en donde se dé la asistencia.
                  </p>
                  <p style={{marginBottom: '20px'}}>
                    Los usuarios del <strong>SNIS (Sistema Nacional Integrado de Salud)</strong> mayores de 18 años pueden acceder a su Historia Clínica Digital para:
                  </p>
                  <ul style={{
                    listStyle: 'none',
                    padding: '0',
                    margin: '20px 0',
                    textAlign: 'left'
                  }}>
                    <li style={{
                      padding: '12px 0',
                      paddingLeft: '30px',
                      position: 'relative',
                      fontSize: '17px',
                      color: '#374151'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: '0',
                        color: '#3b82f6',
                        fontSize: '20px',
                        fontWeight: 'bold'
                      }}>✓</span>
                      Ver todos sus eventos asistenciales registrados
                    </li>
                    <li style={{
                      padding: '12px 0',
                      paddingLeft: '30px',
                      position: 'relative',
                      fontSize: '17px',
                      color: '#374151'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: '0',
                        color: '#3b82f6',
                        fontSize: '20px',
                        fontWeight: 'bold'
                      }}>✓</span>
                      Poner a disposición su información clínica para los equipos de salud que lo asistan
                    </li>
                    <li style={{
                      padding: '12px 0',
                      paddingLeft: '30px',
                      position: 'relative',
                      fontSize: '17px',
                      color: '#374151'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: '0',
                        color: '#3b82f6',
                        fontSize: '20px',
                        fontWeight: 'bold'
                      }}>✓</span>
                      Acceder desde cualquier parte del país y en cualquier prestador de salud
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información de Contacto */}
      <div style={{padding: '80px 0', backgroundColor: '#f8fafc'}}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div style={{maxWidth: '900px', margin: '0 auto'}}>
                <h2 style={{
                  fontSize: '42px',
                  fontWeight: '700',
                  color: '#1f2937',
                  marginBottom: '20px',
                  textAlign: 'center'
                }}>
                  Información de Contacto
                </h2>
                <p style={{
                  fontSize: '18px',
                  color: '#6b7280',
                  textAlign: 'center',
                  marginBottom: '50px'
                }}>
                  Agencia de Gobierno Electrónico y Sociedad de la Información y del Conocimiento
                </p>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '30px',
                  marginTop: '40px'
                }}>
                  <div style={{
                    backgroundColor: '#ffffff',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
                    textAlign: 'center',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
                  }}>
                    <div style={{
                      fontSize: '36px',
                      color: '#3b82f6',
                      marginBottom: '15px'
                    }}>
                      <i className="fa fa-map-marker-alt"></i>
                    </div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '15px'
                    }}>
                      Dirección
                    </h3>
                    <p style={{
                      fontSize: '16px',
                      color: '#6b7280',
                      lineHeight: '1.6',
                      margin: '0'
                    }}>
                      Liniers 1324 piso 4<br />
                      Montevideo, Uruguay
                    </p>
                  </div>

                  <div style={{
                    backgroundColor: '#ffffff',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
                    textAlign: 'center',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
                  }}>
                    <div style={{
                      fontSize: '36px',
                      color: '#3b82f6',
                      marginBottom: '15px'
                    }}>
                      <i className="fa fa-phone"></i>
                    </div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '15px'
                    }}>
                      Teléfono
                    </h3>
                    <p style={{
                      fontSize: '16px',
                      color: '#6b7280',
                      lineHeight: '1.6',
                      margin: '0'
                    }}>
                      <a href="tel:+59829012929" style={{
                        color: '#3b82f6',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}>
                        (+598) 2901 2929
                      </a>
                    </p>
                  </div>

                  <div style={{
                    backgroundColor: '#ffffff',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
                    textAlign: 'center',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
                  }}>
                    <div style={{
                      fontSize: '36px',
                      color: '#3b82f6',
                      marginBottom: '15px'
                    }}>
                      <i className="fa fa-clock"></i>
                    </div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '15px'
                    }}>
                      Horario de Atención
                    </h3>
                    <p style={{
                      fontSize: '16px',
                      color: '#6b7280',
                      lineHeight: '1.6',
                      margin: '0'
                    }}>
                      Lunes a viernes<br />
                      9:00 a 17:00 h
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '40px 0',
        backgroundColor: '#1f2937',
        color: '#e5e7eb',
        textAlign: 'center'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <p style={{
                fontSize: '16px',
                margin: '0',
                color: '#9ca3af'
              }}>
                © {new Date().getFullYear()} Historia Clínica Electrónica Nacional (HCEN) - Agencia de Gobierno Electrónico y Sociedad de la Información y del Conocimiento
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;