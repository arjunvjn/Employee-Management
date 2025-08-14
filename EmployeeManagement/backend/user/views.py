from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import CustomUser
from .serializers import MyTokenObtainPairSerializer, CustomUserSerializer


# Create your views here.
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class UserViewSet(viewsets.ViewSet):

    http_method_names = ["get", "post", "put", "patch"]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return super().get_permissions()

    @action(detail=False, methods=["get"])
    def get_info(self, request):
        try:
            user = CustomUser.objects.get(id=request.user.id)
            serializer = CustomUserSerializer(
                user, fields=["id", "username", "name", "email"]
            )
            return Response({"status": "Success", "data": serializer.data})
        except Exception as e:
            return Response(
                {"status": "Error", "data": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create(self, request):
        try:
            serializer = CustomUserSerializer(data=request.data)
            if serializer.is_valid():
                CustomUser.objects.create_user(**serializer.validated_data)
                user_data = serializer.data
                user_data.pop("password")
                return Response(
                    {"status": "Success", "data": user_data},
                    status=status.HTTP_201_CREATED,
                )
            return Response(
                {"status": "Error", "data": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"status": "Error", "data": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=["put"])
    def update_info(self, request):
        try:
            user = CustomUser.objects.get(id=request.user.id)
            serializer = CustomUserSerializer(
                instance=user, data=request.data, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                user_data = serializer.data
                user_data.pop("password")
                return Response({"status": "Success", "data": user_data})
            return Response(
                {"status": "Error", "data": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"status": "Error", "data": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=["patch"])
    def update_password(self, request):
        try:
            user = CustomUser.objects.get(id=request.user.id)
            if user.check_password(request.data.get("current_password")):
                user.set_password(request.data.get("new_password"))
                user.save()
                return Response({"status": "Success", "message": "Password Updated"})
            return Response(
                {
                    "status": "Error",
                    "message": "The current password you entered is incorrect",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"status": "Error", "data": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data.get("refresh_token")
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"status": "Success", "message": "User is logged out"})
    except Exception as e:
        return Response(
            {"status": "Error", "data": str(e)}, status=status.HTTP_400_BAD_REQUEST
        )
