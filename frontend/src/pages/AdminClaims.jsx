import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../config";
import { getClaims, updateClaimStatus } from "../api/claims";
import Spinner from "../components/Spinner";
import Pagination from "../components/Pagination";
import "../styles/adminClaims.css";
import "../styles/filters.css";

function AdminClaims() {
  const [claims, setClaims] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchClaims = () => {
    setLoading(true);

    return getClaims({ status, type, search, page })
      .then(({ data }) => {
        setClaims(data.data ?? []);
        setMeta(data.meta ?? null);
      })
      .catch(() => setClaims([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchClaims();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, type, search, page]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateClaimStatus(id, newStatus);
      setMessage("Claim updated successfully");
      fetchClaims();
    } catch (error) {
      setMessage(error.response?.data?.message || "Error updating claim");
    }
  };

  return (
    <div className="admin-claims">
      <h1>Admin Claims Panel</h1>

      {message && <p className="admin-message">{message}</p>}

      <div className="claims-filters">
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          value={type}
          onChange={(e) => {
            setPage(1);
            setType(e.target.value);
          }}
        >
          <option value="">All types</option>
          <option value="Car Accident">Car Accident</option>
          <option value="Health">Health</option>
          <option value="Travel">Travel</option>
        </select>

        <input
          type="text"
          placeholder="Search description..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="admin-claims-list">
            {claims.length === 0 ? (
              <p>No claims found.</p>
            ) : (
              claims.map((claim) => (
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
                    <span className={`status-badge ${(claim.status ?? "").toLowerCase()}`}>
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
                    <button onClick={() => handleUpdateStatus(claim.id, "Approved")}>
                      Approve
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() => handleUpdateStatus(claim.id, "Rejected")}
                    >
                      Reject
                    </button>

                    <button
                      className="pending-btn"
                      onClick={() => handleUpdateStatus(claim.id, "Pending")}
                    >
                      Set Pending
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <Pagination meta={meta} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

export default AdminClaims;
