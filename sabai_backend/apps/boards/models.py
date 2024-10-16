from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
from framework.models import BaseModel  # นำเข้า BaseModel

class Board(BaseModel):  # ใช้ BaseModel
    title = models.CharField(max_length=255)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='boards')

    def __str__(self):
        return self.title


class List(BaseModel):  # เปลี่ยนจาก models.Model เป็น BaseModel
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name="lists")
    title = models.CharField(max_length=255, blank=False, null=False)
    order = models.DecimalField(max_digits=30, decimal_places=15, blank=True, null=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        filtered_objects = List.objects.filter(board=self.board)
        if not self.order and filtered_objects.count() == 0:
            self.order = 2 ** 16 - 1
        elif not self.order:
            self.order = filtered_objects.aggregate(models.Max('order'))['order__max'] + 2 ** 16 - 1
        return super().save(*args, **kwargs)
