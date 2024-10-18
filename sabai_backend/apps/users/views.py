from django.contrib.auth.models import User
from rest_framework import viewsets
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]  # ให้แน่ใจว่าผู้ใช้ล็อกอิน


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # ส่งกลับ token และข้อมูลผู้ใช้ในบรรทัดเดียว
        return Response({
            'user': UserSerializer(serializer.user).data,
            'refresh': serializer.validated_data['refresh'],
            'access': serializer.validated_data['access'],
        })
