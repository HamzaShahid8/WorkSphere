from django.core.management.base import BaseCommand
from accounts.models import *

class Command(BaseCommand):
    help = 'Load roles and users automatically'
    
    def handle(self, *args, **kwargs):
        
        # admin
        if not User.objects.filter(username = 'admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin123@gmail.com',
                password='admin123',
                role='admin'
            )
            self.stdout.write(self.style.SUCCESS('Admin created'))
            
        # manager
        if not User.objects.filter(username = 'manager').exists():
            User.objects.create_user(
                username='manager',
                email='manager123@gmail.com',
                password='manager123',
                role='manager'
            )
            self.stdout.write(self.style.SUCCESS('Manager created'))
            
        # multiple employess
        for i in range(1, 10):
            username = f"employess{i}"
            if not User.objects.filter(username=username).exists():
                User.objects.create_user(
                    username=username,
                    email=f"{username}123@gmail.com",
                    password=f"{username}123",
                    role='employee'
                )
                self.stdout.write(self.style.SUCCESS(f"{username} created"))
                
        self.stdout.write(self.style.SUCCESS('All users loaded successfully'))