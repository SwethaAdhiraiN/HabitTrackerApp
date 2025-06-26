import requests
import json

"""
Utility script to manually test the /api/register backend endpoint for HabitTrackerApp.

- POSTs a sample payload to http://localhost:5000/api/register.
- Outputs the raw (entire) server response in both success and error scenarios.
- Reports if response is valid JSON or contains HTML/errors.

Run with: python manual_register_api_test.py
Server must be running on localhost:5000.
"""

URL = "http://localhost:5000/api/register"

SUCCESS_PAYLOAD = {
    "name": "Test User",
    "email": "testuser_manualapi@example.com",
    "password": "password123"
}

ERROR_PAYLOAD = {
    "name": "",
    "email": "notanemail",
    "password": ""
}

def is_json(resp):
    try:
        resp.json()
        return True
    except Exception:
        return False

def print_response_info(resp, context):
    print(f"\n=== {context} ===")
    print("Status Code:", resp.status_code)
    print("Headers:", resp.headers.get("Content-Type"))
    if is_json(resp):
        print("Body is valid JSON\nBody:", json.dumps(resp.json(), indent=2))
    else:
        print("Body is NOT valid JSON.")
        if "<!DOCTYPE html" in resp.text[:50]:
            print("Body appears to contain HTML (DOCTYPE found):\n", resp.text[:250])
        else:
            print("Raw body response:\n", resp.text[:250])

def manual_api_tests():
    print("Testing /api/register endpoint (manual POST)...")

    # Test valid registration (may fail only if duplicate email)
    success_resp = requests.post(URL, json=SUCCESS_PAYLOAD)
    print_response_info(success_resp, "SUCCESS CASE (valid registration)")

    # If duplicate, also show that scenario
    if (success_resp.status_code == 409) or (
        is_json(success_resp) and not success_resp.json().get("success", True)
    ):
        print("\n[NOTE] Email already registered, success scenario not possible without deleting user or retrying with a new email.")

    # Test invalid registration (should error, return valid JSON)
    error_resp = requests.post(URL, json=ERROR_PAYLOAD)
    print_response_info(error_resp, "ERROR CASE (invalid data)")

if __name__ == "__main__":
    manual_api_tests()
