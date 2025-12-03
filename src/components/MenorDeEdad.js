import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';

function MenorDeEdad() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Usuario menor de edad - Esperando 500ms para que la cookie se setee...');
    
    let iframe = null;
    
    // Esperar 500ms para que la cookie JWT se setee correctamente en el navegador
    // Esto evita race condition donde el iframe llega antes de que la cookie esté disponible
    const cookieDelay = setTimeout(() => {
      console.log('Cookie JWT debe estar lista - Creando iframe de logout...');
      
      // Ahora sí crear el iframe de logout
      iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      iframe.src = `${config.BACKEND_URL}/api/auth/logout_hcen`;
      document.body.appendChild(iframe);
      console.log('Iframe de logout creado en página de menor de edad');
    }, 500);
    
    // Después de 2 segundos desde el inicio, redirigir a la página de "Redireccionando"
    const redirectTimer = setTimeout(() => {
      if (iframe && iframe.parentNode) {
        iframe.remove();
      }
      console.log('Redirigiendo a página de carga...');
      navigate('/redirecting');
    }, 2000);
    
    return () => {
      clearTimeout(cookieDelay);
      clearTimeout(redirectTimer);
      if (iframe && iframe.parentNode) {
        iframe.remove();
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
            fontSize: '16px',
            color: '#92400e',
            margin: 0,
            fontWeight: '600'
          }}>
            Tu sesión será cerrada automáticamente...
          </p>
        </div>
      </div>
    </div>
  );
}

export default MenorDeEdad;

