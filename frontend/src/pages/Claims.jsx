import { useState } from "react";
import { createClaim } from "../api/claims";
import "../styles/claims.css";

function Claims() {
  const [form, setForm] = useState({
    type: "",
    description: "",
    amount: "",
    document: null,
  });

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("type", form.type);
      formData.append("description", form.description);
      formData.append("amount", form.amount);

      if (form.document) {
        formData.append("document", form.document);
      }

      await createClaim(formData);

      setMessage("Claim submitted successfully!");
      setForm({
        type: "",
        description: "",
        amount: "",
        document: null,
      });

      const fileInput = document.getElementById("document");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      const errors = err.response?.data?.errors;
      const firstError = errors ? Object.values(errors)[0]?.[0] : null;
      setMessage(firstError || err.response?.data?.message || "Error submitting claim");
    } finally {
      setSubmitting(false);
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

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Claim"}
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default Claims;
