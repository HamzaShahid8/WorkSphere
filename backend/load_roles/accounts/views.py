from django.shortcuts import render
from .serializers import *
from .models import *
from .permissions import *
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def get_permissions(self):
        user = self.request.user
        
        if self.action == 'create':
            return [IsAuthenticated(), IsAdmin()]
        return [IsAuthenticated()]
    
    
    def perform_create(self, serializer):
        if self.request.user.role != 'admin':
            raise PermissionDenied('Onlu admin can create users')
        serializer.save()