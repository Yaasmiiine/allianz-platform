import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { confirmPayment } from "../api/payments";
import "../styles/paymentStatus.css";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Confirming your payment...");
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setMessage("Missing payment session.");
      setStatus("error");
      return;
    }

    confirmPayment(sessionId)
      .then(({ data }) => {
        if (
          data.message === "Payment confirmed successfully" ||
          data.message === "Payment already confirmed"
        ) {
          setMessage("Your payment has been completed successfully.");
          setStatus("success");
        } else {
          setMessage(data.message || "Unable to confirm payment.");
          setStatus("error");
        }
      })
      .catch((error) => {
        setMessage(error.response?.data?.message || "Error confirming payment.");
        setStatus("error");
      });
  }, [searchParams]);

  return (
    <div className="payment-status-page">
      <Link to="/dashboard" className="back-arrow">
        ←
      </Link>

      <div className="payment-status-content">
        <div className={`status-icon ${status}`}>
          {status === "pending" && <Loader2 size={56} className="spin-icon" />}
          {status === "success" && <CheckCircle2 size={56} />}
          {status === "error" && <XCircle size={56} />}
        </div>

        <h1>Payment Successful</h1>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default PaymentSuccess;
