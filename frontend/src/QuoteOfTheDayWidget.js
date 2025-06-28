import React from "react";
import styles from "./styles/Dashboard.module.css";

/**
 * PUBLIC_INTERFACE
 * QuoteOfTheDayWidget displays a motivational quote and its author, styled for Dashboard sidebar cards.
 * Fallback quote is used if none provided. Layout always centers, maximizes readability, and enforces consistent pastel theming.
 *
 * Props:
 *   quoteObj?: {text: string, author: string}
 */
function QuoteOfTheDayWidget({ quoteObj }) {
  // Fallback quote and author (ensures something inspirational is always shown)
  const fallback = {
    text: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe",
  };
  // Robustly pick quote and author or fallback
  const quoteText =
    quoteObj && typeof quoteObj.text === "string" && quoteObj.text.trim()
      ? quoteObj.text.trim()
      : fallback.text;
  const quoteAuthor =
    quoteObj && typeof quoteObj.author === "string" && quoteObj.author.trim()
      ? quoteObj.author.trim()
      : fallback.author;

  return (
    <div
      className={styles.quoteWidgetContainer}
      data-testid="quote-of-day-widget"
      aria-label="Quote of the Day"
      tabIndex={0}
    >
      <div
        className={styles.quoteText}
        aria-label="Motivational Quote"
        // Fallback foreground color guarantees visibility even if CSS variables are missing/misapplied
        style={{
          color: "var(--ht-primary-text, #26104d)",
          textShadow: "0 3px 11px rgba(104,127,229,0.11)",
          background: "transparent",
          fontWeight: 700,
          fontSize: "1.23rem",
          maxWidth: 326,
          width: "100%",
          marginBottom: 7,
          textAlign: "center",
        }}
        data-testid="quote-text"
        tabIndex={0}
      >
        {"\u201C"}
        {quoteText}
        {"\u201D"}
      </div>
      <div
        className={styles.quoteAuthor}
        aria-label="Quote Author"
        style={{
          color: "var(--ht-primary, #947AE1)",
          background: "transparent",
          fontWeight: 600,
          fontSize: "1.08rem",
          width: "100%",
          textAlign: "center",
          marginTop: 6,
        }}
        data-testid="quote-author"
        tabIndex={0}
      >
        — {quoteAuthor}
      </div>
    </div>
  );
}

export default QuoteOfTheDayWidget;
