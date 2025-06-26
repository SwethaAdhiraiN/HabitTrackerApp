import React from "react";

/**
 * PUBLIC_INTERFACE
 * Placeholder components for dashboard navigation subroutes.
 * Replace with real implementations when ready.
 */

export function NewHabit() {
  return (
    <PlaceholderCard title="Create New Habit">
      <p>This is the Create New Habit page. (To be implemented.)</p>
    </PlaceholderCard>
  );
}

export function HabitsList() {
  return (
    <PlaceholderCard title="Habits List">
      <p>View and manage your habits here. (To be implemented.)</p>
    </PlaceholderCard>
  );
}

export function TrackProgress() {
  return (
    <PlaceholderCard title="Track Progress">
      <p>See your progress tracking and analytics here. (To be implemented.)</p>
    </PlaceholderCard>
  );
}

export function Profile() {
  return (
    <PlaceholderCard title="Profile">
      <p>User profile page (avatar, details, etc). (To be implemented.)</p>
    </PlaceholderCard>
  );
}

export function Settings() {
  return (
    <PlaceholderCard title="Settings">
      <p>App and account settings page. (To be implemented.)</p>
    </PlaceholderCard>
  );
}

// Shared pastel themed placeholder style
function PlaceholderCard({ title, children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(180deg, #EFE4FA 0%, #FCE7F3 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
        paddingTop: 54,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.97)",
          borderRadius: 18,
          boxShadow: "0 2px 12px rgba(123,97,255,0.1)",
          padding: "32px 26px 22px 26px",
          maxWidth: 375,
          width: "100%",
        }}
      >
        <h2
          style={{
            color: "#49377A",
            fontSize: "1.32rem",
            fontWeight: 700,
            marginBottom: 20,
            textAlign: "center",
            letterSpacing: 0,
          }}
        >
          {title}
        </h2>
        <div
          style={{
            fontSize: "1rem",
            color: "var(--ht-secondary-text)"
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
