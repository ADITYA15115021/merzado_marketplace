import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getMyRFQs,
  deleteRFQ,
} from "../../api/api";

export default function MyRFQs() {
  const [rfqs, setRFQs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRFQs() {
    try {
      setLoading(true);
      const data = await getMyRFQs();
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

  async function handleDelete(id) {
    if (!window.confirm("Delete this RFQ?")) {
      return;
    }

    try {
      await deleteRFQ(id);
      setRFQs(
        rfqs.filter((rfq) => rfq.id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return <div className="page">Loading...</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>My RFQs</h1>

        <Link
          to="/buyer/rfqs/create"
          className="button"
        >
          Create RFQ
        </Link>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {rfqs.length === 0 ? (
        <div className="empty">
          No RFQs created yet.
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

              <div className="card-actions">
                <Link
                  to={`/buyer/rfqs/${rfq.id}/quotations`}
                  className="button"
                >
                  View Quotations
                </Link>

                <button
                  className="danger"
                  onClick={() =>
                    handleDelete(rfq.id)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}