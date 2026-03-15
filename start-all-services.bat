@echo off
echo ========================================
echo Starting Campus Recruitment Backend Services
echo ========================================
echo.

echo Starting Service Registry (Port 8761)...
start "ServiceRegistry" cmd /k "cd /d \"c:\Users\HP\Desktop\SpringBoot\Campus Recruitment System\Backend-Campus\ServiceRegistryService\" && mvn spring-boot:run"
timeout /t 30 /nobreak

echo Starting API Gateway (Port 8080)...
start "ApiGateway" cmd /k "cd /d \"c:\Users\HP\Desktop\SpringBoot\Campus Recruitment System\Backend-Campus\ApiGatewayService\" && mvn spring-boot:run"
timeout /t 20 /nobreak

echo Starting Auth Service (Port 8081)...
start "AuthService" cmd /k "cd /d \"c:\Users\HP\Desktop\SpringBoot\Campus Recruitment System\Backend-Campus\authService\" && mvn spring-boot:run"
timeout /t 15 /nobreak

echo Starting Student Service (Port 8082)...
start "StudentService" cmd /k "cd /d \"c:\Users\HP\Desktop\SpringBoot\Campus Recruitment System\Backend-Campus\StudentService\" && mvn spring-boot:run"
timeout /t 15 /nobreak

echo Starting Company Service (Port 8083)...
start "CompanyService" cmd /k "cd /d \"c:\Users\HP\Desktop\SpringBoot\Campus Recruitment System\Backend-Campus\CompanyService\" && mvn spring-boot:run"
timeout /t 15 /nobreak

echo Starting Admin Service (Port 8084)...
start "AdminService" cmd /k "cd /d \"c:\Users\HP\Desktop\SpringBoot\Campus Recruitment System\Backend-Campus\AdminService\" && mvn spring-boot:run"

echo.
echo ========================================
echo All services are starting...
echo Please wait 2-3 minutes for all services to fully start
echo ========================================
echo.
pause
