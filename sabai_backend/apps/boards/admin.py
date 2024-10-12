from django.contrib import admin
from apps.boards.models import Board

class BoardAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'created_at', 'updated_at', 'created_by', 'updated_by')  # แสดงฟิลด์ที่ถูกต้อง
    list_editable = ('user',)  # แก้ไขได้ในหน้ารายการถ้าต้องการ
    ordering = ('created_at',)  # เรียงตามวันที่สร้าง
    readonly_fields = ('created_at', 'updated_at', 'created_by', 'updated_by')  # ฟิลด์ที่ไม่สามารถแก้ไขได้

    def save_model(self, request, obj, form, change):
        if not change:  # ถ้าเป็นการสร้างโมเดลใหม่
            obj.created_by = request.user  # กำหนดผู้สร้าง
        obj.updated_by = request.user  # กำหนดผู้ปรับปรุง
        super().save_model(request, obj, form, change)

admin.site.register(Board, BoardAdmin)
