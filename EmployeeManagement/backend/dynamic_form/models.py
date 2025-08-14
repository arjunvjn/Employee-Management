from django.db import models


# Create your models here.
class DynamicField(models.Model):

    class FieldType(models.TextChoices):
        INT = "int"
        FLOAT = "float"
        STRING = "str"

    name = models.CharField(max_length=200, unique=True)
    field_type = models.CharField(max_length=20, choices=FieldType.choices)
    order = models.PositiveIntegerField()

    def __str__(self):
        return self.name
