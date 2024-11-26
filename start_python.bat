@echo off
cd /d "D:\GIT\janhai-todo"
call venv\Scripts\activate.bat

cd /d "D:\GIT\janhai-todo\sabai_backend"
python manage.py runserver
pause
