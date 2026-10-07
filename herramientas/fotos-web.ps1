# Convierte las fotos del inventario a WebP para la web, usando Edge en modo headless
# (no hay que instalar nada).
#
# Entrada: un manifiesto JSON con el orden final de las fotos de cada inmueble:
#   [ { "codigo": "CH-005", "fotos": ["C:\\ruta\\a\\foto1.jpeg", "..."] }, ... ]
#   La primera foto de la lista es la portada.
#
# Salida, por inmueble:  img/inmuebles/ch-005/01.webp      (galería y destacada, máx. 1600 px)
#                        img/inmuebles/ch-005/01-800.webp  (tarjetas)
# y un resumen JSON (-Resumen) con las rutas, para pegarlas en js/config.js.
#
# Uso:
#   .\herramientas\fotos-web.ps1 -Manifiesto manifiesto.json -Resumen resumen.json
param(
  [Parameter(Mandatory)][string]$Manifiesto,
  [string]$Salida = "img/inmuebles",
  [string]$Resumen = "",
  [int[]]$Anchos = @(1600, 800),
  [double]$Calidad = 0.8,
  [int]$Port = 9334
)
$ErrorActionPreference = 'Stop'
$raiz = Split-Path -Parent $PSScriptRoot
if (-not [IO.Path]::IsPathRooted($Salida)) { $Salida = Join-Path $raiz $Salida }
$items = Get-Content -Raw -Encoding UTF8 -LiteralPath $Manifiesto | ConvertFrom-Json

$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$prof = Join-Path $env:TEMP "ch-edge-fotos"
$proc = Start-Process -FilePath $edge -PassThru -ArgumentList @(
  '--headless=new', '--disable-gpu', '--no-first-run',
  "--remote-debugging-port=$Port", "--user-data-dir=`"$prof`"", 'about:blank')

$script:sock = $null; $script:id = 0
$ct = [Threading.CancellationToken]::None
$buf = New-Object byte[] 1048576

function Invoke-Js([string]$expr) {
  $script:id++
  $msg = @{ id = $script:id; method = 'Runtime.evaluate'; params = @{ expression = $expr; awaitPromise = $true; returnByValue = $true } } | ConvertTo-Json -Depth 5 -Compress
  $bytes = [Text.Encoding]::UTF8.GetBytes($msg)
  $script:sock.SendAsync([ArraySegment[byte]]$bytes, 'Text', $true, $ct).Wait()
  $prefix = '{"id":' + $script:id + ','
  while ($true) {
    $ms = New-Object IO.MemoryStream
    do {
      $r = $script:sock.ReceiveAsync([ArraySegment[byte]]$buf, $ct).Result
      $ms.Write($buf, 0, $r.Count)
    } while (-not $r.EndOfMessage)
    $text = [Text.Encoding]::UTF8.GetString($ms.ToArray())
    if (-not $text.StartsWith($prefix)) { continue }
    if ($text -match '"exceptionDetails"') { throw "Error en Edge: $($text.Substring(0, [Math]::Min(600, $text.Length)))" }
    # El valor es JSON de base64 (sin comillas internas escapadas salvo las del propio JSON)
    $k = $text.IndexOf('"value":"')
    if ($k -lt 0) { throw "Respuesta inesperada: $($text.Substring(0, [Math]::Min(600, $text.Length)))" }
    $s = $k + 9; $e = $text.LastIndexOf('"}}}')
    if ($e -lt $s) { $e = $text.LastIndexOf('"') }
    return [regex]::Unescape($text.Substring($s, $e - $s))
  }
}

# Codifica una imagen (bytes en base64) a WebP en cada ancho pedido; no amplía fotos pequeñas.
$encoder = @'
window.chEncode = async (b64, anchos, q) => {
  const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const bmp = await createImageBitmap(new Blob([bin]));
  const res = { w: bmp.width, h: bmp.height, out: {} };
  for (const A of anchos) {
    const w = Math.min(A, bmp.width), h = Math.round(bmp.height * w / bmp.width);
    const c = new OffscreenCanvas(w, h), x = c.getContext('2d');
    x.imageSmoothingQuality = 'high';
    x.drawImage(bmp, 0, 0, w, h);
    const blob = await c.convertToBlob({ type: 'image/webp', quality: q });
    const buf = new Uint8Array(await blob.arrayBuffer());
    let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
    res.out[A] = { w, h, b64: btoa(s) };
  }
  return JSON.stringify(res);
};
'ok'
'@

$lista = @()
try {
  $ws = $null
  for ($i = 0; $i -lt 60 -and -not $ws; $i++) {
    Start-Sleep -Milliseconds 500
    try {
      $list = Invoke-RestMethod "http://127.0.0.1:$Port/json" -TimeoutSec 2
      $t = @($list | ForEach-Object { $_ }) | Where-Object { $_.type -eq 'page' } | Select-Object -First 1
      if ($t) { $ws = [string]$t.webSocketDebuggerUrl }
    } catch {}
  }
  if (-not $ws) { throw "No se pudo conectar a Edge" }
  $script:sock = New-Object System.Net.WebSockets.ClientWebSocket
  $script:sock.ConnectAsync([Uri]$ws, $ct).Wait()
  [void](Invoke-Js $encoder)

  $anchosJs = '[' + ($Anchos -join ',') + ']'
  foreach ($it in $items) {
    $code = ([string]$it.codigo).ToLower()
    $dir = Join-Path $Salida $code
    if (Test-Path -LiteralPath $dir) { Remove-Item -LiteralPath $dir -Recurse -Force }
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    $fotos = @()
    $n = 0
    foreach ($src in $it.fotos) {
      $n++
      $nn = '{0:D2}' -f $n
      $b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($src))
      $json = Invoke-Js "window.chEncode('$b64', $anchosJs, $Calidad)"
      $r = $json | ConvertFrom-Json
      foreach ($A in $Anchos) {
        $o = $r.out.$A
        $nombre = if ($A -eq $Anchos[0]) { "$nn.webp" } else { "$nn-$A.webp" }
        [IO.File]::WriteAllBytes((Join-Path $dir $nombre), [Convert]::FromBase64String($o.b64))
      }
      $big = $r.out.($Anchos[0])
      $fotos += [pscustomobject]@{ n = $nn; w = $big.w; h = $big.h }
    }
    $kb = [Math]::Round(((Get-ChildItem -LiteralPath $dir | Measure-Object Length -Sum).Sum) / 1KB)
    Write-Output ("{0}: {1} fotos, {2} KB" -f $it.codigo, $n, $kb)
    $lista += [pscustomobject]@{ codigo = $it.codigo; carpeta = "img/inmuebles/$code"; fotos = $fotos }
  }
} finally {
  if ($script:sock) { $script:sock.Dispose() }
  if ($proc -and -not $proc.HasExited) { Stop-Process -Id $proc.Id -Force }
  Get-CimInstance Win32_Process -Filter "Name='msedge.exe'" | Where-Object { $_.CommandLine -like "*ch-edge-fotos*" } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
}
if ($Resumen) { ConvertTo-Json -InputObject @($lista) -Depth 5 | Set-Content -Encoding UTF8 -LiteralPath $Resumen }
