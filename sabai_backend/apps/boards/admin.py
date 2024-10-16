from django.contrib import admin
from apps.boards.models import Board, List

class BoardAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'created_at', 'updated_at', 'created_by', 'updated_by')  # ฟิลด์ที่ต้องการแสดง
    list_editable = ('user',)  # ฟิลด์ที่สามารถแก้ไขได้ในหน้ารายการ
    ordering = ('created_at',)  # เรียงตามวันที่สร้าง
    readonly_fields = ('created_at', 'updated_at', 'created_by', 'updated_by')  # ฟิลด์ที่ไม่สามารถแก้ไขได้

    def save_model(self, request, obj, form, change):
        if not change:  # ถ้าเป็นการสร้างใหม่
            obj.created_by = request.user  # กำหนดผู้สร้าง
        obj.updated_by = request.user  # กำหนดผู้ปรับปรุง
        super().save_model(request, obj, form, change)

# Custom admin for List model
class ListAdmin(admin.ModelAdmin):
    list_display = ('title', 'board', 'order', 'created_at')  # ฟิลด์ที่ต้องการแสดง
    list_filter = ('board',)  # เพิ่มฟิลเตอร์เพื่อช่วยในการค้นหาตามบอร์ด
    search_fields = ('title',)  # เพิ่มช่องค้นหาตามชื่อรายการ
    ordering = ('board', 'order')  # เรียงตามบอร์ดและลำดับ
    readonly_fields = ('created_at',)  # ฟิลด์ที่ไม่สามารถแก้ไขได้
    
    # จัดการการแสดงผลของ List ในหน้า Board
    def board_title(self, obj):
        return obj.board.title
    board_title.short_description = 'Board Title'  # ตั้งชื่อคอลัมน์สำหรับแสดงชื่อบอร์ด

admin.site.register(Board, BoardAdmin)
admin.site.register(List, ListAdmin)
