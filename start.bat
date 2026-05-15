@echo off
echo Starting HunarHub Project...

echo Starting Backend Server...
start "HunarHub Backend" cmd /k "cd backend && node server.js"

echo Starting Frontend Server...
start "HunarHub Frontend" cmd /k "cd frontend && npm run dev"

echo Both servers are starting up! 
echo Please wait a few seconds and then open http://localhost:3000 in your browser.
