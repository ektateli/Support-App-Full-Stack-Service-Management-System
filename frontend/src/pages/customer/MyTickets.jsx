import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import {
  Briefcase,
  MapPin,
  HardDrive,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Info,
  Ticket,
  ChevronRight,
  AlertTriangle,
  Zap
} from "lucide-react";

export default function MyTickets() {
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    project_id: "",
    site_id: "",
    equipment: "",
    issue: "",
    priority: "MEDIUM"
  });

  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");

  useEffect(() => {
    api.get("/projects").then((r) => setProjects(r.data || []));
  }, []);

  const onProject = async (id) => {
    setForm({ ...form, project_id: id, site_id: "", equipment: "" });
    if (!id) {
      setSites([]);
      return;
    }
    try {
      const r = await api.get("/sites", { params: { project_id: id } });
      setSites(r.data || []);
    } catch (err) {
      console.error("Failed to load sites", err);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/tickets", {
        project_id: Number(form.project_id),
        site_id: Number(form.site_id),
        equipment: form.equipment,
        issue: form.issue,
        priority: form.priority,
      });

      setMsgType("success");
      setMsg("Ticket raised successfully. Our engineers will respond shortly.");
      setForm({ project_id: "", site_id: "", equipment: "", issue: "", priority: "MEDIUM" });
      setSites([]);
    } catch (err) {
      setMsgType("error");
      setMsg("Failed to submit ticket. Please verify your connection.");
    } finally {
      setLoading(false);
      setTimeout(() => { setMsg(""); setMsgType(""); }, 5000);
    }
  };

  const priorities = [
    { id: 'LOW', label: 'Low', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', activeBg: 'bg-slate-100', activeBorder: 'border-slate-400' },
    { id: 'MEDIUM', label: 'Medium', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', activeBg: 'bg-blue-100', activeBorder: 'border-blue-400' },
    { id: 'HIGH', label: 'High', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', activeBg: 'bg-rose-100', activeBorder: 'border-rose-400' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in max-w-3xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
              <Ticket className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Request Support</h2>
          </div>
          <p className="text-slate-500 font-medium text-sm">Open a new technical case for our engineering team.</p>
        </div>
      </div>

      {msg && (
        <div className={`mb-6 flex items-center gap-3 p-5 rounded-[1.5rem] border animate-scale-in shadow-sm ${msgType === "success"
            ? "bg-emerald-50 border-emerald-100 text-emerald-700"
            : "bg-rose-50 border-rose-100 text-rose-700"
          }`}>
          {msgType === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <p className="text-sm font-bold leading-tight">{msg}</p>
        </div>
      )}

      <form onSubmit={submit} className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 p-6 sm:p-10 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-full -z-0"></div>

        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[10px]">
            <Info className="w-3.5 h-3.5" /> Project Context
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 ml-1">Assigned Project</label>
              <div className="relative group">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
                <select
                  className="w-full bg-slate-50 border border-slate-200 pl-11 pr-10 py-4 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-slate-800 appearance-none cursor-pointer"
                  value={form.project_id}
                  onChange={(e) => onProject(e.target.value)}
                  required
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 rotate-90 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 ml-1">Target Site</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
                <select
                  className={`w-full bg-slate-50 border border-slate-200 pl-11 pr-10 py-4 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-slate-800 appearance-none ${!sites.length ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  value={form.site_id}
                  onChange={(e) => setForm({ ...form, site_id: e.target.value })}
                  disabled={!sites.length}
                  required
                >
                  <option value="">{form.project_id ? "Select Site" : "Awaiting Project..."}</option>
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 rotate-90 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-50 relative z-10">
          <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[10px]">
            <AlertTriangle className="w-3.5 h-3.5" /> Urgency Level
          </div>
          <div className="grid grid-cols-3 gap-3">
            {priorities.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setForm({ ...form, priority: p.id })}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${form.priority === p.id
                    ? `${p.activeBg} ${p.activeBorder} shadow-inner`
                    : `${p.bg} ${p.border} opacity-60 grayscale-[0.5]`
                  }`}
              >
                <Zap className={`w-5 h-5 mb-1 ${p.color} ${form.priority === p.id ? 'animate-pulse' : ''}`} />
                <span className={`text-[10px] font-black uppercase tracking-wider ${p.color}`}>
                  {p.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-50 relative z-10">
          <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[10px]">
            <HardDrive className="w-3.5 h-3.5" /> Technical Asset
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 ml-1">Affected Equipment</label>
            <div className="relative group">
              <HardDrive className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-4 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all font-medium text-slate-800"
                placeholder="e.g. Rack B-12 UPS System"
                value={form.equipment}
                onChange={(e) => setForm({ ...form, equipment: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-50 relative z-10">
          <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[10px]">
            <MessageSquare className="w-3.5 h-3.5" /> Detailed Description
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 ml-1">Describe the Issue</label>
            <div className="relative group">
              <MessageSquare className="absolute left-4 top-5 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <textarea
                className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-4 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all font-medium text-slate-800 min-h-[160px] resize-none"
                placeholder="Please describe exactly what happened..."
                value={form.issue}
                onChange={(e) => setForm({ ...form, issue: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        <div className="pt-4 relative z-10">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" /><span>Submit Technical Ticket</span></>}
          </button>
        </div>
      </form>
    </div>
  );
}
