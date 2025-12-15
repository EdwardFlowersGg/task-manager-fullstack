const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

dotenv.config();

const app = express();

// Configuración CORS detallada
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging de peticiones
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Ruta de salud para verificar que el servidor está corriendo
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Task Manager API',
    version: '1.0.0'
  });
});

// 🔧 CORRECCIÓN: Usar app.use() sin ruta para capturar todas las rutas no manejadas
// Esto debe ir después de todas las rutas definidas
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe en este servidor`,
    availableRoutes: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET  /api/auth/validate',
      'GET  /api/tasks',
      'POST /api/tasks',
      'PUT  /api/tasks/:id',
      'DELETE /api/tasks/:id',
      'GET  /api/health'
    ]
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  
  // Si ya se envió una respuesta, no enviar otra
  if (res.headersSent) {
    return next(err);
  }
  
  res.status(err.status || 500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, () => {
  console.log(`\n✅ Servidor backend corriendo en http://${HOST}:${PORT}`);
  console.log(`📁 Endpoints disponibles:`);
  console.log(`   POST /api/auth/register  - Registrar usuario (con validaciones)`);
  console.log(`   POST /api/auth/login     - Iniciar sesión (con validaciones)`);
  console.log(`   GET  /api/auth/validate  - Validar token JWT`);
  console.log(`   GET  /api/health         - Verificar estado del servidor`);
  console.log(`   GET  /api/tasks          - Obtener todas las tareas`);
  console.log(`   POST /api/tasks          - Crear nueva tarea`);
  console.log(`   PUT  /api/tasks/:id      - Actualizar tarea`);
  console.log(`   DELETE /api/tasks/:id    - Eliminar tarea`);
  console.log(`\n🔒 Validaciones implementadas:`);
  console.log(`   • Email válido y único`);
  console.log(`   • Contraseña: 6-20 caracteres, mayúscula, minúscula y número`);
  console.log(`   • Nombre: 2-50 caracteres`);
  console.log(`   • Confirmación de contraseña en frontend`);
  console.log(`\n🌐 CORS configurado para: http://localhost:3000`);
});