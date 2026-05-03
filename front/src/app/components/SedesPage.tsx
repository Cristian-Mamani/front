import React, { useState } from "react";
import { motion } from "motion/react";
import { useAppState } from "./AppContext";
import { Card, StatusBadge, PageHeader, Button, Modal, Input } from "./ui-shared";
import { MapPin, DoorOpen, Phone, Users, Sparkles, Star, Camera, Plus, CheckCircle, Building2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";

export function SedesPage() {
  const { sedes, addSede } = useAppState();
  const [isCreating, setIsCreating] = useState(false);
  const [newSede, setNewSede] = useState({ name: "", address: "", phone: "", image: "" });

  const handleCreateSede = () => {
    if (!newSede.name || !newSede.address || !newSede.phone) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }
    const defaultImage = "https://images.unsplash.com/photo-1764471444363-e6dc0f9773bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMHZlbnVlJTIwY29uZmVyZW5jZSUyMGhhbGx8ZW58MXx8fHwxNzc2MzU2MDk0fDA&ixlib=rb-4.1.0&q=80&w=1080";
    addSede(newSede.name, newSede.address, newSede.phone, newSede.image || defaultImage);
    toast.success(`Sede "${newSede.name}" creada exitosamente`);
    setIsCreating(false);
    setNewSede({ name: "", address: "", phone: "", image: "" });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader title="Mis Sedes" subtitle="Tus locaciones exclusivas Event Juliaca" icon={<><Sparkles size={16} /><span>Ubicaciones Premium</span></>}>
        <Button onClick={() => setIsCreating(true)}>
          <Plus size={18} /> Crear Nueva Sede
        </Button>
      </PageHeader>

      <Modal open={isCreating} onClose={() => { setIsCreating(false); setNewSede({ name: "", address: "", phone: "", image: "" }); }} title="Crear Nueva Sede">
        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-r from-amber-500/[0.08] to-yellow-500/[0.08] rounded-xl border border-amber-500/20"
          >
            <p className="text-amber-200 flex items-center gap-2">
              <Building2 size={16} className="text-amber-400" />
              Agrega una nueva sede a Event Juliaca
            </p>
          </motion.div>

          <Input
            label="Nombre de la Sede"
            placeholder="Ej: Event Juliaca Este"
            value={newSede.name}
            onChange={(e) => setNewSede({ ...newSede, name: e.target.value })}
          />

          <Input
            label="Dirección"
            placeholder="Ej: Av. Principal 123, Juliaca"
            value={newSede.address}
            onChange={(e) => setNewSede({ ...newSede, address: e.target.value })}
          />

          <Input
            label="Teléfono"
            placeholder="Ej: 951 234 567"
            value={newSede.phone}
            onChange={(e) => setNewSede({ ...newSede, phone: e.target.value })}
          />

          <Input
            label="URL de Imagen (Opcional)"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={newSede.image}
            onChange={(e) => setNewSede({ ...newSede, image: e.target.value })}
          />

          {newSede.name && newSede.address && newSede.phone && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]"
            >
              <p className="text-gray-400 mb-2">Vista previa:</p>
              <div className="flex items-start gap-3">
                <div className="rounded-xl p-2.5 bg-amber-500/10">
                  <Building2 size={18} className="text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-amber-100 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{newSede.name}</h3>
                  <p className="text-gray-400 flex items-center gap-2 mb-1">
                    <MapPin size={13} className="text-amber-500/50" />
                    {newSede.address}
                  </p>
                  <p className="text-gray-400 flex items-center gap-2">
                    <Phone size={13} className="text-amber-500/50" />
                    {newSede.phone}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => { setIsCreating(false); setNewSede({ name: "", address: "", phone: "", image: "" }); }}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              disabled={!newSede.name || !newSede.address || !newSede.phone}
              onClick={handleCreateSede}
            >
              <CheckCircle size={18} /> Crear Sede
            </Button>
          </div>
        </div>
      </Modal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {sedes.map((sede, i) => {
          const avail = sede.rooms.filter((r) => r.status === "available").length;
          return (
            <motion.div key={sede.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12, duration: 0.5 }}>
              <Card className="overflow-hidden group" hover>
                <div className="relative overflow-hidden">
                  <ImageWithFallback src={sede.image} alt={sede.name} className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
                  <div className="absolute top-3 right-3 bg-gray-950/70 backdrop-blur-md rounded-full px-3 py-1 border border-white/[0.08] flex items-center gap-1.5 text-amber-400">
                    <Camera size={12} /> <span style={{ fontSize: 12 }}>{sede.rooms.length} locales</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-2 text-amber-400 mb-1.5">
                      <div className="h-px w-5 bg-amber-400/50" />
                      <span className="tracking-widest uppercase" style={{ fontSize: 10 }}>{avail} de {sede.rooms.length} disponibles</span>
                    </div>
                    <h3 className="text-white text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>{sede.name}</h3>
                  </div>
                </div>
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="space-y-2.5 text-gray-400">
                    <p className="flex items-center gap-2.5"><MapPin size={15} className="text-amber-500/50 shrink-0" /> {sede.address}</p>
                    <p className="flex items-center gap-2.5"><Phone size={15} className="text-amber-500/50 shrink-0" /> {sede.phone}</p>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                  <div className="space-y-2">
                    {sede.rooms.map((room, ri) => (
                      <motion.div
                        key={room.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.12 + ri * 0.06 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-200"
                      >
                        <div className="flex items-center gap-2.5">
                          <DoorOpen size={14} className="text-gray-600" />
                          <span className="text-gray-200">{room.name}</span>
                          <span className="text-gray-600 flex items-center gap-1"><Users size={12} />{room.capacity}</span>
                        </div>
                        <StatusBadge status={room.status} />
                      </motion.div>
                    ))}
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
