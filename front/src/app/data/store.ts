export type RoomStatus = "available" | "occupied" | "maintenance";

export interface Room {
  id: string;
  name: string;
  sedeId: string;
  capacity: number;
  status: RoomStatus;
}

export interface Sede {
  id: string;
  name: string;
  address: string;
  phone: string;
  image: string;
  rooms: Room[];
}

export interface EventItem {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  type: "free" | "paid";
  price: number;
  sedeId: string;
  roomId: string;
  participants: number;
  status: "active" | "completed" | "upcoming";
  clientName: string;
  clientPhone: string;
}

export interface TimeBlock {
  id: string;
  roomId: string;
  date: string;
  startHour: number;
  endHour: number;
  label: string;
  eventId?: string;
  type: "event" | "blocked" | "maintenance";
}

export function createInitialSedes(): Sede[] {
  return [
    {
      id: "s1",
      name: "Event Juliaca Centro",
      address: "Av. Noriega 245, Centro, Juliaca",
      phone: "951 234 567",
      image: "https://images.unsplash.com/photo-1764471444363-e6dc0f9773bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMHZlbnVlJTIwY29uZmVyZW5jZSUyMGhhbGx8ZW58MXx8fHwxNzc2MzU2MDk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      rooms: [
        { id: "r1", name: "Salón A", sedeId: "s1", capacity: 100, status: "available" },
        { id: "r2", name: "Salón B", sedeId: "s1", capacity: 60, status: "occupied" },
        { id: "r3", name: "Auditorio", sedeId: "s1", capacity: 300, status: "available" },
      ],
    },
    {
      id: "s2",
      name: "Event Juliaca Norte",
      address: "Jr. Lampa 890, Norte, Juliaca",
      phone: "951 345 678",
      image: "https://images.unsplash.com/photo-1764449320351-aca386f6e558?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBldmVudCUyMGNlbnRlciUyMGJ1aWxkaW5nfGVufDF8fHx8MTc3NjM1NjA5NHww&ixlib=rb-4.1.0&q=80&w=1080",
      rooms: [
        { id: "r4", name: "Salón A", sedeId: "s2", capacity: 80, status: "maintenance" },
        { id: "r5", name: "Salón B", sedeId: "s2", capacity: 50, status: "available" },
        { id: "r6", name: "Auditorio", sedeId: "s2", capacity: 250, status: "available" },
      ],
    },
    {
      id: "s3",
      name: "Event Juliaca Sur",
      address: "Av. Circunvalación 1200, Sur, Juliaca",
      phone: "951 456 789",
      image: "https://images.unsplash.com/photo-1771911646904-61f0fc9033e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdWRpdG9yaXVtJTIwY29udmVudGlvbiUyMGNlbnRlcnxlbnwxfHx8fDE3NzYzNTYwOTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rooms: [
        { id: "r7", name: "Salón A", sedeId: "s3", capacity: 120, status: "available" },
        { id: "r8", name: "Salón B", sedeId: "s3", capacity: 70, status: "available" },
        { id: "r9", name: "Auditorio", sedeId: "s3", capacity: 400, status: "maintenance" },
      ],
    },
  ];
}

export function createInitialEvents(): EventItem[] {
  return [
    { id: "e1", name: "Congreso de Tecnología 2026", date: "2026-04-20", startTime: "09:00", endTime: "13:00", type: "paid", price: 150, sedeId: "s1", roomId: "r3", participants: 245, status: "active", clientName: "Carlos Mamani", clientPhone: "951 111 222" },
    { id: "e2", name: "Taller de Marketing Digital", date: "2026-04-22", startTime: "14:00", endTime: "17:00", type: "paid", price: 80, sedeId: "s1", roomId: "r2", participants: 48, status: "active", clientName: "María Quispe", clientPhone: "951 333 444" },
    { id: "e3", name: "Feria de Emprendimiento", date: "2026-04-25", startTime: "10:00", endTime: "18:00", type: "free", price: 0, sedeId: "s2", roomId: "r6", participants: 180, status: "upcoming", clientName: "Pedro Condori", clientPhone: "951 555 666" },
    { id: "e4", name: "Seminario de Salud", date: "2026-04-18", startTime: "08:00", endTime: "12:00", type: "paid", price: 50, sedeId: "s3", roomId: "r7", participants: 95, status: "upcoming", clientName: "Ana Flores", clientPhone: "951 777 888" },
    { id: "e5", name: "Workshop de Diseño UX", date: "2026-04-21", startTime: "15:00", endTime: "18:00", type: "paid", price: 120, sedeId: "s1", roomId: "r1", participants: 35, status: "completed", clientName: "Luis Apaza", clientPhone: "951 999 000" },
    { id: "e6", name: "Conferencia de Educación", date: "2026-04-28", startTime: "11:00", endTime: "14:00", type: "free", price: 0, sedeId: "s3", roomId: "r8", participants: 60, status: "upcoming", clientName: "Rosa Choque", clientPhone: "951 222 333" },
  ];
}

export function createInitialTimeBlocks(): TimeBlock[] {
  return [
    { id: "tb1", roomId: "r3", date: "2026-04-20", startHour: 9, endHour: 13, label: "Congreso de Tecnología", eventId: "e1", type: "event" },
    { id: "tb2", roomId: "r2", date: "2026-04-22", startHour: 14, endHour: 17, label: "Taller Marketing Digital", eventId: "e2", type: "event" },
    { id: "tb3", roomId: "r6", date: "2026-04-25", startHour: 10, endHour: 18, label: "Feria Emprendimiento", eventId: "e3", type: "event" },
    { id: "tb4", roomId: "r7", date: "2026-04-18", startHour: 8, endHour: 12, label: "Seminario de Salud", eventId: "e4", type: "event" },
    { id: "tb5", roomId: "r1", date: "2026-04-21", startHour: 15, endHour: 18, label: "Workshop Diseño UX", eventId: "e5", type: "event" },
    { id: "tb6", roomId: "r8", date: "2026-04-28", startHour: 11, endHour: 14, label: "Conferencia Educación", eventId: "e6", type: "event" },
    { id: "tb7", roomId: "r2", date: "2026-04-20", startHour: 8, endHour: 12, label: "Reservado por dueño", type: "blocked" },
    { id: "tb8", roomId: "r3", date: "2026-04-21", startHour: 9, endHour: 13, label: "Limpieza general", type: "maintenance" },
  ];
}
