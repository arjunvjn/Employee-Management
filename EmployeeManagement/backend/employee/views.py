from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Employee
from dynamic_form.models import DynamicField
from .serializers import EmployeeSerializer

# Create your views here.


def type_checking(field_type, value):
    try:
        match field_type:
            case "int":
                a = int(value)
                return True
            case "float":
                a = float(value)
                return True
            case "str":
                a = str(value)
                return True
            case _:
                return False
    except ValueError:
        return False


def validate_json_data(data):
    fields = DynamicField.objects.all()
    field_names = fields.values_list("name", flat=True)
    if sorted(list(field_names)) != sorted(list(data.keys())):
        return {"status": "Error", "message": "Issue with field names"}
    flag = True
    for field in fields:
        if not type_checking(field.field_type, data[field.name]):
            flag = False
            break
    if flag:
        return {"status": "Success"}
    return {"status": "Error", "message": "Issue with field type"}


class EmployeeViewSet(viewsets.ViewSet):

    permission_classes = [IsAuthenticated]

    def list(self, request):
        try:
            if request.query_params.get("filterField") and request.query_params.get(
                "search"
            ):
                field = f"data__{request.query_params.get('filterField')}__icontains"
                search_value = request.query_params.get("search")
                employee_list = Employee.objects.filter(**{field: search_value})
            else:
                employee_list = Employee.objects.all()
            print(employee_list)
            field_names = DynamicField.objects.all().values_list("name", flat=True)
            serializer = EmployeeSerializer(employee_list, many=True)
            return Response(
                {
                    "status": "Success",
                    "data": serializer.data,
                    "field_names": field_names,
                }
            )
        except Exception as e:
            return Response(
                {"status": "Error", "data": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create(self, request):
        try:
            data = request.data
            response = validate_json_data(data)
            if response["status"] == "Error":
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            Employee.objects.create(data=request.data)
            return Response(
                {"status": "Success", "message": "Employee Created"},
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            return Response(
                {"status": "Error", "data": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def update(self, request, pk=None):
        try:
            data = request.data
            response = validate_json_data(data)
            if response["status"] == "Error":
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            employee = Employee.objects.get(id=pk)
            employee.data = data
            employee.save()
            return Response({"status": "Success", "message": "Employee Updated"})
        except Exception as e:
            return Response(
                {"status": "Error", "data": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def destroy(self, request, pk=None):
        try:
            try:
                Employee.objects.get(id=pk).delete()
                return Response({"status": "Success", "message": "Employee Deleted"})
            except Employee.DoesNotExist:
                return Response(
                    {"status": "Error", "message": "Not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        except Exception as e:
            return Response(
                {"status": "Error", "data": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
