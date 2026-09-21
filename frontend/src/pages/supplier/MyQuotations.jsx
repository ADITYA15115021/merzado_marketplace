import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyQuotations } from "../../api/api";

export default function MyQuotations() {
  const [quotations, setQuotations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data =
          await getMyQuotations();

        setQuotations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <div className="page">Loading...</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Quotations</h1>

        <Link
          to="/supplier"
          className="button"
        >
          Browse RFQs
        </Link>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {quotations.length === 0 ? (
        <div className="empty">
          No quotations submitted yet.
        </div>
      ) : (
        <div className="card-list">
          {quotations.map((quotation) => (
            <div
              className="card"
              key={quotation.id}
            >
              <h2>
                Quotation #{quotation.id}
              </h2>

              <p>
                <strong>RFQ:</strong>{" "}
                #{quotation.rfq_id}
              </p>

              <p>
                <strong>Price:</strong> ₹
                {Number(
                  quotation.quoted_price
                ).toLocaleString()}
              </p>

              <p>
                <strong>Delivery:</strong>{" "}
                {
                  quotation.estimated_delivery_time
                }{" "}
                days
              </p>

              {quotation.message && (
                <p>{quotation.message}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}