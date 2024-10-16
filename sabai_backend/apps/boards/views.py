from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.boards.models import Board ,List

from .serializers import BoardSerializer ,ListSerializer

class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    permission_classes = [IsAuthenticated]  # ให้แน่ใจว่าผู้ใช้ล็อกอิน
    
class ListViewSet(viewsets.ModelViewSet):
    queryset = List.objects.all()
    serializer_class = ListSerializer
    permission_classes = [IsAuthenticated]  # ให้แน่ใจว่าผู้ใช้ล็อกอิน


