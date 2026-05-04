from django.contrib.auth import get_user_model
from accounts.models import User as AccountUser
from .serializers import TaskSerializer
from .models import Task
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

User = get_user_model()

# Create your views here.

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        # Role checks for create are in perform_create (after DB reload of user.role).
        return [IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user

        if user.role == AccountUser.ROLE_MANAGER:
            return Task.objects.filter(created_by=user)

        if user.role == AccountUser.ROLE_EMPLOYEE:
            return Task.objects.filter(assigned_by=user)

        return Task.objects.all()
    
    def perform_create(self, serializer):
        # Reload from DB so role is always correct (JWT user instance can be stale).
        user = User.objects.get(pk=self.request.user.pk)
        role = (user.role or '').strip().lower()
        if role not in (AccountUser.ROLE_ADMIN, AccountUser.ROLE_MANAGER):
            raise PermissionDenied(
                'Creating tasks requires an account with role “manager” or “admin”. '
                f'Your account role is “{user.role or "unset"}”. '
                'Update the user in Django admin if needed.',
            )
        serializer.save(created_by=user)
        
    # @action(detail=False, methods=['get'])
    # def summary(self, request):
        
    #     user = request.user
        
    #     if user.role == 'manager':
    #         tasks = Task.objects.filter(created_by = user)
            
    #     elif user.role == 'employee':
    #         tasks = Task.objects.filter(assigned_by = user)
            
    #     # admin
    #     else:
    #         tasks = Task.objects.all()
            
            
    #     data = {
    #         'pending': tasks.filter(status = 'pending').count(),
    #         'in_progress': tasks.filter(status = 'in_progress').count(),
    #         'completed': tasks.filter(status = 'completed').count(),
    #     }
    #     return Response(data)
    
