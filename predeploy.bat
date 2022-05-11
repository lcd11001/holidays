@echo OFF

REM delete proxy from current process
REM https://stackoverflow.com/questions/13222724/command-line-to-remove-an-environment-variable-from-the-os-level-configuration
set http_proxy=
set https_proxy=

REM delete proxy from NodeJS
call npm config delete proxy
call npm config delete https-proxy

if exist ".\build" (
    rmdir /s /q ".\build"
)

if exist ".\obfuscated" (
    rmdir /s /q ".\obfuscated"
)

if exist ".\deploy" (
    rmdir /s /q ".\deploy"
)

call npm run build-deploy

call npm run obfuscate

mkdir "./deploy"

xcopy /s /q /y ".\build\*.*" ".\deploy"

xcopy /s /q /y ".\obfuscated\*.*" ".\deploy"

@echo Finish at %time:~0,5%