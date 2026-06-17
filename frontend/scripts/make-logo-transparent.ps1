# Keys out brand charcoal (#231f20) and near-black — transparent PNG for dark UI
Add-Type -AssemblyName System.Drawing

$assets = Join-Path $PSScriptRoot '..\assets'
$src = Join-Path $assets 'atomik-logo-horizontal.png'
$dst = Join-Path $assets 'atomik-logo-transparent.png'

# Brand matte + pure black (splash)
$backgrounds = @(
  @{ R = 35; G = 31; B = 32 },  # #231f20
  @{ R = 0; G = 0; B = 0 }
)

function Get-Alpha([int]$r, [int]$g, [int]$b) {
  $minDist = 999.0
  foreach ($bg in $backgrounds) {
    $dr = $r - $bg.R
    $dg = $g - $bg.G
    $db = $b - $bg.B
    $d = [Math]::Sqrt($dr * $dr + $dg * $dg + $db * $db)
    if ($d -lt $minDist) { $minDist = $d }
  }
  if ($minDist -le 18) { return 0 }
  if ($minDist -le 52) {
    return [int]([Math]::Min(255, ($minDist - 18) / 34 * 255))
  }
  return 255
}

$bmp = [System.Drawing.Bitmap]::FromFile($src)
$fmt = [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
$out = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height, $fmt)

for ($x = 0; $x -lt $bmp.Width; $x++) {
  for ($y = 0; $y -lt $bmp.Height; $y++) {
    $c = $bmp.GetPixel($x, $y)
    $a = Get-Alpha $c.R $c.G $c.B
    if ($a -eq 0) {
      $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
    } elseif ($a -lt 255) {
      $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($a, $c.R, $c.G, $c.B))
    } else {
      $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($c.A, $c.R, $c.G, $c.B))
    }
  }
}

$w = $bmp.Width
$h = $bmp.Height
$out.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
Copy-Item -Force $dst (Join-Path $assets 'atomik-logo-white.png')
$bmp.Dispose()
$out.Dispose()
Write-Host "Saved: $dst (${w}x${h})"
