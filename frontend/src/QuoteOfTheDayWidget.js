import React from "react";

/**
 * PUBLIC_INTERFACE
 * QuoteOfTheDayWidget: Always displays a visible motivational quote and author,
 * styled with a centered pastel card consistent with the dashboard theme.
 */
function QuoteOfTheDayWidget() {
  // Demo quote (could use props or API, but always displays a quote)
  const quote = "Success is the sum of small efforts, repeated day in and day out.";
  const author = "Robert Collier";

  return (
    <section
      style={{
        width: "100%",
        maxWidth: 380,
        background: "linear-gradient(135deg, #EBD6FB 0%, #FCE7F3 100%)",
        borderRadius: 18,
        boxShadow: "0 2px 16px rgba(104,127,229,0.09)",
        padding: "32px 20px 26px 20px",
        margin: "0 auto 24px auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      data-testid="quote-of-the-day-widget"
    >
      <div
        style={{
          fontSize: "1.23rem",
          color: "#3B1877",
          fontWeight: 700,
          textAlign: "center",
          letterSpacing: 0.02,
          marginBottom: 10,
          lineHeight: 1.37,
          fontFamily: '"Helvetica Neue", Arial, sans-serif',
          textShadow: "0 3px 10px rgba(104,127,229,0.07)",
        }}
        data-testid="quote-text"
      >
        “{quote}”
      </div>
      <div
        style={{
          fontSize: "1.07rem",
          color: "#B67BCB",
          fontWeight: 600,
          marginTop: 2,
          textAlign: "center",
          letterSpacing: 0.01,
        }}
        data-testid="quote-author"
      >
        — {author}
      </div>
    </section>
  );
}

export default QuoteOfTheDayWidget;
