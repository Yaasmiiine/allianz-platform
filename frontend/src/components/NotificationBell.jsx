import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { API_URL } from "../config";
import "../styles/notificationBell.css";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("FETCH NOTIFICATIONS ERROR:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAsRead = async (id) => {
    try {
      await fetch(`${API_URL}/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      fetchNotifications();
    } catch (error) {
      console.error("MARK READ ERROR:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${API_URL}/notifications/read-all`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      fetchNotifications();
    } catch (error) {
      console.error("MARK ALL READ ERROR:", error);
    }
  };

  const clearAll = async () => {
    try {
      await fetch(`${API_URL}/notifications/clear-all`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      fetchNotifications();
    } catch (error) {
      console.error("CLEAR ALL NOTIFICATIONS ERROR:", error);
    }
  };

  return (
    <div className="notification-wrapper">
      <button className="bell-btn" onClick={() => setOpen(!open)}>
        <Bell size={22} />
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notification-dropdown">
          <div className="notif-header">
            <h4>Notifications</h4>
            <div className="notif-actions">
              <button onClick={markAllAsRead}>Read all</button>
              <button onClick={clearAll}>Clear all</button>
            </div>
          </div>

          {notifications.length === 0 ? (
            <p className="empty-notif">No notifications</p>
          ) : (
            notifications.slice(0, 8).map((notif) => (
              <div
                key={notif.id}
                className={`notif-item ${notif.is_read ? "read" : "unread"}`}
                onClick={() => markAsRead(notif.id)}
              >
                <strong>{notif.title}</strong>
                <p>{notif.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;