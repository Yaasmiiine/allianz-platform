import { useState } from "react";
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

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
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

        {!edit ? (
          <button onClick={() => setEdit(true)}>Edit Profile</button>
        ) : (
          <button onClick={() => setEdit(false)}>Save Changes</button>
        )}
      </div>
    </div>
  );
}

export default Profile;