import React, { useState, useEffect } from 'react';
import './GestionClinicas.css'; // Reutilizamos los mismos estilos

/**
 * Componente para gestionar Prestadores de Salud.
 * Los administradores de HCEN pueden invitar prestadores que completen su registro.
 */
function GestionPrestadores() {
  const [prestadores, setPrestadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    contacto: ''
  });
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    cargarPrestadores();
  }, []);

  const cargarPrestadores = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/prestadores-salud', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setPrestadores(data);
      } else {
        mostrarMensaje('error', 'Error al cargar prestadores');
      }
    } catch (error) {
      console.error('Error:', error);
      mostrarMensaje('error', 'Error de conexión al cargar prestadores');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.contacto) {
      mostrarMensaje('error', 'Nombre y email son obligatorios');
      return;
    }

    try {
      const response = await fetch('/api/prestadores-salud/invitar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        mostrarMensaje('success', 
          `Invitación enviada a ${formData.contacto}. ` +
          `El prestador recibirá un email para completar su registro.`
        );
        setShowForm(false);
        resetForm();
        cargarPrestadores();
        
        // Mostrar URL de invitación en consola para debugging
        if (data.invitationUrl) {
          console.log('🔗 URL de invitación:', data.invitationUrl);
        }
      } else {
        const errorData = await response.json();
        mostrarMensaje('error', errorData.error || 'Error al enviar invitación');
      }
    } catch (error) {
      console.error('Error:', error);
      mostrarMensaje('error', 'Error de conexión al enviar invitación');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      contacto: ''
    });
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 5000);
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'ACTIVO': { texto: 'Activo', clase: 'badge-activo' },
      'PENDIENTE_REGISTRO': { texto: 'Pendiente Registro', clase: 'badge-pendiente' },
      'INACTIVO': { texto: 'Inactivo', clase: 'badge-inactivo' },
      'ERROR_CONEXION': { texto: 'Error Conexión', clase: 'badge-error' }
    };
    
    const badge = badges[estado] || { texto: estado, clase: '' };
    return <span className={`status-badge ${badge.clase}`}>{badge.texto}</span>;
  };

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <div>
          <h2>🏥 Gestión de Prestadores de Salud</h2>
          <p className="subtitle">
            Administra prestadores de salud registrados en la plataforma HCEN.
            Los prestadores hospedan su propia infraestructura y proporcionan acceso a documentos clínicos.
          </p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '❌ Cancelar' : '➕ Invitar Prestador'}
        </button>
      </div>

      {mensaje.texto && (
        <div className={`mensaje ${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}

      {showForm && (
        <div className="form-card">
          <h3>Invitar Nuevo Prestador</h3>
          <p className="form-description">
            Complete los datos básicos del prestador. Recibirá un email para completar 
            el registro con RUT, URL del servidor y dirección.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre del Prestador *</label>
              <input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                placeholder="Ej: Laboratorio Clínico Central"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contacto">Email de Contacto *</label>
              <input
                id="contacto"
                type="email"
                value={formData.contacto}
                onChange={(e) => setFormData({...formData, contacto: e.target.value})}
                placeholder="contacto@prestador.com"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-success">
                📧 Enviar Invitación
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => { setShowForm(false); resetForm(); }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <h3>Prestadores Registrados ({prestadores.length})</h3>
        
        {loading ? (
          <div className="loading">Cargando prestadores...</div>
        ) : prestadores.length === 0 ? (
          <div className="empty-state">
            <p>No hay prestadores registrados.</p>
            <p>Haz clic en "Invitar Prestador" para enviar la primera invitación.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>RUT</th>
                <th>Email Contacto</th>
                <th>URL Servidor</th>
                <th>Ubicación</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {prestadores.map(prestador => (
                <tr key={prestador.id}>
                  <td>{prestador.id}</td>
                  <td><strong>{prestador.nombre}</strong></td>
                  <td>{prestador.rut || '-'}</td>
                  <td>{prestador.contacto}</td>
                  <td>
                    {prestador.url ? (
                      <a 
                        href={prestador.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="link-url"
                      >
                        {prestador.url}
                      </a>
                    ) : (
                      <span className="text-muted">Pendiente</span>
                    )}
                  </td>
                  <td>
                    {prestador.departamento && prestador.localidad
                      ? `${prestador.localidad}, ${prestador.departamento}`
                      : prestador.departamento || '-'}
                  </td>
                  <td>
                    {getEstadoBadge(prestador.estado)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default GestionPrestadores;

