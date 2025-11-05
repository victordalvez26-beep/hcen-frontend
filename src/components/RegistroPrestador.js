import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './GestionClinicas.css';

/**
 * Página de registro para Prestadores de Salud.
 * El prestador accede desde el link del email y completa sus datos.
 */
function RegistroPrestador() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  
  const [formData, setFormData] = useState({
    rut: '',
    url: '',
    departamento: '',
    localidad: '',
    direccion: '',
    telefono: ''
  });
  
  // Departamentos de Uruguay
  const departamentos = [
    'ARTIGAS', 'CANELONES', 'CERRO_LARGO', 'COLONIA', 'DURAZNO',
    'FLORES', 'FLORIDA', 'LAVALLEJA', 'MALDONADO', 'MONTEVIDEO',
    'PAYSANDU', 'RIO_NEGRO', 'RIVERA', 'ROCHA', 'SALTO',
    'SAN_JOSE', 'SORIANO', 'TACUAREMBO', 'TREINTA_Y_TRES'
  ];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.rut) {
      setMensaje({ tipo: 'error', texto: 'El RUT es obligatorio' });
      return;
    }
    
    if (!formData.url) {
      setMensaje({ tipo: 'error', texto: 'La URL del servidor es obligatoria' });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/prestadores-salud/completar-registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token,
          rut: formData.rut,
          url: formData.url,
          departamento: formData.departamento,
          localidad: formData.localidad,
          direccion: formData.direccion,
          telefono: formData.telefono
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setMensaje({ 
          tipo: 'success', 
          texto: `¡Registro completado! Tu prestador "${data.nombre}" ha sido activado en HCEN.` 
        });
        
        // Redirigir a página de éxito después de 3 segundos
        setTimeout(() => {
          navigate('/');
        }, 3000);
        
      } else {
        const errorData = await response.json();
        setMensaje({ 
          tipo: 'error', 
          texto: errorData.error || 'Error al completar el registro' 
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje({ tipo: 'error', texto: 'Error de conexión. Intente nuevamente.' });
    } finally {
      setLoading(false);
    }
  };
  
  if (!token) {
    return (
      <div className="slider_area" style={{minHeight: '100vh', display: 'flex', alignItems: 'center'}}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="slider_text text-center">
                <h3 style={{color: 'var(--error-color)', marginBottom: '20px'}}>Token Inválido</h3>
                <p style={{color: 'var(--text-secondary)', fontSize: '18px'}}>
                  El link de registro no es válido o ha expirado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="slider_area" style={{minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px'}}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-10">
            
            {/* Header */}
            <div className="text-center" style={{marginBottom: '40px'}}>
              <div style={{fontSize: '64px', marginBottom: '20px'}}>🏥</div>
              <h2 style={{color: 'var(--primary-color)', marginBottom: '10px'}}>
                Registro de Prestador de Salud
              </h2>
              <p style={{color: 'var(--text-secondary)', fontSize: '16px'}}>
                Complete los datos de su organización para finalizar el registro en HCEN
              </p>
            </div>
            
            {/* Mensajes */}
            {mensaje.texto && (
              <div className={`mensaje ${mensaje.tipo}`} style={{marginBottom: '30px'}}>
                {mensaje.texto}
              </div>
            )}
            
            {/* Formulario */}
            <div className="form-card">
              <form onSubmit={handleSubmit}>
                
                {/* RUT */}
                <div className="form-group">
                  <label htmlFor="rut">RUT *</label>
                  <input
                    id="rut"
                    name="rut"
                    type="text"
                    value={formData.rut}
                    onChange={handleInputChange}
                    placeholder="211234560012"
                    maxLength="12"
                    required
                  />
                  <small className="form-hint">
                    Registro Único Tributario (12 dígitos)
                  </small>
                </div>
                
                {/* URL del Servidor */}
                <div className="form-group">
                  <label htmlFor="url">URL del Servidor de Documentos Clínicos *</label>
                  <input
                    id="url"
                    name="url"
                    type="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    placeholder="https://api.miprestador.com"
                    required
                  />
                  <small className="form-hint">
                    URL base de su servidor que provee el servicio de documentos clínicos
                  </small>
                </div>
                
                {/* Departamento */}
                <div className="form-group">
                  <label htmlFor="departamento">Departamento</label>
                  <select
                    id="departamento"
                    name="departamento"
                    value={formData.departamento}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Seleccione --</option>
                    {departamentos.map(dept => (
                      <option key={dept} value={dept}>
                        {dept.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Localidad */}
                <div className="form-group">
                  <label htmlFor="localidad">Localidad</label>
                  <input
                    id="localidad"
                    name="localidad"
                    type="text"
                    value={formData.localidad}
                    onChange={handleInputChange}
                    placeholder="Ej: Montevideo"
                  />
                </div>
                
                {/* Dirección */}
                <div className="form-group">
                  <label htmlFor="direccion">Dirección</label>
                  <input
                    id="direccion"
                    name="direccion"
                    type="text"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    placeholder="Ej: Av. Italia 2000"
                  />
                </div>
                
                {/* Teléfono */}
                <div className="form-group">
                  <label htmlFor="telefono">Teléfono</label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="Ej: 099 123 456"
                  />
                </div>
                
                {/* Botones */}
                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn-success"
                    disabled={loading}
                  >
                    {loading ? 'Registrando...' : '✅ Completar Registro'}
                  </button>
                </div>
              </form>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistroPrestador;

