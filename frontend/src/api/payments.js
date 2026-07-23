import client from "./client";

export const getPayments = (params = {}) => client.get("/payments", { params });

export const checkout = (claimId) =>
  client.post("/payments/checkout", { claim_id: claimId });

export const confirmPayment = (sessionId) =>
  client.post("/payments/confirm", { session_id: sessionId });
