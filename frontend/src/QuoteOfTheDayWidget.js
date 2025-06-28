import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

/**
 * PUBLIC_INTERFACE
 * QuoteOfTheDayWidget (dashboard) - Shows a random quote from backend, refreshing every 20 seconds.
 * No timer label or explanation is present, just quote and author.
 */
function QuoteOfTheDayWidget() {
  const [quote, setQuote] = useState({ text: "", author: "" });
  // To avoid unwanted double intervals
  const intervalRef = useRef(null);

  // Fetch random quote from backend
  const fetchQuote = async () => {
    try {
      // API endpoint assumed as backend's /api/quotes/random (update if needed)
      const response = await axios.get("/api/quotes/random");
      const data = response.data;
      // Accept either { text, author } or { quote: { text, author } }
      if ("text" in data && "author" in data) setQuote({ text: data.text, author: data.author });
      else if ("quote" in data) setQuote({ text: data.quote.text, author: data.quote.author });
    } catch (e) {
      // Fallback or silent error
      setQuote({
        text: "Start each day with a grateful heart.",
        author: "Unknown",
      });
    }
  };

  useEffect(() => {
    fetchQuote();
    // Set interval for refresh
    intervalRef.current = setInterval(fetchQuote, 20000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div
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
        minHeight: 78,
        transition: "all 0.3s cubic-bezier(.4,1.1,.8,1)", // For visual seamlessness
      }}
    >
      <div
        style={{
          fontSize: "1.24rem",
          color: "var(--ht-primary-text)",
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.36,
          maxWidth: 280,
          fontFamily: '"Helvetica Neue", Arial, sans-serif',
          textShadow: "0 3px 14px rgba(104,127,229,0.07)",
          transition: "color 0.18s cubic-bezier(.2,.7,.5,1)",
        }}
      >
        {quote.text && `"${quote.text}"`}
      </div>
      {quote.author && (
        <div
          style={{
            fontSize: "1.05rem",
            color: "var(--ht-primary)",
            fontWeight: 600,
            marginTop: 8,
            textAlign: "center",
            transition: "color 0.18s cubic-bezier(.2,.7,.5,1)",
          }}
        >
          — {quote.author}
        </div>
      )}
    </div>
  );
}

export default QuoteOfTheDayWidget;
