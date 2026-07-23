import client from "./client";

export const login = (email, password) =>
  client.post("/login", { email, password });

export const register = (name, email, password, passwordConfirmation) =>
  client.post("/register", {
    name,
    email,
    password,
    password_confirmation: passwordConfirmation,
  });

export const logout = () => client.post("/logout");

export const updateProfile = (data) => client.put("/profile", data);
