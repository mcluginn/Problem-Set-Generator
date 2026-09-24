# Cloudflare Tunnel Setup & Operation Guide

This guide details how to securely expose the local **Next.js Engineering Practice Engine** to the public internet using **Cloudflare Tunnel (`cloudflared`)**.

Cloudflare Tunnel establishes an outbound-only encrypted connection to Cloudflare's global edge network, meaning you **never need to open ports on your router, configure port forwarding, or expose your public IP address**.

---

## 1. Prerequisites

- `cloudflared` CLI installed on your system (already confirmed on this system: `cloudflared version 2026.8.2`).
  - *If installing on another machine*: `winget install Cloudflare.cloudflared` (Windows) or `brew install cloudflared` (macOS).
- The Next.js practice engine running locally (`npm run dev` or `npm run start`).

---

## 2. Option A: Instant Quick Tunnel (No Account or Domain Needed)

If you need a quick public HTTPS link for testing, sharing with collaborators, or grading demos, use the **Quick Tunnel**.

### Step 1: Start your Next.js application
In Terminal 1:
```bash
npm run dev
# Next.js starts on http://localhost:3000
```

### Step 2: Start the Tunnel
In Terminal 2, run either:
```bash
# Using the new npm script
npm run tunnel:quick

# Or using the PowerShell launcher
powershell -ExecutionPolicy Bypass -File ./scripts/start-cloudflare-tunnel.ps1

# Or directly via cloudflared CLI
cloudflared tunnel --url http://localhost:3000
```

Cloudflare will output a public URL such as:
```text
+--------------------------------------------------------------------------------------------+
|  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
|  https://random-words-example.trycloudflare.com                                            |
+--------------------------------------------------------------------------------------------+
```
Anyone with this URL can access your running practice engine securely over HTTPS!

---

## 3. Option B: Named Tunnel with a Custom Domain (Permanent Setup)

For a permanent production URL (e.g., `https://math.yourdomain.com`), set up a **Named Tunnel** tied to your Cloudflare account.

### Step 1: Authenticate with Cloudflare
```bash
cloudflared tunnel login
```
A browser window will open asking you to select your domain zone. Once authorized, a certificate is saved at `%USERPROFILE%\.cloudflared\cert.pem`.

### Step 2: Create a Tunnel
```bash
cloudflared tunnel create engineering-engine
```
This prints your unique `Tunnel UUID` (e.g. `12345678-abcd-1234-abcd-1234567890ab`) and writes credentials to `%USERPROFILE%\.cloudflared\<UUID>.json`.

### Step 3: Configure the Ingress Rules
Copy `cloudflare/config.example.yml` to `cloudflare/config.yml`:
```yaml
tunnel: 12345678-abcd-1234-abcd-1234567890ab
credentials-file: C:\Users\<YourUser>\.cloudflared\12345678-abcd-1234-abcd-1234567890ab.json

ingress:
  # Map your domain to local Next.js instance
  - hostname: math.yourdomain.com
    service: http://localhost:3000
    originRequest:
      httpHostHeader: localhost:3000
  
  # Catch-all (Mandatory)
  - service: http_status:404
```

### Step 4: Route DNS to the Tunnel
```bash
cloudflared tunnel route dns engineering-engine math.yourdomain.com
```

### Step 5: Run the Tunnel
```bash
npm run tunnel:config
# or
powershell -ExecutionPolicy Bypass -File ./scripts/start-cloudflare-tunnel.ps1 -Mode config
```

---

## 4. Option C: Cloudflare Zero Trust Dashboard (Remotely Managed)

If you use Cloudflare Zero Trust (Teams):
1. Go to **Zero Trust Dashboard** $\to$ **Networks** $\to$ **Tunnels**.
2. Click **Create a tunnel** $\to$ choose **Cloudflared**.
3. Name your tunnel and copy the provided connector run command:
   ```bash
   cloudflared tunnel run --token <YOUR_TOKEN>
   ```
4. In the dashboard's **Public Hostname** tab:
   - **Service**: `HTTP`
   - **URL**: `localhost:3000`
5. Run locally using the script:
   ```bash
   powershell -ExecutionPolicy Bypass -File ./scripts/start-cloudflare-tunnel.ps1 -Mode token -Token <YOUR_TOKEN>
   ```

---

## 5. Installing as a Background Windows Service

To have the tunnel run automatically in the background when Windows boots:
```powershell
# Open PowerShell as Administrator
cloudflared service install
# Start the service
Start-Service cloudflared
```

---

## 6. Available NPM Scripts

The following scripts are now configured in `package.json`:

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run tunnel` | Runs `scripts/start-cloudflare-tunnel.ps1` | Interactive PowerShell launcher |
| `npm run tunnel:quick` | `cloudflared tunnel --url http://localhost:3000` | Instant public URL on port 3000 |
| `npm run tunnel:quick:3010` | `cloudflared tunnel --url http://localhost:3010` | Instant public URL on port 3010 |
| `npm run tunnel:config` | `cloudflared tunnel --config ./cloudflare/config.yml run` | Named tunnel using config.yml |

---

## 7. Troubleshooting

- **502 Bad Gateway**: Ensure your Next.js application is running (`npm run dev`) and responding at `http://localhost:3000`.
- **WebSocket / Hot Module Replacement (HMR)**: Cloudflare Tunnel supports WebSockets natively. If using a Named Tunnel, ensure the `httpHostHeader` is set to `localhost:3000` so Next.js HMR correctly identifies the host.
