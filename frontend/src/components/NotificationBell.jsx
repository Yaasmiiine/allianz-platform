import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
  getNotifications,
  markAsRead as markAsReadApi,
  markAllAsRead as markAllAsReadApi,
  clearAll as clearAllApi,
} from "../api/notifications";
import "../styles/notificationBell.css";

const POLL_INTERVAL_MS = 30000;

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const { data } = await getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch {
      // silently ignore — the bell just keeps its last known state
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAsRead = async (id) => {
    try {
      await markAsReadApi(id);
      fetchNotifications();
    } catch {
      // ignore — next poll will reconcile state
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllAsReadApi();
      fetchNotifications();
    } catch {
      // ignore — next poll will reconcile state
    }
  };

  const clearAll = async () => {
    try {
      await clearAllApi();
      fetchNotifications();
    } catch {
      // ignore — next poll will reconcile state
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
