import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './components/Home';
import HistoriaClinica from './components/HistoriaClinica';
import DetalleDocumento from './components/DetalleDocumento';
import CompleteProfile from './components/CompleteProfile';
import Header from './components/Header';
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

  return (
    <div className="App">
      {location.pathname !== '/complete-profile' && <Header user={user} activePage={getActivePage()} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/complete-profile" element={
          user && !user.profileCompleted ? <CompleteProfile /> : <Navigate to="/" replace />
        } />
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
      </Routes>
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
