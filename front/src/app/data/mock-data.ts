export interface Sede {
  id: string;
  name: string;
  address: string;
  city: string;
  capacity: number;
  locales: Local[];
}

export interface Local {
  id: string;
  sedeId: string;
  name: string;
  capacity: number;
  status: "available" | "occupied" | "maintenance";
}

export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  type: "free" | "paid";
  price?: number;
  sedeId: string;
  localId: string;
  participants: number;
  status: "active" | "completed" | "upcoming";
  description: string;
}

export interface ScheduleBlock {
  eventId: string;
  eventName: string;
  localId: string;
  date: string;
  startHour: number;
  endHour: number;
}

export const sedes: Sede[] = [
  {
    id: "s1",
    name: "Event Juliaca Centro",
    address: "Av. Néstor Cáceres Velásquez 450",
    city: "Juliaca",
    capacity: 500,
    locales: [
      { id: "l1", sedeId: "s1", name: "Salón A", capacity: 100, status: "available" },
      { id: "l2", sedeId: "s1", name: "Salón B", capacity: 80, status: "occupied" },
      { id: "l3", sedeId: "s1", name: "Auditorio", capacity: 300, status: "available" },
    ],
  },
  {
    id: "s2",
    name: "Event Juliaca Norte",
    address: "Jr. San Martín 1200",
    city: "Juliaca",
    capacity: 350,
    locales: [
      { id: "l4", sedeId: "s2", name: "Salón A", capacity: 80, status: "maintenance" },
      { id: "l5", sedeId: "s2", name: "Salón B", capacity: 70, status: "available" },
      { id: "l6", sedeId: "s2", name: "Auditorio", capacity: 200, status: "occupied" },
    ],
  },
  {
    id: "s3",
    name: "Event Juliaca Sur",
    address: "Av. Circunvalación 890",
    city: "Juliaca",
    capacity: 400,
    locales: [
      { id: "l7", sedeId: "s3", name: "Salón A", capacity: 90, status: "available" },
      { id: "l8", sedeId: "s3", name: "Salón B", capacity: 75, status: "available" },
      { id: "l9", sedeId: "s3", name: "Auditorio", capacity: 250, status: "maintenance" },
    ],
  },
];

export const events: Event[] = [
  {
    id: "e1",
    name: "Conferencia de Tecnología 2026",
    date: "2026-04-20",
    time: "09:00",
    type: "paid",
    price: 150,
    sedeId: "s1",
    localId: "l3",
    participants: 180,
    status: "upcoming",
    description: "Conferencia anual sobre las últimas tendencias en tecnología e innovación.",
  },
  {
    id: "e2",
    name: "Taller de Marketing Digital",
    date: "2026-04-18",
    time: "14:00",
    type: "paid",
    price: 80,
    sedeId: "s1",
    localId: "l1",
    participants: 45,
    status: "active",
    description: "Taller práctico sobre estrategias de marketing digital para empresas.",
  },
  {
    id: "e3",
    name: "Feria de Emprendimiento",
    date: "2026-04-25",
    time: "10:00",
    type: "free",
    sedeId: "s2",
    localId: "l6",
    participants: 120,
    status: "upcoming",
    description: "Feria abierta para emprendedores locales con stands y networking.",
  },
  {
    id: "e4",
    name: "Seminario de Finanzas Personales",
    date: "2026-04-15",
    time: "16:00",
    type: "paid",
    price: 50,
    sedeId: "s3",
    localId: "l7",
    participants: 60,
    status: "completed",
    description: "Aprende a gestionar tus finanzas personales de manera eficiente.",
  },
  {
    id: "e5",
    name: "Hackathon Juliaca 2026",
    date: "2026-05-01",
    time: "08:00",
    type: "free",
    sedeId: "s1",
    localId: "l2",
    participants: 75,
    status: "upcoming",
    description: "Competencia de programación de 24 horas para desarrolladores.",
  },
  {
    id: "e6",
    name: "Congreso de Educación",
    date: "2026-04-22",
    time: "09:00",
    type: "paid",
    price: 120,
    sedeId: "s3",
    localId: "l8",
    participants: 55,
    status: "active",
    description: "Congreso sobre innovación educativa y nuevas metodologías.",
  },
];

export const scheduleBlocks: ScheduleBlock[] = [
  { eventId: "e1", eventName: "Conf. Tecnología", localId: "l3", date: "2026-04-20", startHour: 9, endHour: 13 },
  { eventId: "e2", eventName: "Taller Marketing", localId: "l1", date: "2026-04-18", startHour: 14, endHour: 17 },
  { eventId: "e3", eventName: "Feria Emprendimiento", localId: "l6", date: "2026-04-25", startHour: 10, endHour: 18 },
  { eventId: "e5", eventName: "Hackathon", localId: "l2", date: "2026-05-01", startHour: 8, endHour: 20 },
  { eventId: "e6", eventName: "Congreso Educación", localId: "l8", date: "2026-04-22", startHour: 9, endHour: 14 },
  { eventId: "e4", eventName: "Seminario Finanzas", localId: "l7", date: "2026-04-15", startHour: 16, endHour: 19 },
];

export const allLocales: Local[] = sedes.flatMap((s) => s.locales);

export function getSedeById(id: string) {
  return sedes.find((s) => s.id === id);
}
export function getLocalById(id: string) {
  return allLocales.find((l) => l.id === id);
}
