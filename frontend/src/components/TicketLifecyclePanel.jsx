import { useParams } from "react-router-dom";
import TicketLifecyclePanel from "../components/TicketLifecyclePanel";
import { useAuth } from "../context/AuthContext";

export default function TicketDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-white rounded-xl p-6 shadow">
        <h2 className="text-xl font-bold">Ticket #{id}</h2>
        <p className="text-gray-500 mt-2">
          View complete ticket history and updates.
        </p>
      </div>

      <TicketLifecyclePanel ticketId={id} role={user.role} />
    </div>
  );
}
