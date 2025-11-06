# Configuración de Variables de Entorno - HCEN Frontend

## Variable de Entorno

| Variable | Descripción | Default (Producción) | Desarrollo Local |
|----------|-------------|----------------------|------------------|
| `REACT_APP_BACKEND_URL` | URL del backend HCEN | `https://env-6105410.web.elasticloud.uy/hcen` | `http://localhost:8080` |

---

## 🖥️ Ambiente Local (Desarrollo)

**IMPORTANTE:** Por defecto, la app usa Elastic Cloud. Para desarrollo local:

**Crear archivo `.env.local`** (ya creado en el proyecto):

```bash
REACT_APP_BACKEND_URL=http://localhost:8080
```

**Reiniciar el servidor:**
```bash
npm start
```

---

## 🚀 Ambiente de Producción (Elastic Cloud)

**No se requiere configuración.** La app usa Elastic Cloud por defecto.

**Compilar para producción:**
```bash
npm run build
```

El build usará automáticamente:
```
https://env-6105410.web.elasticloud.uy/hcen
```

---

## 📋 Nota Importante

**Las variables de entorno en React se "queman" en tiempo de compilación**, no en runtime.

- `.env.local` → Solo para `npm start` (desarrollo)
- Para producción → No incluir `.env.local`, usar el default

---

## ✅ Verificación

Abrir consola del navegador (F12) y buscar:
```
🔧 Configuración Frontend HCEN:
   BACKEND_URL: http://localhost:8080  (o la URL configurada)
```

