import client from "./client";

export const getClaims = (params = {}) => client.get("/claims", { params });

export const getClaim = (id) => client.get(`/claims/${id}`);

export const createClaim = (formData) =>
  client.post("/claims", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateClaimStatus = (id, status) =>
  client.put(`/claims/${id}/status`, { status });
