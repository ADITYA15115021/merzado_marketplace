import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../api/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
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
      await registerUser(form);

      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <form
        className="form-card"
        onSubmit={handleSubmit}
      >
        <h1>Create Account</h1>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <label>Name</label>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Email</label>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          minLength="8"
          required
        />

        <label>Account Type</label>

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option value="buyer">
            Buyer
          </option>

          <option value="supplier">
            Supplier
          </option>
        </select>

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating account..."
            : "Register"}
        </button>

        <p>
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}