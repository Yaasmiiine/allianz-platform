// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("RESPONSE:", data);
      
      if (res.ok) {
        alert("Account created ✅");
        navigate("/login");
      } else {
        alert("Registration failed ❌");
        console.log(data);
      }
    } catch (error) {
      console.error("FULL ERROR:", error);
      alert("Check console ❗");
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

        <button type="submit">Register</button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;