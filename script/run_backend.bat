@echo off
call venv\Scripts\activate.bat

cd /d "../sabai_backend"
python manage.py runserver
pause
