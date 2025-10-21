import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HistoriaClinica = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    categoria: 'todos',
    institucion: 'todos',
    profesional: 'todos'
  });

  // Datos hardcodeados de documentos clínicos
  const documentosClinicos = [
    {
      id: 1,
      fecha: '2024-10-15',
      institucion: 'Hospital de Clínicas',
      categoria: 'Policlínica',
      profesional: 'Dr. María González',
      descripcion: 'Consulta de control de rutina con evaluación general del estado de salud.'
    },
    {
      id: 2,
      fecha: '2024-10-12',
      institucion: 'Laboratorio Central',
      categoria: 'Laboratorio',
      profesional: 'Dr. Carlos Pérez',
      descripcion: 'Análisis de sangre completo incluyendo hemograma y perfil bioquímico.'
    },
    {
      id: 3,
      fecha: '2024-10-08',
      institucion: 'Centro de Diagnóstico por Imágenes',
      categoria: 'Imagenología',
      profesional: 'Dr. Ana Rodríguez',
      descripcion: 'Radiografía de tórax para control rutinario y evaluación pulmonar.'
    },
    {
      id: 4,
      fecha: '2024-10-15',
      institucion: 'Hospital de Clínicas',
      categoria: 'Policlínica',
      profesional: 'Dr. María González',
      descripcion: 'Prescripción de medicamentos para control de presión arterial.'
    },
    {
      id: 5,
      fecha: '2024-10-05',
      institucion: 'Instituto de Cardiología',
      categoria: 'Especialidad',
      profesional: 'Dr. Roberto Silva',
      descripcion: 'Evaluación cardiológica completa con electrocardiograma incluido.'
    },
    {
      id: 6,
      fecha: '2024-09-28',
      institucion: 'Centro de Vacunación',
      categoria: 'Vacunación',
      profesional: 'Enf. Laura Martínez',
      descripcion: 'Aplicación de vacuna antigripal estacional para prevención.'
    },
    {
      id: 7,
      fecha: '2024-09-15',
      institucion: 'Centro de Diagnóstico por Imágenes',
      categoria: 'Imagenología',
      profesional: 'Dr. Patricia López',
      descripcion: 'Ecografía abdominal para evaluación de órganos internos.'
    },
    {
      id: 8,
      fecha: '2024-09-10',
      institucion: 'Laboratorio Central',
      categoria: 'Laboratorio',
      profesional: 'Dr. Miguel Torres',
      descripcion: 'Análisis de orina completo con cultivo y antibiograma.'
    }
  ];

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

  const handleLogout = () => {
    window.location.href = 'http://localhost:8080/api/auth/logout';
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
                  marginBottom: '0',
                  fontWeight: '400'
                }}>
                  Bienvenido, <strong style={{color: '#ffffff'}}>{user.nombre || 'Usuario'}</strong>
                </p>
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
                <div className="nice-select" style={{width: '100%'}}>
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
                <div className="nice-select" style={{width: '100%'}}>
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
                <div className="nice-select" style={{width: '100%'}}>
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
                                cursor: 'pointer'
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
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {documentosFiltrados.length === 0 && (
                <div className="col-xl-12">
                  <div className="text-center" style={{padding: '60px 20px'}}>
                    <i className="flaticon-search" style={{fontSize: '48px', color: '#ccc', marginBottom: '20px'}}></i>
                    <h4 style={{color: '#666'}}>No se encontraron documentos</h4>
                    <p style={{color: '#999'}}>Intenta ajustar los filtros para ver más resultados</p>
                  </div>
                </div>
              )}
            </div>
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
                      <img src="/assets/img/footer_logo.png" alt="" style={{maxWidth: '150px'}} />
                    </a>
                  </div>
                  <p>
                    Sistema Nacional de Historia Clínica Electrónica de Uruguay
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
    </>
  );
};

export default HistoriaClinica;
