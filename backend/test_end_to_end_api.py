import os
import sys
import json
import time
import random
import string
import requests

# PUBLIC_INTERFACE
"""
End-to-end integration test for HabitTrackerApp Flask backend API.

Covers registration, login, user profile, habits CRUD, progress snapshot, and quote endpoints.
THIS FILE IS SAFE TO RUN LOCALLY WITHOUT MODIFYING PRODUCTION DATA
(Uses throwaway test users and cleans up after itself.)

Run with: python test_end_to_end_api.py
Requires: requests
"""

BASE = "http://localhost:5000/api"
TEST_NAME_PREFIX = "TestUserAPI"
TEST_EMAIL_DOMAIN = "@e2e.local"
TIMEOUT = 5

def rand_email():
    """Generates a random email for registration."""
    rand_part = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
    return f"{TEST_NAME_PREFIX.lower()}.{rand_part}{TEST_EMAIL_DOMAIN}"

def sleep_short():
    time.sleep(0.09)

def test_register_login_and_delete_user():
    print("Testing registration endpoint...")
    email = rand_email()
    password = "TestPassword123"
    reg_resp = requests.post(f"{BASE}/register", json={
        "name": TEST_NAME_PREFIX,
        "email": email,
        "password": password
    }, timeout=TIMEOUT)
    assert reg_resp.status_code == 201, f"Register failed: {reg_resp.text}"
    reg_json = reg_resp.json()
    assert reg_json.get("success"), f"Register not successful: {reg_json}"
    user = reg_json["user"]
    user_id = user["id"]
    print(f"Registered with user_id: {user_id}")

    print("Testing login endpoint...")
    login_resp = requests.post(f"{BASE}/login", json={
        "email": email,
        "password": password
    }, timeout=TIMEOUT)
    assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
    login_json = login_resp.json()
    assert login_json.get("success"), f"Login not successful: {login_json}"
    assert login_json["user"]["email"] == email

    print("Testing get user profile endpoint...")
    profile_resp = requests.get(f"{BASE}/user/{user_id}", timeout=TIMEOUT)
    assert profile_resp.status_code == 200, f"Get user failed: {profile_resp.text}"
    prof_json = profile_resp.json()
    assert prof_json.get("user")["email"] == email

    return {"id": user_id, "email": email, "password": password}

def test_habit_crud_flow(user):
    print("Testing habits CRUD endpoints...")
    # Create
    create_resp = requests.post(f"{BASE}/habits", json={
        "user_id": user["id"],
        "name": "Test Habit API",
        "icon": "book"
    }, timeout=TIMEOUT)
    assert create_resp.status_code == 201, f"Create habit failed: {create_resp.text}"
    habit = create_resp.json()["habit"]
    habit_id = habit["id"]

    # List (by user)
    list_resp = requests.get(f"{BASE}/habits", params={"user_id": user["id"]}, timeout=TIMEOUT)
    assert list_resp.status_code == 200
    habits = list_resp.json()["habits"]
    assert any(h["id"] == habit_id for h in habits), "Habit not found after create"

    # Update
    update_resp = requests.put(f"{BASE}/habits/{habit_id}", json={"name": "Updated Test Habit", "streak": 2}, timeout=TIMEOUT)
    assert update_resp.status_code == 200
    habit_upd = update_resp.json()["habit"]
    assert habit_upd["name"] == "Updated Test Habit"
    assert habit_upd["streak"] == 2

    # Delete
    del_resp = requests.delete(f"{BASE}/habits/{habit_id}", timeout=TIMEOUT)
    assert del_resp.status_code == 204

    # Confirm it’s deleted
    list_resp2 = requests.get(f"{BASE}/habits", params={"user_id": user["id"]}, timeout=TIMEOUT)
    assert not any(h["id"] == habit_id for h in list_resp2.json()["habits"]), "Habit not deleted"

def test_progress_endpoints(user):
    print("Testing progress endpoints...")
    today = time.strftime("%Y-%m-%d")
    # First, create a habit for the day
    habit_resp = requests.post(f"{BASE}/habits", json={
        "user_id": user["id"], "name": "ProgressDemo", "icon": "lotus"
    }, timeout=TIMEOUT)
    assert habit_resp.status_code == 201
    habit_id = habit_resp.json()["habit"]["id"]
    # Mark as done today
    prog_resp = requests.post(f"{BASE}/progress", json={
        "user_id": user["id"],
        "date": today,
        "habit_checkmarks": {str(habit_id): True}
    }, timeout=TIMEOUT)
    assert prog_resp.status_code == 200
    prog_json = prog_resp.json()["progress"]
    assert prog_json["total_checked"] == 1
    assert prog_json["total_habits"] >= 1
    assert "success_rate" in prog_json

    # Get progress for today
    get_resp = requests.get(f"{BASE}/progress", params={"user_id": user["id"], "date": today}, timeout=TIMEOUT)
    assert get_resp.status_code == 200
    found = False
    for p in get_resp.json().get("progress", []):
        if int(user["id"]) == int(p["user_id"]) and p["date"] == today:
            found = True
    assert found, "Progress not found for today/user"

    # Cleanup: delete the test habit
    del_resp = requests.delete(f"{BASE}/habits/{habit_id}", timeout=TIMEOUT)
    assert del_resp.status_code == 204

def test_quotes_endpoint():
    print("Testing quote of the day endpoint...")
    quote_resp = requests.get(f"{BASE}/quote", timeout=TIMEOUT)
    assert quote_resp.status_code == 200, f"Quote failed: {quote_resp.text}"
    q = quote_resp.json()
    assert "success" in q and q["success"]
    assert "quote" in q and isinstance(q["quote"], dict)

if __name__ == "__main__":
    # Ensure backend service is running before invoking!
    print("======== E2E API TESTS FOR HabitTrackerApp BACKEND ========\n")
    try:
        health = requests.get("http://localhost:5000/", timeout=TIMEOUT)
        assert health.status_code == 200
        print("Backend health check: OK")
        # Registration, login, user profile
        test_user = test_register_login_and_delete_user()
        sleep_short()
        # Habits CRUD
        test_habit_crud_flow(test_user)
        sleep_short()
        # Progress endpoints
        test_progress_endpoints(test_user)
        sleep_short()
        # Quotes
        test_quotes_endpoint()
        print("\n✅ All E2E API tests passed!")
    except Exception as ex:
        print("\n❌ TEST FAILED:", ex)
        sys.exit(1)
