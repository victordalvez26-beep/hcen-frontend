import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';

const HistoriaClinica = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [documentosClinicos, setDocumentosClinicos] = useState([]);
  const [loadingDocumentos, setLoadingDocumentos] = useState(false);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    categoria: 'todos',
    institucion: 'todos',
    profesional: 'todos'
  });
  const [showResumenModal, setShowResumenModal] = useState(false);
  const [resumen, setResumen] = useState(null);
  const [loadingResumen, setLoadingResumen] = useState(false);
  const [solicitandoAcceso, setSolicitandoAcceso] = useState({});

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    console.log('🔄 useEffect ejecutado. User:', user);
    if (user && user.uid) {
      // El endpoint ahora obtiene el UID del JWT, solo necesitamos que el usuario esté autenticado
      console.log('📋 Usuario autenticado, cargando documentos');
      loadDocumentosPorUsuario();
    } else {
      console.log('❌ Usuario no autenticado');
      console.log('User:', user);
    }
  }, [user]);
  
  const checkSession = async () => {
    try {
      const response = await fetch(`${config.BACKEND_URL}/api/auth/session`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.authenticated) {
        console.log('👤 Datos del usuario recibidos:', data);
        console.log('📋 Campo documento:', data.documento);
        console.log('📋 Todos los campos del usuario:', Object.keys(data));
        setUser(data);
      } else {
        console.log('❌ Sesión no válida, redirigiendo a login');
        setUser(null);
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error verificando sesión:', error);
      setUser(null);
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  const loadDocumentosPorUsuario = async () => {
    setLoadingDocumentos(true);
    setError(null);
    console.log('🔍 Cargando documentos para usuario autenticado');
    try {
      // El endpoint ahora obtiene el UID del JWT en la cookie, no necesitamos enviarlo
      const url = `${config.BACKEND_URL}/api/metadatos-documento/usuario`;
      console.log('🌐 URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`Error al cargar documentos: ${response.status}`);
      }

      const documentos = await response.json();
      console.log('📄 Documentos recibidos del backend:', documentos);
      console.log('🆔 IDs de documentos del backend:', documentos.map(doc => doc.id));
      
      // Mapear los documentos del backend al formato esperado por el frontend
      const documentosMapeados = documentos.map((doc, index) => ({
        id: doc.id || (index + 1), // Usar ID real del backend o índice + 1
        fecha: doc.fechaCreacion || 'N/A',
        institucion: doc.clinicaOrigen || 'Institución Desconocida',
        categoria: doc.tipoDocumento || 'Sin Categoría',
        profesional: doc.profesionalSalud || 'Profesional Desconocido',
        descripcion: doc.descripcion || 'Sin descripción disponible',
        formatoDocumento: doc.formatoDocumento,
        uriDocumento: doc.uriDocumento,
        accesoPermitido: doc.accesoPermitido !== false,
        codDocum: doc.codDocum // Agregar CI del paciente
      }));

      console.log('💾 Documentos mapeados guardados en estado:', documentosMapeados);
      setDocumentosClinicos(documentosMapeados);
    } catch (error) {
      console.error('❌ Error cargando documentos:', error);
      console.error('❌ Error details:', error.message);
      setError('No se pudieron cargar los documentos clínicos. Por favor, intente más tarde.');
      setDocumentosClinicos([]);
    } finally {
      setLoadingDocumentos(false);
    }
  };

  const handleLogout = () => {
    window.location.href = `${config.BACKEND_URL}/api/auth/logout`;
  };

  const generarResumenHistoriaClinica = async () => {
    if (!user || !user.codDocum) {
      setError('No se puede generar el resumen: CI del paciente no disponible');
      return;
    }

    setLoadingResumen(true);
    setError(null);

    try {
      const response = await fetch(`${config.BACKEND_URL}/api/documentos/paciente/${user.codDocum}/resumen`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setResumen(data);
        setShowResumenModal(true);
      } else if (response.status === 403) {
        setError('No tiene permisos para generar el resumen de la historia clínica');
      } else if (response.status === 404) {
        setError('No se encontraron documentos para generar el resumen');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al generar el resumen');
      }
    } catch (error) {
      console.error('Error generando resumen:', error);
      setError('Error de conexión al generar el resumen');
    } finally {
      setLoadingResumen(false);
    }
  };

  const solicitarAcceso = async (documento) => {
    if (!user || !user.uid) {
      setError('No se puede solicitar acceso: usuario no identificado');
      return;
    }

    setSolicitandoAcceso(prev => ({ ...prev, [documento.id]: true }));

    try {
      // Usar el endpoint del backend principal
      const response = await fetch(`${config.BACKEND_URL}/api/metadatos-documento/solicitar-acceso`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          documentoId: documento.id,
          pacienteCI: documento.codDocum || user.codDocum,
          motivo: 'Acceso necesario para atención médica'
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert('Solicitud de acceso enviada exitosamente. Se le notificará cuando sea aprobada.');
        // Recargar documentos para actualizar permisos
        loadDocumentosPorUsuario();
      } else {
        const errorData = await response.json();
        alert('Error al solicitar acceso: ' + (errorData.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error solicitando acceso:', error);
      alert('Error de conexión al solicitar acceso');
    } finally {
      setSolicitandoAcceso(prev => ({ ...prev, [documento.id]: false }));
    }
  };

  const descargarDocumento = async (documento) => {
    if (!documento.id) {
      alert('Error: ID del documento no disponible');
      return;
    }

    try {
      const response = await fetch(`${config.BACKEND_URL}/api/metadatos-documento/${documento.id}/descargar`, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${documento.categoria || 'documento'}-${documento.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else if (response.status === 403) {
        alert('No tiene permisos para descargar este documento. Puede solicitar acceso.');
      } else if (response.status === 404) {
        alert('Documento no encontrado');
      } else {
        alert('Error al descargar el documento');
      }
    } catch (error) {
      console.error('Error descargando documento:', error);
      alert('Error de conexión al descargar el documento');
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const documentosFiltrados = documentosClinicos.filter(doc => {
    if (filtros.categoria !== 'todos' && doc.categoria !== filtros.categoria) return false;
    if (filtros.institucion !== 'todos' && doc.institucion !== filtros.institucion) return false;
    if (filtros.profesional !== 'todos' && doc.profesional !== filtros.profesional) return false;
    return true;
  });

  const categorias = [...new Set(documentosClinicos.map(doc => doc.categoria))];
  const instituciones = [...new Set(documentosClinicos.map(doc => doc.institucion))];
  const profesionales = [...new Set(documentosClinicos.map(doc => doc.profesional))];

  console.log('🎨 Renderizando con documentosClinicos:', documentosClinicos);
  console.log('🎨 Cantidad de documentos:', documentosClinicos.length);
  console.log('🎨 Documentos filtrados:', documentosFiltrados.length);

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

  if (!user) {
    return (
      <div className="slider_area" style={{minHeight: '100vh', display: 'flex', alignItems: 'center'}}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="slider_text text-center">
                <h3 style={{color: '#1f2b7b', marginBottom: '20px'}}>Acceso Restringido</h3>
                <p style={{color: '#64748b', fontSize: '18px', marginBottom: '30px'}}>
                  Debes iniciar sesión para acceder a tu historia clínica
                </p>
                <a href="/" className="boxed-btn3" style={{
                  padding: '12px 24px',
                  fontSize: '14px',
                  textDecoration: 'none',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  borderRadius: '8px',
                  fontWeight: '600',
                  display: 'inline-block'
                }}>
                  Volver al Inicio
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bradcam_area" style={{
        paddingTop: '120px', 
        paddingBottom: '80px',
        background: 'linear-gradient(135deg, #1f2b7b 0%, #3b82f6 100%)',
        position: 'relative',
        overflow: 'hidden',
        marginTop: '0px'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="bradcam_text text-center">
                <h3 style={{
                  color: '#ffffff',
                  fontSize: '48px',
                  fontWeight: '700',
                  marginBottom: '15px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  Mi Historia Clínica
                </h3>
                <p style={{
                  color: '#e2e8f0',
                  fontSize: '18px',
                  marginBottom: '20px',
                  fontWeight: '400'
                }}>
                  Bienvenido, <strong style={{color: '#ffffff'}}>{user.nombre || 'Usuario'}</strong>
                </p>
                <button
                  onClick={generarResumenHistoriaClinica}
                  disabled={loadingResumen}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: loadingResumen ? '#9ca3af' : '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: loadingResumen ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!loadingResumen) {
                      e.target.style.backgroundColor = '#059669';
                      e.target.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loadingResumen) {
                      e.target.style.backgroundColor = '#10b981';
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {loadingResumen ? (
                    <>
                      <i className="flaticon-loading" style={{marginRight: '8px'}}></i>
                      Generando resumen...
                    </>
                  ) : (
                    <>
                      <i className="flaticon-file" style={{marginRight: '8px'}}></i>
                      Generar Resumen de Historia Clínica
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'url("/assets/img/banner/banner.png") center/cover',
          opacity: '0.1',
          zIndex: '1'
        }}></div>
      </div>

      <div className="container" style={{paddingTop: '60px', paddingBottom: '60px'}}>
        <div className="row">
          {/* Filtros - Barra lateral */}
          <div className="col-xl-3 col-lg-4">
            <div className="sidebar_widget" style={{
              backgroundColor: '#ffffff',
              padding: '35px',
              borderRadius: '15px',
              marginBottom: '30px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{
                marginBottom: '25px', 
                color: '#1f2b7b',
                fontSize: '24px',
                fontWeight: '700',
                borderBottom: '3px solid #3b82f6',
                paddingBottom: '10px'
              }}>
                <i className="flaticon-filter" style={{marginRight: '8px'}}></i>
                Filtros
              </h4>
              
              <div className="widget_inner" style={{marginBottom: '40px'}}>
                <h5 style={{
                  fontSize: '16px', 
                  marginBottom: '20px',
                  color: '#2d3748',
                  fontWeight: '600'
                }}>
                  <i className="flaticon-file" style={{marginRight: '8px', color: '#3b82f6'}}></i>
                  Categoría
                </h5>
                <div className="" style={{width: '100%'}}>
                  <select 
                    value={filtros.categoria} 
                    onChange={(e) => handleFiltroChange('categoria', e.target.value)}
                    style={{
                      width: '100%', 
                      padding: '15px 20px', 
                      border: '2px solid #e2e8f0', 
                      borderRadius: '10px',
                      backgroundColor: '#ffffff',
                      fontSize: '15px',
                      color: '#2d3748',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      height: '50px'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  >
                    <option value="todos">Todas las categorías</option>
                    {categorias.map(categoria => (
                      <option key={categoria} value={categoria}>{categoria}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="widget_inner" style={{marginBottom: '40px'}}>
                <h5 style={{
                  fontSize: '16px', 
                  marginBottom: '20px',
                  color: '#2d3748',
                  fontWeight: '600'
                }}>
                  <i className="flaticon-hospital" style={{marginRight: '8px', color: '#3b82f6'}}></i>
                  Institución
                </h5>
                <div className="" style={{width: '100%'}}>
                  <select 
                    value={filtros.institucion} 
                    onChange={(e) => handleFiltroChange('institucion', e.target.value)}
                    style={{
                      width: '100%', 
                      padding: '15px 20px', 
                      border: '2px solid #e2e8f0', 
                      borderRadius: '10px',
                      backgroundColor: '#ffffff',
                      fontSize: '15px',
                      color: '#2d3748',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      height: '50px'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  >
                    <option value="todos">Todas las instituciones</option>
                    {instituciones.map(institucion => (
                      <option key={institucion} value={institucion}>{institucion}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="widget_inner" style={{marginBottom: '40px'}}>
                <h5 style={{
                  fontSize: '16px', 
                  marginBottom: '20px',
                  color: '#2d3748',
                  fontWeight: '600'
                }}>
                  <i className="flaticon-doctor" style={{marginRight: '8px', color: '#3b82f6'}}></i>
                  Profesional
                </h5>
                <div className="" style={{width: '100%'}}>
                  <select 
                    value={filtros.profesional} 
                    onChange={(e) => handleFiltroChange('profesional', e.target.value)}
                    style={{
                      width: '100%', 
                      padding: '15px 20px', 
                      border: '2px solid #e2e8f0', 
                      borderRadius: '10px',
                      backgroundColor: '#ffffff',
                      fontSize: '15px',
                      color: '#2d3748',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      height: '50px'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  >
                    <option value="todos">Todos los profesionales</option>
                    {profesionales.map(profesional => (
                      <option key={profesional} value={profesional}>{profesional}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="widget_inner" style={{
                backgroundColor: '#f7fafc',
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0'
              }}>
                <h5 style={{
                  fontSize: '16px', 
                  marginBottom: '15px',
                  color: '#2d3748',
                  fontWeight: '600'
                }}>
                  <i className="flaticon-search" style={{marginRight: '8px', color: '#3b82f6'}}></i>
                  Resultados
                </h5>
                <div style={{
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '16px'
                }}>
                  {documentosFiltrados.length} de {documentosClinicos.length} documentos
                </div>
              </div>
            </div>
          </div>

          {/* Lista de documentos */}
          <div className="col-xl-9 col-lg-8">
            {loadingDocumentos ? (
              <div style={{
                backgroundColor: '#ffffff',
                padding: '60px',
                borderRadius: '15px',
                textAlign: 'center',
                boxShadow: '0 8px 25px rgba(0,0,0,0.08)'
              }}>
                <div className="spinner-border text-primary" role="status" style={{marginBottom: '20px'}}>
                  <span className="sr-only">Cargando...</span>
                </div>
                <p style={{color: '#64748b', fontSize: '16px'}}>Cargando documentos clínicos...</p>
              </div>
            ) : error ? (
              <div style={{
                backgroundColor: '#fff1f2',
                padding: '40px',
                borderRadius: '15px',
                textAlign: 'center',
                border: '1px solid #fecaca'
              }}>
                <i className="flaticon-warning" style={{fontSize: '48px', color: '#dc2626', marginBottom: '15px'}}></i>
                <p style={{color: '#dc2626', fontSize: '16px', marginBottom: '0'}}>{error}</p>
              </div>
            ) : documentosFiltrados.length === 0 ? (
              <div style={{
                backgroundColor: '#ffffff',
                padding: '60px',
                borderRadius: '15px',
                textAlign: 'center',
                boxShadow: '0 8px 25px rgba(0,0,0,0.08)'
              }}>
                <i className="flaticon-folder" style={{fontSize: '64px', color: '#cbd5e1', marginBottom: '20px'}}></i>
                <h4 style={{color: '#475569', marginBottom: '10px'}}>
                  {documentosClinicos.length === 0 ? 'No hay documentos disponibles' : 'No se encontraron documentos'}
                </h4>
                <p style={{color: '#64748b'}}>
                  {documentosClinicos.length === 0 
                    ? 'Aún no tienes documentos clínicos registrados en el sistema.'
                    : 'Intenta cambiar los filtros para ver más resultados.'}
                </p>
              </div>
            ) : (
              <div className="row">
                {documentosFiltrados.map(documento => (
                <div key={documento.id} className="col-xl-12" style={{marginBottom: '35px'}}>
                  <div className="single_blog" style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '15px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    border: '1px solid #e2e8f0',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                  }}>
                    <div className="row no-gutters">
                      {/* Imagen/Icono */}
                      <div className="col-xl-3 col-lg-4">
                        <div className="blog_thumb" style={{
                          height: '180px',
                          background: `linear-gradient(135deg, #1f2b7b 0%, #3b82f6 50%, #06b6d4 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            right: '0',
                            bottom: '0',
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)'
                          }}></div>
                          <i className={`flaticon-${documento.categoria === 'Policlínica' ? 'doctor' : 
                            documento.categoria === 'Laboratorio' ? 'test-tube' :
                            documento.categoria === 'Imagenología' ? 'x-ray' :
                            documento.categoria === 'Vacunación' ? 'syringe' : 
                            documento.categoria === 'Especialidad' ? 'medical' : 'file'}`} 
                            style={{
                              fontSize: '48px', 
                              color: '#ffffff',
                              zIndex: '2',
                              position: 'relative',
                              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}></i>
                        </div>
                      </div>
                      
                      {/* Contenido */}
                      <div className="col-xl-9 col-lg-8">
                        <div className="blog_content" style={{padding: '25px'}}>
                          <div className="blog_meta" style={{marginBottom: '20px'}}>
                            <span style={{
                              backgroundColor: '#1f2b7b',
                              color: '#ffffff',
                              padding: '6px 14px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '700',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              {documento.categoria}
                            </span>
                            <span style={{
                              marginLeft: '12px', 
                              color: '#64748b', 
                              fontSize: '13px',
                              fontWeight: '500'
                            }}>
                              <i className="flaticon-calendar" style={{marginRight: '5px'}}></i>
                              {documento.fecha}
                            </span>
                          </div>
                          
                          <h3 style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            marginBottom: '15px',
                            color: '#1e293b',
                            lineHeight: '1.3'
                          }}>
                            {documento.institucion}
                          </h3>
                          
                          <div style={{
                            backgroundColor: '#f8fafc',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            marginBottom: '15px',
                            border: '1px solid #e2e8f0'
                          }}>
                            <p style={{
                              color: '#475569',
                              marginBottom: '0',
                              fontSize: '13px',
                              fontWeight: '500'
                            }}>
                              <i className="flaticon-user" style={{marginRight: '6px', color: '#3b82f6'}}></i>
                              <strong>Profesional:</strong> {documento.profesional}
                            </p>
                          </div>
                          
                          <p style={{
                            color: '#475569',
                            marginBottom: '20px',
                            lineHeight: '1.6',
                            fontSize: '14px'
                          }}>
                            {documento.descripcion}
                          </p>
                          
                          <div className="d-flex justify-content-between align-items-center" style={{
                            paddingTop: '15px',
                            borderTop: '1px solid #e2e8f0'
                          }}>
                            <div style={{
                              color: '#64748b', 
                              fontSize: '13px',
                              fontWeight: '500'
                            }}>
                              <i className="flaticon-calendar" style={{marginRight: '6px', color: '#3b82f6'}}></i>
                              {documento.fecha}
                            </div>
                            <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                              <a 
                                href="#" 
                                className="boxed-btn3" 
                                style={{
                                  padding: '8px 20px',
                                  fontSize: '13px',
                                  textDecoration: 'none',
                                  backgroundColor: '#3b82f6',
                                  color: '#ffffff',
                                  borderRadius: '6px',
                                  fontWeight: '600',
                                  transition: 'all 0.3s ease',
                                  border: 'none',
                                  cursor: 'pointer',
                                  display: 'inline-block'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = '#1d4ed8';
                                  e.target.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = '#3b82f6';
                                  e.target.style.transform = 'translateY(0)';
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate(`/documento/${documento.id}`);
                                }}
                              >
                                <i className="flaticon-eye" style={{marginRight: '4px'}}></i>
                                Ver Detalle
                              </a>
                              {documento.accesoPermitido !== false ? (
                                <button
                                  onClick={() => descargarDocumento(documento)}
                                  className="boxed-btn3" 
                                  style={{
                                    padding: '8px 20px',
                                    fontSize: '13px',
                                    backgroundColor: '#10b981',
                                    color: '#ffffff',
                                    borderRadius: '6px',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'inline-block'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#059669';
                                    e.target.style.transform = 'translateY(-2px)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#10b981';
                                    e.target.style.transform = 'translateY(0)';
                                  }}
                                >
                                  <i className="flaticon-download" style={{marginRight: '4px'}}></i>
                                  Descargar PDF
                                </button>
                              ) : (
                                <button
                                  onClick={() => solicitarAcceso(documento)}
                                  disabled={solicitandoAcceso[documento.id]}
                                  className="boxed-btn3" 
                                  style={{
                                    padding: '8px 20px',
                                    fontSize: '13px',
                                    backgroundColor: solicitandoAcceso[documento.id] ? '#9ca3af' : '#f59e0b',
                                    color: '#ffffff',
                                    borderRadius: '6px',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease',
                                    border: 'none',
                                    cursor: solicitandoAcceso[documento.id] ? 'not-allowed' : 'pointer',
                                    display: 'inline-block'
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!solicitandoAcceso[documento.id]) {
                                      e.target.style.backgroundColor = '#d97706';
                                      e.target.style.transform = 'translateY(-2px)';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!solicitandoAcceso[documento.id]) {
                                      e.target.style.backgroundColor = '#f59e0b';
                                      e.target.style.transform = 'translateY(0)';
                                    }
                                  }}
                                >
                                  <i className="flaticon-lock" style={{marginRight: '4px'}}></i>
                                  {solicitandoAcceso[documento.id] ? 'Solicitando...' : 'Solicitar Acceso'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer_top">
          <div className="container">
            <div className="row">
              <div className="col-xl-4 col-md-6 col-lg-4">
                <div className="footer_widget">
                  <div className="footer_logo">
                    <a href="/">
                      <img src="/assets/img/logo.png" alt="HCEN" style={{maxWidth: '150px'}} />
                    </a>
                  </div>
                  <p>
                    HCEN - Historia Clínica Electrónica Nacional
                  </p>
                </div>
              </div>
              <div className="col-xl-4 col-md-6 col-lg-4">
                <div className="footer_widget">
                  <h3 className="footer_title">
                    Enlaces Útiles
                  </h3>
                  <ul>
                    <li><a href="https://www.gub.uy">Gobierno de Uruguay</a></li>
                    <li><a href="https://www.msp.gub.uy">Ministerio de Salud Pública</a></li>
                    <li><a href="https://www.gub.uy/tramites">Trámites</a></li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-4 col-md-6 col-lg-4">
                <div className="footer_widget">
                  <h3 className="footer_title">
                    Contacto
                  </h3>
                  <p>
                    Montevideo, Uruguay<br />
                    Email: info@hcen.gub.uy<br />
                    Tel: 0800 1234
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="copy-right_text">
          <div className="container">
            <div className="footer_border"></div>
            <div className="row">
              <div className="col-xl-12">
                <p className="copy_right text-center">
                  © 2024 HCEN. Todos los derechos reservados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal de Resumen */}
      {showResumenModal && resumen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }} onClick={() => setShowResumenModal(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '24px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: '700',
                color: '#1f2b7b'
              }}>
                <i className="flaticon-file" style={{marginRight: '8px'}}></i>
                Resumen de Historia Clínica
              </h3>
              <button
                onClick={() => setShowResumenModal(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: '0',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f1f5f9';
                  e.target.style.color = '#1f2b7b';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#64748b';
                }}
              >
                ✕
              </button>
            </div>
            <div style={{
              padding: '24px'
            }}>
              <div style={{
                backgroundColor: '#f8fafc',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid #e2e8f0'
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#64748b'
                }}>
                  <strong>Paciente:</strong> {resumen.paciente || user.codDocum}
                </p>
                <p style={{
                  margin: '8px 0 0 0',
                  fontSize: '14px',
                  color: '#64748b'
                }}>
                  <strong>Documentos procesados:</strong> {resumen.documentosProcesados || 0}
                </p>
              </div>
              <div style={{
                backgroundColor: '#ffffff',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.6',
                fontSize: '15px',
                color: '#2d3748'
              }}>
                {resumen.resumen || 'No se pudo generar el resumen'}
              </div>
            </div>
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowResumenModal(false)}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#1d4ed8';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#3b82f6';
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HistoriaClinica;
