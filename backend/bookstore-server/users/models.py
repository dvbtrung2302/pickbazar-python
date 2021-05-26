from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    photo = models.ImageField(upload_to='photos', null=True, blank=True)

    @property
    def group(self):
        groups = self.groups.all()
        return groups[0].name if groups else None
