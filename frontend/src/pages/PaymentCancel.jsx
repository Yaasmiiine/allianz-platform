import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import "../styles/paymentStatus.css";

function PaymentCancel() {
  return (
    <div className="payment-status-page">
      <Link to="/dashboard" className="back-arrow">
        ←
      </Link>

      <div className="payment-status-content">
        <div className="status-icon error">
          <XCircle size={56} />
        </div>

        <h1>Payment Cancelled</h1>
        <p>Your payment was cancelled. You can return to your dashboard.</p>
      </div>
    </div>
  );
}

export default PaymentCancel;
