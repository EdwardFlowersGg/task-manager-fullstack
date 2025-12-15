const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// TODAS las rutas requieren autenticación
router.use(authenticateToken);

// Obtener todas las tareas del usuario
router.get('/', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
});

// Crear nueva tarea
router.post('/', async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'El título es requerido' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
        status: status || 'pending',
        userId: req.userId,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ error: 'Error al crear tarea' });
  }
});

// Actualizar tarea
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const existingTask = await prisma.task.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        title: title || existingTask.title,
        description: description !== undefined ? description : existingTask.description,
        status: status || existingTask.status,
      },
    });

    res.json(task);
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({ error: 'Error al actualizar tarea' });
  }
});

// Eliminar tarea
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existingTask = await prisma.task.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ error: 'Error al eliminar tarea' });
  }
});

module.exports = router;