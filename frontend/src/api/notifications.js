import client from "./client";

export const getNotifications = () => client.get("/notifications");

export const markAsRead = (id) => client.post(`/notifications/${id}/read`);

export const markAllAsRead = () => client.post("/notifications/read-all");

export const clearAll = () => client.delete("/notifications/clear-all");
