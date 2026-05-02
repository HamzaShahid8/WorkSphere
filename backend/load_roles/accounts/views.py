from django.shortcuts import render
from .serializers import *
from .models import *
from .permissions import *
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.


class SignupView(APIView):
    """Allow anyone to register as an **employee** (no admin/manager self-signup)."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PublicSignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {'detail': 'Account created. You can sign in.'},
            status=status.HTTP_201_CREATED,
        )


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
            raise PermissionDenied('Only admin can create users')
        serializer.save()