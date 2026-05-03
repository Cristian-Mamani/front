import React, { useState } from "react";
import { motion } from "motion/react";
import { Button, Input, GoldDivider } from "./ui-shared";
import { CalendarDays, Shield, Sparkles, Star, AlertCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { login } from "../services/api";
import { useAppState } from "./AppContext";

const BG_IMAGE = "https://images.unsplash.com/photo-1729957385579-528ce50ffd94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZXZlbnQlMjB2ZW51ZSUyMGdvbGQlMjBiYWxscm9vbXxlbnwxfHx8fDE3NzYzNTc2MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080";

export function Login({ onLogin }: { onLogin: () => void }) {
  const [email,    setEmail]    = useState("admin@eventjuliaca.com");
  const [password, setPassword] = useState("admin123");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const { refetchAll } = useAppState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      await refetchAll(); // carga datos reales desde la API
      onLogin();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-950 relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full bg-amber-500/[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-100px] w-[400px] h-[400px] rounded-full bg-amber-600/[0.03] blur-[100px] pointer-events-none" />

      {/* Left - Image */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <ImageWithFallback src={BG_IMAGE} alt="Event venue" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/70 to-gray-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-transparent to-gray-950/40" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 flex flex-col justify-end p-14 text-white"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="h-px w-8 bg-amber-400" />
            <Sparkles size={16} className="text-amber-400" />
            <span className="text-amber-400 tracking-widest uppercase" style={{ fontSize: 12 }}>Premium Event Management</span>
          </div>
          <h1 className="text-5xl text-white mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Hacemos realidad<br />tus <span className="text-amber-400">eventos</span>
          </h1>
          <p className="text-gray-400 max-w-md leading-relaxed">3 sedes exclusivas en Juliaca con la mejor infraestructura para tus celebraciones y eventos corporativos.</p>
          <div className="flex items-center gap-1 mt-6">
            {[1,2,3,4,5].map((i) => <Star key={i} size={16} className="text-amber-400 fill-amber-400" />)}
            <span className="text-gray-400 ml-2">+500 eventos realizados</span>
          </div>
        </motion.div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-md"
        >
          <div className="flex flex-col items-center gap-4 mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 p-4 text-gray-900 shadow-2xl shadow-amber-500/30 ring-4 ring-amber-500/10"
            >
              <CalendarDays size={32} />
            </motion.div>
            <h1 className="text-amber-100 text-3xl" style={{ fontFamily: "'Playfair Display', serif" }}>Event Juliaca</h1>
            <p className="text-gray-500 text-center">Sistema Integral de Gestión de Eventos</p>
            <span className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full shadow-sm shadow-amber-500/10">
              <Shield size={14} /> Panel de Administrador
            </span>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="admin@eventjuliaca.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3"
              >
                <AlertCircle size={16} />
                <span style={{ fontSize: 14 }}>{error}</span>
              </motion.div>
            )}

            <Button type="submit" className="w-full mt-2 py-3" disabled={loading}>
              {loading ? "Verificando..." : "Ingresar al Panel"}
            </Button>
          </form>

          <p className="text-center text-gray-600 mt-8" style={{ fontSize: 13 }}>
            Email: <span className="text-gray-500">admin@eventjuliaca.com</span> · Pass: <span className="text-gray-500">admin123</span>
          </p>

          <GoldDivider className="mt-8" />

          <div className="mt-6 flex justify-center gap-10 text-gray-500">
            {[{ n: "3", l: "Sedes" }, { n: "9", l: "Locales" }, { n: "+500", l: "Eventos" }].map((s) => (
              <div key={s.l} className="text-center">
                <p className="text-amber-400 text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>{s.n}</p>
                <p className="text-gray-500">{s.l}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
