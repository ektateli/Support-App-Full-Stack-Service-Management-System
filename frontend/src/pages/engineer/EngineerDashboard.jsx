import React, { useEffect, useState } from "react";
import { api } from "../../api/api";
import * as ReactRouterDOM from "react-router-dom";
import {
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  Ticket,
  ChevronRight,
  Loader2,
  TrendingUp,
  LayoutDashboard,
  ShieldCheck,
  Briefcase,
  MapPin,
  Building2,
  Target
} from "lucide-react";

// Extracting members from ReactRouterDOM to fix named export errors
const { Link } = ReactRouterDOM;

export default function EngineerDashboard() {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get("/tickets/assigned");
        setTickets(r.data || []);
      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openCount = tickets.filter((t) => t.status === "OPEN").length;
  const progressCount = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolvedCount = tickets.filter((t) => t.status === "RESOLVED").length;

  const stats = [
    { title: "Pending", value: openCount, icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
    { title: "Active", value: progressCount, icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    { title: "Resolved", value: resolvedCount, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-400 font-medium animate-pulse">Initializing technical workspace...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Technical Hub</h2>
          </div>
          <p className="text-slate-500 mt-1 text-sm font-medium">Monitoring your assigned service requests.</p>
        </div>
        
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((s, i) => (
          <div key={i} className={`bg-white p-6 rounded-[2rem] border ${s.border} shadow-sm group hover:shadow-md transition-all`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <s.icon className="w-6 h-6" />
              </div>
              <TrendingUp className="w-4 h-4 text-slate-200" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.title}</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tickets Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-indigo-600" />
              Latest Assignments
            </h3>
            <Link to="/engineer/tickets" className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-800 tracking-widest flex items-center gap-1 group">
              Full Queue <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-3">
            {tickets.slice(0, 5).map((t) => (
              <Link
                key={t.id}
                to={`/tickets/${t.id}`}
                className="block group bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-tighter">
                      <span>Case #{t.id}</span>
                      <span className="text-slate-200">•</span>
                      <span className={`px-1.5 py-0.5 rounded ${t.priority === 'HIGH' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'}`}>{t.priority}</span>
                    </div>
                    <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 truncate">{t.issue}</h4>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 font-medium">
                      <span className="flex items-center gap-1.5 shrink-0"><Building2 className="w-3.5 h-3.5 text-slate-300" /> {t.customer_name}</span>
                      <span className="flex items-center gap-1.5 truncate"><MapPin className="w-3.5 h-3.5 text-slate-300" /> {t.site_name}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${t.status === 'OPEN' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        t.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                      {t.status}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {tickets.length === 0 && (
              <div className="bg-white rounded-[2rem] p-16 text-center border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold">No active assignments found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Context */}
        {/* <div className="space-y-6">
        </div> */}
      </div>
    </div>
  );
}
