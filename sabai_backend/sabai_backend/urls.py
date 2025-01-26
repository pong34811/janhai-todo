from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from apps.users.views import CustomTokenObtainPairView, GoogleLogin, UserViewSet, PasswordResetView, ChangePasswordView
from apps.users.views import PasswordResetConfirmView
from apps.boards.views import BoardViewSet, ListViewSet, TaskViewSet
from rest_framework_simplejwt.views import TokenRefreshView

router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename='users')  
router.register(r'boards', BoardViewSet, basename='boards')
router.register(r'lists', ListViewSet, basename='lists')
router.register(r'tasks', TaskViewSet, basename='tasks')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/google-login/', GoogleLogin.as_view(), name='google-login'),
    path('api/admin/', admin.site.urls),
    path('api/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/password_reset/', PasswordResetView.as_view(), name='password_reset'),
    # path('api/password_reset/confirm/<str:uidb64>/<str:token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('api/password_reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('api/change_password/', ChangePasswordView.as_view(), name='change_password'),

    # การตั้งค่าการล็อกอินด้วยโซเชียล (Google OAuth)
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/auth/social/google', include('allauth.socialaccount.urls')),  # การเชื่อมต่อกับ allauth สำหรับ Google OAuth
]
