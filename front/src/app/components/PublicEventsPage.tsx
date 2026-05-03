import React, { useState } from "react";
import { motion } from "motion/react";
import { useAppState } from "./AppContext";
import { Card, PageHeader } from "./ui-shared";
import { Calendar, MapPin, Users, DoorOpen, Phone, Clock, Ticket, AlertCircle, CheckCircle2, TrendingUp, Search } from "lucide-react";

export function PublicEventsPage() {
  const { events, sedes, getAllRooms } = useAppState();
  const [filterType, setFilterType] = useState<"all" | "free" | "paid">("all");
  const [filterSede, setFilterSede] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar solo eventos activos y próximos
  const publicEvents = events.filter((e) => e.status === "active" || e.status === "upcoming");

  const filtered = publicEvents.filter((e) => {
    const matchesType = filterType === "all" || e.type === filterType;
    const matchesSede = filterSede === "all" || e.sedeId === filterSede;
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSede && matchesSearch;
  });

  const getEventDetails = (event: typeof events[0]) => {
    const sede = sedes.find((s) => s.id === event.sedeId);
    const room = getAllRooms().find((r) => r.id === event.roomId);
    const availableSlots = room ? room.capacity - event.participants : 0;
    const percentFull = room ? Math.round((event.participants / room.capacity) * 100) : 0;

    return { sede, room, availableSlots, percentFull };
  };

  const totalCapacity = filtered.reduce((sum, e) => {
    const room = getAllRooms().find((r) => r.id === e.roomId);
    return sum + (room?.capacity || 0);
  }, 0);

  const totalParticipants = filtered.reduce((sum, e) => sum + e.participants, 0);
  const availableCapacity = totalCapacity - totalParticipants;

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Eventos Disponibles"
        subtitle="Consulta los eventos próximos y cupos disponibles"
        icon={<><Ticket size={16} /><span>Vista Pública</span></>}
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="rounded-xl p-3 bg-amber-500/10 text-amber-400">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-gray-400">Eventos Disponibles</p>
                <p className="text-2xl text-amber-100" style={{ fontFamily: "'Playfair Display', serif" }}>{filtered.length}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="rounded-xl p-3 bg-emerald-500/10 text-emerald-400">
                <Users size={20} />
              </div>
              <div>
                <p className="text-gray-400">Cupos Disponibles</p>
                <p className="text-2xl text-emerald-100" style={{ fontFamily: "'Playfair Display', serif" }}>{availableCapacity}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="rounded-xl p-3 bg-blue-500/10 text-blue-400">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-gray-400">Total Inscritos</p>
                <p className="text-2xl text-blue-100" style={{ fontFamily: "'Playfair Display', serif" }}>{totalParticipants}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-gray-100 placeholder-gray-600 outline-none transition-all duration-200 backdrop-blur-sm focus:ring-2 focus:border-amber-500/50 focus:ring-amber-500/20 hover:bg-white/[0.06]"
            />
          </div>

          {/* Type Filter */}
          <div className="flex gap-2 flex-wrap">
            {[
              { id: "all", label: "Todos", count: publicEvents.length },
              { id: "free", label: "Gratuitos", count: publicEvents.filter(e => e.type === "free").length },
              { id: "paid", label: "Pagados", count: publicEvents.filter(e => e.type === "paid").length },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id as typeof filterType)}
                className={`px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer border ${
                  filterType === f.id
                    ? "bg-amber-500/[0.12] text-amber-400 border-amber-500/20 shadow-sm shadow-amber-500/10"
                    : "bg-white/[0.04] text-gray-400 border-white/[0.08] hover:bg-white/[0.08] hover:text-gray-300"
                }`}
              >
                {f.label} <span className="text-gray-600">({f.count})</span>
              </button>
            ))}
          </div>

          {/* Sede Filter */}
          <select
            value={filterSede}
            onChange={(e) => setFilterSede(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-gray-100 outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 backdrop-blur-sm hover:bg-white/[0.06] cursor-pointer"
          >
            <option value="all" className="bg-gray-900">Todas las sedes</option>
            {sedes.map((s) => (
              <option key={s.id} value={s.id} className="bg-gray-900">{s.name}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {filtered.map((event, i) => {
          const { sede, room, availableSlots, percentFull } = getEventDetails(event);
          const isFull = availableSlots <= 0;
          const isAlmostFull = availableSlots > 0 && availableSlots <= 10;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="overflow-hidden h-full">
                {/* Header with gradient */}
                <div className="relative p-6 bg-gradient-to-br from-amber-500/[0.08] to-yellow-500/[0.05] border-b border-white/[0.06]">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <h3 className="text-amber-100 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {event.name}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {event.type === "free" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            <CheckCircle2 size={12} /> Gratis
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            <Ticket size={12} /> S/ {event.price}
                          </span>
                        )}
                        {event.status === "upcoming" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20">
                            <Clock size={12} /> Próximamente
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Date & Time */}
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar size={16} className="text-amber-500/60" />
                    <span>{new Date(event.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock size={16} className="text-amber-500/60" />
                    <span>{event.startTime} - {event.endTime}</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-2 text-gray-300">
                    <MapPin size={16} className="text-amber-500/60 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p>{sede?.name}</p>
                      <p className="text-gray-500">{sede?.address}</p>
                    </div>
                  </div>

                  {/* Room */}
                  <div className="flex items-center gap-2 text-gray-300">
                    <DoorOpen size={16} className="text-amber-500/60" />
                    <span>{room?.name}</span>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

                  {/* Capacity Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Capacidad del local:</span>
                      <span className="text-gray-200">{room?.capacity} personas</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Inscritos actualmente:</span>
                      <span className="text-amber-300">{event.participants} personas</span>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Ocupación:</span>
                        <span className={`${percentFull >= 90 ? "text-red-400" : percentFull >= 70 ? "text-amber-400" : "text-emerald-400"}`}>
                          {percentFull}%
                        </span>
                      </div>
                      <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentFull}%` }}
                          transition={{ duration: 0.8, delay: i * 0.08 + 0.2 }}
                          className={`h-full rounded-full ${
                            percentFull >= 90 ? "bg-gradient-to-r from-red-500 to-red-400" :
                            percentFull >= 70 ? "bg-gradient-to-r from-amber-500 to-yellow-400" :
                            "bg-gradient-to-r from-emerald-500 to-emerald-400"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Available Slots */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08 + 0.3 }}
                      className={`p-4 rounded-xl border ${
                        isFull
                          ? "bg-red-500/[0.08] border-red-500/20"
                          : isAlmostFull
                          ? "bg-amber-500/[0.08] border-amber-500/20"
                          : "bg-emerald-500/[0.08] border-emerald-500/20"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isFull ? (
                          <>
                            <AlertCircle size={18} className="text-red-400 shrink-0" />
                            <div className="flex-1">
                              <p className="text-red-300 font-medium">¡Evento lleno!</p>
                              <p className="text-red-400/70 text-sm">No hay cupos disponibles</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <Users size={18} className={isAlmostFull ? "text-amber-400" : "text-emerald-400"} />
                            <div className="flex-1">
                              <p className={`font-medium ${isAlmostFull ? "text-amber-300" : "text-emerald-300"}`}>
                                {availableSlots} {availableSlots === 1 ? "cupo disponible" : "cupos disponibles"}
                              </p>
                              {isAlmostFull && (
                                <p className="text-amber-400/70 text-sm">¡Últimos lugares!</p>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* Contact Info */}
                  <div className="pt-3 border-t border-white/[0.05]">
                    <p className="text-gray-400 mb-2 flex items-center gap-2">
                      <Phone size={14} className="text-amber-500/60" />
                      Información e inscripciones:
                    </p>
                    <p className="text-amber-300">{sede?.phone}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 mb-4">
            <Calendar size={32} className="text-amber-500/50" />
          </div>
          <p className="text-gray-400">No se encontraron eventos con los filtros seleccionados</p>
        </motion.div>
      )}
    </div>
  );
}
