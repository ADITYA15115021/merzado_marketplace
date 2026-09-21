import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createRFQ } from "../../api/api";

export default function CreateRFQ() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    product_name: "",
    description: "",
    quantity: "",
    delivery_location: "",
    deadline: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await createRFQ({
        ...form,
        quantity: Number(form.quantity),
        deadline: new Date(
          form.deadline
        ).toISOString(),
      });

      navigate("/buyer/rfqs");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="form-card wide">
        <h1>Create RFQ</h1>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>Product / Service Name</label>

          <input
            name="product_name"
            value={form.product_name}
            onChange={handleChange}
            required
          />

          <label>Description</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="5"
            required
          />

          <label>Quantity</label>

          <input
            type="number"
            name="quantity"
            min="1"
            value={form.quantity}
            onChange={handleChange}
            required
          />

          <label>Delivery Location</label>

          <input
            name="delivery_location"
            value={form.delivery_location}
            onChange={handleChange}
            required
          />

          <label>Deadline</label>

          <input
            type="datetime-local"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create RFQ"}
          </button>
        </form>
      </div>
    </div>
  );
}