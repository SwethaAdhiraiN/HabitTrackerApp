import React, { useState, useEffect, useRef } from "react";
import "./styles/theme.css";

/**
 * PUBLIC_INTERFACE
 * QuoteOfTheDayWidget
 * Fetches a quote from /api/quote and displays it with the author's name.
 * Refreshes with a new quote every 20 seconds.
 * Handles loading and error states.
 * Pastel/modern dashboard-panel styling, matching the HabitTrackerApp theme.
 */

const pastelPanelStyle = {
  width: "100%",
  background: "linear-gradient(125deg, #E9F3FA 0%, #FCF6FD 100%)",
  borderRadius: 16,
  boxShadow: "0 2px 10px rgba(104,127,229,0.08)",
  padding: "28px 18px 24px 18px",
  marginBottom: 24,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 100,
};

const quoteTextStyle = {
  fontSize: "1.20rem",
  color: "var(--ht-primary-text, #462065)",
  fontWeight: 700,
  textAlign: "center",
  lineHeight: 1.4,
  marginBottom: 10,
  maxWidth: 280,
  fontFamily: '"Helvetica Neue", Arial, sans-serif',
  textShadow: "0 3px 14px rgba(104,127,229,0.07)",
  letterSpacing: 0.03,
};

const authorStyle = {
  fontSize: "1.03rem",
  color: "var(--ht-primary, #8876E0)",
  fontWeight: 600,
  marginTop: 0,
  textAlign: "center",
  letterSpacing: 0.01,
  opacity: .90,
};

const loaderStyle = {
  marginTop: 14,
  marginBottom: 10,
  color: "#B8B9CC",
  fontWeight: 500,
  fontSize: "1.03rem"
};

const errorStyle = {
  color: "#CE5A73",
  fontSize: "1.02rem",
  fontWeight: 600,
  padding: "8px 0",
  textAlign: "center",
};

export function QuoteOfTheDayWidget() {
  const [quote, setQuote] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const timerRef = useRef();

  // PUBLIC_INTERFACE
  // Fetch a new quote from the API
  async function fetchQuote() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/quote");
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      const data = await response.json();
      if (typeof data.quote !== "string" || typeof data.author !== "string") {
        throw new Error("Malformed quote response from API");
      }
      setQuote(data.quote.trim());
      setAuthor(data.author.trim());
      setLoading(false);
      setError("");
    } catch (err) {
      setError("Could not load quote. Please try again later.");
      setQuote(null);
      setAuthor(null);
      setLoading(false);
    }
  }

  // Set up the interval timer for auto-refresh
  useEffect(() => {
    fetchQuote();
    timerRef.current = setInterval(() => {
      fetchQuote();
    }, 20000); // 20 seconds

    // Clean up on unmount
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, []);

  return (
    <section style={pastelPanelStyle} data-testid="quote-of-the-day-widget">
      <div style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginBottom: 6,
      }}>
        <svg width={24} height={24} viewBox="0 0 24 24" aria-label="quote icon">
          <circle cx={12} cy={12} r={12} fill="#F7EAFE" />
          <text x="12" y="17" textAnchor="middle" fontSize="15" fill="#C48DDC" fontWeight="bold">“</text>
        </svg>
      </div>
      {loading ? (
        <div style={loaderStyle}>Fetching quote...</div>
      ) : error ? (
        <div style={errorStyle}>{error}</div>
      ) : (
        <>
          <div style={quoteTextStyle}>“{quote}”</div>
          <div style={authorStyle}>— {author}</div>
        </>
      )}
      <div
        style={{
          marginTop: 13,
          fontSize: "0.89rem",
          color: "#ABB1CA",
          letterSpacing: 0.01,
          opacity: 0.72,
          fontFamily: "inherit"
        }}
      >
        New quote every 20 seconds.
      </div>
    </section>
  );
}

export default QuoteOfTheDayWidget;
