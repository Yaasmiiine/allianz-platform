import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import { logout } from "../api/auth";
import "../styles/navbar.css";

function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // token may already be invalid/expired — proceed with local cleanup regardless
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={toggleSidebar}>
          ☰
        </button>

        <Link to="/" className="logo">
          Allianz
        </Link>
      </div>

      <div className="nav-right">
        <NotificationBell />
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;