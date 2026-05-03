import React, { useState } from "react";
import { motion } from "motion/react";
import { useAppState } from "./AppContext";
import { Card, Button, Input, Select, Modal, PageHeader, SectionTitle } from "./ui-shared";
import { ChevronLeft, ChevronRight, Lock, Wrench, CalendarDays, Trash2 } from "lucide-react";
import { toast } from "sonner";

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7);

function getWeekDates(baseDate: Date): { date: string; label: string }[] {
  const dayOfWeek = baseDate.getDay();
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { date: d.toISOString().split("T")[0], label: `${days[i]} ${d.getDate()}` };
  });
}

export function AvailabilityPage() {
  const { sedes, timeBlocks, addTimeBlock, removeTimeBlock, isSlotFree } = useAppState();
  const [selectedSede, setSelectedSede] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockRoom, setBlockRoom] = useState("");
  const [blockDate, setBlockDate] = useState("");
  const [blockStart, setBlockStart] = useState("");
  const [blockEnd, setBlockEnd] = useState("");
  const [blockLabel, setBlockLabel] = useState("");
  const [blockType, setBlockType] = useState("blocked");

  // Si no hay sede seleccionada pero ya cargaron las sedes, elegir la primera
  if (!selectedSede && sedes.length > 0) {
    setSelectedSede(sedes[0].id);
  }

  const sede = sedes.find((s) => s.id === selectedSede);
  const rooms = sede?.rooms || [];
  const baseDate = new Date(2026, 3, 20);
  baseDate.setDate(baseDate.getDate() + weekOffset * 7);
  const weekDates = getWeekDates(baseDate);
  const [selectedDay, setSelectedDay] = useState(0);
  const currentDate = weekDates[selectedDay]?.date;

  if (!sede && sedes.length === 0) {
    return <div className="p-8 text-center text-gray-500">Cargando sedes...</div>;
  }

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    const sh = parseInt(blockStart.split(":")[0]);
    const eh = parseInt(blockEnd.split(":")[0]);
    if (!isSlotFree(blockRoom, blockDate, sh, eh)) {
      toast.error("Ese horario ya está ocupado"); return;
    }
    addTimeBlock({
      id: "tb" + Date.now(), roomId: blockRoom, date: blockDate,
      startHour: sh, endHour: eh,
      label: blockLabel || (blockType === "blocked" ? "Reservado" : "Mantenimiento"),
      type: blockType as "blocked" | "maintenance",
    });
    toast.success("Horario bloqueado correctamente");
    setShowBlockModal(false);
    setBlockRoom(""); setBlockDate(""); setBlockStart(""); setBlockEnd(""); setBlockLabel("");
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader title="Horarios y Disponibilidad" subtitle="Controla qué horarios están libres u ocupados" icon={<><CalendarDays size={16} /><span>Calendario</span></>}>
        <Button onClick={() => setShowBlockModal(true)}><Lock size={18} /> Bloquear Horario</Button>
      </PageHeader>

      <Modal open={showBlockModal} onClose={() => setShowBlockModal(false)} title="Bloquear Horario">
        <form className="space-y-4" onSubmit={handleAddBlock}>
          <Select label="Sede" value={selectedSede} onChange={(e) => setSelectedSede(e.target.value)} options={sedes.map((s) => ({ value: s.id, label: s.name }))} />
          <Select label="Local" value={blockRoom} onChange={(e) => setBlockRoom(e.target.value)} options={rooms.map((r) => ({ value: r.id, label: r.name }))} />
          <Input label="Fecha" type="date" value={blockDate} onChange={(e) => setBlockDate(e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Hora Inicio" type="time" value={blockStart} onChange={(e) => setBlockStart(e.target.value)} required />
            <Input label="Hora Fin" type="time" value={blockEnd} onChange={(e) => setBlockEnd(e.target.value)} required />
          </div>
          <Select label="Tipo de Bloqueo" value={blockType} onChange={(e) => setBlockType(e.target.value)} options={[
            { value: "blocked", label: "Reservado / Ocupado" },
            { value: "maintenance", label: "Mantenimiento / Limpieza" },
          ]} />
          <Input label="Motivo (opcional)" placeholder="Ej: Limpieza, Reserva privada..." value={blockLabel} onChange={(e) => setBlockLabel(e.target.value)} />
          <Button type="submit" className="w-full">Bloquear Horario</Button>
        </form>
      </Modal>

      {/* Sede tabs */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {sedes.map((s) => (
          <button key={s.id} onClick={() => setSelectedSede(s.id)} className={`px-4 py-2 rounded-xl transition cursor-pointer border ${
            selectedSede === s.id ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
          }`}>{s.name}</button>
        ))}
      </div>

      <Card className="p-4 sm:p-6 overflow-x-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-amber-100 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}><CalendarDays size={20} className="text-amber-400" /> {sede?.name || ""}</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => { setWeekOffset(weekOffset - 1); setSelectedDay(0); }} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 cursor-pointer"><ChevronLeft size={20} /></button>
            <span className="px-4 py-1.5 rounded-lg bg-white/5 text-gray-300 min-w-[200px] text-center border border-white/10">{weekDates[0]?.label} — {weekDates[6]?.label}</span>
            <button onClick={() => { setWeekOffset(weekOffset + 1); setSelectedDay(0); }} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 cursor-pointer"><ChevronRight size={20} /></button>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {weekDates.map((wd, i) => {
            const hasBlocks = rooms.some((r) => timeBlocks.some((b) => b.roomId === r.id && b.date === wd.date));
            return (
              <button key={wd.date} onClick={() => setSelectedDay(i)} className={`flex-1 py-3 rounded-xl transition cursor-pointer relative border ${
                selectedDay === i ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-white/[0.03] text-gray-400 border-white/[0.06] hover:bg-white/5"
              }`}>
                {wd.label}
                {hasBlocks && <span className={`absolute top-1 right-1 w-2 h-2 rounded-full ${selectedDay === i ? "bg-amber-400" : "bg-red-400"}`} />}
              </button>
            );
          })}
        </div>

        <div className="flex gap-6 mb-4 text-gray-500 flex-wrap">
          <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/30" /> Libre</span>
          <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-amber-500/20 border border-amber-500/30" /> Evento</span>
          <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-red-500/20 border border-red-500/30" /> Bloqueado</span>
          <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-orange-500/20 border border-orange-500/30" /> Mantenimiento</span>
        </div>

        <div className="min-w-[800px]">
          <div className="grid gap-1" style={{ gridTemplateColumns: `100px repeat(${HOURS.length}, 1fr)` }}>
            <div className="p-2 text-gray-500">Local</div>
            {HOURS.map((h) => <div key={h} className="p-2 text-center text-gray-600">{h}:00</div>)}
          </div>
          {rooms.map((room) => {
            const blocks = timeBlocks.filter((b) => b.roomId === room.id && b.date === currentDate);
            return (
              <div key={room.id} className="grid gap-1 mt-1" style={{ gridTemplateColumns: `100px repeat(${HOURS.length}, 1fr)` }}>
                <div className="p-2 rounded-lg bg-white/[0.03] text-gray-300 flex items-center border border-white/[0.04]">{room.name}</div>
                {HOURS.map((h) => {
                  const block = blocks.find((b) => h >= b.startHour && h < b.endHour);
                  if (block) {
                    const isStart = h === block.startHour;
                    const colors = block.type === "event"
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                      : block.type === "maintenance"
                      ? "bg-orange-500/10 border-orange-500/20 text-orange-300"
                      : "bg-red-500/10 border-red-500/20 text-red-300";
                    return (
                      <div key={h} className={`p-1 rounded-lg border ${colors} flex items-center justify-center overflow-hidden relative group`}>
                        {isStart && <span className="truncate">{block.label}</span>}
                        {block.type !== "event" && isStart && (
                          <button onClick={() => { removeTimeBlock(block.id); toast.success("Eliminado"); }} className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 bg-gray-800 rounded-full p-0.5 shadow cursor-pointer">
                            <Trash2 size={12} className="text-red-400" />
                          </button>
                        )}
                      </div>
                    );
                  }
                  return <div key={h} className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10" />;
                })}
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <h3 className="text-amber-100 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Detalle: {weekDates[selectedDay]?.label}</h3>
        {rooms.map((room) => {
          const blocks = timeBlocks.filter((b) => b.roomId === room.id && b.date === currentDate);
          return (
            <div key={room.id} className="mb-4">
              <p className="text-gray-300 mb-2">{room.name}</p>
              {blocks.length === 0 ? (
                <p className="text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">Todo el día libre</p>
              ) : (
                <div className="space-y-2">
                  {blocks.map((b) => (
                    <div key={b.id} className={`flex items-center justify-between p-3 rounded-xl border ${
                      b.type === "event" ? "bg-amber-500/10 border-amber-500/20"
                      : b.type === "maintenance" ? "bg-orange-500/10 border-orange-500/20"
                      : "bg-red-500/10 border-red-500/20"
                    }`}>
                      <div className="flex items-center gap-3">
                        {b.type === "event" ? <CalendarDays size={16} className="text-amber-400" />
                        : b.type === "maintenance" ? <Wrench size={16} className="text-orange-400" />
                        : <Lock size={16} className="text-red-400" />}
                        <div>
                          <p className={b.type === "event" ? "text-amber-300" : b.type === "maintenance" ? "text-orange-300" : "text-red-300"}>{b.label}</p>
                          <p className="text-gray-500">{b.startHour}:00 — {b.endHour}:00</p>
                        </div>
                      </div>
                      {b.type !== "event" && (
                        <button onClick={() => { removeTimeBlock(b.id); toast.success("Eliminado"); }} className="text-gray-500 hover:text-red-400 cursor-pointer"><Trash2 size={16} /></button>
                      )}
                    </div>
                  ))}
                  {(() => {
                    const freeSlots: string[] = [];
                    let lastEnd = 7;
                    const sorted = [...blocks].sort((a, b) => a.startHour - b.startHour);
                    for (const block of sorted) {
                      if (block.startHour > lastEnd) freeSlots.push(`${lastEnd}:00 — ${block.startHour}:00`);
                      lastEnd = Math.max(lastEnd, block.endHour);
                    }
                    if (lastEnd < 21) freeSlots.push(`${lastEnd}:00 — 21:00`);
                    return freeSlots.length > 0 && (
                      <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                        <p className="text-emerald-300">Horarios libres:</p>
                        {freeSlots.map((s) => <p key={s} className="text-emerald-400">{s}</p>)}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          );
        })}
      </Card>
    </div>
  );
}