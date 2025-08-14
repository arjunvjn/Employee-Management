from django.db import models


# Create your models here.
class Employee(models.Model):
    data = models.JSONField()

    def __str__(self):
        return str(self.id)
