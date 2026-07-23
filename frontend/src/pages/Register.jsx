// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/auth";
import "../styles/auth.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (form.password !== form.passwordConfirmation) {
      setMessage("Passwords do not match");
      return;
    }

    setSubmitting(true);

    try {
      const { data } = await register(
        form.name,
        form.email,
        form.password,
        form.passwordConfirmation
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (error) {
      const errors = error.response?.data?.errors;
      const firstError = errors ? Object.values(errors)[0]?.[0] : null;
      setMessage(firstError || error.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth">
      <form className="auth-form" onSubmit={handleRegister}>
        <h2>Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />

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

        <input
          type="password"
          name="passwordConfirmation"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Creating account..." : "Register"}
        </button>

        {message && <p className="message">{message}</p>}

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
