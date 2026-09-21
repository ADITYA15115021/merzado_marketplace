import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar">
      <div>
        <Link to="/" className="logo">
          RFQ Marketplace
        </Link>
      </div>

      <div className="nav-links">
        {user.role === "buyer" ? (
          <>
            <Link to="/buyer">Dashboard</Link>
            <Link to="/buyer/rfqs">My RFQs</Link>
            <Link to="/buyer/rfqs/create">
              Create RFQ
            </Link>
          </>
        ) : (
          <>
            <Link to="/supplier">Browse RFQs</Link>
            <Link to="/supplier/quotations">
              My Quotations
            </Link>
          </>
        )}

        <span>{user.name}</span>

        <button onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}