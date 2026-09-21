import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getRFQ,
  getRFQQuotations,
} from "../../api/api";

export default function Quotations() {
  const { id } = useParams();

  const [rfq, setRFQ] = useState(null);
  const [quotations, setQuotations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [rfqData, quotationData] =
          await Promise.all([
            getRFQ(id),
            getRFQQuotations(id),
          ]);

        setRFQ(rfqData);
        setQuotations(quotationData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return <div className="page">Loading...</div>;
  }

  if (error) {
    return (
      <div className="page">
        <div className="error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Link to="/buyer/rfqs">
        ← Back to RFQs
      </Link>

      <h1>{rfq.product_name}</h1>

      <p>{rfq.description}</p>

      <h2>Received Quotations</h2>

      {quotations.length === 0 ? (
        <div className="empty">
          No quotations received yet.
        </div>
      ) : (
        <div className="card-list">
          {quotations.map((quotation) => (
            <div
              className="card"
              key={quotation.id}
            >
              <h3>
                ₹
                {Number(
                  quotation.quoted_price
                ).toLocaleString()}
              </h3>

              <p>
                <strong>
                  Estimated delivery:
                </strong>{" "}
                {quotation.estimated_delivery_time}{" "}
                days
              </p>

              {quotation.message && (
                <p>{quotation.message}</p>
              )}

              <small>
                Submitted{" "}
                {new Date(
                  quotation.created_at
                ).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}