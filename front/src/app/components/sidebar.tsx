import { NavLink } from "react-router";
import {
  LayoutDashboard, CalendarDays, MapPin, DoorOpen,
  CreditCard, LogOut, Calendar, BarChart3, Globe
} from "lucide-react";

interface SidebarProps {
  active: string;
  onChange: (id: string) => void;
  onLogout: () => void;
}

const links = [
  { id: "dashboard",    icon: LayoutDashboard, label: "Dashboard" },
  { id: "events",       icon: CalendarDays,    label: "Eventos" },
  { id: "sedes",        icon: MapPin,          label: "Sedes" },
  { id: "locales",      icon: DoorOpen,         label: "Locales" },
  { id: "availability", icon: Calendar,         label: "Disponibilidad" },
  { id: "payments",     icon: CreditCard,       label: "Pagos" },
  { id: "reports",      icon: BarChart3,        label: "Reportes" },
  { id: "website",      icon: Globe,            label: "Ver Sitio" },
];

export function Sidebar({ active, onChange, onLogout }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-gray-950 border-r border-white/[0.05] flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500 text-gray-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
          <CalendarDays className="w-6 h-6" />
        </div>
        <div>
          <p className="text-white font-medium text-[0.95rem]">Event Juliaca</p>
          <p className="text-amber-500 text-[0.75rem] tracking-wider uppercase font-bold">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-3 mt-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = active === link.id;
          return (
            <button
              key={link.id}
              onClick={() => onChange(link.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-[0.9rem] group ${
                isActive
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm shadow-amber-500/5"
                  : "text-gray-500 hover:bg-white/[0.03] hover:text-gray-300 border border-transparent"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
              <span className="font-medium">{link.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/[0.05]">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-all w-full text-[0.9rem] cursor-pointer group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
