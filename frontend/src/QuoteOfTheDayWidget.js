import React, { useEffect, useState } from "react";
import styles from "./styles/Dashboard.module.css";

/**
 * PUBLIC_INTERFACE
 * QuoteOfTheDayWidget displays a motivational quote and author in a pastel, centered card.
 * Quote and author are fetched from the local database. Restores display after UI/style refactor.
 */
function QuoteOfTheDayWidget() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    // Simulate fetch - in real app, fetch from backend
    fetch("/database/quotes.json")
      .then((resp) => resp.json())
      .then((quotesArr) => {
        const idx = Math.floor(Math.random() * quotesArr.length);
        setQuote(quotesArr[idx]?.quote ?? "");
        setAuthor(quotesArr[idx]?.author ?? "");
      })
      .catch(() => {
        setQuote("Start where you are. Use what you have. Do what you can.");
        setAuthor("Arthur Ashe");
      });
  }, []);

  // Fix: Ensure the container and text are visible even if quote/author are missing, and preserve pastel UI
  return (
    <section
      className={styles.quoteWidgetContainer}
      style={{
        background: "rgba(255,255,255,0.96)",
        borderRadius: 18,
        boxShadow: "0 2px 12px rgba(123,97,255,0.11)",
        padding: "28px 18px 24px 18px",
        marginBottom: 24,
        width: "100%",
        maxWidth: 390,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: quote || author ? 98 : 50,
      }}
    >
      <div
        style={{
          fontSize: "1.22rem",
          color: "var(--ht-primary-text, #3B1877)",
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.36,
          letterSpacing: 0.04,
          marginBottom: 8,
          maxWidth: 330,
          fontFamily: '"Helvetica Neue", Arial, sans-serif',
          textShadow: "0 3px 12px rgba(104,127,229,0.08)",
          opacity: quote ? 1 : 0.7,
          minHeight: 30,
        }}
        data-testid="quote-text"
      >
        {quote ? `“${quote}”` : "No quote available."}
      </div>
      <div
        style={{
          fontSize: "1.05rem",
          color: "var(--ht-primary, #947AE1)",
          fontWeight: 600,
          marginTop: 3,
          textAlign: "center",
          letterSpacing: 0.007,
          opacity: author ? 1 : 0.8,
          minHeight: 22,
        }}
        data-testid="quote-author"
      >
        {author ? `— ${author}` : ""}
      </div>
    </section>
  );
}

export default QuoteOfTheDayWidget;
