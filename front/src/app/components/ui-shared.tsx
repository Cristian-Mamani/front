import React from "react";
import { motion, AnimatePresence } from "motion/react";
import type { RoomStatus } from "../data/store";
import { X } from "lucide-react";

/* ─── Animated Glow Orb (decorative) ─── */
export function GlowOrb({ className = "" }: { className?: string }) {
  return <div className={`absolute rounded-full blur-3xl pointer-events-none ${className}`} />;
}

/* ─── Gold Divider ─── */
export function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
    </div>
  );
}

/* ─── Status Badge ─── */
export function StatusBadge({ status }: { status: RoomStatus }) {
  const map: Record<RoomStatus, { label: string; dot: string; bg: string; glow: string }> = {
    available: { label: "Disponible", dot: "bg-emerald-400", bg: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20", glow: "shadow-emerald-500/20" },
    occupied: { label: "Ocupado", dot: "bg-red-400", bg: "bg-red-500/10 text-red-300 border border-red-500/20", glow: "shadow-red-500/20" },
    maintenance: { label: "Mantenimiento", dot: "bg-amber-400", bg: "bg-amber-500/10 text-amber-300 border border-amber-500/20", glow: "shadow-amber-500/20" },
  };
  const { label, dot, bg, glow } = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 shadow-sm ${bg} ${glow}`}>
      <span className={`w-2 h-2 rounded-full ${dot} animate-pulse`} />
      {label}
    </span>
  );
}

/* ─── Button ─── */
export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "danger" | "success" | "gold" | "ghost";
  size?: "sm" | "md";
}) {
  const base = "rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 relative overflow-hidden active:scale-[0.97]";
  const sizes = { sm: "px-3.5 py-1.5", md: "px-5 py-2.5" };
  const variants: Record<string, string> = {
    primary: "bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 hover:from-amber-400 hover:to-yellow-400 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40",
    gold: "bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-gray-900 hover:from-amber-500 hover:to-amber-500 shadow-lg shadow-amber-600/25 hover:shadow-amber-500/40",
    secondary: "bg-white/[0.05] text-gray-300 hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/[0.15] backdrop-blur-sm",
    outline: "border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/50 hover:shadow-sm hover:shadow-amber-500/10",
    danger: "bg-red-600/90 text-white hover:bg-red-500 shadow-lg shadow-red-600/20",
    success: "bg-emerald-600/90 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20",
    ghost: "text-gray-400 hover:text-gray-200 hover:bg-white/5",
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

/* ─── Input ─── */
export function Input({ label, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-amber-200/70">{label}</label>}
      <input
        className={`rounded-xl border bg-white/[0.04] px-4 py-2.5 text-gray-100 placeholder-gray-600 outline-none transition-all duration-200 backdrop-blur-sm focus:ring-2 hover:bg-white/[0.06] ${
          error ? "border-red-500/40 focus:border-red-400 focus:ring-red-500/20" : "border-white/[0.08] focus:border-amber-500/50 focus:ring-amber-500/20 focus:bg-white/[0.06]"
        }`}
        {...props}
      />
      {error && <p className="text-red-400">{error}</p>}
    </div>
  );
}

/* ─── Select ─── */
export function Select({
  label,
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; options: { value: string; label: string }[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-amber-200/70">{label}</label>}
      <select
        className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-gray-100 outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 backdrop-blur-sm hover:bg-white/[0.06]"
        {...props}
      >
        <option value="" className="bg-gray-900">Seleccionar...</option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-gray-900">{o.label}</option>
        ))}
      </select>
    </div>
  );
}

/* ─── Card (with motion) ─── */
export function Card({ children, className = "", onClick, hover = true }: { children: React.ReactNode; className?: string; onClick?: () => void; hover?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.07] backdrop-blur-md shadow-xl shadow-black/20 ${
        onClick ? "cursor-pointer" : ""
      } ${hover ? "hover:border-white/[0.12] hover:shadow-2xl hover:shadow-black/30 transition-all duration-300" : ""} ${className}`}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.99 } : undefined}
    >
      {children}
    </motion.div>
  );
}

/* ─── Stat Card ─── */
export function StatCard({ title, value, icon, color, subtitle }: { title: string; value: string | number; icon: React.ReactNode; color: string; subtitle?: string }) {
  return (
    <Card className="p-5 relative overflow-hidden">
      <GlowOrb className={`w-24 h-24 ${color} opacity-20 -top-6 -right-6`} />
      <div className="flex items-center gap-4 relative z-10">
        <div className={`rounded-xl p-3 ${color} ring-1 ring-white/[0.06]`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-400 truncate">{title}</p>
          <p className="text-2xl text-amber-100" style={{ fontFamily: "'Playfair Display', serif" }}>{value}</p>
          {subtitle && <p className="text-gray-500 truncate">{subtitle}</p>}
        </div>
      </div>
    </Card>
  );
}

/* ─── Modal ─── */
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-gradient-to-b from-gray-900 to-gray-950 border border-white/[0.1] rounded-2xl shadow-2xl shadow-black/50 w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
            <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
              <h2 className="text-amber-100" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-300 cursor-pointer p-1.5 rounded-lg hover:bg-white/5 transition"><X size={18} /></button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Page Header ─── */
export function PageHeader({ title, subtitle, children, icon }: { title: string; subtitle: string; children?: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
        {icon && <div className="flex items-center gap-2 text-amber-400/80 mb-1">{icon}</div>}
        <h1 className="text-amber-100" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h1>
        <p className="text-gray-500 mt-1">{subtitle}</p>
      </motion.div>
      {children && <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>{children}</motion.div>}
    </div>
  );
}

/* ─── Section Title ─── */
export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <h3 className="text-amber-100 shrink-0" style={{ fontFamily: "'Playfair Display', serif" }}>{children}</h3>
      <div className="h-px flex-1 bg-gradient-to-r from-amber-500/20 to-transparent" />
    </div>
  );
}

/* ─── Empty State ─── */
export function EmptyState({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-2xl bg-amber-500/10 p-5 mb-4 text-amber-400/60">{icon}</div>
      <p className="text-gray-300 mb-1">{title}</p>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
}
