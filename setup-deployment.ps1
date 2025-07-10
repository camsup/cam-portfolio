# Personal Homepage Deployment Script for Windows
# Run this after creating your GitHub repository

Write-Host "🚀 Setting up your personal homepage for deployment..." -ForegroundColor Green

# Check if Git is installed
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git is not installed. Please install Git first:" -ForegroundColor Red
    Write-Host "   Download from: https://git-scm.com/download/windows" -ForegroundColor Yellow
    exit 1
}

# Get repository information
$username = Read-Host "Enter your GitHub username"
$repo_name = Read-Host "Enter your repository name"
$domain = Read-Host "Enter your custom domain (optional, press Enter to skip)"

# Update vite.config.ts with repository name
$viteConfig = Get-Content "vite.config.ts" -Raw
$viteConfig = $viteConfig -replace "// base: '/your-repo-name/',", "base: '/$repo_name/',"
Set-Content "vite.config.ts" -Value $viteConfig

# Update CNAME file if domain provided
if ($domain) {
    Set-Content "public/CNAME" -Value $domain
    Write-Host "✅ CNAME file updated with: $domain" -ForegroundColor Green
} else {
    if (Test-Path "public/CNAME") {
        Remove-Item "public/CNAME"
    }
    Write-Host "ℹ️  No custom domain specified" -ForegroundColor Blue
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
npm install

# Initialize git repository
Write-Host "🔧 Initializing Git repository..." -ForegroundColor Blue
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - Personal homepage"

# Add remote origin
git remote add origin "https://github.com/$username/$repo_name.git"

# Push to GitHub
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Blue
git branch -M main
git push -u origin main

Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to https://github.com/$username/$repo_name/settings/pages"
Write-Host "2. Under 'Source', select 'Deploy from a branch'"
Write-Host "3. Select 'main' branch and '/ (root)' folder"
Write-Host "4. Click Save"
Write-Host ""
Write-Host "Your site will be available at:" -ForegroundColor Cyan
Write-Host "📍 https://$username.github.io/$repo_name/"
if ($domain) {
    Write-Host "📍 https://$domain (after DNS setup)"
}
Write-Host ""
Write-Host "To deploy updates:" -ForegroundColor Yellow
Write-Host "npm run deploy"
