import React, { useEffect, useState } from "react";
import styles from "./styles/Dashboard.module.css";

/**
 * PUBLIC_INTERFACE
 * UserHeader component for the Dashboard.
 * - Fetches and displays the current authenticated user's name, email, and join date.
 * - Shows today's date and an elegant welcome message.
 * - Includes a logout button (clears session/localStorage and navigates to login).
 * - Handles loading, success, and error UI states.
 * - Uses pastel color palette and gentle, modern layout as per design.md specifications.
 *
 * API:
 *   Attempts to get user data from sessionStorage (set at login/register), falls back to minimal API call if not present.
 *   If no user is found, redirects to /login.
 */
function UserHeader({ onLogout }) {
  const [user, setUser] = useState(null);         // { id, name, email, join_date, avatar }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to get today's date pretty
  function prettyToday() {
    const today = new Date();
    return today.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  // Logout: clear session + callback + reload/app-level redirect
  function handleLogout() {
    sessionStorage.removeItem("habit_user");
    localStorage.removeItem("habit_user");
    if (typeof onLogout === "function") onLogout();
    window.location.assign("/login");
  }

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Try to restore user info from storage first (set at login/register ideally)
    let storedUser = null;
    try {
      storedUser = JSON.parse(sessionStorage.getItem("habit_user") || localStorage.getItem("habit_user") || "null");
    } catch {}
    // If found, set immediately and verify/fetch from backend
    if (storedUser && storedUser.id) {
      setUser(storedUser);
      // Always refresh info from /api/user/:id in background
      fetch(`/api/user/${storedUser.id}`)
        .then((resp) => resp.json())
        .then((data) => {
          if (data && data.success && data.user) {
            setUser(data.user);
            // Refresh cached user
            sessionStorage.setItem("habit_user", JSON.stringify(data.user));
            localStorage.setItem("habit_user", JSON.stringify(data.user));
          } else {
            setError("Could not verify user session.");
          }
        })
        .catch(() => setError("Could not connect to server to verify your session."))
        .finally(() => setLoading(false));
    } else {
      // No user data found in session/localStorage: must redirect or show error
      setTimeout(() => {
        setError("No user session found. Please log in."); // Show briefly, then redirect
        setTimeout(() => window.location.assign("/login"), 1200);
      }, 350);
      setLoading(false);
    }
  }, []);

  if (loading) {
    // SHIM: Placeholder UX loader with soft shimmer
    return (
      <header className={styles.header} aria-busy="true" aria-live="polite">
        <div className={styles.logo} style={{ opacity: 0.68, background: "rgba(235,215,250,0.18)", borderRadius: 7, width: 130, height: "2.2em" }} />
        <div className={styles.greetingsZone} style={{ opacity: 0.62 }}>
          <div className={styles.greeting} style={{ background: "rgba(254,235,246,0.41)", borderRadius: 6, minWidth: 180, minHeight: "1.3em" }}>&nbsp;</div>
          <div className={styles.date} style={{ background: "rgba(252,216,205,0.39)", borderRadius: 6, minHeight: "1em" }}>&nbsp;</div>
        </div>
        <div className={styles.avatar}>
          <span className={styles.avatarImg} style={{ background: "#f1edfa", opacity: 0.58 }}>&nbsp;</span>
        </div>
      </header>
    );
  }
  if (error) {
    return (
      <header className={styles.header}>
        <div
          className={styles.logo}
          style={{ color: "#F87A77", fontWeight: 700 }}
        >HabitTracker</div>
        <div className={styles.greetingsZone}>
          <div className={styles.greeting} style={{ color: "#F87A77", fontWeight: 800 }}>
            {error}
          </div>
        </div>
        <div className={styles.avatar}>
          <span className={styles.avatarImg} style={{ background: "#FDE0E4" }}>
            <svg width="26" height="26" viewBox="0 0 32 32" fill="#F87A77"><circle cx="16" cy="16" r="16" /></svg>
          </span>
        </div>
      </header>
    );
  }
  // Show user info
  return (
    <header className={styles.header}>
      <div className={styles.logo} aria-label="HabitTrackerApp Logo" tabIndex={0}>
        HabitTracker
      </div>
      <div className={styles.greetingsZone}>
        <div className={styles.greeting}>
          Good morning,
          <span className={styles.name} style={{ marginLeft: 8 }}>
            {user?.name || "Friend"}
          </span>
          !
        </div>
        <div className={styles.date}>
          Today is {prettyToday()}
        </div>
        <div
          style={{
            marginTop: 8,
            color: "var(--ht-secondary-text,#594F6D)",
            fontSize: "1.1rem",
            opacity: 0.82,
          }}
        >
          <span
            style={{
              fontWeight: 500,
              marginRight: 7,
              color: "var(--ht-primary-text,#232B3A)",
            }}
          >
            {user?.email}
          </span>
          <span
            style={{
              fontWeight: 400,
              fontSize: "0.99em",
              marginLeft: 9,
              color: "#A49BB7",
            }}
          >
            Joined:&nbsp;
            {user?.join_date
              ? new Date(user.join_date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "—"}
          </span>
        </div>
        <div style={{ marginTop: 10 }}>
          <span
            style={{
              color: "var(--ht-primary,#687FE5)",
              background: "var(--ht-surface,#EBD6FB)",
              borderRadius: "12px",
              fontWeight: 600,
              padding: "4.2px 17px",
              fontSize: "1.01em",
              letterSpacing: 0.01,
              marginRight: 10,
              boxShadow: "0 1px 7px rgba(104,127,229,0.09)",
              verticalAlign: "middle"
            }}
          >
            Welcome back!
          </span>
        </div>
      </div>
      <div className={styles.avatar}>
        <span className={styles.avatarImg}>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user?.name ? `${user.name}'s avatar` : "User"}
              style={{ width: "100%", borderRadius: "50%", background: "var(--ht-surface,#EBD6FB)" }}
              referrerPolicy="no-referrer"
            />
          ) : (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="#EBD6FB">
              <circle cx="16" cy="16" r="16" />
              <text
                x="50%" y="56%"
                textAnchor="middle"
                fontWeight={700}
                fontSize="15"
                fill="#687FE5"
                dy=".3em"
              >
                {user?.name ? user.name[0].toUpperCase() : "U"}
              </text>
            </svg>
          )}
        </span>
        <button
          onClick={handleLogout}
          className={styles.logoutButton}
          style={{
            background: "var(--ht-primary,#687FE5)",
            color: "#fff",
            fontWeight: 700,
            border: "none",
            borderRadius: 19,
            padding: "8px 21px",
            marginLeft: 14,
            fontSize: "1rem",
            boxShadow: "0 2px 9px rgba(104,127,229,0.11)",
            cursor: "pointer",
            transition: "background .17s",
            outline: "none",
          }}
          aria-label="Logout"
        >Logout</button>
      </div>
    </header>
  );
}

export default UserHeader;
