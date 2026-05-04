from api.models import *
from accounts.models import *


class DashboardService:

    @staticmethod
    def get_dashboard_data(user):

        if user.role == 'admin':
            return {
                "total_tasks": Task.objects.count(),
                "pending_tasks": Task.objects.filter(status='pending').count(),
                "completed_tasks": Task.objects.filter(status='completed').count(),
            }

        elif user.role == 'manager':
            return {
                "my_tasks": Task.objects.filter(created_by=user).count(),
                "pending": Task.objects.filter(created_by=user, status='pending').count(),
            }

        else:  # employee
            return {
                "assigned_tasks": Task.objects.filter(assigned_to=user).count(),
                "completed": Task.objects.filter(assigned_to=user, status='completed').count(),
            }