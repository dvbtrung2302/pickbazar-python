from django.contrib.auth import get_user_model

from rest_framework import generics, permissions, authentication, viewsets
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import LogInSerializer, UserSerializer, UserManagerSerializer


class SignUpView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer

class LogInView(TokenObtainPairView):
    serializer_class = LogInSerializer



class ManageUserView(generics.RetrieveUpdateAPIView):
    """Manage the authenticated user"""
    serializer_class = UserSerializer
    # authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        """Retrieve and return authentication user"""
        return self.request.user

class UserManagerViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserManagerSerializer
    # permission_classes = [permissions.IsAdminUser,]