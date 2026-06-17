# Generates square Expo icons from the horizontal logo on brand background
Add-Type -AssemblyName System.Drawing

$assets = Join-Path $PSScriptRoot "..\assets"
$logoPath = Join-Path $assets "atomik-logo-horizontal.png"
$bg = [System.Drawing.Color]::FromArgb(255, 35, 31, 32) # #231f20

function New-SquareIcon([int]$size, [string]$outPath) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.Clear($bg)

  $logo = [System.Drawing.Image]::FromFile($logoPath)
  $pad = [int]($size * 0.15)
  $maxW = $size - ($pad * 2)
  $maxH = $size - ($pad * 2)
  $scale = [Math]::Min($maxW / $logo.Width, $maxH / $logo.Height)
  $w = [int]($logo.Width * $scale)
  $h = [int]($logo.Height * $scale)
  $x = [int](($size - $w) / 2)
  $y = [int](($size - $h) / 2)
  $g.DrawImage($logo, $x, $y, $w, $h)
  $logo.Dispose()
  $g.Dispose()
  $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host "Created $outPath (${size}x${size})"
}

New-SquareIcon 1024 (Join-Path $assets "icon.png")
New-SquareIcon 1024 (Join-Path $assets "adaptive-icon.png")
New-SquareIcon 1284 (Join-Path $assets "splash.png")
Copy-Item -Force (Join-Path $assets "icon.png") (Join-Path $assets "favicon.png")
Copy-Item -Force (Join-Path $assets "icon.png") (Join-Path $assets "notification-icon.png")
