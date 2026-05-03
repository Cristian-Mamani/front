import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAppState } from "./AppContext";
import { ContractGenerator } from "./ContractGenerator";
import {
  CalendarDays, MapPin, Users, Star, Phone, Mail, ChevronDown,
  Sparkles, Crown, CheckCircle2, ArrowRight, Menu, X, Instagram,
  Facebook, MessageCircle, Quote, Award, Camera, Mic2, Utensils,
  Shield, Clock, ChevronRight, Building2, Globe, FileText,
  ChevronLeft, TrendingUp, BarChart3, PieChart, Zap,
  Music, Heart, Briefcase, BookOpen, GraduationCap, PartyPopper,
  Download, CheckSquare, AlertTriangle, Wrench, Circle,
  DollarSign, Tag, Users2, CalendarCheck, Info,
} from "lucide-react";

/* ─── Images ─── */
const IMG_HERO       = "https://images.unsplash.com/photo-1729957385579-528ce50ffd94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwbHV4dXJ5JTIwZXZlbnQlMjB2ZW51ZSUyMGJhbGxyb29tJTIwZ29sZHxlbnwxfHx8fDE3NzYzNjYwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_WEDDING    = "https://images.unsplash.com/photo-1767986012149-7cfc49c085c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2VyZW1vbnklMjBlbGVnYW50JTIwZGVjb3JhdGlvbiUyMGNhbmRsZXN8ZW58MXx8fHwxNzc2MzY2MDU0fDA&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_CORPORATE  = "https://images.unsplash.com/photo-1607952885616-557c53a641c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBldmVudCUyMGNvbmZlcmVuY2UlMjBoYWxsJTIwbHV4dXJ5fGVufDF8fHx8MTc3NjM2NjA1NHww&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_BIRTHDAY   = "https://images.unsplash.com/photo-1755704282977-340323fa52df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMHBhcnR5JTIwY2VsZWJyYXRpb24lMjBlbGVnYW50JTIwZGVjb3JhdGlvbnxlbnwxfHx8fDE3NzYzNjYwNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_AUDITORIUM = "https://images.unsplash.com/photo-1690131053637-04c5841aee83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhdWRpdG9yaXVtJTIwdGhlYXRlciUyMHN0YWdlJTIwbGlnaHRpbmd8ZW58MXx8fHwxNzc2MzY2MDU3fDA&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_GALA       = "https://images.unsplash.com/photo-1750277122806-a0b0277e1328?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYWxhJTIwZGlubmVyJTIwdGFibGVzJTIwcm9zZXMlMjBmbG93ZXJzJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzYzNjYwNTd8MA&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_LOBBY      = "https://images.unsplash.com/photo-1758194190679-198a77cba84f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJlY2VwdGlvbiUyMGxvYmJ5JTIwZ29sZCUyMGNoYW5kZWxpZXJ8ZW58MXx8fHwxNzc2MzY2MDYzfDA&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_CONTRACT   = "https://images.unsplash.com/photo-1763729805496-b5dbf7f00c79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250cmFjdCUyMHNpZ25pbmclMjBidXNpbmVzcyUyMGRvY3VtZW50JTIwcGVufGVufDF8fHx8MTc3NjM2ODU5NXww&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_QUINCE     = "https://images.unsplash.com/photo-1625755106045-bc7870842718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxdWluY2VhbmVyYSUyMGVsZWdhbnQlMjBwaW5rJTIwZHJlc3MlMjBiYWxscm9vbXxlbnwxfHx8fDE3NzYzNjg1OTV8MA&ixlib=rb-4.1.0&q=80&w=1080";

/* ─── Helpers ─── */
const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DAYS_ES   = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

function padDate(n: number) { return String(n).padStart(2, "0"); }
function toDateStr(y: number, m: number, d: number) { return `${y}-${padDate(m + 1)}-${padDate(d)}`; }

function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
      <Sparkles size={12} className="text-amber-500/60" />
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5">
      <Sparkles size={12} className="text-amber-400" />
      <span className="text-amber-400 tracking-widest uppercase" style={{ fontSize: 11 }}>{children}</span>
    </div>
  );
}

function SectionTitle({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-white mb-4"
      style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 4vw, 42px)" }}
    >
      {children}{accent && <> <span className="text-amber-400">{accent}</span></>}
    </motion.h2>
  );
}

function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

/* ════════════════════════════════════════════
   CALENDAR SECTION
════════════════════════════════════════════ */
function CalendarSection() {
  const { sedes, events, timeBlocks, getAllRooms } = useAppState();
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [filterSede, setFilterSede] = useState("all");

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay    = new Date(year, month, 1).getDay();

  /* For each day → compute status of each room */
  const getDayData = (dateStr: string) => {
    const dayBlocks  = timeBlocks.filter(b => b.date === dateStr);
    const dayEvents  = events.filter(e => e.date === dateStr);
    const occupied   = dayBlocks.filter(b => b.type === "event").length + dayEvents.length;
    const maint      = dayBlocks.filter(b => b.type === "maintenance" || b.type === "blocked").length;
    return { occupied, maint, total: occupied + maint };
  };

  /* Selected day detail */
  const selectedRooms = useMemo(() => {
    if (!selectedDay) return [];
    const dayBlocks = timeBlocks.filter(b => b.date === selectedDay);
    const dayEvents = events.filter(e => e.date === selectedDay);

    return getAllRooms()
      .filter(r => filterSede === "all" || r.sedeId === filterSede)
      .map(room => {
        const blocks = dayBlocks.filter(b => b.roomId === room.id);
        const roomEvents = dayEvents.filter(e => e.roomId === room.id);
        const sede = sedes.find(s => s.id === room.sedeId);
        let roomStatus: "available" | "occupied" | "maintenance" = room.status;
        if (blocks.some(b => b.type === "maintenance" || b.type === "blocked")) roomStatus = "maintenance";
        if (blocks.some(b => b.type === "event") || roomEvents.length > 0) roomStatus = "occupied";
        return { room, sede, blocks, roomEvents, roomStatus };
      });
  }, [selectedDay, timeBlocks, events, getAllRooms, filterSede, sedes]);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  };

  const statusConfig = {
    available:   { label: "Disponible",    bg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300", dot: "bg-emerald-400", glow: "shadow-emerald-500/20" },
    occupied:    { label: "Ocupado",       bg: "bg-red-500/15 border-red-500/30 text-red-300",             dot: "bg-red-400",     glow: "shadow-red-500/20" },
    maintenance: { label: "Mantenimiento", bg: "bg-amber-500/15 border-amber-500/30 text-amber-300",       dot: "bg-amber-400",   glow: "shadow-amber-500/20" },
  };

  return (
    <section id="calendario" className="py-16 sm:py-28 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-amber-500/[0.02] blur-[200px]" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex justify-center mb-4">
            <SectionLabel>Disponibilidad en Tiempo Real</SectionLabel>
          </motion.div>
          <SectionTitle accent="nuestros locales">Calendario de disponibilidad de</SectionTitle>
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-gray-400 max-w-xl mx-auto" style={{ fontSize: 15 }}>
            Consulta en tiempo real cuándo están disponibles, ocupados o en mantenimiento cada uno de nuestros salones.
          </motion.p>
        </div>

        {/* Legend + Sede filter */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            {Object.entries(statusConfig).map(([k, v]) => (
              <div key={k} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${v.dot} animate-pulse`} />
                <span className="text-gray-400" style={{ fontSize: 13 }}>{v.label}</span>
              </div>
            ))}
          </div>
          <select
            value={filterSede}
            onChange={e => { setFilterSede(e.target.value); setSelectedDay(null); }}
            className="rounded-xl border border-white/[0.08] bg-gray-900 px-4 py-2 text-gray-300 outline-none focus:border-amber-500/50 cursor-pointer"
            style={{ fontSize: 13 }}
          >
            <option value="all">Todas las sedes</option>
            {sedes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar grid */}
          <motion.div
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="lg:col-span-2 rounded-2xl p-5 sm:p-6"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}
          >
            {/* Month nav */}
            <div className="flex items-center justify-between mb-5">
              <button onClick={prevMonth} className="p-2 rounded-xl text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all cursor-pointer">
                <ChevronLeft size={20} />
              </button>
              <h3 className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: 20 }}>
                {MONTHS_ES[month]} {year}
              </h3>
              <button onClick={nextMonth} className="p-2 rounded-xl text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all cursor-pointer">
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS_ES.map(d => (
                <div key={d} className="text-center text-gray-600 py-1" style={{ fontSize: 11 }}>{d}</div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const d = i + 1;
                const dateStr = toDateStr(year, month, d);
                const { occupied, maint } = getDayData(dateStr);
                const isToday = dateStr === toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
                const isSelected = selectedDay === dateStr;
                const isPast = new Date(dateStr) < new Date(toDateStr(today.getFullYear(), today.getMonth(), today.getDate()));

                let cellStyle = "hover:bg-white/[0.06] border-transparent";
                if (isSelected) cellStyle = "bg-amber-500/20 border-amber-500/40";
                else if (maint > 0) cellStyle = "bg-amber-500/[0.06] border-amber-500/20 hover:bg-amber-500/10";
                else if (occupied > 0) cellStyle = "bg-red-500/[0.06] border-red-500/20 hover:bg-red-500/10";

                return (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(isSelected ? null : dateStr)}
                    className={`relative rounded-xl border p-1.5 text-center transition-all duration-200 cursor-pointer group ${cellStyle} ${isPast ? "opacity-40" : ""}`}
                  >
                    <span className={`block mb-1 ${isToday ? "text-amber-400 font-medium" : "text-gray-300"} ${isSelected ? "text-amber-300" : ""}`} style={{ fontSize: 13 }}>
                      {isToday ? <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-gray-900" style={{ fontSize: 11 }}>{d}</span> : d}
                    </span>
                    <div className="flex items-center justify-center gap-0.5 flex-wrap">
                      {occupied > 0 && <span className="w-1.5 h-1.5 rounded-full bg-red-400" />}
                      {maint > 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                      {occupied === 0 && maint === 0 && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Detail panel */}
          <motion.div
            initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl p-5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}
          >
            {selectedDay ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <CalendarCheck size={16} className="text-amber-400" />
                  <h4 className="text-white" style={{ fontSize: 15 }}>
                    {(() => {
                      const [yy, mm, dd] = selectedDay.split("-");
                      return `${parseInt(dd)} de ${MONTHS_ES[parseInt(mm) - 1]} ${yy}`;
                    })()}
                  </h4>
                </div>
                <GoldDivider className="mb-4" />
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {selectedRooms.length === 0
                    ? <p className="text-gray-500 text-center py-8" style={{ fontSize: 13 }}>No hay locales para esta sede</p>
                    : selectedRooms.map(({ room, sede, roomStatus, blocks, roomEvents }) => {
                        const cfg = statusConfig[roomStatus];
                        return (
                          <div key={room.id} className={`rounded-xl border p-3 ${cfg.bg}`}>
                            <div className="flex items-center justify-between mb-1.5">
                              <div>
                                <p className="text-white" style={{ fontSize: 13 }}>{room.name}</p>
                                <p className="text-gray-500" style={{ fontSize: 11 }}>{sede?.name}</p>
                              </div>
                              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 border ${cfg.bg}`} style={{ fontSize: 10 }}>
                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
                                {cfg.label}
                              </span>
                            </div>
                            {(blocks.length > 0 || roomEvents.length > 0) && (
                              <div className="mt-2 space-y-1">
                                {blocks.map(b => (
                                  <div key={b.id} className="flex items-center gap-1.5 text-gray-400" style={{ fontSize: 11 }}>
                                    <Clock size={10} className="shrink-0" />
                                    <span>{b.startHour}:00–{b.endHour}:00 · {b.label}</span>
                                  </div>
                                ))}
                                {roomEvents.map(e => (
                                  <div key={e.id} className="flex items-center gap-1.5 text-gray-400" style={{ fontSize: 11 }}>
                                    <CalendarDays size={10} className="shrink-0" />
                                    <span>{e.startTime}–{e.endTime} · {e.name}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })
                  }
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-10 min-h-[200px]">
                <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 mb-4">
                  <CalendarDays size={28} className="text-amber-400" />
                </div>
                <p className="text-gray-400 mb-1" style={{ fontSize: 14 }}>Selecciona un día</p>
                <p className="text-gray-600" style={{ fontSize: 12 }}>Haz clic en cualquier fecha para ver el estado de cada local</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Status cards summary per sede */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {sedes.map((sede, i) => {
            const avail = sede.rooms.filter(r => r.status === "available").length;
            const occ   = sede.rooms.filter(r => r.status === "occupied").length;
            const maint = sede.rooms.filter(r => r.status === "maintenance").length;
            return (
              <motion.div
                key={sede.id}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="rounded-2xl p-4"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Building2 size={15} className="text-amber-400 shrink-0" />
                  <p className="text-gray-300 truncate" style={{ fontSize: 13 }}>{sede.name}</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 text-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 py-2">
                    <p className="text-emerald-400" style={{ fontSize: 18, fontFamily: "'Playfair Display', serif" }}>{avail}</p>
                    <p className="text-gray-600" style={{ fontSize: 10 }}>Libre</p>
                  </div>
                  <div className="flex-1 text-center rounded-lg bg-red-500/10 border border-red-500/20 py-2">
                    <p className="text-red-400" style={{ fontSize: 18, fontFamily: "'Playfair Display', serif" }}>{occ}</p>
                    <p className="text-gray-600" style={{ fontSize: 10 }}>Ocupado</p>
                  </div>
                  <div className="flex-1 text-center rounded-lg bg-amber-500/10 border border-amber-500/20 py-2">
                    <p className="text-amber-400" style={{ fontSize: 18, fontFamily: "'Playfair Display', serif" }}>{maint}</p>
                    <p className="text-gray-600" style={{ fontSize: 10 }}>Mantto.</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   CATALOG SECTION
════════════════════════════════════════════ */
const CATALOG = [
  {
    id: "boda",
    icon: Heart,
    image: IMG_WEDDING,
    title: "Bodas & Matrimonios",
    subtitle: "Tu día perfecto",
    desc: "Celebra el amor en ambientes románticos y elegantes. Nuestro equipo coordina cada detalle para que solo tengas que disfrutar.",
    price: "Desde S/ 3,500",
    duration: "8–12 horas",
    capacity: "50–400 personas",
    color: "rose",
    includes: ["Decoración floral completa", "Salón principal + área de coctel", "Sonido e iluminación romántica", "Coordinador de evento", "Servicio de catering", "Fotografía básica"],
    extras: ["Video cinematográfico", "Torta de bodas", "Transporte nupcial", "Luna de miel"],
    tag: "Más Popular",
    tagColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  },
  {
    id: "quince",
    icon: PartyPopper,
    image: IMG_QUINCE,
    title: "Quinceañeros",
    subtitle: "Una noche mágica",
    desc: "El cumpleaños más especial merece el mejor escenario. Diseñamos ambientes únicos con la temática de tus sueños.",
    price: "Desde S/ 2,200",
    duration: "6–10 horas",
    capacity: "80–300 personas",
    color: "pink",
    includes: ["Decoración temática personalizada", "Iluminación de colores y efectos", "Sonido profesional y DJ", "Vals de presentación", "Mesa de honor y torta", "Coordinador exclusivo"],
    extras: ["Show de baile", "Castillo de globos", "Photo booth", "Cena gourmet"],
    tag: "Trending",
    tagColor: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  },
  {
    id: "corporativo",
    icon: Briefcase,
    image: IMG_CORPORATE,
    title: "Eventos Corporativos",
    subtitle: "Profesionalismo total",
    desc: "Congresos, lanzamientos, capacitaciones y reuniones ejecutivas en espacios equipados con tecnología de última generación.",
    price: "Desde S/ 1,800",
    duration: "4–16 horas",
    capacity: "30–400 personas",
    color: "blue",
    includes: ["Sala equipada con proyector 4K", "Sonido y micrófono profesional", "WiFi de alta velocidad fibra óptica", "Silla y mobiliario ejecutivo", "Recepción y azafatas", "Coffee break incluido"],
    extras: ["Transmisión en vivo streaming", "Servicio de traducción", "Almuerzo ejecutivo", "Transporte VIP"],
    tag: "Empresarial",
    tagColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  {
    id: "cumple",
    icon: PartyPopper,
    image: IMG_BIRTHDAY,
    title: "Cumpleaños & Fiestas",
    subtitle: "Celebra a lo grande",
    desc: "Desde fiestas íntimas hasta grandes celebraciones, creamos el ambiente perfecto para que tú y tus invitados la pasen increíble.",
    price: "Desde S/ 900",
    duration: "4–8 horas",
    capacity: "30–200 personas",
    color: "amber",
    includes: ["Ambientación con globos y decoración", "Sonido y DJ", "Mesa de dulces y torta", "Servicio de mozo", "Área de baile", "Estacionamiento"],
    extras: ["Show infantil o cómico", "Bufet personalizado", "Efectos especiales", "Recuerdo para invitados"],
    tag: "Familiar",
    tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  {
    id: "congreso",
    icon: GraduationCap,
    image: IMG_AUDITORIUM,
    title: "Conferencias & Congresos",
    subtitle: "Impacto y presencia",
    desc: "Auditorios de gran capacidad con acústica profesional, perfectos para conferencias académicas, congresos científicos y eventos culturales masivos.",
    price: "Desde S/ 2,800",
    duration: "6–18 horas",
    capacity: "100–400 personas",
    color: "violet",
    includes: ["Auditorio con capacidad 300–400 personas", "Sistema de audio profesional envolvente", "Pantalla LED gigante", "Cabina de control audiovisual", "Sala de ponentes VIP", "Acreditación y registro"],
    extras: ["Archivo de grabación HD", "Publicación de memorias", "Diseño de programa y flyers", "Catering multi-día"],
    tag: "Académico",
    tagColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  },
  {
    id: "gala",
    icon: Award,
    image: IMG_GALA,
    title: "Galas & Cenas de Honor",
    subtitle: "Elegancia sin límites",
    desc: "Veladas exclusivas con montajes de alta gama, menús gourmet diseñados por chefs y atención personalizada de primer nivel.",
    price: "Desde S/ 4,500",
    duration: "4–8 horas",
    capacity: "50–250 personas",
    color: "yellow",
    includes: ["Montaje de lujo con mantelería fina", "Menú gourmet de 4 tiempos", "Sommelier y servicio de vinos", "Iluminación ambiental premium", "Música en vivo o cuarteto", "Recepción con champagne"],
    extras: ["Chef invitado de renombre", "Sobremesa con licores premium", "Decoración floral exótica", "Maestro de ceremonias"],
    tag: "Premium",
    tagColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  },
];

function CatalogSection({ onContactClick }: { onContactClick: () => void }) {
  const [selected, setSelected] = useState<typeof CATALOG[0] | null>(null);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? CATALOG : CATALOG.filter(c => c.color === filter);

  const colorMap: Record<string, string> = {
    rose:   "from-rose-500/20 to-rose-500/5 border-rose-500/20",
    pink:   "from-pink-500/20 to-pink-500/5 border-pink-500/20",
    blue:   "from-blue-500/20 to-blue-500/5 border-blue-500/20",
    amber:  "from-amber-500/20 to-amber-500/5 border-amber-500/20",
    violet: "from-violet-500/20 to-violet-500/5 border-violet-500/20",
    yellow: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/20",
  };
  const iconColorMap: Record<string, string> = {
    rose:   "text-rose-400 bg-rose-500/10 border-rose-500/20",
    pink:   "text-pink-400 bg-pink-500/10 border-pink-500/20",
    blue:   "text-blue-400 bg-blue-500/10 border-blue-500/20",
    amber:  "text-amber-400 bg-amber-500/10 border-amber-500/20",
    violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  };

  return (
    <section id="catalogo" className="py-16 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex justify-center mb-4">
            <SectionLabel>Catálogo de Actividades</SectionLabel>
          </motion.div>
          <SectionTitle accent="el evento perfecto">Elige</SectionTitle>
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-gray-400 max-w-xl mx-auto mb-8" style={{ fontSize: 15 }}>
            Explora nuestra gama completa de paquetes. Cada uno diseñado para superar tus expectativas.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {CATALOG.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.5 }}
                onClick={() => setSelected(selected?.id === item.id ? null : item)}
                className={`relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 ${selected?.id === item.id ? "ring-2 ring-amber-500/50" : ""}`}
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }}>
                    <ImageWithFallback src={item.image} alt={item.title} className="w-full h-44 object-cover" />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/30 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs border rounded-full px-2.5 py-1 ${item.tagColor}`} style={{ fontSize: 10 }}>{item.tag}</span>
                  </div>
                  <div className={`absolute top-3 left-3 rounded-xl border p-2 ${iconColorMap[item.color]}`}>
                    <Icon size={16} />
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  <p className="text-gray-500 mb-0.5" style={{ fontSize: 11 }}>{item.subtitle}</p>
                  <h3 className="text-white mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: 18 }}>{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-4" style={{ fontSize: 13 }}>{item.desc}</p>

                  <div className="flex flex-wrap gap-3 text-gray-500 mb-4" style={{ fontSize: 12 }}>
                    <span className="flex items-center gap-1"><DollarSign size={12} className="text-amber-400/60" />{item.price}</span>
                    <span className="flex items-center gap-1"><Clock size={12} className="text-amber-400/60" />{item.duration}</span>
                    <span className="flex items-center gap-1"><Users size={12} className="text-amber-400/60" />{item.capacity}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-amber-400" style={{ fontSize: 12 }}>{selected?.id === item.id ? "▲ Ver menos" : "▼ Ver detalle"}</span>
                    <button
                      onClick={e => { e.stopPropagation(); onContactClick(); }}
                      className="flex items-center gap-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 rounded-xl px-3 py-1.5 transition-all cursor-pointer"
                      style={{ fontSize: 12 }}
                    >
                      Cotizar <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Expanded detail panel */}
        <AnimatePresence>
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div
                className="rounded-2xl p-6 sm:p-8 mb-2"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)`,
                  border: "1px solid rgba(245,158,11,0.2)",
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-amber-400 mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: 22 }}>✦ Incluye en el paquete</h3>
                    <div className="space-y-2.5">
                      {selected.includes.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-gray-300" style={{ fontSize: 14 }}>
                          <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-gray-400 mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: 22 }}>+ Servicios adicionales</h3>
                    <div className="space-y-2.5">
                      {selected.extras.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-gray-500" style={{ fontSize: 14 }}>
                          <Tag size={13} className="text-amber-500/40 shrink-0 mt-0.5" />
                          {item} <span className="text-gray-700 ml-1">(cotizar)</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={onContactClick}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 rounded-xl py-3 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all cursor-pointer"
                        style={{ fontSize: 14 }}
                      >
                        <Phone size={14} /> Solicitar cotización
                      </button>
                      <button
                        onClick={() => setSelected(null)}
                        className="px-4 rounded-xl border border-white/[0.08] text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-all cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   REPORTS SECTION
════════════════════════════════════════════ */
function ReportsSection() {
  const { events, sedes, getAllRooms } = useAppState();
  const [statsInView, setStatsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsInView(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const totalEvents    = events.length;
  const activeEvents   = events.filter(e => e.status === "active").length;
  const completedEvents= events.filter(e => e.status === "completed").length;
  const upcomingEvents = events.filter(e => e.status === "upcoming").length;
  const totalParticipants = events.reduce((s, e) => s + e.participants, 0);
  const paidRevenue    = events.filter(e => e.type === "paid").reduce((s, e) => s + e.price, 0);
  const allRooms       = getAllRooms();
  const availableRooms = allRooms.filter(r => r.status === "available").length;
  const occupancyRate  = allRooms.length > 0 ? Math.round(((allRooms.length - availableRooms) / allRooms.length) * 100) : 0;

  /* Per-sede event count */
  const sedeStats = sedes.map(s => ({
    name: s.name.replace("Event Juliaca ", ""),
    count: events.filter(e => e.sedeId === s.id).length,
    participants: events.filter(e => e.sedeId === s.id).reduce((a, e) => a + e.participants, 0),
    avail: s.rooms.filter(r => r.status === "available").length,
    occ: s.rooms.filter(r => r.status === "occupied").length,
    maint: s.rooms.filter(r => r.status === "maintenance").length,
  }));

  const maxSedeCount = Math.max(...sedeStats.map(s => s.count), 1);

  /* Type breakdown */
  const paidCount = events.filter(e => e.type === "paid").length;
  const freeCount = events.filter(e => e.type === "free").length;
  const paidPct   = totalEvents ? Math.round((paidCount / totalEvents) * 100) : 0;

  const Counter = ({ value, suffix = "", delay = 0 }: { value: number; suffix?: string; delay?: number }) => {
    const c = useCounter(value, 1800, statsInView);
    return <>{c}{suffix}</>;
  };

  return (
    <section id="reportes" className="py-16 sm:py-28 relative" ref={ref}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-amber-500/[0.02] blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex justify-center mb-4">
            <SectionLabel>Estadísticas Públicas</SectionLabel>
          </motion.div>
          <SectionTitle accent="nuestra gestión">Transparencia en</SectionTitle>
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-gray-400 max-w-xl mx-auto" style={{ fontSize: 15 }}>
            Cifras reales de nuestra operación. Conoce el rendimiento de nuestras 3 sedes y la confianza de nuestros clientes.
          </motion.p>
        </div>

        {/* Main KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: CalendarDays, label: "Total Eventos", value: totalEvents, suffix: "", color: "amber" },
            { icon: Users2,       label: "Participantes",  value: totalParticipants, suffix: "+", color: "blue" },
            { icon: TrendingUp,   label: "Tasa Ocupación", value: occupancyRate, suffix: "%", color: "red" },
            { icon: DollarSign,   label: "Ingresos Est.",  value: paidRevenue, suffix: "", prefix: "S/", color: "emerald" },
          ].map(({ icon: Icon, label, value, suffix, color, prefix }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-5 text-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className={`inline-flex rounded-xl p-2.5 mb-3 border ${{
                amber: "bg-amber-500/10 border-amber-500/20 text-amber-400",
                blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
                red: "bg-red-500/10 border-red-500/20 text-red-400",
                emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
              }[color]}`}>
                <Icon size={18} />
              </div>
              <p className="text-white mb-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: 28 }}>
                {prefix && <span style={{ fontSize: 16 }}>{prefix} </span>}
                <Counter value={value} suffix={suffix} delay={i * 0.08} />
              </p>
              <p className="text-gray-500" style={{ fontSize: 12 }}>{label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Event status breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <PieChart size={16} className="text-amber-400" />
              <h4 className="text-white" style={{ fontSize: 15 }}>Estado de Eventos</h4>
            </div>

            {[
              { label: "Activos",   val: activeEvents,   pct: totalEvents ? Math.round(activeEvents/totalEvents*100) : 0,    bar: "bg-emerald-500", text: "text-emerald-400" },
              { label: "Próximos",  val: upcomingEvents,  pct: totalEvents ? Math.round(upcomingEvents/totalEvents*100) : 0,  bar: "bg-blue-500",    text: "text-blue-400" },
              { label: "Completados",val: completedEvents, pct: totalEvents ? Math.round(completedEvents/totalEvents*100) : 0, bar: "bg-gray-500",    text: "text-gray-400" },
            ].map(({ label, val, pct, bar, text }) => (
              <div key={label} className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-gray-400" style={{ fontSize: 13 }}>{label}</span>
                  <span className={text} style={{ fontSize: 13 }}>{val} <span className="text-gray-600">({pct}%)</span></span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className={`h-full rounded-full ${bar}`}
                  />
                </div>
              </div>
            ))}

            <GoldDivider className="my-4" />
            <div className="flex gap-3">
              <div className="flex-1 text-center rounded-xl bg-amber-500/8 border border-amber-500/15 py-3">
                <p className="text-amber-400" style={{ fontFamily: "'Playfair Display', serif", fontSize: 22 }}>{paidPct}%</p>
                <p className="text-gray-600" style={{ fontSize: 11 }}>Pagados</p>
              </div>
              <div className="flex-1 text-center rounded-xl bg-white/[0.03] border border-white/[0.07] py-3">
                <p className="text-gray-300" style={{ fontFamily: "'Playfair Display', serif", fontSize: 22 }}>{100 - paidPct}%</p>
                <p className="text-gray-600" style={{ fontSize: 11 }}>Gratuitos</p>
              </div>
            </div>
          </motion.div>

          {/* Per-sede bars */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 size={16} className="text-amber-400" />
              <h4 className="text-white" style={{ fontSize: 15 }}>Eventos por Sede</h4>
            </div>

            {sedeStats.map((s, i) => (
              <div key={s.name} className="mb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-gray-400" style={{ fontSize: 13 }}>{s.name}</span>
                  <span className="text-amber-400" style={{ fontSize: 13 }}>{s.count} eventos</span>
                </div>
                <div className="h-3 rounded-full bg-white/[0.05] overflow-hidden mb-1.5">
                  <motion.div
                    initial={{ width: 0 }} whileInView={{ width: `${(s.count / maxSedeCount) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400"
                  />
                </div>
                <p className="text-gray-600" style={{ fontSize: 11 }}>{s.participants} participantes totales</p>
              </div>
            ))}

            <GoldDivider className="my-4" />
            <div className="text-center">
              <p className="text-gray-500" style={{ fontSize: 12 }}>Sede más activa</p>
              <p className="text-amber-400 mt-1" style={{ fontSize: 14, fontFamily: "'Playfair Display', serif" }}>
                {sedeStats.sort((a, b) => b.count - a.count)[0]?.name}
              </p>
            </div>
          </motion.div>

          {/* Room status overview */}
          <motion.div
            initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Building2 size={16} className="text-amber-400" />
              <h4 className="text-white" style={{ fontSize: 15 }}>Estado Actual de Locales</h4>
            </div>

            {sedes.map((sede) => (
              <div key={sede.id} className="mb-4">
                <p className="text-gray-500 mb-2" style={{ fontSize: 12 }}>{sede.name.replace("Event Juliaca ", "")}</p>
                <div className="flex gap-2">
                  {sede.rooms.map(room => {
                    const colors = {
                      available:   "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
                      occupied:    "border-red-500/30 bg-red-500/10 text-red-400",
                      maintenance: "border-amber-500/30 bg-amber-500/10 text-amber-400",
                    };
                    const icons = { available: CheckCircle2, occupied: Circle, maintenance: Wrench };
                    const Icon = icons[room.status as keyof typeof icons] || icons.available;
                    return (
                      <div key={room.id} className={`flex-1 rounded-xl border p-2 text-center ${colors[room.status as keyof typeof colors] || colors.available}`}>
                        <Icon size={13} className="mx-auto mb-1" />
                        <p style={{ fontSize: 10 }}>{room.name}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <GoldDivider className="my-4" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-gray-500" style={{ fontSize: 11 }}>Disponible</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-gray-500" style={{ fontSize: 11 }}>Ocupado</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-gray-500" style={{ fontSize: 11 }}>Mantenimiento</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent events list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-2 mb-5">
            <CalendarDays size={16} className="text-amber-400" />
            <h4 className="text-white" style={{ fontSize: 15 }}>Eventos Recientes & Próximos</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: 560 }}>
              <thead>
                <tr className="text-gray-600 border-b border-white/[0.06]" style={{ fontSize: 11 }}>
                  {["Evento", "Sede", "Fecha", "Participantes", "Estado"].map(h => (
                    <th key={h} className="text-left pb-3 pr-4 font-normal tracking-wider uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 6).map((e, i) => {
                  const sede = sedes.find(s => s.id === e.sedeId);
                  const statusMap = {
                    active:    { label: "Activo",    cls: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" },
                    upcoming:  { label: "Próximo",   cls: "bg-blue-500/10 text-blue-300 border-blue-500/20" },
                    completed: { label: "Completado",cls: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
                  };
                  const s = statusMap[e.status as keyof typeof statusMap] || statusMap.upcoming;
                  return (
                    <motion.tr
                      key={e.id}
                      initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 pr-4">
                        <p className="text-gray-300" style={{ fontSize: 13 }}>{e.name}</p>
                        <p className="text-gray-600" style={{ fontSize: 11 }}>{e.startTime}–{e.endTime}</p>
                      </td>
                      <td className="py-3 pr-4 text-gray-500" style={{ fontSize: 12 }}>{sede?.name.replace("Event Juliaca ", "")}</td>
                      <td className="py-3 pr-4 text-gray-500" style={{ fontSize: 12 }}>{e.date}</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-1.5 text-gray-400" style={{ fontSize: 12 }}>
                          <Users size={12} className="text-amber-400/50" />
                          {e.participants}
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={`text-xs border rounded-full px-2.5 py-1 ${s.cls}`} style={{ fontSize: 10 }}>{s.label}</span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   CONTRACT SECTION
════════════════════════════════════════════ */
function ContractSection({ onContactClick }: { onContactClick: () => void }) {
  const [openClause, setOpenClause] = useState<number | null>(null);
  const [showGenerator, setShowGenerator] = useState(false);

  const CLAUSES = [
    {
      title: "1. Reserva y Confirmación",
      content: "La reserva se formaliza con la firma del presente contrato y el pago del 50% del costo total del servicio. Event Juliaca garantiza la exclusividad del local para la fecha y horario acordados, siempre y cuando el anticipo haya sido acreditado en nuestra cuenta.",
    },
    {
      title: "2. Formas de Pago",
      content: "El 50% restante deberá ser cancelado 7 días antes del evento. Aceptamos efectivo, transferencia bancaria (BCP / Interbank / BBVA) y pago con Yape o Plin. En caso de no cumplirse el saldo, Event Juliaca se reserva el derecho de anular la reserva.",
    },
    {
      title: "3. Política de Cancelación",
      content: "Cancelaciones con más de 30 días de anticipación: devolución del 80% del anticipo. Entre 15 y 30 días: devolución del 50%. Menos de 15 días: sin devolución. Se permite el cambio de fecha por única vez sin penalidad, con un mínimo de 20 días de anticipación y sujeto a disponibilidad.",
    },
    {
      title: "4. Uso del Local y Normativa",
      content: "El cliente se compromete a utilizar el local únicamente para los fines descritos en este contrato. Queda prohibido el ingreso de comida o bebida externa sin previa autorización. El aforo máximo del local deberá respetarse conforme a las normas de seguridad vigentes en Puno, Perú.",
    },
    {
      title: "5. Responsabilidad y Daños",
      content: "El cliente es responsable de cualquier daño material ocasionado al local, mobiliario o equipamiento durante el evento. Event Juliaca se reserva el derecho de cobrar los daños correspondientes sobre la garantía depositada (S/ 500 a S/ 1,500 según el local).",
    },
    {
      title: "6. Servicios Adicionales",
      content: "Los servicios adicionales (catering, fotografía, decoración especial, DJ, etc.) deberán ser contratados y especificados en el Anexo A de este contrato. Cualquier servicio no incluido en el paquete base será cotizado y facturado por separado.",
    },
    {
      title: "7. Fuerza Mayor",
      content: "En caso de situaciones de fuerza mayor (desastres naturales, estado de emergencia nacional, etc.), Event Juliaca ofrecerá al cliente la posibilidad de reprogramar el evento sin costo adicional o la devolución total del anticipo, según la preferencia del cliente.",
    },
    {
      title: "8. Jurisdicción",
      content: "Las partes acuerdan someterse a la jurisdicción de los Juzgados y Tribunales de la ciudad de Juliaca, Puno, para la resolución de cualquier controversia derivada del presente contrato.",
    },
  ];

  const PACKAGES_CONTRACT = [
    { name: "Básico", desc: "Ideal para eventos íntimos hasta 80 personas", price: "S/ 900", items: ["Salón por 4 horas", "Sillas y mesas", "Servicio básico", "Estacionamiento"], highlight: false },
    { name: "Estándar", desc: "Para celebraciones de hasta 200 personas", price: "S/ 2,200", items: ["Salón por 8 horas", "Decoración incluida", "Sonido y DJ", "Catering básico", "Fotografía"], highlight: true },
    { name: "Premium", desc: "La experiencia completa, sin límites", price: "S/ 4,500", items: ["Salón principal completo", "Decoración premium", "Sonido profesional", "Catering gourmet", "Foto + Video", "Coordinador VIP", "Extras ilimitados"], highlight: false },
  ];

  return (
    <section id="contrato" className="py-16 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex justify-center mb-4">
            <SectionLabel>Contrato & Transparencia</SectionLabel>
          </motion.div>
          <SectionTitle accent="tu respaldo">Tu evento,</SectionTitle>
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-gray-400 max-w-xl mx-auto" style={{ fontSize: 15 }}>
            Trabajamos con contratos claros y transparentes. Conoce las condiciones, paquetes y garantías antes de reservar.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12 items-start">
          {/* Contract image + key points */}
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="relative rounded-2xl overflow-hidden mb-6" style={{ height: 280 }}>
              <ImageWithFallback src={IMG_CONTRACT} alt="Contrato Event Juliaca" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/30 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-1.5 mb-3">
                  <Shield size={12} className="text-amber-400" />
                  <span className="text-amber-400" style={{ fontSize: 11 }}>Contrato con respaldo legal</span>
                </div>
                <p className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: 20 }}>Firmado y protegido por ley peruana</p>
              </div>
            </div>

            {/* Key guarantees */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Shield, title: "Garantía Total", desc: "100% de respaldo contractual" },
                { icon: DollarSign, title: "Precios Fijos", desc: "Sin costos ocultos" },
                { icon: Clock, title: "Reserva 24h", desc: "Confirmación en menos de 1 día" },
                { icon: FileText, title: "Contrato Digital", desc: "Firma electrónica disponible" },
              ].map(({ icon: Icon, title, desc }) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  className="rounded-xl p-4 flex items-start gap-3"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2 shrink-0">
                    <Icon size={14} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-gray-300" style={{ fontSize: 13 }}>{title}</p>
                    <p className="text-gray-600" style={{ fontSize: 11 }}>{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Clauses accordion */}
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            <h3 className="text-white mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: 20 }}>Cláusulas del Contrato</h3>
            <div className="space-y-2">
              {CLAUSES.map((clause, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.03)", border: openClause === i ? "1px solid rgba(245,158,11,0.25)" : "1px solid rgba(255,255,255,0.07)" }}
                >
                  <button
                    onClick={() => setOpenClause(openClause === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer group"
                  >
                    <span className={`${openClause === i ? "text-amber-400" : "text-gray-300 group-hover:text-gray-200"} transition-colors`} style={{ fontSize: 13 }}>
                      {clause.title}
                    </span>
                    <ChevronDown size={16} className={`text-gray-500 transition-transform shrink-0 ml-2 ${openClause === i ? "rotate-180 text-amber-400" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {openClause === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }} className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-gray-400 leading-relaxed border-t border-white/[0.05]" style={{ fontSize: 13, paddingTop: 12 }}>
                          {clause.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowGenerator(true)}
                className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 rounded-xl py-3 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all cursor-pointer"
                style={{ fontSize: 14 }}
              >
                <FileText size={15} /> Generar Contrato
              </button>
              <button
                onClick={onContactClick}
                className="flex items-center gap-2 border border-white/[0.1] text-gray-400 hover:text-gray-200 hover:border-white/20 rounded-xl px-4 py-3 transition-all cursor-pointer"
                style={{ fontSize: 13 }}
              >
                <Download size={15} /> Consultar
              </button>
            </div>
          </motion.div>
        </div>

        {/* Pricing packages */}
        <div className="mb-8">
          <h3 className="text-white text-center mb-6" style={{ fontFamily: "'Playfair Display', serif", fontSize: 24 }}>
            Paquetes <span className="text-amber-400">todo incluido</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {PACKAGES_CONTRACT.map((pkg, i) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-6 ${pkg.highlight ? "ring-2 ring-amber-500/50" : ""}`}
                style={{
                  background: pkg.highlight
                    ? "linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(255,255,255,0.04) 100%)"
                    : "rgba(255,255,255,0.03)",
                  border: pkg.highlight ? "1px solid rgba(245,158,11,0.3)" : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {pkg.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 rounded-full px-4 py-1 shadow-lg shadow-amber-500/30" style={{ fontSize: 11 }}>
                      ✦ Más Elegido
                    </span>
                  </div>
                )}
                <p className="text-amber-400 mb-1" style={{ fontSize: 12, letterSpacing: 2 }}>{pkg.name.toUpperCase()}</p>
                <p className="text-white mb-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: 28 }}>{pkg.price}</p>
                <p className="text-gray-500 mb-5" style={{ fontSize: 12 }}>{pkg.desc}</p>
                <GoldDivider className="mb-4" />
                <div className="space-y-2.5 mb-6">
                  {pkg.items.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-gray-300" style={{ fontSize: 13 }}>
                      <CheckCircle2 size={13} className="text-amber-400 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
                <button
                  onClick={onContactClick}
                  className={`w-full rounded-xl py-2.5 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    pkg.highlight
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
                      : "border border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                  }`}
                  style={{ fontSize: 14 }}
                >
                  Reservar Ahora <ArrowRight size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Contract Generator Modal */}
      <AnimatePresence>
        {showGenerator && <ContractGenerator onClose={() => setShowGenerator(false)} />}
      </AnimatePresence>
    </section>
  );
}

export { CalendarSection, CatalogSection, ReportsSection, ContractSection, GoldDivider, SectionLabel, SectionTitle };

/* ════════════════════════════════════════════
   MAIN PUBLIC WEBSITE
════════════════════════════════════════════ */
export function PublicWebsite({ onLoginClick }: { onLoginClick: () => void }) {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsInView, setStatsInView] = useState(false);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY       = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsInView(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setNavOpen(false);
  };

  const NAV_LINKS = [
    { label: "Inicio",       id: "hero" },
    { label: "Disponibilidad", id: "calendario" },
    { label: "Catálogo",    id: "catalogo" },
    { label: "Reportes",    id: "reportes" },
    { label: "Contrato",    id: "contrato" },
    { label: "Contacto",    id: "contacto" },
  ];

  const StatCounter = ({ value, suffix = "", delay = 0 }: { value: number; suffix?: string; delay?: number }) => {
    const c = useCounter(value, 2000, statsInView);
    return <motion.div initial={{ opacity: 0, y: 24 }} animate={statsInView ? { opacity: 1, y: 0 } : {}} transition={{ delay, duration: 0.6 }} className="text-center">
      <div className="text-amber-400 mb-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, lineHeight: 1 }}>{c}{suffix}</div>
    </motion.div>;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-400px] right-[-200px] w-[700px] h-[700px] rounded-full bg-amber-500/[0.025] blur-[200px]" />
        <div className="absolute top-[40%] left-[-300px] w-[600px] h-[600px] rounded-full bg-amber-600/[0.015] blur-[180px]" />
        <div className="absolute bottom-[-200px] right-[20%] w-[500px] h-[500px] rounded-full bg-amber-500/[0.02] blur-[150px]" />
      </div>

      {/* ─── NAVBAR ─── */}
      <motion.nav
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-gray-950/90 backdrop-blur-xl border-b border-white/[0.06] shadow-xl shadow-black/20" : "bg-transparent"}`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 p-2.5 shadow-lg shadow-amber-500/30 ring-2 ring-amber-500/10">
              <CalendarDays size={18} className="text-gray-900" />
            </div>
            <div>
              <span className="text-amber-100 block leading-tight" style={{ fontFamily: "'Playfair Display', serif", fontSize: 16 }}>Event Juliaca</span>
              <span className="text-gray-600 block" style={{ fontSize: 10 }}>Premium Events · 3 Sedes</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map(link => (
              <button key={link.id} onClick={() => scrollTo(link.id)}
                className="text-gray-400 hover:text-amber-400 px-3 py-2 rounded-xl transition-all hover:bg-amber-500/10 cursor-pointer" style={{ fontSize: 13 }}>
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={onLoginClick}
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 rounded-xl px-4 py-2.5 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:from-amber-400 hover:to-yellow-400 transition-all cursor-pointer"
              style={{ fontSize: 13 }}>
              <Crown size={14} /> Administración
            </button>
            <button onClick={() => setNavOpen(!navOpen)} className="lg:hidden text-gray-400 hover:text-gray-200 p-2 rounded-xl hover:bg-white/5 cursor-pointer">
              {navOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {navOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden border-t border-white/[0.06] bg-gray-950/95 backdrop-blur-xl">
              <div className="px-5 py-4 space-y-1">
                {NAV_LINKS.map(link => (
                  <button key={link.id} onClick={() => scrollTo(link.id)}
                    className="w-full text-left text-gray-400 hover:text-amber-400 px-4 py-3 rounded-xl hover:bg-amber-500/10 cursor-pointer" style={{ fontSize: 14 }}>
                    {link.label}
                  </button>
                ))}
                <button onClick={onLoginClick}
                  className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 rounded-xl px-5 py-3 cursor-pointer" style={{ fontSize: 14 }}>
                  <Crown size={14} /> Administración
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ─── HERO ─── */}
      <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <ImageWithFallback src={IMG_HERO} alt="Event Juliaca" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-gray-950/60 to-gray-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-transparent to-gray-950/80" />
        </motion.div>

        {/* Shimmer dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(14)].map((_, i) => (
            <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-amber-400"
              style={{ left: `${10 + (i * 7) % 82}%`, top: `${12 + (i * 11) % 72}%`, opacity: 0.15 + (i % 4) * 0.1 }}
              animate={{ opacity: [0.1, 0.5, 0.1], scale: [1, 1.6, 1] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.35 }}
            />
          ))}
        </div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center px-5 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex justify-center mb-6">
            <SectionLabel>Juliaca · Puno · Perú</SectionLabel>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white mb-6 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(34px, 7vw, 78px)" }}
          >
            Hacemos realidad<br />
            tus <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500">eventos soñados</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10"
            style={{ fontSize: "clamp(14px, 2vw, 17px)" }}
          >
            3 sedes exclusivas con disponibilidad en tiempo real, catálogo completo de servicios, reportes transparentes y contratos garantizados.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
            <button onClick={() => scrollTo("calendario")} className="inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 rounded-2xl px-7 py-3.5 shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:from-amber-400 hover:to-yellow-400 transition-all cursor-pointer" style={{ fontSize: 14 }}>
              <CalendarDays size={17} /> Ver Disponibilidad <ArrowRight size={15} />
            </button>
            <button onClick={() => scrollTo("catalogo")} className="inline-flex items-center gap-2.5 border border-white/20 text-gray-300 hover:text-white hover:border-amber-500/40 hover:bg-amber-500/10 rounded-2xl px-7 py-3.5 transition-all cursor-pointer backdrop-blur-sm" style={{ fontSize: 14 }}>
              Catálogo de Servicios <ChevronDown size={15} />
            </button>
            <button onClick={() => scrollTo("contrato")} className="inline-flex items-center gap-2.5 border border-amber-500/20 text-amber-400/80 hover:text-amber-400 hover:border-amber-500/40 hover:bg-amber-500/10 rounded-2xl px-7 py-3.5 transition-all cursor-pointer backdrop-blur-sm" style={{ fontSize: 14 }}>
              <FileText size={15} /> Ver Contrato
            </button>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="flex items-center justify-center gap-2 mt-10">
            <div className="flex gap-1">{[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}</div>
            <span className="text-gray-500" style={{ fontSize: 13 }}>+500 eventos realizados con éxito</span>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer" onClick={() => scrollTo("stats")}>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-amber-500/50">
            <ChevronDown size={28} />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── STATS BANNER ─── */}
      <section id="stats" ref={statsRef} className="py-12 sm:py-20 relative">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="rounded-3xl p-8 sm:p-12" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.07) 0%, rgba(255,255,255,0.03) 100%)", border: "1px solid rgba(245,158,11,0.15)", backdropFilter: "blur(20px)" }}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10">
              {[
                { v: 3, s: "+", l: "Sedes en Juliaca" },
                { v: 9, s: "", l: "Locales premium" },
                { v: 500, s: "+", l: "Eventos realizados" },
                { v: 5000, s: "+", l: "Clientes satisfechos" },
              ].map(({ v, s, l }, i) => (
                <div key={l} className="text-center">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={statsInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }}>
                    <StatCounter value={v} suffix={s} delay={i * 0.1} />
                    <p className="text-gray-500" style={{ fontSize: 13 }}>{l}</p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Quick Nav Pills ─── */}
      <div className="sticky top-16 sm:top-20 z-40 py-3 px-5">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex gap-2 overflow-x-auto pb-1 justify-center flex-wrap"
            style={{ scrollbarWidth: "none" }}>
            {[
              { label: "📅 Disponibilidad", id: "calendario" },
              { label: "🎯 Catálogo",       id: "catalogo" },
              { label: "📊 Reportes",       id: "reportes" },
              { label: "📄 Contrato",       id: "contrato" },
              { label: "📞 Contacto",       id: "contacto" },
            ].map(p => (
              <button key={p.id} onClick={() => scrollTo(p.id)}
                className="shrink-0 text-gray-400 hover:text-amber-400 bg-white/[0.04] hover:bg-amber-500/10 border border-white/[0.07] hover:border-amber-500/20 rounded-full px-4 py-1.5 transition-all cursor-pointer backdrop-blur-sm"
                style={{ fontSize: 12 }}>
                {p.label}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ─── CALENDAR ─── */}
      <CalendarSection />

      <div className="max-w-6xl mx-auto px-5 sm:px-8"><GoldDivider /></div>

      {/* ─── CATALOG ─── */}
      <CatalogSection onContactClick={() => scrollTo("contacto")} />

      <div className="max-w-6xl mx-auto px-5 sm:px-8"><GoldDivider /></div>

      {/* ─── REPORTS ─── */}
      <ReportsSection />

      <div className="max-w-6xl mx-auto px-5 sm:px-8"><GoldDivider /></div>

      {/* ─── CONTRACT ─── */}
      <ContractSection onContactClick={() => scrollTo("contacto")} />

      <div className="max-w-6xl mx-auto px-5 sm:px-8"><GoldDivider /></div>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-14 sm:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex justify-center mb-4">
              <SectionLabel>Testimonios</SectionLabel>
            </motion.div>
            <SectionTitle accent="clientes">Lo que dicen nuestros</SectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: "María López de Condori", role: "Boda · Sede Centro", text: "Nuestro matrimonio fue absolutamente perfecto. El equipo se encargó de cada detalle con profesionalismo impresionante. El contrato fue claro y cumplieron todo al pie de la letra.", stars: 5 },
              { name: "Ing. Carlos Mamani", role: "Congreso Empresarial · Sede Norte", text: "Organizamos nuestro congreso anual aquí. La infraestructura tecnológica y el contrato detallado nos dieron total seguridad. La transparencia de sus reportes es notable.", stars: 5 },
              { name: "Familia Quispe Huanca", role: "Quinceañero · Sede Sur", text: "La fiesta de quinceañero de nuestra hija fue mágica. El catálogo de servicios nos ayudó a elegir exactamente lo que queríamos y el calendario de disponibilidad fue muy útil.", stars: 5 },
            ].map(({ name, role, text, stars }, i) => (
              <motion.div key={name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <Quote size={26} className="text-amber-500/20 mb-4" />
                <p className="text-gray-300 leading-relaxed mb-5" style={{ fontSize: 14 }}>{text}</p>
                <div className="flex gap-0.5 mb-4">{Array.from({ length: stars }).map((_, j) => <Star key={j} size={12} className="text-amber-400 fill-amber-400" />)}</div>
                <GoldDivider className="mb-4" />
                <p className="text-white" style={{ fontSize: 14 }}>{name}</p>
                <p className="text-gray-500" style={{ fontSize: 12 }}>{role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contacto" className="py-14 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex justify-center mb-4">
              <SectionLabel>Contacto</SectionLabel>
            </motion.div>
            <SectionTitle accent="evento">Hablemos de tu</SectionTitle>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4">
              {[
                { icon: Phone, label: "Llámanos", value: "+51 951 234 567", sub: "Lun–Sáb 8am a 8pm" },
                { icon: MessageCircle, label: "WhatsApp", value: "+51 951 234 567", sub: "Respuesta en minutos" },
                { icon: Mail, label: "Correo", value: "info@eventjuliaca.pe", sub: "Respondemos en 24h" },
                { icon: MapPin, label: "Sede Principal", value: "Av. Noriega 245, Centro, Juliaca", sub: "Puno, Perú" },
              ].map(({ icon: Icon, label, value, sub }) => (
                <div key={label} className="flex items-start gap-4 rounded-2xl p-4 group" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 group-hover:bg-amber-500/15 transition-colors shrink-0">
                    <Icon size={17} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-gray-500 mb-0.5" style={{ fontSize: 12 }}>{label}</p>
                    <p className="text-white" style={{ fontSize: 14 }}>{value}</p>
                    <p className="text-gray-600" style={{ fontSize: 12 }}>{sub}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                {[Facebook, Instagram, MessageCircle].map((Icon, i) => (
                  <button key={i} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-gray-500 hover:text-amber-400 hover:border-amber-500/20 hover:bg-amber-500/10 transition-all cursor-pointer">
                    <Icon size={17} />
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="rounded-2xl p-6 sm:p-8" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h3 className="text-white mb-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: 20 }}>Solicitar Cotización</h3>
              <p className="text-gray-500 mb-5" style={{ fontSize: 13 }}>Te contactamos en menos de 2 horas.</p>
              <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-amber-200/60 block mb-1.5" style={{ fontSize: 12 }}>Nombre</label>
                    <input type="text" placeholder="Tu nombre" className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-gray-100 placeholder-gray-600 outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 hover:bg-white/[0.06]" style={{ fontSize: 13 }} />
                  </div>
                  <div>
                    <label className="text-amber-200/60 block mb-1.5" style={{ fontSize: 12 }}>Teléfono</label>
                    <input type="tel" placeholder="+51 ..." className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-gray-100 placeholder-gray-600 outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 hover:bg-white/[0.06]" style={{ fontSize: 13 }} />
                  </div>
                </div>
                <div>
                  <label className="text-amber-200/60 block mb-1.5" style={{ fontSize: 12 }}>Tipo de evento</label>
                  <select className="w-full rounded-xl border border-white/[0.08] bg-gray-900 px-4 py-2.5 text-gray-300 outline-none focus:border-amber-500/50" style={{ fontSize: 13 }}>
                    <option value="">Selecciona el tipo</option>
                    <option>Boda / Matrimonio</option>
                    <option>Quinceañero</option>
                    <option>Cumpleaños</option>
                    <option>Evento Corporativo</option>
                    <option>Conferencia / Congreso</option>
                    <option>Gala / Cena</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-amber-200/60 block mb-1.5" style={{ fontSize: 12 }}>Fecha del evento</label>
                    <input type="date" className="w-full rounded-xl border border-white/[0.08] bg-gray-900 px-4 py-2.5 text-gray-300 outline-none focus:border-amber-500/50" style={{ fontSize: 13 }} />
                  </div>
                  <div>
                    <label className="text-amber-200/60 block mb-1.5" style={{ fontSize: 12 }}>Sede preferida</label>
                    <select className="w-full rounded-xl border border-white/[0.08] bg-gray-900 px-4 py-2.5 text-gray-300 outline-none focus:border-amber-500/50" style={{ fontSize: 13 }}>
                      <option>Cualquiera</option>
                      <option>Event Juliaca Centro</option>
                      <option>Event Juliaca Norte</option>
                      <option>Event Juliaca Sur</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-amber-200/60 block mb-1.5" style={{ fontSize: 12 }}>Mensaje adicional</label>
                  <textarea placeholder="Cuéntanos sobre tu evento..." rows={3} className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-gray-100 placeholder-gray-600 outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 resize-none" style={{ fontSize: 13 }} />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 rounded-xl py-3.5 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:from-amber-400 hover:to-yellow-400 transition-all cursor-pointer flex items-center justify-center gap-2" style={{ fontSize: 14 }}>
                  <CalendarDays size={15} /> Enviar Solicitud <ArrowRight size={14} />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="relative border-t border-white/[0.06] py-10 sm:py-14">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 p-2.5 shadow-lg shadow-amber-500/25">
                  <CalendarDays size={16} className="text-gray-900" />
                </div>
                <span className="text-amber-100" style={{ fontFamily: "'Playfair Display', serif", fontSize: 16 }}>Event Juliaca</span>
              </div>
              <p className="text-gray-500 leading-relaxed mb-3" style={{ fontSize: 12 }}>Empresa líder en gestión de eventos premium en Juliaca, Puno. Tu celebración es nuestra pasión.</p>
              <div className="flex items-center gap-1">{[1,2,3,4,5].map(i => <Star key={i} size={11} className="text-amber-400 fill-amber-400" />)}<span className="text-gray-500 ml-1" style={{ fontSize: 11 }}>4.9/5</span></div>
            </div>
            <div>
              <p className="text-gray-400 mb-3 tracking-wider uppercase" style={{ fontSize: 10 }}>Navegación</p>
              {NAV_LINKS.map(l => (
                <button key={l.id} onClick={() => scrollTo(l.id)} className="block text-gray-500 hover:text-amber-400 transition-colors mb-2 cursor-pointer text-left" style={{ fontSize: 13 }}>{l.label}</button>
              ))}
            </div>
            <div>
              <p className="text-gray-400 mb-3 tracking-wider uppercase" style={{ fontSize: 10 }}>Sedes</p>
              {["Event Juliaca Centro", "Event Juliaca Norte", "Event Juliaca Sur"].map(s => (
                <p key={s} className="text-gray-500 mb-2" style={{ fontSize: 13 }}>{s}</p>
              ))}
            </div>
            <div>
              <p className="text-gray-400 mb-3 tracking-wider uppercase" style={{ fontSize: 10 }}>Contacto</p>
              <div className="space-y-2">
                {[{ icon: Phone, val: "+51 951 234 567" }, { icon: Mail, val: "info@eventjuliaca.pe" }, { icon: MapPin, val: "Juliaca, Puno, Perú" }].map(({ icon: Icon, val }) => (
                  <div key={val} className="flex items-center gap-2 text-gray-500" style={{ fontSize: 12 }}>
                    <Icon size={12} className="text-amber-500/50 shrink-0" />{val}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                {[Facebook, Instagram, MessageCircle].map((Icon, i) => (
                  <button key={i} className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-2 text-gray-500 hover:text-amber-400 hover:border-amber-500/20 hover:bg-amber-500/10 transition-all cursor-pointer"><Icon size={14} /></button>
                ))}
              </div>
            </div>
          </div>
          <GoldDivider className="mb-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-600" style={{ fontSize: 11 }}>© 2025 Event Juliaca. Todos los derechos reservados.</p>
            <div className="flex items-center gap-2"><Sparkles size={11} className="text-amber-500/40" /><span className="text-gray-600" style={{ fontSize: 11 }}>Diseñado con pasión en Juliaca, Perú</span></div>
            <button onClick={onLoginClick} className="text-amber-500/50 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5" style={{ fontSize: 11 }}>
              <Crown size={11} /> Acceso Administrador
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
