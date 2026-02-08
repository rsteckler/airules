# Deploying Airules

The app is a single service: the **server** serves the API and, in production, the built **client** (so you run one process). Easiest options: **Docker on a VM** (DigitalOcean droplet or AWS EC2/Lightsail).

## Prerequisites

- Git
- Docker (on a VM), or Node 18+ and pnpm (for non-Docker)

---

## Option 1: DigitalOcean Droplet (simplest)

1. **Create a droplet**
   - Ubuntu 22.04, basic plan (e.g. $6/mo).
   - Add your SSH key.

2. **SSH in and install Docker**
   ```bash
   ssh root@YOUR_DROPLET_IP
   apt update && apt install -y docker.io
   ```

3. **Run the app**
   ```bash
   docker run -d --restart unless-stopped -p 80:3000 --name airules \
     ghcr.io/YOUR_ORG/airules:latest
   ```
   To use port 3000 instead of 80: `-p 3000:3000`. To build the image on the droplet instead of using a registry:
   ```bash
   git clone https://github.com/YOUR_ORG/airules.git && cd airules
   docker build -t airules .
   docker run -d --restart unless-stopped -p 80:3000 --name airules airules
   ```

4. **Open** `http://YOUR_DROPLET_IP` in a browser.

**Optional:** Put Nginx (or Caddy) in front for TLS and a domain: point a domain at the droplet, install Caddy, proxy to `localhost:3000`, and use Caddy’s automatic HTTPS.

---

## Option 2: AWS (EC2 or Lightsail)

**EC2**

1. Launch an Ubuntu 22.04 instance (e.g. t3.micro), open port 80 (and 22 for SSH) in the security group.
2. SSH in, install Docker, then build and run as in the DigitalOcean steps above (clone repo, `docker build`, `docker run -d -p 80:3000 ...`).

**Lightsail**

1. Create a Lightsail container service, or a Linux instance.
2. For a **container**: connect your GitHub repo, use the repo’s Dockerfile, set port 3000, deploy.
3. For a **Linux instance**: same as EC2 — SSH in, install Docker, clone, build, and run the image.

**Optional:** Use **Application Load Balancer** (or Lightsail LB) and HTTPS with ACM for a custom domain.

---

## Building the Docker image

From the repo root:

```bash
docker build -t airules .
docker run -p 3000:3000 airules
```

Then open `http://localhost:3000`.

---

## Non-Docker: run on a VM with Node

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/YOUR_ORG/airules.git && cd airules
   pnpm install
   ```

2. Build the client (same-origin API):
   ```bash
   VITE_API_URL= pnpm --filter airules-client run build
   ```

3. Run the server and serve the client:
   ```bash
   SERVED_CLIENT_PATH=./client/dist PORT=3000 pnpm --filter airules-server start
   ```

4. Use a process manager (e.g. systemd or PM2) and, if needed, Nginx/Caddy in front for TLS.

---

## Environment variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default `3000`) |
| `SERVED_CLIENT_PATH` | Path to built client to serve (optional; used in Docker and single-server deploy) |
| `CORS_ORIGIN` | Allowed origin for CORS (default allows all; set in production if needed) |

---

## Pushing the image to a registry

**GitHub Container Registry (ghcr.io):**
```bash
docker build -t ghcr.io/YOUR_ORG/airules:latest .
docker push ghcr.io/YOUR_ORG/airules:latest
```

Then on the droplet/EC2: `docker pull ghcr.io/YOUR_ORG/airules:latest` and run as above.
