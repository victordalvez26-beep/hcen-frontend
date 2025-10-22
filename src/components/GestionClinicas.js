import React, { useState } from 'react';

const GestionClinicas = () => {
  const [clinicas, setClinicas] = useState([
    {
      id: 1,
      nombre: 'Clínica Central',
      direccion: 'Av. 18 de Julio 1234',
      telefono: '2400-1234',
      email: 'info@clinicacentral.com.uy',
      activa: true
    },
    {
      id: 2,
      nombre: 'Centro Médico Norte',
      direccion: 'Bv. Artigas 5678',
      telefono: '2400-5678',
      email: 'contacto@centromediconorte.com.uy',
      activa: true
    }
  ]);

  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    activa: true
  });

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Editar clínica existente
      setClinicas(prev => prev.map(clinica => 
        clinica.id === editingId 
          ? { ...formData, id: editingId }
          : clinica
      ));
    } else {
      // Agregar nueva clínica
      const newClinica = {
        ...formData,
        id: Math.max(...clinicas.map(c => c.id)) + 1
      };
      setClinicas(prev => [...prev, newClinica]);
    }

    // Limpiar formulario
    setFormData({
      nombre: '',
      direccion: '',
      telefono: '',
      email: '',
      activa: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (clinica) => {
    setFormData(clinica);
    setEditingId(clinica.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta clínica?')) {
      setClinicas(prev => prev.filter(clinica => clinica.id !== id));
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: '',
      direccion: '',
      telefono: '',
      email: '',
      activa: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Gestión de Clínicas</h2>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Nueva Clínica
            </button>
          </div>

          {/* Formulario */}
          {showForm && (
            <div className="card mb-4">
              <div className="card-header">
                <h5>{editingId ? 'Editar Clínica' : 'Nueva Clínica'}</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="nombre" className="form-label">Nombre *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="telefono" className="form-label">Teléfono *</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-8 mb-3">
                      <label htmlFor="direccion" className="form-label">Dirección *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label htmlFor="email" className="form-label">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="activa"
                          name="activa"
                          checked={formData.activa}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="activa">
                          Clínica Activa
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success">
                      {editingId ? 'Actualizar' : 'Guardar'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Lista de Clínicas */}
          <div className="card">
            <div className="card-header">
              <h5>Lista de Clínicas ({clinicas.length})</h5>
            </div>
            <div className="card-body">
              {clinicas.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-hospital fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No hay clínicas registradas</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>Teléfono</th>
                        <th>Email</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clinicas.map(clinica => (
                        <tr key={clinica.id}>
                          <td>
                            <strong>{clinica.nombre}</strong>
                          </td>
                          <td>{clinica.direccion}</td>
                          <td>{clinica.telefono}</td>
                          <td>{clinica.email}</td>
                          <td>
                            <span className={`badge ${clinica.activa ? 'bg-success' : 'bg-secondary'}`}>
                              {clinica.activa ? 'Activa' : 'Inactiva'}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleEdit(clinica)}
                                title="Editar"
                              >
                                Editar
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(clinica.id)}
                                title="Eliminar"
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

          {/* Información adicional */}
          <div className="alert alert-info mt-4">
            <h6><i className="fas fa-info-circle"></i> Información</h6>
            <p className="mb-0">
              Esta funcionalidad está en modo de demostración. Los datos se almacenan temporalmente en el navegador 
              y se perderán al recargar la página. En una implementación completa, estos datos se guardarían en el backend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionClinicas;
