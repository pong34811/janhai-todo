import json
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from apps.boards.models import Board, List, Task
from .serializers import ListSerializer, BoardSerializer, TaskSerializer

class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user']

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

class ListViewSet(viewsets.ModelViewSet):
    queryset = List.objects.prefetch_related('tasks')
    serializer_class = ListSerializer

    def get_queryset(self):
        board_id = self.request.query_params.get('board', None)
        if board_id is not None:
            return self.queryset.filter(board_id=board_id).order_by('order')
        return self.queryset

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_queryset(self):
        list_id = self.request.query_params.get('list', None)
        if list_id is not None:
            return self.queryset.filter(list_id=list_id).order_by('order')
        return self.queryset.order_by('order')

    def perform_update(self, serializer):
        task = self.get_object()
        if not task:
            raise NotFound(detail="Task not found")

        # Validate description as JSON
        description = serializer.validated_data.get('description', '')
        if description:
            try:
                json.loads(description)  # Check if it's a valid JSON format
            except ValueError:
                raise ValidationError("Description must be a valid JSON format.")

        # Save the updated task
        serializer.save(updated_by=self.request.user)

    def perform_create(self, serializer):
        # Save created_by and updated_by when creating a new task
        serializer.save(created_by=self.request.user, updated_by=self.request.user)