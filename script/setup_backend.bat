@echo off

cd..

:: ติดตั้ง virtualenv ถ้ายังไม่ได้ติดตั้ง
pip show virtualenv > nul 2>&1 || pip install virtualenv

:: สร้าง venv ถ้ายังไม่มี
if not exist "venv\Scripts\activate.bat" virtualenv venv

:: เปิดใช้งาน virtualenv
call venv\Scripts\activate.bat

:: เปลี่ยนไปยัง sabai_backend
cd /d "sabai_backend"

:: ติดตั้ง dependencies จาก requirements.txt
pip install -r "requirements.txt" --no-cache-dir

pause
