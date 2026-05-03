import React, { useState } from "react";
import { motion } from "motion/react";
import {
  CalendarSection,
  CatalogSection,
  ReportsSection,
  ContractSection,
} from "./PublicWebsite";
import {
  Calendar,
  BookOpen,
  BarChart3,
  FileText,
  Sparkles,
  Globe,
} from "lucide-react";

const TABS = [
  { id: "calendar", label: "Calendario", icon: Calendar },
  { id: "catalog", label: "Catálogo", icon: BookOpen },
  { id: "reports", label: "Reportes Públicos", icon: BarChart3 },
  { id: "contract", label: "Contratos", icon: FileText },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AdminWebsitePage() {
  const [activeTab, setActiveTab] = useState<TabId>("calendar");

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="rounded-xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 p-2.5 text-gray-900 shadow-lg shadow-amber-500/25">
            <Globe size={20} />
          </div>
          <div>
            <h1
              className="text-white"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(22px, 3vw, 30px)",
              }}
            >
              Gestión del Sitio Web
            </h1>
            <p className="text-gray-500" style={{ fontSize: 13 }}>
              Vista previa de las secciones públicas del sitio web
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tab nav */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer border ${
                active
                  ? "bg-amber-500/[0.12] text-amber-400 border-amber-500/20 shadow-sm shadow-amber-500/10"
                  : "text-gray-400 hover:bg-white/[0.04] hover:text-gray-200 border-white/[0.06]"
              }`}
              style={{ fontSize: 13 }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="rounded-2xl bg-gray-900/50 border border-white/[0.06] overflow-hidden backdrop-blur-sm">
        <div className="p-1 sm:p-2">
          <div
            className="rounded-xl overflow-hidden bg-gray-950"
            style={{ maxHeight: "75vh", overflowY: "auto" }}
          >
            <div className="py-8 px-4 sm:px-8">
              {activeTab === "calendar" && <CalendarSection />}
              {activeTab === "catalog" && (
                <CatalogSection onContactClick={() => {}} />
              )}
              {activeTab === "reports" && <ReportsSection />}
              {activeTab === "contract" && (
                <ContractSection onContactClick={() => {}} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-start gap-3 bg-amber-500/[0.06] border border-amber-500/10 rounded-xl px-5 py-4"
      >
        <Sparkles size={16} className="text-amber-500/60 mt-0.5 shrink-0" />
        <p className="text-gray-400" style={{ fontSize: 13 }}>
          Estas secciones se muestran en el sitio web público de Event Juliaca.
          Los datos se sincronizan automáticamente con tu panel de
          administración.
        </p>
      </motion.div>
    </div>
  );
}
