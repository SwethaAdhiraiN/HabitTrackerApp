# HabitTrackerApp Database Directory

This folder contains local flat-file JSON storage for the application backend. 
**No external DB required.** Files are directly modified by the Flask backend at runtime.

## Audit and Structure

- `users.json` — User registry (id, name, email, pass, avatar, join_date)
- `habits.json` — User habit definitions (user-scoped, id, days, streak, etc)
- `progress.json` — Per-user daily progress snapshots
- `quotes.json` — Rotating quote-of-the-day records

## Notes

- Files are *not* versioned/migrated; treat as ephemeral for demo/local deployment.
- No sensitive data should be stored in production.
- Modifications only via backend API for app persistency.
