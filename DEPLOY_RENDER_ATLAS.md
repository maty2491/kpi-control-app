# Guia de Despliegue en Render + MongoDB Atlas

Esta guia explica paso a paso como subir esta aplicacion a un host gratuito usando:

- GitHub
- MongoDB Atlas
- Render

## 1. Subir el proyecto a GitHub

Desde la raiz del proyecto:

```powershell
git init
git branch -M main
git add .
git commit -m "Initial fullstack KPI control app"
git remote add origin https://github.com/TU_USUARIO/kpi-control-app.git
git push -u origin main
```

Verifica que en GitHub esten:

- `backend/`
- `frontend/`
- `package.json`
- `render.yaml`
- `README.md`
- `DEPLOY_RENDER_ATLAS.md`

## 2. Crear MongoDB Atlas gratis

1. Entra a `https://www.mongodb.com/cloud/atlas/register`
2. Crea tu cuenta e inicia sesion
3. Crea un `Project`
4. Ve a `Project Overview`
5. Clic en `Create`
6. Elige un cluster gratuito `M0`
7. Espera a que termine de crear

## 3. Crear usuario de base de datos

En Atlas:

1. Crea un `Database User`
2. Guarda:
   - `username`
   - `password`

Los usaras en la cadena `MONGODB_URI`

## 4. Autorizar acceso de red

En Atlas:

1. Ve a `Network Access`
2. Agrega:

```text
0.0.0.0/0
```

Esto permite acceso desde Render.

## 5. Copiar la cadena de conexion

En Atlas:

1. Ve a `Database`
2. Clic en `Connect`
3. Elige `Drivers`
4. Copia la cadena base

Ejemplo recomendado para este proyecto:

```text
mongodb+srv://USUARIO:CLAVE@cluster0.xxxxx.mongodb.net/kpi_control?retryWrites=true&w=majority&appName=Cluster0
```

Importante:

- si tu password tiene caracteres especiales, debes codificarlos en URL
- ejemplo: `@` se convierte en `%40`

## 6. Probar localmente antes del deploy

Completa `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://USUARIO:CLAVE@cluster0.xxxxx.mongodb.net/kpi_control?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=una-clave-larga-y-segura
FRONTEND_URL=http://localhost:3000
```

Y si quieres, para frontend local:

`frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

Luego prueba:

```powershell
npm run install:all
npm run build
npm run start
```

Si el backend conecta a Mongo y la app levanta, puedes pasar al deploy.

## 7. Crear servicio en Render

1. Entra a `https://dashboard.render.com/`
2. Clic en `New`
3. Elige `Web Service`
4. Conecta GitHub
5. Selecciona tu repositorio

Este proyecto ya tiene `render.yaml`, por lo que Render deberia detectar la configuracion.

## 8. Confirmar configuracion de Render

La configuracion esperada es:

- `runtime`: `node`
- `buildCommand`: `npm run install:all && npm run build`
- `startCommand`: `npm run start`

## 9. Configurar variables de entorno en Render

En el panel del servicio agrega:

### `MONGODB_URI`

```text
mongodb+srv://USUARIO:CLAVE@cluster0.xxxxx.mongodb.net/kpi_control?retryWrites=true&w=majority&appName=Cluster0
```

### `JWT_SECRET`

```text
una-clave-larga-y-segura
```

### `FRONTEND_URL`

Al quedar frontend y backend en la misma app, usa la URL publica del servicio Render:

```text
https://kpi-control-app.onrender.com
```

Si todavia no conoces la URL final, puedes actualizarla despues del primer deploy.

## 10. Lanzar el deploy

1. Guarda las variables
2. Haz `Manual Deploy` si Render no despliega solo
3. Espera a que termine el build

## 11. Verificar que la app abra

Abre la URL publica, por ejemplo:

```text
https://kpi-control-app.onrender.com
```

Comprueba:

- login
- registro de usuario
- alta de empleados
- dashboard
- desempeno
- detalle individual

## 12. Crear usuario admin inicial

Si no tienes seed automatico, crea un admin apenas levante la app:

- desde el frontend, si el registro lo permite
- o usando `POST /api/auth/register`

## 13. Problemas comunes

### Error de conexion a MongoDB

Revisa:

- `MONGODB_URI`
- usuario y password
- `0.0.0.0/0` en Atlas

### Error de CORS

Revisa:

- `FRONTEND_URL`
- que coincida exactamente con la URL publica de Render

### El frontend carga pero la API no responde

Revisa:

- que Render haya ejecutado correctamente `npm run build`
- que Express este sirviendo `frontend/dist`

### Password con caracteres especiales

Debes codificarla.

Ejemplo:

```text
mi@clave#2025
```

Se convierte en:

```text
mi%40clave%232025
```

## 14. Orden recomendado

Haz esto exactamente en este orden:

1. Subir repo a GitHub
2. Crear MongoDB Atlas
3. Crear usuario e IP access list
4. Probar localmente con `backend/.env`
5. Crear servicio en Render
6. Configurar variables
7. Deploy
8. Crear admin
9. Probar toda la app online
