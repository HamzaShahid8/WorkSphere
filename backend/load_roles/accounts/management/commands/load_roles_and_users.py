from django.core.management.base import BaseCommand
from django.conf import settings
from accounts.models import User

class Command(BaseCommand):
    help = 'Load roles and users automatically'

    @staticmethod
    def _env(name, default):
        return str(getattr(settings, name, default)).strip() or str(default)

    @staticmethod
    def _env_int(name, default):
        try:
            return int(getattr(settings, name, default))
        except (TypeError, ValueError):
            return int(default)

    def handle(self, *args, **kwargs):
        admin_username = self._env('SEED_ADMIN_USERNAME', 'admin')
        admin_email = self._env('SEED_ADMIN_EMAIL', 'admin@example.com')
        admin_password = self._env('SEED_ADMIN_PASSWORD', 'admin123')

        manager_username = self._env('SEED_MANAGER_USERNAME', 'manager')
        manager_email = self._env('SEED_MANAGER_EMAIL', 'manager@example.com')
        manager_password = self._env('SEED_MANAGER_PASSWORD', 'manager123')

        employee_prefix = self._env('SEED_EMPLOYEE_PREFIX', 'employee')
        employee_email_domain = self._env('SEED_EMPLOYEE_EMAIL_DOMAIN', 'example.com')
        employee_password_prefix = self._env('SEED_EMPLOYEE_PASSWORD_PREFIX', employee_prefix)
        employee_count = max(self._env_int('SEED_EMPLOYEE_COUNT', 9), 0)

        # admin
        if not User.objects.filter(username=admin_username).exists():
            User.objects.create_superuser(
                username=admin_username,
                email=admin_email,
                password=admin_password,
                role=User.ROLE_ADMIN
            )
            self.stdout.write(self.style.SUCCESS(f'Admin created ({admin_username})'))

        # manager
        if not User.objects.filter(username=manager_username).exists():
            User.objects.create_user(
                username=manager_username,
                email=manager_email,
                password=manager_password,
                role=User.ROLE_MANAGER
            )
            self.stdout.write(self.style.SUCCESS(f'Manager created ({manager_username})'))

        # seed employees
        for i in range(1, employee_count + 1):
            username = f'{employee_prefix}{i}'
            if not User.objects.filter(username=username).exists():
                User.objects.create_user(
                    username=username,
                    email=f'{username}@{employee_email_domain}',
                    password=f'{employee_password_prefix}{i}',
                    role=User.ROLE_EMPLOYEE
                )
                self.stdout.write(self.style.SUCCESS(f'{username} created'))

        self.stdout.write(self.style.SUCCESS('All users loaded successfully'))