# Kate — Deployment Guide

This guide covers deploying Kate to a production environment. The recommended approach is a **VPS** (e.g. DigitalOcean Droplet, Hetzner, Linode) because Ollama needs direct CPU/GPU access which managed container platforms don't easily provide.

---

## Architecture overview

```
Internet
    │
    ▼
Nginx (reverse proxy + SSL)
    │
    ├── :3000 → Frontend (Next.js)
    ├── :8083 → Backend (Go)
    └── :8085 → Scraper (Python/Flask)

Ollama runs as a host service (not in Docker)
Backend reaches Ollama via host.docker.internal:11434
```

---

## Option A — VPS deployment (recommended)

### 1. Provision a server

Minimum specs for `llama3.2` (3B):
- **CPU**: 2 vCPUs
- **RAM**: 4GB (8GB recommended — llama3.2 uses ~2.5GB)
- **Disk**: 20GB (the model itself is ~2GB)
- **OS**: Ubuntu 22.04 LTS

Recommended providers: Hetzner CX22 (~€4/mo), DigitalOcean Basic ($12/mo), Linode Nanode.

### 2. Install dependencies on the server

```bash
# Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Ollama
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.2

# Enable Ollama as a system service (auto-start on reboot)
sudo systemctl enable ollama
sudo systemctl start ollama
```

### 3. Clone the repo and configure env files

```bash
git clone https://github.com/gdloparco/2-Kate.git
cd 2-Kate

cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp scraper/.env.example scraper/.env
```

Edit `backend/.env`:
```env
OLLAMA_URL=http://host.docker.internal:11434
OLLAMA_MODEL=llama3.2
SCRAPER_URL=http://scraper:8085
BULLETPOINTS_PATH=/data/bulletpoints.json
```

Edit `frontend/.env`:
```env
NEXT_PUBLIC_BACKEND_URL=https://your-domain.com/api
NODE_ENV=production
MY_EMAIL=your@gmail.com
MY_PASSWORD=your_gmail_app_password
```

> On Linux, `host.docker.internal` may not resolve automatically. If so, replace it with the Docker bridge gateway IP:
> ```bash
> ip route show default | awk '{print $3}'
> # Usually 172.17.0.1
> ```
> Then set `OLLAMA_URL=http://172.17.0.1:11434` and ensure Ollama listens on all interfaces:
> ```bash
> # /etc/systemd/system/ollama.service.d/override.conf
> [Service]
> Environment="OLLAMA_HOST=0.0.0.0:11434"
> ```

### 4. Build and start containers

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

Check logs:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### 5. Set up Nginx as a reverse proxy

```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```

Create `/etc/nginx/sites-available/kate`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api/ {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://localhost:8083;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        client_max_body_size 10M;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/kate /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Add SSL with Let's Encrypt (free)
sudo certbot --nginx -d your-domain.com
```

### 6. Auto-restart on reboot

Docker Compose services have `restart: unless-stopped` set, so they start automatically. Ollama is managed by systemd. Nothing more needed.

---

## Option B — Railway (easier, no server management)

Railway can host the frontend, backend, and scraper as separate services. **Ollama cannot run on Railway** — you would need to use the Gemini API instead (or another hosted LLM).

If you want to use Gemini on Railway:
1. Create a free API key at [aistudio.google.com](https://aistudio.google.com)
2. Set `GEMINI_API_KEY` as a Railway env var
3. Swap `callLLM` back to `callGemini` in `backend/src/services/company_form_data_api.go`

Railway deployment steps:
1. Push the repo to GitHub
2. Create a new Railway project → "Deploy from GitHub repo"
3. Add three services: `backend`, `frontend`, `scraper`
4. Set the root directory for each service
5. Add env vars in the Railway dashboard for each service
6. Railway auto-detects Dockerfile and builds on push

---

## Option C — Fly.io

Similar to Railway. Fly.io supports Dockerfiles natively and has a free tier.

```bash
# Install flyctl
brew install flyctl
fly auth login

# Deploy backend
cd backend
fly launch --name kate-backend
fly secrets set OLLAMA_URL=... SCRAPER_URL=... BULLETPOINTS_PATH=...
fly deploy

# Deploy scraper
cd ../scraper
fly launch --name kate-scraper
fly deploy

# Deploy frontend
cd ../frontend
fly launch --name kate-frontend
fly secrets set NEXT_PUBLIC_BACKEND_URL=https://kate-backend.fly.dev
fly deploy
```

---

## Environment variables reference

### Backend

| Variable | Description | Default |
|---|---|---|
| `OLLAMA_URL` | Ollama server URL | `http://localhost:11434` |
| `OLLAMA_MODEL` | Model name to use | `llama3.2` |
| `SCRAPER_URL` | Python scraper URL | `http://localhost:8085` |
| `BULLETPOINTS_PATH` | Path to bulletpoints.json | `../data/bulletpoints.json` |

### Frontend

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API base URL (must be public in production) |
| `MY_EMAIL` | Gmail address for contact form |
| `MY_PASSWORD` | Gmail app password (not your login password) |
| `NODE_ENV` | `development` or `production` |

### Scraper

| Variable | Description | Default |
|---|---|---|
| `PYTHON_SCRAPER_PORT` | Port to listen on | `8085` |

---

## Updating the app

```bash
git pull
docker-compose -f docker-compose.prod.yml up -d --build
```

Only changed services are rebuilt.

---

## Swapping the LLM

The LLM is abstracted behind `callLLM()` in `backend/src/services/company_form_data_api.go`. To switch models:

- **Different Ollama model**: `ollama pull mistral` then set `OLLAMA_MODEL=mistral` in `.env`
- **Gemini (hosted)**: replace `callLLM` with the Gemini HTTP call (see git history)
- **OpenAI**: same pattern — update the URL, auth header, and response struct
