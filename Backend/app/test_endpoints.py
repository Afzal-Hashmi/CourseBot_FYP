import pytest
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_root_docs():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.get("/docs")
        assert resp.status_code == 200

@pytest.mark.asyncio
async def test_register_and_login():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Register
        user = {
            "firstName": "Test",
            "lastName": "User",
            "email": "testuser@example.com",
            "password": "testpass",
            "role": "student"
        }
        resp = await ac.post("/auth/register", json=user)
        assert resp.status_code in [200, 201, 400]  # 400 if already exists
        # Login
        login_data = {"username": user["email"], "password": user["password"]}
        resp = await ac.post("/auth/login", data=login_data)
        assert resp.status_code == 200
        assert "access_token" in resp.json()
        token = resp.json()["access_token"]
        return token

@pytest.mark.asyncio
async def test_teacher_create_course():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Register and login as teacher
        teacher = {
            "firstName": "Teach",
            "lastName": "Er",
            "email": "teacher@example.com",
            "password": "teachpass",
            "role": "teacher"
        }
        await ac.post("/auth/register", json=teacher)
        login_data = {"username": teacher["email"], "password": teacher["password"]}
        resp = await ac.post("/auth/login", data=login_data)
        token = resp.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        # Create course
        course = {
            "course_name": "Test Course",
            "course_description": "A course for testing",
            "course_status": "Published"
        }
        resp = await ac.post("/teacher/courses", json=course, headers=headers)
        assert resp.status_code in [200, 201]
        assert "course_id" in resp.json() or "id" in resp.json()

@pytest.mark.asyncio
async def test_student_enroll_and_feedback():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Register and login as student
        student = {
            "firstName": "Stud",
            "lastName": "Ent",
            "email": "student2@example.com",
            "password": "studpass",
            "role": "student"
        }
        await ac.post("/auth/register", json=student)
        login_data = {"username": student["email"], "password": student["password"]}
        resp = await ac.post("/auth/login", data=login_data)
        token = resp.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        # Enroll in course 1
        resp = await ac.post("/student/enroll", json={"course_id": 1}, headers=headers)
        assert resp.status_code in [200, 201, 400]
        # Give feedback
        feedback = {"course_id": 1, "rating": 5, "feedback_text": "Great!"}
        resp = await ac.post("/student/feedback", json=feedback, headers=headers)
        assert resp.status_code in [200, 201, 400]

@pytest.mark.asyncio
async def test_content_upload():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Register and login as teacher
        teacher = {
            "firstName": "Cont",
            "lastName": "Ent",
            "email": "content.teacher@example.com",
            "password": "contentpass",
            "role": "teacher"
        }
        await ac.post("/auth/register", json=teacher)
        login_data = {"username": teacher["email"], "password": teacher["password"]}
        resp = await ac.post("/auth/login", data=login_data)
        token = resp.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        # Upload content (simulate PDF upload)
        content = {
            "title": "Test PDF",
            "content_type": "pdf",
            "content_url": "https://example.com/test.pdf",
            "course_id": 1
        }
        resp = await ac.post("/teacher/uploadcontent/", json=content, headers=headers)
        assert resp.status_code in [200, 201, 400] 