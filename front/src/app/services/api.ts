// ============================================================
// api.ts — Capa de servicios que conecta con el backend
// Backend: http://localhost:3000
// Token JWT se guarda en localStorage bajo la clave "token"
// ============================================================

const BASE_URL = "http://localhost:3000/api";

// ── Helpers ────────────────────────────────────────────────
function getToken(): string | null {
  return localStorage.getItem("token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Error en la solicitud");
  }
  return res.json();
}

// ── Auth ───────────────────────────────────────────────────
export interface AuthResponse {
  token: string;
  usuario: { id: number; email: string; rol: string };
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("token", data.token);
  return data;
}

export function logout(): void {
  localStorage.removeItem("token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

// ── Tipos de la API ────────────────────────────────────────
export interface ApiSede {
  id: number;
  nombre: string;
  direccion: string | null;
  telefono: string | null;
  imagen_url: string | null;
  creado_en: string;
}

export interface ApiSala {
  id: number;
  sede_id: number;
  nombre: string;
  capacidad: number | null;
  estado: "disponible" | "ocupada" | "mantenimiento";
  sede_nombre?: string;
}

export interface ApiEvento {
  id: number;
  nombre: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  tipo: "gratuito" | "pagado";
  precio: number;
  sede_id: number | null;
  sala_id: number | null;
  nombre_cliente: string | null;
  telefono_cliente: string | null;
  participantes: number;
  estado: "activo" | "completado" | "proximo";
  descripcion: string | null;
  creado_en: string;
  sede_nombre?: string;
  sala_nombre?: string;
}

export interface ApiBloque {
  id: number;
  sala_id: number;
  fecha: string;
  hora_inicio: number;
  hora_fin: number;
  etiqueta: string | null;
  evento_id: number | null;
  tipo: "evento" | "bloqueado" | "mantenimiento";
  evento_nombre?: string;
}

export interface ApiPago {
  id: number;
  evento_id: number;
  monto: number;
  estado: "pendiente" | "verificado" | "rechazado";
  url_comprobante: string | null;
  creado_en: string;
  evento_nombre?: string;
}

export interface ApiDashboard {
  total_eventos: number;
  eventos_activos: number;
  eventos_proximos: number;
  eventos_completados: number;
  eventos_pagados: number;
  eventos_gratuitos: number;
  total_participantes: number;
  total_sedes: number;
  total_salas: number;
  salas_disponibles: number;
  total_pagos: number;
  pagos_pendientes: number;
  pagos_verificados: number;
  ingresos_verificados: number;
  proximos_eventos: ApiEvento[];
}

// ── Sedes ──────────────────────────────────────────────────
export const sedesApi = {
  listar: () => request<ApiSede[]>("/sedes"),
  crear: (data: Partial<ApiSede>) =>
    request<ApiSede>("/sedes", { method: "POST", body: JSON.stringify(data) }),
  actualizar: (id: number, data: Partial<ApiSede>) =>
    request<ApiSede>(`/sedes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  eliminar: (id: number) =>
    request<{ mensaje: string }>(`/sedes/${id}`, { method: "DELETE" }),
};

// ── Salas ──────────────────────────────────────────────────
export const salasApi = {
  listar: (sede_id?: number) =>
    request<ApiSala[]>(`/salas${sede_id ? `?sede_id=${sede_id}` : ""}`),
  crear: (data: Partial<ApiSala>) =>
    request<ApiSala>("/salas", { method: "POST", body: JSON.stringify(data) }),
  actualizar: (id: number, data: Partial<ApiSala>) =>
    request<ApiSala>(`/salas/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  eliminar: (id: number) =>
    request<{ mensaje: string }>(`/salas/${id}`, { method: "DELETE" }),
};

// ── Eventos ────────────────────────────────────────────────
export const eventosApi = {
  listar: (params?: { estado?: string; tipo?: string; sede_id?: number }) => {
    const q = new URLSearchParams();
    if (params?.estado) q.set("estado", params.estado);
    if (params?.tipo) q.set("tipo", params.tipo);
    if (params?.sede_id) q.set("sede_id", String(params.sede_id));
    return request<ApiEvento[]>(`/eventos${q.toString() ? `?${q}` : ""}`);
  },
  obtener: (id: number) => request<ApiEvento>(`/eventos/${id}`),
  crear: (data: Partial<ApiEvento>) =>
    request<ApiEvento>("/eventos", { method: "POST", body: JSON.stringify(data) }),
  actualizar: (id: number, data: Partial<ApiEvento>) =>
    request<ApiEvento>(`/eventos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  eliminar: (id: number) =>
    request<{ mensaje: string }>(`/eventos/${id}`, { method: "DELETE" }),
};

// ── Bloques ────────────────────────────────────────────────
export const bloquesApi = {
  listar: (sala_id?: number, fecha?: string) => {
    const q = new URLSearchParams();
    if (sala_id) q.set("sala_id", String(sala_id));
    if (fecha) q.set("fecha", fecha);
    return request<ApiBloque[]>(`/bloques${q.toString() ? `?${q}` : ""}`);
  },
  crear: (data: Partial<ApiBloque>) =>
    request<ApiBloque>("/bloques", { method: "POST", body: JSON.stringify(data) }),
  eliminar: (id: number) =>
    request<{ mensaje: string }>(`/bloques/${id}`, { method: "DELETE" }),
};

// ── Pagos ──────────────────────────────────────────────────
export const pagosApi = {
  listar: () => request<ApiPago[]>("/pagos"),
  crear: (data: { evento_id: number; monto: number; url_comprobante?: string }) =>
    request<ApiPago>("/pagos", { method: "POST", body: JSON.stringify(data) }),
  actualizarEstado: (id: number, estado: ApiPago["estado"]) =>
    request<ApiPago>(`/pagos/${id}/estado`, {
      method: "PUT",
      body: JSON.stringify({ estado }),
    }),
};

// ── Dashboard ──────────────────────────────────────────────
export const dashboardApi = {
  estadisticas: () => request<ApiDashboard>("/dashboard/estadisticas"),
};
