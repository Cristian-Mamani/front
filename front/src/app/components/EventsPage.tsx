import React, { useState } from "react";
import { motion } from "motion/react";
import { useAppState } from "./AppContext";
import { Card, Button, Input, Select, StatusBadge, Modal, PageHeader } from "./ui-shared";
import { Plus, AlertTriangle, Users, MapPin, Clock, Phone, User, CalendarDays, Tag } from "lucide-react";
import { toast } from "sonner";

export function EventsPage({ onPay }: { onPay: (eventId: string) => void }) {
  const { events, sedes, addEvent, addTimeBlock, isSlotFree, getRoomById, getSedeById } = useAppState();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [selectedSede, setSelectedSede] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  const filteredRooms = selectedSede ? sedes.find((s) => s.id === selectedSede)?.rooms || [] : [];
  const chosenRoom = getRoomById(selectedRoom);
  const startHour = startTime ? parseInt(startTime.split(":")[0]) : 0;
  const endHour = endTime ? parseInt(endTime.split(":")[0]) : 0;
  const slotConflict = selectedRoom && date && startTime && endTime && !isSlotFree(selectedRoom, date, startHour, endHour);

  const resetForm = () => {
    setName(""); setDate(""); setStartTime(""); setEndTime("");
    setType(""); setPrice(""); setSelectedSede(""); setSelectedRoom("");
    setClientName(""); setClientPhone("");
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (slotConflict) { toast.error("Ese horario ya está ocupado"); return; }
    if (chosenRoom && chosenRoom.status !== "available") { toast.error("El local no está disponible"); return; }
    setSubmitting(true);
    try {
      await addEvent({
        name, date, startTime, endTime,
        type: type as "free" | "paid",
        price: type === "paid" ? Number(price) : 0,
        sedeId: selectedSede, roomId: selectedRoom,
        participants: 0, status: "upcoming",
        clientName, clientPhone,
      });
      toast.success("Evento registrado exitosamente ✅");
      resetForm(); setShowForm(false);
    } catch {
      // El error ya fue mostrado por addEvent con toast.error
    } finally {
      setSubmitting(false);
    }
  };

  const statusColors = {
    active: { bar: "from-emerald-500 to-emerald-400", badge: "bg-emerald-500/[0.08] text-emerald-400 border-emerald-500/20", label: "Activo" },
    upcoming: { bar: "from-amber-500 to-yellow-400", badge: "bg-amber-500/[0.08] text-amber-400 border-amber-500/20", label: "Próximo" },
    completed: { bar: "from-gray-600 to-gray-500", badge: "bg-white/[0.04] text-gray-400 border-white/[0.08]", label: "Completado" },
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader title="Eventos" subtitle="Registra y gestiona los eventos de tus locales">
        <Button onClick={() => setShowForm(true)}><Plus size={18} /> Registrar Evento</Button>
      </PageHeader>

      <Modal open={showForm} onClose={() => { setShowForm(false); resetForm(); }} title="Registrar Nuevo Evento">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input label="Nombre del Evento" placeholder="Ej: Congreso de Tecnología" value={name} onChange={(e) => setName(e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Fecha" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <div className="grid grid-cols-2 gap-2">
              <Input label="Inicio" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
              <Input label="Fin" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Cliente" placeholder="Nombre del cliente" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
            <Input label="Teléfono" placeholder="951 000 000" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
          </div>
          <Select label="Tipo de Evento" value={type} onChange={(e) => setType(e.target.value)} options={[{ value: "free", label: "Gratuito" }, { value: "paid", label: "De pago" }]} />
          {type === "paid" && <Input label="Precio (S/)" type="number" placeholder="100" value={price} onChange={(e) => setPrice(e.target.value)} />}
          <Select label="Sede" value={selectedSede} onChange={(e) => { setSelectedSede(e.target.value); setSelectedRoom(""); }} options={sedes.map((s) => ({ value: s.id, label: s.name }))} />
          {selectedSede && (
            <Select label="Local" value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} options={filteredRooms.map((r) => ({ value: r.id, label: `${r.name} — Cap: ${r.capacity} pers.` }))} />
          )}
          {chosenRoom && chosenRoom.status !== "available" && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-red-300">
              <AlertTriangle size={20} className="shrink-0 mt-0.5" />
              <div>
                <p>Este local NO está disponible.</p>
                <p className="mt-1">Estado actual: <StatusBadge status={chosenRoom.status} /></p>
                <p className="mt-1 text-red-400">Cambia el estado desde "Mis Locales" antes de registrar.</p>
              </div>
            </div>
          )}
          {slotConflict && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/[0.08] border border-amber-500/20 text-amber-300">
              <AlertTriangle size={20} className="shrink-0 mt-0.5" />
              <p>Ese horario ya tiene una reserva en este local. Revisa "Horarios".</p>
            </div>
          )}
          <Button type="submit" className="w-full mt-2" disabled={submitting || !name || !date || !selectedRoom || (chosenRoom?.status !== "available") || !!slotConflict}>
            {submitting ? "Registrando..." : "Registrar Evento"}
          </Button>
        </form>
      </Modal>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {events.map((ev, i) => {
          const sede = getSedeById(ev.sedeId);
          const room = getRoomById(ev.roomId);
          const sc = statusColors[ev.status];
          return (
            <motion.div key={ev.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="overflow-hidden group relative" hover>
                <div className={`h-1 bg-gradient-to-r ${sc.bar}`} />
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                <div className="p-5 space-y-3 relative">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-amber-100 leading-tight group-hover:text-amber-50 transition-colors">{ev.name}</h3>
                    <span className={`rounded-full px-3 py-1 shrink-0 border ${sc.badge}`}>{sc.label}</span>
                  </div>
                  <div className="space-y-2 text-gray-400">
                    <p className="flex items-center gap-2"><Clock size={14} className="text-gray-600" /> {ev.date} · {ev.startTime} - {ev.endTime}</p>
                    <p className="flex items-center gap-2"><MapPin size={14} className="text-gray-600" /> {sede?.name} — {room?.name}</p>
                    <p className="flex items-center gap-2"><User size={14} className="text-gray-600" /> {ev.clientName}</p>
                    <p className="flex items-center gap-2"><Phone size={14} className="text-gray-600" /> {ev.clientPhone}</p>
                    <p className="flex items-center gap-2"><Users size={14} className="text-gray-600" /> {ev.participants} participantes</p>
                  </div>
                  <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between">
                    <span className={`flex items-center gap-1.5 ${ev.type === "paid" ? "text-amber-400" : "text-gray-500"}`}>
                      <Tag size={14} />
                      {ev.type === "paid" ? `S/ ${ev.price}` : "Gratis"}
                    </span>
                    <div className="flex gap-2">
                      {ev.type === "paid" && <Button variant="outline" size="sm" onClick={() => onPay(ev.id)}>Pagar</Button>}
                      <Button variant="ghost" size="sm">Detalles</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
