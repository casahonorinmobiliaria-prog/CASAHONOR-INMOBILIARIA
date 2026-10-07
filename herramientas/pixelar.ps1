# Pixela una zona de una foto (placas de carros, números, documentos) antes de publicarla.
# Uso:
#   .\herramientas\pixelar.ps1 -Foto entrada.jpg -Salida salida.jpg -Zona 712,952,93,58 [-Zona x,y,ancho,alto ...]
param(
  [Parameter(Mandatory)][string]$Foto,
  [Parameter(Mandatory)][string]$Salida,
  [Parameter(Mandatory)][string[]]$Zona,
  [int]$Bloque = 12
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile((Resolve-Path -LiteralPath $Foto))
$bmp = New-Object System.Drawing.Bitmap $img
$img.Dispose()
$g = [System.Drawing.Graphics]::FromImage($bmp)
foreach ($z in $Zona) {
  $x, $y, $w, $h = ($z -split ',') | ForEach-Object { [int]$_ }
  for ($by = $y; $by -lt $y + $h; $by += $Bloque) {
    for ($bx = $x; $bx -lt $x + $w; $bx += $Bloque) {
      $bw = [Math]::Min($Bloque, $x + $w - $bx); $bh = [Math]::Min($Bloque, $y + $h - $by)
      # color promedio del bloque
      $r = 0; $gg = 0; $b = 0; $n = 0
      for ($py = $by; $py -lt $by + $bh; $py += 2) { for ($px = $bx; $px -lt $bx + $bw; $px += 2) {
        $c = $bmp.GetPixel($px, $py); $r += $c.R; $gg += $c.G; $b += $c.B; $n++ } }
      $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb([int]($r / $n), [int]($gg / $n), [int]($b / $n)))
      $g.FillRectangle($brush, $bx, $by, $bw, $bh); $brush.Dispose()
    }
  }
}
$g.Dispose()
$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$par = New-Object System.Drawing.Imaging.EncoderParameters 1
$par.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 94L
$bmp.Save($Salida, $enc, $par)
$bmp.Dispose()
Write-Output "OK $Salida"
