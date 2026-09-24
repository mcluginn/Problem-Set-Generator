<#
.SYNOPSIS
    Starts a Cloudflare Tunnel for the Engineering Practice Engine (Next.js).

.DESCRIPTION
    Exposes your local Next.js application to the internet securely via Cloudflare Tunnel.
    Supports:
      1. Quick Tunnel (Instant free trycloudflare.com URL, no login/domain needed)
      2. Named Tunnel (Routes your custom domain configured in cloudflare/config.yml)
      3. Zero Trust Dashboard Token (Connector token from Cloudflare Zero Trust dashboard)

.PARAMETER Mode
    'quick' (default) - Instant trycloudflare.com tunnel
    'config'          - Runs using cloudflare/config.yml
    'token'           - Runs using a Cloudflare Zero Trust tunnel token

.PARAMETER Port
    Local port to expose (Default: 3000)

.PARAMETER Token
    Cloudflare tunnel token (required if Mode is 'token')

.EXAMPLE
    .\scripts\start-cloudflare-tunnel.ps1
    .\scripts\start-cloudflare-tunnel.ps1 -Port 3010
    .\scripts\start-cloudflare-tunnel.ps1 -Mode config
    .\scripts\start-cloudflare-tunnel.ps1 -Mode token -Token eyJh...
#>

[CmdletBinding()]
param (
    [ValidateSet('quick', 'config', 'token')]
    [string]$Mode = 'quick',

    [int]$Port = 3000,

    [string]$Token = ''
)

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "    Cloudflare Tunnel for Engineering Practice Engine       " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Verify cloudflared installation
$cloudflaredCmd = Get-Command cloudflared -ErrorAction SilentlyContinue
if (-not $cloudflaredCmd) {
    Write-Host "[ERROR] 'cloudflared' is not found in your PATH." -ForegroundColor Red
    Write-Host "To install cloudflared on Windows, run:" -ForegroundColor Yellow
    Write-Host "    winget install Cloudflare.cloudflared" -ForegroundColor White
    Write-Host "Or download from: https://github.com/cloudflare/cloudflared/releases" -ForegroundColor Gray
    exit 1
}

$version = & cloudflared --version
Write-Host "[INFO] Detected: $version" -ForegroundColor Green

# 2. Check if local Next.js server is listening
Write-Host "[INFO] Verifying local service on port $Port..." -ForegroundColor Gray
try {
    $tcp = New-Object System.Net.Sockets.TcpClient
    $asyncResult = $tcp.BeginConnect("127.0.0.1", $Port, $null, $null)
    $wait = $asyncResult.AsyncWaitHandle.WaitOne(800, $false)
    if ($wait -and $tcp.Connected) {
        $tcp.EndConnect($asyncResult)
        $tcp.Close()
        Write-Host "[SUCCESS] Local Next.js app is active and listening on http://localhost:$Port." -ForegroundColor Green
    } else {
        $tcp.Close()
        Write-Host "[WARNING] No active service detected on http://localhost:$Port." -ForegroundColor Yellow
        Write-Host "          Make sure 'npm run dev' is running in another terminal." -ForegroundColor Yellow
    }
} catch {
    Write-Host "[WARNING] Unable to verify port $Port. Proceeding anyway..." -ForegroundColor Yellow
}

Write-Host ""

# 3. Launch Tunnel based on Mode
switch ($Mode) {
    'quick' {
        Write-Host "[MODE] Starting Quick Cloudflare Tunnel for http://localhost:$Port" -ForegroundColor Cyan
        Write-Host "[INFO] Cloudflare will generate a public https://*.trycloudflare.com URL below." -ForegroundColor Gray
        Write-Host "[INFO] Press Ctrl+C at any time to terminate the tunnel." -ForegroundColor Gray
        Write-Host "------------------------------------------------------------" -ForegroundColor DarkGray
        & cloudflared tunnel --url "http://localhost:$Port"
    }

    'config' {
        $configPath = Join-Path $PSScriptRoot "..\cloudflare\config.yml"
        if (-not (Test-Path $configPath)) {
            Write-Host "[ERROR] Config file not found at: $configPath" -ForegroundColor Red
            Write-Host "Please copy 'cloudflare/config.example.yml' to 'cloudflare/config.yml' and configure your tunnel." -ForegroundColor Yellow
            exit 1
        }
        Write-Host "[MODE] Starting Named Cloudflare Tunnel using config: $configPath" -ForegroundColor Cyan
        Write-Host "[INFO] Press Ctrl+C at any time to terminate the tunnel." -ForegroundColor Gray
        Write-Host "------------------------------------------------------------" -ForegroundColor DarkGray
        & cloudflared tunnel --config "$configPath" run
    }

    'token' {
        if ([string]::IsNullOrWhiteSpace($Token)) {
            Write-Host "[ERROR] Parameter -Token is required for token mode." -ForegroundColor Red
            Write-Host "Usage: .\scripts\start-cloudflare-tunnel.ps1 -Mode token -Token <YOUR_TUNNEL_TOKEN>" -ForegroundColor Yellow
            exit 1
        }
        Write-Host "[MODE] Starting Cloudflare Tunnel using Zero Trust Token..." -ForegroundColor Cyan
        Write-Host "[INFO] Press Ctrl+C at any time to terminate the tunnel." -ForegroundColor Gray
        Write-Host "------------------------------------------------------------" -ForegroundColor DarkGray
        & cloudflared tunnel run --token "$Token"
    }
}
