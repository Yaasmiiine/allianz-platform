import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FileText,
  ClipboardList,
  CreditCard,
  ShieldCheck,
  X,
} from "lucide-react";
import "../styles/sidebar.css";

function Sidebar({ isOpen, toggleSidebar }) {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div>
        <div className="sidebar-top">
          <h3 className="menu-title">Menu</h3>
          <button className="sidebar-close-btn" onClick={toggleSidebar}>
            <X size={20} />
          </button>
        </div>

        <nav>
          <NavLink to="/dashboard" className="link">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/profile" className="link">
            <User size={20} />
            <span>Profile</span>
          </NavLink>

          <NavLink to="/claims" className="link">
            <FileText size={20} />
            <span>Submit Claim</span>
          </NavLink>

          <NavLink to="/claims-list" className="link">
            <ClipboardList size={20} />
            <span>My Claims</span>
          </NavLink>

          <NavLink to="/payments" className="link">
            <CreditCard size={20} />
            <span>Payments</span>
          </NavLink>

          {user?.role === "admin" && (
            <NavLink to="/admin-claims" className="link">
              <ShieldCheck size={20} />
              <span>Admin Panel</span>
            </NavLink>
          )}
        </nav>
      </div>

      <div className={`sidebar-user ${isOpen ? "expanded" : "collapsed"}`}>
        <div className="sidebar-user-avatar">👤</div>

        {isOpen && (
          <div className="sidebar-user-text">
            <p className="sidebar-user-name">{user?.name || "User"}</p>
            <p className="sidebar-user-role">{user?.role || "client"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;