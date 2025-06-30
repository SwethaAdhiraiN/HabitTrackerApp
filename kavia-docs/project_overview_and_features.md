# HabitTrackerApp Project Overview & Feature List

## Overview

**HabitTrackerApp** is a monolithic, full-stack web application designed to help users build and monitor daily habits. The app combines a Flask-based backend, a React-based frontend UI, and flat-file JSON local storage to enable user authentication, habit management, progress tracking, motivational quotes, and a personalized dashboard experience.

**Key architectural qualities:**
- Single-container (monolithic) for local and beginner-friendly development
- All data is stored and retrieved via flat JSON files on disk (no DB server required)
- RESTful API serves the frontend, and all service logic is built for simplicity and easy inspection

---

## Architecture & Module Summary

### Frontend (`HabitTrackerApp/frontend`)

- **Built with React:** Components are organized under `src/`, with custom widgets and thematic design.
- **Main Routing:** The `App.js` sets up navigation between pages such as Home, Register, Login, and the Dashboard, using React Router.
- **Theming & Styles:** Uses both CSS Modules and theme variables for consistent design (`styles/theme.css`, `Dashboard.module.css`).

**Major Components:**
- **Home Page:** Welcoming entry with motivating quote and sample habits list.
- **Register/Login Pages:** User forms with client-side validation and integration with API endpoints.
- **Dashboard Page:** Aggregates habit lists, progress snapshots, quote-of-the-day, user info, and interactive calendar widgets:
  - **Habits List Widget:** Lists the user's current habits, progress, and visual status.
  - **Progress Snapshot Widget:** Summarizes recent activity (streaks, weekly completion, today's completion).
  - **QuoteOfTheDay Widget:** Fetches and displays a motivational quote.
  - **MiniCalendar Widget:** Displays a visual calendar with daily completion markers.
  - **User Header:** Shows user's avatar, greeting, date, and session/logout features.

### Backend (`HabitTrackerApp/backend`)

- **Framework:** Implemented using Flask with RESTful design for API endpoints.
- **CORS:** Fully enabled; allows accesses from the local frontend dev server.
- **Endpoints:**
  - **User Registration & Login** (`/api/register`, `/api/login`): Handles user onboarding, local authentication.
  - **Profile** (`/api/profile/<id>`): Retrieve user info.
  - **Habits CRUD:** Create, update, list, and delete personal habits.
  - **Progress Tracking:** Register and view daily completions for each habit.
  - **Quote Retrieval:** Rotating "quote of the day" for motivation.
  - **Health Check:** To verify service status.

- **Data Storage:** Reads and writes directly to JSON files in `HabitTrackerApp/database/` (`users.json`, `habits.json`, `progress.json`, `quotes.json`).

- **Testing:**
  - **Manual Endpoint Test Scripts** (`manual_register_api_test.py`)
  - **Integration Test Suite** (`test_end_to_end_api.py`): Validates entire flow—register/login, habit management, progress recording, quotes.

### Database (Local JSON Storage)

- **Location:** `HabitTrackerApp/database/`
- **Files:**
  - `users.json` – Stores user identity, credentials, and profile settings.
  - `habits.json` – Stores each user's personalized habit definitions, recurrence, and streaks.
  - `progress.json` – Tracks daily completions for all habits, mapped per user and date.
  - `quotes.json` – Database of motivational quotes, cycling for daily display.

- **Notes:** Storage is ephemeral, not intended for production use, and all mutations happen via backend API.

---

## Implemented Feature List

### General App Features

- User registration with email, password, and optional avatar
- Secure login and session handling (simple local/session storage-based)
- Fully styled responsive React UI with theming and modern layout
- Motivational homepage with sample habits and quote

### Dashboard & Tracking Features

- **Personalized dashboard:**
  - View a list of customized habits, progress, current streaks, and completion markers
  - Visual widgets: MiniCalendar, ProgressSnapshot, motivational Quote, UserHeader with greeting
- **Habits management (CRUD):**
  - Create, view, update, and delete user-defined habits (with recurrence and metadata)
- **Daily progress tracking:**
  - Mark completion of habits for any given day
  - Streak calculation and weekly completion percentage
- **Quotes:**
  - Display and automatic refresh of motivational quotes
- **User profile & session:**
  - Display name/greeting, avatar, and session/logout controls

### Data & API

- **Backend APIs:**
  - `/api/register`, `/api/login`
  - `/api/habits` (list, create), `/api/habits/<id>` (update, delete)
  - `/api/progress` (record/view completions)
  - `/api/quote` (daily quote)
- **Flat-file persistence:** All API endpoints mutate JSON records; DB is not required

### Testing & Quality

- End-to-end coverage for all major back-end endpoints and flows
- Manual test scripts for registration and login
- Integrated local dev setup (Python virtualenv for backend, `npm` for frontend)

---

## Current Limitations

- Storage is not persistent for production-grade reliability (for demonstration/local use only)
- No OAuth/integration with external ID providers; only local user/password
- No role support or admin dashboard
- File uploads/avatars are references only; image upload not implemented
- Limited error handling (sufficient for demo/testing, can be extended)
- Multi-user concurrency is limited by flat-file architecture

---

## Mermaid Architecture Diagram

```mermaid
graph TD
    subgraph Frontend (React)
        A1[Home Page]
        A2[Register Page]
        A3[Login Page]
        A4[Dashboard]
        A4a[HabitsList Widget]
        A4b[ProgressSnapshot Widget]
        A4c[QuoteOfTheDay Widget]
        A4d[MiniCalendar Widget]
        A4e[UserHeader]
        A1 -->|/register, /login, /dashboard| A2
        A1 --> A3
        A1 --> A4
        A4 --> A4a
        A4 --> A4b
        A4 --> A4c
        A4 --> A4d
        A4 --> A4e
    end

    subgraph Backend (Flask API)
        B1[/api/register, /api/login, /api/profile, /api/habits, /api/progress, /api/quote/]
    end

    subgraph Database (JSON)
        D1[users.json]
        D2[habits.json]
        D3[progress.json]
        D4[quotes.json]
    end

    A1 -->|Fetches/POSTS| B1
    A2 -->|Registers| B1
    A3 -->|Logins| B1
    A4 -->|Habit & Progress APIs| B1
    B1 --> D1
    B1 --> D2
    B1 --> D3
    B1 --> D4
```

---

## Conclusion

As of now, HabitTrackerApp provides a complete local habit tracking platform with modern UI/UX, local persistent storage, and all core features implemented. The current state is stable and well-structured for further extension, either for production hardening or new feature development.

---

### Sources

- `HabitTrackerApp/frontend/src/App.js`
- `HabitTrackerApp/frontend/src/Dashboard.js`
- `HabitTrackerApp/frontend/src/ProgressSnapshotWidget.js`
- `HabitTrackerApp/frontend/src/MiniCalendarWidget.js`
- `HabitTrackerApp/frontend/src/UserHeader.js`
- `HabitTrackerApp/frontend/src/Login.js`
- `HabitTrackerApp/frontend/src/DashboardRoutesPlaceholders.js`
- `HabitTrackerApp/backend/app.py`
- `HabitTrackerApp/backend/manual_register_api_test.py`
- `HabitTrackerApp/backend/test_end_to_end_api.py`
- `HabitTrackerApp/database/README.md`
