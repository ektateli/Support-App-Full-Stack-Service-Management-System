import { useContext,useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children }) {
  const { user } = useContext(AuthContext);
   const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = user?.role;

 return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar with mobile toggle logic */}
      <Sidebar 
        role={role} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar with mobile menu trigger */}
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-0">
          {children}
        </main>
      </div>
    </div>
  );
}

