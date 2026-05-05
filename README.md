# Control de Desempeno y KPIs

Aplicacion fullstack para control de desempeno, tareas y KPIs con multi-tenancy por encargado.

## Stack

- Frontend: React + Vite + React Router + Axios + Chart.js
- UI: Bootstrap por CDN
- Backend: Node.js + Express + Mongoose + JWT

## Estructura

- `backend/src/models`: esquemas de `User`, `Employee`, `Kpi`, `MonthlyReport`, `TaskGroup`, `MonthClosure`, `MonthlyNote`
- `backend/src/controllers`: autenticacion, empleados, KPIs, reportes, cierres de mes y observaciones
- `backend/src/middlewares`: JWT y autorizacion por rol
- `backend/src/utils/accessScope.js`: logica de filtrado multi-tenant por encargado
- `frontend/src/pages`: dashboard, empleados, desempeno y detalle individual
- `frontend/src/components`: formularios, tablas, graficos, layout y filtros globales

## Regla de privacidad clave

La restriccion principal esta centralizada en `backend/src/utils/accessScope.js`:

- `admin`: acceso global
- `manager`: solo empleados con `supervisor === req.user._id` y mismo `department`

Esa regla se reutiliza al:

- listar empleados
- consultar detalle de empleado
- crear y editar KPIs
- generar reportes mensuales
- construir el ranking de top performers

## Desarrollo local

### Backend

1. Copiar `backend/.env.example` a `backend/.env`
2. Instalar dependencias con `npm install`
3. Ejecutar `npm run dev` dentro de `backend`

### Frontend

1. Copiar `frontend/.env.example` a `frontend/.env`
2. Instalar dependencias con `npm install`
3. Ejecutar `npm run dev` dentro de `frontend`

## Deploy gratuito recomendado

La opcion mas simple para esta base es desplegar todo junto en `Render`:

1. Subir el repo a GitHub
2. Crear una base MongoDB Atlas gratuita
3. En Render, crear un nuevo servicio usando este repositorio
4. Render detectara `render.yaml`
5. Configurar estas variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL`

### Como queda el deploy

- Render ejecuta `npm run install:all && npm run build`
- El frontend se compila en `frontend/dist`
- Express sirve ese build en produccion
- La API queda en la misma URL base usando rutas `/api`

## Scripts raiz

- `npm run install:all`: instala backend y frontend
- `npm run build`: compila el frontend
- `npm run start`: arranca el backend en modo produccion
- `npm run dev:backend`: desarrollo backend
- `npm run dev:frontend`: desarrollo frontend
