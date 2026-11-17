$ErrorActionPreference = 'Stop'
$taskRoot = Split-Path -Parent $PSScriptRoot
$taskPython = Join-Path $taskRoot 'Backend/.venv/Scripts/python.exe'
if (-not (Test-Path -LiteralPath $taskPython)) {
    throw 'Cree Backend/.venv e instale requirements-dev.txt. Consulte README.md.'
}
$taskTemp = Join-Path $taskRoot '.tmp'
New-Item -ItemType Directory -Path $taskTemp -Force | Out-Null
$taskOldTemp = $env:TEMP
$taskOldTmp = $env:TMP
try {
    $env:TEMP = $taskTemp
    $env:TMP = $taskTemp
    Push-Location (Join-Path $taskRoot 'Backend')
    try {
        & $taskPython -m ruff check app tests --select F401,F811,I
        if ($LASTEXITCODE -ne 0) { throw 'Falló la revisión Python' }
        & $taskPython -m pytest -q --cov=app --cov-report=term-missing
        if ($LASTEXITCODE -ne 0) { throw 'Fallaron las pruebas del backend' }
    } finally { Pop-Location }
    Push-Location (Join-Path $taskRoot 'Frontend')
    try {
        npm.cmd run check
        if ($LASTEXITCODE -ne 0) { throw 'Fallaron las verificaciones del frontend' }
    } finally { Pop-Location }
} finally {
    $env:TEMP = $taskOldTemp
    $env:TMP = $taskOldTmp
}
