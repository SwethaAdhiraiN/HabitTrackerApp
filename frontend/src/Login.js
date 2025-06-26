import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/theme.css";

/**
 * PUBLIC_INTERFACE
 * Login page for HabitTrackerApp.
 * This component mirrors the structure and visual design of the Register page:
 * - Centered modal/card, soft pastel gradient background
 * - Inputs: Email and Password
 * - Large "Sign In" button, visually prominent
 * - Footer prompt: "Don’t have an account?" + link to /register
 * - All styles use shared theme (theme.css) and palette
 */
function Login() {
  // State for form controls and feedback
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  // Simple email and password validation
  const validateEmail = (value) =>
    /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
  const validatePassword = (value) => value.length >= 6;

  const emailError =
    touched.email && !validateEmail(email) ? "Enter a valid email address." : "";
  const passwordError =
    touched.password && !validatePassword(password)
      ? "Password must be at least 6 characters."
      : "";

  // PUBLIC_INTERFACE
  function handleSubmit(e) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (validateEmail(email) && validatePassword(password)) {
      // POST to /api/login
      fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password
        })
      })
        .then(async (resp) => {
          if (resp.ok) {
            setSubmitted(true);
            // TODO: store auth state, redirect to dashboard, etc.
          } else {
            setSubmitted(false);
            const result = await resp.json();
            alert((result && result.message) || "Login failed");
          }
        })
        .catch((err) => {
          alert("Failed to login: " + (err.message || ""));
          setSubmitted(false);
        });
    }
  }

  // Styles consistent with Register.js/modal
  const styleVars = {
    modalMaxWidth: 440,
    modalPadding: "38px 32px 32px 32px",
    modalBorderRadius: 28,
    modalShadow: "0 4px 24px 0 rgba(72,73,121,0.06)",
    inputRadius: 12,
    buttonRadius: 22,
    backgroundGradient: "linear-gradient(135deg, #fdf0f7 0%, #f7f2fd 100%)",
    accentPurple: "#6A5CFA",
    accentPurpleHover: "#5846e8",
    mainHeading: "#292661",
    bodyText: "#848299",
    borderGray: "#f0f0f6",
    modalBg: "#fff",
    linkColor: "#6A5CFA",
  };

  const isMobile = window.innerWidth <= 520;

  return (
    <div
      className="login-background"
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: styleVars.backgroundGradient,
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      <div
        className="login-modal"
        style={{
          width: isMobile ? "98vw" : styleVars.modalMaxWidth,
          maxWidth: 480,
          boxSizing: "border-box",
          background: styleVars.modalBg,
          borderRadius: styleVars.modalBorderRadius,
          boxShadow: styleVars.modalShadow,
          padding: isMobile ? "18px 6vw" : styleVars.modalPadding,
          border: `1.5px solid ${styleVars.borderGray}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: styleVars.mainHeading,
            letterSpacing: 0,
            lineHeight: 1.12,
            margin: 0,
            marginBottom: 28,
            textAlign: "center",
          }}
        >
          Welcome Back!
        </h1>

        <form
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
          onSubmit={handleSubmit}
          autoComplete="off"
          noValidate
        >
          {/* Email Input */}
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="login-email"
              style={{
                color: styleVars.bodyText,
                display: "block",
                fontWeight: 400,
                fontSize: "1rem",
                marginBottom: 6,
                letterSpacing: 0,
              }}
            >
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              spellCheck="false"
              autoComplete="username"
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              style={{
                width: "100%",
                fontSize: "1rem",
                fontWeight: 400,
                padding: "10px 16px",
                border: `1px solid ${emailError ? "#F87A77" : styleVars.borderGray}`,
                borderRadius: styleVars.inputRadius,
                outline: emailError ? "1.5px solid #F87A77" : "none",
                marginBottom: emailError ? 3 : 0,
                background: "#fff",
                color: styleVars.mainHeading,
                transition: "border 0.2s, outline 0.2s",
                boxSizing: "border-box",
              }}
              required
              aria-invalid={!!emailError}
              aria-describedby="email-error"
            />
            {emailError && (
              <div
                id="email-error"
                className="text-error"
                style={{
                  fontSize: "0.98em",
                  color: "#F87A77",
                  marginTop: 2,
                  marginBottom: 0,
                }}
              >
                {emailError}
              </div>
            )}
          </div>
          {/* Password Input */}
          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="login-password"
              style={{
                color: styleVars.bodyText,
                display: "block",
                fontWeight: 400,
                fontSize: "1rem",
                marginBottom: 6,
                letterSpacing: 0,
              }}
            >
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              style={{
                width: "100%",
                fontSize: "1rem",
                fontWeight: 400,
                padding: "10px 16px",
                border: `1px solid ${
                  passwordError ? "#F87A77" : styleVars.borderGray
                }`,
                borderRadius: styleVars.inputRadius,
                outline: passwordError ? "1.5px solid #F87A77" : "none",
                marginBottom: passwordError ? 3 : 0,
                background: "#fff",
                color: styleVars.mainHeading,
                transition: "border 0.2s, outline 0.2s",
                boxSizing: "border-box",
              }}
              required
              autoComplete="current-password"
              aria-invalid={!!passwordError}
              aria-describedby="password-error"
            />
            {passwordError && (
              <div
                id="password-error"
                className="text-error"
                style={{
                  fontSize: "0.98em",
                  color: "#F87A77",
                  marginTop: 2,
                  marginBottom: 0,
                }}
              >
                {passwordError}
              </div>
            )}
          </div>
          {/* Sign In Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: styleVars.buttonPadding || "12px 0",
              border: "none",
              borderRadius: styleVars.buttonRadius,
              fontWeight: 600,
              fontSize: "1rem",
              background: styleVars.accentPurple,
              color: "#fff",
              boxShadow: "0 2px 12px rgba(106,92,250,0.09)",
              transition: "background 0.23s",
              cursor: "pointer",
              outline: "none",
              marginBottom: submitted ? "12px" : "0",
            }}
            onMouseOver={e =>
              (e.currentTarget.style.background = styleVars.accentPurpleHover)
            }
            onFocus={e =>
              (e.currentTarget.style.background = styleVars.accentPurpleHover)
            }
            onMouseOut={e =>
              (e.currentTarget.style.background = styleVars.accentPurple)
            }
            onBlur={e =>
              (e.currentTarget.style.background = styleVars.accentPurple)
            }
            aria-label="Sign in to your HabitTrackerApp account"
          >
            Sign In
          </button>
          {/* Login Success Message (Simulated) */}
          {submitted && (
            <div
              style={{
                marginTop: 14,
                color: styleVars.accentPurple,
                textAlign: "center",
                fontWeight: 500,
                fontSize: "1.06em",
              }}
            >
              Login successful!
            </div>
          )}
        </form>
        {/* Footer action (Register prompt) */}
        <div
          className="login-footer"
          style={{
            marginTop: 20,
            fontSize: "0.96rem",
            width: "100%",
            textAlign: "center",
            color: styleVars.bodyText,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          <span>Don&#39;t have an account?</span>
          <button
            type="button"
            style={{
              background: "none",
              border: "none",
              color: styleVars.linkColor,
              fontWeight: 500,
              fontSize: "0.96rem",
              textDecoration: "none",
              cursor: "pointer",
              padding: 0,
              marginLeft: 6,
              outline: "none",
            }}
            onClick={() => navigate("/register")}
            onMouseOver={e => (e.currentTarget.style.textDecoration = "underline")}
            onFocus={e => (e.currentTarget.style.textDecoration = "underline")}
            onMouseOut={e => (e.currentTarget.style.textDecoration = "none")}
            onBlur={e => (e.currentTarget.style.textDecoration = "none")}
            aria-label="Go to Register"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
