from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.users.views import UserViewSet
from apps.boards.views import BoardViewSet
from django.contrib import admin

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'boards', BoardViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/admin/', admin.site.urls),
]
