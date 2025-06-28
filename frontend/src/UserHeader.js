import React from "react";
import "./styles/Dashboard.module.css";

/**
 * PUBLIC_INTERFACE
 * UserHeader: shows user’s greeting, avatar, and quick account info + logout.
 */
function UserHeader({ user, onLogout }) {
  if (!user) return null;
  return (
    <header className="dashboard-card dashboard-user-header">
      <div className="dashboard-user-row">
        <img
          src={user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.id}`}
          alt="Avatar"
          className="dashboard-user-avatar"
        />
        <div className="dashboard-user-info">
          <div className="dashboard-user-greeting">
            Hi, <strong>{user.name}</strong>!
          </div>
          <div className="dashboard-user-meta">
            Joined: {user.join_date ? new Date(user.join_date).toLocaleDateString() : "?"}
            <span className="dashboard-user-email">({user.email})</span>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}

export default UserHeader;
