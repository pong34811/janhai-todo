import json
from rest_framework import serializers
from .models import Board, List, Task

class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ['id', 'title', 'created_at', 'updated_at', 'user', 'created_by', 'updated_by']

class TaskSerializer(serializers.ModelSerializer):
    list = serializers.PrimaryKeyRelatedField(queryset=List.objects.all())

    class Meta:
        model = Task
        fields = ['id', 'list', 'title', 'description', 'order']

    def validate_description(self, value):
        try:
            if value:
                json.loads(value)
        except ValueError:
            raise serializers.ValidationError("Description must be a valid JSON format.")
        return value

    def validate(self, data):
        if not data.get('list'):
            raise serializers.ValidationError("The list field is required.")
        if not data.get('title'):
            raise serializers.ValidationError("The title field is required.")
        return data

        
class ListSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = List
        fields = ['id', 'board', 'title', 'order', 'tasks']
        read_only_fields = ['id']

    def create(self, validated_data):
        return List.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.order = validated_data.get('order', instance.order)
        instance.save()
        return instance
