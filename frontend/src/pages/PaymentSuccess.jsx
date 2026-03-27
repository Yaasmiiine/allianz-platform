import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "../config";
import "../styles/paymentStatus.css";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Confirming your payment...");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const token = localStorage.getItem("token");

    if (!sessionId) {
      setMessage("Missing payment session.");
      return;
    }

    fetch(`${API_URL}/payments/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Payment confirmed successfully") {
          setMessage("Your payment has been completed successfully.");
        } else {
          setMessage(data.message || "Unable to confirm payment.");
        }
      })
      .catch((err) => {
        console.error("PAYMENT CONFIRM ERROR:", err);
        setMessage("Error confirming payment.");
      });
  }, [searchParams]);

  return (
    <div className="payment-status-page">
      <Link to="/dashboard" className="back-arrow">
        ←
      </Link>

      <div className="payment-status-content">
        <h1>Payment Successful</h1>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default PaymentSuccess;