from django.contrib import admin
from apps.boards.models import Board, List


class BoardAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'created_at', 'updated_at', 'created_by', 'updated_by')
    list_editable = ('user',)
    ordering = ('-created_at',) 
    readonly_fields = ('created_at', 'updated_at', 'created_by', 'updated_by')  

    def save_model(self, request, obj, form, change):
        """
        บันทึกข้อมูล พร้อมกำหนดผู้สร้างและผู้ปรับปรุง
        """
        if not change:  # ถ้าเป็นการสร้างใหม่
            obj.created_by = request.user  # กำหนดผู้สร้าง
        obj.updated_by = request.user  # กำหนดผู้ปรับปรุง
        super().save_model(request, obj, form, change)


class ListAdmin(admin.ModelAdmin):
    list_display = ('title', 'board', 'order', 'created_at', 'updated_at')
    list_filter = ('board',)  # ฟิลเตอร์ค้นหาตามบอร์ด
    search_fields = ('title',)  # ช่องค้นหาตามชื่อ
    ordering = ('board', 'order')  # เรียงตามบอร์ดและลำดับ
    readonly_fields = ('created_at', 'updated_at')  # ฟิลด์ที่ไม่สามารถแก้ไขได้

    def save_model(self, request, obj, form, change):
        """
        บันทึกข้อมูล พร้อมกำหนดผู้ปรับปรุง
        """
        if not change:  # ถ้าเป็นการสร้างใหม่
            obj.created_by = request.user  # กำหนดผู้สร้าง
        obj.updated_by = request.user  # กำหนดผู้ปรับปรุง
        super().save_model(request, obj, form, change)


# ลงทะเบียนโมเดลกับ Django Admin
admin.site.register(Board, BoardAdmin)
admin.site.register(List, ListAdmin)
