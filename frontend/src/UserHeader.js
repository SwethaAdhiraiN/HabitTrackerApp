import React from "react";
import "./styles/Dashboard.module.css";

/**
 * PUBLIC_INTERFACE
 * UserHeader: shows user’s greeting, avatar, and quick account info + logout.
 */
function UserHeader({ user, onLogout }) {
  // If user data is missing, unavailable, or loading, render blank (no placeholders, no hardcoded content)
  if (!user) return null;

  // Only show info if fields are present (never static content).
  return (
    <header className="dashboard-card dashboard-user-header">
      <div className="dashboard-user-row">
        <img
          src={user.avatar || (user.id ? `https://api.dicebear.com/7.x/identicon/svg?seed=${user.id}` : "")}
          alt="Avatar"
          className="dashboard-user-avatar"
        />
        <div className="dashboard-user-info">
          <div className="dashboard-user-greeting">
            Hi, <strong>{user.name || ""}</strong>!
          </div>
          <div className="dashboard-user-meta">
            Joined:{" "}
            {user.join_date
              ? new Date(user.join_date).toLocaleDateString()
              : ""}
            {user.email && (
              <span className="dashboard-user-email">
                ({user.email})
              </span>
            )}
          </div>
        </div>
        <button
          className="logout-btn"
          onClick={onLogout}
          style={{ display: typeof onLogout === "function" ? undefined : "none" }}
        >
          Log out
        </button>
      </div>
    </header>
  );
}

export default UserHeader;
