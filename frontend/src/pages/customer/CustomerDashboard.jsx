import React, { useEffect, useState } from "react";
import { api } from "../../api/api";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from "recharts";
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Activity,
  Loader2,
  LayoutDashboard,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

const STATUS_COLORS = {
  open: '#f43f5e',      // Rose-500
  in_progress: '#f59e0b', // Amber-500
  resolved: '#10b981',   // Emerald-500
};

export default function CustomerDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, open: 0, in_progress: 0, resolved: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get("/tickets/my/stats")
      .then(r => setStats(r.data))
      .catch(err => console.error("Failed to fetch customer stats", err))
      .finally(() => setLoading(false));
  }, []);

  const barData = [
    { name: "Open", value: stats.open, fill: STATUS_COLORS.open },
    { name: "Active", value: stats.in_progress, fill: STATUS_COLORS.in_progress },
    { name: "Fixed", value: stats.resolved, fill: STATUS_COLORS.resolved },
  ];

  const pieData = [
    { name: "Open", value: stats.open },
    { name: "In Progress", value: stats.in_progress },
    { name: "Resolved", value: stats.resolved },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium animate-pulse">Initializing Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-indigo-600" />
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Customer Portal</h2>
          </div>
          <p className="text-slate-500 mt-1 text-sm font-medium">Monitoring your system support requests and health.</p>
        </div>
        <div className="flex items-center self-start sm:self-auto gap-2 text-[10px] font-black text-slate-400 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100 uppercase tracking-widest">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
          Secure Live Link
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard
          title="Total Requests"
          value={stats.total}
          icon={Ticket}
          color="text-indigo-600"
          bg="bg-indigo-50"
        />
        <StatCard
          title="Open Now"
          value={stats.open}
          icon={AlertCircle}
          color="text-rose-600"
          bg="bg-rose-50"
        />
        <StatCard
          title="In Progress"
          value={stats.in_progress}
          icon={Clock}
          color="text-amber-600"
          bg="bg-amber-50"
        />
        <StatCard
          title="Resolved"
          value={stats.resolved}
          icon={CheckCircle2}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Support Load</h3>
              <p className="text-xs text-slate-400 font-medium">Volume split by stage</p>
            </div>
          </div>
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-rose-50 p-2 rounded-xl text-rose-600">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Lifecycle View</h3>
              <p className="text-xs text-slate-400 font-medium">Efficiency distribution</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 flex-1">
            <div className="h-48 w-48 relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius="72%"
                    outerRadius="92%"
                    paddingAngle={6}
                    stroke="none"
                  >
                    <Cell fill={STATUS_COLORS.open} />
                    <Cell fill={STATUS_COLORS.in_progress} />
                    <Cell fill={STATUS_COLORS.resolved} />
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Global</span>
                <span className="text-3xl font-black text-slate-900 leading-none mt-1">{stats.total}</span>
              </div>
            </div>
            <div className="w-full space-y-2">
              {pieData.map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-50/50 p-3 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: Object.values(STATUS_COLORS)[idx] }}></div>
                    <span className="text-xs font-bold text-slate-600">{entry.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900">{entry.value}</span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      ({stats.total ? Math.round((entry.value / stats.total) * 100) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon: Icon, color, bg }) => (
  <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all active:scale-[0.98] group relative overflow-hidden">
    <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full ${bg} opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
    <div className={`p-3 rounded-2xl ${bg} ${color} inline-block mb-4 relative z-10`}>
      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
    </div>
    <div className="relative z-10">
      <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-[0.1em]">{title}</p>
      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{value}</h3>
    </div>
  </div>
);
