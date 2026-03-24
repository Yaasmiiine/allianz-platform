import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/claimDetails.css";

function ClaimDetails() {
  const { id } = useParams();
  const [claim, setClaim] = useState(null);
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const backPath = user?.role === "admin" ? "/admin-claims" : "/claims-list";

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchClaimDetails = async () => {
      try {
        const claimRes = await fetch(`http://127.0.0.1:8000/api/claims/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const claimData = await claimRes.json();

        if (!claimRes.ok) {
          setMessage(claimData.message || "Unable to load claim details");
          return;
        }

        setClaim(claimData);

        const paymentsRes = await fetch("http://127.0.0.1:8000/api/payments", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const paymentsData = await paymentsRes.json();

        if (Array.isArray(paymentsData)) {
          const relatedPayments = paymentsData.filter(
            (payment) => payment.claim_id === Number(id)
          );
          setPayments(relatedPayments);
        }
      } catch (error) {
        console.error("CLAIM DETAILS ERROR:", error);
        setMessage("Server error while loading claim details");
      }
    };

    fetchClaimDetails();
  }, [id]);

  if (message) {
    return (
      <div className="claim-details-page">
        <Link to={backPath} className="claim-back-link">← Back</Link>
        <p>{message}</p>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="claim-details-page">
        <Link to={backPath} className="claim-back-link">← Back</Link>
        <p>Loading claim details...</p>
      </div>
    );
  }

  return (
    <div className="claim-details-page">
      <Link to={backPath} className="claim-back-link">← Back</Link>

      <div className="claim-details-card">
        <h1>Claim Details</h1>

        <div className="claim-details-grid">
          <div>
            <strong>Claim ID:</strong>
            <p>{claim.id}</p>
          </div>

          <div>
            <strong>Type:</strong>
            <p>{claim.type}</p>
          </div>

          <div>
            <strong>Amount:</strong>
            <p>${claim.amount}</p>
          </div>

          <div>
            <strong>Status:</strong>
            <p className={`claim-status ${claim.status.toLowerCase()}`}>
              {claim.status}
            </p>
          </div>
        </div>

        <div className="claim-section">
          <strong>Description:</strong>
          <p>{claim.description}</p>
        </div>

        {claim.user && (
          <div className="claim-section">
            <strong>Submitted By:</strong>
            <p>{claim.user.name} ({claim.user.email})</p>
          </div>
        )}

        {claim.document && (
          <div className="claim-section">
            <strong>Document:</strong>
            <p>
              <a
                href={`http://127.0.0.1:8000/storage/${claim.document}`}
                target="_blank"
                rel="noreferrer"
              >
                View Uploaded File
              </a>
            </p>
          </div>
        )}

        <div className="claim-section">
          <strong>Payment History:</strong>
          {payments.length === 0 ? (
            <p>No payment recorded for this claim yet.</p>
          ) : (
            <ul className="payment-history-list">
              {payments.map((payment) => (
                <li key={payment.id}>
                  ${payment.amount} -{" "}
                  <span className={payment.status === "completed" ? "approved" : "pending"}>
                    {payment.status === "completed" ? "Paid" : payment.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClaimDetails;