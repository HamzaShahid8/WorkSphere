from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from api.models import Task

User = get_user_model()


class TaskApiAuthTests(APITestCase):
    def setUp(self):
        self.client = APIClient()

    def test_list_tasks_unauthorized(self):
        res = self.client.get('/api/task/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_task_summary_unauthorized(self):
        res = self.client.get('/api/task/summary/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class TaskApiWithUserTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username='t_admin',
            email='a@example.com',
            password='testpass123',
            role='admin',
        )
        self.manager = User.objects.create_user(
            username='t_manager',
            email='m@example.com',
            password='testpass123',
            role='manager',
        )
        self.employee = User.objects.create_user(
            username='t_employee',
            email='e@example.com',
            password='testpass123',
            role='employee',
        )
        self.client = APIClient()

    def test_manager_create_task_persists(self):
        self.client.force_authenticate(user=self.manager)
        res = self.client.post(
            '/api/task/',
            {
                'title': 'Unit test task',
                'description': 'Desc',
                'assigned_by': self.employee.id,
                'status': 'pending',
            },
            format='json',
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED, res.data)
        self.assertEqual(Task.objects.count(), 1)
        t = Task.objects.get()
        self.assertEqual(t.created_by, self.manager)
        self.assertEqual(t.assigned_by, self.employee)

    def test_admin_create_task_persists(self):
        self.client.force_authenticate(user=self.admin)
        res = self.client.post(
            '/api/task/',
            {
                'title': 'Admin task',
                'description': 'Desc',
                'assigned_by': self.employee.id,
                'status': 'pending',
            },
            format='json',
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED, res.data)

    def test_employee_cannot_create_task(self):
        self.client.force_authenticate(user=self.employee)
        res = self.client.post(
            '/api/task/',
            {
                'title': 'Nope',
                'description': 'Desc',
                'assigned_by': self.manager.id,
                'status': 'pending',
            },
            format='json',
        )
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
