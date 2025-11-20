import React, { useEffect, useMemo, useState } from 'react';

const HistoriaClinica = () => {
  const [user, setUser] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [docsLoading, setDocsLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    const bootstrap = async () => {
      await fetchSession();
      await loadDocumentos();
      setLoading(false);
    };
    bootstrap();
  }, []);

  const fetchSession = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/session', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setUser(data?.authenticated ? data : null);
    } catch (err) {
      console.error('Error verificando sesión', err);
      setUser(null);
    }
  };

  const loadDocumentos = async () => {
    setDocsLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8080/api/metadatos-documento/usuario', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Error HTTP ${response.status}`);
      }

      const data = await response.json();
      setDocumentos(Array.isArray(data) ? data : []);
      if (!Array.isArray(data) || data.length === 0) {
        setSelectedDoc(null);
      }
    } catch (err) {
      console.error('Error cargando documentos', err);
      setError(err.message || 'No se pudo obtener la historia clínica');
      setDocumentos([]);
    } finally {
      setDocsLoading(false);
    }
  };

  const filteredDocs = useMemo(() => {
    if (!search.trim()) return documentos;
    const term = search.toLowerCase();
    return documentos.filter((doc) => {
      const campos = [
        doc.tipoDocumento,
        doc.descripcion,
        doc.clinicaOrigen,
        doc.profesionalSalud,
        doc.formatoDocumento
      ].filter(Boolean);
      return campos.some((value) => value.toLowerCase().includes(term));
    });
  }, [documentos, search]);

  const resumen = useMemo(() => {
    const total = documentos.length;
    const restringidos = documentos.filter((doc) => doc.restringido || doc.accesoPermitido === false).length;
    return {
      total,
      conAcceso: total - restringidos,
      restringidos
    };
  }, [documentos]);

  const formatDate = (isoDate) => {
    if (!isoDate) return 'Sin fecha';
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return isoDate;
    return date.toLocaleString('es-UY', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = (doc) => {
    if (!doc?.uriDocumento) {
      alert('Este documento todavía no tiene un enlace de descarga disponible.');
      return;
    }
    window.open(doc.uriDocumento, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="slider_area" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <div className="container text-center">
          <h3>Cargando historia clínica...</h3>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="slider_area" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <div className="container text-center">
          <h3 style={{ color: '#1f2b7b', marginBottom: '20px' }}>Acceso restringido</h3>
          <p style={{ color: '#64748b', fontSize: '18px' }}>
            Debes iniciar sesión para revisar tu historia clínica electrónica.
          </p>
          <a href="/" className="boxed-btn3" style={{ marginTop: '20px' }}>
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="bradcam_area"
        style={{
          paddingTop: '120px',
          paddingBottom: '60px',
          background: 'linear-gradient(135deg, #1f2b7b 0%, #3b82f6 100%)',
          marginTop: '0px'
        }}
      >
        <div className="container text-center">
          <h3 style={{ color: '#ffffff', fontSize: '42px', fontWeight: '700', marginBottom: '10px' }}>
            Historia Clínica
          </h3>
          <p style={{ color: '#e2e8f0', fontSize: '18px' }}>
            Documentos registrados en el RNDC para {user?.primerNombre || 'tu usuario'}
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
        {error && (
          <div className="alert alert-warning" role="alert">
            <i className="fa fa-exclamation-triangle me-2" />
            {error}
          </div>
        )}

        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <div className="card-body text-center">
                <p className="text-muted text-uppercase mb-1">Documentos Totales</p>
                <h2 style={{ fontWeight: '700' }}>{resumen.total}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <div className="card-body text-center">
                <p className="text-muted text-uppercase mb-1">Accesos Permitidos</p>
                <h2 style={{ fontWeight: '700', color: '#16a34a' }}>{resumen.conAcceso}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <div className="card-body text-center">
                <p className="text-muted text-uppercase mb-1">Restringidos</p>
                <h2 style={{ fontWeight: '700', color: '#dc2626' }}>{resumen.restringidos}</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4" style={{ borderRadius: '16px', boxShadow: '0 12px 30px rgba(15,23,42,0.08)' }}>
          <div className="card-body">
            <div className="row g-3 align-items-center">
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por descripción, clínica, profesional o tipo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="col-md-4 text-end">
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={loadDocumentos}
                  disabled={docsLoading}
                >
                  {docsLoading ? 'Actualizando...' : 'Actualizar'}
                </button>
                <span className="text-muted" style={{ fontSize: '14px' }}>
                  {filteredDocs.length} resultados
                </span>
              </div>
            </div>
          </div>
        </div>

        {docsLoading && (
          <div className="alert alert-info">
            <i className="fa fa-spinner fa-spin me-2" />
            Buscando documentos en el RNDC...
          </div>
        )}

        {filteredDocs.length === 0 && !docsLoading ? (
          <div className="text-center py-5">
            <i className="fa fa-folder-open" style={{ fontSize: '60px', color: '#cbd5f5' }} />
            <p className="mt-3 text-muted">No hay documentos disponibles.</p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredDocs.map((doc) => (
              <div className="col-xl-6" key={doc.id}>
                <div className="card h-100 shadow-sm" style={{ borderRadius: '16px' }}>
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h5 style={{ color: '#1f2937', fontWeight: '600', marginBottom: '6px' }}>
                          {doc.tipoDocumento || 'Documento clínico'}
                        </h5>
                        <small className="text-muted">{formatDate(doc.fechaCreacion)}</small>
                      </div>
                    </div>

                    <p className="text-muted mb-3" style={{ minHeight: '46px' }}>
                      {doc.descripcion || 'Sin descripción'}
                    </p>

                    <div className="mb-3">
                      <small className="d-block text-muted">
                        <strong>Clínica:</strong> {doc.clinicaOrigen || 'No informado'}
                      </small>
                      <small className="d-block text-muted">
                        <strong>Profesional:</strong> {doc.profesionalSalud || 'No informado'}
                      </small>
                      <small className="d-block text-muted">
                        <strong>Formato:</strong> {doc.formatoDocumento || 'PDF'}
                      </small>
                    </div>

                    <div className="mt-auto d-flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setSelectedDoc(doc)}
                      >
                        Ver detalles
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleDownload(doc)}
                        disabled={!doc.uriDocumento}
                      >
                        Descargar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedDoc && (
          <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.6)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: '16px', border: 'none' }}>
                <div className="modal-header border-0">
                  <div>
                    <h5 className="modal-title" style={{ fontWeight: '700' }}>
                      {selectedDoc.tipoDocumento || 'Documento clínico'}
                    </h5>
                    <small className="text-muted">{formatDate(selectedDoc.fechaCreacion)}</small>
                  </div>
                  <button type="button" className="btn-close" onClick={() => setSelectedDoc(null)} />
                </div>
                <div className="modal-body">
                  <dl className="row mb-0">
                    <dt className="col-sm-4">Descripción</dt>
                    <dd className="col-sm-8">{selectedDoc.descripcion || 'Sin descripción'}</dd>
                    <dt className="col-sm-4">Clínica</dt>
                    <dd className="col-sm-8">{selectedDoc.clinicaOrigen || 'No informado'}</dd>
                    <dt className="col-sm-4">Profesional</dt>
                    <dd className="col-sm-8">{selectedDoc.profesionalSalud || 'No informado'}</dd>
                    <dt className="col-sm-4">Formato</dt>
                    <dd className="col-sm-8">{selectedDoc.formatoDocumento || 'PDF'}</dd>
                    <dt className="col-sm-4">URL</dt>
                    <dd className="col-sm-8">
                      {selectedDoc.uriDocumento ? (
                        <a href={selectedDoc.uriDocumento} target="_blank" rel="noreferrer">
                          {selectedDoc.uriDocumento}
                        </a>
                      ) : (
                        'Sin URL registrada'
                      )}
                    </dd>
                  </dl>
                </div>
                <div className="modal-footer border-0">
                  <button className="btn btn-secondary" onClick={() => setSelectedDoc(null)}>
                    Cerrar
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleDownload(selectedDoc)}
                    disabled={!selectedDoc.uriDocumento}
                  >
                    Descargar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HistoriaClinica;
