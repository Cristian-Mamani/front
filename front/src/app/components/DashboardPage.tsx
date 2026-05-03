import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useAppState } from "./AppContext";
import { dashboardApi, type ApiDashboard } from "../services/api";
import { StatCard, Card, PageHeader, SectionTitle } from "./ui-shared";
import { CalendarDays, Users, MapPin, DoorOpen, TrendingUp, Sparkles, Clock, User } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const tooltipStyle = { background: "rgba(17,24,39,0.95)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, color: "#f5f5f5", backdropFilter: "blur(12px)" };

export function DashboardPage() {
  const { sedes, salas } = useAppState();
  const [stats, setStats] = useState<ApiDashboard | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    dashboardApi.estadisticas()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoadingStats(false));
  }, []);

  const disponibles   = salas.filter((s) => s.status === "available").length;
  const ocupadas      = salas.filter((s) => s.status === "occupied").length;
  const mantenimiento = salas.filter((s) => s.status === "maintenance").length;

  const pieData = [
    { name: "Disponibles",   value: disponibles,   color: "#10b981" },
    { name: "Ocupados",      value: ocupadas,       color: "#ef4444" },
    { name: "Mantenimiento", value: mantenimiento,  color: "#f59e0b" },
  ];

  const chartData = [
    { name: "Ene", eventos: 4 }, { name: "Feb", eventos: 6 }, { name: "Mar", eventos: 8 },
    { name: "Abr", eventos: stats?.total_eventos ?? 0 },
    { name: "May", eventos: 3 }, { name: "Jun", eventos: 5 },
  ];

  if (loadingStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-amber-400 animate-pulse flex items-center gap-3">
          <Sparkles size={20} />
          <span>Cargando estadísticas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader title="Panel de Control" subtitle="Resumen de tus 3 sedes Event Juliaca" icon={<><Sparkles size={16} /><span>Bienvenido, Administrador</span></>} />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
        {[
          { title: "Total Eventos",    value: stats?.total_eventos ?? 0,    icon: <CalendarDays size={22} className="text-amber-400" />,  color: "bg-amber-500/10",   subtitle: `${stats?.eventos_activos ?? 0} activos` },
          { title: "Participantes",    value: (stats?.total_participantes ?? 0).toLocaleString(), icon: <Users size={22} className="text-blue-400" />,    color: "bg-blue-500/10" },
          { title: "Locales Libres",   value: `${disponibles}/${salas.length}`, icon: <DoorOpen size={22} className="text-emerald-400" />, color: "bg-emerald-500/10", subtitle: `${ocupadas} ocupados` },
          { title: "Ingresos Verif.", value: `S/ ${Number(stats?.ingresos_verificados ?? 0).toLocaleString()}`, icon: <TrendingUp size={22} className="text-purple-400" />, color: "bg-purple-500/10", subtitle: `${stats?.pagos_verificados ?? 0} pagos` },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6 lg:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
          <SectionTitle>Eventos por Mes</SectionTitle>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: "#4b5563", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
                <YAxis tick={{ fill: "#4b5563", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(245,158,11,0.05)" }} />
                <Bar dataKey="eventos" fill="url(#goldGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
          <SectionTitle>Estado de Locales</SectionTitle>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={78} dataKey="value" paddingAngle={5} strokeWidth={0}>
                  {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2.5 mt-3">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full ring-2 ring-white/5" style={{ background: d.color }} />
                <span className="text-gray-400 flex-1">{d.name}</span>
                <span className="text-gray-200 tabular-nums">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Sedes overview */}
      <SectionTitle>Mis Sedes</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {sedes.map((sede, i) => {
          const rooms = salas.filter((s) => s.sedeId === sede.id);
          const avail = rooms.filter((r) => r.status === "available").length;
          return (
            <motion.div key={sede.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="p-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/15 to-transparent" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-xl bg-amber-500/10 p-2.5 ring-1 ring-amber-500/10"><MapPin size={18} className="text-amber-400" /></div>
                  <div className="min-w-0">
                    <p className="text-amber-100 truncate">{sede.name}</p>
                    <p className="text-gray-600 truncate">{sede.address}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {rooms.map((r) => (
                    <span key={r.id} className={`flex-1 text-center py-2 rounded-lg border transition-all ${
                      r.status === "available"   ? "bg-emerald-500/[0.08] text-emerald-400 border-emerald-500/20"
                      : r.status === "occupied"    ? "bg-red-500/[0.08] text-red-400 border-red-500/20"
                      : "bg-amber-500/[0.08] text-amber-400 border-amber-500/20"
                    }`} style={{ fontSize: 12 }}>
                      {r.name}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 mt-3 flex items-center gap-1.5" style={{ fontSize: 13 }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{avail} de {rooms.length} disponibles
                </p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Próximos eventos desde el backend */}
      <Card className="p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <SectionTitle>Próximos Eventos</SectionTitle>
        <div className="space-y-3 mt-4">
          {(stats?.proximos_eventos ?? []).map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-200 group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-gray-200 group-hover:text-amber-100 transition-colors">{e.nombre}</p>
                <p className="text-gray-500 flex items-center gap-3 flex-wrap mt-0.5" style={{ fontSize: 13 }}>
                  <span className="flex items-center gap-1"><Clock size={13} />{e.fecha}</span>
                  <span>{e.hora_inicio}</span>
                  <span className="flex items-center gap-1"><User size={13} />{e.sede_nombre}</span>
                </p>
              </div>
              <span className="rounded-full px-3 py-1 shrink-0 ml-3 bg-blue-500/[0.08] text-blue-400 border border-blue-500/20 shadow-sm shadow-blue-500/10" style={{ fontSize: 13 }}>
                Próximo
              </span>
            </motion.div>
          ))}
          {(stats?.proximos_eventos ?? []).length === 0 && (
            <p className="text-gray-600 text-center py-6">No hay eventos próximos</p>
          )}
        </div>
      </Card>
    </div>
  );
}
