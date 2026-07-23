import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  return user?.role === "admin" ? children : <Navigate to="/dashboard" />;
}

export default AdminRoute;
