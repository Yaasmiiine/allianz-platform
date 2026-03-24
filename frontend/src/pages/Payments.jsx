import { useEffect, useState } from "react";
import "../styles/payments.css";

function Payments() {
  const [claims, setClaims] = useState([]);
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchClaims = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/claims", {
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

  const fetchPayments = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/payments", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("FETCH PAYMENTS ERROR:", error);
    }
  };

  useEffect(() => {
    fetchClaims();
    fetchPayments();
  }, []);

  const handlePay = async (claimId) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/payments/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ claim_id: claimId }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setMessage(data.message || "Unable to start payment");
      }
    } catch (error) {
      console.error("PAYMENT ERROR:", error);
      setMessage("Server error while starting payment");
    }
  };

  const alreadyStartedPaymentClaimIds = payments.map((payment) => payment.claim_id);

const approvedClaims = claims.filter(
  (claim) =>
    claim.status === "Approved" &&
    !alreadyStartedPaymentClaimIds.includes(claim.id)
);

  return (
    <div className="payments-page">
      <h1>Payments</h1>

      {message && <p className="payment-message">{message}</p>}

      <section className="payments-section">
        <h2>Approved Claims Ready for Payment</h2>

        {approvedClaims.length === 0 ? (
          <p>No approved claims available for payment.</p>
        ) : (
          <div className="payment-cards">
            {approvedClaims.map((claim) => (
              <div className="payment-card" key={claim.id}>
                <h3>{claim.type}</h3>
                <p><strong>Amount:</strong> ${claim.amount}</p>
                <p><strong>Status:</strong> {claim.status}</p>
                <button onClick={() => handlePay(claim.id)}>Pay Now</button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="payments-section">
        <h2>Payment History</h2>

        {payments.length === 0 ? (
          <p>No payments yet.</p>
        ) : (
          <div className="payment-cards">
            {payments.map((payment) => (
              <div className="payment-card" key={payment.id}>
                <p><strong>Claim ID:</strong> {payment.claim_id}</p>
                <p><strong>Amount:</strong> ${payment.amount}</p>
                <p><strong>Status:</strong> {payment.status === "completed" ? "Paid" : payment.status}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Payments;