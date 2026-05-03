import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  User,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Download,
  Printer,
  X,
  CheckCircle,
  Sparkles,
} from "lucide-react";

interface ContractData {
  // Cliente
  clientName: string;
  clientDni: string;
  clientPhone: string;
  clientEmail: string;

  // Evento
  eventType: string;
  eventDate: string;
  eventTime: string;
  eventEndTime: string;
  numberOfGuests: number;

  // Ubicación
  sede: string;
  local: string;
  distrito: string;
  provincia: string;

  // Detalles del evento
  decorationType: string;
  cateringType: string;
  soundSystem: boolean;
  photography: boolean;
  extraServices: string;

  // Precio
  basePrice: number;
  servicesPrice: number;
  guarantee: number;
  advancePayment: number;
}

const INITIAL_DATA: ContractData = {
  clientName: "",
  clientDni: "",
  clientPhone: "",
  clientEmail: "",
  eventType: "",
  eventDate: "",
  eventTime: "",
  eventEndTime: "",
  numberOfGuests: 0,
  sede: "",
  local: "",
  distrito: "Juliaca",
  provincia: "Puno",
  decorationType: "",
  cateringType: "",
  soundSystem: false,
  photography: false,
  extraServices: "",
  basePrice: 0,
  servicesPrice: 0,
  guarantee: 500,
  advancePayment: 0,
};

export function ContractGenerator({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"form" | "preview">("form");
  const [contractData, setContractData] = useState<ContractData>(INITIAL_DATA);
  const printRef = useRef<HTMLDivElement>(null);

  const updateData = (field: keyof ContractData, value: any) => {
    setContractData(prev => ({ ...prev, [field]: value }));
  };

  const totalPrice = contractData.basePrice + contractData.servicesPrice;
  const remainingPayment = totalPrice - contractData.advancePayment;

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Contrato - ${contractData.clientName}</title>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 20px; }
            .contract { max-width: 800px; margin: 0 auto; }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const handleDownloadPDF = () => {
    handlePrint();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/90 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10"
        style={{ background: "rgba(17, 24, 39, 0.95)" }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gray-900/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 p-2.5 text-gray-900">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: 20 }}>
                Generador de Contratos
              </h2>
              <p className="text-gray-500" style={{ fontSize: 12 }}>
                {step === "form" ? "Complete los datos del evento" : "Vista previa del contrato"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {step === "preview" && (
              <>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all"
                  style={{ fontSize: 13 }}
                >
                  <Printer size={16} />
                  Imprimir
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                  style={{ fontSize: 13 }}
                >
                  <Download size={16} />
                  Descargar PDF
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="rounded-xl bg-white/5 border border-white/10 p-2 text-gray-400 hover:bg-white/10 hover:text-gray-200 transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "form" ? (
            <FormStep
              contractData={contractData}
              updateData={updateData}
              onNext={() => setStep("preview")}
            />
          ) : (
            <PreviewStep
              contractData={contractData}
              printRef={printRef}
              onBack={() => setStep("form")}
              totalPrice={totalPrice}
              remainingPayment={remainingPayment}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}

function FormStep({
  contractData,
  updateData,
  onNext,
}: {
  contractData: ContractData;
  updateData: (field: keyof ContractData, value: any) => void;
  onNext: () => void;
}) {
  const isValid = contractData.clientName && contractData.clientDni && contractData.eventType && contractData.eventDate && contractData.sede && contractData.local && contractData.basePrice > 0;

  return (
    <div className="space-y-6">
      {/* Datos del Cliente */}
      <Section title="Datos del Cliente" icon={User}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre Completo"
            value={contractData.clientName}
            onChange={(v) => updateData("clientName", v)}
            placeholder="Ej: María López de Condori"
            required
          />
          <Input
            label="DNI / Cédula"
            value={contractData.clientDni}
            onChange={(v) => updateData("clientDni", v)}
            placeholder="Ej: 72070834"
            required
          />
          <Input
            label="Teléfono"
            value={contractData.clientPhone}
            onChange={(v) => updateData("clientPhone", v)}
            placeholder="Ej: 951234567"
          />
          <Input
            label="Email"
            value={contractData.clientEmail}
            onChange={(v) => updateData("clientEmail", v)}
            placeholder="Ej: maria@email.com"
          />
        </div>
      </Section>

      {/* Datos del Evento */}
      <Section title="Datos del Evento" icon={Calendar}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Tipo de Evento"
            value={contractData.eventType}
            onChange={(v) => updateData("eventType", v)}
            placeholder="Ej: Boda, Quinceañero, Cumpleaños"
            required
          />
          <Input
            label="Fecha del Evento"
            type="date"
            value={contractData.eventDate}
            onChange={(v) => updateData("eventDate", v)}
            required
          />
          <Input
            label="Hora de Inicio"
            type="time"
            value={contractData.eventTime}
            onChange={(v) => updateData("eventTime", v)}
          />
          <Input
            label="Hora de Fin"
            type="time"
            value={contractData.eventEndTime}
            onChange={(v) => updateData("eventEndTime", v)}
          />
          <Input
            label="Número de Invitados"
            type="number"
            value={contractData.numberOfGuests.toString()}
            onChange={(v) => updateData("numberOfGuests", parseInt(v) || 0)}
            placeholder="Ej: 150"
          />
        </div>
      </Section>

      {/* Ubicación */}
      <Section title="Ubicación" icon={MapPin}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Sede"
            value={contractData.sede}
            onChange={(v) => updateData("sede", v)}
            options={["Event Juliaca Centro", "Event Juliaca Norte", "Event Juliaca Sur"]}
            required
          />
          <Input
            label="Local"
            value={contractData.local}
            onChange={(v) => updateData("local", v)}
            placeholder="Ej: Salón A, Auditorio"
            required
          />
          <Input
            label="Distrito"
            value={contractData.distrito}
            onChange={(v) => updateData("distrito", v)}
          />
          <Input
            label="Provincia"
            value={contractData.provincia}
            onChange={(v) => updateData("provincia", v)}
          />
        </div>
      </Section>

      {/* Servicios */}
      <Section title="Servicios Incluidos" icon={Sparkles}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Tipo de Decoración"
            value={contractData.decorationType}
            onChange={(v) => updateData("decorationType", v)}
            placeholder="Ej: Elegante, Rústica, Moderna"
          />
          <Input
            label="Tipo de Catering"
            value={contractData.cateringType}
            onChange={(v) => updateData("cateringType", v)}
            placeholder="Ej: Buffet, Platos servidos"
          />
          <Checkbox
            label="Sistema de Sonido"
            checked={contractData.soundSystem}
            onChange={(v) => updateData("soundSystem", v)}
          />
          <Checkbox
            label="Fotografía Profesional"
            checked={contractData.photography}
            onChange={(v) => updateData("photography", v)}
          />
          <div className="md:col-span-2">
            <TextArea
              label="Servicios Adicionales"
              value={contractData.extraServices}
              onChange={(v) => updateData("extraServices", v)}
              placeholder="Ej: DJ, animación, torta personalizada..."
              rows={3}
            />
          </div>
        </div>
      </Section>

      {/* Precios */}
      <Section title="Detalles de Pago" icon={DollarSign}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Precio Base del Local (S/)"
            type="number"
            value={contractData.basePrice.toString()}
            onChange={(v) => updateData("basePrice", parseFloat(v) || 0)}
            required
          />
          <Input
            label="Precio de Servicios Adicionales (S/)"
            type="number"
            value={contractData.servicesPrice.toString()}
            onChange={(v) => updateData("servicesPrice", parseFloat(v) || 0)}
          />
          <Input
            label="Garantía (S/)"
            type="number"
            value={contractData.guarantee.toString()}
            onChange={(v) => updateData("guarantee", parseFloat(v) || 0)}
          />
          <Input
            label="Adelanto Pagado (S/)"
            type="number"
            value={contractData.advancePayment.toString()}
            onChange={(v) => updateData("advancePayment", parseFloat(v) || 0)}
          />
        </div>
        <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-center justify-between">
            <span className="text-gray-300" style={{ fontSize: 14 }}>Total del Evento:</span>
            <span className="text-amber-400 font-bold" style={{ fontSize: 18 }}>
              S/ {(contractData.basePrice + contractData.servicesPrice).toFixed(2)}
            </span>
          </div>
          {contractData.advancePayment > 0 && (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-amber-500/20">
              <span className="text-gray-400" style={{ fontSize: 13 }}>Saldo Pendiente:</span>
              <span className="text-gray-200" style={{ fontSize: 15 }}>
                S/ {((contractData.basePrice + contractData.servicesPrice) - contractData.advancePayment).toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </Section>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
            isValid
              ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 hover:shadow-lg hover:shadow-amber-500/25"
              : "bg-gray-800 text-gray-500 cursor-not-allowed"
          }`}
          style={{ fontSize: 14 }}
        >
          <CheckCircle size={16} />
          Generar Vista Previa
        </button>
      </div>
    </div>
  );
}

function PreviewStep({
  contractData,
  printRef,
  onBack,
  totalPrice,
  remainingPayment,
}: {
  contractData: ContractData;
  printRef: React.RefObject<HTMLDivElement>;
  onBack: () => void;
  totalPrice: number;
  remainingPayment: number;
}) {
  const today = new Date().toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" });
  const eventDateFormatted = contractData.eventDate
    ? new Date(contractData.eventDate + "T00:00:00").toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" })
    : "";

  return (
    <div className="space-y-6">
      {/* Contract Preview */}
      <div
        ref={printRef}
        className="bg-white text-gray-900 p-12 rounded-xl mx-auto"
        style={{ maxWidth: 800, fontFamily: "Arial, sans-serif" }}
      >
        {/* Header */}
        <div className="text-center mb-8 border-b-2 border-amber-500 pb-6">
          <h1
            className="text-amber-600 mb-2"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700 }}
          >
            EVENT JULIACA
          </h1>
          <p style={{ fontSize: 12, color: "#666" }}>
            {contractData.sede} • {contractData.distrito}, {contractData.provincia}
          </p>
        </div>

        {/* Contratista */}
        <div className="mb-6">
          <p style={{ fontSize: 12, marginBottom: 4 }}>
            <strong>CONTRATISTA:</strong> {contractData.clientName}
            <span style={{ marginLeft: 40 }}><strong>CI:</strong> {contractData.clientDni}</span>
          </p>
        </div>

        {/* Título */}
        <h2 className="text-center mb-6" style={{ fontSize: 16, fontWeight: 700, color: "#1e40af" }}>
          DOCUMENTO DE CONTRATO
        </h2>

        {/* Cláusula principal */}
        <p style={{ fontSize: 11, lineHeight: 1.6, marginBottom: 16, textAlign: "justify" }}>
          Conste por el presente documento de contrato privado de prestación de servicios que celebran{" "}
          <strong>EVENT JULIACA</strong>, representado por su administrador, y el Sr./Sra.{" "}
          <strong>{contractData.clientName}</strong>, firmando los acuerdos y compromisos a las siguientes cláusulas:
        </p>

        {/* Detalles del evento */}
        <div style={{ fontSize: 11, lineHeight: 1.8, marginBottom: 16 }}>
          <p>
            Yo, <strong>{contractData.clientName}</strong>, con DNI Nº <strong>{contractData.clientDni}</strong>,
            mayor de edad, hábil por derecho y representante de <strong>EVENTOS SOCIALES {contractData.eventType.toUpperCase()}</strong>,
            que se realizará el día <strong>{eventDateFormatted}</strong> del año 2026.
          </p>
          <p style={{ marginTop: 8 }}>
            Eventos del tipo <strong>{contractData.eventType}</strong>, en fecha <strong>{contractData.eventDate}</strong>,
            a horas <strong>{contractData.eventTime}</strong> del día, en la dirección{" "}
            <strong>{contractData.sede} - {contractData.local}</strong>, en la localidad de{" "}
            <strong>{contractData.distrito}</strong>, Distrito <strong>{contractData.distrito}</strong>,
            Provincia <strong>{contractData.provincia}</strong>.
          </p>
        </div>

        {/* Grid de detalles */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px 16px",
            fontSize: 11,
            marginBottom: 16,
            paddingBottom: 16,
            borderBottom: "1px solid #ddd",
          }}
        >
          <div>
            <strong>Número de Invitados:</strong> {contractData.numberOfGuests}
          </div>
          <div>
            <strong>Hora:</strong> {contractData.eventTime} - {contractData.eventEndTime}
          </div>
          <div>
            <strong>Decoración:</strong> {contractData.decorationType || "N/A"}
          </div>
          <div>
            <strong>Catering:</strong> {contractData.cateringType || "N/A"}
          </div>
          <div>
            <strong>Sistema de Sonido:</strong> {contractData.soundSystem ? "Sí" : "No"}
          </div>
          <div>
            <strong>Fotografía:</strong> {contractData.photography ? "Sí" : "No"}
          </div>
        </div>

        {contractData.extraServices && (
          <div style={{ fontSize: 11, marginBottom: 16 }}>
            <strong>Servicios Adicionales:</strong>
            <p style={{ marginTop: 4, lineHeight: 1.6 }}>{contractData.extraServices}</p>
          </div>
        )}

        {/* Precios */}
        <div style={{ fontSize: 11, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span>Precio Base:</span>
            <span>S/ {contractData.basePrice.toFixed(2)}</span>
          </div>
          {contractData.servicesPrice > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span>Servicios Adicionales:</span>
              <span>S/ {contractData.servicesPrice.toFixed(2)}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span>Garantía:</span>
            <span>S/ {contractData.guarantee.toFixed(2)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 8,
              borderTop: "1px solid #ddd",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            <span>Precio Total:</span>
            <span>S/ {totalPrice.toFixed(2)}</span>
          </div>
          {contractData.advancePayment > 0 && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, color: "#059669" }}>
                <span>Adelanto Pagado:</span>
                <span>S/ {contractData.advancePayment.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, color: "#dc2626" }}>
                <span>Saldo Pendiente:</span>
                <span>S/ {remainingPayment.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        {/* Nota - Condiciones */}
        <div style={{ fontSize: 10, marginBottom: 20, padding: 12, backgroundColor: "#f9fafb", borderRadius: 8 }}>
          <p style={{ fontWeight: 700, marginBottom: 6 }}>NOTA - Se incluye el IGV</p>
          <p style={{ fontWeight: 700, marginBottom: 6 }}>CONDICIONES:</p>
          <ol style={{ paddingLeft: 20, lineHeight: 1.6 }}>
            <li>El contrato se formaliza con el pago del 50% del costo total del servicio.</li>
            <li>El contratante es responsable de cualquier daño al local, mobiliario o equipamiento.</li>
            <li>
              Cancelaciones con más de 30 días: devolución del 80%. Entre 15-30 días: 50%. Menos de 15 días: sin
              devolución.
            </li>
            <li>
              Las partes acuerdan someterse a la jurisdicción de los Juzgados de Juliaca para cualquier controversia.
            </li>
          </ol>
        </div>

        {/* Firmas */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 60 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ borderTop: "1px solid #000", paddingTop: 8, marginBottom: 4 }}>
              <p style={{ fontSize: 11, fontWeight: 700 }}>FIRMA DEL CONTRATANTE</p>
            </div>
            <p style={{ fontSize: 10 }}>{contractData.clientName}</p>
            <p style={{ fontSize: 10 }}>DNI: {contractData.clientDni}</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ borderTop: "1px solid #000", paddingTop: 8, marginBottom: 4 }}>
              <p style={{ fontSize: 11, fontWeight: 700 }}>EVENT JULIACA</p>
            </div>
            <p style={{ fontSize: 10 }}>Administrador Autorizado</p>
            <p style={{ fontSize: 10 }}>ADM-2026</p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 40, textAlign: "center", fontSize: 9, color: "#999" }}>
          <p>Fecha de emisión: {today}</p>
          <p style={{ marginTop: 4 }}>
            Event Juliaca • {contractData.distrito}, {contractData.provincia} • Perú
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4 border-t border-white/10">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all"
          style={{ fontSize: 14 }}
        >
          ← Editar Datos
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   FORM COMPONENTS
════════════════════════════════════════════ */
function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2">
          <Icon size={16} className="text-amber-400" />
        </div>
        <h3 className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: 16 }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-gray-400 mb-1.5" style={{ fontSize: 12 }}>
        {label} {required && <span className="text-amber-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl bg-gray-900/50 border border-white/10 text-gray-200 placeholder-gray-600 focus:border-amber-500/50 focus:outline-none transition-all"
        style={{ fontSize: 13 }}
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-gray-400 mb-1.5" style={{ fontSize: 12 }}>
        {label} {required && <span className="text-amber-400">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl bg-gray-900/50 border border-white/10 text-gray-200 focus:border-amber-500/50 focus:outline-none transition-all"
        style={{ fontSize: 13 }}
      >
        <option value="">Seleccionar...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder = "",
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-gray-400 mb-1.5" style={{ fontSize: 12 }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-2.5 rounded-xl bg-gray-900/50 border border-white/10 text-gray-200 placeholder-gray-600 focus:border-amber-500/50 focus:outline-none transition-all resize-none"
        style={{ fontSize: 13 }}
      />
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 rounded border-2 transition-all ${
            checked
              ? "bg-amber-500 border-amber-500"
              : "bg-gray-900/50 border-white/20 group-hover:border-white/30"
          }`}
        >
          {checked && (
            <svg
              className="w-full h-full text-gray-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <span className="text-gray-300" style={{ fontSize: 13 }}>
        {label}
      </span>
    </label>
  );
}
