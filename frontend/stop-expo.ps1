# Stop Metro / Expo on port 8081
$pids = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique
if ($pids) {
  $pids | ForEach-Object {
    Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
    Write-Host "Stopped process $_ on port 8081"
  }
} else {
  Write-Host "No process listening on port 8081"
}
