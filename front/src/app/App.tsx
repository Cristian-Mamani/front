import React, { useState } from "react";
import { Toaster } from "sonner";
import { AppProvider } from "./components/AppContext";
import { Login } from "./components/Login";
import { PublicWebsite } from "./components/PublicWebsite";
import { Sidebar } from "./components/Sidebar";
import { DashboardPage } from "./components/DashboardPage";
import { PublicEventsPage } from "./components/PublicEventsPage";
import { EventsPage } from "./components/EventsPage";
import { SedesPage } from "./components/SedesPage";
import { LocalesPage } from "./components/LocalesPage";
import { AvailabilityPage } from "./components/AvailabilityPage";
import { PaymentsPage } from "./components/PaymentsPage";
import { ReportsPage } from "./components/ReportsPage";
import { AdminWebsitePage } from "./components/AdminWebsitePage";

type AppView = "website" | "login" | "admin";

function AppContent() {
  const [view, setView] = useState<AppView>("website");
  const [activePage, setActivePage] = useState("dashboard");
  const [payEventId, setPayEventId] = useState<
    string | undefined
  >();

  // Public website
  if (view === "website") {
    return (
      <PublicWebsite onLoginClick={() => setView("login")} />
    );
  }

  // Login
  if (view === "login") {
    return (
      <div className="relative">
        {/* Back to website button */}
        <button
          onClick={() => setView("website")}
          className="fixed top-5 left-5 z-50 flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-gray-400 hover:text-gray-200 rounded-xl px-4 py-2 transition-all duration-200 backdrop-blur-sm cursor-pointer"
          style={{ fontSize: 13 }}
        >
          ← Volver al sitio
        </button>
        <Login onLogin={() => setView("admin")} />
      </div>
    );
  }

  // Admin panel
  const handlePay = (eventId: string) => {
    setPayEventId(eventId);
    setActivePage("payments");
  };

  const handleNav = (id: string) => {
    setActivePage(id);
    if (id !== "payments") setPayEventId(undefined);
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardPage />;
      case "public":
        return <PublicEventsPage />;
      case "events":
        return <EventsPage onPay={handlePay} />;
      case "sedes":
        return <SedesPage />;
      case "locales":
        return <LocalesPage />;
      case "availability":
        return <AvailabilityPage />;
      case "reports":
        return <ReportsPage />;
      case "payments":
        return <PaymentsPage preselectedEventId={payEventId} />;
      case "website":
        return <AdminWebsitePage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-950 relative"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-300px] right-[-200px] w-[600px] h-[600px] rounded-full bg-amber-500/[0.02] blur-[150px]" />
        <div className="absolute bottom-[-200px] left-[-100px] w-[400px] h-[400px] rounded-full bg-amber-600/[0.015] blur-[120px]" />
      </div>
      <Sidebar
        active={activePage}
        onChange={handleNav}
        onLogout={() => setView("website")}
      />
      <main className="pt-16 lg:pt-0 lg:ml-60 p-4 sm:p-6 lg:p-8 relative z-10">
        {renderPage()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Toaster position="top-right" richColors />
      <AppContent />
    </AppProvider>
  );
}