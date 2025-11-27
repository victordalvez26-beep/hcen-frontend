import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './components/Home';
import HistoriaClinica from './components/HistoriaClinica';
import DetalleDocumento from './components/DetalleDocumento';
import CompleteProfile from './components/CompleteProfile';
import GestionClinicas from './components/GestionClinicas';
import GestionUsuarios from './components/GestionUsuarios';
import GestionPrestadores from './components/GestionPrestadores';
import GestionPoliticas from './components/GestionPoliticas';
import MiPerfil from './components/MiPerfil';
import ReportesAdmin from './components/ReportesAdmin';
import RegistroPrestador from './components/RegistroPrestador';
import Contacto from './components/Contacto';
import Header from './components/Header';
import config from './config';
import './App.css';
import './styles/colors.css';
import './styles/components.css';

function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    checkSession();
  }, []);
  
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

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--background-color)'
      }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Cargando...</span>
          </div>
          <p className="mt-3">Cargando HCEN...</p>
        </div>
      </div>
    );
  }

  const getActivePage = () => {
    if (location.pathname === '/') return 'home';
    if (location.pathname === '/historia-clinica') return 'historia';
    if (location.pathname.startsWith('/documento/')) return 'historia';
    if (location.pathname === '/gestion-clinicas') return 'gestion-clinicas';
    if (location.pathname === '/gestion-usuarios') return 'gestion-usuarios';
    if (location.pathname === '/gestion-politicas') return 'gestion-politicas';
    if (location.pathname === '/reportes') return 'reportes';
    if (location.pathname === '/mi-perfil') return 'mi-perfil';
    if (location.pathname === '/contact') return 'contact';
    return '';
  };

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }
    if (user && !user.profileCompleted && location.pathname !== '/complete-profile') {
      return <Navigate to="/complete-profile" replace />;
    }
    return children;
  };

  const AdminRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }
    if (user && !user.profileCompleted) {
      return <Navigate to="/complete-profile" replace />;
    }
    if (user && user.rol !== 'AD') {
      return (
        <div className="slider_area" style={{minHeight: '100vh', display: 'flex', alignItems: 'center'}}>
          <div className="container">
            <div className="row">
              <div className="col-xl-12">
                <div className="slider_text text-center">
                  <h3 style={{color: 'var(--primary-color)', marginBottom: '20px'}}>Acceso Restringido</h3>
                  <p style={{color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '30px'}}>
                    Esta sección es solo para administradores
                  </p>
                  <a href="/" className="boxed-btn3" style={{
                    padding: '12px 24px',
                    fontSize: '14px',
                    textDecoration: 'none',
                    backgroundColor: 'var(--primary-color)',
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
    return children;
  };

  return (
    <div className="App">
      {location.pathname !== '/complete-profile' && <Header user={user} activePage={getActivePage()} />}
      <div style={{ paddingTop: location.pathname !== '/complete-profile' ? '70px' : '0' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/complete-profile" element={
            user && !user.profileCompleted ? <CompleteProfile /> : <Navigate to="/" replace />
          } />
          <Route path="/registro-prestador" element={<RegistroPrestador />} />
          <Route path="/historia-clinica" element={
            <ProtectedRoute>
              <HistoriaClinica />
            </ProtectedRoute>
          } />
          <Route path="/documento/:id" element={
            <ProtectedRoute>
              <DetalleDocumento />
            </ProtectedRoute>
          } />
        <Route path="/gestion-clinicas" element={
          <AdminRoute>
            <GestionClinicas />
          </AdminRoute>
        } />
        <Route path="/gestion-usuarios" element={
          <AdminRoute>
            <GestionUsuarios />
          </AdminRoute>
        } />
        <Route path="/gestion-prestadores" element={
          <AdminRoute>
            <GestionPrestadores />
          </AdminRoute>
        } />
        <Route path="/gestion-politicas" element={
          <AdminRoute>
            <GestionPoliticas />
          </AdminRoute>
        } />
        <Route path="/reportes" element={
          <AdminRoute>
            <ReportesAdmin />
          </AdminRoute>
        } />
          <Route path="/mi-perfil" element={
            <ProtectedRoute>
              <MiPerfil />
            </ProtectedRoute>
          } />
          <Route path="/contact" element={<Contacto />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
