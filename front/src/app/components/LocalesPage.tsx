import React, { useState } from "react";
import { motion } from "motion/react";
import { useAppState } from "./AppContext";
import { Card, StatusBadge, Button, Modal, Select, PageHeader, Input } from "./ui-shared";
import { Users, Settings, CheckCircle, DoorOpen, Plus } from "lucide-react";
import type { RoomStatus } from "../data/store";
import { toast } from "sonner";

export function LocalesPage() {
  const { sedes, updateRoomStatus, addRoom } = useAppState();
  const [filterSede, setFilterSede] = useState("all");
  const [editingRoom, setEditingRoom] = useState<{ id: string; name: string; sedeName: string; status: RoomStatus } | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newRoom, setNewRoom] = useState({ sedeId: "", name: "", capacity: "", status: "available" as RoomStatus });

  const filteredSedes = filterSede === "all" ? sedes : sedes.filter((s) => s.id === filterSede);

  const handleStatusChange = () => {
    if (editingRoom && newStatus) {
      updateRoomStatus(editingRoom.id, newStatus as RoomStatus);
      toast.success(`${editingRoom.name} ahora está: ${newStatus === "available" ? "Disponible" : newStatus === "occupied" ? "Ocupado" : "En Mantenimiento"}`);
      setEditingRoom(null); setNewStatus("");
    }
  };

  const handleCreateRoom = () => {
    if (!newRoom.sedeId || !newRoom.name || !newRoom.capacity) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    const capacity = parseInt(newRoom.capacity);
    if (isNaN(capacity) || capacity <= 0) {
      toast.error("La capacidad debe ser un número mayor a 0");
      return;
    }
    addRoom(newRoom.sedeId, newRoom.name, capacity, newRoom.status);
    const sedeName = sedes.find(s => s.id === newRoom.sedeId)?.name || "";
    toast.success(`Local "${newRoom.name}" creado exitosamente en ${sedeName}`);
    setIsCreating(false);
    setNewRoom({ sedeId: "", name: "", capacity: "", status: "available" });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader title="Mis Locales" subtitle="Cambia el estado de tus salones y auditorios">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
          <div className="flex gap-2 flex-wrap flex-1">
            {[{ id: "all", label: "Todas" }, ...sedes.map((s) => ({ id: s.id, label: s.name.replace("Event Juliaca ", "") }))].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterSede(f.id)}
                className={`px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer border ${
                  filterSede === f.id
                    ? "bg-amber-500/[0.12] text-amber-400 border-amber-500/20 shadow-sm shadow-amber-500/10"
                    : "bg-white/[0.04] text-gray-400 border-white/[0.08] hover:bg-white/[0.08] hover:text-gray-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <Button onClick={() => setIsCreating(true)} className="whitespace-nowrap">
            <Plus size={18} /> Crear Nuevo Local
          </Button>
        </div>
      </PageHeader>

      <Modal open={!!editingRoom} onClose={() => { setEditingRoom(null); setNewStatus(""); }} title="Cambiar Estado del Local">
        {editingRoom && (
          <div className="space-y-5">
            <div className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
              <p className="text-amber-100 flex items-center gap-2"><DoorOpen size={16} className="text-amber-400" />{editingRoom.name}</p>
              <p className="text-gray-500 mt-1">{editingRoom.sedeName}</p>
              <div className="mt-2"><span className="text-gray-400 mr-2">Estado actual:</span><StatusBadge status={editingRoom.status} /></div>
            </div>
            <Select label="Nuevo Estado" value={newStatus} onChange={(e) => setNewStatus(e.target.value)} options={[
              { value: "available", label: "Disponible — Listo para reservar" },
              { value: "occupied", label: "Ocupado — En uso" },
              { value: "maintenance", label: "Mantenimiento — No disponible" },
            ]} />
            {newStatus && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border ${
                  newStatus === "available" ? "bg-emerald-500/[0.08] border-emerald-500/20 text-emerald-300"
                  : newStatus === "occupied" ? "bg-red-500/[0.08] border-red-500/20 text-red-300"
                  : "bg-amber-500/[0.08] border-amber-500/20 text-amber-300"
                }`}
              >
                {newStatus === "available" && "El local quedará disponible para nuevas reservas."}
                {newStatus === "occupied" && "El local se marcará como ocupado. No se podrán hacer nuevas reservas."}
                {newStatus === "maintenance" && "El local se marcará en mantenimiento. No se podrán hacer reservas hasta que lo cambies."}
              </motion.div>
            )}
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => { setEditingRoom(null); setNewStatus(""); }}>Cancelar</Button>
              <Button className="flex-1" disabled={!newStatus} onClick={handleStatusChange}><CheckCircle size={18} /> Guardar</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={isCreating} onClose={() => { setIsCreating(false); setNewRoom({ sedeId: "", name: "", capacity: "", status: "available" }); }} title="Crear Nuevo Local">
        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-r from-amber-500/[0.08] to-yellow-500/[0.08] rounded-xl border border-amber-500/20"
          >
            <p className="text-amber-200 flex items-center gap-2">
              <DoorOpen size={16} className="text-amber-400" />
              Configura los datos del nuevo local
            </p>
          </motion.div>

          <Select
            label="Sede"
            value={newRoom.sedeId}
            onChange={(e) => setNewRoom({ ...newRoom, sedeId: e.target.value })}
            options={sedes.map(s => ({ value: s.id, label: s.name }))}
          />

          <Input
            label="Nombre del Local"
            placeholder="Ej: Salón C, Sala VIP, etc."
            value={newRoom.name}
            onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
          />

          <Input
            label="Capacidad"
            type="number"
            placeholder="Número de personas"
            value={newRoom.capacity}
            onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
            min="1"
          />

          <Select
            label="Estado Inicial"
            value={newRoom.status}
            onChange={(e) => setNewRoom({ ...newRoom, status: e.target.value as RoomStatus })}
            options={[
              { value: "available", label: "Disponible — Listo para reservar" },
              { value: "occupied", label: "Ocupado — En uso" },
              { value: "maintenance", label: "Mantenimiento — No disponible" },
            ]}
          />

          {newRoom.name && newRoom.capacity && newRoom.sedeId && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]"
            >
              <p className="text-gray-400 mb-2">Vista previa:</p>
              <p className="text-amber-100 flex items-center gap-2">
                <DoorOpen size={16} className="text-amber-400" />
                {newRoom.name}
              </p>
              <p className="text-gray-500 mt-1">{sedes.find(s => s.id === newRoom.sedeId)?.name}</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-gray-400">Capacidad: {newRoom.capacity} personas</span>
                <StatusBadge status={newRoom.status} />
              </div>
            </motion.div>
          )}

          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => { setIsCreating(false); setNewRoom({ sedeId: "", name: "", capacity: "", status: "available" }); }}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              disabled={!newRoom.sedeId || !newRoom.name || !newRoom.capacity}
              onClick={handleCreateRoom}
            >
              <CheckCircle size={18} /> Crear Local
            </Button>
          </div>
        </div>
      </Modal>

      {filteredSedes.map((sede) => (
        <div key={sede.id}>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-amber-100/80" style={{ fontFamily: "'Playfair Display', serif" }}>{sede.name}</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-amber-500/15 to-transparent" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {sede.rooms.map((room, i) => (
              <motion.div key={room.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <Card className="p-6 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${
                    room.status === "available" ? "via-emerald-500/30" : room.status === "occupied" ? "via-red-500/30" : "via-amber-500/30"
                  } to-transparent`} />
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-xl p-2.5 ${
                        room.status === "available" ? "bg-emerald-500/10 text-emerald-400" : room.status === "occupied" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"
                      }`}><DoorOpen size={18} /></div>
                      <div>
                        <h3 className="text-amber-100">{room.name}</h3>
                        <p className="text-gray-600">{sede.name.replace("Event Juliaca ", "")}</p>
                      </div>
                    </div>
                    <StatusBadge status={room.status} />
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 mb-4 bg-white/[0.02] rounded-lg p-2.5 border border-white/[0.04]">
                    <Users size={15} className="text-amber-500/50" />
                    <span>Capacidad: {room.capacity} personas</span>
                  </div>
                  <div className="pt-4 border-t border-white/[0.05] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${room.status === "available" ? "bg-emerald-400 shadow-sm shadow-emerald-400/50" : room.status === "occupied" ? "bg-red-400 shadow-sm shadow-red-400/50" : "bg-amber-400 shadow-sm shadow-amber-400/50"}`} />
                      <span className="text-gray-500">{room.status === "available" ? "Listo" : room.status === "occupied" ? "En uso" : "Mantenimiento"}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => { setEditingRoom({ id: room.id, name: room.name, sedeName: sede.name, status: room.status }); setNewStatus(""); }}>
                      <Settings size={14} /> Cambiar
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
