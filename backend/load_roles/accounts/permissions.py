from rest_framework import permissions
from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and request.user.role == 'admin'
        )
    
class IsManager(BasePermission):
    message = 'This action requires a manager account.'

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and request.user.role == 'manager'
        )


class IsAdminOrManager(BasePermission):
    """Admins and managers (not employees) — e.g. create tasks."""

    message = 'This action requires a manager or admin account.'

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        role = getattr(request.user, 'role', None)
        if not role:
            return False
        return role in ('admin', 'manager')
    
class IsEmployee(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and request.user.role == 'employee'
        )