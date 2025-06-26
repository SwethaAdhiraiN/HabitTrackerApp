import os
import json
import random
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

DATABASE_DIR = os.path.join(os.path.dirname(__file__), '../database')
USERS_FILE = os.path.join(DATABASE_DIR, "users.json")
HABITS_FILE = os.path.join(DATABASE_DIR, "habits.json")
PROGRESS_FILE = os.path.join(DATABASE_DIR, "progress.json")
QUOTES_FILE = os.path.join(DATABASE_DIR, "quotes.json")

# ---- HELPER FUNCTIONS ----
def read_json(file_path, default=None):
    """Safely read JSON array from a file. Returns default (usually list) if path or parse fails."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default if default is not None else []

def write_json(file_path, data):
    """Write data (list or dict) to file as JSON. Overwrites existing content."""
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def get_next_id(items, id_field="id"):
    """Find max existing id in array and return next id, starting from 1."""
    if not items:
        return 1
    max_id = max((item.get(id_field, 0) for item in items if item and id_field in item), default=0)
    return max_id + 1

def basic_email_format(email):
    """Minimal, non-exhaustive email validation for demo."""
    return isinstance(email, str) and "@" in email and "." in email.lower() and len(email) >= 6

def today_date():
    """Return YYYY-MM-DD string for today."""
    return datetime.date.today().isoformat()

# PUBLIC_INTERFACE
def create_app():
    """
    Creates and configures the Flask application for HabitTrackerApp backend.
    Provides REST APIs for user authentication, habit management, progress tracking, and motivational quotes.
    All data stored persistently in database/*.json files (file-based demo storage).
    """
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})  # Enable CORS globally for /api routes

    # ---- USER REGISTRATION ----
    # PUBLIC_INTERFACE
    @app.route("/api/register", methods=["POST"])
    def register():
        """
        Register a new user.
        Expects JSON: { "name": str, "email": str, "password": str }
        Returns: { "success": bool, "user": {fields} } or error message
        """
        data = request.get_json(force=True)
        users = read_json(USERS_FILE, [])
        required = ["name", "email", "password"]
        # Input validation, minimal for demo
        if not all(k in data and isinstance(data[k], str) and data[k].strip() for k in required):
            return jsonify({"success": False, "message": "Missing or invalid fields: name, email, password"}), 400
        if not basic_email_format(data["email"]):
            return jsonify({"success": False, "message": "Invalid email format"}), 400
        # Uniqueness check (email)
        if any(u["email"].lower() == data["email"].strip().lower() for u in users):
            return jsonify({"success": False, "message": "Email already registered"}), 409
        user_id = get_next_id(users)
        user = {
            "id": user_id,
            "name": data["name"].strip(),
            "email": data["email"].strip().lower(),
            "password": data["password"],  # Stored in plaintext for demo only!
            "avatar": f"https://ui-avatars.com/api/?name={data['name'].strip().replace(' ','+')}",
            "join_date": today_date(),
        }
        users.append(user)
        write_json(USERS_FILE, users)
        safe_user = user.copy()
        del safe_user["password"]
        return jsonify({"success": True, "user": safe_user}), 201

    # ---- USER LOGIN ----
    # PUBLIC_INTERFACE
    @app.route("/api/login", methods=["POST"])
    def login():
        """
        User login endpoint.
        Expects JSON: { "email": str, "password": str }
        Returns user profile and 'success' flag if credentials match.
        """
        data = request.get_json(force=True)
        email, pw = data.get("email", "").strip().lower(), data.get("password", "")
        users = read_json(USERS_FILE, [])
        if not email or not pw:
            return jsonify({"success": False, "message": "Missing or invalid email/password"}), 400
        # Do not leak info about which field failed: generic failure
        user = next((u for u in users if u.get("email", "").lower() == email), None)
        if not user or user.get("password") != pw:
            return jsonify({"success": False, "message": "Invalid credentials"}), 401
        resp_user = user.copy()
        del resp_user["password"]
        return jsonify({"success": True, "user": resp_user}), 200

    # ---- GET USER PROFILE BY ID ----
    # PUBLIC_INTERFACE
    @app.route("/api/user/<int:user_id>", methods=["GET"])
    def get_user(user_id):
        """
        Get a user's public profile by their unique ID.
        Path param: user_id (int)
        Returns user fields except password, or 404 if user not found.
        """
        users = read_json(USERS_FILE, [])
        user = next((u for u in users if u.get("id") == user_id), None)
        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404
        resp_user = user.copy()
        resp_user.pop("password", None)
        return jsonify({"success": True, "user": resp_user}), 200

    # ---- HABITS CRUD ----
    # PUBLIC_INTERFACE
    @app.route("/api/habits", methods=["GET"])
    def list_habits():
        """
        Get all habits for a user (by user_id optional query param).
        Query param: user_id (int, optional)
        Returns: [{habit}, ...]
        """
        user_id = request.args.get("user_id", type=int)
        habits = read_json(HABITS_FILE, [])
        if user_id is not None:
            habits = [h for h in habits if h.get("user_id") == user_id]
        return jsonify({"success": True, "habits": habits})

    # PUBLIC_INTERFACE
    @app.route("/api/habits", methods=["POST"])
    def create_habit():
        """
        Create a new habit.
        Expects JSON: { "user_id": int, "name": str, "icon": str, "days": [bool,...](optional, 7), "streak"(int,optional) }
        Returns created habit.
        """
        data = request.get_json(force=True)
        habits = read_json(HABITS_FILE, [])
        req_fields = ["user_id", "name", "icon"]
        if not all(k in data for k in req_fields):
            return jsonify({"success": False, "message": f"Missing required fields: {', '.join(req_fields)}"}), 400
        # Validate user exists
        users = read_json(USERS_FILE, [])
        if not any(u["id"] == data["user_id"] for u in users):
            return jsonify({"success": False, "message": "User not found"}), 404
        days = data.get("days", [False]*7)
        if not isinstance(days, list) or len(days) != 7 or any(type(d) is not bool for d in days):
            days = [False]*7
        habit = {
            "id": get_next_id(habits),
            "user_id": data["user_id"],
            "name": data["name"].strip(),
            "icon": data["icon"].strip(),
            "streak": int(data.get("streak") or 0),
            "days": days,
            "created_at": today_date()
        }
        habits.append(habit)
        write_json(HABITS_FILE, habits)
        return jsonify({"success": True, "habit": habit}), 201

    # PUBLIC_INTERFACE
    @app.route("/api/habits/<int:habit_id>", methods=["PUT"])
    def update_habit(habit_id):
        """
        Update a specific habit by its id.
        Path param: habit_id (int)
        Expects JSON with some of: { "name": str, "icon": str, "days": [bool,...], "streak": int }
        """
        habits = read_json(HABITS_FILE, [])
        i = next((idx for idx, h in enumerate(habits) if h.get("id") == habit_id), None)
        if i is None:
            return jsonify({"success": False, "message": "Habit not found"}), 404
        data = request.get_json(force=True)
        for field in ["name", "icon"]:
            if field in data and isinstance(data[field], str):
                habits[i][field] = data[field].strip()
        if "streak" in data:
            try:
                habits[i]["streak"] = int(data["streak"])
            except Exception:
                pass
        if "days" in data and isinstance(data["days"], list) and len(data["days"]) == 7:
            if all(type(d) is bool for d in data["days"]):
                habits[i]["days"] = data["days"]
        write_json(HABITS_FILE, habits)
        return jsonify({"success": True, "habit": habits[i]})

    # PUBLIC_INTERFACE
    @app.route("/api/habits/<int:habit_id>", methods=["DELETE"])
    def delete_habit(habit_id):
        """
        Delete a habit by its id.
        Path param: habit_id (int)
        Returns 204 (no content) on success.
        """
        habits = read_json(HABITS_FILE, [])
        i = next((idx for idx, h in enumerate(habits) if h.get("id") == habit_id), None)
        if i is None:
            return jsonify({"success": False, "message": "Habit not found"}), 404
        deleted = habits.pop(i)
        write_json(HABITS_FILE, habits)
        return "", 204

    # ---- PROGRESS (DAILY SNAPSHOT TRACKING) ----
    # PUBLIC_INTERFACE
    @app.route("/api/progress", methods=["GET"])
    def get_user_progress():
        """
        Get progress snapshots for a user, optionally by date.
        Query params: user_id (required), date (optional, YYYY-MM-DD)
        Returns: {progress: [progress_obj,...]}
        """
        user_id = request.args.get("user_id", type=int)
        if user_id is None:
            return jsonify({"success": False, "message": "user_id query param required"}), 400
        date = request.args.get("date")
        all_prog = read_json(PROGRESS_FILE, [])
        results = [p for p in all_prog if p.get("user_id") == user_id]
        if date:
            results = [p for p in results if p.get("date") == date]
        return jsonify({"success": True, "progress": results})

    # PUBLIC_INTERFACE
    @app.route("/api/progress", methods=["POST"])
    def post_progress():
        """
        Post a progress snapshot for a user for a date.
        Expects JSON: { "user_id": int, "date": str (YYYY-MM-DD), "habit_checkmarks": { habit_id: bool, ... } }
        Returns: {success: bool, progress: snapshot_obj}
        """
        data = request.get_json(force=True)
        req_fields = ["user_id", "date", "habit_checkmarks"]
        if not all(k in data for k in req_fields):
            return jsonify({"success": False, "message": f"Missing required fields: {', '.join(req_fields)}"}), 400
        try:
            # Validate date format
            datetime.datetime.strptime(data["date"], "%Y-%m-%d")
        except Exception:
            return jsonify({"success": False, "message": "Invalid date format; use YYYY-MM-DD"}), 400
        all_prog = read_json(PROGRESS_FILE, [])
        # Remove existing record for (user, date)
        all_prog = [p for p in all_prog if not (p.get("user_id") == data["user_id"] and p.get("date") == data["date"])]
        # Calculate total habits
        habits = read_json(HABITS_FILE, [])
        user_habits = [h for h in habits if h.get("user_id") == data["user_id"]]
        total_habits = len(user_habits)
        total_checked = sum(1 for h_id, checked in data["habit_checkmarks"].items() if checked)
        success_rate = (total_checked / total_habits) if total_habits else 0.0
        snapshot = {
            "user_id": data["user_id"],
            "date": data["date"],
            "habit_checkmarks": data["habit_checkmarks"],
            "total_checked": total_checked,
            "total_habits": total_habits,
            "success_rate": round(success_rate, 2),
        }
        all_prog.append(snapshot)
        write_json(PROGRESS_FILE, all_prog)
        return jsonify({"success": True, "progress": snapshot})

    # ---- QUOTES OF THE DAY ----
    # PUBLIC_INTERFACE
    @app.route("/api/quote", methods=["GET"])
    def get_quote():
        """
        Get the "quote of the day".
        Returns one quote from quotes.json based on date, cycling through if needed.
        """
        quotes = read_json(QUOTES_FILE, [])
        if not quotes:
            return jsonify({"success": False, "message": "No quotes found"}), 404
        # Pseudo-random (stable) selection for the day:
        day_idx = (datetime.date.today().day + datetime.date.today().month) % len(quotes)
        q = quotes[day_idx]
        return jsonify({"success": True, "quote": q})

    # ---- ROOT ROUTE ----
    # PUBLIC_INTERFACE
    @app.route("/")
    def root():
        """Simple health check endpoint."""
        return jsonify({"message": "HabitTrackerApp Flask backend running."})

    return app

if __name__ == "__main__":
    # PUBLIC_INTERFACE
    """Entrypoint for running the Flask app directly via `python app.py`."""
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=5000)
