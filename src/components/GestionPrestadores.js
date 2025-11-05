import React, { useState, useEffect } from 'react';

/**
 * Componente para gestionar Prestadores de Salud.
 * Los administradores de HCEN pueden invitar prestadores que completen su registro.
 */
function GestionPrestadores() {
  const [prestadores, setPrestadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  
  const [formData, setFormData] = useState({
    nombre: '',
    contacto: ''
  });

  useEffect(() => {
    loadPrestadores();
  }, []);

  const loadPrestadores = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/prestadores-salud', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setPrestadores(data);
      } else {
        mostrarMensaje('Error cargando prestadores', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      mostrarMensaje('Error de conexión', 'error');
    } finally {
      setLoading(false);
    }
  };

  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8080/api/prestadores-salud/invitar', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        mostrarMensaje('Invitación enviada exitosamente. El prestador recibirá un email para completar su registro.', 'success');
        resetForm();
        loadPrestadores();
      } else {
        const errorText = await response.text();
        mostrarMensaje('Error: ' + errorText, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      mostrarMensaje('Error de conexión', 'error');
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', contacto: '' });
    setShowForm(false);
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'PENDIENTE_REGISTRO': { color: '#f59e0b', texto: 'Pendiente Registro' },
      'ACTIVO': { color: '#10b981', texto: 'Activo' },
      'INACTIVO': { color: '#6b7280', texto: 'Inactivo' },
      'ERROR': { color: '#ef4444', texto: 'Error' }
    };
    const badge = badges[estado] || badges['INACTIVO'];
    return (
      <span style={{
        display: 'inline-block',
        padding: '6px 12px',
        borderRadius: '12px',
        fontSize: '13px',
        fontWeight: '600',
        background: badge.color,
        color: '#ffffff'
      }}>
        {badge.texto}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="slider_area" style={{minHeight: '100vh', display: 'flex', alignItems: 'center'}}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="slider_text text-center">
                <h3>Cargando prestadores...</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header con gradiente azul */}
      <div className="bradcam_area" style={{
        paddingTop: '120px',
        paddingBottom: '80px',
        background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
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
                  Gestión de Prestadores de Salud
                </h3>
                <p style={{
                  color: '#e2e8f0',
                  fontSize: '18px',
                  marginBottom: '0',
                  fontWeight: '400'
                }}>
                  Administra prestadores de salud integrados al sistema HCEN
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="slider_area" style={{paddingTop: '80px', paddingBottom: '80px'}}>
        <div className="container">
          
          {/* Botón Invitar */}
          <div style={{marginBottom: '30px', textAlign: 'center'}}>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: '15px 40px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#ffffff',
                background: showForm ? '#6b7280' : 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {showForm ? 'Cancelar' : 'Invitar Prestador'}
            </button>
          </div>

          {/* Mensajes */}
          {mensaje.texto && (
            <div style={{
              padding: '15px 20px',
              borderRadius: '8px',
              marginBottom: '30px',
              background: mensaje.tipo === 'success' ? '#d1fae5' : mensaje.tipo === 'error' ? '#fee2e2' : '#dbeafe',
              color: mensaje.tipo === 'success' ? '#065f46' : mensaje.tipo === 'error' ? '#991b1b' : '#1e40af',
              border: `1px solid ${mensaje.tipo === 'success' ? '#a7f3d0' : mensaje.tipo === 'error' ? '#fecaca' : '#bfdbfe'}`
            }}>
              {mensaje.texto}
            </div>
          )}

          {/* Formulario de invitación */}
          {showForm && (
            <div style={{
              background: '#ffffff',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              marginBottom: '40px'
            }}>
              <h3 style={{color: '#1e40af', marginBottom: '10px'}}>Invitar Nuevo Prestador</h3>
              <p style={{color: '#64748b', marginBottom: '25px', fontSize: '14px'}}>
                Complete los datos básicos. El prestador recibirá un email para completar el registro.
              </p>
              
              <form onSubmit={handleSubmit}>
                <div style={{marginBottom: '20px'}}>
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151'}}>
                    Nombre del Prestador *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    placeholder="Ej: Laboratorio Clínico Central"
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '15px'
                    }}
                  />
                </div>

                <div style={{marginBottom: '25px'}}>
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151'}}>
                    Email de Contacto *
                  </label>
                  <input
                    type="email"
                    value={formData.contacto}
                    onChange={(e) => setFormData({...formData, contacto: e.target.value})}
                    placeholder="contacto@prestador.com"
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '15px'
                    }}
                  />
                </div>

                <div style={{display: 'flex', gap: '15px'}}>
                  <button
                    type="submit"
                    style={{
                      padding: '12px 30px',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#ffffff',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Enviar Invitación
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    style={{
                      padding: '12px 30px',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#374151',
                      background: '#e5e7eb',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tabla de prestadores */}
          <div style={{
            background: '#ffffff',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{color: '#1e40af', marginBottom: '20px'}}>
              Prestadores Registrados ({prestadores.length})
            </h3>
            
            {prestadores.length === 0 ? (
              <div style={{textAlign: 'center', padding: '40px', color: '#64748b'}}>
                <p style={{fontSize: '18px', marginBottom: '10px'}}>No hay prestadores registrados.</p>
                <p>Haz clic en "Invitar Prestador" para enviar la primera invitación.</p>
              </div>
            ) : (
              <div style={{overflowX: 'auto'}}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '14px'
                }}>
                  <thead>
                    <tr style={{borderBottom: '2px solid #e5e7eb', background: '#f9fafb'}}>
                      <th style={{padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151'}}>ID</th>
                      <th style={{padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151'}}>Nombre</th>
                      <th style={{padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151'}}>RUT</th>
                      <th style={{padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151'}}>Email</th>
                      <th style={{padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151'}}>URL Servidor</th>
                      <th style={{padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151'}}>Ubicación</th>
                      <th style={{padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151'}}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prestadores.map(p => (
                      <tr key={p.id} style={{borderBottom: '1px solid #e5e7eb'}}>
                        <td style={{padding: '12px'}}>{p.id}</td>
                        <td style={{padding: '12px', fontWeight: '600', color: '#1e40af'}}>{p.nombre}</td>
                        <td style={{padding: '12px', color: '#64748b'}}>{p.rut || '-'}</td>
                        <td style={{padding: '12px'}}>{p.contacto}</td>
                        <td style={{padding: '12px'}}>
                          {p.url ? (
                            <a
                              href={p.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{color: '#3b82f6', textDecoration: 'none'}}
                            >
                              {p.url}
                            </a>
                          ) : (
                            <span style={{color: '#9ca3af'}}>Pendiente</span>
                          )}
                        </td>
                        <td style={{padding: '12px', color: '#64748b'}}>
                          {p.departamento && p.localidad
                            ? `${p.localidad}, ${p.departamento}`
                            : p.departamento || '-'}
                        </td>
                        <td style={{padding: '12px'}}>
                          {getEstadoBadge(p.estado)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default GestionPrestadores;
