import React, { useState } from 'react';
import './styles/theme.css';

// PUBLIC_INTERFACE
function Register() {
  /**
   * User registration page for account sign-up.
   * Renders a form for entering email and password, performs UI validation,
   * and applies HabitTrackerApp's global color palette for visual styling.
   */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitted, setSubmitted] = useState(false);

  // Simple email and password validation
  const validateEmail = (value) => /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
  const validatePassword = (value) => value.length >= 6;

  const emailError = touched.email && !validateEmail(email) ? 'Enter a valid email address.' : '';
  const passwordError =
    touched.password && !validatePassword(password)
      ? 'Password must be at least 6 characters.'
      : '';

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (validateEmail(email) && validatePassword(password)) {
      setSubmitted(true);
      // Backend integration would go here
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--ht-bg-main)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <form
        className="card"
        style={{
          maxWidth: 350,
          width: '100%',
          boxSizing: 'border-box',
          margin: '2em 0',
          background: 'var(--ht-bg-secondary)',
        }}
        autoComplete="off"
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1.4em' }}>Create Account</h2>
        <div style={{ marginBottom: '1em' }}>
          <label
            htmlFor="register-email"
            style={{
              display: 'block',
              marginBottom: 4,
              color: 'var(--ht-secondary-text)',
              fontWeight: 500,
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
            className={emailError ? 'text-error' : ''}
            style={{
              width: '100%',
              marginBottom: emailError ? 2 : 10,
              borderColor: emailError ? 'var(--ht-error)' : 'var(--ht-border)',
            }}
            required
            aria-invalid={!!emailError}
            aria-describedby="email-error"
          />
          {emailError && (
            <div id="email-error" className="text-error" style={{ fontSize: '0.98em' }}>
              {emailError}
            </div>
          )}
        </div>
        <div style={{ marginBottom: '1em' }}>
          <label
            htmlFor="register-password"
            style={{
              display: 'block',
              marginBottom: 4,
              color: 'var(--ht-secondary-text)',
              fontWeight: 500,
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
            className={passwordError ? 'text-error' : ''}
            style={{
              width: '100%',
              marginBottom: passwordError ? 2 : 10,
              borderColor: passwordError ? 'var(--ht-error)' : 'var(--ht-border)',
            }}
            required
            autoComplete="new-password"
            aria-invalid={!!passwordError}
            aria-describedby="password-error"
          />
          {passwordError && (
            <div id="password-error" className="text-error" style={{ fontSize: '0.98em' }}>
              {passwordError}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="button-primary"
          style={{
            width: '100%',
            marginTop: '6px',
            marginBottom: submitted ? 12 : 0,
            background: 'var(--ht-primary)',
            color: '#fff',
          }}
        >
          Register
        </button>
        {submitted && (
          <div
            style={{
              marginTop: 14,
              color: 'var(--ht-primary)',
              textAlign: 'center',
              fontWeight: 500,
              fontSize: '1.06em',
            }}
          >
            Registration successful! (simulated)
          </div>
        )}
      </form>
      <div style={{ textAlign: 'center', color: 'var(--ht-secondary-text)', fontSize: '1em' }}>
        Already have an account?
        <a
          href="/login"
          style={{
            color: 'var(--ht-primary)',
            marginLeft: '7px',
            fontWeight: 500,
            textDecoration: 'underline',
            fontSize: '1em',
          }}
        >
          Sign In
        </a>
      </div>
    </div>
  );
}

export default Register;
