from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register('task', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),
]