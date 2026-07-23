import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../config";
import { getClaims } from "../api/claims";
import Spinner from "../components/Spinner";
import Pagination from "../components/Pagination";
import "../styles/claimsList.css";
import "../styles/filters.css";

function ClaimsList() {
  const [claims, setClaims] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);

    getClaims({ status, type, search, page })
      .then(({ data }) => {
        setClaims(data.data ?? []);
        setMeta(data.meta ?? null);
      })
      .catch(() => setClaims([]))
      .finally(() => setLoading(false));
  }, [status, type, search, page]);

  return (
    <div className="claims-list">
      <h1>My Claims</h1>

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
                {claims.length === 0 ? (
                  <tr>
                    <td colSpan={5}>No claims found.</td>
                  </tr>
                ) : (
                  claims.map((claim) => (
                    <tr key={claim.id}>
                      <td>{claim.id}</td>
                      <td>
                        <Link
                          to={`/claims/${claim.id}`}
                          style={{ color: "#00aaff", textDecoration: "none" }}
                        >
                          {claim.type}
                        </Link>
                      </td>
                      <td>{claim.amount}</td>
                      <td>
                        <span className={`status ${(claim.status ?? "").toLowerCase()}`}>
                          {claim.status}
                        </span>
                      </td>
                      <td>
                        {claim.document ? (
                          <a
                            href={`${BASE_URL}/storage/${claim.document}`}
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
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination meta={meta} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}

export default ClaimsList;
