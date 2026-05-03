import React, { useState } from "react";
import { motion } from "motion/react";
import { useAppState } from "./AppContext";
import { Card, Button, PageHeader, GoldDivider } from "./ui-shared";
import { QRCodeSVG } from "qrcode.react";
import { Upload, CheckCircle, Clock, ArrowLeft, CreditCard, Sparkles } from "lucide-react";

type PayStep = "select" | "qr" | "upload" | "confirmation";

export function PaymentsPage({ preselectedEventId }: { preselectedEventId?: string }) {
  const { events, getSedeById, getRoomById } = useAppState();
  const [step, setStep] = useState<PayStep>(preselectedEventId ? "qr" : "select");
  const [selectedEvent, setSelectedEvent] = useState(preselectedEventId || "");
  const [uploaded, setUploaded] = useState(false);

  const event = events.find((e) => e.id === selectedEvent);
  const paidEvents = events.filter((e) => e.type === "paid");
  const reset = () => { setStep("select"); setSelectedEvent(""); setUploaded(false); };

  const stepLabels = ["Seleccionar", "Código QR", "Comprobante", "Confirmación"];
  const steps: PayStep[] = ["select", "qr", "upload", "confirmation"];
  const currentIdx = steps.indexOf(step);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center gap-4">
        {step !== "select" && (
          <motion.button
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={reset}
            className="p-2.5 rounded-xl hover:bg-white/5 text-gray-400 hover:text-gray-200 cursor-pointer border border-transparent hover:border-white/[0.08] transition-all"
          >
            <ArrowLeft size={20} />
          </motion.button>
        )}
        <PageHeader title="Pagos" subtitle="Genera QR de pago para tus clientes" icon={<><CreditCard size={16} /><span>Transacciones</span></>} />
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {stepLabels.map((label, i) => {
          const isActive = currentIdx >= i;
          const isCurrent = currentIdx === i;
          return (
            <React.Fragment key={label}>
              {i > 0 && <div className={`h-[2px] flex-1 rounded-full transition-all duration-500 ${isActive ? "bg-gradient-to-r from-amber-500 to-amber-400" : "bg-white/[0.06]"}`} />}
              <div className={`flex items-center gap-2 shrink-0 px-3.5 py-2 rounded-full border transition-all duration-300 ${
                isCurrent ? "bg-amber-500/[0.12] text-amber-400 border-amber-500/25 shadow-sm shadow-amber-500/15"
                : isActive ? "bg-amber-500/[0.06] text-amber-400/70 border-amber-500/15"
                : "bg-white/[0.02] text-gray-600 border-white/[0.05]"
              }`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isCurrent ? "bg-amber-500 text-gray-900 shadow-sm shadow-amber-500/30" : isActive ? "bg-amber-500/30 text-amber-400" : "bg-white/[0.06] text-gray-600"
                }`}>{i + 1}</span>
                <span className="hidden sm:inline">{label}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {step === "select" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {paidEvents.map((ev, i) => (
            <motion.div key={ev.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card
                className={`p-6 transition-all duration-300 ${selectedEvent === ev.id ? "ring-2 ring-amber-500/50 bg-amber-500/[0.04] shadow-lg shadow-amber-500/10" : ""}`}
                onClick={() => setSelectedEvent(ev.id)}
              >
                <h3 className="text-amber-100">{ev.name}</h3>
                <p className="text-gray-500 mt-1">{ev.date} · {ev.startTime} - {ev.endTime}</p>
                <p className="text-gray-500">{getSedeById(ev.sedeId)?.name} — {getRoomById(ev.roomId)?.name}</p>
                <p className="text-gray-600 mt-0.5">Cliente: {ev.clientName}</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.05]">
                  <p className="text-amber-400 text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>S/ {ev.price}.00</p>
                  {selectedEvent === ev.id && <Button size="sm" onClick={(e) => { e.stopPropagation(); setStep("qr"); }}>Generar QR</Button>}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {step === "qr" && event && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
          <Card className="p-8 text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-amber-500/[0.06] blur-3xl" />
            <h2 className="text-amber-100 relative" style={{ fontFamily: "'Playfair Display', serif" }}>QR de Pago</h2>
            <div className="space-y-1 relative">
              <p className="text-gray-300">{event.name}</p>
              <p className="text-gray-500">{event.date} · {event.startTime} - {event.endTime}</p>
              <p className="text-gray-500">Cliente: {event.clientName}</p>
            </div>
            <div className="inline-block p-6 bg-white rounded-2xl shadow-2xl shadow-black/30 ring-4 ring-white/10 relative">
              <QRCodeSVG value={`eventjuliaca://pay/${event.id}/${event.price}`} size={200} />
            </div>
            <div className="bg-gradient-to-r from-amber-500/[0.08] via-amber-500/[0.12] to-amber-500/[0.08] border border-amber-500/20 rounded-xl p-5 relative">
              <p className="text-amber-400/80">Monto a pagar</p>
              <p className="text-4xl text-amber-300 mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>S/ {event.price}.00</p>
            </div>
            <p className="text-gray-500">Muestra este QR al cliente para que realice el pago</p>
            <Button className="w-full py-3" onClick={() => setStep("upload")}>Cliente ya pagó</Button>
          </Card>
        </motion.div>
      )}

      {step === "upload" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
          <Card className="p-8 text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            <h2 className="text-amber-100" style={{ fontFamily: "'Playfair Display', serif" }}>Subir Comprobante</h2>
            <p className="text-gray-500">Sube la captura del comprobante de pago del cliente</p>
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setUploaded(true)}
              className={`border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all duration-300 ${
                uploaded ? "border-emerald-500/30 bg-emerald-500/[0.04]" : "border-white/[0.08] hover:border-amber-500/30 hover:bg-amber-500/[0.03]"
              }`}
            >
              {uploaded ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-3 text-emerald-400">
                  <CheckCircle size={44} />
                  <p>comprobante_pago.jpg</p>
                  <p className="text-emerald-500">Archivo cargado correctamente</p>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-gray-500">
                  <Upload size={44} className="text-gray-600" />
                  <p>Haz clic para seleccionar archivo</p>
                  <p className="text-gray-600">PNG, JPG o PDF</p>
                </div>
              )}
            </motion.div>
            <Button className="w-full py-3" disabled={!uploaded} onClick={() => setStep("confirmation")}>Enviar Comprobante</Button>
          </Card>
        </motion.div>
      )}

      {step === "confirmation" && event && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="max-w-md mx-auto">
          <Card className="p-8 text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-emerald-500/[0.06] blur-3xl" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-emerald-500/[0.1] border border-emerald-500/20 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10 relative"
            >
              <CheckCircle size={40} className="text-emerald-400" />
            </motion.div>
            <h2 className="text-amber-100" style={{ fontFamily: "'Playfair Display', serif" }}>Pago Registrado</h2>
            <p className="text-gray-500">El comprobante ha sido registrado exitosamente</p>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 space-y-3 text-left">
              {[
                { label: "Evento", value: event.name, color: "text-gray-200" },
                { label: "Cliente", value: event.clientName, color: "text-gray-200" },
                { label: "Monto", value: `S/ ${event.price}.00`, color: "text-amber-400" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-gray-500">{row.label}</span>
                  <span className={row.color}>{row.value}</span>
                </div>
              ))}
              <GoldDivider />
              <div className="flex justify-between">
                <span className="text-gray-500">Estado</span>
                <span className="flex items-center gap-1.5 text-amber-400"><Clock size={15} className="animate-pulse" /> Pendiente de validación</span>
              </div>
            </div>
            <Button variant="secondary" className="w-full" onClick={reset}>Volver a Pagos</Button>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
