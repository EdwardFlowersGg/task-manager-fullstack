'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Validaciones en el cliente
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email no válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    } else if (formData.password.length > 20) {
      newErrors.password = 'La contraseña no puede exceder 20 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/');
    } catch (err) {
      setErrors({
        server: err.response?.data?.error || 'Error al registrar usuario'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Crear Cuenta</h2>
          <p className="text-gray-600 mt-2">Regístrate para gestionar tus tareas</p>
        </div>
        
        {errors.server && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
            ⚠️ {errors.server}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Nombre completo
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Tu nombre"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">⚠️ {errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="ejemplo@correo.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">⚠️ {errors.email}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Mínimo 6 caracteres"
            />
            {errors.password ? (
              <p className="text-red-500 text-sm mt-1">⚠️ {errors.password}</p>
            ) : (
              <p className="text-gray-500 text-sm mt-1">
                 La contraseña debe tener entre 6 y 20 caracteres
              </p>
            )}
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Repite tu contraseña"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">⚠️ {errors.confirmPassword}</p>
            )}
          </div>

          {/* Botón de registro */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Creando cuenta...
              </span>
            ) : 'Crear Cuenta'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <a href="/login" className="text-blue-600 font-semibold hover:underline">
              Inicia sesión aquí
            </a>
          </p>
        </div>

        {/* Indicador de seguridad */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-green-600 mr-3"></div>
            <div>
              <p className="font-medium text-green-800">Seguridad garantizada</p>
              <p className="text-green-600 text-sm">Tus datos están protegidos con encriptación</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}