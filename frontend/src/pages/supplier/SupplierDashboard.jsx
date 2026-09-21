import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getRFQs } from "../../api/api";

export default function SupplierDashboard() {
  const [rfqs, setRFQs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRFQs() {
    try {
      setLoading(true);

      const data = await getRFQs(
        search,
        location
      );

      setRFQs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRFQs();
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    loadRFQs();
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Browse RFQs</h1>

        <Link
          to="/supplier/quotations"
          className="button"
        >
          My Quotations
        </Link>
      </div>

      <form
        className="search-bar"
        onSubmit={handleSearch}
      >
        <input
          placeholder="Search product or description"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
        />

        <button type="submit">
          Search
        </button>
      </form>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading RFQs...</p>
      ) : rfqs.length === 0 ? (
        <div className="empty">
          No matching RFQs found.
        </div>
      ) : (
        <div className="card-list">
          {rfqs.map((rfq) => (
            <div
              className="card"
              key={rfq.id}
            >
              <h2>{rfq.product_name}</h2>

              <p>{rfq.description}</p>

              <p>
                <strong>Quantity:</strong>{" "}
                {rfq.quantity}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {rfq.delivery_location}
              </p>

              <p>
                <strong>Deadline:</strong>{" "}
                {new Date(
                  rfq.deadline
                ).toLocaleString()}
              </p>

              <Link
                to={`/supplier/rfqs/${rfq.id}`}
                className="button"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}