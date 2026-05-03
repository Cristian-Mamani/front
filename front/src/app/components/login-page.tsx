import { useState } from "react";
import { Calendar, Lock, Mail } from "lucide-react";

export function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          <h1 className="text-[1.75rem]  text-gray-900">Sistema de Gestión</h1>
          <p className="text-gray-500 mt-1">de Eventos</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/60 border border-gray-100 p-8">
          <h2 className="text-center mb-6 text-gray-800">Iniciar Sesión</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 mb-1.5 text-[0.875rem]">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@eventos.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 mb-1.5 text-[0.875rem]">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                />
              </div>
            </div>

            <button
              onClick={onLogin}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition cursor-pointer"
            >
              Ingresar
            </button>
          </div>

          <p className="text-center text-gray-400 text-[0.8rem] mt-6">
            Demo: cualquier credencial funciona
          </p>
        </div>
      </div>
    </div>
  );
}
