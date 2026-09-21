import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function BuyerDashboard() {
  const { user } = useAuth();

  return (
    <div className="page">
      <h1>Buyer Dashboard</h1>

      <p>
        Welcome, {user.name}.
      </p>

      <div className="dashboard-grid">
        <Link
          to="/buyer/rfqs/create"
          className="dashboard-card"
        >
          <h2>Create RFQ</h2>
          <p>
            Publish a new requirement for suppliers.
          </p>
        </Link>

        <Link
          to="/buyer/rfqs"
          className="dashboard-card"
        >
          <h2>My RFQs</h2>
          <p>
            Manage RFQs and view quotations.
          </p>
        </Link>
      </div>
    </div>
  );
}