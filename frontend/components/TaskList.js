// frontend/components/TaskList.js
'use client';

export default function TaskList({ tasks, onEdit, onDelete, onStatusChange }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-lg">{task.title}</h4>
              <p className="text-gray-600 mt-1">{task.description}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(task.status)}`}>
                  {task.status === 'pending' ? 'Pendiente' : 
                   task.status === 'in_progress' ? 'En Progreso' : 'Completada'}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={task.status}
                onChange={(e) => onStatusChange(task.id, e.target.value)}
                className="p-1 border rounded text-sm"
              >
                <option value="pending">Pendiente</option>
                <option value="in_progress">En Progreso</option>
                <option value="completed">Completada</option>
              </select>
              
              <button
                onClick={() => onEdit(task)}
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
              >
                Editar
              </button>
              
              <button
                onClick={() => onDelete(task.id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}