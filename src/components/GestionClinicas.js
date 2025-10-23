import React, { useState, useEffect } from 'react';

const GestionClinicas = () => {
  const [nodos, setNodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departamentos, setDepartamentos] = useState([]);

  const [formData, setFormData] = useState({
    nombre: '',
    RUT: '',
    departamento: '',
    localidad: '',
    direccion: '',
    contacto: '',
    url: '',
    nodoPerifericoUrlBase: '',
    nodoPerifericoUsuario: '',
    nodoPerifericoPassword: '',
    estado: 'ACTIVO'
  });

  const [editingRUT, setEditingRUT] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    loadNodos();
    loadDepartamentos();
  }, []);

  const loadNodos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/nodos', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNodos(data);
      } else {
        showMessage('Error cargando clínicas', 'error');
      }
    } catch (error) {
      console.error('Error cargando nodos:', error);
      showMessage('Error de conexión al cargar nodos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadDepartamentos = () => {
    const deptos = [
      'ARTIGAS', 'CANELONES', 'CERRO_LARGO', 'COLONIA', 'DURAZNO',
      'FLORES', 'FLORIDA', 'LAVALLEJA', 'MALDONADO', 'MONTEVIDEO',
      'PAYSANDU', 'RIO_NEGRO', 'RIVERA', 'ROCHA', 'SALTO',
      'SAN_JOSE', 'SORIANO', 'TACUAREMBO', 'TREINTA_Y_TRES'
    ];
    setDepartamentos(deptos);
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingRUT) {
        const response = await fetch(`http://localhost:8080/api/nodos/${editingRUT}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          showMessage('Nodo periférico actualizado exitosamente', 'success');
          loadNodos();
        } else {
          const errorText = await response.text();
          showMessage('Error actualizando nodo: ' + errorText, 'error');
          return;
        }
      } else {
        const response = await fetch('http://localhost:8080/api/nodos', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          showMessage('Nodo periférico creado exitosamente', 'success');
          loadNodos();
        } else {
          const errorText = await response.text();
          showMessage('Error creando nodo: ' + errorText, 'error');
          return;
        }
      }

      resetForm();
    } catch (error) {
      console.error('Error en submit:', error);
      showMessage('Error de conexión', 'error');
    }
  };

  const handleEdit = (nodo) => {
    setFormData({
      nombre: nodo.nombre || '',
      RUT: nodo.rut || '',
      departamento: nodo.departamento || '',
      localidad: nodo.localidad || '',
      direccion: nodo.direccion || '',
      contacto: nodo.contacto || '',
      url: nodo.url || '',
      nodoPerifericoUrlBase: nodo.nodoPerifericoUrlBase || '',
      nodoPerifericoUsuario: nodo.nodoPerifericoUsuario || '',
      nodoPerifericoPassword: nodo.nodoPerifericoPassword || '',
      estado: nodo.estado || 'ACTIVO'
    });
    setEditingRUT(nodo.rut);
    setShowForm(true);
  };

  const handleDelete = async (rut) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este nodo periférico?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/nodos/${rut}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok || response.status === 204) {
        showMessage('Nodo periférico eliminado exitosamente', 'success');
        loadNodos();
      } else {
        showMessage('Error eliminando nodo', 'error');
      }
    } catch (error) {
      console.error('Error eliminando nodo:', error);
      showMessage('Error de conexión al eliminar', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      RUT: '',
      departamento: '',
      localidad: '',
      direccion: '',
      contacto: '',
      url: '',
      nodoPerifericoUrlBase: '',
      nodoPerifericoUsuario: '',
      nodoPerifericoPassword: '',
      estado: 'ACTIVO'
    });
    setEditingRUT(null);
    setShowForm(false);
  };

  const formatDepartamentoDisplay = (depto) => {
    if (!depto) return '';
    return depto.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  };

  const getEstadoBadgeColor = (estado) => {
    switch (estado) {
      case 'ACTIVO': return '#10b981';
      case 'INACTIVO': return '#6b7280';
      case 'MANTENIMIENTO': return '#f59e0b';
      case 'ERROR_MENSAJERIA': return '#ef4444';
      case 'PENDIENTE': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="slider_area" style={{minHeight: '100vh', display: 'flex', alignItems: 'center'}}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="slider_text text-center">
                <h3>Cargando clínicas...</h3>
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
                  Gestión de Clínicas
                </h3>
                <p style={{
                  color: '#e2e8f0',
                  fontSize: '18px',
                  marginBottom: '0',
                  fontWeight: '400'
                }}>
                  Administra las clínicas y centros de salud integrados al sistema
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{paddingTop: '80px', paddingBottom: '60px'}}>
        {message && (
          <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} role="alert" style={{
            borderRadius: '8px',
            padding: '15px 20px',
            marginBottom: '20px'
          }}>
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
          </div>
        )}

        <div className="row">
          <div className="col-xl-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 style={{color: '#1f2937', fontWeight: '600'}}>
                <i className="fa fa-hospital" style={{marginRight: '10px', color: '#3b82f6'}}></i>
                Clínicas Registradas
              </h4>
              <button 
                style={{
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setShowForm(true)}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
              >
                <i className="fa fa-plus" style={{marginRight: '8px'}}></i>
                Nuevo Nodo
              </button>
            </div>

            {showForm && (
              <div className="card mb-4" style={{
                borderRadius: '15px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                border: '1px solid #e5e7eb'
              }}>
                <div className="card-header" style={{
                  backgroundColor: '#f8fafc',
                  borderBottom: '2px solid #e5e7eb',
                  borderTopLeftRadius: '15px',
                  borderTopRightRadius: '15px',
                  padding: '20px 30px'
                }}>
                  <h5 style={{color: '#1f2937', fontWeight: '600', marginBottom: '0'}}>
                    {editingRUT ? 'Editar Nodo Periférico' : 'Nuevo Nodo Periférico'}
                  </h5>
                </div>
                <div className="card-body" style={{padding: '30px'}}>
                  <form onSubmit={handleSubmit}>
                    <h6 style={{color: '#374151', fontWeight: '600', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px'}}>
                      Información General
                    </h6>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="nombre" className="form-label" style={{fontWeight: '600', color: '#374151'}}>Nombre *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="nombre"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          required
                          style={{borderRadius: '8px', border: '2px solid #e5e7eb', padding: '10px 15px'}}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="RUT" className="form-label" style={{fontWeight: '600', color: '#374151'}}>RUT *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="RUT"
                          name="RUT"
                          value={formData.RUT}
                          onChange={handleInputChange}
                          required
                          disabled={editingRUT !== null}
                          style={{borderRadius: '8px', border: '2px solid #e5e7eb', padding: '10px 15px'}}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label htmlFor="departamento" className="form-label" style={{fontWeight: '600', color: '#374151'}}>Departamento *</label>
                        <select
                          className="form-control"
                          id="departamento"
                          name="departamento"
                          value={formData.departamento}
                          onChange={handleInputChange}
                          required
                          style={{borderRadius: '8px', border: '2px solid #e5e7eb', padding: '10px 15px'}}
                        >
                          <option value="">Seleccione...</option>
                          {departamentos.map(depto => (
                            <option key={depto} value={depto}>
                              {formatDepartamentoDisplay(depto)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="localidad" className="form-label" style={{fontWeight: '600', color: '#374151'}}>Localidad</label>
                        <input
                          type="text"
                          className="form-control"
                          id="localidad"
                          name="localidad"
                          value={formData.localidad}
                          onChange={handleInputChange}
                          style={{borderRadius: '8px', border: '2px solid #e5e7eb', padding: '10px 15px'}}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="estado" className="form-label" style={{fontWeight: '600', color: '#374151'}}>Estado *</label>
                        <select
                          className="form-control"
                          id="estado"
                          name="estado"
                          value={formData.estado}
                          onChange={handleInputChange}
                          required
                          style={{borderRadius: '8px', border: '2px solid #e5e7eb', padding: '10px 15px'}}
                        >
                          <option value="ACTIVO">Activo</option>
                          <option value="INACTIVO">Inactivo</option>
                          <option value="MANTENIMIENTO">Mantenimiento</option>
                          <option value="ERROR_MENSAJERIA">Error Mensajería</option>
                          <option value="PENDIENTE">Pendiente</option>
                        </select>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="direccion" className="form-label" style={{fontWeight: '600', color: '#374151'}}>Dirección</label>
                        <input
                          type="text"
                          className="form-control"
                          id="direccion"
                          name="direccion"
                          value={formData.direccion}
                          onChange={handleInputChange}
                          style={{borderRadius: '8px', border: '2px solid #e5e7eb', padding: '10px 15px'}}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="contacto" className="form-label" style={{fontWeight: '600', color: '#374151'}}>Contacto</label>
                        <input
                          type="text"
                          className="form-control"
                          id="contacto"
                          name="contacto"
                          value={formData.contacto}
                          onChange={handleInputChange}
                          style={{borderRadius: '8px', border: '2px solid #e5e7eb', padding: '10px 15px'}}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12 mb-3">
                        <label htmlFor="url" className="form-label" style={{fontWeight: '600', color: '#374151'}}>URL</label>
                        <input
                          type="url"
                          className="form-control"
                          id="url"
                          name="url"
                          value={formData.url}
                          onChange={handleInputChange}
                          style={{borderRadius: '8px', border: '2px solid #e5e7eb', padding: '10px 15px'}}
                        />
                      </div>
                    </div>

                    <h6 style={{color: '#374151', fontWeight: '600', marginTop: '30px', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px'}}>
                      Configuración Técnica
                    </h6>
                    <div className="row">
                      <div className="col-md-12 mb-3">
                        <label htmlFor="nodoPerifericoUrlBase" className="form-label" style={{fontWeight: '600', color: '#374151'}}>URL Base del Nodo</label>
                        <input
                          type="url"
                          className="form-control"
                          id="nodoPerifericoUrlBase"
                          name="nodoPerifericoUrlBase"
                          value={formData.nodoPerifericoUrlBase}
                          onChange={handleInputChange}
                          style={{borderRadius: '8px', border: '2px solid #e5e7eb', padding: '10px 15px'}}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="nodoPerifericoUsuario" className="form-label" style={{fontWeight: '600', color: '#374151'}}>Usuario</label>
                        <input
                          type="text"
                          className="form-control"
                          id="nodoPerifericoUsuario"
                          name="nodoPerifericoUsuario"
                          value={formData.nodoPerifericoUsuario}
                          onChange={handleInputChange}
                          style={{borderRadius: '8px', border: '2px solid #e5e7eb', padding: '10px 15px'}}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="nodoPerifericoPassword" className="form-label" style={{fontWeight: '600', color: '#374151'}}>Contraseña</label>
                        <input
                          type="password"
                          className="form-control"
                          id="nodoPerifericoPassword"
                          name="nodoPerifericoPassword"
                          value={formData.nodoPerifericoPassword}
                          onChange={handleInputChange}
                          style={{borderRadius: '8px', border: '2px solid #e5e7eb', padding: '10px 15px'}}
                        />
                      </div>
                    </div>

                    <div className="d-flex gap-2 mt-4">
                      <button type="submit" style={{
                        backgroundColor: '#10b981',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        {editingRUT ? 'Actualizar' : 'Guardar'}
                      </button>
                      <button type="button" style={{
                        backgroundColor: '#6b7280',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }} onClick={resetForm}>
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="card" style={{
              borderRadius: '15px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
              border: '1px solid #e5e7eb'
            }}>
              <div className="card-body" style={{padding: '30px'}}>
                {nodos.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fa fa-hospital" style={{fontSize: '64px', color: '#d1d5db', marginBottom: '20px'}}></i>
                    <p style={{color: '#6b7280', fontSize: '18px'}}>No hay clínicas registradas</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover" style={{width: '100%'}}>
                      <thead style={{backgroundColor: '#f8fafc'}}>
                        <tr>
                          <th style={{padding: '15px 20px', color: '#374151', fontWeight: '600'}}>Nombre</th>
                          <th style={{padding: '15px 20px', color: '#374151', fontWeight: '600'}}>RUT</th>
                          <th style={{padding: '15px 20px', color: '#374151', fontWeight: '600'}}>Ubicación</th>
                          <th style={{padding: '15px 20px', color: '#374151', fontWeight: '600'}}>Contacto</th>
                          <th style={{padding: '15px 20px', color: '#374151', fontWeight: '600'}}>Estado</th>
                          <th style={{padding: '15px 20px', color: '#374151', fontWeight: '600'}}>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nodos.map(nodo => (
                          <tr key={nodo.rut} style={{
                            backgroundColor: '#ffffff',
                            transition: 'all 0.2s ease'
                          }}>
                            <td style={{padding: '15px 20px'}}>
                              <strong style={{color: '#1f2937'}}>{nodo.nombre}</strong>
                            </td>
                            <td style={{padding: '15px 20px', color: '#374151', fontFamily: 'monospace'}}>{nodo.rut}</td>
                            <td style={{padding: '15px 20px', color: '#374151'}}>
                              {formatDepartamentoDisplay(nodo.departamento)}
                              {nodo.localidad && <><br/><small style={{color: '#6b7280'}}>{nodo.localidad}</small></>}
                            </td>
                            <td style={{padding: '15px 20px', color: '#374151'}}>{nodo.contacto || '-'}</td>
                            <td style={{padding: '15px 20px'}}>
                              <span style={{
                                padding: '6px 12px',
                                borderRadius: '5px',
                                fontWeight: '600',
                                fontSize: '12px',
                                backgroundColor: getEstadoBadgeColor(nodo.estado),
                                color: '#ffffff'
                              }}>
                                {nodo.estado}
                              </span>
                            </td>
                            <td style={{padding: '15px 20px'}}>
                              <div style={{display: 'flex', gap: '8px'}}>
                                <button
                                  style={{
                                    backgroundColor: '#3b82f6',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '6px 12px',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => handleEdit(nodo)}
                                >
                                  Editar
                                </button>
                                <button
                                  style={{
                                    backgroundColor: '#ef4444',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '6px 12px',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => handleDelete(nodo.rut)}
                                >
                                  Eliminar
                                </button>
                              </div>
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
        </div>
      </div>
    </>
  );
};

export default GestionClinicas;
