#!/usr/bin/env python3
"""
End-to-End Test Suite for Todo App Full Stack
Tests the complete user journey: signup → login → create task → edit → toggle → delete

NOTE: Authentication endpoints (signup/login) are on the FRONTEND (Better Auth),
not the backend. The backend only validates JWT tokens via JWKS.

For full E2E testing:
1. Start frontend with Better Auth configured
2. Auth endpoints will be at: http://localhost:3000/api/auth/*
3. Backend validates tokens at: http://localhost:8000/api/*
"""

import requests
import json
import time
from datetime import datetime, timedelta

# Configuration
BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"
# Auth is handled by Better Auth on frontend
AUTH_URL = f"{FRONTEND_URL}/api/auth"

# Test data
TEST_USER = {
    "email": f"test_user_{int(time.time())}@example.com",
    "password": "SecurePass123!",
    "name": "Test User"
}

# ANSI color codes for output
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
RESET = "\033[0m"

class E2ETestRunner:
    def __init__(self):
        self.token = None
        self.user_id = None
        self.task_id = None
        self.tag_id = None
        self.passed = 0
        self.failed = 0
        self.warnings = 0

    def log(self, message, level="INFO"):
        color = BLUE if level == "INFO" else GREEN if level == "PASS" else RED if level == "FAIL" else YELLOW
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"{color}[{timestamp}] [{level}]{RESET} {message}")

    def assert_response(self, response, expected_status, test_name):
        """Assert response status and log result."""
        if response.status_code == expected_status:
            self.log(f"✓ {test_name}", "PASS")
            self.passed += 1
            return True
        else:
            self.log(f"✗ {test_name} - Expected {expected_status}, got {response.status_code}", "FAIL")
            self.log(f"  Response: {response.text[:200]}", "FAIL")
            self.failed += 1
            return False

    def test_health_checks(self):
        """Test 1: Verify both servers are healthy."""
        self.log("=" * 60, "INFO")
        self.log("TEST 1: Health Checks", "INFO")
        self.log("=" * 60, "INFO")

        # Backend health
        try:
            response = requests.get(f"{BACKEND_URL}/health", timeout=5)
            self.assert_response(response, 200, "Backend health check")
            data = response.json()
            if data.get("database") == "connected":
                self.log("  ✓ Database connected", "PASS")
            else:
                self.log("  ✗ Database not connected", "FAIL")
                self.failed += 1
        except Exception as e:
            self.log(f"✗ Backend health check failed: {e}", "FAIL")
            self.failed += 1

        # Frontend health
        try:
            response = requests.get(FRONTEND_URL, timeout=5)
            if response.status_code == 200:
                self.log("✓ Frontend responding", "PASS")
                self.passed += 1
            else:
                self.log(f"✗ Frontend returned {response.status_code}", "FAIL")
                self.failed += 1
        except Exception as e:
            self.log(f"✗ Frontend health check failed: {e}", "FAIL")
            self.failed += 1

    def test_user_signup(self):
        """Test 2: User signup (via Frontend/Better Auth)."""
        self.log("\n" + "=" * 60, "INFO")
        self.log("TEST 2: User Signup (Better Auth on Frontend)", "INFO")
        self.log("=" * 60, "INFO")

        try:
            response = requests.post(
                f"{AUTH_URL}/signup",
                json=TEST_USER,
                timeout=10
            )

            if self.assert_response(response, 201, "User signup"):
                data = response.json()
                self.user_id = data.get("id")
                self.log(f"  User created with ID: {self.user_id}", "INFO")
        except Exception as e:
            self.log(f"✗ Signup failed: {e}", "FAIL")
            self.failed += 1

    def test_user_login(self):
        """Test 3: User login and JWT token (via Frontend/Better Auth)."""
        self.log("\n" + "=" * 60, "INFO")
        self.log("TEST 3: User Login & Authentication (Better Auth on Frontend)", "INFO")
        self.log("=" * 60, "INFO")

        try:
            response = requests.post(
                f"{AUTH_URL}/login",
                json={
                    "email": TEST_USER["email"],
                    "password": TEST_USER["password"]
                },
                timeout=10
            )

            if self.assert_response(response, 200, "User login"):
                data = response.json()
                self.token = data.get("access_token")
                if self.token:
                    self.log("  ✓ JWT token received", "PASS")
                    self.log(f"  Token (first 20 chars): {self.token[:20]}...", "INFO")
                else:
                    self.log("  ✗ No token in response", "FAIL")
                    self.failed += 1
        except Exception as e:
            self.log(f"✗ Login failed: {e}", "FAIL")
            self.failed += 1

    def test_create_task(self):
        """Test 4: Create a new task."""
        self.log("\n" + "=" * 60, "INFO")
        self.log("TEST 4: Create Task", "INFO")
        self.log("=" * 60, "INFO")

        if not self.token:
            self.log("✗ Skipped - No auth token", "WARN")
            self.warnings += 1
            return

        task_data = {
            "title": "Test Task - E2E",
            "description": "This is a test task created by E2E tests",
            "priority": "high",
            "due_date": (datetime.now() + timedelta(days=7)).isoformat(),
            "tags": ["testing", "e2e"]
        }

        try:
            response = requests.post(
                f"{BACKEND_URL}/api/v1/tasks",
                json=task_data,
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=10
            )

            if self.assert_response(response, 201, "Create task"):
                data = response.json()
                self.task_id = data.get("id")
                self.log(f"  Task created with ID: {self.task_id}", "INFO")
                self.log(f"  Title: {data.get('title')}", "INFO")
                self.log(f"  Priority: {data.get('priority')}", "INFO")
        except Exception as e:
            self.log(f"✗ Create task failed: {e}", "FAIL")
            self.failed += 1

    def test_get_tasks(self):
        """Test 5: Retrieve task list."""
        self.log("\n" + "=" * 60, "INFO")
        self.log("TEST 5: Retrieve Task List", "INFO")
        self.log("=" * 60, "INFO")

        if not self.token:
            self.log("✗ Skipped - No auth token", "WARN")
            self.warnings += 1
            return

        try:
            response = requests.get(
                f"{BACKEND_URL}/api/v1/tasks",
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=10
            )

            if self.assert_response(response, 200, "Get task list"):
                data = response.json()
                task_count = len(data)
                self.log(f"  Total tasks: {task_count}", "INFO")
                if task_count > 0:
                    self.log(f"  ✓ Task list contains {task_count} task(s)", "PASS")
                else:
                    self.log("  ! No tasks found (expected at least 1)", "WARN")
                    self.warnings += 1
        except Exception as e:
            self.log(f"✗ Get tasks failed: {e}", "FAIL")
            self.failed += 1

    def test_update_task(self):
        """Test 6: Update task details."""
        self.log("\n" + "=" * 60, "INFO")
        self.log("TEST 6: Update Task", "INFO")
        self.log("=" * 60, "INFO")

        if not self.token or not self.task_id:
            self.log("✗ Skipped - No auth token or task ID", "WARN")
            self.warnings += 1
            return

        update_data = {
            "title": "Updated Test Task - E2E",
            "description": "Updated description",
            "priority": "medium"
        }

        try:
            response = requests.put(
                f"{BACKEND_URL}/api/v1/tasks/{self.task_id}",
                json=update_data,
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=10
            )

            if self.assert_response(response, 200, "Update task"):
                data = response.json()
                self.log(f"  Updated title: {data.get('title')}", "INFO")
                self.log(f"  Updated priority: {data.get('priority')}", "INFO")
        except Exception as e:
            self.log(f"✗ Update task failed: {e}", "FAIL")
            self.failed += 1

    def test_toggle_completion(self):
        """Test 7: Toggle task completion status."""
        self.log("\n" + "=" * 60, "INFO")
        self.log("TEST 7: Toggle Task Completion", "INFO")
        self.log("=" * 60, "INFO")

        if not self.token or not self.task_id:
            self.log("✗ Skipped - No auth token or task ID", "WARN")
            self.warnings += 1
            return

        try:
            # Toggle to complete
            response = requests.patch(
                f"{BACKEND_URL}/api/v1/tasks/{self.task_id}/complete",
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=10
            )

            if self.assert_response(response, 200, "Toggle task to complete"):
                data = response.json()
                if data.get("is_completed"):
                    self.log("  ✓ Task marked as completed", "PASS")
                else:
                    self.log("  ✗ Task not marked as completed", "FAIL")
                    self.failed += 1

            # Toggle back to incomplete
            response = requests.patch(
                f"{BACKEND_URL}/api/v1/tasks/{self.task_id}/complete",
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=10
            )

            if self.assert_response(response, 200, "Toggle task to incomplete"):
                data = response.json()
                if not data.get("is_completed"):
                    self.log("  ✓ Task marked as incomplete", "PASS")
                else:
                    self.log("  ✗ Task still marked as completed", "FAIL")
                    self.failed += 1
        except Exception as e:
            self.log(f"✗ Toggle completion failed: {e}", "FAIL")
            self.failed += 1

    def test_filter_tasks(self):
        """Test 8: Filter and search tasks."""
        self.log("\n" + "=" * 60, "INFO")
        self.log("TEST 8: Filter & Search Tasks", "INFO")
        self.log("=" * 60, "INFO")

        if not self.token:
            self.log("✗ Skipped - No auth token", "WARN")
            self.warnings += 1
            return

        try:
            # Filter by priority
            response = requests.get(
                f"{BACKEND_URL}/api/v1/tasks?priority=medium",
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=10
            )
            self.assert_response(response, 200, "Filter by priority")

            # Search by title
            response = requests.get(
                f"{BACKEND_URL}/api/v1/tasks?search=Updated",
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=10
            )
            self.assert_response(response, 200, "Search by title")
        except Exception as e:
            self.log(f"✗ Filter/search failed: {e}", "FAIL")
            self.failed += 1

    def test_delete_task(self):
        """Test 9: Delete task."""
        self.log("\n" + "=" * 60, "INFO")
        self.log("TEST 9: Delete Task", "INFO")
        self.log("=" * 60, "INFO")

        if not self.token or not self.task_id:
            self.log("✗ Skipped - No auth token or task ID", "WARN")
            self.warnings += 1
            return

        try:
            response = requests.delete(
                f"{BACKEND_URL}/api/v1/tasks/{self.task_id}",
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=10
            )

            self.assert_response(response, 204, "Delete task")

            # Verify deletion
            response = requests.get(
                f"{BACKEND_URL}/api/v1/tasks/{self.task_id}",
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=10
            )

            if response.status_code == 404:
                self.log("  ✓ Task successfully deleted (404 on get)", "PASS")
                self.passed += 1
            else:
                self.log(f"  ✗ Task still exists after deletion", "FAIL")
                self.failed += 1
        except Exception as e:
            self.log(f"✗ Delete task failed: {e}", "FAIL")
            self.failed += 1

    def print_summary(self):
        """Print test summary."""
        self.log("\n" + "=" * 60, "INFO")
        self.log("TEST SUMMARY", "INFO")
        self.log("=" * 60, "INFO")

        total = self.passed + self.failed
        pass_rate = (self.passed / total * 100) if total > 0 else 0

        print(f"\n{GREEN}✓ Passed:{RESET} {self.passed}")
        print(f"{RED}✗ Failed:{RESET} {self.failed}")
        print(f"{YELLOW}⚠ Warnings:{RESET} {self.warnings}")
        print(f"\n{BLUE}Pass Rate:{RESET} {pass_rate:.1f}%")

        if self.failed == 0:
            print(f"\n{GREEN}{'=' * 60}{RESET}")
            print(f"{GREEN}🎉 ALL TESTS PASSED! Full stack is working correctly.{RESET}")
            print(f"{GREEN}{'=' * 60}{RESET}\n")
            return 0
        else:
            print(f"\n{RED}{'=' * 60}{RESET}")
            print(f"{RED}❌ SOME TESTS FAILED. Please review the errors above.{RESET}")
            print(f"{RED}{'=' * 60}{RESET}\n")
            return 1

def main():
    """Run all E2E tests."""
    runner = E2ETestRunner()

    print(f"\n{BLUE}{'=' * 60}{RESET}")
    print(f"{BLUE}Todo App - Full Stack End-to-End Tests{RESET}")
    print(f"{BLUE}{'=' * 60}{RESET}\n")

    # Run tests
    runner.test_health_checks()
    runner.test_user_signup()
    runner.test_user_login()
    runner.test_create_task()
    runner.test_get_tasks()
    runner.test_update_task()
    runner.test_toggle_completion()
    runner.test_filter_tasks()
    runner.test_delete_task()

    # Print summary
    exit_code = runner.print_summary()

    return exit_code

if __name__ == "__main__":
    exit(main())
