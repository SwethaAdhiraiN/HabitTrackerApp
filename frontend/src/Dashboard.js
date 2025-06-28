import React, { useEffect, useState } from "react";
import styles from "./styles/Dashboard.module.css";

// PUBLIC_INTERFACE
/**
 * Dashboard: Renders the dashboard per the pastel reference image, showing
 * authenticated user info, habits, and stats. No static placeholders for user.
 *
 * All structure, colors, font, and element order matches the attached reference image.
 * User name and email are fetched post-login from /api/profile.
 */



// Simple icon SVGs for habits
const habitIcons = {
  water: (
    <span
      style={{
        background: "#E6F3FE",
        borderRadius: 8,
        width: 28,
        height: 28,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18">
        <path
          d="M9 2.5C8.6 3 4.7 7.6 4 10.1c-.6 1.8-.3 4 2 5a4.4 4.4 0 004.8-.8c1.7-1.4 2-3.4 1.5-5.2C11.7 5.7 9 2.5 9 2.5z"
          fill="#53A9F5"
        />
      </svg>
    </span>
  ),
  read: (
    <span
      style={{
        background: "#F2EAFE",
        borderRadius: 8,
        width: 28,
        height: 28,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18">
        <rect x="3" y="4" width="12" height="11" rx="2" fill="#8D85DC" />
        <rect x="6" y="7" width="6" height="2" rx="1" fill="#fff" />
      </svg>
    </span>
  ),
  exercise: (
    <span
      style={{
        background: "#FFE6EE",
        borderRadius: 8,
        width: 28,
        height: 28,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="7" fill="#F98AAD" />
        <rect x="6.8" y="4" width="2.4" height="8" rx="1.1" fill="#fff" />
      </svg>
    </span>
  ),
};

function CheckRow({ total = 7, filled = 5 }) {
  // Render row of checks/circles (green = checked, soft grey = empty)
  return (
    <span style={{ display: "inline-flex", gap: 6, verticalAlign: "middle" }}>
      {Array(total)
        .fill(0)
        .map((_, idx) =>
          idx < filled ? (
            <span
              key={idx}
              style={{
                display: "inline-flex",
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#47DB7F",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 1px 2px #CDE7DC60",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 12 12">
                <path d="M3 7l2 2 4-4" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          ) : (
            <span
              key={idx}
              style={{
                display: "inline-flex",
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#EEE7F3",
                border: "1.3px solid #E2DDE4",
              }}
            />
          )
        )}
    </span>
  );
}

function CalendarIcon() {
  // Reference image calendar illustration
  return (
    <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
      <rect x="8" y="14" width="38" height="28" rx="8" fill="#EBD6FB" />
      <rect x="15" y="22" width="24" height="16" rx="5" fill="#fff" />
      <rect x="20.2" y="28.5" width="7.7" height="7.2" rx="1.9" fill="#687FE5" />
      <path d="M27 35l4 5 5-5" stroke="#47DB7F" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="17" cy="14" r="2" fill="#687FE5" />
      <circle cx="37" cy="14" r="2" fill="#687FE5" />
    </svg>
  );
}



export default Dashboard;
