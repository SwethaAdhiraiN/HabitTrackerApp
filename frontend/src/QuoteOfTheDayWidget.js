import React from "react";

/**
 * PUBLIC_INTERFACE
 * QuoteOfTheDayWidget displays the quote text and author in a pastel card styled to match the dashboard.
 * Ensures highly visible content with dashboard-pastel backgrounds and readable font/colors.
 * 
 * Props:
 *   quoteObj: {text: string, author: string}
 */
function QuoteOfTheDayWidget({ quoteObj }) {
  // If no quoteObj provided, show default/fallback
  if (!quoteObj)
    quoteObj = {
      text: "Start where you are. Use what you have. Do what you can.",
      author: "Arthur Ashe",
    };

  // Restored: Proper return and visually prominent pastel-styled card
  return (
    <section
      style={{
        width: "100%",
        background: "linear-gradient(90deg, #F3E7FA 0%, #DCF2FF 100%)",
        borderRadius: 18,
        boxShadow: "0 2px 12px rgba(135,105,255,0.09)",
        padding: "25px 20px 20px 20px",
        margin: "0 0 24px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 90,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: "1.22rem",
          color: "var(--ht-primary-text, #37265F)",
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.4,
          letterSpacing: 0.04,
          marginBottom: 10,
          maxWidth: 310,
          fontFamily: '"Helvetica Neue", Arial, sans-serif',
          textShadow: "0 2px 14px rgba(135,105,255,0.07)",
        }}
      >
        {"\u201C"}
        {quoteObj.text}
        {"\u201D"}
      </div>
      <div
        style={{
          fontSize: "1.04rem",
          color: "var(--ht-primary, #976EDE)",
          fontWeight: 600,
          marginTop: 2,
          textAlign: "center",
          fontFamily: '"Helvetica Neue", Arial, sans-serif',
          letterSpacing: 0.01,
        }}
      >
        — {quoteObj.author}
      </div>
    </section>
  );
}

export default QuoteOfTheDayWidget;
