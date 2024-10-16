# apps/boards/serializers.py
from rest_framework import serializers
from .models import Board ,List

class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ['id', 'title', 'created_at', 'updated_at', 'user', 'created_by', 'updated_by']

class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ['id', 'board', 'title', 'order']

    def create(self, validated_data):
        # สร้าง List ใหม่
        list_instance = List(**validated_data)
        list_instance.save()
        return list_instance

    def update(self, instance, validated_data):
        # อัปเดต List ที่มีอยู่
        instance.title = validated_data.get('title', instance.title)

        # กำหนด order ใหม่ถ้าถูกส่งมา
        order = validated_data.get('order')
        if order is not None:
            instance.order = order
        # ถ้าไม่ส่ง order มา จะใช้ค่าเดิมที่มีอยู่

        instance.save()
        return instance