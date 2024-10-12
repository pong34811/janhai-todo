from framework.models import BaseModel
from django.db import models
from django.contrib.auth import get_user_model

class Board(BaseModel):
    title = models.CharField(max_length=255)  # ฟิลด์สำหรับชื่อบอร์ด
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='boards')  # ฟิลด์สำหรับผู้ใช้ที่เป็นเจ้าของบอร์ด
