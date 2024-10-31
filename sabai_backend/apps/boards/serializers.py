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

    def create(self, validated_data):
        list_instance = List(**validated_data)
        list_instance.save()
        return list_instance

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        order = validated_data.get('order')
        if order is not None:
            instance.order = order
        instance.save()
        return instance
