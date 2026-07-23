import { useState } from "react";
import { updateProfile } from "../api/auth";
import "../styles/profile.css";

function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState({
    name: storedUser?.name || "",
    email: storedUser?.email || "",
    phone: storedUser?.phone || "",
    address: storedUser?.address || "",
  });

  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const { data } = await updateProfile({ name: user.name, email: user.email });

      const updatedUser = { ...storedUser, ...data, phone: user.phone, address: user.address };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMessage("Profile updated successfully");
      setEdit(false);
    } catch (error) {
      const errors = error.response?.data?.errors;
      const firstError = errors ? Object.values(errors)[0]?.[0] : null;
      setMessage(firstError || error.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile">
      <h1>My Profile</h1>

      <div className="profile-card">
        <label>Name</label>
        <input
          name="name"
          value={user.name}
          disabled={!edit}
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          name="email"
          value={user.email}
          disabled={!edit}
          onChange={handleChange}
        />

        <label>Phone</label>
        <input
          name="phone"
          value={user.phone}
          disabled={!edit}
          onChange={handleChange}
        />

        <label>Address</label>
        <input
          name="address"
          value={user.address}
          disabled={!edit}
          onChange={handleChange}
        />

        {message && <p className="profile-message">{message}</p>}

        {!edit ? (
          <button onClick={() => setEdit(true)}>Edit Profile</button>
        ) : (
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile;
