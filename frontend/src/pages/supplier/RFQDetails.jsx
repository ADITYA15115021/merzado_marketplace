import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getRFQ,
  createQuotation,
} from "../../api/api";

export default function RFQDetails() {
  const { id } = useParams();

  const [rfq, setRFQ] = useState(null);

  const [form, setForm] = useState({
    quoted_price: "",
    estimated_delivery_time: "",
    message: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadRFQ() {
      try {
        const data = await getRFQ(id);
        setRFQ(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadRFQ();
  }, [id]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await createQuotation(id, {
        quoted_price: Number(
          form.quoted_price
        ),
        estimated_delivery_time: Number(
          form.estimated_delivery_time
        ),
        message: form.message || null,
      });

      setSuccess(
        "Quotation submitted successfully."
      );

      setForm({
        quoted_price: "",
        estimated_delivery_time: "",
        message: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="page">Loading...</div>;
  }

  if (!rfq) {
    return (
      <div className="page">
        <div className="error">
          {error || "RFQ not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Link to="/supplier">
        ← Back to RFQs
      </Link>

      <div className="details-grid">
        <div className="card">
          <h1>{rfq.product_name}</h1>

          <p>{rfq.description}</p>

          <p>
            <strong>Quantity:</strong>{" "}
            {rfq.quantity}
          </p>

          <p>
            <strong>Delivery location:</strong>{" "}
            {rfq.delivery_location}
          </p>

          <p>
            <strong>Deadline:</strong>{" "}
            {new Date(
              rfq.deadline
            ).toLocaleString()}
          </p>
        </div>

        <div className="form-card">
          <h2>Submit Quotation</h2>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {success && (
            <div className="success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label>Quoted Price (₹)</label>

            <input
              type="number"
              name="quoted_price"
              min="0.01"
              step="0.01"
              value={form.quoted_price}
              onChange={handleChange}
              required
            />

            <label>
              Estimated Delivery (days)
            </label>

            <input
              type="number"
              name="estimated_delivery_time"
              min="1"
              value={
                form.estimated_delivery_time
              }
              onChange={handleChange}
              required
            />

            <label>Message</label>

            <textarea
              name="message"
              rows="5"
              value={form.message}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit Quotation"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}