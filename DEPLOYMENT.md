# Boostr Netwave Solutions — Deployment Guide for DevOps Engineer
**Project:** Boostr Netwave Solutions  
**Stack:** React (Vite) + Node.js (Express) + MongoDB Atlas  
**GitHub Repo:** https://github.com/BoostrNetWave/Boostr-Netwave-Solutions-New-Site  
**Live Domain:** boostrnetwave.com

---

## Architecture Overview

```
Internet
   │
   ▼
Nginx (port 80/443)          ← Handles SSL, serves frontend, proxies API
   ├── /api/*  ──────────────► Node.js Backend (port 5000, managed by PM2)
   │                              └── MongoDB Atlas (cloud database)
   └── /*      ──────────────► React Frontend (static files in client/dist/)
```

**Key Points:**
- Frontend and Backend live on the **same server, same domain**
- Frontend is a **pre-built static React app** served by Nginx
- Backend is a **Node.js/Express API** that manages all data
- Database is **MongoDB Atlas** (cloud-hosted, no DB setup needed on the server)
- All content (services, products, blogs, team, etc.) is managed via the admin panel at `/admin`

---

## Server Requirements

| Requirement | Minimum |
|-------------|---------|
| OS | Ubuntu 22.04 LTS (recommended) |
| RAM | 1 GB |
| CPU | 1 vCPU |
| Disk | 20 GB |
| Node.js | v20 or higher |
| Open Ports | 22 (SSH), 80 (HTTP), 443 (HTTPS) |

---

## Environment Variables

Before deploying, create the file `server/.env` with these values.  
A template exists at `server/.env.example` — copy it and fill in the values below.

### REQUIRED — Server will REFUSE to start without these:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Must be `production` | `production` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/boostr-netwave` |
| `JWT_SECRET` | Random 64-char secret for auth tokens. Generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` | `a3f9...` |
| `CLIENT_ORIGIN` | The full domain URL of the frontend (no trailing slash) | `https://boostrnetwave.com` |

### OPTIONAL — Features degrade gracefully without these (no crash):

| Variable | Description |
|----------|-------------|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (for image uploads in admin panel) |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `RESEND_API_KEY` | Resend.com API key (for contact form and job application emails) |
| `CONTACT_ALERT_EMAIL` | Email address where contact form submissions are sent |
| `EMAIL_FROM` | Sender name/email for outgoing emails (e.g. `"Boostr Netwave" <hello@boostrnetwave.com>`) |
| `VERCEL_DEPLOY_HOOK_URL` | **Leave this EMPTY** — only needed if frontend is on Vercel separately. On this server, it is not needed. |
| `PORT` | Defaults to `5000` — do not change unless you also update nginx.conf |

### Complete `server/.env` for production:
```
NODE_ENV=production
PORT=5000
APP_NAME=Boostr Netwave Solutions API

MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASS@YOUR_CLUSTER.mongodb.net/boostr-netwave?retryWrites=true&w=majority
JWT_SECRET=GENERATE_A_64_CHAR_HEX_STRING_HERE
JWT_EXPIRES_IN=7d

CLIENT_ORIGIN=https://boostrnetwave.com

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RESEND_API_KEY=re_your_api_key
CONTACT_ALERT_EMAIL=contact@boostrnetwave.com
EMAIL_FROM="Boostr Netwave" <hello@boostrnetwave.com>
```

---

## Step-by-Step Deployment (Fresh Ubuntu 22.04 Server)

### Step 1 — Install System Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js v20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx (web server / reverse proxy)
sudo apt install -y nginx

# Install PM2 (keeps Node.js running in background, auto-restarts on crash/reboot)
sudo npm install -g pm2

# Install Certbot (free SSL certificates from Let's Encrypt)
sudo apt install -y certbot python3-certbot-nginx

# Verify versions
node -v   # Should be v20+
nginx -v
pm2 -v
```

### Step 2 — Clone the Repository
```bash
# Create the web directory
sudo mkdir -p /var/www/boostrnetwave
sudo chown $USER:$USER /var/www/boostrnetwave

# Clone the project
cd /var/www
git clone https://github.com/BoostrNetWave/Boostr-Netwave-Solutions-New-Site.git boostrnetwave
cd boostrnetwave
```

### Step 3 — Set Up Backend Environment
```bash
# Go into server directory
cd /var/www/boostrnetwave/server

# Install production dependencies only
npm install --omit=dev

# Create the .env file from the example
cp .env.example .env

# Edit the .env file and fill in all the REQUIRED values from the table above
nano .env
```

### Step 4 — Build the Frontend
```bash
# Go to client directory
cd /var/www/boostrnetwave/client

# Install all dependencies
npm install

# Build the production static files
# IMPORTANT: VITE_API_URL is left EMPTY here on purpose.
# Because frontend and backend are on the SAME server and domain,
# Nginx will proxy /api/* to Node automatically. No absolute URL needed.
VITE_API_URL="" npm run build

# After this command finishes, all frontend files will be in client/dist/
# You should see: dist/index.html, dist/sitemap.xml, dist/robots.txt, dist/404.html
ls dist/
```

### Step 5 — Start the Backend with PM2
```bash
# Go back to project root
cd /var/www/boostrnetwave

# Start the backend using the PM2 config file included in the repo
pm2 start ecosystem.config.cjs --env production

# Save PM2 process list so it survives server reboots
pm2 save

# Auto-start PM2 on server reboot (run the command it prints after this)
pm2 startup

# Check it is running
pm2 status
pm2 logs boostrnetwave-api --lines 20

# Quick health check (database should say "connected")
curl http://localhost:5000/api/health
```

### Step 6 — Configure Nginx
```bash
# Copy the Nginx config file included in the repo
sudo cp /var/www/boostrnetwave/nginx.conf /etc/nginx/sites-available/boostrnetwave.com

# Enable the site
sudo ln -s /etc/nginx/sites-available/boostrnetwave.com /etc/nginx/sites-enabled/

# Remove the default Nginx page
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx config for syntax errors (must say "test is successful")
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 7 — Set Up SSL (Free HTTPS)
```bash
# Get SSL certificate (requires domain DNS pointing to this server's IP first)
sudo certbot --nginx -d boostrnetwave.com -d www.boostrnetwave.com

# Follow the prompts — certbot automatically updates Nginx with SSL
# Certificates auto-renew every 90 days
```

### Step 8 — Create the First Admin User
```bash
# The FIRST registration is open (no auth needed).
# After the first admin is created, registration is permanently locked automatically.

curl -X POST https://boostrnetwave.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin Name","email":"admin@boostrnetwave.com","password":"StrongPassword123"}'

# Admin panel is then accessible at: https://boostrnetwave.com/admin
```

---

## API Routes Reference (for verification)

### Public Routes — No auth needed
```
GET  /api/health              → Server health check
GET  /api/services            → All services
GET  /api/services/:slug      → Single service
GET  /api/products            → All products
GET  /api/products/:slug      → Single product
GET  /api/blog                → Published blog posts
GET  /api/blog/:slug          → Single blog post
GET  /api/careers             → Active job listings
GET  /api/careers/:slug       → Single job listing
GET  /api/team                → Team members
GET  /api/clients             → Client logos
GET  /api/testimonials        → Testimonials
GET  /api/gallery             → Gallery images
GET  /api/client-projects     → Case studies
GET  /api/settings            → Public site settings

POST /api/contact             → Contact form submission (rate limited)
POST /api/applications        → Job application submission (rate limited)
POST /api/auth/login          → Admin login
```

### Admin Routes — JWT auth required (login first)
```
GET    /api/auth/me                 → Get logged-in user
POST   /api/auth/logout             → Log out

GET    /api/blog/admin/all          → All posts including drafts
POST   /api/blog                    → Create blog post
PATCH  /api/blog/:id                → Update blog post
DELETE /api/blog/:id                → Delete blog post

POST   /api/services                → Create service
PATCH  /api/services/:id            → Update service
DELETE /api/services/:id            → Delete service

POST   /api/products                → Create product
PATCH  /api/products/:id            → Update product
DELETE /api/products/:id            → Delete product

POST   /api/team                    → Add team member
PUT    /api/team/:id                → Update team member
DELETE /api/team/:id                → Delete team member (superadmin only)

GET    /api/careers/admin/all       → All jobs including inactive
POST   /api/careers                 → Create job listing
PATCH  /api/careers/:id             → Update job listing
DELETE /api/careers/:id             → Delete job listing

GET    /api/contact                 → View contact submissions
PATCH  /api/contact/:id             → Update lead status

GET    /api/applications            → View job applications
PATCH  /api/applications/:id        → Update application status

GET    /api/settings/admin          → All site settings
PUT    /api/settings/bulk           → Bulk update settings
PUT    /api/settings/:key           → Update single setting

POST   /api/upload                  → Upload image to Cloudinary (auth required)
```

---

## Post-Deployment Verification Checklist

```bash
# 1. Backend health (database should say "connected")
curl https://boostrnetwave.com/api/health

# 2. Frontend loads
curl -I https://boostrnetwave.com

# 3. Sitemap accessible
curl https://boostrnetwave.com/sitemap.xml

# 4. robots.txt accessible
curl https://boostrnetwave.com/robots.txt

# 5. PM2 shows backend as "online"
pm2 status

# 6. Nginx running
sudo systemctl status nginx
```

---

## Ongoing Maintenance

### Deploy a code update
```bash
cd /var/www/boostrnetwave
git pull origin main

# Restart backend if server code changed
cd server && npm install --omit=dev && cd ..
pm2 restart boostrnetwave-api

# Rebuild frontend if client code changed
cd client && npm install && VITE_API_URL="" npm run build && cd ..
# Nginx picks up new files from dist/ automatically
```

### View logs
```bash
pm2 logs boostrnetwave-api          # Live backend logs
pm2 logs boostrnetwave-api --lines 50
```

### SSL certificate status
```bash
sudo certbot certificates
sudo certbot renew --dry-run    # Test auto-renewal
```
