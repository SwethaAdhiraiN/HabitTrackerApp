import React from "react";
import CalendarWithEmotions from "./CalendarWithEmotions";
import MiniCalendarWidget from "./MiniCalendarWidget";
import UserHeader from "./UserHeader";
import ProgressSnapshotWidget from "./ProgressSnapshotWidget";
import QuoteOfTheDayWidget from "./QuoteOfTheDayWidget";
import "./styles/Dashboard.module.css";

/**
 * PUBLIC_INTERFACE
 * Dashboard Page – beautifully organized page showing user's habit summary, motivational quote, emotion calendar, and progress snapshot.
 * Design: visually balanced, pastel background, pastel cards with subtle gradients, competent responsive layout (flex/grid), soft shadows, rounded corners.
 * Elegant, clear typography; separates dashboard areas gracefully. Works elegantly on both desktop and mobile.
 */

function Dashboard() {
  // Background pastel gradient for dashboard
  return (
    <div
      className="dashboard-root"
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(120deg, #EEE5FA 0%, #FDE7F3 100%)",
        padding: 0,
        margin: 0,
        fontFamily: '"Nunito", "Helvetica Neue", Arial, sans-serif',
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "32px 16px 32px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 30,
        }}
      >
        <UserHeader />
        {/* Main dashboard grid/cards */}
        <div
          className="dashboard-content"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 26,
            alignItems: "stretch",
            marginTop: 6,
            marginBottom: 10,
          }}
        >
          {/* Left column */}
          <div
            className="dashboard-cards-left"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 22,
            }}
          >
            <DashboardCard>
              <QuoteOfTheDayWidget />
            </DashboardCard>
            <DashboardCard>
              <MiniCalendarWidget />
            </DashboardCard>
          </div>
          {/* Right column */}
          <div
            className="dashboard-cards-right"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 22,
            }}
          >
            <DashboardCard>
              <CalendarWithEmotions />
            </DashboardCard>
            <DashboardCard>
              <ProgressSnapshotWidget />
            </DashboardCard>
          </div>
        </div>
      </div>
      {/* Responsive override for mobile */}
      <style>
        {`
          @media (max-width: 900px) {
            .dashboard-content {
              grid-template-columns: 1fr !important;
              gap: 22px !important;
            }
          }
          @media (max-width: 700px) {
            .dashboard-content {
              grid-template-columns: 1fr !important;
              gap: 18px !important;
              padding: 0 !important;
            }
            .dashboard-cards-left,
            .dashboard-cards-right {
              gap: 16px !important;
            }
          }
          @media (max-width: 450px) {
            .dashboard-root {
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
          }
        `}
      </style>
    </div>
  );
}

// Reusable card for consistent pastel style, shadow, radius, elegant depth.
function DashboardCard({ children }) {
  return (
    <section
      className="dashboard-card"
      style={{
        background: "linear-gradient(135deg, #FFFFFFEE 72%, #FCE7F3 100%)",
        borderRadius: 22,
        boxShadow:
          "0 4px 20px 0 rgba(167,140,255,0.11), 0 1.5px 3px 0 rgba(104,127,229,0.07)",
        padding: "28px 23px 24px 23px",
        marginBottom: 0,
        minHeight: 0,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "center",
        transition: "box-shadow 0.22s, transform 0.14s",
      }}
    >
      {children}
    </section>
  );
}

export default Dashboard;
