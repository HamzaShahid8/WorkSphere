from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()

router.register('user', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    
    # login
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair_view'),
    
    # refresh
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]