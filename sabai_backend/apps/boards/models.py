from django.db import models
from django.contrib.auth import get_user_model
from framework.models import BaseModel  # นำเข้า BaseModel

class Board(BaseModel):  # ใช้ BaseModel
    title = models.CharField(max_length=255)
    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name='boards'
    )

    def __str__(self):
        return self.title


class List(BaseModel):  # ใช้ BaseModel
    board = models.ForeignKey(
        Board,
        on_delete=models.CASCADE,
        related_name="lists"
    )
    title = models.CharField(max_length=255)
    order = models.DecimalField(
        max_digits=30,
        decimal_places=15,
        blank=True,
        null=True
    )

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        """
        กำหนดค่า order ถ้าไม่มีค่า
        """
        if not self.order:
            # ตรวจสอบรายการที่มีอยู่ในบอร์ดเดียวกัน
            filtered_objects = List.objects.filter(board=self.board)
            if filtered_objects.exists():
                # กำหนดค่า order ให้เพิ่มขึ้นจากค่ามากที่สุด
                self.order = filtered_objects.aggregate(
                    models.Max('order')
                )['order__max'] + 2 ** 16 - 1
            else:
                # ค่าเริ่มต้นถ้าไม่มีรายการ
                self.order = 2 ** 16 - 1
        super().save(*args, **kwargs)
