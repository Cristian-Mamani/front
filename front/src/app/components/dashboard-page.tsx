import { CalendarDays, Users, Activity, TrendingUp } from "lucide-react";
import { events } from "../data/mock-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const stats = [
  { label: "Total Eventos", value: events.length, icon: CalendarDays, color: "bg-indigo-50 text-indigo-600" },
  { label: "Eventos Activos", value: events.filter((e) => e.status === "active").length, icon: Activity, color: "bg-emerald-50 text-emerald-600" },
  { label: "Participantes", value: events.reduce((a, e) => a + e.participants, 0), icon: Users, color: "bg-amber-50 text-amber-600" },
  { label: "Próximos", value: events.filter((e) => e.status === "upcoming").length, icon: TrendingUp, color: "bg-purple-50 text-purple-600" },
];

const chartData = [
  { month: "Ene", eventos: 3 },
  { month: "Feb", eventos: 5 },
  { month: "Mar", eventos: 4 },
  { month: "Abr", eventos: 6 },
  { month: "May", eventos: 2 },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1>Dashboard</h1>
        <p className="text-gray-500 text-[0.9rem]">Resumen general del sistema</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500 text-[0.85rem]">{s.label}</span>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[1.75rem] text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="mb-4 text-gray-800">Eventos por Mes</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 13 }} />
                <YAxis tick={{ fontSize: 13 }} />
                <Tooltip />
                <Bar dataKey="eventos" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="mb-4 text-gray-800">Eventos Recientes</h3>
          <div className="space-y-3">
            {events.slice(0, 4).map((ev) => (
              <div key={ev.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-gray-800 text-[0.9rem]">{ev.name}</p>
                  <p className="text-gray-400 text-[0.8rem]">{ev.date} · {ev.time}</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-lg text-[0.75rem] ${
                    ev.status === "active"
                      ? "bg-emerald-50 text-emerald-700"
                      : ev.status === "upcoming"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {ev.status === "active" ? "Activo" : ev.status === "upcoming" ? "Próximo" : "Completado"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
