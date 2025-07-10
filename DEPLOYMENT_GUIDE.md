# Deploy Your Personal Homepage to GitHub Pages

## Prerequisites Setup

### 1. Install Git (if not already installed)
- Download Git from: https://git-scm.com/download/windows
- Install with default settings
- Restart your terminal/VS Code after installation

### 2. Create GitHub Account
- Go to https://github.com
- Sign up for a free account if you don't have one

## Step 1: Prepare Your Site for Deployment

### Update Vite Config for GitHub Pages

Your `vite.config.ts` needs to be updated for GitHub Pages deployment:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/', // Replace with your actual repo name
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
```

### Update Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  },
  "devDependencies": {
    // ... existing dependencies
    "gh-pages": "^6.0.0"
  }
}
```

## Step 2: Create GitHub Repository

### Option A: Via GitHub Web Interface (Recommended)
1. Go to https://github.com/new
2. Repository name: `your-name-portfolio` (or similar)
3. Make it **Public** (required for free GitHub Pages)
4. Don't initialize with README (we'll add our own)
5. Click "Create repository"

### Option B: Via GitHub CLI (if installed)
```bash
gh repo create your-name-portfolio --public
```

## Step 3: Connect Local Project to GitHub

### Open Terminal in Your Project Folder
```bash
# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Personal homepage"

# Add your GitHub repository as origin
git remote add origin https://github.com/YOUR-USERNAME/your-repo-name.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **Deploy from a branch**
5. Select **main** branch and **/ (root)** folder
6. Click **Save**

## Step 5: Install GitHub Pages Deployment

### Install gh-pages package
```bash
npm install --save-dev gh-pages
```

### Update vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/', // Important: Use your actual repo name
})
```

### Add deployment script to package.json
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

## Step 6: Deploy Your Site

### Build and Deploy
```bash
npm run build
npm run deploy
```

This will:
1. Build your React app
2. Create a `gh-pages` branch
3. Push the built files to GitHub Pages

## Step 7: Connect Your Custom Domain

### Option A: Add Domain via GitHub Settings
1. Go to repository **Settings** → **Pages**
2. Under **Custom domain**, enter your domain: `yourdomain.com`
3. Click **Save**
4. GitHub will create a `CNAME` file in your repo

### Option B: Add CNAME File Manually
Create a file named `CNAME` in your `public` folder:
```
yourdomain.com
```

## Step 8: Configure Your Domain DNS

### At Your Domain Provider (GoDaddy, Namecheap, etc.)
Add these DNS records:

**For Apex Domain (yourdomain.com):**
```
Type: A
Name: @
Value: 185.199.108.153

Type: A  
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153
```

**For WWW Subdomain:**
```
Type: CNAME
Name: www
Value: yourdomain.com
```

### DNS Propagation
- Changes can take 24-48 hours to propagate
- Check status at: https://www.whatsmydns.net/

## Step 9: Enable HTTPS (Recommended)

1. Go to repository **Settings** → **Pages**
2. Check **Enforce HTTPS**
3. Wait for SSL certificate to be issued (can take a few minutes)

## Alternative: One-Click Deployment

### Option A: Netlify (Easier)
1. Go to https://netlify.com
2. Drag your project folder to Netlify
3. Connect your custom domain
4. Automatic deployments from GitHub

### Option B: Vercel
1. Go to https://vercel.com
2. Connect your GitHub repository
3. Add your custom domain
4. Automatic deployments

## Quick Commands Summary

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main

# Deploy updates
npm run build
npm run deploy

# Or simple git push (if using GitHub Actions)
git add .
git commit -m "Update site"
git push
```

## Your Site URLs

- **GitHub Pages**: `https://yourusername.github.io/your-repo-name/`
- **Custom Domain**: `https://yourdomain.com`

## Troubleshooting

### Common Issues:
1. **404 Error**: Check the `base` path in `vite.config.ts`
2. **CSS/JS Not Loading**: Ensure correct base path
3. **Domain Not Working**: Check DNS settings and propagation
4. **Build Fails**: Check for TypeScript errors

### Check Deployment Status:
- Repository → **Actions** tab
- Repository → **Settings** → **Pages**

## Next Steps

1. Install Git if needed
2. Create GitHub repository
3. Update vite.config.ts with your repo name
4. Follow the deployment steps
5. Configure your domain DNS
6. Enable HTTPS

Your site will be live at both your GitHub Pages URL and your custom domain!
