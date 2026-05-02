from django.shortcuts import render
from .serializers import *
from .models import *
from .permissions import *
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [IsAuthenticated, IsAdmin]