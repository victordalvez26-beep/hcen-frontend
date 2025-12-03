import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';

function MenorDeEdad() {
  const navigate = useNavigate();
  const [segundosRestantes, setSegundosRestantes] = useState(15);

  useEffect(() => {
    // Hacer logout silencioso de GubUy en iframe invisible
    // Crear 3 iframes con 4 segundos de diferencia para asegurar que al menos uno funcione
    console.log('Iniciando logout silencioso para menor de edad (3 intentos)...');
    
    const iframes = [];
    
    // Iframe 1: Inmediato
    const iframe1 = document.createElement('iframe');
    iframe1.style.display = 'none';
    iframe1.style.width = '0';
    iframe1.style.height = '0';
    iframe1.style.border = 'none';
    iframe1.src = `${config.BACKEND_URL}/api/auth/logout_hcen`;
    document.body.appendChild(iframe1);
    iframes.push(iframe1);
    console.log('Iframe 1 de logout creado');
    
    // Iframe 2: Después de 4 segundos
    const timer1 = setTimeout(() => {
      const iframe2 = document.createElement('iframe');
      iframe2.style.display = 'none';
      iframe2.style.width = '0';
      iframe2.style.height = '0';
      iframe2.style.border = 'none';
      iframe2.src = `${config.BACKEND_URL}/api/auth/logout_hcen`;
      document.body.appendChild(iframe2);
      iframes.push(iframe2);
      console.log('Iframe 2 de logout creado');
    }, 4000);
    
    // Iframe 3: Después de 8 segundos
    const timer2 = setTimeout(() => {
      const iframe3 = document.createElement('iframe');
      iframe3.style.display = 'none';
      iframe3.style.width = '0';
      iframe3.style.height = '0';
      iframe3.style.border = 'none';
      iframe3.src = `${config.BACKEND_URL}/api/auth/logout_hcen`;
      document.body.appendChild(iframe3);
      iframes.push(iframe3);
      console.log('Iframe 3 de logout creado');
    }, 8000);
    
    // Contador regresivo
    const contadorInterval = setInterval(() => {
      setSegundosRestantes(prev => {
        if (prev <= 1) {
          clearInterval(contadorInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Después de 15 segundos, limpiar todos los iframes y redirigir
    const redirectTimer = setTimeout(() => {
      iframes.forEach(iframe => {
        if (iframe && iframe.parentNode) {
          iframe.remove();
        }
      });
      console.log('Todos los iframes eliminados');
      // Limpiar flag global
      window.logoutEnProceso = false;
      console.log('Redirigiendo al inicio...');
      navigate('/');
    }, 15000);
    
    // Cleanup al desmontar
    return () => {
      clearTimeout(redirectTimer);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearInterval(contadorInterval);
      iframes.forEach(iframe => {
        if (iframe && iframe.parentNode) {
          iframe.remove();
        }
      });
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
        maxWidth: '600px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '64px',
          marginBottom: '20px'
        }}>
          🚫
        </div>
        
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '16px'
        }}>
          Acceso Restringido
        </h1>
        
        <p style={{
          fontSize: '18px',
          color: '#6b7280',
          marginBottom: '24px',
          lineHeight: '1.6'
        }}>
          Lo sentimos, debes ser mayor de 18 años para acceder al sistema de Historia Clínica Electrónica Nacional.
        </p>
        
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #fbbf24',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#92400e',
            margin: 0,
            marginBottom: '8px'
          }}>
            Tu sesión ha sido cerrada automáticamente.
          </p>
          <p style={{
            fontSize: '16px',
            color: '#92400e',
            margin: 0,
            fontWeight: '600'
          }}>
            Serás redirigido al inicio en {segundosRestantes} segundo{segundosRestantes !== 1 ? 's' : ''}...
          </p>
        </div>
      </div>
    </div>
  );
}

export default MenorDeEdad;

