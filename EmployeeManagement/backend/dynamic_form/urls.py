from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import DynamicFormViewSet

router = DefaultRouter()
router.register(r"", DynamicFormViewSet, basename="dynamic_form")

urlpatterns = [path("", include(router.urls))]
