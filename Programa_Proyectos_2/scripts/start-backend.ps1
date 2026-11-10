param([switch]$Background, [switch]$Restart)

$ErrorActionPreference = 'Stop'
$taskRoot = Split-Path -Parent $PSScriptRoot
$taskBackend = Join-Path $taskRoot 'Backend'
$taskPython = Join-Path $taskBackend '.venv/Scripts/python.exe'
$taskLogs = Join-Path $taskRoot '.tmp'
if (-not (Test-Path -LiteralPath $taskPython)) {
    throw 'Falta Backend/.venv. Instale requirements-dev.txt siguiendo README.md.'
}
if (-not (Test-Path -LiteralPath (Join-Path $taskBackend '.env'))) {
    throw 'Falta Backend/.env. Copie Backend/.env.example y complete su configuracion.'
}
if ($Restart -and (Test-Path -LiteralPath (Join-Path $taskLogs 'backend.pid'))) {
    $taskPid = [int](Get-Content -LiteralPath (Join-Path $taskLogs 'backend.pid') -Raw)
    $taskPrevious = Get-CimInstance Win32_Process -Filter ('ProcessId=' + $taskPid)
    if ($taskPrevious) {
        if ($taskPrevious.ExecutablePath -ne $taskPython) {
            throw 'El PID guardado no pertenece al entorno virtual del proyecto. No se detuvo el proceso.'
        }
        $taskChildren = Get-CimInstance Win32_Process -Filter ('ParentProcessId=' + $taskPid)
        foreach ($taskChild in $taskChildren) {
            if ($taskChild.CommandLine -match 'uvicorn' -and $taskChild.CommandLine.Contains($taskBackend)) {
                Stop-Process -Id $taskChild.ProcessId -ErrorAction SilentlyContinue
            }
        }
        Stop-Process -Id $taskPid -ErrorAction SilentlyContinue
    }
}
if (Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue) {
    Write-Host 'Ya hay un servidor escuchando en el puerto 8000. Compruebe http://localhost:8000/health.'
    exit 0
}

if ($Background) {
    New-Item -ItemType Directory -Path $taskLogs -Force | Out-Null
    $taskProcess = Start-Process -FilePath $taskPython -ArgumentList @(
        '-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', '8000',
        '--app-dir', ('"' + $taskBackend + '"')
    ) -WorkingDirectory $taskBackend -WindowStyle Hidden -PassThru `
      -RedirectStandardOutput (Join-Path $taskLogs 'backend.stdout.log') `
      -RedirectStandardError (Join-Path $taskLogs 'backend.stderr.log')
    Set-Content -LiteralPath (Join-Path $taskLogs 'backend.pid') -Value $taskProcess.Id
    for ($taskAttempt = 0; $taskAttempt -lt 20; $taskAttempt++) {
        $taskProcess.Refresh()
        if ($taskProcess.HasExited) { throw 'El backend no pudo iniciarse. Revise .tmp/backend.stderr.log.' }
        try {
            $taskHealth = Invoke-WebRequest -Uri 'http://127.0.0.1:8000/health' -UseBasicParsing -TimeoutSec 1
            if ($taskHealth.StatusCode -eq 200) {
                Write-Host ('Backend verificado en segundo plano. PID: ' + $taskProcess.Id)
                Write-Host 'Estado: http://localhost:8000/health. Logs: .tmp/backend.stderr.log'
                exit 0
            }
        } catch { }
        Start-Sleep -Milliseconds 250
    }
    throw 'El backend no respondio a /health. Revise .tmp/backend.stderr.log.'
} else {
    & $taskPython -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload --reload-dir $taskBackend --app-dir $taskBackend
    exit $LASTEXITCODE
}
