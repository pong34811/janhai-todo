from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from apps.users.views import CustomTokenObtainPairView, UserViewSet
from apps.boards.views import BoardViewSet ,ListViewSet ,TaskViewSet
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

# Create a router and register your viewsets
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'boards', BoardViewSet ,basename='boards')
router.register(r'lists', ListViewSet ,basename='lists')
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('api/', include(router.urls)),  # Include all router URLs under /api/
    path('api/admin/', admin.site.urls),  # Admin site

    # Token URLs
    path('api/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
