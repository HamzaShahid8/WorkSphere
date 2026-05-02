from rest_framework import serializers
from .models import *

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'assigned_by', 'created_by', 'created_at', 'status']
        read_only_fields = ['id', 'created_by', 'created_at']