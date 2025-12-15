// frontend/components/TaskForm.js
'use client';
import { useState } from 'react';

export default function TaskForm({ onTaskCreated, task = null }) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState(task?.status || 'pending');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const taskData = { title, description, status };
    onTaskCreated(taskData, task?.id);
    
    // Limpiar formulario si es creación nueva
    if (!task) {
      setTitle('');
      setDescription('');
      setStatus('pending');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-bold mb-4">{task ? 'Editar Tarea' : 'Nueva Tarea'}</h3>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Título *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          rows="3"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Estado</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="pending">Pendiente</option>
          <option value="in_progress">En Progreso</option>
          <option value="completed">Completada</option>
        </select>
      </div>
      
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {task ? 'Actualizar' : 'Crear'}
      </button>
    </form>
  );
}