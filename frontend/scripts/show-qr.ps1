# Generates a scannable QR (PNG + terminal) for Expo Go on a physical device
param([string]$Ip)

$ErrorActionPreference = 'Stop'
if (-not $Ip) {
  $Ip = (
    Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object {
      $_.IPAddress -notmatch '^127\.' -and
      $_.IPAddress -notmatch '^169\.254\.' -and
      ($_.IPAddress -match '^192\.168\.' -or $_.IPAddress -match '^172\.(1[6-9]|2[0-9]|3[0-1])\.' -or $_.IPAddress -match '^10\.')
    } |
    Select-Object -First 1
  ).IPAddress
}

if (-not $Ip) {
  Write-Host 'No LAN IP found. Connect Wi-Fi or hotspot first.' -ForegroundColor Red
  exit 1
}

$Url = 'exp://' + $Ip + ':8081'
$out = Join-Path $PSScriptRoot '..\assets\expo-qr.png'
$encoded = [uri]::EscapeDataString($Url)

Write-Host ''
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ' ATOMIK - Expo Go' -ForegroundColor White
Write-Host '========================================' -ForegroundColor Cyan
Write-Host (' URL:  ' + $Url) -ForegroundColor Yellow
Write-Host ''

$qrApi = 'https://api.qrserver.com/v1/create-qr-code/?size=420x420&data=' + $encoded
Invoke-WebRequest -Uri $qrApi -OutFile $out -UseBasicParsing | Out-Null

Write-Host ' QR image saved (open on PC, scan with phone):' -ForegroundColor Green
Write-Host (' ' + $out) -ForegroundColor White
Write-Host ''
Write-Host ' In Expo Go: Enter URL manually if scan fails.' -ForegroundColor Gray
Write-Host ''

# Try ASCII QR in terminal (optional)
try {
  $null = Get-Command npx -ErrorAction Stop
  npx --yes qrcode-terminal@0.12.0 $Url 2>$null
} catch {}
