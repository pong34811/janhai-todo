# apps/boards/serializers.py
from rest_framework import serializers
from .models import Board

class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ['id', 'title', 'created_at', 'updated_at', 'user', 'created_by', 'updated_by']

