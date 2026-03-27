import { useState } from "react";
import { API_URL } from "../config";
import "../styles/claims.css";

function Claims() {
  const [form, setForm] = useState({
    type: "",
    description: "",
    amount: "",
    document: null,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "document") {
      setForm({
        ...form,
        document: files[0],
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.type || !form.description || !form.amount) {
      setMessage("Please fill all fields !");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("type", form.type);
      formData.append("description", form.description);
      formData.append("amount", form.amount);

      if (form.document) {
        formData.append("document", form.document);
      }

      const res = await fetch(`${API_URL}/claims`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const data = await res.json();
      console.log("CLAIM RESPONSE:", data);

      if (res.ok) {
        setMessage("Claim submitted successfully!");
        setForm({
          type: "",
          description: "",
          amount: "",
          document: null,
        });

        const fileInput = document.getElementById("document");
        if (fileInput) fileInput.value = "";
      } else {
        setMessage(data.message || "Error submitting claim");
      }
    } catch (err) {
      console.error("CLAIM ERROR:", err);
      setMessage("Error submitting claim");
    }
  };

  return (
    <div className="claims">
      <h1>Submit a Claim</h1>

      <form className="claims-form" onSubmit={handleSubmit}>
        <label>Claim Type</label>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="">Select type</option>
          <option value="Car Accident">Car Accident</option>
          <option value="Health">Health</option>
          <option value="Travel">Travel</option>
        </select>

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <label>Amount ($)</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
        />

        <label>Upload Document / Image</label>
        <input
          id="document"
          type="file"
          name="document"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleChange}
        />

        <button type="submit">Submit Claim</button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default Claims;