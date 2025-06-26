import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Register";

// PUBLIC_INTERFACE
/**
 * Root application component for HabitTrackerApp React frontend.
 * Sets up client-side routing and provides access to Register page and home.
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ textAlign: "center", marginTop: "6em" }}>
              <h1>HabitTrackerApp</h1>
              <p>Welcome to your new habit tracking app – React frontend setup complete.</p>
              <a
                href="/register"
                style={{
                  color: "var(--ht-primary)",
                  fontWeight: 600,
                  textDecoration: "underline",
                  fontSize: "1.14em",
                }}
              >
                Go to Register Page
              </a>
            </div>
          }
        />
        <Route path="/register" element={<Register />} />
        {/* Future routes (e.g., Login, Dashboard) can be added here */}
      </Routes>
    </Router>
  );
}

export default App;
