import React, { useEffect, useState } from "react";
import { api } from "../../api/api";
import { Link } from "react-router-dom";
import {
  Ticket,
  Clock,
  ChevronRight,
  Activity,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Filter,
  HardDrive,
  MapPin,
  Plus,
  History,
  Zap,
  User,
  X,
  Box,
} from "lucide-react";

const getStatusConfig = (status) => {
  switch (status?.toUpperCase()) {
    case "OPEN":
      return { label: "OPEN", color: "bg-rose-50 text-rose-600 border-rose-100", step: 1 };
    case "IN_PROGRESS":
    case "ASSIGNED":
      return { label: "ACTIVE", color: "bg-amber-50 text-amber-600 border-amber-100", step: 2 };
    case "RESOLVED":
    case "CLOSED":
      return { label: "RESOLVED", color: "bg-emerald-50 text-emerald-600 border-emerald-100", step: 3 };
    default:
      return { label: status, color: "bg-slate-50 text-slate-600 border-slate-100", step: 1 };
  }
};

const getPriorityConfig = (priority) => {
  switch (priority?.toUpperCase()) {
    case "HIGH":
      return { color: "bg-rose-50 text-rose-600 border-rose-100" };
    case "LOW":
      return { color: "bg-slate-50 text-slate-600 border-slate-100" };
    default:
      return { color: "bg-blue-50 text-blue-600 border-blue-100" };
  }
};

export default function CustomerTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get("/tickets/my")
      .then((r) => setTickets(r.data || []))
      .catch((err) => console.error("Failed to load tickets", err))
      .finally(() => setLoading(false));
  }, []);

  const openTicket = async (t) => {
    setSelectedTicket(t);
    setDetailLoading(true);
    try {
      const r = await api.get(`/tickets/${t.id}`);
      setTimeline(r.data.timeline || []);
    } catch (e) {
      console.error("Failed to load ticket detail", e);
      setTimeline([]);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in max-w-[1600px] mx-auto h-full flex flex-col overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Service Desk</h2>
          <p className="text-slate-500 text-sm font-medium">Track and manage your requests.</p>
        </div>
        <Link
          to="/customer/create-ticket"
          className="bg-indigo-600 px-6 py-3 rounded-xl text-sm font-black text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all w-fit flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Service Ticket
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center flex-1 min-h-[400px]">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-3" />
          <p className="text-slate-400 font-medium">Loading your support queue...</p>
        </div>
      ) : (
        <div className="flex flex-1 gap-6 min-h-0 overflow-hidden">
          {/* Ticket List */}
          <div className={`flex-1 lg:max-w-xl flex flex-col min-h-0 ${selectedTicket ? "hidden lg:flex" : "flex"}`}>
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                <Filter className="w-3.5 h-3.5" /> {tickets.length} Tickets Found
              </div>
            </div>

            <div className="overflow-y-auto pr-2 space-y-4 flex-1 custom-scrollbar">
              {tickets.map((t) => {
                const status = getStatusConfig(t.status);
                const priority = getPriorityConfig(t.priority);
                const isSelected = selectedTicket?.id === t.id;

                return (
                  <div
                    key={t.id}
                    onClick={() => openTicket(t)}
                    className={`group cursor-pointer bg-white border p-5 rounded-2xl transition-all relative ${isSelected
                        ? "border-indigo-600 ring-2 ring-indigo-50 shadow-md"
                        : "border-slate-100 shadow-sm hover:border-slate-200"
                      }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black border ${status.color}`}>
                          {status.label}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-black border flex items-center gap-1 ${priority.color}`}
                        >
                          <Zap className="w-2.5 h-2.5" /> {t.priority || "MEDIUM"}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-300">#{t.id}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-800 line-clamp-1 mb-1">{t.issue}</h3>
                    <p className="text-xs text-slate-400 font-medium line-clamp-1 mb-4">{t.equipment}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase">
                        <MapPin className="w-3 h-3" /> {t.site_name || "Main Site"}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                        <Clock className="w-3 h-3" /> {new Date(t.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ticket Detail */}
          <div className={`flex-1 bg-white border border-slate-100 rounded-3xl flex flex-col min-h-0 relative ${!selectedTicket ? "hidden lg:flex" : "flex"}`}>
            {!selectedTicket ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <History className="w-10 h-10 text-slate-200 mb-4" />
                <h3 className="text-xl font-black text-slate-800">Select a Ticket</h3>
                <p className="text-slate-400 text-sm mt-2">View full audit logs and lifecycle.</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">Ticket Lifecycle</h3>
                  <button onClick={() => setSelectedTicket(null)} className="p-2 text-slate-300 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {detailLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                    </div>
                  ) : timeline.length === 0 ? (
                    <p className="text-slate-400 text-sm">No logs available.</p>
                  ) : (
                    <div className="relative pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                      {timeline.map((log, idx) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                            <User className="w-3 h-3 text-indigo-500" />
                          </div>
                          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-bold text-slate-800">{log.action}</h4>
                              <span className="text-[10px] text-slate-400">
                                {new Date(log.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">{log.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
