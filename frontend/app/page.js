// frontend/app/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';

export default function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
    } else if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchTasks();
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await api.post('/tasks', taskData);
      fetchTasks();
    } catch (error) {
      alert('Error al crear tarea');
    }
  };

  const handleUpdateTask = async (taskData, taskId) => {
    try {
      await api.put(`/tasks/${taskId}`, taskData);
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      alert('Error al actualizar tarea');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;
    
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      alert('Error al eliminar tarea');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      alert('Error al cambiar estado');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <div className="flex items-center gap-4">
            <span>Hola, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Mis Tareas</h2>
          
          {editingTask ? (
            <TaskForm
              task={editingTask}
              onTaskCreated={(data) => handleUpdateTask(data, editingTask.id)}
            />
          ) : (
            <TaskForm onTaskCreated={handleCreateTask} />
          )}
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">Lista de Tareas</h3>
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay tareas. ¡Crea tu primera tarea!</p>
          ) : (
            <TaskList
              tasks={tasks}
              onEdit={setEditingTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </main>
    </div>
  );
}