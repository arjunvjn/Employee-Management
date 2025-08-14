from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated

from .models import DynamicField
from .serializers import DynamicFieldSerializer


# Create your views here.
class DynamicFormViewSet(viewsets.ViewSet):

    http_method_names = ["get", "post", "delete"]
    permission_classes = [IsAuthenticated]

    def list(self, request):
        try:
            fields = DynamicField.objects.all().order_by("order")
            serializer = DynamicFieldSerializer(fields, many=True)
            return Response({"status": "Success", "data": serializer.data})
        except Exception as e:
            return Response(
                {"status": "Error", "data": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create(self, request):
        try:
            for field in request.data:
                try:
                    field_id = int(field["id"])
                    field_record = DynamicField.objects.get(id=field_id)
                    serializer = DynamicFieldSerializer(
                        instance=field_record, data=field
                    )
                    if serializer.is_valid():
                        serializer.save()
                    else:
                        return Response(
                            {"status": "Error", "data": serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                except (ValueError, DynamicField.DoesNotExist):
                    field.pop("id")
                    serializer = DynamicFieldSerializer(data=field)
                    if serializer.is_valid():
                        serializer.save()
                    else:
                        return Response(
                            {"status": "Error", "data": serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
            return Response({"status": "Success", "message": "Updated the fields"})
        except Exception as e:
            return Response(
                {"status": "Error", "data": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def destroy(self, request, pk=None):
        try:
            try:
                DynamicField.objects.get(id=pk).delete()
                return Response({"status": "Success", "message": "Employee Deleted"})
            except DynamicField.DoesNotExist:
                return Response(
                    {"status": "Error", "message": "Not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        except Exception as e:
            return Response(
                {"status": "Error", "data": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
