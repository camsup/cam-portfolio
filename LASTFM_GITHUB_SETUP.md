# 🔧 Last.fm API Fix & GitHub Deployment Guide

## 🎵 Fixing Last.fm API Issues

### 1. Get a New Last.fm API Key

1. **Go to Last.fm API**: https://www.last.fm/api/account/create
2. **Sign in** with your Last.fm account
3. **Create a new application**:
   - Application name: `CAM Portfolio`
   - Description: `Personal portfolio website`
   - Homepage URL: `https://your-github-username.github.io/your-repo-name/`
   - Callback URL: `https://your-github-username.github.io/your-repo-name/`
4. **Copy your API key** (it looks like: `1234567890abcdef1234567890abcdef`)

### 2. Set Up Environment Variables

1. **Create `.env` file** in your project root:
   ```bash
   cp env.template .env
   ```

2. **Edit `.env` file** with your actual values:
   ```env
   VITE_LASTFM_API_KEY=your_actual_api_key_here
   VITE_LASTFM_USERNAME=your_lastfm_username_here
   ```

3. **Test the API**:
   ```bash
   npm run dev
   ```
   Open browser console to see debug messages

### 3. Troubleshooting Last.fm Issues

#### If API calls fail:
- ✅ Check your API key is correct
- ✅ Verify your Last.fm username exists
- ✅ Make sure you've scrobbled some tracks recently
- ✅ Check browser console for error messages

#### Common Error Codes:
- `6` - Invalid API key
- `17` - User not found
- `26` - Suspended API key

## 🚀 Deploying to GitHub

### 1. Create GitHub Repository

1. **Go to GitHub**: https://github.com/new
2. **Create new repository**:
   - Repository name: `cam-portfolio` (or your preferred name)
   - Make it **Public** (required for free GitHub Pages)
   - Don't initialize with README (we already have one)

### 2. Connect Your Local Project

1. **Initialize git** (if not already done):
   ```bash
   git init
   ```

2. **Add your GitHub repository as remote**:
   ```bash
   git remote add origin https://github.com/your-username/your-repo-name.git
   ```

3. **Add and commit your files**:
   ```bash
   git add .
   git commit -m "Initial commit - CAM Portfolio"
   ```

4. **Push to GitHub**:
   ```bash
   git push -u origin main
   ```

### 3. Deploy to GitHub Pages

#### Option A: Use the Deployment Script
```bash
node deploy-to-github.js
```

#### Option B: Manual Deployment
```bash
# Install gh-pages if not already installed
npm install --save-dev gh-pages

# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### 4. Configure GitHub Pages

1. **Go to your repository** on GitHub
2. **Click Settings** tab
3. **Scroll down to Pages** section
4. **Set source** to "Deploy from a branch"
5. **Select branch**: `gh-pages`
6. **Click Save**

### 5. Set Up GitHub Secrets (Optional)

For automatic deployments, you can set up GitHub Actions:

1. **Go to repository Settings > Secrets and variables > Actions**
2. **Add repository secrets**:
   - `LASTFM_API_KEY`: Your Last.fm API key
   - `LASTFM_USERNAME`: Your Last.fm username

## 🔍 Testing Your Setup

### 1. Test Last.fm API Locally
```bash
npm run dev
```
- Open browser console
- Look for `[Last.fm]` debug messages
- Check if track data appears

### 2. Test GitHub Pages
- Wait 5-10 minutes after deployment
- Visit: `https://your-username.github.io/your-repo-name/`
- Check if Last.fm data loads

## 🛠️ Quick Commands

### Install Dependencies
```bash
npm install
```

### Start Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Deploy to GitHub
```bash
node deploy-to-github.js
```

### Check Git Status
```bash
git status
```

## 🚨 Common Issues & Solutions

### Last.fm API Not Working
1. **Check API key**: Make sure it's the correct key from Last.fm
2. **Check username**: Verify your Last.fm username is correct
3. **Check scrobbling**: Make sure you've played music recently
4. **Check console**: Look for error messages in browser console

### GitHub Pages Not Working
1. **Check repository**: Make sure it's public
2. **Check branch**: Ensure gh-pages branch exists
3. **Check settings**: Verify Pages source is set correctly
4. **Wait**: GitHub Pages can take 5-10 minutes to deploy

### Build Errors
1. **Clear cache**: `npm cache clean --force`
2. **Reinstall**: `rm -rf node_modules && npm install`
3. **Check TypeScript**: `npm run type-check`

## 📱 Mobile Testing

After deployment, test on:
- ✅ Desktop browsers
- ✅ Mobile browsers
- ✅ Different screen sizes
- ✅ Touch interactions

## 🎉 Success Checklist

- [ ] Last.fm API key obtained and configured
- [ ] Environment variables set up correctly
- [ ] Local development working
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] GitHub Pages deployed
- [ ] Website accessible online
- [ ] Last.fm data showing on live site

## 🔄 Updates

To update your deployed site:
```bash
# Make your changes
git add .
git commit -m "Update description"
git push origin main

# Deploy updates
node deploy-to-github.js
```

Your website should now be live with working Last.fm integration! 🎉 