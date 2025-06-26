# HabitTrackerApp Backend

This folder contains the Flask RESTful API backend for the HabitTrackerApp.

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

- `app.py` — Flask entrypoint, ready to add resource routes and logic.
