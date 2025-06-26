import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import "./styles/theme.css";

/**
 * PUBLIC_INTERFACE
 * HabitTrackerApp Homepage: matches pastel/gradient design from visual guide.
 * - Pastel vertical gradient background (lavender → pink).
 * - Centered stack of soft rounded cards (Intro, Stats, Habits).
 * - Prominent accent "Register" button (top-right).
 * - All color, type, radius, and spacing per extracted style guidance.
 */
import React, { useEffect, useState, useMemo } from "react";
const habitIcons = {
  water_drop: (
    <span style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      width: 36, height: 36, borderRadius: 10, background: "var(--ht-surface)",
    }}>
      <svg height="22" width="22" viewBox="0 0 20 20" fill="#53A9F5">
        <path d="M10.1 3.3c-.2.1-4.6 5.1-5.5 8.1-.7 2.1-.4 4.9 2.3 6a5.3 5.3 0 005.6-1c2-1.7 2.4-4 1.7-6.2-.8-2.8-4-7-4-7zm.2 12.4c-2.4 0-4-1.7-3.8-4.1l.1-.5.8.6c.6.5 1.6.7 2.4.7s1.8-.3 2.4-.7l.8-.6.1.5c.2 2.4-1.4 4.1-3.8 4.1z"/>
      </svg>
    </span>
  ),
  book: (
    <span style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      width: 36, height: 36, borderRadius: 10, background: "var(--ht-surface)"
    }}>
      <svg width="22" height="22" viewBox="0 0 20 20" fill="#C48DDC">
        <path d="M3 4.5C3 3.7 3.7 3 4.5 3h6c.8 0 1.5.7 1.5 1.5v11c0 .3-.2.5-.5.5s-.5-.2-.5-.5V4.5c0-.3-.2-.5-.5-.5h-6C3.2 4 3 4.2 3 4.5V16c0 .3.2.5.5.5s.5-.2.5-.5V4.5zm13 0c0-.8-.7-1.5-1.5-1.5h-2c-.3 0-.5.2-.5.5s.2.5.5.5h2c.3 0 .5.2.5.5v12c0 .3-.2.5-.5.5h-2c-.3 0-.5.2-.5.5s.2.5.5.5h2c.8 0 1.5-.7 1.5-1.5V4.5z"/>
      </svg>
    </span>
  ),
  lotus: (
    <span style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      width: 36, height: 36, borderRadius: 10, background: "var(--ht-surface)"
    }}>
      <svg width="22" height="22" viewBox="0 0 20 20" fill="#F7A1B2">
        <path d="M10 17s-5.7-2.8-7.2-6C1 7.7 3.5 5 6.1 5c1.3 0 2.5.7 3.2 1.8C10.4 5.7 11.6 5 12.9 5c2.6 0 5.1 2.7 3.3 6C15.7 14.2 10 17 10 17z"/>
      </svg>
    </span>
  ),
  heartbeat: (
    <span style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      width: 36, height: 36, borderRadius: 10, background: "var(--ht-surface)"
    }}>
      <svg width="22" height="22" viewBox="0 0 20 20" fill="#F7A1B2">
        <path d="M10 17s-5.7-2.8-7.2-6C1 7.7 3.5 5 6.1 5c1.3 0 2.5.7 3.2 1.8C10.4 5.7 11.6 5 12.9 5c2.6 0 5.1 2.7 3.3 6C15.7 14.2 10 17 10 17z"/>
      </svg>
    </span>
  ),
  // fallback:
  default: (
    <span style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      width: 36, height: 36, borderRadius: 10, background: "var(--ht-surface)"
    }}>
      <svg width="22" height="22" viewBox="0 0 20 20" fill="#687FE5"><circle cx="10" cy="10" r="10"/></svg>
    </span>
  ),
};

function HomePage() {
  const navigate = useNavigate();
  // --- Async mock data state ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Demo: show first user's habits
  const [habits, setHabits] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [quoteOfDay, setQuoteOfDay] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    Promise.all([
      fetch("/database/habits.json").then(r => r.json()),
      fetch("/database/quotes.json").then(r => r.json())
    ])
      .then(([habitsData, quotesData]) => {
        if (ignore) return;
        // Pick first 3 habits for the homepage
        setHabits((habitsData && habitsData.slice(0, 3)) || []);
        setQuotes(quotesData || []);
        let dayIdx = (new Date().getDate() + new Date().getMonth()) % ((quotesData && quotesData.length) || 1);
        setQuoteOfDay(quotesData && quotesData[dayIdx]);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        if (ignore) return;
        setError("Failed to load demo data. " + (err.message || ""));
        setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  // Compose/render homepage
  return (
    <div
      // Gradient pastel background (lavender → pink), vertical, as per style guide.
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(180deg, #EFE4FA 0%, #FCE7F3 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
        paddingBottom: 40,
        boxSizing: "border-box",
      }}
    >
      {/* Header Section with Register button */}
      <nav
        style={{
          width: "100%",
          maxWidth: 375,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          margin: "0 auto",
          padding: "20px 0 0 0",
        }}
      >
        <button
          // Prominent Register button as per design
          style={{
            background: "var(--ht-primary)",
            color: "white",
            border: "none",
            borderRadius: "999px",
            padding: "0.5rem 1.25rem",
            fontWeight: 600,
            fontSize: "1rem",
            boxShadow: "0 2px 12px rgba(123,97,255,0.12)",
            cursor: "pointer",
            marginLeft: "auto",
          }}
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </nav>

      <main
        style={{
          width: "100%",
          maxWidth: 375,
          margin: "0 auto",
          marginTop: 18,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* 1. Intro/Header Card Section */}
        <section
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.95)",
            borderRadius: 18,
            boxShadow: "0 2px 12px rgba(123,97,255,0.10)",
            padding: "24px 20px",
            marginBottom: 24,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {/* Hero header text, badge, subtitle, calendar icon */}
          <div style={{ display: "flex", alignItems: "start" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  margin: 0,
                  color: "#3B1877", // deep purple as per design
                  fontFamily: '"Helvetica Neue", Arial, sans-serif',
                  letterSpacing: 0,
                }}
              >
                Habit Tracker
              </h1>
              <p
                style={{
                  fontSize: "1.09rem",
                  margin: "10px 0 0 0",
                  color: "var(--ht-secondary-text)",
                  fontWeight: 400,
                  lineHeight: 1.35,
                }}
              >
                Build better habits easily
              </p>
            </div>
            {/* Calendar Icon illustration in pastel box (matches reference) */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                background: "#F7F6FD",
                boxShadow: "0 2px 7px rgba(104,127,229,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 12,
              }}
            >
              {/* Calendar SVG illustration */}
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <rect x="4" y="7.5" width="22" height="16" rx="4" fill="#EBD6FB"/>
                <rect x="7.5" y="11" width="15" height="10" rx="3" fill="#fff"/>
                <rect x="10" y="14" width="3.5" height="3.5" rx="1.2" fill="#687FE5"/>
                {/* Green check on calendar */}
                <path d="M14 17 l2 2.2 3-3" stroke="#47DB7F" strokeWidth="1.7" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          {/* Above: badge/21 days */}
          <div
            style={{
              marginTop: 18,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                background: "var(--ht-primary)",
                color: "white",
                borderRadius: 999,
                fontSize: "0.98rem",
                padding: "4px 18px",
                fontWeight: 600,
                letterSpacing: 0.2,
                boxShadow: "0 2px 6px rgba(104,127,229,0.10)",
                marginRight: 6,
                display: "inline-block",
              }}
            >
              21 days
            </span>
            <span
              style={{
                color: "var(--ht-secondary-text)",
                fontSize: "1rem",
                fontWeight: 400,
              }}
            >
              Streak to form a habit!
            </span>
          </div>
        </section>

        {/* 2. Motivational Quote Card */}
        <section
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.98)",
            borderRadius: 18,
            boxShadow: "0 2px 12px rgba(123,97,255,0.10)",
            padding: "28px 18px 26px 18px",
            marginBottom: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loading ? (
            <div style={{color: "var(--ht-primary)", fontWeight: 700, fontSize: "1.15em"}}>Loading…</div>
          ) : error ? (
            <div style={{color: "var(--ht-error)", fontWeight: 600, fontSize: "1.1em"}}>{error}</div>
          ) : quoteOfDay ? (
            <>
            <div
              style={{
                fontSize: "1.27rem",
                color: "var(--ht-primary-text)",
                fontWeight: 700,
                textAlign: "center",
                lineHeight: 1.35,
                letterSpacing: 0.1,
                marginBottom: 9,
                maxWidth: 280,
                fontFamily: '"Helvetica Neue", Arial, sans-serif',
                textShadow: "0 3px 14px rgba(104,127,229,0.07)",
              }}
            >
              "{quoteOfDay.text}"
            </div>
            <div
              style={{
                fontSize: "1.02rem",
                color: "var(--ht-primary)",
                fontWeight: 600,
                marginTop: 2,
                textAlign: "center",
                letterSpacing: 0.02,
              }}
            >
              {quoteOfDay.author}
            </div>
            </>
          ) : (
            <div style={{color: "var(--ht-secondary-text)"}}>No quote found.</div>
          )}
        </section>

        {/* 3. Habits List Card */}
        <section
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.97)",
            borderRadius: 18,
            boxShadow: "0 2px 12px rgba(123,97,255,0.10)",
            padding: "20px 16px 16px 16px",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: "#3B1877",
              fontSize: "1.13rem",
              marginBottom: 12,
              letterSpacing: 0,
            }}
          >
            Habits
          </div>
          <div>
            {loading ? (
              <div style={{color: "var(--ht-primary)", fontWeight: 700}}>Loading…</div>
            ) : error ? (
              <div style={{color: "var(--ht-error)", fontWeight: 600}}>{error}</div>
            ) : habits.length === 0 ? (
              <div style={{color: "var(--ht-secondary-text)"}}>No demo habits found.</div>
            ) : habits.map((habit, i) => (
              <div
                key={habit.id || i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: i < habits.length - 1 ? 13 : 0,
                  padding: "4px 0",
                }}
              >
                <div style={{ marginRight: 13 }}>
                  {habitIcons[habit.icon] || habitIcons.default}
                </div>
                <div style={{
                  flex: 1,
                  fontSize: "1.06rem",
                  color: "#22223B", fontWeight: 600,
                  letterSpacing: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                  {habit.name}
                </div>
                <div style={{ display: "flex", gap: 5, marginLeft: 8 }}>
                  {(habit.days || [false, false, false]).slice(0, 3).map((completed, idx) =>
                    completed ? (
                      <span
                        key={idx}
                        style={{
                          width: 18,
                          height: 18,
                          background: "#47DB7F",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M3 7l2 2 4-4"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                    ) : (
                      <span
                        key={idx}
                        style={{
                          width: 18,
                          height: 18,
                          background: "#EEF1F5",
                          borderRadius: "50%",
                          display: "inline-block",
                          marginRight: 0,
                          border: "1.2px solid #D6C7EE",
                        }}
                      />
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

import Dashboard from "./Dashboard";

function App() {
  // Provide routing structure: homepage, register, login, dashboard
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Add future routes here */}
      </Routes>
    </Router>
  );
}

export default App;
