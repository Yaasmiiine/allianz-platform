// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";
import "../styles/auth.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

    try {
      const { data } = await login(form.email, form.password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid credentials");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>

        {message && <p className="message">{message}</p>}

        <p>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
