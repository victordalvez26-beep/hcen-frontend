import React, { useState, useEffect } from 'react';
import config from '../config';

const MiPerfil = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('informacion'); // 'informacion', 'politicas', 'accesos' o 'solicitudes'
  const [politicas, setPoliticas] = useState([]);
  const [accesosHistoria, setAccesosHistoria] = useState([]);
  const [solicitudesAcceso, setSolicitudesAcceso] = useState([]);
  const [loadingPoliticas, setLoadingPoliticas] = useState(false);
  const [loadingAccesos, setLoadingAccesos] = useState(false);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [clinicas, setClinicas] = useState([]);
  const [loadingClinicas, setLoadingClinicas] = useState(false);
  const [todosLosProfesionales, setTodosLosProfesionales] = useState(true); // Si true, todos los profesionales de la clínica
  const [especialidadesSeleccionadas, setEspecialidadesSeleccionadas] = useState([]); // Lista de especialidades seleccionadas
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  
  // Lista de especialidades disponibles (mismas para todas las clínicas)
  const especialidadesDisponibles = [
    { value: 'MEDICINA_GENERAL', label: 'Medicina General' },
    { value: 'MEDICINA_INTERNA', label: 'Medicina Interna' },
    { value: 'MEDICINA_FAMILIAR', label: 'Medicina Familiar' },
    { value: 'MEDICINA_PREVENTIVA', label: 'Medicina Preventiva' },
    { value: 'MEDICINA_DEPORTIVA', label: 'Medicina Deportiva' },
    { value: 'MEDICINA_REHABILITACION', label: 'Medicina Rehabilitación' },
    { value: 'MEDICINA_CRITICA', label: 'Medicina Crítica' },
    { value: 'MEDICINA_DE_URGENCIAS', label: 'Medicina de Urgencias' },
    { value: 'MEDICINA_DEL_TRABAJO', label: 'Medicina del Trabajo' },
    { value: 'MEDICINA_FORNENSE', label: 'Medicina Forense' },
    { value: 'CARDIOLOGIA', label: 'Cardiología' },
    { value: 'NEUMOLOGIA', label: 'Neumología' },
    { value: 'GASTROENTEROLOGIA', label: 'Gastroenterología' },
    { value: 'HEPATOLOGIA', label: 'Hepatología' },
    { value: 'NEFROLOGIA', label: 'Nefrología' },
    { value: 'ENDOCRINOLOGIA', label: 'Endocrinología' },
    { value: 'HEMATOLOGIA', label: 'Hematología' },
    { value: 'ONCOLOGIA', label: 'Oncología' },
    { value: 'INFECTOLOGIA', label: 'Infectología' },
    { value: 'REUMATOLOGIA', label: 'Reumatología' },
    { value: 'INMUNOLOGIA', label: 'Inmunología' },
    { value: 'NEUROLOGIA', label: 'Neurología' },
    { value: 'NEUROCIRUGIA', label: 'Neurocirugía' },
    { value: 'PSIQUIATRIA', label: 'Psiquiatría' },
    { value: 'PSIQUIATRIA_INFANTIL', label: 'Psiquiatría Infantil' },
    { value: 'GINECOLOGIA', label: 'Ginecología' },
    { value: 'OBSTETRICIA', label: 'Obstetricia' },
    { value: 'PEDIATRIA', label: 'Pediatría' },
    { value: 'NEONATOLOGIA', label: 'Neonatología' },
    { value: 'DERMATOLOGIA', label: 'Dermatología' },
    { value: 'OFTALMOLOGIA', label: 'Oftalmología' },
    { value: 'OTORRINOLARINGOLOGIA', label: 'Otorrinolaringología' },
    { value: 'UROLOGIA', label: 'Urología' },
    { value: 'ANDROLOGIA', label: 'Andrología' },
    { value: 'ORTOPEDIA', label: 'Ortopedia' },
    { value: 'TRAUMATOLOGIA', label: 'Traumatología' },
    { value: 'CIRUGIA_GENERAL', label: 'Cirugía General' },
    { value: 'CIRUGIA_PLASTICA', label: 'Cirugía Plástica' },
    { value: 'CIRUGIA_PEDIATRICA', label: 'Cirugía Pediátrica' },
    { value: 'CIRUGIA_CARDIOVASCULAR', label: 'Cirugía Cardiovascular' },
    { value: 'CIRUGIA_NEUROLOGICA', label: 'Cirugía Neurológica' },
    { value: 'CIRUGIA_BUCOMAXILOFACIAL', label: 'Cirugía Bucomaxilofacial' },
    { value: 'ANESTESIOLOGIA', label: 'Anestesiología' },
    { value: 'RADIOLOGIA', label: 'Radiología' },
    { value: 'IMAGENOLOGIA', label: 'Imagenología' },
    { value: 'MEDICINA_NUCLEAR', label: 'Medicina Nuclear' },
    { value: 'PATOLOGIA', label: 'Patología' },
    { value: 'LABORATORIO_CLINICO', label: 'Laboratorio Clínico' },
    { value: 'ODONTOLOGIA', label: 'Odontología' },
    { value: 'ORTODONCIA', label: 'Ortodoncia' },
    { value: 'ENDODONCIA', label: 'Endodoncia' },
    { value: 'PERIODONCIA', label: 'Periodoncia' },
    { value: 'PROTESIS_DENTAL', label: 'Prótesis Dental' },
    { value: 'PODIATRIA', label: 'Podiatría' },
    { value: 'FISIATRIA', label: 'Fisiatría' },
    { value: 'TERAPIA_OCUPACIONAL', label: 'Terapia Ocupacional' },
    { value: 'TERAPIA_FISICA', label: 'Terapia Física' },
    { value: 'NUTRICION', label: 'Nutrición' },
    { value: 'PSICOLOGIA_CLINICA', label: 'Psicología Clínica' },
    { value: 'ENFERMERIA', label: 'Enfermería' },
    { value: 'ENFERMERIA_PEDIATRICA', label: 'Enfermería Pediátrica' },
    { value: 'CUIDADOS_PALIATIVOS', label: 'Cuidados Paliativos' },
    { value: 'MEDICINA_FAMILIAR_Y_COMUNITARIA', label: 'Medicina Familiar y Comunitaria' }
  ];
  
  const [formData, setFormData] = useState({
    alcance: 'TODOS_LOS_DOCUMENTOS',
    duracion: 'INDEFINIDA',
    gestion: 'AUTOMATICA',
    codDocumPaciente: '',
    clinicaAutorizada: '',
    tipoDocumento: '',
    fechaVencimiento: '',
    referencia: ''
  });

  useEffect(() => {
    checkSession();
  }, []);

  // Hook para manejar el resize de la ventana
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (activeSection === 'politicas' && user) {
      loadPoliticas();
      loadClinicas();
    } else if (activeSection === 'accesos' && user) {
      loadAccesosHistoria();
    } else if (activeSection === 'solicitudes' && user) {
      loadSolicitudesAcceso();
    }
  }, [activeSection, user]);

  // Cargar solicitudes pendientes al iniciar para mostrar el contador en la pestaña
  useEffect(() => {
    if (user && activeSection !== 'solicitudes') {
      // Solo cargar si no estamos en la sección de solicitudes (para evitar duplicados)
      const userDocumento = user?.codDocum || user?.documento;
      let documentoPaciente = userDocumento;
      if (!documentoPaciente && user?.uid) {
        const match = user.uid.match(/uy-ci-(\d+)/);
        if (match && match[1]) {
          documentoPaciente = match[1];
        }
      }
      
      if (documentoPaciente) {
        fetch(`${config.BACKEND_URL}/hcen-politicas-service/api/solicitudes/paciente/${documentoPaciente}/pendientes`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.ok ? response.json() : [])
        .then(data => setSolicitudesAcceso(data || []))
        .catch(error => {
          console.error('Error cargando contador de solicitudes:', error);
          setSolicitudesAcceso([]);
        });
      }
    }
  }, [user]);

  useEffect(() => {
    // Intentar obtener el documento del paciente
    let documentoPaciente = user?.codDocum;
    
    // Si no hay codDocum, intentar extraerlo del UID (formato: uy-ci-XXXXXXXX)
    if (!documentoPaciente && user?.uid) {
      const match = user.uid.match(/uy-ci-(\d+)/);
      if (match && match[1]) {
        documentoPaciente = match[1];
      }
    }
    
    if (documentoPaciente) {
      setFormData((prev) => {
        if (prev.codDocumPaciente === documentoPaciente) {
          return prev;
        }
        return {
          ...prev,
          codDocumPaciente: documentoPaciente
        };
      });
    }
  }, [user]);

  const loadAccesosHistoria = async () => {
    try {
      setLoadingAccesos(true);
      // Obtener registros de acceso del paciente actual
      let userDocumento = user?.codDocum || user?.documento;
      
      // Si no hay codDocum, intentar extraerlo del UID (formato: uy-ci-XXXXXXXX)
      if (!userDocumento && user?.uid) {
        const match = user.uid.match(/uy-ci-(\d+)/);
        if (match && match[1]) {
          userDocumento = match[1];
          console.log(`📋 CI extraído del UID: ${userDocumento}`);
        }
      }
      
      if (!userDocumento) {
        console.warn('⚠️ No se pudo obtener el documento del usuario. User object:', user);
        setAccesosHistoria([]);
        setLoadingAccesos(false);
        return;
      }

      console.log(`🔍 Cargando accesos para paciente CI: ${userDocumento}`);

      // Usar el endpoint del servicio de políticas para obtener registros de acceso por paciente
      const response = await fetch(`${config.BACKEND_URL}/hcen-politicas-service/api/registros/paciente/${userDocumento}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(`📡 Respuesta de accesos - Status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Accesos recibidos:`, data);
        // Ordenar por fecha descendente (más recientes primero)
        const accesosOrdenados = Array.isArray(data) ? data.sort((a, b) => {
          const fechaA = a.fecha ? new Date(a.fecha) : new Date(0);
          const fechaB = b.fecha ? new Date(b.fecha) : new Date(0);
          return fechaB - fechaA;
        }) : [];
        console.log(`📊 Total de accesos ordenados: ${accesosOrdenados.length}`);
        setAccesosHistoria(accesosOrdenados);
      } else {
        console.error('Error cargando accesos:', response.status, response.statusText);
        setAccesosHistoria([]);
      }
    } catch (error) {
      console.error('Error cargando accesos:', error);
      setAccesosHistoria([]);
    } finally {
      setLoadingAccesos(false);
    }
  };

  const loadSolicitudesAcceso = async () => {
    try {
      setLoadingSolicitudes(true);
      const userDocumento = user?.codDocum || user?.documento;
      
      // Si no hay codDocum, intentar extraerlo del UID (formato: uy-ci-XXXXXXXX)
      let documentoPaciente = userDocumento;
      if (!documentoPaciente && user?.uid) {
        const match = user.uid.match(/uy-ci-(\d+)/);
        if (match && match[1]) {
          documentoPaciente = match[1];
        }
      }
      
      if (!documentoPaciente) {
        setSolicitudesAcceso([]);
        setLoadingSolicitudes(false);
        return;
      }

      // Obtener solicitudes pendientes del paciente
      const response = await fetch(`${config.BACKEND_URL}/hcen-politicas-service/api/solicitudes/paciente/${documentoPaciente}/pendientes`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSolicitudesAcceso(data || []);
      } else {
        console.error('Error cargando solicitudes de acceso');
        setSolicitudesAcceso([]);
      }
    } catch (error) {
      console.error('Error cargando solicitudes de acceso:', error);
      setSolicitudesAcceso([]);
    } finally {
      setLoadingSolicitudes(false);
    }
  };

  const handleAprobarSolicitud = async (solicitudId) => {
    try {
      const response = await fetch(`${config.BACKEND_URL}/hcen-politicas-service/api/solicitudes/${solicitudId}/aprobar`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resueltoPor: user?.uid || user?.email || 'Paciente',
          comentario: 'Solicitud aprobada por el paciente'
        })
      });

      if (response.ok) {
        setMessage('Solicitud aprobada exitosamente');
        loadSolicitudesAcceso();
        // Recargar políticas también para reflejar el nuevo acceso
        if (activeSection === 'politicas') {
          loadPoliticas();
        }
      } else {
        const errorData = await response.json();
        setMessage('Error al aprobar solicitud: ' + (errorData.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error aprobando solicitud:', error);
      setMessage('Error de conexión al aprobar solicitud');
    }
    setTimeout(() => setMessage(''), 5000);
  };

  const handleRechazarSolicitud = async (solicitudId) => {
    const comentario = window.prompt('Ingrese un motivo para rechazar la solicitud (opcional):');
    if (comentario === null) {
      return; // Usuario canceló
    }

    try {
      const response = await fetch(`${config.BACKEND_URL}/hcen-politicas-service/api/solicitudes/${solicitudId}/rechazar`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resueltoPor: user?.uid || user?.email || 'Paciente',
          comentario: comentario || 'Solicitud rechazada por el paciente'
        })
      });

      if (response.ok) {
        setMessage('Solicitud rechazada exitosamente');
        loadSolicitudesAcceso();
      } else {
        const errorData = await response.json();
        setMessage('Error al rechazar solicitud: ' + (errorData.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error rechazando solicitud:', error);
      setMessage('Error de conexión al rechazar solicitud');
    }
    setTimeout(() => setMessage(''), 5000);
  };


  const loadClinicas = async () => {
    try {
      setLoadingClinicas(true);
      const response = await fetch(`${config.BACKEND_URL}/api/nodos`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Mapear NodoPerifericoDTO a formato compatible con el combo box
        // Los nodos tienen: id, nombre, rut (RUT), estado, etc.
        const clinicasFormateadas = Array.isArray(data) ? data.map(nodo => ({
          id: nodo.id,
          nombre: nodo.nombre,
          rut: nodo.rut || nodo.RUT, // Puede venir como 'rut' o 'RUT'
          estado: nodo.estado
        })) : [];
        setClinicas(clinicasFormateadas);
      } else {
        console.error('Error cargando clínicas');
        setMessage('Error cargando clínicas. Vuelve a intentarlo en unos minutos.');
      }
    } catch (error) {
      console.error('Error cargando clínicas:', error);
      setMessage('Error cargando clínicas. Vuelve a intentarlo en unos minutos.');
    } finally {
      setLoadingClinicas(false);
    }
  };

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
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error verificando sesión:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loadPoliticas = async () => {
    try {
      setLoadingPoliticas(true);
      const response = await fetch(`${config.BACKEND_URL}/api/documentos/politicas`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPoliticas(data);
      } else {
        const errorData = await response.json();
        setMessage('Error cargando políticas: ' + (errorData.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error cargando políticas:', error);
      setMessage('Error de conexión al cargar políticas');
    } finally {
      setLoadingPoliticas(false);
    }
  };

  const filteredPoliticas = politicas.filter(politica => {
    if (!searchTerm) return true;
    
    // Buscar por clínica
    const clinicaStr = politica.clinicaAutorizada?.toLowerCase() || '';
    const especialidadesStr = parseEspecialidadesParaMostrar(politica.especialidadesAutorizadas)?.toLowerCase() || '';
    return clinicaStr.includes(searchTerm.toLowerCase()) || especialidadesStr.includes(searchTerm.toLowerCase());
  });
  
  // Helper para parsear especialidades y mostrarlas
  const parseEspecialidadesParaMostrar = (especialidadesStr) => {
    if (!especialidadesStr || especialidadesStr.trim() === '') {
      return 'Todas las especialidades';
    }
    
    try {
      // Intentar parsear como JSON array
      if (especialidadesStr.startsWith('[') && especialidadesStr.endsWith(']')) {
        const especialidades = JSON.parse(especialidadesStr);
        if (Array.isArray(especialidades) && especialidades.length > 0) {
          return especialidades.map(esp => {
            const especialidad = especialidadesDisponibles.find(e => e.value === esp);
            return especialidad ? especialidad.label : esp;
          }).join(', ');
        }
      }
      // Si es comma-separated
      const especialidades = especialidadesStr.split(',').map(s => s.trim());
      return especialidades.map(esp => {
        const especialidad = especialidadesDisponibles.find(e => e.value === esp);
        return especialidad ? especialidad.label : esp;
      }).join(', ');
    } catch (e) {
      return especialidadesStr;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Preparar datos según el tipo de autorizado
    const politicaData = { ...formData };
    
    // Intentar obtener el documento del paciente de varias fuentes
    let documentoPaciente = user?.codDocum || formData.codDocumPaciente;
    
    // Si no hay codDocum, intentar extraerlo del UID (formato: uy-ci-XXXXXXXX)
    if (!documentoPaciente && user?.uid) {
      const match = user.uid.match(/uy-ci-(\d+)/);
      if (match && match[1]) {
        documentoPaciente = match[1];
        console.log('Documento extraído del UID:', documentoPaciente);
      }
    }

    if (!documentoPaciente) {
      setMessage('No se pudo determinar el documento del paciente autenticado. Por favor, complete su perfil.');
      return;
    }

    politicaData.codDocumPaciente = documentoPaciente;
    
    // Validar que se haya seleccionado una clínica
    if (!formData.clinicaAutorizada) {
      setMessage('Debe seleccionar una clínica.');
      return;
    }
    
    politicaData.clinicaAutorizada = formData.clinicaAutorizada;
    
    // Manejar especialidades: si todosLosProfesionales está marcado, enviar null/array vacío
    // Si no, enviar el array de especialidades seleccionadas
    if (todosLosProfesionales) {
      politicaData.especialidadesAutorizadas = []; // Array vacío = todos los profesionales
    } else {
      if (especialidadesSeleccionadas.length === 0) {
        setMessage('Debe seleccionar al menos una especialidad o marcar "Todos los profesionales".');
        return;
      }
      politicaData.especialidadesAutorizadas = especialidadesSeleccionadas;
    }
    
    // Limpiar campos vacíos que pueden causar problemas de deserialización
    if (!politicaData.tipoDocumento || politicaData.tipoDocumento.trim() === '') {
      delete politicaData.tipoDocumento;
    }
    if (!politicaData.fechaVencimiento || politicaData.fechaVencimiento.trim() === '') {
      delete politicaData.fechaVencimiento;
    }
    if (!politicaData.referencia || politicaData.referencia.trim() === '') {
      delete politicaData.referencia;
    }
    
    console.log('Datos a enviar:', politicaData);
    
    try {
      console.log('Enviando request a:', `${config.BACKEND_URL}/api/documentos/politicas`);
      console.log('Body:', JSON.stringify(politicaData));
      
      const response = await fetch(`${config.BACKEND_URL}/api/documentos/politicas`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(politicaData)
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Respuesta exitosa:', data);
        setMessage(data.mensaje || 'Política creada exitosamente');
        setShowModal(false);
        resetForm();
        loadPoliticas();
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: errorText || 'Error desconocido' };
        }
        setMessage('Error creando política: ' + (errorData.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error creando política:', error);
      setMessage('Error de conexión al crear política: ' + error.message);
    }

    setTimeout(() => setMessage(''), 5000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar esta política?')) {
      return;
    }

    try {
      const response = await fetch(`${config.BACKEND_URL}/api/documentos/politicas/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setMessage('Política eliminada exitosamente');
        loadPoliticas();
      } else {
        const errorData = await response.json();
        setMessage('Error eliminando política: ' + (errorData.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error eliminando política:', error);
      setMessage('Error de conexión al eliminar política');
    }

    setTimeout(() => setMessage(''), 5000);
  };

  const resetForm = () => {
    setFormData({
      alcance: 'TODOS_LOS_DOCUMENTOS',
      duracion: 'INDEFINIDA',
      gestion: 'AUTOMATICA',
      codDocumPaciente: '',
      clinicaAutorizada: '',
      tipoDocumento: '',
      fechaVencimiento: '',
      referencia: ''
    });
    setTodosLosProfesionales(true);
    setEspecialidadesSeleccionadas([]);
  };
  
  const handleEspecialidadToggle = (especialidad) => {
    if (especialidadesSeleccionadas.includes(especialidad)) {
      setEspecialidadesSeleccionadas(especialidadesSeleccionadas.filter(e => e !== especialidad));
    } else {
      setEspecialidadesSeleccionadas([...especialidadesSeleccionadas, especialidad]);
    }
  };

  const getAlcanceLabel = (alcance) => {
    const labels = {
      'TODOS_LOS_DOCUMENTOS': 'Todos los Documentos',
      'DOCUMENTOS_POR_TIPO': 'Por Tipo de Documento',
      'UN_DOCUMENTO_ESPECIFICO': 'Un Documento Específico'
    };
    return labels[alcance] || alcance;
  };

  const getDuracionLabel = (duracion) => {
    const labels = {
      'INDEFINIDA': 'Indefinida',
      'TEMPORAL': 'Temporal'
    };
    return labels[duracion] || duracion;
  };

  const getGestionLabel = (gestion) => {
    const labels = {
      'AUTOMATICA': 'Automática',
      'MANUAL': 'Manual'
    };
    return labels[gestion] || gestion;
  };

  const getAlcanceBadgeColor = (alcance) => {
    const colors = {
      'TODOS_LOS_DOCUMENTOS': '#8b5cf6',
      'DOCUMENTOS_POR_TIPO': '#3b82f6',
      'UN_DOCUMENTO_ESPECIFICO': '#10b981'
    };
    return colors[alcance] || '#6b7280';
  };


  if (loading) {
    return (
      <div className="bradcam_area" style={{
        paddingTop: '120px',
        paddingBottom: '80px',
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
        position: 'relative',
        overflow: 'hidden',
        marginTop: '0px',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="text-center">
                <div className="spinner-border text-light" role="status" style={{width: '3rem', height: '3rem'}}>
                  <span className="sr-only">Cargando...</span>
                </div>
                <p className="mt-3 text-white">Cargando perfil...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bradcam_area" style={{
        paddingTop: '120px',
        paddingBottom: '80px',
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
        position: 'relative',
        overflow: 'hidden',
        marginTop: '0px',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="text-center">
                <h3 style={{color: '#ffffff', marginBottom: '20px'}}>No autenticado</h3>
                <p style={{color: '#ffffff', fontSize: '18px'}}>
                  Por favor, inicia sesión para ver tu perfil
                </p>
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
        paddingTop: windowWidth < 768 ? '80px' : '120px',
        paddingBottom: windowWidth < 768 ? '50px' : '80px',
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
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
                  fontSize: windowWidth < 576 ? '32px' : windowWidth < 768 ? '40px' : '48px',
                  fontWeight: '700',
                  marginBottom: '15px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  padding: windowWidth < 576 ? '0 10px' : '0'
                }}>
                  Mi Perfil
                </h3>
                <p style={{
                  color: 'var(--text-light)',
                  fontSize: windowWidth < 576 ? '16px' : '18px',
                  marginBottom: '0',
                  fontWeight: '400',
                  padding: windowWidth < 576 ? '0 10px' : '0'
                }}>
                  Gestiona tu información personal y políticas de acceso
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

      <div className="container" style={{
        paddingTop: windowWidth < 768 ? '40px' : '80px', 
        paddingBottom: windowWidth < 768 ? '30px' : '60px',
        paddingLeft: windowWidth < 576 ? '15px' : undefined,
        paddingRight: windowWidth < 576 ? '15px' : undefined
      }}>
        {message && (
          <div className={`alert alert-${message.includes('Error') ? 'danger' : 'success'} alert-dismissible fade show`} role="alert" style={{
            marginBottom: '30px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: message.includes('Error') ? '#fee2e2' : '#d1fae5',
            color: message.includes('Error') ? '#991b1b' : '#065f46'
          }}>
            <i className={`fa ${message.includes('Error') ? 'fa-exclamation-circle' : 'fa-check-circle'}`} style={{marginRight: '8px'}}></i>
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
          </div>
        )}

        {/* Pestañas de navegación */}
        <div className="card mb-4" style={{
          borderRadius: '15px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden'
        }}>
          <div className="card-body" style={{padding: '0'}}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              borderBottom: '2px solid #e5e7eb',
              backgroundColor: '#f8fafc'
            }}>
              <button
                onClick={() => setActiveSection('informacion')}
                style={{
                  flex: '1 1 auto',
                  minWidth: windowWidth < 576 ? '100px' : '150px',
                  padding: windowWidth < 768 ? '15px 10px' : '20px 30px',
                  border: 'none',
                  backgroundColor: activeSection === 'informacion' ? '#ffffff' : 'transparent',
                  color: activeSection === 'informacion' ? '#3b82f6' : '#6b7280',
                  fontWeight: activeSection === 'informacion' ? '600' : '500',
                  fontSize: windowWidth < 768 ? '14px' : '16px',
                  cursor: 'pointer',
                  borderTopLeftRadius: '15px',
                  borderTopRightRadius: windowWidth >= 768 ? '0' : '15px',
                  transition: 'all 0.3s ease',
                  borderBottom: activeSection === 'informacion' ? '3px solid #3b82f6' : '3px solid transparent',
                  marginBottom: activeSection === 'informacion' ? '-2px' : '0',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <i className="fa fa-user" style={{flexShrink: 0}}></i>
                <span style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>
                  {windowWidth < 576 ? 'Info' : 'Información Personal'}
                </span>
              </button>
              <button
                onClick={() => setActiveSection('politicas')}
                style={{
                  flex: '1 1 auto',
                  minWidth: windowWidth < 576 ? '100px' : '150px',
                  padding: windowWidth < 768 ? '15px 10px' : '20px 30px',
                  border: 'none',
                  backgroundColor: activeSection === 'politicas' ? '#ffffff' : 'transparent',
                  color: activeSection === 'politicas' ? '#3b82f6' : '#6b7280',
                  fontWeight: activeSection === 'politicas' ? '600' : '500',
                  fontSize: windowWidth < 768 ? '14px' : '16px',
                  cursor: 'pointer',
                  borderTopLeftRadius: '0',
                  borderTopRightRadius: '0',
                  transition: 'all 0.3s ease',
                  borderBottom: activeSection === 'politicas' ? '3px solid #3b82f6' : '3px solid transparent',
                  marginBottom: activeSection === 'politicas' ? '-2px' : '0',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <i className="fa fa-shield-alt" style={{flexShrink: 0}}></i>
                <span style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>
                  {windowWidth < 576 ? 'Políticas' : 'Políticas de Acceso'}
                </span>
              </button>
              <button
                onClick={() => setActiveSection('accesos')}
                style={{
                  flex: '1 1 auto',
                  minWidth: windowWidth < 576 ? '100px' : '150px',
                  padding: windowWidth < 768 ? '15px 10px' : '20px 30px',
                  border: 'none',
                  backgroundColor: activeSection === 'accesos' ? '#ffffff' : 'transparent',
                  color: activeSection === 'accesos' ? '#3b82f6' : '#6b7280',
                  fontWeight: activeSection === 'accesos' ? '600' : '500',
                  fontSize: windowWidth < 768 ? '14px' : '16px',
                  cursor: 'pointer',
                  borderTopLeftRadius: '0',
                  borderTopRightRadius: '0',
                  transition: 'all 0.3s ease',
                  borderBottom: activeSection === 'accesos' ? '3px solid #3b82f6' : '3px solid transparent',
                  marginBottom: activeSection === 'accesos' ? '-2px' : '0',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <i className="fa fa-file-medical" style={{flexShrink: 0}}></i>
                <span style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>
                  {windowWidth < 576 ? 'Accesos' : windowWidth < 768 ? 'Historia Clínica' : 'Accesos a Historia Clínica'}
                </span>
              </button>
              <button
                onClick={() => setActiveSection('solicitudes')}
                style={{
                  flex: '1 1 auto',
                  minWidth: windowWidth < 576 ? '100px' : '150px',
                  padding: windowWidth < 768 ? '15px 10px' : '20px 30px',
                  border: 'none',
                  backgroundColor: activeSection === 'solicitudes' ? '#ffffff' : 'transparent',
                  color: activeSection === 'solicitudes' ? '#3b82f6' : '#6b7280',
                  fontWeight: activeSection === 'solicitudes' ? '600' : '500',
                  fontSize: windowWidth < 768 ? '14px' : '16px',
                  cursor: 'pointer',
                  borderTopLeftRadius: windowWidth >= 768 ? '0' : '15px',
                  borderTopRightRadius: '15px',
                  transition: 'all 0.3s ease',
                  borderBottom: activeSection === 'solicitudes' ? '3px solid #3b82f6' : '3px solid transparent',
                  marginBottom: activeSection === 'solicitudes' ? '-2px' : '0',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <i className="fa fa-bell" style={{flexShrink: 0}}></i>
                <span style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>
                  {windowWidth < 576 ? 'Solicitudes' : 'Solicitudes de Acceso'}
                  {solicitudesAcceso.length > 0 && (
                    <span style={{
                      marginLeft: '8px',
                      backgroundColor: '#dc2626',
                      color: '#ffffff',
                      borderRadius: '50%',
                      padding: '2px 6px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {solicitudesAcceso.length}
                    </span>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Contenido de la sección activa */}
        {activeSection === 'informacion' && (
          <div className="card" style={{
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
            border: '1px solid var(--border-color)'
          }}>
            <div className="card-body" style={{padding: '40px'}}>
              <h4 style={{
                color: '#1f2937',
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '30px',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '15px'
              }}>
                <i className="fa fa-user-circle" style={{marginRight: '10px', color: '#3b82f6'}}></i>
                Información del Usuario
              </h4>
              
              <div className="row">
                <div className="col-md-6 mb-4">
                  <label style={{
                    color: '#6b7280',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    Nombre Completo
                  </label>
                  <div style={{
                    padding: '12px 16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    color: '#1f2937',
                    fontSize: '16px',
                    border: '1px solid #e5e7eb'
                  }}>
                    {user.nombre || 'No disponible'}
                  </div>
                </div>

                <div className="col-md-6 mb-4">
                  <label style={{
                    color: '#6b7280',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    Email
                  </label>
                  <div style={{
                    padding: '12px 16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    color: '#1f2937',
                    fontSize: '16px',
                    border: '1px solid #e5e7eb'
                  }}>
                    {user.email}
                  </div>
                </div>

                <div className="col-md-6 mb-4">
                  <label style={{
                    color: '#6b7280',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    UID
                  </label>
                  <div style={{
                    padding: '12px 16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    color: '#1f2937',
                    fontSize: '16px',
                    fontFamily: 'monospace',
                    border: '1px solid #e5e7eb'
                  }}>
                    {user.uid}
                  </div>
                </div>

                {user.nacionalidad && (
                  <div className="col-md-6 mb-4">
                    <label style={{
                      color: '#6b7280',
                      fontSize: '14px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '8px',
                      display: 'block'
                    }}>
                      Nacionalidad
                    </label>
                    <div style={{
                      padding: '12px 16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      color: '#1f2937',
                      fontSize: '16px',
                      border: '1px solid #e5e7eb'
                    }}>
                      {user.nacionalidad}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'politicas' && (
          <>
            <div className="row">
              <div className="col-xl-12">
                {/* Botón para crear nueva política */}
                <div className="mb-4" style={{
                  display: 'flex', 
                  flexDirection: windowWidth < 576 ? 'column' : 'row',
                  justifyContent: 'space-between', 
                  alignItems: windowWidth < 576 ? 'stretch' : 'center',
                  gap: windowWidth < 576 ? '15px' : '0'
                }}>
                  <h5 style={{
                    color: '#1f2937',
                    fontSize: windowWidth < 576 ? '18px' : '20px',
                    fontWeight: '600',
                    margin: '0',
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    <i className="fa fa-shield-alt" style={{color: '#3b82f6'}}></i>
                    <span>
                      {windowWidth < 576 ? 'Políticas' : 'Mis Políticas de Acceso'} ({filteredPoliticas.length})
                    </span>
                  </h5>
                  <button
                    onClick={() => setShowModal(true)}
                    style={{
                      backgroundColor: '#3b82f6',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: windowWidth < 576 ? '10px 16px' : '12px 24px',
                      fontSize: windowWidth < 576 ? '14px' : '16px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: windowWidth < 576 ? '100%' : 'auto'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#2563eb';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#3b82f6';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <i className="fa fa-plus"></i>
                    Nueva Política
                  </button>
                </div>

                {/* Barra de búsqueda */}
                <div className="card mb-4" style={{
                  borderRadius: '15px',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                  border: '1px solid var(--border-color)'
                }}>
                  <div className="card-body" style={{padding: '30px'}}>
                    <h5 className="card-title" style={{
                      color: '#1f2937',
                      marginBottom: '20px',
                      fontSize: '20px',
                      fontWeight: '600'
                    }}>
                      <i className="fa fa-search" style={{marginRight: '10px', color: '#3b82f6'}}></i>
                      Buscar Políticas
                    </h5>
                    <div className="row">
                      <div className="col-md-12">
                        <label className="form-label">Buscar por Profesional o Clínica</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Ingrese el ID del profesional o nombre de clínica..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{
                            borderRadius: '8px',
                            border: '2px solid #e5e7eb',
                            padding: '10px 15px',
                            fontSize: '16px',
                            width: '100%',
                            boxSizing: 'border-box',
                            minHeight: '48px'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabla de políticas */}
                {loadingPoliticas ? (
                  <div className="card" style={{
                    borderRadius: '15px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                    border: '1px solid var(--border-color)',
                    padding: '60px',
                    textAlign: 'center'
                  }}>
                    <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
                      <span className="sr-only">Cargando...</span>
                    </div>
                    <p className="mt-3" style={{color: '#6b7280'}}>Cargando políticas...</p>
                  </div>
                ) : (
                  <div className="card" style={{
                    borderRadius: '15px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div className="card-body" style={{padding: '30px'}}>
                      <div className="table-responsive">
                        <table className="table table-hover" style={{
                          width: '100%',
                          borderCollapse: 'separate',
                          borderSpacing: '0 10px'
                        }}>
                          <thead>
                            <tr style={{backgroundColor: '#f8fafc'}}>
                              <th style={{padding: '15px 20px', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', color: '#374151', fontWeight: '600'}}>ID</th>
                              <th style={{padding: '15px 20px', color: '#374151', fontWeight: '600'}}>Autorizado</th>
                              <th style={{padding: '15px 20px', color: '#374151', fontWeight: '600'}}>Alcance</th>
                              <th style={{padding: '15px 20px', color: '#374151', fontWeight: '600'}}>Duración</th>
                              <th style={{padding: '15px 20px', color: '#374151', fontWeight: '600'}}>Gestión</th>
                              <th style={{padding: '15px 20px', borderTopRightRadius: '8px', borderBottomRightRadius: '8px', color: '#374151', fontWeight: '600'}}>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredPoliticas.map(politica => (
                              <tr key={politica.id} style={{
                                backgroundColor: '#ffffff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                transition: 'all 0.2s ease',
                                verticalAlign: 'middle'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'}
                              >
                                <td style={{padding: '15px 20px', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', color: '#6b7280', fontFamily: 'monospace'}}>
                                  #{politica.id}
                                </td>
                                <td style={{padding: '15px 20px', color: '#374151'}}>
                                  <div>
                                    <span className="badge" style={{
                                      backgroundColor: '#3b82f6',
                                      color: '#ffffff',
                                      padding: '8px 12px',
                                      borderRadius: '6px',
                                      fontWeight: '600',
                                      fontSize: '13px',
                                      marginBottom: '8px',
                                      display: 'inline-block'
                                    }}>
                                      <i className="fa fa-hospital" style={{marginRight: '5px'}}></i>
                                      {politica.clinicaAutorizada ? `Clínica ${politica.clinicaAutorizada}` : 'Clínica Autorizada'}
                                    </span>
                                    <div style={{marginTop: '8px', fontSize: '13px', color: '#6b7280'}}>
                                      <strong>Especialidades:</strong> {parseEspecialidadesParaMostrar(politica.especialidadesAutorizadas)}
                                    </div>
                                  </div>
                                </td>
                                <td style={{padding: '15px 20px'}}>
                                  <span className="badge" style={{
                                    padding: '8px 12px',
                                    borderRadius: '5px',
                                    fontWeight: '600',
                                    fontSize: '12px',
                                    backgroundColor: getAlcanceBadgeColor(politica.alcance),
                                    color: '#ffffff'
                                  }}>
                                    {getAlcanceLabel(politica.alcance)}
                                  </span>
                                </td>
                                <td style={{padding: '15px 20px', color: '#374151'}}>
                                  {getDuracionLabel(politica.duracion)}
                                </td>
                                <td style={{padding: '15px 20px', color: '#374151'}}>
                                  {getGestionLabel(politica.gestion)}
                                </td>
                                <td style={{padding: '15px 20px', borderTopRightRadius: '8px', borderBottomRightRadius: '8px'}}>
                                  <button
                                    onClick={() => handleDelete(politica.id)}
                                    style={{
                                      backgroundColor: '#dc2626',
                                      color: '#ffffff',
                                      border: 'none',
                                      borderRadius: '6px',
                                      padding: '8px 16px',
                                      fontSize: '14px',
                                      fontWeight: '500',
                                      transition: 'all 0.3s ease',
                                      cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.backgroundColor = '#b91c1c';
                                      e.target.style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.backgroundColor = '#dc2626';
                                      e.target.style.transform = 'translateY(0)';
                                    }}
                                  >
                                    <i className="fa fa-trash" style={{marginRight: '5px'}}></i>
                                    Eliminar
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {filteredPoliticas.length === 0 && (
                              <tr>
                                <td colSpan="6" className="text-center" style={{padding: '40px', color: '#6b7280'}}>
                                  <i className="fa fa-shield-alt" style={{fontSize: '48px', marginBottom: '15px', opacity: '0.3'}}></i>
                                  <div style={{fontSize: '18px', fontWeight: '500'}}>No se encontraron políticas</div>
                                  <div style={{fontSize: '14px', marginTop: '5px'}}>
                                    {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay políticas configuradas'}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeSection === 'accesos' && (
          <>
            <div className="row">
              <div className="col-xl-12">
                <h5 style={{
                  color: '#1f2937',
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '30px'
                }}>
                  <i className="fa fa-file-medical" style={{marginRight: '10px', color: '#3b82f6'}}></i>
                  Accesos a Historia Clínica ({accesosHistoria.length})
                </h5>

                {loadingAccesos ? (
                  <div className="card" style={{
                    borderRadius: '15px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                    border: '1px solid var(--border-color)',
                    padding: '60px',
                    textAlign: 'center'
                  }}>
                    <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
                      <span className="sr-only">Cargando...</span>
                    </div>
                    <p className="mt-3" style={{color: '#6b7280'}}>Cargando accesos...</p>
                  </div>
                ) : (
                  <div className="card" style={{
                    borderRadius: '15px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div className="card-body" style={{padding: '30px'}}>
                      <div className="table-responsive">
                        <table className="table table-hover" style={{
                          width: '100%',
                          borderCollapse: 'separate',
                          borderSpacing: '0 10px'
                        }}>
                          <thead>
                            <tr style={{backgroundColor: '#f8fafc'}}>
                              <th style={{padding: '15px 20px', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', color: '#374151', fontWeight: '600'}}>Fecha</th>
                              <th style={{padding: '15px 20px', color: '#374151', fontWeight: '600'}}>Clínica</th>
                              <th style={{padding: '15px 20px', color: '#374151', fontWeight: '600'}}>Profesional</th>
                              <th style={{padding: '15px 20px', color: '#374151', fontWeight: '600'}}>Especialidad</th>
                              <th style={{padding: '15px 20px', color: '#374151', fontWeight: '600'}}>Tipo Documento</th>
                              <th style={{padding: '15px 20px', color: '#374151', fontWeight: '600'}}>Estado</th>
                              <th style={{padding: '15px 20px', borderTopRightRadius: '8px', borderBottomRightRadius: '8px', color: '#374151', fontWeight: '600'}}>Referencia</th>
                            </tr>
                          </thead>
                          <tbody>
                            {accesosHistoria.map(acceso => {
                              const fecha = acceso.fecha ? new Date(acceso.fecha) : null;
                              const fechaFormateada = fecha ? fecha.toLocaleString('es-UY', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : 'N/A';
                              
                              return (
                                <tr key={acceso.id} style={{
                                  backgroundColor: '#ffffff',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                  transition: 'all 0.2s ease',
                                  verticalAlign: 'middle'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'}
                                >
                                  <td style={{padding: '15px 20px', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', color: '#6b7280', fontSize: '13px'}}>
                                    {fechaFormateada}
                                  </td>
                                  <td style={{padding: '15px 20px', color: '#374151'}}>
                                    {acceso.clinicaId ? `Clínica ${acceso.clinicaId}` : '-'}
                                  </td>
                                  <td style={{padding: '15px 20px', color: '#374151'}}>
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
                                      <span style={{fontWeight: '600', color: '#111827'}}>
                                        {acceso.nombreProfesional || acceso.profesionalId || 'N/A'}
                                      </span>
                                      {acceso.profesionalId && acceso.nombreProfesional && acceso.profesionalId !== acceso.nombreProfesional && (
                                        <span style={{fontSize: '11px', color: '#9ca3af'}}>
                                          ({acceso.profesionalId})
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td style={{padding: '15px 20px', color: '#374151', fontSize: '13px'}}>
                                    {acceso.especialidad || '-'}
                                  </td>
                                  <td style={{padding: '15px 20px', color: '#374151', fontFamily: 'monospace', fontSize: '13px'}}>
                                    {acceso.tipoDocumento || '-'}
                                  </td>
                                  <td style={{padding: '15px 20px'}}>
                                    {acceso.exito ? (
                                      <span className="badge" style={{
                                        backgroundColor: '#10b981',
                                        color: '#ffffff',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        fontWeight: '600',
                                        fontSize: '13px'
                                      }}>
                                        <i className="fa fa-check-circle" style={{marginRight: '5px'}}></i>
                                        Permitido
                                      </span>
                                    ) : (
                                      <div>
                                        <span className="badge" style={{
                                          backgroundColor: '#ef4444',
                                          color: '#ffffff',
                                          padding: '8px 12px',
                                          borderRadius: '6px',
                                          fontWeight: '600',
                                          fontSize: '13px',
                                          marginBottom: '5px',
                                          display: 'inline-block'
                                        }}>
                                          <i className="fa fa-times-circle" style={{marginRight: '5px'}}></i>
                                          Denegado
                                        </span>
                                        {acceso.motivoRechazo && (
                                          <div style={{fontSize: '12px', color: '#ef4444', marginTop: '5px'}}>
                                            {acceso.motivoRechazo}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </td>
                                  <td style={{padding: '15px 20px', borderTopRightRadius: '8px', borderBottomRightRadius: '8px', color: '#6b7280', fontSize: '12px'}}>
                                    {acceso.referencia || '-'}
                                  </td>
                                </tr>
                              );
                            })}
                            {accesosHistoria.length === 0 && (
                              <tr>
                                <td colSpan="7" className="text-center" style={{padding: '40px', color: '#6b7280'}}>
                                  <i className="fa fa-file-medical" style={{fontSize: '48px', marginBottom: '15px', opacity: '0.3'}}></i>
                                  <div style={{fontSize: '18px', fontWeight: '500'}}>No se encontraron accesos</div>
                                  <div style={{fontSize: '14px', marginTop: '5px'}}>
                                    No hay registros de acceso a tu historia clínica
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeSection === 'solicitudes' && (
          <>
            <div className="row">
              <div className="col-xl-12">
                <h5 style={{
                  color: '#1f2937',
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '30px'
                }}>
                  <i className="fa fa-bell" style={{marginRight: '10px', color: '#3b82f6'}}></i>
                  Solicitudes de Acceso Pendientes ({solicitudesAcceso.length})
                </h5>

                {loadingSolicitudes ? (
                  <div className="card" style={{
                    borderRadius: '15px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                    border: '1px solid var(--border-color)',
                    padding: '60px',
                    textAlign: 'center'
                  }}>
                    <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
                      <span className="sr-only">Cargando...</span>
                    </div>
                    <p className="mt-3" style={{color: '#6b7280'}}>Cargando solicitudes...</p>
                  </div>
                ) : (
                  <div className="card" style={{
                    borderRadius: '15px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div className="card-body" style={{padding: '30px'}}>
                      {solicitudesAcceso.length === 0 ? (
                        <div className="text-center" style={{padding: '40px', color: '#6b7280'}}>
                          <i className="fa fa-check-circle" style={{fontSize: '48px', marginBottom: '15px', opacity: '0.3', color: '#10b981'}}></i>
                          <div style={{fontSize: '18px', fontWeight: '500'}}>No hay solicitudes pendientes</div>
                          <div style={{fontSize: '14px', marginTop: '5px'}}>
                            No tienes solicitudes de acceso pendientes de revisión
                          </div>
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-hover" style={{
                            width: '100%',
                            borderCollapse: 'separate',
                            borderSpacing: '0 10px'
                          }}>
                            <thead>
                              <tr style={{backgroundColor: '#f8fafc'}}>
                                <th style={{padding: '15px 20px', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', color: '#374151', fontWeight: '600'}}>ID</th>
                                <th style={{padding: '15px 20px', color: '#374151', fontWeight: '600'}}>Profesional Solicitante</th>
                                <th style={{padding: '15px 20px', color: '#374151', fontWeight: '600'}}>Especialidad</th>
                                <th style={{padding: '15px 20px', color: '#374151', fontWeight: '600'}}>Tipo Documento</th>
                                <th style={{padding: '15px 20px', color: '#374151', fontWeight: '600'}}>Razón</th>
                                <th style={{padding: '15px 20px', color: '#374151', fontWeight: '600'}}>Fecha</th>
                                <th style={{padding: '15px 20px', borderTopRightRadius: '8px', borderBottomRightRadius: '8px', color: '#374151', fontWeight: '600'}}>Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {solicitudesAcceso.map(solicitud => (
                                <tr key={solicitud.id} style={{
                                  backgroundColor: '#ffffff',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                  transition: 'all 0.2s ease',
                                  verticalAlign: 'middle'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'}
                                >
                                  <td style={{padding: '15px 20px', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', color: '#6b7280', fontFamily: 'monospace'}}>
                                    #{solicitud.id}
                                  </td>
                                  <td style={{padding: '15px 20px', color: '#374151'}}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                      <span className="badge" style={{
                                        backgroundColor: '#8b5cf6',
                                        color: '#ffffff',
                                        padding: '6px 10px',
                                        borderRadius: '6px',
                                        fontWeight: '600',
                                        fontSize: '12px'
                                      }}>
                                        <i className="fa fa-user-md" style={{marginRight: '5px'}}></i>
                                        Profesional
                                      </span>
                                      <span style={{fontFamily: 'monospace', fontSize: '14px'}}>
                                        {solicitud.solicitanteId || 'N/A'}
                                      </span>
                                    </div>
                                  </td>
                                  <td style={{padding: '15px 20px', color: '#374151'}}>
                                    {solicitud.especialidad || '-'}
                                  </td>
                                  <td style={{padding: '15px 20px', color: '#374151'}}>
                                    {solicitud.tipoDocumento ? (
                                      <span className="badge" style={{
                                        backgroundColor: '#3b82f6',
                                        color: '#ffffff',
                                        padding: '6px 10px',
                                        borderRadius: '6px',
                                        fontSize: '12px'
                                      }}>
                                        {solicitud.tipoDocumento}
                                      </span>
                                    ) : (
                                      <span className="badge" style={{
                                        backgroundColor: '#8b5cf6',
                                        color: '#ffffff',
                                        padding: '6px 10px',
                                        borderRadius: '6px',
                                        fontSize: '12px'
                                      }}>
                                        Todos los documentos
                                      </span>
                                    )}
                                  </td>
                                  <td style={{padding: '15px 20px', color: '#374151', maxWidth: '200px'}}>
                                    <div style={{
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      fontSize: '14px'
                                    }} title={solicitud.razonSolicitud || 'Sin razón especificada'}>
                                      {solicitud.razonSolicitud || 'Sin razón especificada'}
                                    </div>
                                  </td>
                                  <td style={{padding: '15px 20px', color: '#6b7280', fontSize: '13px'}}>
                                    {solicitud.fechaSolicitud ? new Date(solicitud.fechaSolicitud).toLocaleDateString('es-UY', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    }) : '-'}
                                  </td>
                                  <td style={{padding: '15px 20px', borderTopRightRadius: '8px', borderBottomRightRadius: '8px'}}>
                                    <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                                      <button
                                        onClick={() => handleAprobarSolicitud(solicitud.id)}
                                        style={{
                                          backgroundColor: '#10b981',
                                          color: '#ffffff',
                                          border: 'none',
                                          borderRadius: '6px',
                                          padding: '8px 16px',
                                          fontSize: '14px',
                                          fontWeight: '500',
                                          transition: 'all 0.3s ease',
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '5px'
                                        }}
                                        onMouseEnter={(e) => {
                                          e.target.style.backgroundColor = '#059669';
                                          e.target.style.transform = 'translateY(-1px)';
                                        }}
                                        onMouseLeave={(e) => {
                                          e.target.style.backgroundColor = '#10b981';
                                          e.target.style.transform = 'translateY(0)';
                                        }}
                                      >
                                        <i className="fa fa-check"></i>
                                        Aprobar
                                      </button>
                                      <button
                                        onClick={() => handleRechazarSolicitud(solicitud.id)}
                                        style={{
                                          backgroundColor: '#dc2626',
                                          color: '#ffffff',
                                          border: 'none',
                                          borderRadius: '6px',
                                          padding: '8px 16px',
                                          fontSize: '14px',
                                          fontWeight: '500',
                                          transition: 'all 0.3s ease',
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '5px'
                                        }}
                                        onMouseEnter={(e) => {
                                          e.target.style.backgroundColor = '#b91c1c';
                                          e.target.style.transform = 'translateY(-1px)';
                                        }}
                                        onMouseLeave={(e) => {
                                          e.target.style.backgroundColor = '#dc2626';
                                          e.target.style.transform = 'translateY(0)';
                                        }}
                                      >
                                        <i className="fa fa-times"></i>
                                        Rechazar
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
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal para crear política */}
      {showModal && (
        <div className="modal fade show" style={{
          display: 'block',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1050
        }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content" style={{
              borderRadius: '15px',
              border: 'none',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}>
              <div className="modal-header" style={{
                borderBottom: '1px solid #e5e7eb',
                padding: '20px 30px',
                backgroundColor: 'var(--background-color)',
                borderTopLeftRadius: '15px',
                borderTopRightRadius: '15px'
              }}>
                <h5 className="modal-title" style={{
                  color: 'var(--heading-color)',
                  fontWeight: '600',
                  fontSize: '20px'
                }}>
                  <i className="fa fa-shield-alt" style={{marginRight: '10px', color: 'var(--primary-color)'}}></i>
                  Nueva Política de Acceso
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  style={{fontSize: '20px'}}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body" style={{padding: '30px', maxHeight: '70vh', overflowY: 'auto'}}>
                  <div className="row">
                    <div className="col-md-12 mb-4">
                      <label htmlFor="clinicaAutorizada" className="form-label" style={{
                        color: 'var(--heading-color)',
                        fontWeight: '600',
                        marginBottom: '10px'
                      }}>
                        Clínica <span style={{color: '#dc2626'}}>*</span>
                      </label>
                      {loadingClinicas ? (
                        <div className="form-control" style={{
                          borderRadius: '8px',
                          border: '2px solid #e5e7eb',
                          padding: '12px 15px',
                          fontSize: '16px',
                          color: '#6b7280',
                          width: '100%',
                          boxSizing: 'border-box',
                          minHeight: '48px'
                        }}>
                          Cargando clínicas...
                        </div>
                      ) : (
                        <select
                          id="clinicaAutorizada"
                          className="form-control"
                          value={formData.clinicaAutorizada}
                          onChange={(e) => setFormData({...formData, clinicaAutorizada: e.target.value})}
                          required
                          style={{
                            borderRadius: '8px',
                            border: '2px solid #e5e7eb',
                            padding: '12px 15px',
                            fontSize: '16px',
                            width: '100%',
                            boxSizing: 'border-box',
                            minHeight: '48px'
                          }}
                        >
                          <option value="">Seleccione una clínica</option>
                          {clinicas.map(clinica => (
                            <option key={clinica.id} value={clinica.id}>
                              {clinica.nombre} {clinica.rut ? `(${clinica.rut})` : ''}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {formData.clinicaAutorizada && (
                      <div className="col-md-12 mb-4">
                        <label className="form-label" style={{
                          color: 'var(--heading-color)',
                          fontWeight: '600',
                          marginBottom: '15px',
                          display: 'block'
                        }}>
                          Especialidades Autorizadas
                        </label>
                        
                        <div className="mb-3" style={{
                          padding: '15px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb'
                        }}>
                          <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}>
                            <input
                              type="checkbox"
                              checked={todosLosProfesionales}
                              onChange={(e) => {
                                setTodosLosProfesionales(e.target.checked);
                                if (e.target.checked) {
                                  setEspecialidadesSeleccionadas([]);
                                }
                              }}
                              style={{
                                marginRight: '10px',
                                width: '18px',
                                height: '18px',
                                cursor: 'pointer'
                              }}
                            />
                            <span>Todas las especialidades</span>
                          </label>
                        </div>

                        {!todosLosProfesionales && (
                          <div style={{
                            maxHeight: '300px',
                            overflowY: 'auto',
                            padding: '15px',
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            marginTop: '10px'
                          }}>
                            <p style={{
                              marginBottom: '15px',
                              fontSize: '14px',
                              color: '#6b7280',
                              fontWeight: '500'
                            }}>
                              Seleccione las especialidades autorizadas:
                            </p>
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                              gap: '10px'
                            }}>
                              {especialidadesDisponibles.map(esp => (
                                <label
                                  key={esp.value}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    borderRadius: '6px',
                                    backgroundColor: especialidadesSeleccionadas.includes(esp.value) ? '#dbeafe' : 'transparent',
                                    transition: 'background-color 0.2s'
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={especialidadesSeleccionadas.includes(esp.value)}
                                    onChange={() => handleEspecialidadToggle(esp.value)}
                                    style={{
                                      marginRight: '8px',
                                      width: '16px',
                                      height: '16px',
                                      cursor: 'pointer'
                                    }}
                                  />
                                  <span style={{fontSize: '14px'}}>{esp.label}</span>
                                </label>
                              ))}
                            </div>
                            {especialidadesSeleccionadas.length > 0 && (
                              <p style={{
                                marginTop: '15px',
                                fontSize: '13px',
                                color: '#059669',
                                fontWeight: '500'
                              }}>
                                {especialidadesSeleccionadas.length} especialidad(es) seleccionada(s)
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="col-md-6 mb-4">
                      <label htmlFor="alcance" className="form-label" style={{
                        color: 'var(--heading-color)',
                        fontWeight: '600',
                        marginBottom: '10px'
                      }}>
                        Alcance <span style={{color: '#dc2626'}}>*</span>
                      </label>
                      <select
                        id="alcance"
                        className="form-control"
                        value={formData.alcance}
                        onChange={(e) => setFormData({...formData, alcance: e.target.value})}
                        required
                        style={{
                          borderRadius: '8px',
                          border: '2px solid #e5e7eb',
                          padding: '12px 15px',
                          fontSize: '16px',
                          width: '100%',
                          boxSizing: 'border-box',
                          minHeight: '48px'
                        }}
                      >
                        <option value="TODOS_LOS_DOCUMENTOS">Todos los Documentos</option>
                        <option value="DOCUMENTOS_POR_TIPO">Por Tipo de Documento</option>
                        <option value="UN_DOCUMENTO_ESPECIFICO">Un Documento Específico</option>
                      </select>
                    </div>

                    <div className="col-md-6 mb-4">
                      <label htmlFor="duracion" className="form-label" style={{
                        color: 'var(--heading-color)',
                        fontWeight: '600',
                        marginBottom: '10px'
                      }}>
                        Duración <span style={{color: '#dc2626'}}>*</span>
                      </label>
                      <select
                        id="duracion"
                        className="form-control"
                        value={formData.duracion}
                        onChange={(e) => setFormData({...formData, duracion: e.target.value})}
                        required
                        style={{
                          borderRadius: '8px',
                          border: '2px solid #e5e7eb',
                          padding: '12px 15px',
                          fontSize: '16px',
                          width: '100%',
                          boxSizing: 'border-box',
                          minHeight: '48px'
                        }}
                      >
                        <option value="INDEFINIDA">Indefinida</option>
                        <option value="TEMPORAL">Temporal</option>
                      </select>
                    </div>

                    <div className="col-md-6 mb-4">
                      <label htmlFor="gestion" className="form-label" style={{
                        color: 'var(--heading-color)',
                        fontWeight: '600',
                        marginBottom: '10px'
                      }}>
                        Gestión <span style={{color: '#dc2626'}}>*</span>
                      </label>
                      <select
                        id="gestion"
                        className="form-control"
                        value={formData.gestion}
                        onChange={(e) => setFormData({...formData, gestion: e.target.value})}
                        required
                        style={{
                          borderRadius: '8px',
                          border: '2px solid #e5e7eb',
                          padding: '12px 15px',
                          fontSize: '16px',
                          width: '100%',
                          boxSizing: 'border-box',
                          minHeight: '48px'
                        }}
                      >
                        <option value="AUTOMATICA">Automática</option>
                        <option value="MANUAL">Manual</option>
                      </select>
                    </div>

                    {formData.duracion === 'TEMPORAL' && (
                      <div className="col-md-6 mb-4">
                        <label htmlFor="fechaVencimiento" className="form-label" style={{
                          color: 'var(--heading-color)',
                          fontWeight: '600',
                          marginBottom: '10px'
                        }}>
                          Fecha de Vencimiento
                        </label>
                        <input
                          type="date"
                          id="fechaVencimiento"
                          className="form-control"
                          value={formData.fechaVencimiento}
                          onChange={(e) => setFormData({...formData, fechaVencimiento: e.target.value})}
                          style={{
                            borderRadius: '8px',
                            border: '2px solid #e5e7eb',
                            padding: '12px 15px',
                            fontSize: '16px',
                            width: '100%',
                            boxSizing: 'border-box',
                            minHeight: '48px'
                          }}
                        />
                      </div>
                    )}

                    {(formData.alcance === 'DOCUMENTOS_POR_TIPO' || formData.alcance === 'UN_DOCUMENTO_ESPECIFICO') && (
                      <div className="col-md-6 mb-4">
                        <label htmlFor="tipoDocumento" className="form-label" style={{
                          color: 'var(--heading-color)',
                          fontWeight: '600',
                          marginBottom: '10px'
                        }}>
                          Tipo de Documento
                        </label>
                        <input
                          type="text"
                          id="tipoDocumento"
                          className="form-control"
                          value={formData.tipoDocumento}
                          onChange={(e) => setFormData({...formData, tipoDocumento: e.target.value})}
                        style={{
                          borderRadius: '8px',
                          border: '2px solid #e5e7eb',
                          padding: '12px 15px',
                          fontSize: '16px',
                          width: '100%',
                          boxSizing: 'border-box',
                          minHeight: '48px'
                        }}
                        placeholder="Ej: INFORME_MEDICO"
                        />
                      </div>
                    )}

                    <div className="col-md-12 mb-4">
                      <label htmlFor="referencia" className="form-label" style={{
                        color: 'var(--heading-color)',
                        fontWeight: '600',
                        marginBottom: '10px'
                      }}>
                        Referencia
                      </label>
                      <textarea
                        id="referencia"
                        className="form-control"
                        value={formData.referencia}
                        onChange={(e) => setFormData({...formData, referencia: e.target.value})}
                        rows="3"
                        style={{
                          borderRadius: '8px',
                          border: '2px solid #e5e7eb',
                          padding: '12px 15px',
                          fontSize: '16px',
                          width: '100%',
                          boxSizing: 'border-box',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                          minHeight: '100px'
                        }}
                        placeholder="Descripción o motivo de la política"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer" style={{
                  borderTop: '1px solid #e5e7eb',
                  padding: '20px 30px',
                  backgroundColor: 'var(--background-color)',
                  borderBottomLeftRadius: '15px',
                  borderBottomRightRadius: '15px'
                }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontWeight: '500'
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                    fontWeight: '600',
                    backgroundColor: '#1f2937',
                    border: 'none',
                    color: '#ffffff',
                    boxShadow: '0 10px 20px rgba(31,41,55,0.25)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                    }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
                  >
                    <i className="fa fa-save" style={{marginRight: '5px'}}></i>
                    Crear Política
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MiPerfil;

