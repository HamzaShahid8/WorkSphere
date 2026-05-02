from django.shortcuts import render
from accounts.permissions import *
from .serializers import *
from .models import *
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.db.models import Count
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

# Create your views here.

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'manager':
            return Task.objects.filter(created_by = user)
        
        elif user.role == 'employee':
            return Task.objects.filter(assigned_by = user)
        
        return Task.objects.all()
    
    def perform_create(self, serializer):
        if self.request.user.role != 'manager':
            raise PermissionError('Only manager can create task')
        serializers.save(created_by = self.request.user)
        
    @action(detail=False, methods=['get'])
    def summary(self, request):
        user = request.user
        
        if user.role == 'manager':
            tasks = Task.objects.filter(created_by = user)
            
        elif user.role == 'employee':
            tasks = Task.objects.filter(assigned_by = user)
            
        # admin
        else:
            tasks = Task.objects.all()
            
            
        data = {
            'pending': tasks.filter(status = 'pending').count(),
            'in_progress': tasks.filter(status = 'in_progress').count(),
            'completed': tasks.filter(status = 'completed').count(),
        }
        return Response(data)