const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validación mejorada
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,20}$/;

    // Validar nombre
    if (!name || typeof name !== 'string') {
      errors.push('El nombre es requerido');
    } else {
      const trimmedName = name.trim();
      if (trimmedName.length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
      } else if (trimmedName.length > 50) {
        errors.push('El nombre no puede exceder 50 caracteres');
      }
    }

    // Validar email
    if (!email || typeof email !== 'string') {
      errors.push('El email es requerido');
    } else {
      const trimmedEmail = email.trim().toLowerCase();
      if (!emailRegex.test(trimmedEmail)) {
        errors.push('Email no válido (formato: usuario@dominio.com)');
      } else if (trimmedEmail.length > 100) {
        errors.push('El email no puede exceder 100 caracteres');
      }
    }

    // Validar contraseña
    if (!password || typeof password !== 'string') {
      errors.push('La contraseña es requerida');
    } else if (password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    } else if (password.length > 20) {
      errors.push('La contraseña no puede exceder 20 caracteres');
    } else if (!passwordRegex.test(password)) {
      errors.push('La contraseña debe contener al menos una mayúscula, una minúscula y un número');
    }

    // Si hay errores, retornarlos
    if (errors.length > 0) {
      return res.status(400).json({ 
        error: 'Error de validación',
        details: errors 
      });
    }

    // Verificar si usuario ya existe
    const trimmedEmail = email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({ 
      where: { email: trimmedEmail } 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'El email ya está registrado',
        details: ['Por favor, utiliza otro email o inicia sesión']
      });
    }

    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email: trimmedEmail,
        password: hashedPassword,
        name: name.trim(),
      },
    });

    // Crear token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      },
    });
  } catch (error) {
    console.error('Error en registro:', error);
    
    // Manejar errores específicos de Prisma
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        error: 'Error de base de datos',
        details: ['El email ya está registrado en el sistema']
      });
    }
    
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: ['Por favor, intenta nuevamente más tarde']
    });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación básica
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || typeof email !== 'string') {
      errors.push('El email es requerido');
    } else if (!emailRegex.test(email.trim().toLowerCase())) {
      errors.push('Email no válido');
    }

    if (!password || typeof password !== 'string') {
      errors.push('La contraseña es requerida');
    } else if (password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }

    if (errors.length > 0) {
      return res.status(400).json({ 
        error: 'Error de validación',
        details: errors 
      });
    }

    // Buscar usuario
    const trimmedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ 
      where: { email: trimmedEmail } 
    });
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Credenciales incorrectas',
        details: ['El email o la contraseña son incorrectos']
      });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ 
        error: 'Credenciales incorrectas',
        details: ['El email o la contraseña son incorrectos']
      });
    }

    // Crear token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: ['Por favor, intenta nuevamente más tarde']
    });
  }
});

// Validar token (endpoint adicional para frontend)
router.get('/validate', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ valid: false, error: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ valid: false, error: 'Token inválido o expirado' });
      }
      res.json({ valid: true, user: decoded });
    });
  } catch (error) {
    console.error('Error en validación:', error);
    res.status(500).json({ valid: false, error: 'Error interno del servidor' });
  }
});

module.exports = router;