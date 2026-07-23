import { useEffect, useState } from "react";
import { getClaims } from "../api/claims";
import { getPayments, checkout } from "../api/payments";
import Spinner from "../components/Spinner";
import "../styles/payments.css";

function Payments() {
  const [claims, setClaims] = useState([]);
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);

    return Promise.all([
      getClaims({ status: "Approved", per_page: 100 }),
      getPayments(),
    ])
      .then(([claimsRes, paymentsRes]) => {
        setClaims(claimsRes.data.data ?? []);
        setPayments(paymentsRes.data.data ?? []);
      })
      .catch(() => {
        setClaims([]);
        setPayments([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePay = async (claimId) => {
    try {
      const { data } = await checkout(claimId);

      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage("Unable to start payment");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Server error while starting payment");
    }
  };

  const completedPaymentClaimIds = payments
    .filter((payment) => payment.status === "completed")
    .map((payment) => payment.claim_id);

  const approvedClaims = claims.filter(
    (claim) => !completedPaymentClaimIds.includes(claim.id)
  );

  if (loading) {
    return (
      <div className="payments-page">
        <h1>Payments</h1>
        <Spinner />
      </div>
    );
  }

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
                <p>
                  <strong>Amount:</strong> ${claim.amount}
                </p>
                <p>
                  <strong>Status:</strong> {claim.status}
                </p>
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
                <p>
                  <strong>Claim ID:</strong> {payment.claim_id}
                </p>
                <p>
                  <strong>Amount:</strong> ${payment.amount}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {payment.status === "completed" ? "Paid" : payment.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Payments;
