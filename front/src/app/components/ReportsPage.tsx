import React, { useState } from "react";
import { motion } from "motion/react";
import { useAppState } from "./AppContext";
import { Card, Select, PageHeader, SectionTitle } from "./ui-shared";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { TrendingUp, Users, CalendarDays, DollarSign, MapPin, Award, ArrowUpRight, ArrowDownRight, BarChart3 } from "lucide-react";

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const SHORT_MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

function generateMonthlyData(sedeId: string | "all") {
  const base = sedeId === "all" ? [12,15,18,22,14,19,25,20,17,23,28,16] : sedeId === "s1" ? [5,6,7,9,5,8,10,8,7,9,11,6] : sedeId === "s2" ? [4,5,6,7,5,6,8,6,5,7,9,5] : [3,4,5,6,4,5,7,6,5,7,8,5];
  const rev = sedeId === "all" ? [8500,11200,14800,18500,10200,15600,21000,16800,13400,19200,24500,12800] : sedeId === "s1" ? [3200,4500,5800,7200,4100,6100,8200,6500,5200,7500,9600,5000] : sedeId === "s2" ? [2800,3600,4800,5900,3200,5000,6700,5400,4300,6100,7800,4100] : [2500,3100,4200,5400,2900,4500,6100,4900,3900,5600,7100,3700];
  const part = sedeId === "all" ? [480,620,780,950,560,740,1050,820,680,920,1180,640] : sedeId === "s1" ? [180,240,300,370,210,290,410,320,260,360,460,250] : sedeId === "s2" ? [160,200,260,310,190,240,340,270,220,300,380,210] : [140,180,220,270,160,210,300,230,200,260,340,180];
  return SHORT_MONTHS.map((m, i) => ({ month: m, eventos: base[i], ingresos: rev[i], participantes: part[i] }));
}

function generateTypeData(sedeId: string | "all") {
  if (sedeId === "all") return [{ name: "Corporativo", value: 35, color: "#f59e0b" },{ name: "Social", value: 28, color: "#8b5cf6" },{ name: "Educativo", value: 22, color: "#3b82f6" },{ name: "Cultural", value: 15, color: "#10b981" }];
  if (sedeId === "s1") return [{ name: "Corporativo", value: 40, color: "#f59e0b" },{ name: "Social", value: 25, color: "#8b5cf6" },{ name: "Educativo", value: 20, color: "#3b82f6" },{ name: "Cultural", value: 15, color: "#10b981" }];
  if (sedeId === "s2") return [{ name: "Corporativo", value: 30, color: "#f59e0b" },{ name: "Social", value: 35, color: "#8b5cf6" },{ name: "Educativo", value: 20, color: "#3b82f6" },{ name: "Cultural", value: 15, color: "#10b981" }];
  return [{ name: "Corporativo", value: 25, color: "#f59e0b" },{ name: "Social", value: 30, color: "#8b5cf6" },{ name: "Educativo", value: 28, color: "#3b82f6" },{ name: "Cultural", value: 17, color: "#10b981" }];
}

function generateOccupancyData(sedeId: string | "all") {
  return sedeId === "all"
    ? [{ name: "Salón A (Centro)", pct: 78 },{ name: "Salón B (Centro)", pct: 65 },{ name: "Auditorio (Centro)", pct: 88 },{ name: "Salón A (Norte)", pct: 52 },{ name: "Salón B (Norte)", pct: 60 },{ name: "Auditorio (Norte)", pct: 72 },{ name: "Salón A (Sur)", pct: 70 },{ name: "Salón B (Sur)", pct: 58 },{ name: "Auditorio (Sur)", pct: 82 }]
    : sedeId === "s1" ? [{ name: "Salón A", pct: 78 },{ name: "Salón B", pct: 65 },{ name: "Auditorio", pct: 88 }]
    : sedeId === "s2" ? [{ name: "Salón A", pct: 52 },{ name: "Salón B", pct: 60 },{ name: "Auditorio", pct: 72 }]
    : [{ name: "Salón A", pct: 70 },{ name: "Salón B", pct: 58 },{ name: "Auditorio", pct: 82 }];
}

const tooltipStyle = { background: "rgba(17,24,39,0.95)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, color: "#f5f5f5", backdropFilter: "blur(12px)" };

export function ReportsPage() {
  const { sedes } = useAppState();
  const [selectedSede, setSelectedSede] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState("3");

  const monthlyData = generateMonthlyData(selectedSede);
  const typeData = generateTypeData(selectedSede);
  const occupancyData = generateOccupancyData(selectedSede);
  const currentMonthData = monthlyData[parseInt(selectedMonth)];
  const prevMonthData = monthlyData[Math.max(0, parseInt(selectedMonth) - 1)];

  const evtChange = prevMonthData.eventos > 0 ? Math.round(((currentMonthData.eventos - prevMonthData.eventos) / prevMonthData.eventos) * 100) : 0;
  const revChange = prevMonthData.ingresos > 0 ? Math.round(((currentMonthData.ingresos - prevMonthData.ingresos) / prevMonthData.ingresos) * 100) : 0;
  const partChange = prevMonthData.participantes > 0 ? Math.round(((currentMonthData.participantes - prevMonthData.participantes) / prevMonthData.participantes) * 100) : 0;
  const topRoom = occupancyData.reduce((a, b) => a.pct > b.pct ? a : b);

  const kpis = [
    { title: "Eventos", value: currentMonthData.eventos, icon: <CalendarDays size={20} className="text-amber-400" />, bg: "bg-amber-500/10", glow: "from-amber-500/10", change: evtChange },
    { title: "Ingresos", value: `S/${currentMonthData.ingresos.toLocaleString()}`, icon: <DollarSign size={20} className="text-emerald-400" />, bg: "bg-emerald-500/10", glow: "from-emerald-500/10", change: revChange },
    { title: "Asistentes", value: currentMonthData.participantes.toLocaleString(), icon: <Users size={20} className="text-blue-400" />, bg: "bg-blue-500/10", glow: "from-blue-500/10", change: partChange },
    { title: "Top Local", value: topRoom.name, icon: <Award size={20} className="text-purple-400" />, bg: "bg-purple-500/10", glow: "from-purple-500/10", extra: `${topRoom.pct}% ocupación` },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader title="Reportes" subtitle="Estadísticas mensuales por sede" icon={<><BarChart3 size={16} /><span>Analytics</span></>}>
        <div className="flex gap-3 flex-wrap">
          <Select value={selectedSede} onChange={(e) => setSelectedSede(e.target.value)} options={[{ value: "all", label: "Todas las Sedes" }, ...sedes.map((s) => ({ value: s.id, label: s.name }))]} />
          <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} options={MONTHS.map((m, i) => ({ value: String(i), label: m }))} />
        </div>
      </PageHeader>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="p-4 sm:p-5 relative overflow-hidden">
              <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${kpi.glow} to-transparent opacity-40 blur-2xl`} />
              <div className="flex items-center gap-3 relative z-10">
                <div className={`rounded-xl ${kpi.bg} p-2.5 ring-1 ring-white/[0.06] shrink-0`}>{kpi.icon}</div>
                <div className="min-w-0">
                  <p className="text-gray-500 truncate">{kpi.title}</p>
                  <p className="text-xl text-amber-100 truncate" style={{ fontFamily: "'Playfair Display', serif" }}>{kpi.value}</p>
                  {kpi.change !== undefined ? (
                    <span className={`inline-flex items-center gap-0.5 ${kpi.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {kpi.change >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{Math.abs(kpi.change)}%
                    </span>
                  ) : kpi.extra ? (
                    <span className="text-emerald-400">{kpi.extra}</span>
                  ) : null}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        <Card className="p-4 sm:p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
          <SectionTitle>Eventos por Mes</SectionTitle>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "#4b5563", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
                <YAxis tick={{ fill: "#4b5563", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(245,158,11,0.05)" }} />
                <Bar dataKey="eventos" radius={[8, 8, 0, 0]}>
                  {monthlyData.map((_, i) => (
                    <Cell key={i} fill={i === parseInt(selectedMonth) ? "#f59e0b" : "rgba(245,158,11,0.3)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
          <SectionTitle>Ingresos Mensuales (S/)</SectionTitle>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="ingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "#4b5563", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
                <YAxis tick={{ fill: "#4b5563", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`S/ ${v.toLocaleString()}`, "Ingresos"]} />
                <Area type="monotone" dataKey="ingresos" stroke="#10b981" fill="url(#ingGrad)" strokeWidth={2.5} dot={{ fill: "#10b981", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: "#34d399", strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <Card className="p-4 sm:p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
          <SectionTitle>Tipos de Evento</SectionTitle>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={typeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4} strokeWidth={0}>
                  {typeData.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2.5 mt-3">
            {typeData.map((d) => (
              <div key={d.name} className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full ring-2 ring-white/5" style={{ background: d.color }} />
                <span className="text-gray-400 flex-1">{d.name}</span>
                <span className="text-gray-200 tabular-nums">{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 sm:p-6 lg:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
          <SectionTitle>Ocupación por Local</SectionTitle>
          <div className="space-y-3.5 mt-4">
            {occupancyData.map((room, i) => (
              <motion.div key={room.name} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-gray-300">{room.name}</span>
                  <span className={`tabular-nums ${room.pct >= 75 ? "text-emerald-400" : room.pct >= 50 ? "text-amber-400" : "text-red-400"}`}>{room.pct}%</span>
                </div>
                <div className="h-2.5 bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.04]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${room.pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                    className={`h-full rounded-full ${room.pct >= 75 ? "bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-sm shadow-emerald-500/20" : room.pct >= 50 ? "bg-gradient-to-r from-amber-600 to-amber-400 shadow-sm shadow-amber-500/20" : "bg-gradient-to-r from-red-600 to-red-400 shadow-sm shadow-red-500/20"}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Participants trend */}
      <Card className="p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <SectionTitle>Tendencia de Asistentes</SectionTitle>
        <div className="mt-4">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#4b5563", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
              <YAxis tick={{ fill: "#4b5563", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="participantes" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: "#8b5cf6", r: 3.5, strokeWidth: 0 }} activeDot={{ r: 6, fill: "#a78bfa", strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Summary Table */}
      <Card className="p-4 sm:p-6 overflow-x-auto relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
        <SectionTitle>Resumen por Sede — {MONTHS[parseInt(selectedMonth)]}</SectionTitle>
        <table className="w-full min-w-[500px] mt-4">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left py-3 text-gray-500">Sede</th>
              <th className="text-right py-3 text-gray-500">Eventos</th>
              <th className="text-right py-3 text-gray-500">Ingresos</th>
              <th className="text-right py-3 text-gray-500">Asistentes</th>
              <th className="text-right py-3 text-gray-500">Ocup. Prom.</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: "Event Juliaca Centro", eventos: 9, ingresos: 7200, asistentes: 370, ocup: 77 },
              { name: "Event Juliaca Norte", eventos: 7, ingresos: 5900, asistentes: 310, ocup: 61 },
              { name: "Event Juliaca Sur", eventos: 6, ingresos: 5400, asistentes: 270, ocup: 70 },
            ].map((row, i) => (
              <motion.tr
                key={row.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-3.5 flex items-center gap-2.5"><MapPin size={15} className="text-amber-500/50 shrink-0" /><span className="text-gray-200">{row.name}</span></td>
                <td className="py-3.5 text-right text-gray-200 tabular-nums">{row.eventos}</td>
                <td className="py-3.5 text-right text-emerald-400 tabular-nums">S/ {row.ingresos.toLocaleString()}</td>
                <td className="py-3.5 text-right text-gray-200 tabular-nums">{row.asistentes}</td>
                <td className="py-3.5 text-right"><span className={`px-2.5 py-0.5 rounded-full ${row.ocup >= 70 ? "bg-emerald-500/[0.08] text-emerald-400 border border-emerald-500/20" : "bg-amber-500/[0.08] text-amber-400 border border-amber-500/20"}`}>{row.ocup}%</span></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
