# HabitTrackerApp Backend

This folder contains the Flask RESTful API backend for the HabitTrackerApp.

## Audit Results & Structure

- **Entrypoint:** `app.py` – runs with `Flask` and exposes full REST API at `/api/*`
- **CORS:** Fully enabled for `/api/*` endpoints, configured via `flask-cors`
- **Database:** Reads/writes to `../database/*.json` (no DB server needed)
    - `users.json`, `habits.json`, `progress.json`, `quotes.json`
- **Routes:** Includes register, login, habits CRUD, progress tracking, quotes, and health check
- **Dependencies (requirements.txt):** All required (`flask`, `flask-cors`, `flask-restful`, `flask-login`, `gunicorn`)
    - Verified versions lock compatible
    - If missing or out of sync, run `pip install -r requirements.txt`
- **Configuration:** No extra config file; uses .json and OS path logic

## Setup

- Install dependencies in a virtualenv:
  ```
  python3 -m venv venv
  source venv/bin/activate
  pip install -r requirements.txt
  ```

## Running

- Start the backend with:
  ```
  python app.py
  ```
  The server runs on `http://localhost:5000/`.

## Structure

- `app.py` — Flask API entrypoint and route definitions
- `requirements.txt` — All necessary packages for API/UI CORS
- `../database/` — Flat-file storage (no migrations needed)

