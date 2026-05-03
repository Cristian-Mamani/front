import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  sedesApi, salasApi, eventosApi, bloquesApi,
  type ApiSede, type ApiSala, type ApiEvento, type ApiBloque,
} from "../services/api";
import { toast } from "sonner";

// ── Re-exportamos los tipos de la API como alias del front ──
export type { ApiSede as Sede, ApiSala as Room, ApiEvento as EventItem, ApiBloque as TimeBlock };

interface NewEventInput {
  id?: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  type: "free" | "paid";
  price: number;
  sedeId: string;
  roomId: string;
  participants?: number;
  status?: string;
  clientName?: string;
  clientPhone?: string;
}

interface NewBlockInput {
  id?: string;
  roomId: string;
  date: string;
  startHour: number;
  endHour: number;
  label?: string;
  eventId?: string;
  type?: string;
}

interface AppState {
  sedes:       ApiSede[];
  salas:       ApiSala[];
  events:      ApiEvento[];
  timeBlocks:  ApiBloque[];
  loading:     boolean;
  refetchAll:  () => Promise<void>;
  addEvent:    (data: NewEventInput) => Promise<void>;
  addTimeBlock:(data: NewBlockInput) => Promise<void>;
  // Helpers compatibles con el código existente del front
  getAllRooms:      () => ApiSala[];
  getSedeById:     (id: string | number) => ApiSede | undefined;
  getRoomById:     (id: string | number) => ApiSala | undefined;
  getBlocksForRoom:(roomId: string | number, date: string) => ApiBloque[];
  isSlotFree:      (roomId: string | number, date: string, start: number, end: number, excludeId?: string | number) => boolean;
}

const Ctx = createContext<AppState>(null!);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sedes,      setSedes]      = useState<ApiSede[]>([]);
  const [salas,      setSalas]      = useState<ApiSala[]>([]);
  const [events,     setEvents]     = useState<ApiEvento[]>([]);
  const [timeBlocks, setTimeBlocks] = useState<ApiBloque[]>([]);
  const [loading,    setLoading]    = useState(false);

  const refetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [apiSedes, apiSalas, apiEvents, apiBlocks] = await Promise.all([
        sedesApi.listar(),
        salasApi.listar(),
        eventosApi.listar(),
        bloquesApi.listar(),
      ]);

      // Mapear campos de API (español) a campos de Front (inglés)
      const mappedSedes = apiSedes.map(s => ({
        id: String(s.id),
        name: s.nombre || "",
        address: s.direccion || "",
        phone: s.telefono || "",
        image: s.imagen_url || "",
        rooms: apiSalas.filter(r => r.sede_id === s.id).map(r => ({
          id: String(r.id),
          name: r.nombre || "",
          sedeId: String(r.sede_id),
          capacity: r.capacidad || 0,
          status: r.estado === "disponible" ? "available" : r.estado === "ocupada" ? "occupied" : "maintenance"
        }))
      }));

      const mappedSalas = apiSalas.map(r => ({
        id: String(r.id),
        name: r.nombre || "",
        sedeId: String(r.sede_id),
        capacity: r.capacidad || 0,
        status: r.estado === "disponible" ? "available" : r.estado === "ocupada" ? "occupied" : "maintenance"
      }));

      const mappedEvents = apiEvents.map(e => ({
        id: String(e.id),
        name: e.nombre || "",
        date: e.fecha || "",
        startTime: e.hora_inicio || "",
        endTime: e.hora_fin || "",
        type: e.tipo === "pagado" ? "paid" : "free",
        price: Number(e.precio) || 0,
        sedeId: String(e.sede_id),
        roomId: String(e.sala_id),
        participants: Number(e.participantes) || 0,
        status: e.estado === "activo" ? "active" : e.estado === "proximo" ? "upcoming" : "completed",
        clientName: e.nombre_cliente || "",
        clientPhone: e.telefono_cliente || ""
      }));

      const mappedBlocks = apiBlocks.map(b => ({
        id: String(b.id),
        roomId: String(b.sala_id),
        date: b.fecha || "",
        startHour: b.hora_inicio,
        endHour: b.hora_fin,
        label: b.etiqueta || "",
        eventId: b.evento_id ? String(b.evento_id) : undefined,
        type: b.tipo || "event"
      }));

      setSedes(mappedSedes as any);
      setSalas(mappedSalas as any);
      setEvents(mappedEvents as any);
      setTimeBlocks(mappedBlocks as any);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addEvent = useCallback(async (data: NewEventInput) => {
    try {
      await eventosApi.crear({
        nombre: data.name,
        fecha: data.date,
        hora_inicio: data.startTime,
        hora_fin: data.endTime,
        tipo: data.type === "paid" ? "pagado" : "gratuito",
        precio: data.price,
        sede_id: Number(data.sedeId) || undefined,
        sala_id: Number(data.roomId) || undefined,
        nombre_cliente: data.clientName,
        telefono_cliente: data.clientPhone,
        participantes: data.participants ?? 0,
        estado: "proximo",
      });
      await refetchAll();
    } catch (err: any) {
      toast.error(err.message || "Error al registrar evento");
      throw err;
    }
  }, [refetchAll]);

  const addTimeBlock = useCallback(async (data: NewBlockInput) => {
    try {
      await bloquesApi.crear({
        sala_id: Number(data.roomId),
        fecha: data.date,
        hora_inicio: data.startHour,
        hora_fin: data.endHour,
        etiqueta: data.label,
        evento_id: data.eventId ? Number(data.eventId) : undefined,
        tipo: (data.type as any) || "evento",
      });
    } catch (err: any) {
      // El bloque es secundario, no interrumpimos el flujo principal
      console.warn("Error creando bloque horario:", err.message);
    }
  }, []);

  // Cargar datos cuando hay token (usuario logueado)
  useEffect(() => {
    if (localStorage.getItem("token")) refetchAll();
  }, [refetchAll]);

  const getAllRooms     = useCallback(() => salas, [salas]);
  const getSedeById    = useCallback((id: string | number) => sedes.find((s) => String(s.id) === String(id)), [sedes]);
  const getRoomById    = useCallback((id: string | number) => salas.find((r) => String(r.id) === String(id)), [salas]);
  const getBlocksForRoom = useCallback(
    (roomId: string | number, date: string) =>
      timeBlocks.filter((b) => String(b.sala_id) === String(roomId) && b.fecha === date),
    [timeBlocks]
  );
  const isSlotFree = useCallback(
    (roomId: string | number, date: string, start: number, end: number, excludeId?: string | number) =>
      !timeBlocks.some(
        (b) =>
          String(b.sala_id) === String(roomId) &&
          b.fecha === date &&
          String(b.id) !== String(excludeId) &&
          start < b.hora_fin &&
          end > b.hora_inicio
      ),
    [timeBlocks]
  );

  return (
    <Ctx.Provider value={{
      sedes, salas, events, timeBlocks, loading, refetchAll,
      addEvent, addTimeBlock,
      getAllRooms, getSedeById, getRoomById, getBlocksForRoom, isSlotFree,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAppState() {
  return useContext(Ctx);
}
