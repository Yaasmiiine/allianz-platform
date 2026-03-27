import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL, BASE_URL } from "../config";
import "../styles/adminClaims.css";

function AdminClaims() {
  const [claims, setClaims] = useState([]);
  const [message, setMessage] = useState("");

  const fetchClaims = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/claims`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      setClaims(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("FETCH CLAIMS ERROR:", error);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/claims/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Claim updated successfully");
        fetchClaims();
      } else {
        setMessage(data.message || "Error updating claim");
      }
    } catch (error) {
      console.error("UPDATE STATUS ERROR:", error);
      setMessage("Server error");
    }
  };

  return (
    <div className="admin-claims">
      <h1>Admin Claims Panel</h1>

      {message && <p className="admin-message">{message}</p>}

      <div className="admin-claims-list">
        {claims.map((claim) => (
          <div className="admin-claim-card" key={claim.id}>
            <h3>
              <Link
                to={`/claims/${claim.id}`}
                style={{ color: "#00aaff", textDecoration: "none" }}
              >
                {claim.type}
              </Link>
            </h3>

            <p>
              <strong>User:</strong> {claim.user?.name} ({claim.user?.email})
            </p>

            <p>
              <strong>Description:</strong> {claim.description}
            </p>

            <p>
              <strong>Amount:</strong> ${claim.amount}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span className={`status-badge ${claim.status.toLowerCase()}`}>
                {claim.status}
              </span>
            </p>

            {claim.document && (
              <p>
                <strong>Document:</strong>{" "}
                <a
                  href={`${BASE_URL}/storage/${claim.document}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#00aaff" }}
                >
                  View File
                </a>
              </p>
            )}

            <div className="admin-actions">
              <button onClick={() => updateStatus(claim.id, "Approved")}>
                Approve
              </button>

              <button
                className="reject-btn"
                onClick={() => updateStatus(claim.id, "Rejected")}
              >
                Reject
              </button>

              <button
                className="pending-btn"
                onClick={() => updateStatus(claim.id, "Pending")}
              >
                Set Pending
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminClaims;