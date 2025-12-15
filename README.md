# Task Manager - Aplicación Fullstack

## Descripción
Aplicación fullstack de gestión de tareas con autenticación JWT. Cumple con todos los requisitos de la prueba técnica: backend con API REST, frontend funcional, base de datos SQLite, autenticación JWT, y manejo de errores.

## Tecnologías Utilizadas

### Backend
- Node.js v18+
- Express.js
- Prisma ORM
- SQLite
- JWT (jsonwebtoken)
- bcryptjs
- CORS

### Frontend
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Axios
- react-hook-form
- react-toastify
- lucide-react
- clsx

## Requisitos Previos
- Node.js versión 18 o superior
- npm (incluido con Node.js)
- Git
- Navegador web moderno

## Instalación y Configuración Paso a Paso

### 1. Clonar el repositorio
```bash
git clone https://github.com/EdwardFlowersGg/task-manager-fullstack.git
cd task-manager-fullstack
```

### 2. Instalar y Configurar el Backend
```bash
# Navegar a la carpeta backend
cd backend

# Instalar todas las dependencias necesarias
npm install

# Crear archivo de variables de entorno
# En Windows con PowerShell:
echo "JWT_SECRET=supersecretkey123" > .env
# En Linux/Mac:
# echo 'JWT_SECRET=supersecretkey123' > .env

# Inicializar la base de datos SQLite con Prisma
npx prisma generate
npx prisma migrate dev --name init

# (Opcional) Abrir interfaz visual para verificar datos
npx prisma studio
```

### 3. Instalar y Configurar el Frontend
```bash
# Volver a la carpeta principal y entrar a frontend
cd ../frontend

# Instalar dependencias principales
npm install

# Instalar dependencias adicionales para UI y notificaciones
npm install lucide-react react-toastify clsx

# Crear archivo de configuración para la URL del backend
# En Windows con PowerShell:
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
# En Linux/Mac:
# echo 'NEXT_PUBLIC_API_URL=http://localhost:5000/api' > .env.local
```

## Ejecución del Proyecto

### Método Recomendado: Dos Terminales Separadas

**Terminal 1 - Iniciar Backend:**
```bash
cd backend
npm run dev
```
Servidor disponible en: http://localhost:5000

**Terminal 2 - Iniciar Frontend:**
```bash
cd frontend
npm run dev
```
Aplicación disponible en: http://localhost:3000

### Método Alternativo: Script para Windows
Crea un archivo `iniciar-proyecto.bat` en la carpeta principal con:
```batch
@echo off
start cmd /k "cd backend && npm run dev"
timeout /t 3
start cmd /k "cd frontend && npm run dev"
echo Proyecto iniciado.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
pause
```
Ejecútalo haciendo doble clic.

## Manual de Uso Completo

### 1. Registro de Usuario
1.  Abre tu navegador y ve a: http://localhost:3000/register
2.  Completa el formulario de registro:
    -   **Nombre:** Mínimo 2 caracteres (ej: "Juan Pérez")
    -   **Email:** Debe ser un formato válido (ej: usuario@ejemplo.com)
    -   **Contraseña:** Entre 6 y 20 caracteres. Debe incluir al menos una letra mayúscula, una minúscula y un número (ej: "Clave123").
    -   **Confirmar Contraseña:** Debe coincidir exactamente.
3.  Haz clic en "Crear Cuenta". Si todo es correcto, serás redirigido automáticamente al dashboard.

### 2. Inicio de Sesión
1.  Si ya tienes una cuenta, ve a: http://localhost:3000/login
2.  Ingresa tu email y contraseña registrados.
3.  Haz clic en "Iniciar Sesión". Serás redirigido al dashboard principal.

### 3. Gestión de Tareas (Dashboard)

**Crear una Nueva Tarea:**
1.  En la sección "Nueva Tarea" del dashboard, completa los campos:
    -   **Título:** (Obligatorio) Un nombre breve para la tarea.
    -   **Descripción:** (Opcional) Detalles adicionales.
    -   **Estado:** Selecciona "Pendiente", "En Progreso" o "Completada".
2.  Haz clic en el botón "Crear". La tarea aparecerá inmediatamente en la lista.

**Editar una Tarea Existente:**
1.  En la lista de tareas, haz clic en el botón "Editar" de la tarea que deseas modificar.
2.  Se abrirá el formulario con los datos actuales. Modifica los campos que necesites.
3.  Haz clic en "Actualizar" para guardar los cambios.

**Cambiar el Estado de una Tarea:**
-   Usa el menú desplegable (dropdown) en la tarjeta de cada tarea para cambiar entre "Pendiente", "En Progreso" y "Completada". El cambio se guarda automáticamente.

**Eliminar una Tarea:**
1.  Haz clic en el botón "Eliminar" de la tarea que quieras borrar.
2.  Confirma la acción en el cuadro de diálogo que aparecerá en el navegador.

### 4. Cerrar Sesión
-   Haz clic en el botón "Cerrar Sesión" ubicado en la esquina superior derecha del dashboard. Serás redirigido a la página de inicio de sesión.

## Estructura del Proyecto
```
task-manager-fullstack/
├── backend/                    # Servidor API
│   ├── prisma/               # Configuración de base de datos
│   │   ├── schema.prisma     # Modelos de datos
│   │   └── migrations/       # Migraciones de base de datos
│   ├── src/                  # Código fuente del backend
│   │   ├── routes/          # Rutas de la API
│   │   ├── middleware/      # Middlewares (JWT, etc.)
│   │   └── index.js         # Punto de entrada del servidor
│   ├── .env                 # Variables de entorno (NO subir a Git)
│   └── package.json         # Dependencias del backend
└── frontend/                 # Aplicación web
    ├── app/                 # Next.js App Router
    │   ├── login/          # Página de login
    │   ├── register/       # Página de registro
    │   ├── layout.js       # Layout principal
    │   └── page.js         # Página principal (dashboard)
    ├── components/          # Componentes React reutilizables
    ├── lib/                # Utilidades y configuración
    ├── public/             # Archivos estáticos
    ├── .env.local          # Variables de entorno (NO subir a Git)
    └── package.json        # Dependencias del frontend
```

## API Reference

### Autenticación
-   `POST /api/auth/register` - Registrar nuevo usuario. Body: `{name, email, password}`
-   `POST /api/auth/login` - Iniciar sesión. Body: `{email, password}`
-   `GET /api/auth/validate` - Validar token JWT. Header: `Authorization: Bearer <token>`

### Tareas (Requieren Autenticación)
-   `GET /api/tasks` - Obtener todas las tareas del usuario.
-   `POST /api/tasks` - Crear nueva tarea. Body: `{title, description, status}`
-   `PUT /api/tasks/:id` - Actualizar tarea existente.
-   `DELETE /api/tasks/:id` - Eliminar tarea.

## Comandos Útiles para Desarrollo

### Backend
```bash
# Iniciar servidor en modo desarrollo (con recarga automática)
npm run dev

# Generar cliente Prisma después de modificar schema.prisma
npx prisma generate

# Crear una nueva migración si cambiaste los modelos de datos
npx prisma migrate dev --name "agregar_campo_x"

# Abrir Prisma Studio (interfaz gráfica para la base de datos)
npx prisma studio
```

### Frontend
```bash
# Iniciar servidor de desarrollo de Next.js
npm run dev

# Construir la aplicación para producción
npm run build

# Ejecutar la aplicación construida (modo producción)
npm start

# Ejecutar el linter para verificar calidad de código
npm run lint
```


-   **Solución:** Asegúrate de que las carpetas `node_modules` y `.next` estén listadas en el archivo `.gitignore`. Nunca debes subir estas carpetas a Git.
```
