import { useEffect, useState } from "react";
import "../styles/dashboard.css";

function Dashboard() {
  const [claims, setClaims] = useState([]);
  const [payments, setPayments] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    const fetchDashboardData = async () => {
      try {
        const claimsRes = await fetch("http://127.0.0.1:8000/api/claims", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const claimsData = await claimsRes.json();
        setClaims(Array.isArray(claimsData) ? claimsData : []);

        const paymentsRes = await fetch("http://127.0.0.1:8000/api/payments", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const paymentsData = await paymentsRes.json();
        setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      } catch (err) {
        console.error("DASHBOARD FETCH ERROR:", err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name || "User"} 👋</h1>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Total Claims</h3>
          <p>{claims.length}</p>
        </div>

        <div className="card">
          <h3>Approved</h3>
          <p>{claims.filter((c) => c.status === "Approved").length}</p>
        </div>

        <div className="card">
          <h3>Pending</h3>
          <p>{claims.filter((c) => c.status === "Pending").length}</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Recent Claims</h2>
        {claims.length === 0 ? (
          <p>No claims yet</p>
        ) : (
          <ul>
            {claims.slice(0, 3).map((c) => (
              <li key={c.id}>
                {c.type} -{" "}
                <span className={c.status.toLowerCase()}>
                  {c.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="dashboard-section">
        <h2>Recent Payments</h2>
        {payments.length === 0 ? (
          <p>No payments yet</p>
        ) : (
          <ul>
            {payments.slice(0, 3).map((p) => (
              <li key={p.id}>
                ${p.amount} -{" "}
                <span
                  className={
                    p.status === "completed" ? "approved" : "pending"
                  }
                >
                  {p.status === "completed" ? "Paid" : "Pending"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;