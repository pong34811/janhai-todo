from rest_framework import serializers
from .models import Board, List

class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ['id', 'title', 'created_at', 'updated_at', 'user', 'created_by', 'updated_by']

class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ['id', 'board', 'title', 'order']
        read_only_fields = ['id']

    def create(self, validated_data):
        return List.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.order = validated_data.get('order', instance.order)
        instance.save()
        return instance
