import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';

function Redirecting() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Página de redirección - Iniciando logout (5 segundos)...');
    
    // Iframe 1: Inmediato
    const iframe1 = document.createElement('iframe');
    iframe1.style.display = 'none';
    iframe1.style.width = '0';
    iframe1.style.height = '0';
    iframe1.style.border = 'none';
    iframe1.src = `${config.BACKEND_URL}/api/auth/logout_hcen`;
    document.body.appendChild(iframe1);
    console.log('Iframe 1 de logout creado (t=0s)');
    
    // Iframe 2 (retry): Después de 2.5 segundos
    const retryTimer = setTimeout(() => {
      const iframe2 = document.createElement('iframe');
      iframe2.style.display = 'none';
      iframe2.style.width = '0';
      iframe2.style.height = '0';
      iframe2.style.border = 'none';
      iframe2.src = `${config.BACKEND_URL}/api/auth/logout_hcen`;
      document.body.appendChild(iframe2);
      console.log('Iframe 2 de logout creado (retry a t=2.5s)');
      
      // Limpiar el segundo iframe después de 2.5 segundos más
      setTimeout(() => {
        if (iframe2 && iframe2.parentNode) {
          iframe2.remove();
        }
      }, 2500);
    }, 2500);
    
    // Después de 5 segundos, limpiar iframe inicial y redirigir
    const redirectTimer = setTimeout(() => {
      if (iframe1 && iframe1.parentNode) {
        iframe1.remove();
      }
      console.log('Iframes eliminados después de 5 segundos');
      // Limpiar flag global
      window.logoutEnProceso = false;
      console.log('Redirigiendo al inicio con parámetro final...');
      navigate('/?final_logout=true');
    }, 5000);
    
    // Cleanup al desmontar
    return () => {
      clearTimeout(redirectTimer);
      clearTimeout(retryTimer);
      if (iframe1 && iframe1.parentNode) {
        iframe1.remove();
      }
    };
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '60px 40px',
        textAlign: 'center'
      }}>
        {/* Spinner animado */}
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 30px',
          border: '6px solid #e5e7eb',
          borderTop: '6px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '12px'
        }}>
          Cerrando sesión...
        </h1>
        
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          lineHeight: '1.6'
        }}>
          Serás redirigido al inicio en unos momentos...
        </p>
      </div>
    </div>
  );
}

export default Redirecting;

