import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getStats } from "../api/stats";
import Spinner from "../components/Spinner";
import "../styles/dashboard.css";

const STATUS_COLORS = {
  Pending: "#ffc857",
  Approved: "#4cd964",
  Rejected: "#ff5c5c",
};

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));

    getStats()
      .then(({ data }) => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <Spinner />
      </div>
    );
  }

  const claimsByStatusData = stats
    ? Object.entries(stats.claims_by_status).map(([status, count]) => ({
        status,
        count,
      }))
    : [];

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name || "User"} 👋</h1>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Total Claims</h3>
          <p>{stats?.total_claims ?? 0}</p>
        </div>

        <div className="card">
          <h3>Approved</h3>
          <p>{stats?.claims_by_status?.Approved ?? 0}</p>
        </div>

        <div className="card">
          <h3>Pending</h3>
          <p>{stats?.claims_by_status?.Pending ?? 0}</p>
        </div>
      </div>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Total Claims Amount</h3>
          <p>${(stats?.total_claims_amount ?? 0).toLocaleString()}</p>
        </div>

        <div className="card">
          <h3>Total Paid</h3>
          <p>${(stats?.total_paid_amount ?? 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Claims by Status</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={claimsByStatusData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f3b6d" vertical={false} />
            <XAxis dataKey="status" stroke="#9fb3d1" />
            <YAxis stroke="#9fb3d1" allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: "#12264d", border: "1px solid #1f3b6d" }}
              labelStyle={{ color: "white" }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {claimsByStatusData.map((entry) => (
                <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || "#00aaff"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="dashboard-section">
        <h2>Claims Submitted (Last 6 Months)</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={stats?.claims_per_month ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f3b6d" vertical={false} />
            <XAxis dataKey="month" stroke="#9fb3d1" />
            <YAxis stroke="#9fb3d1" allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: "#12264d", border: "1px solid #1f3b6d" }}
              labelStyle={{ color: "white" }}
            />
            <Line type="monotone" dataKey="count" stroke="#00aaff" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="dashboard-section">
        <h2>Recent Claims</h2>
        {!stats?.recent_claims?.length ? (
          <p>No claims yet</p>
        ) : (
          <ul>
            {stats.recent_claims.map((c) => (
              <li key={c.id}>
                {c.type} -{" "}
                <span className={(c.status ?? "").toLowerCase()}>{c.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="dashboard-section">
        <h2>Recent Payments</h2>
        {!stats?.recent_payments?.length ? (
          <p>No payments yet</p>
        ) : (
          <ul>
            {stats.recent_payments.map((p) => (
              <li key={p.id}>
                ${p.amount} -{" "}
                <span className={p.status === "completed" ? "approved" : "pending"}>
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
