@echo off
title Bia - Bradesco (servidor local)
cd /d "%~dp0"

echo.
echo   ========================================
echo    Bia . Bradesco - demonstracao local
echo   ========================================
echo.

REM Garante o Node no PATH (local padrao de instalacao)
if exist "C:\Program Files\nodejs\node.exe" set "PATH=%PATH%;C:\Program Files\nodejs"

REM Confere se o Node esta disponivel
where node >nul 2>nul
if errorlevel 1 (
  echo   [ERRO] Node.js nao encontrado.
  echo   Instale com:  winget install OpenJS.NodeJS.LTS
  echo.
  pause
  exit /b 1
)

REM Primeira execucao: instala as dependencias
if not exist "node_modules\" (
  echo   Primeira vez aqui: instalando dependencias, aguarde...
  echo.
  call npm install
  echo.
)

REM Abre o navegador automaticamente quando o servidor ja estiver de pe
start "" /min cmd /c "timeout /t 6 /nobreak >nul & start http://localhost:5173"

echo   Iniciando... o navegador abre sozinho em alguns segundos.
echo   (se nao abrir, acesse  http://localhost:5173 )
echo.
echo   ^>^>  Para PARAR a aplicacao, feche esta janela.  ^<^<
echo.

REM Inicia frontend (Vite) + servidor (Express) juntos
call npm run dev

REM Se algo encerrar o servidor, mantem a janela aberta para ver o motivo
echo.
echo   A aplicacao foi encerrada.
pause
