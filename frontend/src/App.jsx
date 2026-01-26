import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import AppLayout from "./components/AppLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EngineerDashboard from "./pages/engineer/EngineerDashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import UsersPage from "./pages/admin/UsersPage";
import CustomersPage from "./pages/admin/CustomersPage";
import ProjectsPage from "./pages/admin/ProjectsPage";
import SitesPage from "./pages/admin/SitesPage";
import RaiseTicket from "./pages/customer/RaiseTicket";
import EngineerTickets from "./pages/engineer/EngineerTickets";
import TicketDetail from "./pages/common/TicketDetail";
import AdminTickets from "./pages/admin/AdminTickets";
import BulkUpload from "./pages/admin/BulkUpload";
import CustomerTickets from "./pages/customer/CustomerTickets";






const Admin = () => <div className="text-2xl">Admin Dashboard</div>;
const Engineer = () => <div className="text-2xl">Engineer Dashboard</div>;
const Customer = () => <div className="text-2xl">Customer Dashboard</div>;

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AdminDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <UsersPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CustomersPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProjectsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/sites"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <SitesPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tickets"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AdminTickets />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/bulk"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <BulkUpload />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/engineer"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <EngineerDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CustomerDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Login />} />
          <Route path="/customer/create-ticket" element={<ProtectedRoute><AppLayout><RaiseTicket /></AppLayout></ProtectedRoute>} />
          <Route path="/engineer/tickets" element={<ProtectedRoute><AppLayout><EngineerTickets /></AppLayout></ProtectedRoute>} />
          <Route path="/tickets/:id" element={<ProtectedRoute><AppLayout><TicketDetail /></AppLayout></ProtectedRoute>} />
          <Route
            path="/customer/tickets"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CustomerTickets />
                </AppLayout>
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
