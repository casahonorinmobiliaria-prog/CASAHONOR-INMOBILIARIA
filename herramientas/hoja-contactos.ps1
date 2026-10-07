# Arma una hoja de contactos (miniaturas numeradas) por cada carpeta de inmueble,
# para revisar las fotos de un vistazo y decidir portada, orden y descartes.
#
# Uso:
#   .\herramientas\hoja-contactos.ps1 -Origen "C:\...\CASAHONOR - Inventario" -Salida "C:\...\hojas"
# Cada subcarpeta de -Origen produce <Salida>\<nombre de carpeta>.jpg
param(
  [Parameter(Mandatory)][string]$Origen,
  [Parameter(Mandatory)][string]$Salida,
  [int]$Columnas = 4,
  [int]$Celda = 380
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
New-Item -ItemType Directory -Force -Path $Salida | Out-Null
$exts = '.jpg', '.jpeg', '.png'
$alto = [int]($Celda * 3 / 4)
$pie = 26

Get-ChildItem -LiteralPath $Origen -Directory | Sort-Object Name | ForEach-Object {
  $carpeta = $_
  $fotos = @(Get-ChildItem -LiteralPath $carpeta.FullName -File | Where-Object { $exts -contains $_.Extension.ToLower() } | Sort-Object Name)
  if (-not $fotos.Count) { return }
  $filas = [Math]::Ceiling($fotos.Count / $Columnas)
  $W = $Columnas * $Celda; $H = $filas * ($alto + $pie)
  $hoja = New-Object System.Drawing.Bitmap $W, $H
  $g = [System.Drawing.Graphics]::FromImage($hoja)
  $g.Clear([System.Drawing.Color]::FromArgb(30, 30, 34))
  $g.InterpolationMode = 'HighQualityBicubic'
  $font = New-Object System.Drawing.Font 'Segoe UI', 11, ([System.Drawing.FontStyle]::Bold)
  $blanco = [System.Drawing.Brushes]::White
  for ($i = 0; $i -lt $fotos.Count; $i++) {
    $img = [System.Drawing.Image]::FromFile($fotos[$i].FullName)
    $x0 = ($i % $Columnas) * $Celda; $y0 = [Math]::Floor($i / $Columnas) * ($alto + $pie)
    $esc = [Math]::Min(($Celda - 8) / $img.Width, ($alto - 8) / $img.Height)
    $w = [int]($img.Width * $esc); $h = [int]($img.Height * $esc)
    $g.DrawImage($img, [int]($x0 + ($Celda - $w) / 2), [int]($y0 + ($alto - $h) / 2), $w, $h)
    $ori = if ($img.Width -gt $img.Height) { 'H' } elseif ($img.Width -lt $img.Height) { 'V' } else { 'C' }
    $g.DrawString(("#{0}  {1}x{2} {3}  {4}KB" -f ($i + 1), $img.Width, $img.Height, $ori, [int]($fotos[$i].Length / 1KB)), $font, $blanco, ($x0 + 6), ($y0 + $alto + 3))
    $img.Dispose()
  }
  $dest = Join-Path $Salida ($carpeta.Name + '.jpg')
  $hoja.Save($dest, [System.Drawing.Imaging.ImageFormat]::Jpeg)
  $g.Dispose(); $hoja.Dispose()
  # Índice: número de la hoja -> archivo original
  $idx = for ($i = 0; $i -lt $fotos.Count; $i++) { "{0}`t{1}" -f ($i + 1), $fotos[$i].FullName }
  $idx | Set-Content -Encoding UTF8 -LiteralPath (Join-Path $Salida ($carpeta.Name + '.txt'))
  Write-Output ("{0}: {1} fotos" -f $carpeta.Name, $fotos.Count)
}
