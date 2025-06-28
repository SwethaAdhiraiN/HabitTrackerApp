import React from "react";
import styles from "./styles/Dashboard.module.css";

/**
 * PUBLIC_INTERFACE
 * QuoteOfTheDayWidget displays a motivational quote and its author in a pastel, rounded container styled to match the Dashboard.
 * Ensures highly visible, accessible text with dashboard-wide pastel palette. Defaults to a positive preset if no quote is provided or if fields are empty.
 *
 * Props:
 *   quoteObj: {text: string, author: string}
 */
function QuoteOfTheDayWidget({ quoteObj }) {
  // Fallback quote/author for robustness and demo
  const fallback = {
    text: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe",
  };
  // Defensive nullish/empty checks
  const quoteText =
    quoteObj && typeof quoteObj.text === "string" && quoteObj.text.trim()
      ? quoteObj.text.trim()
      : fallback.text;
  const quoteAuthor =
    quoteObj && typeof quoteObj.author === "string" && quoteObj.author.trim()
      ? quoteObj.author.trim()
      : fallback.author;

  return (
    <section
      className={styles.quoteWidgetContainer}
      data-testid="quote-of-day-widget"
      aria-label="Quote of the Day"
      tabIndex={0}
      style={{
        // Inline defense: never hidden, visible, pastel, readable, pastel border
        visibility: "visible",
        opacity: 1,
        zIndex: 5,
        background: "var(--ht-surface, #F7F6FD)",
        minHeight: 90,
        border: "1.2px solid #E3D3F6",
        boxShadow: "0 3px 14px 0 rgba(104,127,229,0.10)",
      }}
    >
      <div
        className={styles.quoteText}
        aria-label="Motivational Quote"
        style={{
          userSelect: "text",
          pointerEvents: "auto",
          background: "transparent",
          padding: "0 2px",
        }}
      >
        {"\u201C"}
        {quoteText}
        {"\u201D"}
      </div>
      <div
        className={styles.quoteAuthor}
        aria-label="Quote Author"
        style={{
          userSelect: "text",
          pointerEvents: "auto",
          background: "transparent",
          marginTop: 7,
        }}
      >
        — {quoteAuthor}
      </div>
    </section>
  );
}

export default QuoteOfTheDayWidget;
