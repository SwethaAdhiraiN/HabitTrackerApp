import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/theme.css";

/**
 * PUBLIC_INTERFACE
 * Register page for HabitTrackerApp.
 *
 * IMPORTANT:
 * - This component sends POST requests to '/api/register' (relative path) so React proxy or CORS works as intended.
 * - Do NOT use a full URL (e.g., 'http://localhost:5000/api/register') or the proxy will be bypassed.
 * - Payload sent: { name: str, email: str, password: str }
 * - On registration success, the backend returns { success: true, user: {fields} } in JSON.
 * - Upon success, user is routed to '/dashboard'.
 * See CORS_and_Proxy_Working_Configuration.md for proxy/CORS overview.
 *
 * Fully matches the register design reference:
 * - Modal, pastel gradient background, beautiful spacing
 * - Inputs, button, colors, and alignment as per extracted design notes
 */
function Register() {
  // State for form controls and feedback
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); // Adds error display for duplicate email or other errors

  const navigate = useNavigate();

  // Validation
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
    setErrorMsg(""); // Clear last error
    if (validateEmail(email) && validatePassword(password)) {
      fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: email.split("@")[0] || "User",
          email: email.trim(),
          password: password
        })
      })
        .then(async (resp) => {
          const contentType = resp.headers.get("content-type");
          if (resp.ok && contentType && contentType.includes("application/json")) {
            setSubmitted(true);
            try {
              const result = await resp.json();
              if (result && result.success) {
                setTimeout(() => {
                  navigate("/dashboard");
                }, 650);
                return;
              }
              // For backup, show error message from body (should not hit here, but just in case)
              setErrorMsg(result && result.message ? result.message : "Registration failed. Please try again.");
              setSubmitted(false);
            } catch {
              setErrorMsg("Registration failed: Invalid response from server.");
              setSubmitted(false);
            }
          } else {
            let errorMessage = "Registration failed: Unable to connect to the server or invalid response.";
            try {
              if (contentType && contentType.includes("application/json")) {
                const errorResult = await resp.json();
                // If this is the duplicate email error (HTTP 409), detect and display as a warning
                if (resp.status === 409 && errorResult && errorResult.message &&
                    (errorResult.message.toLowerCase().includes("email already registered") ||
                     errorResult.message.toLowerCase().includes("already registered"))
                ) {
                  setErrorMsg("User email already registered");
                } else if (errorResult && errorResult.message) {
                  errorMessage = errorResult.message;
                  setErrorMsg(errorMessage);
                } else {
                  setErrorMsg(errorMessage);
                }
              } else {
                setErrorMsg(errorMessage);
              }
            } catch {
              setErrorMsg(errorMessage);
            }
            setSubmitted(false);
          }
        })
        .catch((err) => {
          setErrorMsg("Registration failed: Network error, misconfigured proxy, or backend not running. " + (err.message || ""));
          setSubmitted(false);
        });
    }
  }

  // -- Styles according to design reference --
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

  // Responsive modal width and padding for smaller screens
  const isMobile = window.innerWidth <= 520;

  return (
    <div
      className="register-background"
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
        className="register-modal"
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
          Create Account
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
          {/* Email */}
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="register-email"
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
              id="register-email"
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
          {/* Password */}
          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="register-password"
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
              id="register-password"
              name="password"
              type="password"
              placeholder="Enter a password"
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
              autoComplete="new-password"
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
          {/* Register Button */}
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
            aria-label="Register for a new HabitTrackerApp account"
          >
            Register
          </button>
          {/* Duplicate Email or Error Message */}
          {errorMsg && (
            <div
              style={{
                marginTop: 14,
                marginBottom: 4,
                color: "var(--ht-error, #F87A77)",
                textAlign: "center",
                fontWeight: 600,
                fontSize: "1.07em",
                letterSpacing: 0,
                padding: 0,
                lineHeight: 1.3,
                minHeight: 17,
                /* accessibility: readable and stands out */
              }}
              role="alert"
              aria-live="polite"
            >
              {errorMsg}
            </div>
          )}
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
              Registration successful!
            </div>
          )}
        </form>
        {/* Footer action (Sign in) */}
        <div
          className="register-footer"
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
          <span>Already have an account?</span>
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
            onClick={() => navigate("/login")}
            onMouseOver={e => (e.currentTarget.style.textDecoration = "underline")}
            onFocus={e => (e.currentTarget.style.textDecoration = "underline")}
            onMouseOut={e => (e.currentTarget.style.textDecoration = "none")}
            onBlur={e => (e.currentTarget.style.textDecoration = "none")}
            aria-label="Go to Login"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
