import React, { useEffect, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * QuoteOfTheDayWidget visually centers and styles the daily quote box for the dashboard.
 * The quote and author are centered, well-padded, pastel-themed, and the container
 * aligns visually with Dashboard sections, using a harmonious color and shadow.
 */
function QuoteOfTheDayWidget() {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    fetch("/api/quote")
      .then((res) => res.json())
      .then((data) => setQuote(data));
  }, []);

  // Pastel background and styling to match Dashboard sections
  return (
    <section
      style={{
        width: "100%",
        maxWidth: 520,
        margin: "0 auto 26px auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "linear-gradient(125deg, #F9F7FD 65%, #FCE7F3 100%)",
          borderRadius: 20,
          boxShadow: "0 2px 14px rgba(123,97,255,0.10)",
          padding: "32px 34px 28px 34px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: 0,
          width: "100%",
        }}
      >
        {quote ? (
          <>
            <div
              style={{
                fontSize: "1.24rem",
                color: "var(--ht-primary-text, #44216C)",
                fontWeight: 700,
                textAlign: "center",
                lineHeight: 1.38,
                marginBottom: 10,
                letterSpacing: 0.02,
                textShadow: "0 3px 14px rgba(104,127,229,0.09)",
                maxWidth: 380,
                fontFamily: '"Helvetica Neue", Arial, sans-serif',
              }}
            >
              “{quote.text}”
            </div>
            <div
              style={{
                fontSize: "1.04rem",
                color: "var(--ht-primary, #A456EB)",
                fontWeight: 600,
                textAlign: "center",
                marginTop: 3,
                letterSpacing: 0.01,
              }}
            >
              — {quote.author}
            </div>
          </>
        ) : (
          <div
            style={{
              color: "#B2A6E3",
              fontSize: "1.09rem",
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            Loading quote...
          </div>
        )}
      </div>
    </section>
  );
}

export default QuoteOfTheDayWidget;
