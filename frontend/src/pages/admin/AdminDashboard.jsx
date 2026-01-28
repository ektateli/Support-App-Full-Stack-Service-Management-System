import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell as ReCell } from "recharts";
import { Link } from "react-router-dom";
import {
  Users,
  Briefcase,
  MapPin,
  Ticket,
  PlusCircle,
  UserPlus,
  LayoutDashboard,
  TrendingUp,
  Loader2,
  ChevronRight,
  ShieldCheck,
  Lightbulb,
  Clock,
  Info,
  Activity,
  BarChart3
} from "lucide-react";

const STATUS_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#64748b'];
const OVERVIEW_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    customers: 0,
    projects: 0,
    sites: 0,
    openTickets: 0,
    engineers: 0,
    totalTickets: 0
  });
  const [byStatus, setByStatus] = useState([]);
  const [overviewData, setOverviewData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [c, p, s, t, u] = await Promise.all([
          api.get("/customers").catch(() => ({ data: [] })),
          api.get("/projects").catch(() => ({ data: [] })),
          api.get("/sites").catch(() => ({ data: [] })),
          api.get("/tickets").catch(() => ({ data: [] })),
          api.get("/users").catch(() => ({ data: [] })),
        ]);

        const tickets = t.data || [];
        const open = tickets.filter((x) => x.status === "OPEN").length;
        const engineers = u.data.filter((user) => user.role === "ENGINEER").length || u.data.length;

        const currentStats = {
          customers: c.data.length,
          projects: p.data.length,
          sites: s.data.length,
          openTickets: open,
          engineers: engineers,
          totalTickets: tickets.length
        };

        setStats(currentStats);

        // 1. Prepare Overview Data (For the Bar Chart)
        setOverviewData([
          { name: 'Customers', value: currentStats.customers },
          { name: 'Projects', value: currentStats.projects },
          { name: 'Tickets', value: currentStats.totalTickets },
          { name: 'Engineers', value: currentStats.engineers },
        ]);

        // 2. Prepare Status Distribution Data (For the Pie Chart)
        const statusOrder = ["OPEN", "IN_PROGRESS", "ASSIGNED", "RESOLVED", "CLOSED"];
        const statusLabels = {
          OPEN: "Open",
          IN_PROGRESS: "In Progress",
          ASSIGNED: "Assigned",
          RESOLVED: "Resolved",
          CLOSED: "Closed"
        };

        const statusMap = {};
        tickets.forEach((x) => statusMap[x.status] = (statusMap[x.status] || 0) + 1);
        setByStatus(statusOrder.map(status => ({
          name: statusLabels[status] || status,
          value: statusMap[status] || 0
        })));

      } catch (err) {
        console.error("Dashboard data fetch failed", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const topCards = [
    { title: "Total Customers", value: stats.customers, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Active Projects", value: stats.projects, icon: Briefcase, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Field Engineers", value: stats.engineers, icon: Users, color: "text-pink-600", bg: "bg-pink-50" },
    { title: "Open Tickets", value: stats.openTickets, icon: Ticket, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Building your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-indigo-600" />
            Welcome back

          </h2>
          <p className="text-slate-500 mt-1 font-medium">Here's what's happening in your service management portal today.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topCards.map((c, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl ${c.bg} ${c.color}`}>
                <c.icon className="w-6 h-6" />
              </div>
              <Activity className="w-4 h-4 text-slate-200 group-hover:text-indigo-300 transition-colors" />
            </div>
            <div className="mt-4">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{c.title}</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{c.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Access Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/customers" className="group bg-white border border-slate-100 rounded-[2rem] p-7 shadow-sm hover:border-indigo-200 transition-all active:scale-[0.98]">
          <UserPlus className="w-10 h-10 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
          <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Customers <ChevronRight className="w-4 h-4 text-indigo-300 group-hover:translate-x-1 transition-transform" />
          </h4>
          <p className="text-slate-500 text-sm mt-1">Onboard corporate entities.</p>
        </Link>
        <Link to="/admin/projects" className="group bg-white border border-slate-100 rounded-[2rem] p-7 shadow-sm hover:border-emerald-200 transition-all active:scale-[0.98]">
          <PlusCircle className="w-10 h-10 text-emerald-600 mb-4 group-hover:scale-110 transition-transform" />
          <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Projects <ChevronRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 transition-transform" />
          </h4>
          <p className="text-slate-500 text-sm mt-1">Initiate and assign work.</p>
        </Link>
        <Link to="/admin/users" className="group relative bg-white rounded-3xl p-6 shadow-sm overflow-hidden active:scale-[0.98] transition-all">
          <div className="relative z-10">
            <Users className="w-8 h-8 text-indigo-400 mb-4" />
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              Manage Users <ChevronRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-slate-400 text-sm mt-1">Support roles</p>
          </div>
        </Link>
      </div>

      {/* Main Charts Row: Side-by-Side Bar and Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* System Overview (Bar Chart) */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Resource Distribution</h3>
              <p className="text-xs text-slate-400 font-medium">Total volume across main entities</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overviewData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={45}>
                  {overviewData.map((_, index) => (
                    <ReCell key={`cell-${index}`} fill={OVERVIEW_COLORS[index % OVERVIEW_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Support Mix (Doughnut Chart) */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-rose-50 p-2 rounded-xl text-rose-600">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Ticket Status Mix</h3>
              <p className="text-xs text-slate-400 font-medium">Real-time</p>
            </div>
          </div>
          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius={65} outerRadius={85} paddingAngle={5} stroke="none">
                  {byStatus.map((_, i) => (
                    <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Active</span>
              <span className="text-2xl font-black text-slate-900">{stats.totalTickets}</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-y-2 gap-x-4">
            {byStatus.map((entry, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[i % STATUS_COLORS.length] }}></div>
                  <span className="text-[10px] font-bold text-slate-500">{entry.name}</span>
                </div>
                <span className="text-[10px] font-black text-slate-700">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>



      {/* Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between text-slate-700 text-[10px] font-black uppercase tracking-widest pt-10 border-t border-slate-100">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Sync: {new Date().toLocaleTimeString()}</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
        <div>&copy; 2026 SUPPORT .</div>
      </div>
    </div>
  );
}
