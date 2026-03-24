import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/claimsList.css";

function ClaimsList() {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/api/claims", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setClaims(data))
      .catch((err) => console.error("FETCH CLAIMS ERROR:", err));
  }, []);

  return (
    <div className="claims-list">
      <h1>My Claims</h1>
      <div className="claims-table">
        <div className="claims-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Amount ($)</th>
                <th>Status</th>
                <th>Document</th>
              </tr>
            </thead>

            <tbody>
              {claims.map((claim) => (
                <tr key={claim.id}>
                  <td>{claim.id}</td>
                  <td>
                    <a href={`/claims/${claim.id}`} style={{ color: "#00aaff", textDecoration: "none" }}>
                      {claim.type}
                    </a>
                  </td>
                  <td>{claim.amount}</td>
                  <td>
                    <span className={`status ${claim.status.toLowerCase()}`}>
                      {claim.status}
                    </span>
                  </td>
                  <td>
                    {claim.document ? (
                      <a
                        href={`http://127.0.0.1:8000/storage/${claim.document}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View File
                      </a>
                    ) : (
                      "No file"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ClaimsList;