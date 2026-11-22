# Legt einen neuen Beitrag (Neuigkeit oder Einsatz) mit korrektem
# Dateinamen und Front Matter an und öffnet ihn in VS Code.
#
# Aufruf normalerweise über VS Code: Ctrl+Shift+P -> "Tasks: Run Task"
# -> "Neue Neuigkeit" bzw. "Neuer Einsatz".
#
# Direkt im Terminal:
#   .\scripts\neuer-beitrag.ps1 -Typ Neuigkeit -Titel "Hauptübung 2026"
#   .\scripts\neuer-beitrag.ps1 -Typ Einsatz -Titel "Brand, Scheune" -Ort "Eich" -Zeit "14:05"

param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('Neuigkeit', 'Einsatz')]
    [string]$Typ,

    [Parameter(Mandatory = $true)]
    [string]$Titel,

    # Format JJJJ-MM-TT; leer = heute
    [string]$Datum = '',

    # Nur für Einsätze
    [string]$Ort = '',
    [string]$Zeit = ''
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot

$Titel = $Titel.Trim()
if (-not $Titel) { throw 'Titel darf nicht leer sein.' }

# Datum prüfen
if (-not $Datum.Trim()) {
    $Datum = Get-Date -Format 'yyyy-MM-dd'
} else {
    $Datum = $Datum.Trim()
    $parsed = [datetime]::MinValue
    if (-not [datetime]::TryParseExact($Datum, 'yyyy-MM-dd', $null, 'None', [ref]$parsed)) {
        throw "Ungültiges Datum '$Datum' - bitte im Format JJJJ-MM-TT angeben (z. B. 2026-11-22)."
    }
}

# Zeit prüfen (nur Einsatz)
$Zeit = $Zeit.Trim()
if ($Typ -eq 'Einsatz' -and $Zeit -and $Zeit -notmatch '^([01]\d|2[0-3]):[0-5]\d$') {
    throw "Ungültige Zeit '$Zeit' - bitte im Format HH:MM angeben (z. B. 07:45)."
}

# Titel -> URL-tauglicher Dateiname ("Brand, Scheune Öko" -> "brand-scheune-oeko")
$slug = $Titel.ToLowerInvariant()
$slug = $slug -replace 'ä', 'ae' -replace 'ö', 'oe' -replace 'ü', 'ue' -replace 'ß', 'ss'
$slug = $slug.Normalize([Text.NormalizationForm]::FormD) -replace '\p{Mn}', ''
$slug = ($slug -replace '[^a-z0-9]+', '-').Trim('-')
if (-not $slug) { $slug = 'beitrag' }

$ordner = if ($Typ -eq 'Einsatz') { '_einsaetze' } else { '_posts' }
$datei = Join-Path $root (Join-Path $ordner "$Datum-$slug.md")

if (Test-Path $datei) {
    Write-Host "Datei existiert bereits, wird nur geöffnet: $datei" -ForegroundColor Yellow
} else {
    $titelYaml = $Titel -replace '"', '\"'
    $zeilen = @('---', "title: `"$titelYaml`"", "date: $Datum")
    if ($Typ -eq 'Einsatz') {
        $zeilen += "time: `"$Zeit`""
        $zeilen += "ort: `"$($Ort.Trim() -replace '"', '\"')`""
        $text = 'Kurze Beschreibung des Einsatzes.'
    } else {
        $text = 'Hier den Text der Neuigkeit schreiben.'
    }
    $zeilen += '---', '', $text, ''

    # UTF-8 ohne BOM, Unix-Zeilenenden (wie die bestehenden Dateien)
    $utf8 = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($datei, ($zeilen -join "`n"), $utf8)
    Write-Host "Neu angelegt: $datei" -ForegroundColor Green
}

# Bei Neuigkeiten: Bildordner für die Galerie anlegen
if ($Typ -eq 'Neuigkeit') {
    $bildordner = Join-Path $root "assets\images\neuigkeiten\$Datum-$slug"
    New-Item -ItemType Directory -Force $bildordner | Out-Null
    Write-Host "Fotos hier ablegen (erscheinen automatisch als Galerie): $bildordner" -ForegroundColor Cyan
}

# In VS Code öffnen (falls der 'code'-Befehl verfügbar ist)
if (Get-Command code -ErrorAction SilentlyContinue) {
    & code --reuse-window $datei
}
